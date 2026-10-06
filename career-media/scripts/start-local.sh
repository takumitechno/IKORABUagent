#!/usr/bin/env bash
# 未経験転職メディア MVP をこの PC だけで閲覧できるように起動する（macOS / Linux）。
#   cd career-media && bash scripts/start-local.sh            # http://localhost:3000
#   PORT=3100 bash scripts/start-local.sh                      # ポートを変える
#   SKIP_BUILD=1 bash scripts/start-local.sh                   # 2回目以降、ビルドを省略
# 停止: Ctrl+C
# 127.0.0.1 にだけ bind するため、同じネットワークの他の端末やインターネットからは見えない。
set -euo pipefail
cd "$(dirname "$0")/.."

PORT="${PORT:-3000}"
URL="http://localhost:${PORT}"

if ! command -v node >/dev/null; then
  echo "Node.js が見つかりません。https://nodejs.org/ から LTS 版をインストールしてから再実行してください。" >&2
  exit 1
fi
if ! node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>20||(a===20&&b>=9)?0:1)'; then
  echo "Node.js $(node -v) は古すぎます。20.9 以上（LTS 推奨）に更新してください。" >&2
  exit 1
fi
if (exec 3<>"/dev/tcp/127.0.0.1/${PORT}") 2>/dev/null; then
  echo "ポート ${PORT} はすでに使われています。別のポートで起動する場合: PORT=3100 bash scripts/start-local.sh" >&2
  exit 1
fi

export NEXT_TELEMETRY_DISABLED=1
export NEXT_PUBLIC_SITE_URL="$URL"

if [ ! -f node_modules/.package-lock.json ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
  echo "[1/3] 依存パッケージをインストールしています（初回は数分かかります）..."
  npm ci
else
  echo "[1/3] 依存パッケージはインストール済みです"
fi

if [ "${SKIP_BUILD:-}" = "1" ] && [ -f .next/BUILD_ID ]; then
  echo "[2/3] ビルドを省略します（SKIP_BUILD=1）"
else
  echo "[2/3] 本番ビルドを作成しています..."
  npx next build
fi

echo "[3/3] ${URL} で起動します。停止するには Ctrl+C を押してください。"
npx next start -p "$PORT" -H 127.0.0.1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' INT TERM EXIT

for _ in $(seq 1 120); do
  if (exec 3<>"/dev/tcp/127.0.0.1/${PORT}") 2>/dev/null; then break; fi
  kill -0 "$SERVER_PID" 2>/dev/null || { echo "サーバーの起動に失敗しました" >&2; exit 1; }
  sleep 0.5
done

if [ "${NO_BROWSER:-}" != "1" ]; then
  if command -v open >/dev/null; then open "$URL/"; elif command -v xdg-open >/dev/null; then xdg-open "$URL/" >/dev/null 2>&1 || true; fi
fi
cat <<EOF

  トップ           ${URL}/
  条件整理チェック ${URL}/check
  職種比較         ${URL}/jobs
  記事一覧         ${URL}/articles
  ニュース解説     ${URL}/news

EOF
wait "$SERVER_PID"
