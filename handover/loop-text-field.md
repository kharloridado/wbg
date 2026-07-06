# Handover — Text Field (restyle native OutSystems UI Input)

The Loop **Text Field** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Text Field" [node 19336-9606] · Text Area responsive [node 19336-10332].

**Approach:** This does NOT introduce a custom input class. It **restyles the native
OutSystems UI Input widget** (`.form-control[data-input]` / `[data-textarea]`) to The Loop
design — same pattern as the Button/Button Group. Developers keep using the standard
OutSystems **Input** widget; native form **validation** drives the Error state. The
Label + helper-text arrangement is a thin BEM wrapper (`loop-field`) applied via Extended
Class on the field Container.

> **For new fields, prefer the Field Wrapper Block** (`handover/loop-field-wrapper.md`) —
> it packages this restyle with the FieldLabel row (required `*` / `(optional)` / character
> count) and `Size` / `Layout` parameters. This page is the bare restyle it builds on.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Text Field page.

**What it is.** The Loop input — native OutSystems Input restyled, with a `loop-field` label/helper wrapper.

**When to use**
- Collect single-line (or multi-line textarea) text or numbers — names, emails, search, amounts — with a label, optional helper text, and validation/error state.

**When not to use** (reach for instead)
- Choose from preset options → **Dropdown / Select**.
- An on/off choice → **Switch** or **Checkbox**.

**How to use**
- Use the native **Input** widget; wrap the field Container with Extended Class `loop-field`. Native form validation drives the Error state. Sizes available via the size classes.
- **Text Area is responsive out of the box** (Figma 19336-10332): spacing and type step per OutSystems device class — desktop `12/16` padding · `14/18` text · `16` label; tablet `8/12` · `14/18` · `14`; phone `8/8` · `12/16` · `14`. Nothing to configure — the CSS keys off the platform's `.tablet`/`.phone` body classes. An explicit size (`.loop-field--*`) still overrides the device default. The label step needs either the wrapper to contain the textarea (`:has()`, automatic) or the Extended Class `loop-field--textarea` on the wrapper.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-text-field.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/component-field.css` → `dist/theme.css` | Theme CSS (adds the `--loop-field-*` tokens) |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-text-field.css</code> → Theme CSS — paste below OutSystems UI</summary>

```css
/* loop-text-field.css — Text Field: native Input/textarea restyle + .loop-field label wrapper */

/* ---- Field box — The Loop identity (Default / Filled / Focused share this) ---- */
.form-control[data-input],
.form-control[data-textarea] {
  height: auto;
  padding: var(--loop-field-padding-block, 18px) var(--loop-field-padding-inline, 16px);
  gap: var(--loop-field-gap, 8px);

  background-color: var(--color-bg-container-on-light-lowest);
  border: 1px solid var(--color-outline-on-light-default);
  border-radius: var(--loop-field-radius, 8px);
  color: var(--color-text-on-light-default);

  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-text-size, 13px);   /* Regular text — the family default (token: component-field.css) */
  font-weight: var(--loop-field-text-weight, 400);
  line-height: var(--loop-field-text-leading, 16px);
  letter-spacing: var(--loop-field-text-tracking, 0.5px);
}

/* Textarea inherits the shared --loop-field-radius (8px soft-rounded default); no override needed. */

/* Regular (default) — overrides the shared rule's 18px (xLarge) padding-block to make a 40px single-line input. */
.form-control[data-input] {
  height: 40px;                  /* pinned height; border-box keeps it deterministic */
  padding-block: 11px;
}

/* ---- Text Area — responsive (Figma 19336-10332: "spacing and font adjusted based on breakpoint").
   Desktop values come from the --loop-textarea-* tokens (component-field.css); .tablet/.phone
   re-point them at the smaller steps. font-size is re-declared inside the device rules because
   OutSystems UI sets it directly on .tablet/.phone .form-control[data-textarea] at (0,3,0),
   which outranks the (0,2,0) base rule that consumes the custom prop. ---- */
.form-control[data-textarea] {
  min-height: var(--loop-textarea-min-h, 80px);
  padding: var(--loop-textarea-padding-block, 12px) var(--loop-textarea-padding-inline, 16px);
  font-size: var(--loop-textarea-text-size, 14px);
  line-height: var(--loop-textarea-text-leading, 18px);
}
.tablet .form-control[data-textarea] {
  --loop-textarea-padding-block:  var(--space-xxsmall);   /* 8px */
  --loop-textarea-padding-inline: var(--space-xsmall);    /* 12px */
  font-size: var(--loop-textarea-text-size, 14px);
}
.phone .form-control[data-textarea] {
  --loop-textarea-padding-block:  var(--space-xxsmall);   /* 8px */
  --loop-textarea-padding-inline: var(--space-xxsmall);   /* 8px */
  --loop-textarea-text-size:      var(--font-size-100);   /* 12px */
  --loop-textarea-text-leading:   16px;
  font-size: var(--loop-textarea-text-size, 12px);
}
/* Wrapper size → Text Area: an explicit .loop-field--* size re-points the textarea type at the
   shared field step (text 16/14/13/12, leading 16/16/14/12) on EVERY device — placed after the
   device rules at the same (0,3,0) specificity so the size step wins over the responsive default. */
.loop-field--xlarge  .form-control[data-textarea],
.loop-field--large   .form-control[data-textarea],
.loop-field--regular .form-control[data-textarea],
.loop-field--small   .form-control[data-textarea] {
  font-size: var(--loop-field-text-size);
  line-height: var(--loop-field-text-leading, 16px);
}

/* Placeholder colour */
.form-control[data-input]::placeholder,
.form-control[data-textarea]::placeholder {
  color: var(--color-neutral-alpha-57);
  opacity: 1;                                                     /* Firefox dims placeholders by default */
}

/* Hover — subtle border darken */
.form-control[data-input]:hover,
.form-control[data-textarea]:hover {
  border-color: var(--color-outline-on-light-emphasis);
}

/* Focused — drawn as a 1px border + 1px inset box-shadow (not a 2px border) so border-width
   and padding stay constant, never nudging the text or clobbering the Search icon's padding-left. */
.form-control[data-input]:focus,
.form-control[data-input]:focus-visible,
.form-control[data-textarea]:focus,
.form-control[data-textarea]:focus-visible {
  outline: none;
  border-color: var(--color-outline-on-light-link-focused);
  box-shadow: inset 0 0 0 1px var(--color-outline-on-light-link-focused);
}

/* Animated Label — OSUI strips these inputs to underline-only (border: none + 1px bottom
   border, _animated-label.scss). The box focus ring doesn't apply here: focus shows on the
   bottom border alone, in the same Loop focus colour. */
.animated-label .form-control[data-input]:focus,
.animated-label .form-control[data-input]:focus-visible,
.animated-label .form-control[data-textarea]:focus,
.animated-label .form-control[data-textarea]:focus-visible {
  box-shadow: none;
  border-bottom-color: var(--color-outline-on-light-link-focused);
}

/* ---- Error — native .not-valid (set by OutSystems form validation) ---- */
.form-control[data-input].not-valid,
.form-control[data-textarea].not-valid {
  background-color: var(--color-bg-container-state-error-low);
  border-color: var(--color-outline-on-light-state-error-high);
  color: var(--color-text-on-state-error-emphasis);
}
.form-control[data-input].not-valid::placeholder,
.form-control[data-textarea].not-valid::placeholder {
  color: var(--color-text-on-state-error-emphasis);
}

/* ---- Warning — added modifier .is-warning (no native input warning state) ---- */
.form-control[data-input].is-warning,
.form-control[data-textarea].is-warning {
  background-color: var(--color-domain-state-warning-low);
  border-color: var(--color-outline-on-light-state-warning-high);
  color: var(--color-text-on-state-warning-emphasis);
}
.form-control[data-input].is-warning::placeholder,
.form-control[data-textarea].is-warning::placeholder {
  color: var(--color-text-on-state-warning-emphasis);
}

/* ---- Disabled — native [disabled] / aria-disabled; rendered borderless via the disable fill ---- */
.form-control[data-input][disabled],
.form-control[data-input][aria-disabled="true"],
.form-control[data-textarea][disabled],
.form-control[data-textarea][aria-disabled="true"] {
  background-color: var(--color-domain-state-disable-low);
  border-color: var(--color-domain-state-disable-low);
  color: var(--color-text-on-light-state-disabled);
}

/* ---- Read-Only — added modifier .is-read-only (borderless plain text) ---- */
.form-control[data-input].is-read-only,
.form-control[data-textarea].is-read-only {
  background-color: transparent;
  border-color: transparent;
  padding-inline: 0px;
}

/* ---- Sizes — native .input-large / .input-small + added .input-xlarge / .input-regular.
   Text/placeholder steps 16 / 14 / 13 / 12 with leading 16 / 16 / 14 / 12 (Figma 19336-9729)
   via --loop-field-text-size/-leading, mirroring the .loop-field--* wrapper modifiers so bare
   and wrapped fields render identically. font-size is declared here (not only on the base rule)
   because OutSystems UI sets font-size directly on .input-large/.input-small at the same
   (0,3,0) specificity, which outranks the (0,2,0) base rule that consumes the custom prop. ---- */
.form-control[data-input].input-xlarge {
  --loop-field-text-size: 16px;
  --loop-field-text-leading: 16px;
  font-size: var(--loop-field-text-size);
  height: 56px;
  padding-block: var(--loop-field-padding-block, 18px);
}
.form-control[data-input].input-large {
  --loop-field-text-size: 14px;
  --loop-field-text-leading: 16px;
  font-size: var(--loop-field-text-size);
  height: 48px;
  padding-block: 14px;
}
.form-control[data-input].input-regular {
  --loop-field-text-size: 13px;
  --loop-field-text-leading: 14px;
  font-size: var(--loop-field-text-size);
  height: 40px;
  padding-block: 11px;
}
.form-control[data-input].input-small {
  --loop-field-text-size: 12px;
  --loop-field-text-leading: 12px;
  --loop-field-padding-inline: var(--space-xsmall, 12px);   /* Small pulls the side padding in (Figma 19336-9755) */
  font-size: var(--loop-field-text-size);
  height: 32px;
  padding-block: 8px;
}
/* Tablet/phone — OutSystems UI re-asserts font-size on .input-small at (0,4,0)
   (.tablet .form-control[data-input].input-small { font-size: var(--font-size-xs) }),
   which would override the 12px step; match its specificity to keep the Loop size. */
.tablet .form-control[data-input].input-small,
.phone .form-control[data-input].input-small {
  font-size: var(--loop-field-text-size);
}
/* No per-size focus padding compensation: the focus ring is an inset box-shadow, so padding stays constant. */

/* ============================================================
   Field wrapper — Label + Input + Helper layout (BEM, applied via Extended Class)
   ============================================================ */
.loop-field {
  display: flex;
  flex-direction: column;
  gap: var(--loop-field-label-gap, 6px);
}

/* Horizontal label — label sits inline, left of the input */
.loop-field--horizontal {
  flex-direction: row;
  align-items: center;
  gap: var(--space-small, 16px);
}

/* Rounded (pill) variant — opt-in per instance. Overrides the 8px soft-rounded default with the
   32px pill for the Text Input, Text Area, and Dropdown/Select inside this wrapper. The custom
   props cascade to the field box, native dropdown-display, and VirtualSelect wrapper alike. */
.loop-field--rounded {
  --loop-field-radius: var(--radius-pill);   /* 32px */
  --loop-select-radius: var(--radius-pill);  /* 32px */
}

/* Field Wrapper size — one modifier on the wrapper scales the WHOLE field: the label row and
   the input/placeholder text both step 16 / 14 / 13 / 12 across xLarge / Large / Regular /
   Small (Figma 19336-9729), plus the pinned input height. It works by setting the same custom
   props the label rule (--loop-field-label-*) and the field-box rule (--loop-field-text-*)
   already read, so the label scales "including the label" without extra markup. The bare
   .input-* size classes stay for standalone inputs (Search, plain Text Field).
   The same modifier also cascades into every sizeable control placed in the Input placeholder —
   Text Area (rule above), Search glass (loop-search.css), Checkbox (loop-checkbox.css) and
   Toggle/Switch (loop-switch.css) each listen to .loop-field--* and step their own tokens. */
.loop-field--xlarge  { --loop-field-label-size: 16px; --loop-field-label-tracking: 0px;    --loop-field-text-size: 16px; --loop-field-text-leading: 16px; --loop-textarea-text-size: 16px; }
.loop-field--large   { --loop-field-label-size: 14px; --loop-field-label-tracking: 0px;    --loop-field-text-size: 14px; --loop-field-text-leading: 16px; --loop-textarea-text-size: 14px; }
.loop-field--regular { --loop-field-label-size: 13px; --loop-field-label-tracking: 0.25px; --loop-field-text-size: 13px; --loop-field-text-leading: 14px; --loop-textarea-text-size: 13px; }
.loop-field--small   { --loop-field-label-size: 12px; --loop-field-label-tracking: 0.5px;  --loop-field-text-size: 12px; --loop-field-text-leading: 12px; --loop-textarea-text-size: 12px;
                       --loop-field-padding-inline: var(--space-xsmall, 12px); }           /* Small pulls the side padding in (Figma 19336-9755) */
.loop-field--xlarge  .form-control[data-input] { height: 56px; padding-block: var(--loop-field-padding-block, 18px); }
.loop-field--large   .form-control[data-input] { height: 48px; padding-block: 14px; }
.loop-field--regular .form-control[data-input] { height: 40px; padding-block: 11px; }
.loop-field--small   .form-control[data-input] { height: 32px; padding-block: 8px; }

/* Device: the Text Area wrapper's label steps 16 → 14 on tablet/phone (Figma 19336-10332).
   :where() keeps these at zero specificity so an explicit .loop-field--* size modifier still
   wins. Two rules, not one list: the :has() rule stays independent of the explicit
   .loop-field--textarea modifier (the ExtendedClass hook for markup that can't rely on :has()). */
:where(.tablet, .phone) :where(.loop-field--textarea) {
  --loop-field-label-size: var(--font-size-200);   /* 14px */
}
:where(.tablet, .phone) :where(.loop-field:has(.form-control[data-textarea])) {
  --loop-field-label-size: var(--font-size-200);   /* 14px */
}

/* Styles the native label ([data-label]); the plain `label` selector is the fallback when the widget renders without it. */
.loop-field [data-label],
.loop-field label {
  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-label-size, 16px);
  font-weight: var(--loop-field-label-weight, 600);
  line-height: var(--loop-field-label-leading, 16px);
  letter-spacing: var(--loop-field-label-tracking, 0px);
  color: var(--color-text-on-light-default);
}
/* Required marker — hooks OutSystems' native .mandatory class, not a custom modifier. */
.loop-field [data-label].mandatory::after,
.loop-field label.mandatory::after {
  content: " *";
  color: var(--color-text-on-light-state-error);
  margin-left: var(--space-xtiny, 2px);
}

/* ============================================================
   FieldLabel row — leading required asterisk + label + (optional) + word-count badge.
   The Field Wrapper Block renders this row above (or, in horizontal layout, beside) the
   input. It composes the existing label typography rule above; the row chrome (asterisk /
   optional / count) is driven by the Block's IsRequired / IsOptional / ShowCharCount params.
   Figma node 19336-10226 (FieldLabel 15695:5723).
   ============================================================ */
.loop-field__label-row {
  display: flex;
  align-items: center;
  gap: var(--loop-field-label-row-gap, 4px);
}

/* Inside the FieldLabel row the leading .loop-field__required carries the required marker,
   so suppress the legacy trailing .mandatory::after — the native Label can still be Mandatory
   (for the accessibility hook) without rendering a second asterisk. */
.loop-field__label-row [data-label].mandatory::after,
.loop-field__label-row label.mandatory::after {
  content: none;
}

/* Leading required asterisk — Figma places it BEFORE the label (vs the legacy
   .mandatory::after trailing " *"). Solid red, top-aligned to the cap height. */
.loop-field__required {
  align-self: flex-start;
  color: var(--color-text-on-light-state-error);
  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-label-size, 16px);
  line-height: var(--loop-field-label-leading, 16px);
}

/* "(optional)" tag — sits after the label, subdued 12px regular */
.loop-field__optional {
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-optional-size, 12px);
  font-weight: var(--font-weight-regular, 400);
  line-height: 1;
  letter-spacing: 0.5px;
  color: var(--color-text-on-light-subdued);
}

/* Word-count badge — pinned to the right end of the row; "NN/max", live-updated by
   loop-field-count.js (degrades to its static text when JS is off). */
[data-block*="CharacterCount"] {
    display: contents;
}

.loop-field__count {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--loop-field-count-padding, 2px 4px);
  background-color: var(--loop-field-count-bg);
  border-radius: var(--loop-field-count-radius, 2px);
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-count-size, 12px);
  font-weight: var(--font-weight-regular, 400);
  line-height: 1;
  letter-spacing: 0.5px;
  color: var(--color-text-on-light-subdued);
  font-variant-numeric: tabular-nums;
}

/* Helper text — 12px, icon + message; colour follows the field state */
.loop-field__helper {
  display: flex;
  align-items: center;
  gap: var(--loop-field-helper-gap, 4px);
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-helper-size, 12px);
  line-height: 1;
  letter-spacing: 0.5px;
  color: var(--color-text-on-light-subdued);
}
/* Leading status glyph (Figma 17188-6977). FA 6 Pro SOLID codepoint against the document
   @font-face; decorative (the message text carries the meaning, so it stays out of the a11y
   tree — no ARIA needed). Colour is its OWN token, NOT currentColor, because several states
   paint the icon differently from the text (warning amber vs brown, disabled/default). */
.loop-field__helper::before {
  content: var(--loop-field-helper-icon-char, "\f05a");
  flex: 0 0 auto;
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--loop-field-helper-icon-weight, 900);
  font-size: var(--loop-field-helper-icon-glyph, 12px);
  line-height: 1;
  letter-spacing: 0;
  color: var(--loop-field-helper-icon-color, var(--color-icon-on-light-default));
}
.loop-field__helper--error {
  color: var(--color-text-on-light-state-error);
  --loop-field-helper-icon-char:  "\f06a";                      /* fa-circle-exclamation */
  --loop-field-helper-icon-color: var(--color-icon-on-light-state-error);
}
.loop-field__helper--warning {
  color: var(--color-text-on-light-state-warning);
  --loop-field-helper-icon-char:  "\f071";                      /* fa-triangle-exclamation */
  --loop-field-helper-icon-color: var(--color-icon-on-light-state-warning-regular);
}
.loop-field__helper--success  { color: var(--color-text-on-light-state-success); }
.loop-field__helper--disabled {
  color: var(--color-text-on-light-state-disabled);
  --loop-field-helper-icon-char:  "\f05a";                      /* fa-circle-info */
  --loop-field-helper-icon-color: var(--color-icon-on-light-state-disabled);
}

/* ---- Native validation message — restyle the platform's <span class="validation-message">
   to match the helper--error treatment (typography + colour only; native positioning untouched). ---- */
span.validation-message {
  display: flex;
  align-items: center;
  gap: var(--loop-field-helper-gap, 4px);
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-helper-size, 12px);
  line-height: 1;
  letter-spacing: 0.5px;
  color: var(--color-text-on-light-state-error);     /* Red/70, not the brighter Red/50 default */
}
/* Lead the native error message with the same circle-exclamation as the Error helper. */
span.validation-message::before {
  content: "\f06a";                                  /* fa-circle-exclamation */
  flex: 0 0 auto;
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--loop-field-helper-icon-weight, 900);
  font-size: var(--loop-field-helper-icon-glyph, 12px);
  line-height: 1;
  letter-spacing: 0;
  color: var(--color-icon-on-light-state-error);
}

/* ============================================================
   Field Wrapper states — one modifier on .loop-field recolors the control + helper together,
   mirroring the per-widget mechanisms (.not-valid from native validation, .is-warning,
   [disabled], .is-read-only) so the Block can drive the whole field off a single State param.
   Explicit helper modifiers (.loop-field__helper--*) still win over the wrapper state.
   ============================================================ */

/* Error — mirrors native .not-valid */
.loop-field--error .form-control[data-input],
.loop-field--error .form-control[data-textarea] {
  background-color: var(--color-bg-container-state-error-low);
  border-color: var(--color-outline-on-light-state-error-high);
  color: var(--color-text-on-state-error-emphasis);
}
.loop-field--error .form-control[data-input]::placeholder,
.loop-field--error .form-control[data-textarea]::placeholder {
  color: var(--color-text-on-state-error-emphasis);
}
.loop-field--error .loop-field__helper {
  color: var(--color-text-on-light-state-error);
  --loop-field-helper-icon-char:  "\f06a";                      /* fa-circle-exclamation */
  --loop-field-helper-icon-color: var(--color-icon-on-light-state-error);
}

/* Warning — mirrors the added .is-warning modifier */
.loop-field--warning .form-control[data-input],
.loop-field--warning .form-control[data-textarea] {
  background-color: var(--color-domain-state-warning-low);
  border-color: var(--color-outline-on-light-state-warning-high);
  color: var(--color-text-on-state-warning-emphasis);
}
.loop-field--warning .form-control[data-input]::placeholder,
.loop-field--warning .form-control[data-textarea]::placeholder {
  color: var(--color-text-on-state-warning-emphasis);
}
.loop-field--warning .loop-field__helper {
  color: var(--color-text-on-light-state-warning);
  --loop-field-helper-icon-char:  "\f071";                      /* fa-triangle-exclamation */
  --loop-field-helper-icon-color: var(--color-icon-on-light-state-warning-regular);
}

/* Disabled — visual mirror of [disabled]; the label row + helper mute with the control.
   ALSO set Enabled=False on the widget itself: the class alone neither blocks input nor
   announces disabled to assistive tech. */
.loop-field--disabled .form-control[data-input],
.loop-field--disabled .form-control[data-textarea] {
  background-color: var(--color-domain-state-disable-low);
  border-color: var(--color-domain-state-disable-low);
  color: var(--color-text-on-light-state-disabled);
}
.loop-field--disabled [data-label],
.loop-field--disabled label,
.loop-field--disabled .loop-field__required,
.loop-field--disabled .loop-field__optional,
.loop-field--disabled .loop-field__count,
.loop-field--disabled .loop-field__helper,
.loop-field--disabled .loop-toggle__label,
.loop-field--disabled .loop-checkbox-field__label {
  color: var(--color-text-on-light-state-disabled);
}
.loop-field--disabled .loop-field__helper {
  --loop-field-helper-icon-char:  "\f05a";                      /* fa-circle-info */
  --loop-field-helper-icon-color: var(--color-icon-on-light-state-disabled);
}

/* Read-Only — mirrors the added .is-read-only modifier (borderless plain text) */
.loop-field--read-only .form-control[data-input],
.loop-field--read-only .form-control[data-textarea] {
  background-color: transparent;
  border-color: transparent;
  padding-inline: 0px;
}

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .form-control[data-input],
  .form-control[data-textarea] { transition: none; }
}
```

</details>

## State mapping (Figma "State" → OutSystems)
| The Loop | How |
|---|---|
| **Default / Filled / Focused** | native — base `.form-control[data-input]` (Focused = `:focus`) |
| **Error** | native — `.not-valid` (set automatically by OutSystems form validation) |
| **Warning** | added modifier — Extended Class `is-warning` |
| **Disabled** | native — Input widget *Enabled = False* (`[disabled]`) |
| **Read Only** | added modifier — Extended Class `is-read-only` |

> Warning / Read-Only have no native OutSystems input state, so they are the one-off
> added modifiers (same idea as `.btn-ghost`).

## Size mapping (Figma "Size" → OutSystems Input class)
| The Loop | OutSystems | How |
|---|---|---|
| **xLarge** (56px, default) | base `.form-control[data-input]` | native, no extra class |
| **Large** (48px) | `.input-large` | native size class |
| **Regular** (40px) | `is-regular` | Extended Class (OutSystems has no "medium") |
| **Small** (32px) | `.input-small` | native size class |

## Label + helper layout (apply on the field Container via Extended Class)
- `loop-field` — vertical label (default): label above the input.
- `loop-field loop-field--horizontal` — label inline, left of the input.
- The **Label** needs no extra class — The Loop restyles the native OutSystems label
  element (`[data-label]`) inside `loop-field`. Set the Label widget's **Mandatory**
  property for the required `*` marker (native `.mandatory` hook).
- `loop-field__helper` on the helper Text; add a state modifier to colour it:
  `--error` / `--warning` / `--success` / `--disabled`.

## What the override changes vs OutSystems UI baseline
- Corner radius **32px pill** (`--loop-field-radius` → `--radius-pill`) on single-line inputs —
  the Figma "Modern" collection mode (node 19336-17326), shared with the Select so sibling
  form controls match. The multi-line **textarea** keeps **8px** (`--radius-medium`).
- Open Sans, padding **16/18** (→ **56px** tall xLarge default), field gap 8px.
- Placeholder = `neutral-alpha-57` (#00294d91); **2px Blue/50** focus border (padding shrinks
  1px on focus so the box doesn't jump).
- Tinted **Error** (red), **Warning** (yellow), **Disabled** (neutral) fills + borders.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for TextField to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-text-field.css and dist/theme.css are already pasted into the ODC
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
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new `--loop-field-*` tokens).
- [ ] Paste `loop-text-field.css` into Theme CSS, **below** OutSystems UI.
- [ ] Use the native **Input** widget; bind to a variable + an OutSystems **Validation** for the Error state.
- [ ] Warning → Extended Class `is-warning`; Read-Only → `is-read-only`; Regular size → `is-regular`.
- [ ] Wrap Label + Input + helper in a Container with Extended Class `loop-field` (+ `loop-field--horizontal` for inline labels).
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview).

## Open findings linked to this work (register-only — low/medium, no GitHub issue)
- **FND-018** (design-token, low) — field `vpadding 18px` + label `gap 6px` off the 4pt grid; disabled border uses an On-Dark token with no light primitive (rendered borderless).
- **FND-019** (a11y/contrast, medium) — resting input border `#00396b3d` ≈ 1.45:1 on white (non-text contrast, SC 1.4.11); sibling of the checkbox FND-016.
- **FND-020** (consistency, low) — placeholder "subdued" `#00294d91` differs from the semantic `--color-text-on-light-subdued` `#000d1a91` (FND-006).
- **FND-021** (consistency, low) — size system documented two ways (3 vs 4 sizes) with an ambiguous default; built all 4 with xLarge as default.
