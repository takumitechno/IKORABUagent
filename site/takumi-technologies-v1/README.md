# Takumi Technologies — Corporate site V1 (demo)

`index.html` is a single, self-contained page: HTML / CSS / inline SVG / vanilla JS.
Open it directly in a browser. The only external request is Google Fonts.

## Structure

| Section | Content |
|---|---|
| Hero | The square logo is written stroke by stroke, the seal is stamped, and the end of the last stroke continues as a precise circuit bus. |
| Philosophy | 守備は哲学。攻撃は閃きと再現性。(vertical type) |
| Business | 12 domains → 4 stages → 1 flow, scroll-linked chapters |
| IKORABU | 7-stage operating loop (generate → approve → schedule → publish → confirm → analyze → improve) |
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

`prefers-reduced-motion` shows the final composition with no animation. Without JavaScript all content stays readable.
