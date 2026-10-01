# Takumi Technologies — Corporate site V2 (demo)

`index.html` is a single, self-contained page: HTML / CSS / inline SVG / vanilla JS.
Open it directly in a browser. The only external request is Google Fonts.
V1 (`../takumi-technologies-v1/`) is kept unchanged for comparison.

## Page flow (abstract → concrete → product → operation → effect → philosophy)

| # | Section | Left: words | Right: figure |
|---|---|---|---|
| 01 | Hero | 匠の技を、Technologyで拡張する。 / 環 — MEGURI | Square logo written stroke by stroke; the last stroke continues as a circuit bus |
| 02 | What we do | 点の施策を、一本の流れに。 | 6 → 1: six domains converge into one operational design; four stages below |
| 03 | 環 — MEGURI | 自社開発の事業運用基盤 / 運用を、一つの循環に。 | Seven-stage loop over a brush circle; approval marked by a brush dot (human) |
| 04 | How we operate | Seven steps, each tagged 人 / AI / 仕組み | Operations board (sample, abstracted), follows the step being read |
| 05 | What becomes possible | Eight outcomes | Before → 環 → After |
| 06 | Human × AI × System | 人が判断し、AIが広げ、仕組みが残す。 | Three layers assemble into one operation |
| 07 | Philosophy | 本質を守り、可能性をひらく。/ ひらめきを、一度きりで終わらせない。 | Lines open from a protected core |
| 08 | Closing | ひらめきを、仕組みに変える。 | Lines return into the brush; the logo is written again |

## Rules kept in the copy

- The operating platform is shown publicly only as **環 — MEGURI**. Internal codenames, agent names
  and internal organisation names must not appear anywhere in the page.
- No invented numbers (clients, results, revenue). The only figure is 6 → 1, defined in the page.
- Kanji follow the jōyō list (ひらめき is written in hiragana; 閃 is not jōyō).
  The four philosophy lines are fixed and are not edited.

## Editing

```sh
cd src
python3 build.py   # page.html + logo-paths.json → ../index.html
```

`logo-paths.json` is traced from the official logo files in `../takumi-technologies-v1/src/brand/`
(see `../takumi-technologies-v1/src/trace_logos.py`).

`prefers-reduced-motion` shows every figure in its final state with no animation.
Without JavaScript all text stays readable.
