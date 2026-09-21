#!/usr/bin/env bash
# Manual human/admin transport for the isolated threads.publish.live capability.

set -euo pipefail

usage() {
  cat >&2 <<'EOF'
Usage: live-publish-client.sh \
  --account-id ID --content-id ID --expected-version N \
  --expected-content-hash SHA256 --expected-handle HANDLE \
  --actor HUMAN --request-id UUID --live-confirmation TEXT

The live admin key is never accepted as an argument or environment variable.
It is read without echo from a terminal, or from stdin for controlled testing.
EOF
}

die() {
  printf 'live-publish-client: %s\n' "$1" >&2
  exit "${2:-2}"
}

account_id=""
content_id=""
expected_version=""
expected_content_hash=""
expected_handle=""
actor=""
request_id=""
live_confirmation=""

while (($#)); do
  case "$1" in
    --account-id) account_id=${2-}; shift 2 ;;
    --content-id) content_id=${2-}; shift 2 ;;
    --expected-version) expected_version=${2-}; shift 2 ;;
    --expected-content-hash) expected_content_hash=${2-}; shift 2 ;;
    --expected-handle) expected_handle=${2-}; shift 2 ;;
    --actor) actor=${2-}; shift 2 ;;
    --request-id) request_id=${2-}; shift 2 ;;
    --live-confirmation) live_confirmation=${2-}; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) die "unknown argument: $1" ;;
  esac
done

[[ -n "$account_id" ]] || die "--account-id is required"
[[ -n "$content_id" ]] || die "--content-id is required"
[[ "$expected_version" =~ ^[1-9][0-9]*$ ]] || die "--expected-version must be positive"
[[ "$expected_content_hash" =~ ^[0-9a-fA-F]{64}$ ]] || die "--expected-content-hash must be SHA-256"
[[ -n "$expected_handle" ]] || die "--expected-handle is required"
[[ -n "$actor" ]] || die "--actor is required"
[[ -n "$request_id" ]] || die "--request-id is required"
[[ -n "$live_confirmation" ]] || die "--live-confirmation is required"

lower_actor=${actor,,}
case "$lower_actor" in
  *-executor*|*-selector*|*-orchestrator*|*-scheduler*|*heartbeat*|*autopilot*|*agent-loop*)
    die "automation/scheduler actors cannot use the live client"
    ;;
esac

bridge_url=${THREADS_BRIDGE_URL:-http://127.0.0.1:8765}
case "$bridge_url" in
  http://127.0.0.1:*|http://localhost:*) ;;
  *) die "live publishing is restricted to a local HTTP Bridge" ;;
esac

if [[ -t 0 ]]; then
  IFS= read -r -s -p "Live admin key: " live_admin_key </dev/tty
  printf '\n' >&2
else
  IFS= read -r live_admin_key || die "live admin key is required on stdin"
fi
[[ ${#live_admin_key} -ge 32 ]] || die "live admin key is invalid"
[[ "$live_admin_key" != *$'\r'* && "$live_admin_key" != *$'\n'* ]] \
  || die "live admin key is invalid"

if command -v python3 >/dev/null 2>&1; then
  python_bin=python3
elif command -v python >/dev/null 2>&1; then
  python_bin=python
else
  die "python3 or python is required"
fi

request_file=$(mktemp "${TMPDIR:-/tmp}/live-publish-request.XXXXXX")
response_file=$(mktemp "${TMPDIR:-/tmp}/live-publish-response.XXXXXX")
cleanup() {
  unset live_admin_key curl_config
  rm -f -- "$request_file" "$response_file"
}
trap cleanup EXIT
chmod 600 "$request_file" "$response_file" 2>/dev/null || true

"$python_bin" - "$account_id" "$content_id" "$expected_version" \
  "$expected_content_hash" "$expected_handle" "$actor" "$request_id" \
  "$live_confirmation" >"$request_file" <<'PY'
import json
import sys

(account_id, content_id, version, content_hash, handle, actor,
 request_id, confirmation) = sys.argv[1:]
json.dump({
    "account_id": account_id,
    "content_id": content_id,
    "expected_version": int(version),
    "expected_content_hash": content_hash,
    "expected_handle": handle,
    "actor": actor,
    "request_id": request_id,
    "live_confirmation": confirmation,
    "mode": "live",
}, sys.stdout, ensure_ascii=True, separators=(",", ":"))
PY

# Feed sensitive headers through curl's stdin config.  They never appear in the
# process argument list or a temporary file.
escape_config() {
  local value=$1
  value=${value//\\/\\\\}
  value=${value//\"/\\\"}
  printf '%s' "$value"
}
curl_config="header = \"X-Threads-Live-Admin-Key: $(escape_config "$live_admin_key")\""
if [[ -n "${THREADS_BRIDGE_API_KEY:-}" ]]; then
  curl_config+=$'\n'"header = \"Authorization: Bearer $(escape_config "$THREADS_BRIDGE_API_KEY")\""
fi

set +e
http_code=$(
  printf '%s\n' "$curl_config" | curl --silent --show-error --retry 0 \
    --connect-timeout "${THREADS_BRIDGE_CONNECT_TIMEOUT_SEC:-3}" \
    --max-time "${THREADS_BRIDGE_TIMEOUT_SEC:-30}" \
    --config - --request POST "${bridge_url}/autopilot/v2/publish/live" \
    --header 'Content-Type: application/json' \
    --data-binary "@${request_file}" --output "$response_file" \
    --write-out '%{http_code}'
)
curl_status=$?
set -e
unset live_admin_key curl_config

if ((curl_status != 0)); then
  die "Bridge transport failed; do not resend this request_id" 1
fi
if [[ ! "$http_code" =~ ^2[0-9][0-9]$ ]]; then
  printf 'live-publish-client: Bridge returned HTTP %s; do not resend an ambiguous request\n' \
    "$http_code" >&2
  "$python_bin" - "$response_file" <<'PY' >&2
import json, sys
try:
    value = json.load(open(sys.argv[1], encoding="utf-8"))
    detail = value.get("detail") if isinstance(value, dict) else None
    if isinstance(detail, dict):
        print(json.dumps({"code": detail.get("code"), "blocking": detail.get("blocking", [])}, separators=(",", ":")))
except Exception:
    pass
PY
  exit 1
fi

"$python_bin" - "$response_file" <<'PY'
import json, sys
value = json.load(open(sys.argv[1], encoding="utf-8"))
required = {
    "status", "capability", "request_id", "account_id", "content_id",
    "version", "content_hash", "mode", "publication_id", "duplicate",
    "workflow_state", "approval_state", "parts_state", "attempts",
    "requires_human", "warnings", "error",
}
if not isinstance(value, dict) or not required.issubset(value):
    raise SystemExit("invalid Bridge response")
if value.get("capability") != "threads.publish.live" or value.get("mode") != "live":
    raise SystemExit("unexpected Bridge capability response")
print(json.dumps(value, ensure_ascii=False, separators=(",", ":")))
PY
