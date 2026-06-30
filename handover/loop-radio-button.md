# Handover — Radio Button (restyle native OutSystems UI `.radio-button`)

The Loop **Radio Button** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Radio Button" [node 19336-18637].

**Approach:** This does NOT introduce a custom radio class. It **restyles the native
OutSystems UI RadioButtons widget** (`.radio-button` / `[data-radio-group]` /
`[data-radio-button]`) to The Loop design — same pattern as `loop-button.css`.
Developers keep using the standard OutSystems **RadioButtons** widget; the theme makes
it look like The Loop. No Web Component.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Radio Button page.

**What it is.** The Loop radio — native OutSystems RadioButtons restyled.

**When to use**
- Pick **exactly one** from a short, always-visible list (2–6 options).

**When not to use** (reach for instead)
- Many options → **Dropdown / Select**.
- Independent multi-select → **Checkbox**.
- An on/off setting → **Switch**.
- Compact inline one-of-few → **Button Group**.

**How to use**
- Use the native **RadioButtons** widget within a single radio group.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-radio-button.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/*` → `dist/theme.css` | Theme CSS (adds `--space-checkbox-gap`, `--space-checkbox-group-row`, `--space-checkbox-group-column`) |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-radio-button.css</code> → Theme CSS — paste below OutSystems UI</summary>

```css
/* loop-radio-button.css — Radio Button: native .radio-button restyle (:before ring + :after dot) */

/* ---- The Loop ring + dot, rebuilt over the native input; restated for .has-accessible-features ---- */
.radio-button {
  width: 20px;
  height: 20px;
}

.radio-button:before,
.has-accessible-features .radio-button:before {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 2px solid var(--color-outline-on-light-emphasis);   /* #00294d6b enabled unchecked */
  border-radius: 100%;
  background-color: var(--color-white);                        /* Background/White interior */
  content: "";
}

/* Inner dot — 50% diameter, follows the circle across sizes; hidden until checked */
.radio-button:after,
.has-accessible-features .radio-button:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 50%;
  margin: 0px;
  transform: translate(-50%, -50%);
  border-radius: 100%;
  background-color: var(--color-outline-on-light-link-enabled);
  opacity: 0;
  transition: opacity 120ms linear;
}

/* Hover (unchecked) — ring shifts to blue-70 */
.radio-button:hover:before,
.has-accessible-features .radio-button:hover:before {
  border-color: var(--color-outline-on-light-link-enabled);
}

/* Checked — blue-70 ring + visible blue-70 dot */
.radio-button:checked:before,
.has-accessible-features .radio-button:checked:before {
  border: 2px solid var(--color-outline-on-light-link-enabled);
  background-color: var(--color-white);
}
.radio-button:checked:after,
.has-accessible-features .radio-button:checked:after {
  opacity: 1;
}

/* Disabled — light fill, faint border, muted dot (no hover/focus reaction) */
.radio-button:disabled:before,
.has-accessible-features .radio-button:disabled:before,
.radio-button:disabled:hover:before {
  background-color: var(--color-neutral-15);
  border: 2px solid var(--color-outline-on-light-state-disable-low);
}
.radio-button:disabled:after,
.has-accessible-features .radio-button:disabled:after {
  background-color: var(--color-neutral-30);
}
.radio-button:disabled + label,
[data-radio-group] .radio-button:disabled + label {
  color: var(--color-text-on-light-state-disabled);
}

/* ---- Required / invalid — Red/70 ring, dot and label (native .not-valid hook) ---- */
[data-radio-group].not-valid .radio-button:before,
.has-accessible-features [data-radio-group].not-valid .radio-button:before {
  border: 2px solid var(--color-outline-on-light-state-error-high);
}
[data-radio-group].not-valid .radio-button:checked:before,
.has-accessible-features [data-radio-group].not-valid .radio-button:checked:before {
  border: 2px solid var(--color-outline-on-light-state-error-high);
}
[data-radio-group].not-valid .radio-button:after,
.has-accessible-features [data-radio-group].not-valid .radio-button:after {
  background-color: var(--color-outline-on-light-state-error-high);
}
[data-radio-group].not-valid label {
  color: var(--color-text-on-light-state-error);
}

/* ---- Label — Open Sans 400, On Light/Default, Regular metrics ---- */
[data-radio-group] label,
[data-radio-button] label {
  margin-left: var(--space-tiny, 4px);
  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-weight: var(--font-weight-regular, 400);
  font-size: 13px;
  line-height: 15px;
  letter-spacing: var(--letter-spacing-none, 0px);
  color: var(--color-text-on-light-default);
}

/* ---- Size modifiers — apply via the widget's Extended Class; default = Regular (20) ---- */
.radio-button.loop-radio-xlarge { width: 28px; height: 28px; }
.radio-button.loop-radio-xlarge + label {
  margin-left: var(--space-checkbox-gap, 8px);
  font-size: var(--font-size-300, 16px); line-height: 18px;
}

.radio-button.loop-radio-large  { width: 24px; height: 24px; }
.radio-button.loop-radio-large + label {
  margin-left: var(--space-checkbox-gap, 8px);
  font-size: var(--font-size-200, 14px); line-height: 16px;
}

.radio-button.loop-radio-regular { width: 20px; height: 20px; }   /* explicit alias of the default */
.radio-button.loop-radio-regular + label {
  margin-left: var(--space-tiny, 4px);
  font-size: 13px; line-height: 15px;
}

.radio-button.loop-radio-small { width: 16px; height: 16px; }
.radio-button.loop-radio-small + label {
  margin-left: var(--space-tiny, 4px);
  font-size: var(--font-size-100, 12px); line-height: 14px;
  letter-spacing: 0.25px;
}

/* ---- Group layout — vertical default 14px rows; horizontal 20px ---- */
[data-radio-group] [data-radio-button] {
  align-items: center;
}
[data-radio-group] [data-radio-button]:not(:first-of-type) {
  margin-top: var(--space-checkbox-group-row, 14px);
}
.radio-group.is-horizontal [data-radio-button]:not(:first-of-type) {
  margin-top: 0px;
  margin-left: var(--space-checkbox-group-column, 20px);
}
.is-rtl .radio-group.is-horizontal [data-radio-button]:not(:first-of-type) {
  margin-left: 0px;
  margin-right: var(--space-checkbox-group-column, 20px);
}

/* ---- Focus — neutralize OS UI's :focus ring recolor, keep each resting ring, add a brand focus-visible outline ---- */
.radio-button:focus:before,
.has-accessible-features .radio-button:focus:before {
  background-color: var(--color-white);
  border-color: var(--color-outline-on-light-emphasis);
  box-shadow: none;
}
.radio-button:checked:focus:before,
.has-accessible-features .radio-button:checked:focus:before {
  border-color: var(--color-outline-on-light-link-enabled);
}
.radio-button:disabled:focus:before,
.has-accessible-features .radio-button:disabled:focus:before {
  border-color: var(--color-outline-on-light-state-disable-low);
}
[data-radio-group].not-valid .radio-button:focus:before,
.has-accessible-features [data-radio-group].not-valid .radio-button:focus:before {
  border-color: var(--color-outline-on-light-state-error-high);
}
.radio-button:focus-visible {
  outline: 2px solid var(--color-outline-on-light-link-enabled, var(--color-blue-70));
  outline-offset: 2px;
  border-radius: 100%;
}

/* ---- Reduced motion (WCAG 2.2 SC 2.3.3) ---- */
@media (prefers-reduced-motion: reduce) {
  .radio-button,
  .radio-button:before,
  .radio-button:after { transition: none; }
}
```

</details>

## What the override builds
The Loop ring + dot are rebuilt from scratch over the native input:
`:before` = ring (2px border, white interior), `:after` = dot (50% diameter, shown only when `:checked`).
Each conflicting rule is also restated for `.has-accessible-features` so the override
wins whether or not the app runs with accessibility features on.

**States (ring + dot color):**
| State | Treatment |
|---|---|
| Enabled · unchecked | border `Outline/On Light/Emphasis` #00294d6b |
| Hover · unchecked | border `Blue/70` #004370 |
| Checked | border + dot `Blue/70` #004370 |
| Required / invalid | border + dot + label `Red/70` #9d161d (native `[data-radio-group].not-valid`) |
| Disabled | fill #dae3eb · border #d4dee8 · dot #bdccdb · label #00294d6b |

**Label:** Open Sans 400, `Text/On Light/Default` #000d1ab2, gap 8px (`loop/checkbox/gap`).

## Sizes (apply via the widget's **Extended Class** on the input — default = XLarge)
| The Loop size | Class | Circle | Label |
|---|---|---|---|
| **XLarge** (default) | _(none)_ | 28px | 16/18 |
| Large | `loop-radio-large` | 24px | 14/16 |
| Regular | `loop-radio-regular` | 20px | 13/15 |
| Small | `loop-radio-small` | 16px | 12/14 |

## Group layout (native)
- **Vertical** (default): 14px between rows (`loop/checkbox/group/vpadding`).
- **Horizontal**: set the RadioButtons group container class to `radio-group is-horizontal` → 20px between items (`loop/checkbox/group/hpadding`). RTL-aware.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for RadioButton to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-radio-button.css and dist/theme.css are already pasted into the ODC
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
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new spacing tokens).
- [ ] Paste `loop-radio-button.css` into Theme CSS, below OutSystems UI.
- [ ] Use the native **RadioButtons** widget. For a non-default size, set Extended Class = `loop-radio-large` / `loop-radio-regular` / `loop-radio-small`.
- [ ] Always pair each radio with a visible **label** (the widget's label); one option pre-selected by default per the DS guidelines.
- [ ] Required: drive the native group **not-valid** state for the red treatment; pair it with a visible required marker / helper text on the Form field (see FND-023 — don't rely on the red ring alone).
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview alone). Check keyboard focus ring + arrow-key navigation within a group.

## Open findings linked to this work
- **FND-022** (design-token, low) — group `vpadding 14px` off the 4pt grid; Regular label `13/15`, Small label tracking `0.25px` off the documented scales. Register-only.
- **FND-023** (consistency/a11y, low) — "Required" renders identical error-red before interaction and is color-only on the control (mirrors checkbox FND-017). Register-only.

> Note: the enabled-unchecked ring uses `Outline/On Light/Emphasis` (#00294d6b ≈ 3:1 on white), which **meets** WCAG 2.2 SC 1.4.11 — it is the darker token recommended as the fix for the checkbox/field resting-border findings (FND-016 / FND-019), so no contrast finding applies here.
