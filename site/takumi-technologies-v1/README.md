# Takumi Technologies — Corporate site V1 (demo)

`index.html` is a single, self-contained page: HTML / CSS / inline SVG / vanilla JS.
Open it directly in a browser. The only external request is Google Fonts.

## Structure

| Section | Content |
|---|---|
| Hero | The square logo is written stroke by stroke, the seal is stamped, and the end of the last stroke continues as a precise circuit bus. |
| Philosophy | 本質を守り、可能性をひらく。閃きを、一度きりで終わらせない。(vertical type, English as a secondary echo) |
| Business | 12 domains → 4 stages → 1 flow, scroll-linked chapters |
| 環 — MEGURI | Proprietary operating platform: 7-stage loop (generate → approve → schedule → publish → confirm → analyze → improve → next generation) |
| Human × AI × System | Role design; three lines converge into one |
| Closing / Footer | White logo on sumi; horizontal logo |

## Logo usage

- Horizontal logo: header, menu, footer (`#logo-h` symbol; ink follows the section tone, the seal stays red)
- Square logo, white ground with red seal: hero (desktop and mobile)
- Black ground with white logo: closing section
- The checker-patterned source image is not used.

The logos are vectorised from the official files in `src/brand/` without changing their shapes.

## Editing

```sh
cd src
python3 trace_logos.py   # only when the official logo files change → logo-paths.json
python3 build.py         # page.html + logo-paths.json → ../index.html
```

Edit `src/page.html`; never edit `index.html` by hand.

## Public naming

The operating platform is shown publicly only as **環 — MEGURI**. Internal codenames, agent names
and internal organisation names must not appear anywhere in the page (text, metadata, labels,
hidden text, comments). Check before publishing:

```sh
grep -i -c "<internal codename>" index.html   # must print 0
```

`prefers-reduced-motion` shows the final composition with no animation. Without JavaScript all content stays readable.
