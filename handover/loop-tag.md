# Handover — loop-tag (custom CSS block)

The Loop **Tag** — compact pill label for categories, filters, and selections.
Figma: "Tag" [node 17313-5502].

**Approach:** Custom component. The native OutSystems UI `.tag` is too thin (centered
colored box, 3 sizes, color modifiers only — no icon/dismiss/selected/disabled). Built
as a pure-CSS BEM block (no JS) — colors/sizes/states via modifier classes; dismiss and
toggle/selection wired in OutSystems logic. Applied via `ExtendedClass` on a Container.

**Scope (this build):** 4 colors · 4 sizes · leading icon slot · dismissible · states
default/hover/focus/disabled/selected · **Meta Tag** leading slots (avatar / initials / flag).

**Meta Tag** (Figma "has Avatar / has Initials / has Flag" [node 17313-5506]): add
`loop-tag--meta` plus a leading slot element as the tag's first child — `loop-tag__avatar`
(24px round image), `loop-tag__initials` (24px round badge, blue-70 fill + white 10px bold
initials), or `loop-tag__flag` (25×18 image). The leading inset tightens to 8px so the slot
nestles against the pill edge.
**Out of scope (follow-up):** on-dark theme · toggle/interactive selection wiring ·
numbers/counter.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Tag page.

**What it is.** A pill label (`.loop-tag`) for categories, filters, and selections — optionally with an icon, dismiss, or selected state.

**When to use**
- Compact metadata labels, active filter chips, or selectable / dismissible tokens.

**When not to use** (reach for instead)
- A status with a dot/icon → **Badge / Status**.
- A non-interactive rectangular category label → **Badge / Label**.
- A clickable action → **Button**.

**How to use**
- Extended Class `loop-tag loop-tag--<color> loop-tag--<size>` on a Container. Add `--dismissible` (with the dismiss button), `--selected`, `--disabled`, or `--interactive` as needed.

## Files
| File | OutSystems destination |
|---|---|
| `tokens/component-tag.css` | Included automatically in `dist/theme.css` — paste theme into ODC Theme editor |
| `src/blocks/loop-tag.css` | Included automatically in `dist/theme.css` |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-tag.css</code> → Theme CSS (also folded into dist/theme.css)</summary>

```css
/* loop-tag.css — Tag: The Loop pill tag block (CSS only); native .tag is the Badge/Label, see loop-badge.css */

.loop-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--loop-tag-gap, 4px);
  box-sizing: border-box;
  height: var(--loop-tag-h-regular, 32px);             /* pinned height so the 1px border never grows the box */
  padding-block: 0;
  padding-inline: var(--loop-tag-padding-h, 12px);
  border: 1px solid;
  border-radius: var(--loop-tag-radius, 48px);
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-tag-label-size, 16px);
  line-height: var(--loop-tag-label-leading, 16px);
  letter-spacing: var(--loop-tag-label-tracking, 0.25px);
  font-weight: var(--loop-tag-label-weight, 400);
  white-space: nowrap;
}

/* ---- Color: blue (default) ---- */
.loop-tag,
.loop-tag--blue {
  background-color: var(--loop-tag-blue-bg, #f6fcff);
  border-color:     var(--loop-tag-blue-border, #169af3);
  color:            var(--loop-tag-blue-text, #004370);
}

/* ---- Color: purple ---- */
.loop-tag--purple {
  background-color: var(--loop-tag-purple-bg, #f1e1ff);
  border-color:     var(--loop-tag-purple-border, #c17cfe);
  color:            var(--loop-tag-purple-text, #763ba9);
}

/* ---- Color: green ---- */
.loop-tag--green {
  background-color: var(--loop-tag-green-bg, #f6fef0);
  border-color:     var(--loop-tag-green-border, #388004);
  color:            var(--loop-tag-green-text, #388004);
}

/* ---- Color: yellow ---- */
.loop-tag--yellow {
  background-color: var(--loop-tag-yellow-bg, #fef3d7);
  border-color:     var(--loop-tag-yellow-border, #896001);
  color:            var(--loop-tag-yellow-text, #896001);
}

/* ---- Sizes (label size held constant) ---- */
.loop-tag--small   { height: var(--loop-tag-h-small, 24px); }
.loop-tag--regular { height: var(--loop-tag-h-regular, 32px); }
.loop-tag--large   { height: var(--loop-tag-h-large, 40px); }
.loop-tag--xlarge  { height: var(--loop-tag-h-xlarge, 48px); }

/* ---- Label ---- */
.loop-tag__label {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;   /* truncate past 200px */
}

/* ---- Leading icon slot ---- */
/* Holds a Font Awesome glyph (`fa-solid fa-…` classes on the <i>) — font-size drives the
   glyph to the icon box; a slotted <svg>/<img> still fills the box. */
.loop-tag__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width:  var(--loop-tag-icon-size, 14px);
  height: var(--loop-tag-icon-size, 14px);
  font-size: var(--loop-tag-icon-size, 14px);
  line-height: 1;
}

.loop-tag__icon svg,
.loop-tag__icon img {
  width: 100%;
  height: 100%;
}

/* ---- Meta Tag — leading slot variants (avatar / initials / flag); add "loop-tag--meta", slot is the first child ---- */
.loop-tag--meta { padding-inline-start: var(--loop-tag-meta-lpad, 8px); }

/* Round avatar (image) */
.loop-tag__avatar {
  display: inline-flex;
  flex-shrink: 0;
  width:  var(--loop-tag-meta-size, 24px);
  height: var(--loop-tag-meta-size, 24px);
  border-radius: 50%;
  overflow: hidden;
}
.loop-tag__avatar img { width: 100%; height: 100%; object-fit: cover; }

/* Round initials badge */
.loop-tag__initials {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width:  var(--loop-tag-meta-size, 24px);
  height: var(--loop-tag-meta-size, 24px);
  border-radius: 50%;
  background-color: var(--loop-tag-initials-bg, #004370);
  color: var(--loop-tag-initials-color, #fff);
  font-size:      var(--loop-tag-initials-size, 10px);
  line-height:    var(--loop-tag-initials-size, 10px);
  font-weight:    var(--loop-tag-initials-weight, 700);
  letter-spacing: var(--loop-tag-initials-tracking, 0.25px);
}

/* Flag (rectangular image, slightly rounded) */
.loop-tag__flag {
  display: inline-flex;
  flex-shrink: 0;
  width:  var(--loop-tag-flag-w, 25px);
  height: var(--loop-tag-flag-h, 18px);
  border-radius: var(--loop-tag-flag-radius, 2px);
  overflow: hidden;
}
.loop-tag__flag img { width: 100%; height: 100%; object-fit: cover; }

/* ---- Dismiss button ---- */
.loop-tag__dismiss {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width:  var(--loop-tag-dismiss-size, 14px);
  height: var(--loop-tag-dismiss-size, 14px);
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font-size: var(--loop-tag-dismiss-size, 14px);
  line-height: 1;
  cursor: pointer;
}

.loop-tag__dismiss svg { width: 100%; height: 100%; }

.loop-tag__dismiss:focus-visible {
  outline: 2px solid var(--loop-tag-focus, #0071bc);
  outline-offset: 2px;
  border-radius: 2px;
}

/* ---- State: selected (bold label + filled high-bg, text on dark) ---- */
.loop-tag--selected {
  font-weight: var(--loop-tag-label-weight-selected, 700);
  color: var(--loop-tag-selected-text, #fff);
}

.loop-tag--selected,
.loop-tag--selected.loop-tag--blue   { background-color: var(--loop-tag-blue-selected-bg, #004370);   border-color: var(--loop-tag-blue-selected-bg, #004370); }
.loop-tag--selected.loop-tag--purple { background-color: var(--loop-tag-purple-selected-bg, #410179); border-color: var(--loop-tag-purple-selected-bg, #410179); }
.loop-tag--selected.loop-tag--green  { background-color: var(--loop-tag-green-selected-bg, #234f03);  border-color: var(--loop-tag-green-selected-bg, #234f03); }
.loop-tag--selected.loop-tag--yellow { background-color: var(--loop-tag-yellow-selected-bg, #896001); border-color: var(--loop-tag-yellow-selected-bg, #896001); }

/* ---- State: interactive hover (for selectable/toggle tags) ---- */
.loop-tag--interactive { cursor: pointer; }
.loop-tag--interactive:hover { filter: brightness(0.97); }

.loop-tag--interactive:focus-visible {
  outline: 2px solid var(--loop-tag-focus, #0071bc);
  outline-offset: 2px;
}

/* ---- State: disabled ---- */
.loop-tag--disabled {
  background-color: var(--loop-tag-disabled-bg, #e7edf3);
  border-color:     var(--loop-tag-disabled-border, #d4dee8);
  color:            var(--loop-tag-disabled-text, #00294d6b);
  cursor: not-allowed;
  pointer-events: none;
}

.loop-tag--disabled .loop-tag__dismiss { cursor: not-allowed; }

@media (prefers-reduced-motion: reduce) {
  .loop-tag--interactive { transition: none; }
}

/* The native .tag widget is restyled as the Badge/Label in loop-badge.css, not here; reach this pill via .loop-tag. */
```

</details>

## Usage in OutSystems
Add these classes to a **Container** via `ExtendedClass`:

```
loop-tag loop-tag--blue loop-tag--regular
```

- **Color:** `--blue` (default) | `--purple` | `--green` | `--yellow`
- **Size:** `--small` (24px) | `--regular` (32px, default) | `--large` (40px) | `--xlarge` (48px)
- **State:** `--selected` (bold label + filled bg) · `--disabled` · `--interactive` (hover/pointer for selectable tags)
- **Dismiss:** add `--dismissible` and include the dismiss button child

**Child structure:**
```
Container (loop-tag loop-tag--blue loop-tag--regular loop-tag--dismissible)
  └─ Icon (loop-tag__icon)            ← optional leading icon, aria-hidden
  └─ Expression/Text (loop-tag__label)  ← the label text
  └─ Button (loop-tag__dismiss)        ← optional; aria-label "Remove …"; wire OnClick to remove the tag
```
Example rendered markup:
```html
<span class="loop-tag loop-tag--blue loop-tag--regular loop-tag--dismissible">
  <i class="loop-tag__icon" aria-hidden="true"><!-- icon glyph --></i>
  <span class="loop-tag__label">Filter: Active</span>
  <button type="button" class="loop-tag__dismiss" aria-label="Remove Active filter">×</button>
</span>
```

## API (key CSS tokens)
| Token | Default | Description |
|---|---|---|
| `--loop-tag-radius` | `48px` | Pill radius (FND-028: ≠ `--radius-pill` 32px) |
| `--loop-tag-padding-h` | `12px` | Horizontal padding (no vertical padding — height is pinned, label flex-centred; FND-029 resolved) |
| `--loop-tag-gap` | `4px` | Gap between slot and label |
| `--loop-tag-icon-size` / `--loop-tag-dismiss-size` | `14px` | Leading icon / dismiss glyph |
| `--loop-tag-label-size` | `16px` | Label text size (constant across sizes) |
| `--loop-tag-h-{small,regular,large,xlarge}` | `24/32/40/48px` | Fixed height per size (pinned) |

## Colors
| Color | Background | Border | Text | Selected bg |
|---|---|---|---|---|
| blue (default) | `#f6fcff` (blue-05) | `#169af3` (blue-40) | `#004370` (blue-70) | `#004370` (blue-70) |
| purple | `#f1e1ff` (purple-10) | `#c17cfe` (purple-40) | `#763ba9` (purple-60) | `#410179` (purple-80) |
| green | `#f6fef0` (green-03) | `#388004` (green-60) | `#388004` (green-60) | `#234f03` (green-70) |
| yellow | `#fef3d7` (yellow-03) | `#896001` (yellow-base) | `#896001` (yellow-base) | yellow-90 |

Selected text = white (FND-030 — on-dark text token deferred). Disabled = `#e7edf3` bg /
`#d4dee8` border / `#00294d6b` text.

## Accessibility (WCAG 2.2 AA)
- `loop-tag__dismiss` is a real `<button>` with `aria-label`; focus ring in
  `--color-domain-interactive-focused` (blue-50 `#0071bc`).
- `--interactive` tags get a `:focus-visible` ring; wire keyboard activation in OutSystems.
- Leading icon is decorative (`aria-hidden`); the label carries the meaning.
- `prefers-reduced-motion` honored.
- Selected state uses **bold weight + fill**, not color alone.

## Related findings (register-only, awaiting design)
FND-028 (radius 48 vs pill 32) · FND-029 (size/vpadding metrics not fully tokenised) ·
FND-030 (selected-state colors inferred). See `findings/findings-register.md`.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for Tag to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-tag.css and dist/theme.css are already pasted into the ODC
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
- [ ] In a test screen, add a Container with ExtendedClass `loop-tag loop-tag--blue loop-tag--regular`.
- [ ] Add child `loop-tag__label` (+ optional `loop-tag__icon`).
- [ ] For dismissible tags, add the `loop-tag__dismiss` button and wire its OnClick to remove the tag.
- [ ] Test all 4 colors × 4 sizes, selected, disabled, and dismissible.
- [ ] 1-Click Publish → validate in a **real browser** (focus ring, keyboard).
