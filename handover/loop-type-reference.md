# Handover — Typography utilities + `<loop-type-reference>` (Live Style Guide)

The typography counterpart to the color reference. Two deliverables:

1. **Typography utility classes** — `.font-size-<name>` / `.font-weight-<name>` for the
   type scale + weights, in the OutSystems UI mould. Generated from
   `tokens/typography.css`, folded into the theme automatically.
2. **`<loop-type-reference>`** — a vanilla-JS Web Component that auto-renders the whole
   type system in the **Live Style Guide** (named Heading/Body styles, font-size scale,
   weights, line-heights, letter-spacing), with **no rows built by hand**.

Source of truth: WBG / "The Loop" Figma type page (**node 10995-7259**), font **Open Sans**
(FND-002 sign-off). Size/weight/line-height/tracking values are read **live from the
theme**, so the samples can't drift from `dist/theme.css`.

## Files
| File | OutSystems destination |
|---|---|
| `tokens/typography-utilities.css` | Included automatically in `dist/theme.css` — paste theme into ODC Theme editor |
| `src/components/loop-type-reference.js` | Add to the app's **Resources**; load on the Style-Guide screen |
| `build/gen-type-utilities.mjs` | Build tooling — regenerates the CSS from `typography.css` |

## The utility classes
For every `--font-size-<name>` and `--font-weight-<name>` token:
```css
.font-size-<name>   { font-size:   var(--font-size-<name>) !important; }
.font-weight-<name> { font-weight: var(--font-weight-<name>) !important; }
```
e.g. `.font-size-800` (32px), `.font-size-1200` (60px), `.font-weight-bold`. Apply via
**ExtendedClass** (hard rule #7); values resolve through `var(--token)` (hard rule #3).

> Scope is the raw **scale + weights**. The **named type styles** (Heading H1 Large, Body
> Large, …) compose size+weight+line-height+tracking; they're documented live by the
> component but not minted as classes, because two of their tracking values are off the
> token scale (see below).

### Regenerating
After editing `tokens/typography.css`:
```bash
npm run gen:type-utilities    # rewrites tokens/typography-utilities.css
npm run build:theme           # folds it into dist/theme.css
```

## Named type styles (the Figma roles, Open Sans)
Rendered by the component; here for reference.

**Headings — Bold (700), line-height 1.12:**
| Role | Size | Token |
|---|---|---|
| H1 · Large | 60px (tracking −3px) | `--font-size-1200` |
| H1 · Base | 48px | `--font-size-1100` |
| H1 · Small | 36px | `--font-size-900` |
| H1 · Tiny | 28px | `--font-size-700` |
| H2 · Large | 48px | `--font-size-1100` |
| H2 · Small | 32px | `--font-size-800` |
| H3 · Base | 32px | `--font-size-800` |

**Body — Regular (400), line-height 1.5 (labels Bold 700):**
| Role | Size | Tracking |
|---|---|---|
| Body · Large | 24px | −0.35px (`--letter-spacing-tight`) |
| Body · Medium | 20px | −0.25px **(off-scale)** |
| Body · Base | 16px | 0 |
| Body · Small | 14px | 0 |
| Body · Tiny | 12px | 0.25px **(off-scale)** |
| Body · Tiny · All Caps | 12px, uppercase, lh 1.25 | 1px (`--letter-spacing-caps`) |

> **Off-scale tracking** (Body Medium −0.25px, Body Tiny 0.25px) is not on the documented
> letter-spacing scale (same family as FND-013/022). Built faithfully as literals and
> tagged "off-scale" in the reference — flag to design before tokenising.

## Using `<loop-type-reference>` in ODC
1. Add `loop-type-reference.js` to **Resources** (Deploy to Target Directory) — or load
   via a Scripts block on the Style-Guide screen.
2. On the **Live Style Guide** screen, add an **HTML Element** (tag `loop-type-reference`):
   ```html
   <loop-type-reference
     intro="Type system generated live from the WBG / The Loop theme.">
   </loop-type-reference>
   ```
3. Publish → open in a **real browser** (hard rule #2).

### Attributes
| Attribute | Default | Description |
|---|---|---|
| `heading` | `Typography` | Section heading |
| `intro` | — | Intro line under the heading |
| `filter` | (all) | Comma list of sections: `styles`, `scale`, `weights`, `leading`, `tracking` |

Each class / variable chip is **click-to-copy** (✓ cue).

## Accessibility (WCAG 2.2 AA)
- Section headings + real `<table>`s with `scope`'d headers + visually-hidden captions.
- Illustrative samples are `aria-hidden`; the spec text + tokens carry the meaning.
- Copy buttons have `aria-label`s; focus ring uses `--color-domain-interactive-focused`;
  `prefers-reduced-motion` honored.

## Checklist
- [ ] `npm run build:theme`; paste `dist/theme.css` into the ODC Theme editor.
- [ ] Add `loop-type-reference.js` to Resources; load it on the Style-Guide screen.
- [ ] Place `<loop-type-reference>`; publish.
- [ ] Validate in a **real browser**: samples render at the right size/weight, scale &
      weight values populate, click-to-copy works, focus rings visible.
- [ ] Spot-check a couple of utilities on a Container via ExtendedClass
      (`font-size-800 font-weight-bold`).
