#!/usr/bin/env bash
# Fetch Kokoro-82M (Apache-2.0) ONNX weights + Japanese voices from the npm package expo-kokoro,
# and install the Japanese G2P stack used by src/tts.py (TTS_BACKEND=kokoro).
set -euo pipefail
cd "$(dirname "$0")"
tmp=$(mktemp -d)
url=$(curl -fsS https://registry.npmjs.org/expo-kokoro/latest | python3 -c "import sys,json;print(json.load(sys.stdin)['dist']['tarball'])")
curl -fsS -o "$tmp/pkg.tgz" "$url"
tar xzf "$tmp/pkg.tgz" -C "$tmp" package/build/kokoro-quantized.onnx package/build/tokenizer.json \
  package/build/voices/jm_kumo.bin package/build/voices/jf_alpha.bin
mkdir -p kokoro/voices
cp "$tmp/package/build/kokoro-quantized.onnx" "$tmp/package/build/tokenizer.json" kokoro/
cp "$tmp"/package/build/voices/*.bin kokoro/voices/

pip install onnxruntime fugashi jaconv mojimoji addict regex
pip install --no-deps --ignore-requires-python "misaki==0.9.4"
# unidic-lite's setup.py fails on some setuptools builds; install the dictionary by copying it.
python3 -c "import unidic_lite" 2>/dev/null || {
  pip download --no-deps -d "$tmp" unidic-lite==1.0.8
  tar xzf "$tmp"/unidic-lite-1.0.8.tar.gz -C "$tmp"
  cp -r "$tmp"/unidic-lite-1.0.8/unidic_lite "$(python3 -c 'import site; print(site.getsitepackages()[0])')/"
}
rm -rf "$tmp"
echo "kokoro/ ready"
