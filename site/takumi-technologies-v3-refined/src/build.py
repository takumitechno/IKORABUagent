"""Build the Takumi Technologies V1 demo.

Inlines the vectorised official logos (logo-paths.json) into page.html and writes:
  ../index.html          standalone page (open directly in a browser)
  <out>/artifact.html    the same page as a body fragment for the Artifact viewer (optional)
"""
import json, pathlib, sys

here = pathlib.Path(__file__).resolve().parent
src = (here / 'page.html').read_text(encoding='utf-8')
paths = json.loads((here / 'logo-paths.json').read_text(encoding='utf-8'))

repl = {
    '__SQ_KANJI__': paths['sq_kanji'], '__SQ_SEAL__': paths['sq_seal'], '__SQ_WORD__': paths['sq_word'],
    '__H_KANJI__': paths['h_kanji'], '__H_SEAL__': paths['h_seal'], '__H_WORD__': paths['h_word'],
    '__DK_KANJI__': paths['dk_kanji'], '__DK_SEAL__': paths['dk_seal'], '__DK_WORD__': paths['dk_word'],
    '__SQ_RED__': paths['sq_red'], '__H_RED__': paths['h_red'],
}
for k, v in repl.items():
    src = src.replace(k, v)
assert '__' not in src.split('<script>')[0].replace('__proto__', ''), 'unreplaced placeholder'

(here.parent / 'index.html').write_text(src, encoding='utf-8')

if len(sys.argv) > 1:
    start = src.index('<!--BODY-START-->') + len('<!--BODY-START-->')
    end = src.index('<!--BODY-END-->')
    frag = src[start:end].replace('<!--HEAD-END-->\n</head>\n<body>', '')
    out = pathlib.Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    (out / 'artifact.html').write_text(frag.strip() + '\n', encoding='utf-8')
print('built', len(src), 'bytes')
