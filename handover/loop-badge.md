# Handover — loop-badge (Badge / Label, custom CSS block)

The Loop **Badge / Label** — a small rectangular category/label badge.
Figma: "Badge / label" [node 22966-4806].

**Approach:** Custom component **+** native-widget restyle.
- **Custom block** `.loop-badge` — a pure-CSS BEM block (no JS), applied via `ExtendedClass`
  on a Container/Text. Colors/types via modifier classes.
- **Native OutSystems UI Tag** (`.tag`) is **repointed** to this Badge/Label look (rectangle,
  radius 4) — so a developer who drops a stock Tag widget gets the Badge automatically.
  (Decided 2026-06-22.) The Tag **pill** (radius 48) stays available via the separate
  `.loop-tag` block — see `handover/loop-tag.md`.

**Scope (this build):** 6 colors (neutral / indigo / teal / purple / red / magenta) ×
2 types (Light / Heavy). Light = pale fill + colored border + colored text; Heavy = solid
fill + white text.
**Not in scope:** icon/leading slot, dismiss, sizes (the Badge/Label is single-size in Figma).
Those live on the Tag pill (`loop-tag`) and Badge Status (`loop-badge-status`).

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Badge / Label page.

**What it is.** A small rectangular category/label badge (`.loop-badge`, radius 4). The native Tag widget is repointed to this look.

**When to use**
- Short, **non-interactive** labels or categories — counts, statuses-as-words, metadata tags.

**When not to use** (reach for instead)
- A status with a colored dot/icon → **Badge / Status**.
- An interactive, dismissible, or pill-shaped token → **Tag**.

**How to use**
- Extended Class `loop-badge loop-badge--<color> loop-badge--<type>` (`--light` / `--heavy`) on a Container/Text — or simply drop a native **Tag** widget, which renders as this Badge.

## Files
| File | OutSystems destination |
|---|---|
| `tokens/component-badge-label.css` | Included automatically in `dist/theme.css` — paste theme into ODC Theme editor |
| `src/blocks/loop-badge.css` | Included automatically in `dist/theme.css` |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-badge.css</code> → Theme CSS (also folded into dist/theme.css)</summary>

```css
/* loop-badge.css — WBG / "The Loop" Badge / Label (CSS only, no JS).
 * Figma: "Badge / label" [node:22966-4806]. A small rectangular category/label
 * badge in two TYPES (Light / Heavy) × six COLORS (neutral / indigo / teal /
 * purple / red / magenta). Tokens: tokens/component-badge-label.css.
 *
 * Two ways to render the SAME look:
 *  1. Custom block — add "loop-badge loop-badge--<colour> [loop-badge--heavy]" to a
 *     Container/Text via ExtendedClass.
 *  2. Native OutSystems UI Tag widget — restyled at the bottom of this file so the
 *     standard .tag renders IDENTICAL to .loop-badge (rectangle, radius 4). Pick the
 *     colour via the Tag's "Color" (.background-*) and add .tag-heavy (ExtendedClass)
 *     for the Heavy type. (Decided 2026-06-22: native Tag repoints to Badge/Label —
 *     the Tag PILL stays available via the .loop-tag block.)
 *
 * Geometry note (2026-06-22): the 1px outline is drawn with an INSET BOX-SHADOW, not
 * a layout border. A real border would add 2px to the height (30px vs Figma's 28px)
 * and, on the native Tag, fights the framework's fixed `height: 32px`. The box-shadow
 * outline is purely visual, so the rendered height = line-height + padding = 28px for
 * BOTH Light and Heavy, and `vertical-align: middle` keeps the badge centred inline
 * with adjacent text / table cells.
 *
 * Rendered markup (custom block):
 *   <span class="loop-badge loop-badge--indigo">Status</span>            <!-- Light -->
 *   <span class="loop-badge loop-badge--indigo loop-badge--heavy">Status</span>  <!-- Heavy -->
 *
 * Scope: 6 colours × {Light, Heavy}. The Tag pill (.loop-tag, radius 48) is a
 * separate component (src/blocks/loop-tag.css). */

.loop-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  box-sizing: border-box;
  padding: var(--loop-badge-label-pad-v, 4px) var(--loop-badge-label-pad-h, 10px);
  border-radius: var(--loop-badge-label-radius, 4px);
  box-shadow: inset 0 0 0 var(--loop-badge-label-border, 1px) var(--_loop-badge-outline, transparent);
  font-family: var(--loop-badge-label-font, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-badge-label-size, 16px);
  line-height: var(--loop-badge-label-leading, 20px);
  letter-spacing: var(--loop-badge-label-tracking, 0);
  font-weight: var(--loop-badge-label-weight, 500);
  text-transform: capitalize;
  white-space: nowrap;
}

/* ---- Light type (default): pale fill + coloured outline + coloured text ----
 * Neutral is special: its text is the neutral on-light default, not the heavy hue. */
.loop-badge,
.loop-badge--neutral {
  background-color: var(--loop-badge-label-neutral-light, #e7edf3);
  color:            var(--loop-badge-label-neutral-text, #000d1ab2);
  --_loop-badge-outline: var(--loop-badge-label-neutral-heavy, #4b5e71);
}
.loop-badge--indigo  { background-color: var(--loop-badge-label-indigo-light, #d8d9fc);  color: var(--loop-badge-label-indigo-heavy, #3c40f0);  --_loop-badge-outline: var(--loop-badge-label-indigo-heavy, #3c40f0); }
.loop-badge--teal    { background-color: var(--loop-badge-label-teal-light, #cfe9ef);    color: var(--loop-badge-label-teal-heavy, #026e89);    --_loop-badge-outline: var(--loop-badge-label-teal-heavy, #026e89); }
.loop-badge--purple  { background-color: var(--loop-badge-label-purple-light, #e4dafb);  color: var(--loop-badge-label-purple-heavy, #6427ef);  --_loop-badge-outline: var(--loop-badge-label-purple-heavy, #6427ef); }
.loop-badge--red     { background-color: var(--loop-badge-label-red-light, #f4dee4);     color: var(--loop-badge-label-red-heavy, #b4234d);     --_loop-badge-outline: var(--loop-badge-label-red-heavy, #b4234d); }
.loop-badge--magenta { background-color: var(--loop-badge-label-magenta-light, #f2d6f6); color: var(--loop-badge-label-magenta-heavy, #a028ad); --_loop-badge-outline: var(--loop-badge-label-magenta-heavy, #a028ad); }

/* ---- Heavy type: solid fill + white text (outline == fill, so it's invisible) ---- */
.loop-badge--heavy { color: var(--loop-badge-label-text-on-heavy, #ffffffe5); }
.loop-badge--heavy,
.loop-badge--heavy.loop-badge--neutral { background-color: var(--loop-badge-label-neutral-heavy, #4b5e71); --_loop-badge-outline: var(--loop-badge-label-neutral-heavy, #4b5e71); }
.loop-badge--heavy.loop-badge--indigo  { background-color: var(--loop-badge-label-indigo-heavy, #3c40f0);  --_loop-badge-outline: var(--loop-badge-label-indigo-heavy, #3c40f0); }
.loop-badge--heavy.loop-badge--teal    { background-color: var(--loop-badge-label-teal-heavy, #026e89);    --_loop-badge-outline: var(--loop-badge-label-teal-heavy, #026e89); }
.loop-badge--heavy.loop-badge--purple  { background-color: var(--loop-badge-label-purple-heavy, #6427ef);  --_loop-badge-outline: var(--loop-badge-label-purple-heavy, #6427ef); }
.loop-badge--heavy.loop-badge--red     { background-color: var(--loop-badge-label-red-heavy, #b4234d);     --_loop-badge-outline: var(--loop-badge-label-red-heavy, #b4234d); }
.loop-badge--heavy.loop-badge--magenta { background-color: var(--loop-badge-label-magenta-heavy, #a028ad); --_loop-badge-outline: var(--loop-badge-label-magenta-heavy, #a028ad); }

/* ============================================================================
 * Native OutSystems UI Tag (.tag) → The Loop Badge / Label look
 * ----------------------------------------------------------------------------
 * The OutSystems UI Tag pattern (vendor 04-patterns/02-content/_tag.scss) is, in
 * its native form, a RECTANGULAR FILLED label (semi-bold, fixed h32, min-width
 * 32px, square corners) — the closest native widget to The Loop Badge / Label.
 * This restyles it so the standard Tag renders IDENTICAL to .loop-badge (rect,
 * radius 4), reusing the same --loop-badge-label-* tokens — no parallel class
 * system (CLAUDE.md hard rule; "restyle native widgets" memory).
 *
 * The framework Tag fixes `height: 32px` and `line-height: 1`; both are reset here
 * (height:auto + min-height:0 + the Badge line-height) so the box is the Badge's
 * 28px, not a 32px slab. Outline via inset box-shadow (see geometry note above).
 *
 * Devs keep using the native Tag widget: pick the colour via its "Color" property
 * (.background-*) and add .tag-heavy (ExtendedClass) for the Heavy type. These
 * overrides win because the theme loads after OutSystems UI in ODC.
 *
 * Palette mapping note (FND-039): The Loop badge palette (neutral/indigo/teal/
 * purple/red/magenta) doesn't line up 1:1 with the native Tag colour enum, so the
 * nearest native colour classes are mapped — blue→indigo and green→teal are
 * approximations; default (no colour) = neutral. Use the .loop-badge block when an
 * exact colour name matters.
 * ============================================================================ */
.tag {
  box-sizing: border-box;
  min-width: 0;             /* drop native 32px min-width — badge hugs its label */
  height: auto;             /* was fixed 32px */
  min-height: 0;            /* belt-and-braces: clear any inherited fixed height */
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  padding: var(--loop-badge-label-pad-v, 4px) var(--loop-badge-label-pad-h, 10px);
  border-radius: var(--loop-badge-label-radius, 4px);
  box-shadow: inset 0 0 0 var(--loop-badge-label-border, 1px) var(--_loop-badge-outline, transparent);
  font-family: var(--loop-badge-label-font, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-badge-label-size, 16px);
  line-height: var(--loop-badge-label-leading, 20px);
  letter-spacing: var(--loop-badge-label-tracking, 0);
  font-weight: var(--loop-badge-label-weight, 500);
  text-transform: capitalize;

  /* Default (no colour class) = neutral Light */
  background-color: var(--loop-badge-label-neutral-light, #e7edf3);
  color:            var(--loop-badge-label-neutral-text, #000d1ab2);
  --_loop-badge-outline: var(--loop-badge-label-neutral-heavy, #4b5e71);
}

/* ---- Colour classes (native Tag "Color") → The Loop badge palette (Light) ---- */
.tag.background-blue             { background-color: var(--loop-badge-label-indigo-light, #d8d9fc);  color: var(--loop-badge-label-indigo-heavy, #3c40f0);  --_loop-badge-outline: var(--loop-badge-label-indigo-heavy, #3c40f0); }
.tag.background-green            { background-color: var(--loop-badge-label-teal-light, #cfe9ef);    color: var(--loop-badge-label-teal-heavy, #026e89);    --_loop-badge-outline: var(--loop-badge-label-teal-heavy, #026e89); }
.tag.background-violet,
.tag.background-grape,
.tag.background-purple           { background-color: var(--loop-badge-label-purple-light, #e4dafb);  color: var(--loop-badge-label-purple-heavy, #6427ef);  --_loop-badge-outline: var(--loop-badge-label-purple-heavy, #6427ef); }
.tag.background-red              { background-color: var(--loop-badge-label-red-light, #f4dee4);     color: var(--loop-badge-label-red-heavy, #b4234d);     --_loop-badge-outline: var(--loop-badge-label-red-heavy, #b4234d); }
.tag.background-magenta          { background-color: var(--loop-badge-label-magenta-light, #f2d6f6); color: var(--loop-badge-label-magenta-heavy, #a028ad); --_loop-badge-outline: var(--loop-badge-label-magenta-heavy, #a028ad); }

/* ---- Heavy type (add .tag-heavy via ExtendedClass): solid fill + white text ---- */
.tag.tag-heavy                   { color: var(--loop-badge-label-text-on-heavy, #ffffffe5); background-color: var(--loop-badge-label-neutral-heavy, #4b5e71); --_loop-badge-outline: var(--loop-badge-label-neutral-heavy, #4b5e71); }
.tag.tag-heavy.background-blue   { background-color: var(--loop-badge-label-indigo-heavy, #3c40f0);  --_loop-badge-outline: var(--loop-badge-label-indigo-heavy, #3c40f0); }
.tag.tag-heavy.background-green  { background-color: var(--loop-badge-label-teal-heavy, #026e89);    --_loop-badge-outline: var(--loop-badge-label-teal-heavy, #026e89); }
.tag.tag-heavy.background-violet,
.tag.tag-heavy.background-grape,
.tag.tag-heavy.background-purple { background-color: var(--loop-badge-label-purple-heavy, #6427ef);  --_loop-badge-outline: var(--loop-badge-label-purple-heavy, #6427ef); }
.tag.tag-heavy.background-red    { background-color: var(--loop-badge-label-red-heavy, #b4234d);     --_loop-badge-outline: var(--loop-badge-label-red-heavy, #b4234d); }
.tag.tag-heavy.background-magenta{ background-color: var(--loop-badge-label-magenta-heavy, #a028ad); --_loop-badge-outline: var(--loop-badge-label-magenta-heavy, #a028ad); }
```

</details>





































## Usage in OutSystems

### Option A — custom block (exact 6-color palette)
Add these classes to a **Container** (or Text) via `ExtendedClass`:

```
loop-badge loop-badge--indigo            ← Light (default type)
loop-badge loop-badge--indigo loop-badge--heavy   ← Heavy
```

- **Color:** `--neutral` (default) | `--indigo` | `--teal` | `--purple` | `--red` | `--magenta`
- **Type:** Light (default, no class) | `--heavy`

Rendered markup:
```html
<span class="loop-badge loop-badge--indigo">Status</span>
<span class="loop-badge loop-badge--indigo loop-badge--heavy">Status</span>
```

### Option B — native Tag widget (restyled)
Drop a stock **Tag** widget. It renders as a Badge/Label automatically.
- **Color:** set the Tag's "Color" property — mapped to the nearest badge hue:
  `Blue → indigo`, `Green → teal`, `Violet/Grape/Purple → purple`, `Red → red`, `Magenta → magenta`,
  none → neutral.
- **Type:** add `tag-heavy` via `ExtendedClass` for the Heavy fill.

> Palette caveat (FND-039): the native Tag color enum doesn't line up 1:1 with the badge palette;
> `Blue→indigo` and `Green→teal` are approximations. Use **Option A** when an exact color name matters.

## API (key CSS tokens)
| Token | Default | Description |
|---|---|---|
| `--loop-badge-label-radius` | `4px` (`--radius-base`) | Corner radius |
| `--loop-badge-label-pad-v` / `-pad-h` | `4px` / `10px` | Vertical / horizontal padding |
| `--loop-badge-label-size` | `16px` | Label size |
| `--loop-badge-label-leading` | `20px` | Label line-height |
| `--loop-badge-label-weight` | `500` | Label weight (renders 400 — see FND-040) |
| `--loop-badge-label-{color}-light` / `-heavy` | per color | Fill (Light) / fill+text source (Heavy) |
| `--loop-badge-label-text-on-heavy` | `#ffffffe5` | White text on Heavy fill |

## Colors
| Color | Light bg | Heavy (border / Heavy fill / Light text) |
|---|---|---|
| neutral (default) | `#e7edf3` (neutral-10) | `#4b5e71` (neutral-60); Light text `#000d1ab2` |
| indigo | `#d8d9fc` | `#3c40f0` |
| teal | `#cfe9ef` | `#026e89` |
| purple | `#e4dafb` | `#6427ef` |
| red | `#f4dee4` | `#b4234d` |
| magenta | `#f2d6f6` | `#a028ad` |

## Accessibility (WCAG 2.2 AA)
- Contrast verified at build time — **all 12 pairs pass 4.5:1** (Light text-on-fill 4.6–9.0:1;
  Heavy white-on-fill 5.8–6.8:1). Badge is a non-interactive label; the text carries the meaning
  (color is not the sole signal).
- `text-transform: capitalize` matches Figma; the label still reads to AT as authored.

## Related findings (register-only, awaiting design)
- **FND-039** (design-token) — indigo/teal/purple/red/magenta (light+heavy) have no foundation
  primitive and the badge purple/red differ from the Tag/State roles; declared as component literals.
- **FND-040** (brand/a11y) — label weight `500` ("SemiBold") resolves to the `400` face (Open Sans
  ships 400/600/700 only); same root as Badge Status FND-036.

See `findings/findings-register.md`.

## Checklist
- [ ] Rebuild `dist/theme.css` (`npm run build:theme`) and paste into the ODC Theme editor.
- [ ] **Option A:** add a Container with ExtendedClass `loop-badge loop-badge--<color>` (+ `loop-badge--heavy`).
- [ ] **Option B:** drop a native Tag widget, set Color, add `tag-heavy` for Heavy.
- [ ] Test all 6 colors × Light/Heavy.
- [ ] 1-Click Publish → validate in a **real browser**.
