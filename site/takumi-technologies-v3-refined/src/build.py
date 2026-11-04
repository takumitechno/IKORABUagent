"""Build the Takumi Technologies site (V3 refined).

Inlines the vectorised official logos (logo-paths.json) into the pages and writes:
  ../index.html          main page   (from page.html)
  ../privacy.html        privacy policy (from privacy.html)
  <out>/artifact.html    the main page as a body fragment for the Artifact viewer (optional)
  <out>/privacy.html     the privacy policy as a full page, published next to it (optional)
"""
import json, pathlib, sys

here = pathlib.Path(__file__).resolve().parent
paths = json.loads((here / 'logo-paths.json').read_text(encoding='utf-8'))

repl = {
    '__SQ_KANJI__': paths['sq_kanji'], '__SQ_SEAL__': paths['sq_seal'], '__SQ_WORD__': paths['sq_word'],
    '__H_KANJI__': paths['h_kanji'], '__H_SEAL__': paths['h_seal'], '__H_WORD__': paths['h_word'],
    '__DK_KANJI__': paths['dk_kanji'], '__DK_SEAL__': paths['dk_seal'], '__DK_WORD__': paths['dk_word'],
    '__SQ_RED__': paths['sq_red'], '__H_RED__': paths['h_red'],
}


def render(name):
    src = (here / name).read_text(encoding='utf-8')
    for k, v in repl.items():
        src = src.replace(k, v)
    assert '__' not in src.split('<script>')[0].replace('__proto__', ''), f'unreplaced placeholder in {name}'
    return src


main = render('page.html')
privacy = render('privacy.html')
(here.parent / 'index.html').write_text(main, encoding='utf-8')
(here.parent / 'privacy.html').write_text(privacy, encoding='utf-8')

if len(sys.argv) > 1:
    start = main.index('<!--BODY-START-->') + len('<!--BODY-START-->')
    end = main.index('<!--BODY-END-->')
    frag = main[start:end].replace('<!--HEAD-END-->\n</head>\n<body>', '')
    out = pathlib.Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    (out / 'artifact.html').write_text(frag.strip() + '\n', encoding='utf-8')
    (out / 'privacy.html').write_text(privacy, encoding='utf-8')
print('built', len(main), '+', len(privacy), 'bytes')
