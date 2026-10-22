#!/usr/bin/env bash
# Fetch Noto Sans JP (SIL Open Font License) static weights used by the renderer.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p fonts
for w in 500 700 900; do
  url=$(curl -fsS "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${w}" -A "Mozilla/5.0" \
    | grep -o "https://fonts.gstatic.com[^)]*" | head -1)
  curl -fsS -o "fonts/NotoSansJP-${w}.ttf" "$url"
  echo "fonts/NotoSansJP-${w}.ttf"
done
