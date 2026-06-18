# Handover — Primitive color utilities + `<loop-color-reference>` (Live Style Guide)

Two deliverables that work together:

1. **Primitive color utility classes** — `.background-<name>` / `.text-<name>` for every
   primitive color token (the ramps), in the OutSystems UI mould. Generated from
   `tokens/colors.css`, folded into the theme automatically.
2. **`<loop-color-reference>`** — a vanilla-JS Web Component that auto-renders the whole
   color reference page (swatch + Hex + Background Class + Text Class + CSS Variable,
   grouped by ramp) in the **Live Style Guide**, with **no rows built by hand** in
   Service Studio. This is the "fast import".

Figma reference: Live Style Guide "Color values, variables and classes" view.

## Why this approach
Building ~129 color rows × (swatch + 4 cells) by hand in ODC is hours of fragile work.
Instead: paste the theme (classes ship automatically) + drop one JS file + place one
element. The component reads each token's value **live from the theme** at render time —
it never hard-codes a hex, so the table can't drift from `dist/theme.css`.

## Files
| File | OutSystems destination |
|---|---|
| `tokens/color-utilities-primitives.css` | Included automatically in `dist/theme.css` — paste theme into ODC Theme editor |
| `src/components/loop-color-reference.js` | Add to the app's **Resources** (or a Scripts folder), set to load on the Style-Guide screen |
| `build/gen-color-utilities.mjs` | Build tooling — regenerates the CSS from `colors.css` |

## The utility classes
For every `--color-<name>` primitive, the generator emits:
```css
.background-<name> { background-color: var(--color-<name>) !important; }
.text-<name>       { color: var(--color-<name>) !important; }
```
e.g. `.background-blue-50`, `.text-red-70`, `.background-accent-magenta-90`,
`.text-neutral-alpha-02`. Apply via **ExtendedClass** on any element (hard rule #7).
Values resolve through `var(--token)` (hard rule #3) so a design re-map flows through
automatically. `!important` matches the existing `color-utilities.css` convention
(opt-in single-declaration overrides that must beat OS UI's own color classes).

> These are the raw **primitives**. Brand/semantic **role** helpers
> (`.background-primary`, `.text-error`, `.loop-text-default`, …) live in
> `tokens/color-utilities.css` — unchanged.

### Regenerating
After editing primitives in `tokens/colors.css`:
```bash
npm run gen:color-utilities   # rewrites tokens/color-utilities-primitives.css
npm run build:theme           # folds it into dist/theme.css
```
Then also add the new token name to the `GROUPS` manifest in
`src/components/loop-color-reference.js` so the Style Guide lists it.

## Using `<loop-color-reference>` in ODC
1. Add `loop-color-reference.js` to the app **Resources** (Deploy Action: *Deploy to
   Target Directory*) — or load it via a Scripts block on the Style-Guide screen.
2. On the **Live Style Guide** screen, add an **HTML Element** (tag `loop-color-reference`):
   ```html
   <loop-color-reference
     intro="Primitive color reference, generated live from the WBG / The Loop theme.">
   </loop-color-reference>
   ```
3. Publish → open in a **real browser** (not Service Studio Preview, hard rule #2).

### Attributes
| Attribute | Default | Description |
|---|---|---|
| `heading` | `Color values, variables and classes` | Section heading |
| `intro` | — | Intro line under the heading |
| `no-swatch-grid` | (off) | Hide the at-a-glance ramp grid; show only the tables |
| `filter` | (all) | Comma list of group keys to show, e.g. `blue,red,green` |

Group keys: `brand`, `blue`, `neutral`, `neutral-alpha`, `gray-alpha`, `red`, `green`,
`yellow`, `purple`, `accent-orange`, `accent-pale-green`, `accent-teal`,
`accent-indigo`, `accent-magenta`.

### Behaviour
- Each class / variable cell is a **button → click to copy** (with a transient ✓ cue).
- Swatch colors and hex values are read live via `getComputedStyle(:root)`.

## Accessibility (WCAG 2.2 AA)
- Real `<table>` with `scope`'d headers + visually-hidden `<caption>` per ramp.
- Swatches are decorative (`aria-hidden`); the hex + name carry the meaning.
- Copy buttons have `aria-label`s; focus ring uses
  `--color-domain-interactive-focused`; `prefers-reduced-motion` honored.

## Checklist
- [ ] `npm run build:theme` and paste `dist/theme.css` into the ODC Theme editor.
- [ ] Add `loop-color-reference.js` to Resources; load it on the Style-Guide screen.
- [ ] Place `<loop-color-reference>` via an HTML Element; publish.
- [ ] Validate in a **real browser**: swatches match the palette, hex values populate,
      click-to-copy works, keyboard focus rings visible.
- [ ] Spot-check a few utilities on a Container via ExtendedClass
      (`background-blue-50`, `text-red-70`).
