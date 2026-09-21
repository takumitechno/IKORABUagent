#!/usr/bin/env bash
# Generic Control Plane -> Data Plane capability transport.

set -euo pipefail

usage() {
  cat >&2 <<'EOF'
Usage: capability-client.sh --capability CAPABILITY --account-id ID [options]

Options:
  --agent-id SLUG       Forwarded as the read-only actor context.
  --request-id ID       Preserve a caller-provided correlation ID.
  --topic TEXT          Optional production planning topic for content preview.
  --content-role ROLE   Optional reach/trust/desire/conversion override.
  --content-id ID       Content identifier for approval capabilities.
  --expected-version N  Exact content version required for approval mutation.
  --expected-content-hash SHA256
                        Exact content hash required for approval mutation.
  --reason TEXT         Rejection reason (required for reject).
  --human-feedback TEXT Human editorial feedback for content revision.
  --confirm-human       Assert this command is a direct human decision.
  --dry-run             Required for threads.publish (live is not exposed).
  -h, --help            Show this help.
EOF
}

die() {
  printf 'capability-client: %s\n' "$1" >&2
  exit "${2:-2}"
}

capability=""
account_id=""
agent_id=""
request_id=""
topic=""
content_role=""
content_id=""
expected_version=""
expected_content_hash=""
reason=""
human_feedback=""
confirm_human="false"
dry_run="false"

while (($#)); do
  case "$1" in
    --capability)
      (($# >= 2)) || die "--capability requires a value"
      capability=$2
      shift 2
      ;;
    --account-id)
      (($# >= 2)) || die "--account-id requires a value"
      account_id=$2
      shift 2
      ;;
    --agent-id)
      (($# >= 2)) || die "--agent-id requires a value"
      agent_id=$2
      shift 2
      ;;
    --request-id)
      (($# >= 2)) || die "--request-id requires a value"
      request_id=$2
      shift 2
      ;;
    --topic)
      (($# >= 2)) || die "--topic requires a value"
      topic=$2
      shift 2
      ;;
    --content-role)
      (($# >= 2)) || die "--content-role requires a value"
      content_role=$2
      shift 2
      ;;
    --content-id)
      (($# >= 2)) || die "--content-id requires a value"
      content_id=$2
      shift 2
      ;;
    --expected-version)
      (($# >= 2)) || die "--expected-version requires a value"
      expected_version=$2
      shift 2
      ;;
    --expected-content-hash)
      (($# >= 2)) || die "--expected-content-hash requires a value"
      expected_content_hash=$2
      shift 2
      ;;
    --reason)
      (($# >= 2)) || die "--reason requires a value"
      reason=$2
      shift 2
      ;;
    --human-feedback)
      (($# >= 2)) || die "--human-feedback requires a value"
      human_feedback=$2
      shift 2
      ;;
    --confirm-human)
      confirm_human="true"
      shift
      ;;
    --dry-run)
      dry_run="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      die "unknown argument: $1"
      ;;
  esac
done

[[ -n "$capability" ]] || die "--capability is required"
case "$capability" in
  preflight|threads.content.preview|threads.content.generate|threads.content.revise|threads.approval.get|threads.approval.approve|threads.approval.reject|threads.safety.status|threads.publish) ;;
  *) die "unknown capability: $capability" ;;
esac
[[ -n "$account_id" ]] || die "--account-id is required"
if [[ "$capability" == "threads.content.generate" && -z "$agent_id" ]]; then
  die "--agent-id is required for threads.content.generate"
fi
if [[ "$capability" == "threads.content.generate" && ( -n "$topic" || -n "$content_role" ) ]]; then
  die "topic and content-role overrides are not allowed for threads.content.generate"
fi
if [[ "$capability" == threads.approval.* && -z "$content_id" ]]; then
  die "--content-id is required for approval capabilities"
fi
if [[ "$capability" == "threads.approval.approve" || "$capability" == "threads.approval.reject" ]]; then
  [[ -n "$agent_id" ]] || die "--agent-id is required for approval mutations"
  [[ -n "$request_id" ]] || die "--request-id is required for approval mutations"
  [[ "$expected_version" =~ ^[1-9][0-9]*$ ]] || die "--expected-version must be a positive integer"
  [[ "$expected_content_hash" =~ ^[0-9a-fA-F]{64}$ ]] || die "--expected-content-hash must be a 64-character SHA-256"
  [[ "$confirm_human" == "true" ]] || die "--confirm-human is required for approval mutations"
fi
if [[ "$capability" == "threads.approval.reject" && -z "$reason" ]]; then
  die "--reason is required for threads.approval.reject"
fi
if [[ "$capability" == "threads.content.revise" ]]; then
  [[ -n "$content_id" ]] || die "--content-id is required for threads.content.revise"
  [[ -n "$agent_id" ]] || die "--agent-id is required for threads.content.revise"
  [[ -n "$request_id" ]] || die "--request-id is required for threads.content.revise"
  [[ "$expected_version" =~ ^[1-9][0-9]*$ ]] || die "--expected-version must be a positive integer"
  [[ "$expected_content_hash" =~ ^[0-9a-fA-F]{64}$ ]] || die "--expected-content-hash must be a 64-character SHA-256"
  [[ -n "$human_feedback" ]] || die "--human-feedback is required for threads.content.revise"
  [[ "$confirm_human" == "true" ]] || die "--confirm-human is required for threads.content.revise"
fi
if [[ "$capability" == "threads.publish" ]]; then
  [[ -n "$content_id" ]] || die "--content-id is required for threads.publish"
  [[ -n "$agent_id" ]] || die "--agent-id is required for threads.publish"
  [[ -n "$request_id" ]] || die "--request-id is required for threads.publish"
  [[ "$expected_version" =~ ^[1-9][0-9]*$ ]] || die "--expected-version must be a positive integer"
  [[ "$expected_content_hash" =~ ^[0-9a-fA-F]{64}$ ]] || die "--expected-content-hash must be a 64-character SHA-256"
  [[ "$dry_run" == "true" ]] || die "--dry-run is required; live publish is not exposed"
fi
if [[ -n "$content_role" && ! "$content_role" =~ ^(reach|trust|desire|conversion)$ ]]; then
  die "--content-role must be reach, trust, desire, or conversion"
fi

if command -v python3 >/dev/null 2>&1; then
  python_bin=python3
elif command -v python >/dev/null 2>&1; then
  python_bin=python
else
  die "python3 or python is required for URL and JSON validation"
fi

bridge_url=${THREADS_BRIDGE_URL:-http://127.0.0.1:8000}
bridge_key=${THREADS_BRIDGE_API_KEY:-}
connect_timeout=${THREADS_BRIDGE_CONNECT_TIMEOUT_SEC:-3}
total_timeout=${THREADS_BRIDGE_TIMEOUT_SEC:-15}

url_info=$(
  "$python_bin" - "$bridge_url" <<'PY'
import sys
from urllib.parse import urlsplit, urlunsplit

raw = sys.argv[1].strip()
try:
    parsed = urlsplit(raw)
    _ = parsed.port
except ValueError:
    raise SystemExit(1)
if parsed.scheme not in {"http", "https"} or not parsed.hostname:
    raise SystemExit(1)
if parsed.username or parsed.password or parsed.query or parsed.fragment:
    raise SystemExit(1)
if parsed.path not in {"", "/"}:
    raise SystemExit(1)
host = parsed.hostname.lower()
is_local = host in {"127.0.0.1", "localhost", "::1"}
if not is_local and parsed.scheme != "https":
    raise SystemExit(1)
origin = urlunsplit((parsed.scheme, parsed.netloc, "", "", "")).rstrip("/")
print(origin + "\t" + ("local" if is_local else "remote"))
PY
) || die "THREADS_BRIDGE_URL must be a safe localhost HTTP or remote HTTPS origin"

bridge_url=${url_info%$'\t'*}
url_scope=${url_info##*$'\t'}
if [[ "$url_scope" == "remote" && -z "$bridge_key" ]]; then
  die "THREADS_BRIDGE_API_KEY is required for a non-localhost bridge"
fi

command -v curl >/dev/null 2>&1 || die "curl is required"
response_file=$(mktemp "${TMPDIR:-/tmp}/capability-client.XXXXXX")
request_file=$(mktemp "${TMPDIR:-/tmp}/capability-request.XXXXXX")
trap 'rm -f "$response_file" "$request_file"' EXIT

curl_args=(
  --silent --show-error
  --connect-timeout "$connect_timeout"
  --max-time "$total_timeout"
  --output "$response_file"
  --write-out '%{http_code}'
)
if [[ "$capability" == "preflight" || "$capability" == "threads.content.preview" || "$capability" == "threads.approval.get" || "$capability" == "threads.safety.status" ]]; then
  curl_args+=(--retry 1 --retry-connrefused --retry-delay 0)
fi
if [[ "$capability" == "preflight" ]]; then
  curl_args+=(--get "${bridge_url}/autopilot/v2/preflight")
  curl_args+=(--data-urlencode "account_id=${account_id}")
  [[ -z "$agent_id" ]] || curl_args+=(--data-urlencode "actor=${agent_id}")
  [[ -z "$request_id" ]] || curl_args+=(--data-urlencode "request_id=${request_id}")
elif [[ "$capability" == "threads.content.preview" ]]; then
  "$python_bin" - "$account_id" "$agent_id" "$request_id" "$topic" "$content_role" > "$request_file" <<'PY'
import json
import sys

account_id, actor, request_id, topic, content_role = sys.argv[1:]
payload = {"account_id": account_id, "dry_run": True}
for key, value in (
    ("actor", actor), ("request_id", request_id),
    ("topic", topic), ("content_role", content_role),
):
    if value:
        payload[key] = value
json.dump(payload, sys.stdout, ensure_ascii=True, separators=(",", ":"))
PY
  curl_args+=(
    --request POST "${bridge_url}/autopilot/v2/generate-preview"
    --header 'Content-Type: application/json'
    --data-binary "@${request_file}"
  )
elif [[ "$capability" == "threads.content.generate" ]]; then
  "$python_bin" - "$account_id" "$agent_id" "$request_id" > "$request_file" <<'PY'
import json
import sys

account_id, actor, request_id = sys.argv[1:]
payload = {"account_id": account_id, "actor": actor}
if request_id:
    payload["request_id"] = request_id
json.dump(payload, sys.stdout, ensure_ascii=False, separators=(",", ":"))
PY
  curl_args+=(
    --request POST "${bridge_url}/autopilot/v2/generate"
    --header 'Content-Type: application/json'
    --data-binary "@${request_file}"
  )
elif [[ "$capability" == "threads.approval.get" ]]; then
  curl_args+=(--get "${bridge_url}/autopilot/v2/approvals/${content_id}")
  curl_args+=(--data-urlencode "account_id=${account_id}")
  [[ -z "$request_id" ]] || curl_args+=(--data-urlencode "request_id=${request_id}")
elif [[ "$capability" == "threads.safety.status" ]]; then
  curl_args+=(--get "${bridge_url}/autopilot/v2/safety/status")
  curl_args+=(--data-urlencode "account_id=${account_id}")
  [[ -z "$content_id" ]] || curl_args+=(--data-urlencode "content_id=${content_id}")
  [[ -z "$request_id" ]] || curl_args+=(--data-urlencode "request_id=${request_id}")
elif [[ "$capability" == "threads.content.revise" ]]; then
  "$python_bin" - "$account_id" "$content_id" "$expected_version" "$expected_content_hash" "$human_feedback" "$agent_id" "$request_id" > "$request_file" <<'PY'
import json
import sys

account_id, content_id, version, content_hash, feedback, actor, request_id = sys.argv[1:]
payload = {
    "account_id": account_id,
    "content_id": content_id,
    "expected_version": int(version),
    "expected_content_hash": content_hash,
    "human_feedback": feedback,
    "actor": actor,
    "request_id": request_id,
    "human_confirmed": True,
}
json.dump(payload, sys.stdout, ensure_ascii=True, separators=(",", ":"))
PY
  curl_args+=(
    --request POST "${bridge_url}/autopilot/v2/contents/${content_id}/revise"
    --header 'Content-Type: application/json'
    --data-binary "@${request_file}"
  )
elif [[ "$capability" == "threads.publish" ]]; then
  "$python_bin" - "$account_id" "$content_id" "$expected_version" "$expected_content_hash" "$agent_id" "$request_id" > "$request_file" <<'PY'
import json
import sys

account_id, content_id, version, content_hash, actor, request_id = sys.argv[1:]
json.dump({
    "account_id": account_id,
    "content_id": content_id,
    "expected_version": int(version),
    "expected_content_hash": content_hash,
    "actor": actor,
    "request_id": request_id,
    "dry_run": True,
}, sys.stdout, ensure_ascii=True, separators=(",", ":"))
PY
  curl_args+=(
    --request POST "${bridge_url}/autopilot/v2/publish"
    --header 'Content-Type: application/json'
    --data-binary "@${request_file}"
  )
else
  "$python_bin" - "$account_id" "$content_id" "$expected_version" "$expected_content_hash" "$agent_id" "$request_id" "$reason" > "$request_file" <<'PY'
import json
import sys

account_id, content_id, version, content_hash, actor, request_id, reason = sys.argv[1:]
payload = {
    "account_id": account_id,
    "content_id": content_id,
    "expected_version": int(version),
    "expected_content_hash": content_hash,
    "actor": actor,
    "request_id": request_id,
    "human_confirmed": True,
}
if reason:
    payload["reason"] = reason
json.dump(payload, sys.stdout, ensure_ascii=False, separators=(",", ":"))
PY
  action=${capability##*.}
  curl_args+=(
    --request POST "${bridge_url}/autopilot/v2/approvals/${content_id}/${action}"
    --header 'Content-Type: application/json'
    --data-binary "@${request_file}"
  )
fi
[[ -z "$bridge_key" ]] || curl_args+=(--header "Authorization: Bearer ${bridge_key}")

# Automatic retry is deliberately confined to the allowlisted read-only capabilities.
set +e
http_code=$(curl "${curl_args[@]}")
curl_status=$?
set -e
if ((curl_status != 0)); then
  if [[ "$capability" == threads.content.* || "$capability" == threads.approval.* || "$capability" == threads.safety.* || "$capability" == "threads.publish" ]]; then
    printf '%s\n' '{"status":"error","data":null,"warnings":[],"provenance":{"transport":"capability-client"},"cost":{"estimated_usd":0,"currency":"USD","would_call_provider":false},"auditId":null,"error":{"code":"bridge_transport_error","message":"Bridge request failed"}}'
  fi
  die "bridge request failed" 1
fi
if [[ ! "$http_code" =~ ^2[0-9][0-9]$ ]]; then
  if [[ "$capability" == threads.content.* || "$capability" == threads.approval.* || "$capability" == threads.safety.* || "$capability" == "threads.publish" ]]; then
    "$python_bin" - "$http_code" <<'PY'
import json
import sys

code = sys.argv[1]
print(json.dumps({
    "status": "error", "data": None, "warnings": [],
    "provenance": {"transport": "capability-client"},
    "cost": {"estimated_usd": 0, "currency": "USD", "would_call_provider": False},
    "auditId": None,
    "error": {"code": "bridge_http_" + code, "message": "Bridge returned HTTP " + code},
}, separators=(",", ":")))
PY
  fi
  die "bridge returned HTTP ${http_code}" 1
fi
if (( $(wc -c < "$response_file") > 1048576 )); then
  die "bridge response exceeded 1 MiB" 1
fi
set +e
"$python_bin" - "$response_file" "$capability" <<'PY'
import json
import sys

with open(sys.argv[1], encoding="utf-8") as stream:
    value = json.load(stream)
if not isinstance(value, dict):
    raise SystemExit(1)
if sys.argv[2] == "preflight":
    required = {"status", "account_id", "capability", "request_id", "checks", "warnings", "error"}
elif sys.argv[2] == "threads.content.generate":
    required = {
        "status", "account_id", "capability", "request_id", "content_id",
        "version", "attempt", "attempt_count", "qa_verdict", "provider",
        "model", "estimated_cost_usd", "warnings", "cost", "error",
    }
elif sys.argv[2] == "threads.content.preview":
    required = {"status", "account_id", "capability", "request_id", "data", "warnings", "provenance", "cost", "auditId", "error"}
elif sys.argv[2] == "threads.content.revise":
    required = {
        "status", "capability", "request_id", "account_id",
        "source_content_id", "content_id", "version", "content_hash", "body",
        "qa", "workflow_state", "approval_state", "copy_guard", "provider",
        "model", "provider_call_count", "writer_attempt_count", "input_tokens",
        "output_tokens", "estimated_cost_usd", "warnings", "error",
    }
elif sys.argv[2] == "threads.approval.get":
    required = {
        "status", "capability", "request_id", "account_id", "content_id",
        "version", "topic", "content_role", "body", "content_hash", "qa", "workflow_state",
        "approval_state", "publishable", "warnings", "error",
    }
elif sys.argv[2] == "threads.safety.status":
    required = {
        "status", "capability", "request_id", "account_id", "account_status",
        "global_stop", "account_stop", "capability_stop", "approval_mode",
        "publish_readiness", "unresolved_ambiguous_publication",
        "rate_guard_ready", "rate_policy", "warnings", "error",
    }
elif sys.argv[2] == "threads.publish":
    required = {
        "status", "capability", "request_id", "account_id", "content_id",
        "version", "content_hash", "mode", "dry_run", "publication_id",
        "duplicate", "workflow_state", "approval_state", "parts_state",
        "attempts", "warnings", "error",
    }
else:
    required = {
        "status", "capability", "request_id", "account_id", "content_id",
        "version", "content_hash", "workflow_state", "approval_state",
        "actor", "warnings", "error",
    }
if not required.issubset(value):
    raise SystemExit(1)
PY
json_status=$?
set -e
if ((json_status != 0)); then
  if [[ "$capability" == threads.content.* || "$capability" == threads.approval.* || "$capability" == threads.safety.* || "$capability" == "threads.publish" ]]; then
    printf '%s\n' '{"status":"error","data":null,"warnings":[],"provenance":{"transport":"capability-client"},"cost":{"estimated_usd":0,"currency":"USD","would_call_provider":false},"auditId":null,"error":{"code":"invalid_bridge_json","message":"Bridge returned invalid JSON"}}'
  fi
  die "bridge returned invalid JSON" 1
fi

cat "$response_file"
