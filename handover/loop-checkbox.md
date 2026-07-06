# Handover — Checkbox (restyle native OutSystems UI `[data-checkbox]`)

The Loop **Checkbox** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Checkbox" [node 19336-17679].

**Approach:** This does NOT introduce a custom checkbox widget. It **restyles the native
OutSystems UI Checkbox widget** (`[data-checkbox]`) to The Loop design — same pattern the
project uses for the Button (`loop-button.css`). Developers keep using the standard
OutSystems **Checkbox** widget; the theme makes it look like The Loop. The box graphic is
the input's `::before`; the check / dash glyph is its `::after`.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Checkbox page.

**What it is.** The Loop checkbox — native OutSystems Checkbox restyled (box + check/dash glyph).

**When to use**
- Independent on/off choices.
- Selecting **zero or more** items from a list.
- A single consent / agree toggle inside a form that is saved on submit.

**When not to use** (reach for instead)
- One-of-many **exclusive** choice → **Radio Button**.
- An instant-apply on/off setting → **Switch**.
- Choose one from a long list → **Dropdown / Select**.

**How to use**
- Use the native **Checkbox** widget; supports checked, indeterminate (dash), and disabled.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-checkbox.css` | Theme CSS (paste **below** OutSystems UI so it wins) |

No new global tokens — the component sizing (visible box = named size 28/24/20/16, 4 radius)
is defined as `--loop-checkbox-*` custom properties scoped to `[data-checkbox]`, and all colors
reference existing semantic tokens already in `dist/theme.css`.

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-checkbox.css</code> → Theme CSS — paste below OutSystems UI</summary>

```css
/* loop-checkbox.css — Checkbox: native [data-checkbox] restyle (::before box + ::after check/dash) */

/* ---- Size tokens — default = REGULAR; also seeds the .loop-checkbox-field wrapper ---- */
[data-checkbox],
.loop-checkbox-field {
  --loop-checkbox-control-size: 20px;
  --loop-checkbox-box-size: var(--loop-checkbox-control-size);
  --loop-checkbox-radius: var(--radius-base, 4px);
  --loop-checkbox-glyph: var(--color-white, #ffffff);
  --loop-checkbox-stroke: calc(var(--loop-checkbox-box-size) * 0.125);
  --loop-checkbox-gap: var(--space-tiny, 4px);
  --loop-checkbox-label-size: 13px;
  --loop-checkbox-label-leading: 15px;
  --loop-checkbox-label-tracking: 0px;              /* Regular step is 0 (Figma 19336-17818); 0.25 is the Small step */
  --loop-checkbox-group-row: 10px;
}

/* ---- Base [data-checkbox] → The Loop identity + Unchecked (enabled) look ---- */
[data-checkbox] {
  appearance: none;                                   /* hide native control; ::before is the box */
  position: relative;
  box-sizing: border-box;
  width: var(--loop-checkbox-control-size);
  height: var(--loop-checkbox-control-size);
  padding: var(--space-none, 0px);
  cursor: pointer;
}

/* The visible box — fills the control (== the named size) */
[data-checkbox]::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: var(--loop-checkbox-box-size);
  height: var(--loop-checkbox-box-size);
  box-sizing: border-box;
  border: var(--border-size-s, 1px) solid var(--color-outline-on-light-default);
  border-radius: var(--loop-checkbox-radius);
  background: var(--color-bg-container-on-light-lowest, var(--color-white));
  opacity: 1;
  transition: background-color 180ms linear, border-color 180ms linear;
}

/* ---- Hover → blue-70 border ---- */
[data-checkbox]:hover::before,
.desktop [data-checkbox]:hover::before {
  border-color: var(--color-outline-primary);
}

/* ---- Checked → filled blue-70 + white check (glyph scales with the box) ---- */
[data-checkbox]:checked::before {
  background: var(--color-bg-link-primary-enabled);
  border-color: var(--color-bg-link-primary-enabled);
}
[data-checkbox]:checked::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 46%;                                             /* slight optical lift */
  width: calc(var(--loop-checkbox-box-size) * 0.5);
  height: calc(var(--loop-checkbox-box-size) * 0.25);
  border-left: var(--loop-checkbox-stroke) solid var(--loop-checkbox-glyph);
  border-bottom: var(--loop-checkbox-stroke) solid var(--loop-checkbox-glyph);
  border-top: 0px;
  border-right: 0px;
  background: none;
  transform: translate(-50%, -50%) rotate(-45deg);
}

/* ---- Multi / indeterminate → filled blue-70 + white dash; via .loop-checkbox--indeterminate or :indeterminate ---- */
[data-checkbox]:indeterminate::before,
[data-checkbox].loop-checkbox--indeterminate::before {
  background: var(--color-bg-link-primary-enabled);
  border-color: var(--color-bg-link-primary-enabled);
}
[data-checkbox]:indeterminate::after,
[data-checkbox].loop-checkbox--indeterminate::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: calc(var(--loop-checkbox-box-size) * 0.5);
  height: var(--loop-checkbox-stroke);
  border: 0px;
  border-radius: 1px;
  background: var(--loop-checkbox-glyph);
  transform: translate(-50%, -50%);
}

/* ---- Disabled → neutral fill + low-contrast border, faint glyph ---- */
[data-checkbox][disabled],
[data-checkbox][aria-disabled="true"] {
  pointer-events: none;
  cursor: default;
}
[data-checkbox][disabled]::before,
[data-checkbox][disabled]:checked::before,
[data-checkbox][disabled]:indeterminate::before,
[data-checkbox][disabled].loop-checkbox--indeterminate::before,
[data-checkbox][aria-disabled="true"]::before {
  background: var(--color-domain-state-disable-low);
  border-color: var(--color-outline-on-light-state-disable-low);
}
/* Re-assert check geometry for disabled checked — the OS UI baseline's
 * [disabled]:checked::after border-left / border-bottom bleed through
 * and make the mark appear thicker than the enabled check. */
[data-checkbox][disabled]:checked::after,
[data-checkbox][aria-disabled="true"]:checked::after {
  width: 10px;
  height: 5px;
  border-left: 2.5px solid var(--color-white, #ffffff);
  border-bottom: 2.5px solid var(--color-white, #ffffff);
  border-top: 0;
  border-right: 0;
  background: none;
}
/* Re-assert dash geometry for disabled indeterminate — the OS UI baseline adds
 * border-based styling to [disabled]::after that makes the mark appear thicker. */
[data-checkbox][disabled]:indeterminate::after,
[data-checkbox][aria-disabled="true"]:indeterminate::after {
  width: 10px;
  height: 2.5px;
  border: 0;
  border-radius: 1px;
  background: var(--color-white, #ffffff);
}

/* Disabled glyph — re-assert our check geometry over the OS UI baseline (its
   [disabled]:checked:after borders all 4 sides and deforms the mark); recolor to the muted token. */
[data-checkbox][disabled]:checked::after,
[data-checkbox][aria-disabled="true"]:checked::after {
  border-left: var(--loop-checkbox-stroke) solid var(--color-icon-on-light-state-disabled);
  border-bottom: var(--loop-checkbox-stroke) solid var(--color-icon-on-light-state-disabled);
  border-top: 0px;
  border-right: 0px;
}
[data-checkbox][disabled]:indeterminate::after,
[data-checkbox][disabled].loop-checkbox--indeterminate::after,
[data-checkbox][aria-disabled="true"]:indeterminate::after {
  background: var(--color-icon-on-light-state-disabled);
}

/* ---- Error / Required → red-70 outline (unchecked) + fill (checked/multi); via .loop-checkbox--error or [aria-invalid].
   Deliberately NOT cascaded from .loop-field--error: the group-level error state renders as a red
   helper line with default boxes (Figma 19336-17818) — mark individual boxes invalid explicitly. ---- */
[data-checkbox].loop-checkbox--error::before,
[data-checkbox].loop-checkbox--required::before,
[data-checkbox][aria-invalid="true"]::before {
  border-color: var(--color-outline-on-light-state-error-high);
}
[data-checkbox].loop-checkbox--error:checked::before,
[data-checkbox].loop-checkbox--error:indeterminate::before,
[data-checkbox].loop-checkbox--error.loop-checkbox--indeterminate::before,
[data-checkbox].loop-checkbox--required:checked::before,
[data-checkbox].loop-checkbox--required:indeterminate::before,
[data-checkbox].loop-checkbox--required.loop-checkbox--indeterminate::before,
[data-checkbox][aria-invalid="true"]:checked::before,
[data-checkbox][aria-invalid="true"]:indeterminate::before,
[data-checkbox][aria-invalid="true"].loop-checkbox--indeterminate::before {
  background: var(--color-bg-container-state-error-high);
  border-color: var(--color-bg-container-state-error-high);
}

/* ============================================================
   Sizing — Figma 19336-17818: box + label + gaps step TOGETHER.
   ============================================================ */

/* Field Wrapper cascade — a .loop-field--* size on the wrapping Field (loop-text-field.css)
   re-points the checkbox tokens for everything inside, so a Checkbox (or group) dropped into a
   sized Field Wrapper follows the wrapper. The base [data-checkbox]/.loop-checkbox-field rule
   above declares Regular directly on the elements, so this cascade must target them too —
   :where() keeps it at base weight and the explicit .loop-checkbox-* classes below still win. */
:where(.loop-field--xlarge) :is([data-checkbox], .loop-checkbox-field, .loop-checkbox-group) {
  --loop-checkbox-control-size: 28px;
  --loop-checkbox-gap: var(--space-checkbox-gap, 8px);
  --loop-checkbox-label-size: var(--font-size-300, 16px);
  --loop-checkbox-label-leading: 18px;
  --loop-checkbox-label-tracking: var(--letter-spacing-none, 0px);
  --loop-checkbox-group-row: 14px;
  --loop-checkbox-group-col: 20px;
}
:where(.loop-field--large) :is([data-checkbox], .loop-checkbox-field, .loop-checkbox-group) {
  --loop-checkbox-control-size: 24px;
  --loop-checkbox-gap: var(--space-checkbox-gap, 8px);
  --loop-checkbox-label-size: var(--font-size-200, 14px);
  --loop-checkbox-label-leading: 16px;
  --loop-checkbox-label-tracking: var(--letter-spacing-none, 0px);
  --loop-checkbox-group-row: 12px;
  --loop-checkbox-group-col: 20px;
}
:where(.loop-field--regular) :is([data-checkbox], .loop-checkbox-field, .loop-checkbox-group) {
  --loop-checkbox-control-size: 20px;
  --loop-checkbox-gap: var(--space-tiny, 4px);
  --loop-checkbox-label-size: 13px;
  --loop-checkbox-label-leading: 15px;
  --loop-checkbox-label-tracking: 0px;
  --loop-checkbox-group-row: 10px;
  --loop-checkbox-group-col: 16px;
}
:where(.loop-field--small) :is([data-checkbox], .loop-checkbox-field, .loop-checkbox-group) {
  --loop-checkbox-control-size: 16px;
  --loop-checkbox-gap: var(--space-tiny, 4px);
  --loop-checkbox-label-size: var(--font-size-100, 12px);
  --loop-checkbox-label-leading: 14px;
  --loop-checkbox-label-tracking: 0.25px;
  --loop-checkbox-group-row: 8px;
  --loop-checkbox-group-col: 14px;
}

/* ---- Size modifiers — class on the widget (scales box), on .loop-checkbox-field (scales
   label too) or on .loop-checkbox-group (scales the group gaps). Declared after the wrapper
   cascade, so a per-instance size always wins inside a differently-sized Field Wrapper. ---- */
.loop-checkbox-xlarge {
  --loop-checkbox-control-size: 28px;
  --loop-checkbox-gap: var(--space-checkbox-gap, 8px);
  --loop-checkbox-label-size: var(--font-size-300, 16px);
  --loop-checkbox-label-leading: 18px;
  --loop-checkbox-label-tracking: var(--letter-spacing-none, 0px);
  --loop-checkbox-group-row: 14px;
  --loop-checkbox-group-col: 20px;
}
.loop-checkbox-large {
  --loop-checkbox-control-size: 24px;
  --loop-checkbox-gap: var(--space-checkbox-gap, 8px);
  --loop-checkbox-label-size: var(--font-size-200, 14px);
  --loop-checkbox-label-leading: 16px;
  --loop-checkbox-label-tracking: var(--letter-spacing-none, 0px);
  --loop-checkbox-group-row: 12px;
  --loop-checkbox-group-col: 20px;
}
.loop-checkbox-regular {                              /* explicit Regular — same as default */
  --loop-checkbox-control-size: 20px;
  --loop-checkbox-gap: var(--space-tiny, 4px);
  --loop-checkbox-label-size: 13px;
  --loop-checkbox-label-leading: 15px;
  --loop-checkbox-label-tracking: 0px;
  --loop-checkbox-group-row: 10px;
  --loop-checkbox-group-col: 16px;
}
.loop-checkbox-small {
  --loop-checkbox-control-size: 16px;
  --loop-checkbox-gap: var(--space-tiny, 4px);
  --loop-checkbox-label-size: var(--font-size-100, 12px);
  --loop-checkbox-label-leading: 14px;
  --loop-checkbox-label-tracking: 0.25px;
  --loop-checkbox-group-row: 8px;
  --loop-checkbox-group-col: 14px;
}

/* ---- Optional field wrapper — box + label laid out with the size's gap ---- */
.loop-checkbox-field {
  display: inline-flex;
  align-items: center;
  gap: var(--loop-checkbox-gap);
}
.loop-checkbox-field__label,
.loop-checkbox-field > label {
  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-weight: var(--font-weight-regular, 400);
  font-size: var(--loop-checkbox-label-size);
  line-height: var(--loop-checkbox-label-leading);
  letter-spacing: var(--loop-checkbox-label-tracking);
  color: var(--color-text-on-light-default);
  cursor: pointer;
}
.loop-checkbox-field:has([data-checkbox][disabled]) .loop-checkbox-field__label,
.loop-checkbox-field:has([data-checkbox][disabled]) > label {
  color: var(--color-text-on-light-state-disabled);
  cursor: default;
}
.loop-checkbox-field:has(.loop-checkbox--error) .loop-checkbox-field__label,
.loop-checkbox-field:has([aria-invalid="true"]) .loop-checkbox-field__label,
.loop-checkbox-field:has(.loop-checkbox--error) > label,
.loop-checkbox-field:has([aria-invalid="true"]) > label {
  color: var(--color-text-on-light-state-error);
}

/* ---- Group layout — vertical default; .is-horizontal for a row ---- */
.loop-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: var(--loop-checkbox-group-row, 10px);
}
.loop-checkbox-group.is-horizontal {
  flex-direction: row;
  align-items: center;
  /* column gap steps with the size: 20/20/16/14 (Figma 19336-17818); Regular 16 is the default */
  gap: var(--loop-checkbox-group-col, var(--space-small, 16px));
}

/* ---- Focus indicator (WCAG 2.2 SC 2.4.7/2.4.13) — design's own brand color ---- */
[data-checkbox]:focus-visible {
  outline: 2px solid var(--color-outline-on-light-link-focused, var(--color-blue-50));
  outline-offset: 2px;
  border-radius: var(--loop-checkbox-radius);
}

/* ---- Reduced motion (WCAG 2.2 SC 2.3.3) ---- */
@media (prefers-reduced-motion: reduce) {
  [data-checkbox]::before { transition: none; }
}
```

</details>

## State / type mapping (Figma → native checkbox)
| The Loop | OutSystems / DOM | How |
|---|---|---|
| **Unchecked** (enabled) | base `[data-checkbox]` | native, no extra class |
| **Checked** (Yes) | `:checked` | native checked |
| **Multi** (indeterminate) | `.loop-checkbox--indeterminate` | Extended Class = `loop-checkbox--indeterminate` (no JS needed); also matches the native `:indeterminate` if set via JS |
| **Disabled** | `[disabled]` / `[aria-disabled="true"]` | native Enabled = False |
| **Error / Required** | `.loop-checkbox--error` or `[aria-invalid="true"]` | Extended Class = `loop-checkbox--error`; OR auto when OutSystems validation sets `aria-invalid` |

## What the override changes vs OutSystems UI baseline
- Visible box = the named size (XLarge **28** · Large **24** · Regular **20** · Small **16**), radius **4px** — the box fills the control, matching the sibling Radio circle at each size (no padding-inset frame that shrank the box).
- **Checked fill = blue-70 (#004370)** with a white check; **hover border = blue-70** (Outline/Primary).
- Adds an **indeterminate ("Multi") dash** — OutSystems UI has no native indeterminate style; driven by the `.loop-checkbox--indeterminate` class (Extended Class) so no JS is required.
- Adds an **Error/Required red-70 type** (`#9d161d`) — box border (unchecked) and fill (checked/multi).
- Disabled: neutral-15 fill (#dae3eb), neutral-20 border (#d4dee8). The check/dash **glyph is re-asserted at the correct stroke size** and recolored to the muted disabled-icon token (neutral-40) — the OutSystems UI baseline otherwise re-draws `[disabled]:checked:after` with `border: var(--border-size-l)` on all four sides, deforming the mark.

## Sizes (XLarge / Large / Regular / Small)
The **visible box scales** with the size class — XLarge 28 · Large 24 · Regular 20 (default) · Small 16 —
filling the control so it matches the sibling Radio circle at each size. The check/dash glyph scales
proportionally with the box, and the **label** text scales via the `LABEL SIZE` variable. Put the size
class on the Checkbox widget's Extended Class (scales the box) or on a `.loop-checkbox-field` wrapper
(scales box + label together).

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for Checkbox to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-checkbox.css and dist/theme.css are already pasted into the ODC
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
- [ ] Ensure latest `dist/theme.css` is pasted into the ODC Theme editor (provides the semantic color tokens).
- [ ] Paste `loop-checkbox.css` into Theme CSS, below OutSystems UI.
- [ ] Use the native **Checkbox** widget. For Multi/indeterminate, set Extended Class = `loop-checkbox--indeterminate` (no JS needed).
- [ ] For Error/Required, set Extended Class = `loop-checkbox--error` (or rely on OutSystems `aria-invalid`).
- [ ] Always pair the checkbox with a real `<label>` / accessible name.
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview).

## Open findings linked to this work
- **FND-016** (a11y/contrast, medium) — unchecked border `#00396b3d` ≈ 1.45:1 vs white fails WCAG 2.2 SC 1.4.11 (3:1 boundary). Register-only; built faithfully.
- **FND-017** (consistency/a11y, low) — "Required" renders in error-red by default, identical to the Error type. Register-only; built faithfully.
