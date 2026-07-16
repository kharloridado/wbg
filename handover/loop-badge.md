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
2 types (Light / Heavy) × 4 sizes (xLarge / Large / Regular / Small). Light = pale fill +
colored border + colored text; Heavy = solid fill + white text. **Sizes** come from Figma's
"Component Sizes" collection (node 22966-4808): xLarge 16/20 · Large 14/17 · Regular 13/17 ·
Small 11/14 (font/line-height); **Regular is the default** (no class). Font, line-height,
padding and tracking scale together; the outline stays a zero-layout inset box-shadow so
height = line-height + 2·v-pad (28 / 25 / 21 / 18). Off-scale size values flagged → FND-056.
**Not in scope:** icon/leading slot, dismiss. Those live on the Tag pill (`loop-tag`) and
Badge Status (`loop-badge-status`).

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Badge / Label page.

**What it is.** A small rectangular category/label badge (`.loop-badge`, radius 4). The native Tag widget is repointed to this look.

**When to use**
- Short, **non-interactive** labels or categories — counts, statuses-as-words, metadata tags.

**When not to use** (reach for instead)
- A status with a colored dot/icon → **Badge / Status**.
- An interactive, dismissible, or pill-shaped token → **Tag**.

**How to use**
- Extended Class `loop-badge loop-badge--<color> loop-badge--<type>` (`--light` / `--heavy`) — add `loop-badge--xlarge` / `--large` / `--small` for size (Regular is the default, no class) — on a Container/Text — or simply drop a native **Tag** widget, which renders as this Badge.

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
/* loop-badge.css — Badge / Label: .loop-badge block + native .tag restyle (CSS only) */
/* Outline is an inset box-shadow, not a border, so it adds no height at any size. */

.loop-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  box-sizing: border-box;
  /* Size routes through internal --_lbl-* vars that default to the Regular tokens; the size modifiers below flip them. */
  padding: var(--_lbl-pad-v, var(--loop-badge-label-pad-v, 2px)) var(--_lbl-pad-r, var(--loop-badge-label-pad-r, 6px)) var(--_lbl-pad-v, var(--loop-badge-label-pad-v, 2px)) var(--_lbl-pad-l, var(--loop-badge-label-pad-l, 8px));
  border-radius: var(--loop-badge-label-radius, 4px);
  box-shadow: inset 0 0 0 var(--loop-badge-label-border, 1px) var(--_loop-badge-outline, transparent);
  font-family: var(--loop-badge-label-font, "Open Sans", system-ui, sans-serif);
  font-size: var(--_lbl-font, var(--loop-badge-label-size, 13px));
  line-height: var(--_lbl-leading, var(--loop-badge-label-leading, 17px));
  letter-spacing: var(--_lbl-tracking, var(--loop-badge-label-tracking, 0.25px));
  font-weight: var(--loop-badge-label-weight, 500);
  text-transform: capitalize;
  white-space: nowrap;
}

/* ---- Size modifiers (xLarge/Large/Regular/Small; Regular is the bare default) ---- */
.loop-badge--xlarge {
  --_lbl-font:    var(--loop-badge-label-xlarge-size, 16px);
  --_lbl-leading: var(--loop-badge-label-xlarge-leading, 20px);
  --_lbl-tracking: var(--loop-badge-label-xlarge-tracking, 0);
  --_lbl-pad-v:   var(--loop-badge-label-xlarge-pad-v, 4px);
  --_lbl-pad-l:   var(--loop-badge-label-xlarge-pad-l, 10px);
  --_lbl-pad-r:   var(--loop-badge-label-xlarge-pad-r, 10px);
}
.loop-badge--large {
  --_lbl-font:    var(--loop-badge-label-large-size, 14px);
  --_lbl-leading: var(--loop-badge-label-large-leading, 17px);
  --_lbl-tracking: var(--loop-badge-label-large-tracking, 0);
  --_lbl-pad-v:   var(--loop-badge-label-large-pad-v, 4px);
  --_lbl-pad-l:   var(--loop-badge-label-large-pad-l, 8px);
  --_lbl-pad-r:   var(--loop-badge-label-large-pad-r, 8px);
}
.loop-badge--regular {
  --_lbl-font:    var(--loop-badge-label-regular-size, 13px);
  --_lbl-leading: var(--loop-badge-label-regular-leading, 17px);
  --_lbl-tracking: var(--loop-badge-label-regular-tracking, 0.25px);
  --_lbl-pad-v:   var(--loop-badge-label-regular-pad-v, 2px);
  --_lbl-pad-l:   var(--loop-badge-label-regular-pad-l, 8px);
  --_lbl-pad-r:   var(--loop-badge-label-regular-pad-r, 6px);
}
.loop-badge--small {
  --_lbl-font:    var(--loop-badge-label-small-size, 11px);
  --_lbl-leading: var(--loop-badge-label-small-leading, 14px);
  --_lbl-tracking: var(--loop-badge-label-small-tracking, 0.25px);
  --_lbl-pad-v:   var(--loop-badge-label-small-pad-v, 2px);
  --_lbl-pad-l:   var(--loop-badge-label-small-pad-l, 4px);
  --_lbl-pad-r:   var(--loop-badge-label-small-pad-r, 4px);
}

/* ---- Light type (default): pale fill + coloured outline + coloured text ----
 * Neutral text is the on-light default, not the heavy hue. */
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
 * Native OutSystems UI Tag (.tag) → Badge / Label look
 * ----------------------------------------------------------------------------
 * Reset the framework Tag's fixed height:32px/line-height:1 (height:auto +
 * min-height:0 + the Badge line-height) so the box is the Badge height, not a slab.
 * ============================================================================ */
.tag {
  box-sizing: border-box;
  min-width: 0;             /* drop native 32px min-width */
  height: auto;
  min-height: 0;            /* clear any inherited fixed height */
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  padding: var(--_lbl-pad-v, var(--loop-badge-label-pad-v, 2px)) var(--_lbl-pad-r, var(--loop-badge-label-pad-r, 6px)) var(--_lbl-pad-v, var(--loop-badge-label-pad-v, 2px)) var(--_lbl-pad-l, var(--loop-badge-label-pad-l, 8px));
  border-radius: var(--loop-badge-label-radius, 4px);
  box-shadow: inset 0 0 0 var(--loop-badge-label-border, 1px) var(--_loop-badge-outline, transparent);
  font-family: var(--loop-badge-label-font, "Open Sans", system-ui, sans-serif);
  font-size: var(--_lbl-font, var(--loop-badge-label-size, 13px));
  line-height: var(--_lbl-leading, var(--loop-badge-label-leading, 17px));
  letter-spacing: var(--_lbl-tracking, var(--loop-badge-label-tracking, 0.25px));
  font-weight: var(--loop-badge-label-weight, 500);
  text-transform: capitalize;

  /* Default (no colour class) = neutral Light */
  background-color: var(--loop-badge-label-neutral-light, #e7edf3);
  color:            var(--loop-badge-label-neutral-text, #000d1ab2);
  --_loop-badge-outline: var(--loop-badge-label-neutral-heavy, #4b5e71);
}

/* ---- Size modifiers (.tag-xlarge / -large / -small; Regular is the default) ---- */
.tag.tag-xlarge {
  --_lbl-font:    var(--loop-badge-label-xlarge-size, 16px);
  --_lbl-leading: var(--loop-badge-label-xlarge-leading, 20px);
  --_lbl-tracking: var(--loop-badge-label-xlarge-tracking, 0);
  --_lbl-pad-v:   var(--loop-badge-label-xlarge-pad-v, 4px);
  --_lbl-pad-l:   var(--loop-badge-label-xlarge-pad-l, 10px);
  --_lbl-pad-r:   var(--loop-badge-label-xlarge-pad-r, 10px);
}
.tag.tag-large {
  --_lbl-font:    var(--loop-badge-label-large-size, 14px);
  --_lbl-leading: var(--loop-badge-label-large-leading, 17px);
  --_lbl-tracking: var(--loop-badge-label-large-tracking, 0);
  --_lbl-pad-v:   var(--loop-badge-label-large-pad-v, 4px);
  --_lbl-pad-l:   var(--loop-badge-label-large-pad-l, 8px);
  --_lbl-pad-r:   var(--loop-badge-label-large-pad-r, 8px);
}
.tag.tag-regular {
  --_lbl-font:    var(--loop-badge-label-regular-size, 13px);
  --_lbl-leading: var(--loop-badge-label-regular-leading, 17px);
  --_lbl-tracking: var(--loop-badge-label-regular-tracking, 0.25px);
  --_lbl-pad-v:   var(--loop-badge-label-regular-pad-v, 2px);
  --_lbl-pad-l:   var(--loop-badge-label-regular-pad-l, 8px);
  --_lbl-pad-r:   var(--loop-badge-label-regular-pad-r, 6px);
}
.tag.tag-small {
  --_lbl-font:    var(--loop-badge-label-small-size, 11px);
  --_lbl-leading: var(--loop-badge-label-small-leading, 14px);
  --_lbl-tracking: var(--loop-badge-label-small-tracking, 0.25px);
  --_lbl-pad-v:   var(--loop-badge-label-small-pad-v, 2px);
  --_lbl-pad-l:   var(--loop-badge-label-small-pad-l, 4px);
  --_lbl-pad-r:   var(--loop-badge-label-small-pad-r, 4px);
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
- **Size:** Regular (default, no class) | `--xlarge` | `--large` | `--small` (`--regular` is an explicit alias)

Rendered markup:
```html
<span class="loop-badge loop-badge--indigo">Status</span>                       <!-- Regular -->
<span class="loop-badge loop-badge--indigo loop-badge--heavy">Status</span>
<span class="loop-badge loop-badge--indigo loop-badge--xlarge">Status</span>
<span class="loop-badge loop-badge--indigo loop-badge--small">Status</span>
```

### Option B — native Tag widget (restyled)
Drop a stock **Tag** widget. It renders as a Badge/Label automatically.
- **Color:** set the Tag's "Color" property — mapped to the nearest badge hue:
  `Blue → indigo`, `Green → teal`, `Violet/Grape/Purple → purple`, `Red → red`, `Magenta → magenta`,
  none → neutral.
- **Type:** add `tag-heavy` via `ExtendedClass` for the Heavy fill.
- **Size:** add `tag-xlarge` / `tag-large` / `tag-small` via `ExtendedClass` (Regular is the default).

> Palette caveat (FND-039): the native Tag color enum doesn't line up 1:1 with the badge palette;
> `Blue→indigo` and `Green→teal` are approximations. Use **Option A** when an exact color name matters.

## API (key CSS tokens)
| Token | Default | Description |
|---|---|---|
| `--loop-badge-label-radius` | `4px` (`--radius-base`) | Corner radius (all sizes) |
| `--loop-badge-label-{size,leading,pad-v,pad-l,pad-r,tracking}` | Regular | Default-size alias (= Regular) |
| `--loop-badge-label-xlarge-{size,leading,pad-v,pad-l,pad-r,tracking}` | `16 / 20 / 4 / 10 / 10 / 0` | xLarge scale |
| `--loop-badge-label-large-{…}` | `14 / 17 / 4 / 8 / 8 / 0` | Large scale |
| `--loop-badge-label-regular-{…}` | `13 / 17 / 2 / 8 / 6 / 0.25px` | Regular scale (default; asymmetric pad) |
| `--loop-badge-label-small-{…}` | `11 / 14 / 2 / 4 / 4 / 0.25px` | Small scale |
| `--loop-badge-label-weight` | `500` | Label weight (renders Medium — see FND-040) |
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
- **FND-056** (design-token) — the Badge/Label size scale (node 22966-4808) carries off-foundation
  values: Regular `13px` & Small `11px` font-size (type scale is 12/14/16…), `0.25px` tracking
  (off the letter-spacing scale; same precedent as loop-tag), and Regular's asymmetric `8/6` padding.
  Built faithfully as flagged literals; needs a published type/space primitive (or symmetric padding) to confirm.

See `findings/findings-register.md`.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for Badge to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-badge.css, dist/tokens.css and dist/theme.css are already pasted into the ODC
Theme editor (below OutSystems UI). The look is pure CSS + tokens — there is nothing for
you to style, and you must not write or edit CSS.

Task — this component RESTYLES a native OutSystems widget, so the work is using the right
widget, not generating styles. Referencing elements by name:
1. Use the native OutSystems widget this maps to (see this handover's "When to use" /
   "Variant mapping" section), not a custom element.
2. Apply each variant via the Extended Class property only (e.g. ExtendedClass =
   "<documented-modifier>") — never mutate OutSystems UI internals.
3. Build any screen/Block logic the screen needs around it.

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values. After
generating, list what you created by name and flag anything you could not finish.
```

## Checklist
- [ ] Rebuild `dist/theme.css` (`npm run build:theme`) and paste into the ODC Theme editor.
- [ ] **Option A:** add a Container with ExtendedClass `loop-badge loop-badge--<color>` (+ `loop-badge--heavy`).
- [ ] **Option B:** drop a native Tag widget, set Color, add `tag-heavy` for Heavy.
- [ ] Test all 6 colors × Light/Heavy × xLarge/Large/Regular/Small.
- [ ] 1-Click Publish → validate in a **real browser**.
