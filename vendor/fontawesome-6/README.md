# vendor/fontawesome-6 — Font Awesome 6 Free (source of truth)

Vendored from [`@fortawesome/fontawesome-free@6.7.2`](https://www.npmjs.com/package/@fortawesome/fontawesome-free).
License: **CC-BY-4.0 AND OFL-1.1 AND MIT** (see `LICENSE.txt`) — the Free tier is
redistributable. This is the **entire** Font Awesome **v6** Free icon set (≈2,000 icons:
solid + regular + brands).

## Contents
| Path | What |
|---|---|
| `css/all.css` | Full FA6 Free CSS — every `.fa-<name>` glyph mapping + base styles + `@font-face`. Unmodified upstream. |
| `webfonts/fa-solid-900.woff2` | Solid faces (the bulk of the set). |
| `webfonts/fa-regular-400.woff2` | Regular (outline) faces. |
| `webfonts/fa-brands-400.woff2` | Brand logos. |

Only the 3 **v6** woff2 are vendored. Upstream also ships `.ttf` and `fa-v4compatibility`
/ `fa-v5` files — not needed (we target v6 woff2 only).

## How it becomes the ODC paste
`build/build-fontawesome.mjs` (`npm run build:fontawesome`) adapts `css/all.css` for ODC:

1. **Drops the legacy `@font-face` names** — `'FontAwesome'` (v4), `'Font Awesome 5
   Free'/'Brands'`, and `fa-v4compatibility`. `'FontAwesome'` is the family OSUI's own
   Icon widget declares (`vendor/outsystems-ui/.../_icon-library-odc.scss`), so keeping it
   would clobber the native widget. Only the three **v6** families survive.
2. **Strips the `.ttf` fallback** from every `src` (project self-hosts woff2 only, like Open Sans).
3. **Rewrites** `url("../webfonts/X.woff2")` → `url("/TheLoopTheme/X.woff2")` — the ODC
   Resources path, fingerprinted by ODC at compile time (same trick as `tokens/typography.css`).

Outputs → `dist/fontawesome.css` (+ `.min.css`), `dist/fontawesome-webfonts/` (upload to
ODC Resources), and a `preview/vendor/fontawesome/` copy with local paths.

## Upgrading
```bash
npm pack @fortawesome/fontawesome-free@<6.x>   # fetch a newer 6.x
# extract css/all.css + the 3 woff2 into this folder, then:
npm run build:fontawesome
```
The version stamped into `dist/fontawesome.css` is read live from `css/all.css`'s banner,
so a bump flows through automatically.
