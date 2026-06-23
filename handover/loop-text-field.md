# Handover — Text Field (restyle native OutSystems UI Input)

The Loop **Text Field** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Text Field" [node 19336-9606].

**Approach:** This does NOT introduce a custom input class. It **restyles the native
OutSystems UI Input widget** (`.form-control[data-input]` / `[data-textarea]`) to The Loop
design — same pattern as the Button/Button Group. Developers keep using the standard
OutSystems **Input** widget; native form **validation** drives the Error state. The
Label + helper-text arrangement is a thin BEM wrapper (`loop-field`) applied via Extended
Class on the field Container.

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
/* ============================================
   Component: Text Field  ("The Loop" — loop/text field)
   Figma: -The Loop- Main Library · "Text Field" [node:19336-9606]

   Approach: RESTYLE the native OutSystems UI Input widget
     (.form-control[data-input] / [data-textarea]) — NOT a parallel class system.
     Devs use the standard OutSystems Input widget; native form validation drives
     the Error state via .not-valid. Warning, Disabled and Read-Only have no native
     INPUT state in OutSystems UI, so they are added modifiers applied via Extended
     Class (.is-warning / .is-read-only — the one-off additions, like .btn-ghost).
     The Label + helper-text arrangement (Vertical default / Horizontal) is a thin
     BEM wrapper, .loop-field, applied to the field Container.
   Location: Theme CSS (paste below OutSystems UI so it wins on equal specificity).
   Escalation Level: L1/L2 (native widget + token-driven theme override)

   OutSystems UI v2.28.1 baseline (src/scss/03-widgets/_inputs-and-textareas.scss):
     .form-control[data-input]   → white bg, 1px neutral-5 border, radius-soft, h40,
                                    padding 0/16, font-size-s; :hover neutral-6;
                                    :focus primary; [disabled] neutral; .not-valid → error
     sizes: .input-small → h32 · .input-large → h48
   The Loop overrides that baseline to: radius 32 ("Modern" mode per the Figma note at
     node:19336-17326 — pill radius shared with the Select), Open Sans, 16/10 padding
     (→ 40px tall Regular default), placeholder neutral-alpha-57, a 2px Blue/50 focus
     border, and tinted Error / Warning / Disabled fills.

   Size mapping (OutSystems Input class → The Loop "Size"):
     (none / base)   → Regular (40px, The Loop default)
     .input-xlarge   → xLarge  (56px) — added modifier (OutSystems UI has no h56 input)
     .input-large    → Large   (48px)
     .input-regular  → Regular (40px) — explicit alias of the default
     .input-small    → Small   (32px)

   Tokens consumed: --loop-field-* (component-field.css), --radius-medium, --space-*,
     --font-family-base/-label, --color-bg-container-on-light-lowest,
     --color-text-on-light-default, --color-neutral-alpha-57,
     --color-outline-on-light-default, --color-outline-on-light-emphasis,
     --color-outline-on-light-link-focused, --color-bg-container-state-error-low,
     --color-outline-on-light-state-error-high, --color-text-on-state-error-emphasis,
     --color-domain-state-warning-low, --color-outline-on-light-state-warning-high,
     --color-text-on-state-warning-emphasis, --color-domain-state-disable-low,
     --color-text-on-light-state-{disabled,error,warning,success},
     --color-text-on-light-subdued.

   Fidelity notes (built faithfully; raised, NOT silently changed):
     - Resting border = --color-outline-on-light-default (#00396b3d) ≈ 1.45:1 on white,
       below the 3:1 non-text-contrast minimum (WCAG 2.2 SC 1.4.11) — FND-019.
     - vpadding 18px / label gap 6px fall off the 4pt grid — FND-018.
     - Placeholder "subdued" = neutral-alpha-57 #00294d91 differs from the registered
       semantic --color-text-on-light-subdued #000d1a91 — FND-020.
     - Size system is documented two ways (3 sizes vs 4) with an ambiguous default — FND-021.
   ============================================ */

/* ---- Field box — The Loop identity (Default / Filled / Focused share this) ---- */
.form-control[data-input],
.form-control[data-textarea] {
  height: auto;
  padding: var(--loop-field-padding-block, 18px) var(--loop-field-padding-inline, 16px);
  gap: var(--loop-field-gap, 8px);

  background-color: var(--color-bg-container-on-light-lowest);     /* white */
  border: 1px solid var(--color-outline-on-light-default);        /* #00396b3d — FND-019 */
  border-radius: var(--radius-medium, 8px);                       /* 8px — textarea uses Medium radius, not the pill shared with single-line fields */
  color: var(--color-text-on-light-default);                      /* neutral-alpha-70 */

  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-text-size, 16px);
  font-weight: var(--loop-field-text-weight, 400);
  line-height: var(--loop-field-text-leading, 16px);
  letter-spacing: var(--loop-field-text-tracking, 0.5px);
}

/* Regular (default) — single-line input is 40px tall (16 text + 2×2 ph-pad + 2×10 vpad).
   Overrides the shared rule's --loop-field-padding-block (18px, the xLarge value, which
   still drives the textarea + the .input-xlarge modifier). */
.form-control[data-input] {
  min-height: 40px;
  padding-block: 10px;
}

/* Placeholder = Text/On Light/Subdued #00294d91 (neutral-alpha-57) — FND-020 */
.form-control[data-input]::placeholder,
.form-control[data-textarea]::placeholder {
  color: var(--color-neutral-alpha-57);
  opacity: 1;                                                     /* Firefox dims placeholders by default */
}

/* Hover — subtle border darken (parity with native; no brand-color change) */
.form-control[data-input]:hover,
.form-control[data-textarea]:hover {
  border-color: var(--color-outline-on-light-emphasis);          /* neutral-alpha-42 */
}

/* Focused — 2px Blue/50 border (Figma "Focused"). Rendered as a 1px border + a
   contiguous 1px INSET box-shadow of the same colour rather than growing the
   border to 2px. This keeps border-width (and therefore the content box + padding)
   unchanged on focus, so it neither nudges the text nor clobbers the icon-reserving
   padding-left that the Search / Input-with-icon patterns set (those wrap the same
   .form-control[data-input]; a `padding` shorthand here would reset padding-left and
   the value would slide under the left icon). Visually a solid 2px Blue/50 ring. */
.form-control[data-input]:focus,
.form-control[data-input]:focus-visible,
.form-control[data-textarea]:focus,
.form-control[data-textarea]:focus-visible {
  outline: none;
  border-color: var(--color-outline-on-light-link-focused);      /* Blue/50 #0071bc */
  box-shadow: inset 0 0 0 1px var(--color-outline-on-light-link-focused);
}

/* ---- Error — native .not-valid (set by OutSystems form validation) ---- */
.form-control[data-input].not-valid,
.form-control[data-textarea].not-valid {
  background-color: var(--color-bg-container-state-error-low);    /* Red/10 #fdf2f2 */
  border-color: var(--color-outline-on-light-state-error-high);  /* Red/70 #9d161d */
  color: var(--color-text-on-state-error-emphasis);              /* Red/80 #861319 */
}
.form-control[data-input].not-valid::placeholder,
.form-control[data-textarea].not-valid::placeholder {
  color: var(--color-text-on-state-error-emphasis);
}

/* ---- Warning — added modifier .is-warning (no native input warning state) ---- */
.form-control[data-input].is-warning,
.form-control[data-textarea].is-warning {
  background-color: var(--color-domain-state-warning-low);        /* Yellow/03 #fef3d7 */
  border-color: var(--color-outline-on-light-state-warning-high); /* Yellow base #896001 */
  color: var(--color-text-on-state-warning-emphasis);            /* Yellow/90 #473201 */
}
.form-control[data-input].is-warning::placeholder,
.form-control[data-textarea].is-warning::placeholder {
  color: var(--color-text-on-state-warning-emphasis);
}

/* ---- Disabled — native [disabled] / aria-disabled ----
   Figma's border (Outline/On Dark/State/Disable #ffffff7a) has no light primitive;
   rendered borderless via the disable fill so the faint edge matches the mock — FND-018. */
.form-control[data-input][disabled],
.form-control[data-input][aria-disabled="true"],
.form-control[data-textarea][disabled],
.form-control[data-textarea][aria-disabled="true"] {
  background-color: var(--color-domain-state-disable-low);        /* Neutral/15 #dae3eb */
  border-color: var(--color-domain-state-disable-low);
  color: var(--color-text-on-light-state-disabled);              /* neutral-alpha-42 #00294d6b */
}

/* ---- Read-Only — added modifier .is-read-only (borderless plain text) ---- */
.form-control[data-input].is-read-only,
.form-control[data-textarea].is-read-only {
  background-color: transparent;
  border-color: transparent;
  padding-inline: 0px;
}

/* ---- Sizes — native .input-large / .input-small + added .input-xlarge / .input-regular ---- */
.form-control[data-input].input-xlarge {                         /* xLarge — 56px */
  min-height: 56px;
  padding-block: var(--loop-field-padding-block, 18px);
}
.form-control[data-input].input-large {                          /* Large — 48px */
  min-height: 48px;
  padding-block: 14px;
}
.form-control[data-input].input-regular {                        /* Regular — 40px (explicit alias of the default) */
  min-height: 40px;
  padding-block: 10px;
}
.form-control[data-input].input-small {                          /* Small — 32px */
  min-height: 32px;
  padding-block: 6px;
  font-size: var(--font-size-200, 14px);
  line-height: 14px;
}
/* No per-size focus padding compensation needed: the focus ring is an inset
   box-shadow, so border-width and padding stay constant across all sizes. */

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

/* The Loop styles the NATIVE OutSystems label element — the OutSystems Input/Label
   widget emits <label data-label> — rather than a parallel .loop-field__label class
   (same restyle-the-native-widget approach as the input box, checkbox and radio). The
   plain `label` selector is the fallback when the widget renders without data-label. */
.loop-field [data-label],
.loop-field label {
  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-label-size, 16px);
  font-weight: var(--loop-field-label-weight, 600);
  line-height: var(--loop-field-label-leading, 16px);
  letter-spacing: var(--loop-field-label-tracking, 0px);
  color: var(--color-text-on-light-default);
}
/* Required marker — hooks OutSystems' native .mandatory class (set by the Label
   widget's Mandatory property), not a custom --required modifier. Distinct from a
   validation error (see FND-017 sibling note). */
.loop-field [data-label].mandatory::after,
.loop-field label.mandatory::after {
  content: " *";
  color: var(--color-text-on-light-state-error);
  margin-left: var(--space-xtiny, 2px);
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
.loop-field__helper--error    { color: var(--color-text-on-light-state-error); }
.loop-field__helper--warning  { color: var(--color-text-on-light-state-warning); }
.loop-field__helper--success  { color: var(--color-text-on-light-state-success); }
.loop-field__helper--disabled { color: var(--color-text-on-light-state-disabled); }

/* ---- Native default validation message (OutSystems form validation) ----
   At runtime an OutSystems Form does NOT emit .loop-field__helper--error; when a
   field fails validation the platform renders a sibling <span class="validation-message">
   (see OutSystems UI _form.scss). Out of the box that span is font-size-xs in the
   generic error colour (--color-error = Red/50 #da1e28) with no tracking — which reads
   brighter and lighter than the Error helper shown in the preview. Restyle it to The
   Loop's helper--error treatment so the live message matches the mockup: Open Sans,
   12px, 0.5px tracking, in the registered Red/70 state-error text colour.
   Typography + colour only — OutSystems' own absolute positioning of the span inside
   .form is left untouched so field layout/spacing is unaffected. */
span.validation-message {
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-helper-size, 12px);
  line-height: 1;
  letter-spacing: 0.5px;
  color: var(--color-text-on-light-state-error);     /* Red/70 — matches loop-field__helper--error, not the brighter Red/50 default */
}

/* ---- Reduced motion (WCAG 2.2 SC 2.3.3) — native uses transition: all 180ms ---- */
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
- Corner radius **8px** (`--radius-medium`) — the **OutSystems/MUI target** called out in the
  Figma note (node 19336-17326). The "Modern" collection mode is 32px; OutSystems uses 8.
- Open Sans, padding **16/18** (→ **56px** tall xLarge default), field gap 8px.
- Placeholder = `neutral-alpha-57` (#00294d91); **2px Blue/50** focus border (padding shrinks
  1px on focus so the box doesn't jump).
- Tinted **Error** (red), **Warning** (yellow), **Disabled** (neutral) fills + borders.

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
