# Handover — Radio Button (restyle native OutSystems UI `.radio-button`)

The Loop **Radio Button** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Radio Button" [node 19336-18637].

**Approach:** This does NOT introduce a custom radio class. It **restyles the native
OutSystems UI RadioButtons widget** (`.radio-button` / `[data-radio-group]` /
`[data-radio-button]`) to The Loop design — same pattern as `loop-button.css`.
Developers keep using the standard OutSystems **RadioButtons** widget; the theme makes
it look like The Loop. No Web Component.

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
/* ============================================
   Component: Radio Button  ("The Loop" — loop/radio button)
   Figma: -The Loop- Main Library · "Radio Button" [node:19336-18637]
          input symbols [17182-4049] · component [17150-3403] · group [19795-11616]
   Approach: RESTYLE the native OutSystems UI RadioButtons widget (.radio-button /
             [data-radio-group] / [data-radio-button]) — NOT a parallel class system.
             Devs use the standard OutSystems RadioButtons widget; this theme override
             makes it render as The Loop radio button. (Same pattern as loop-button.css.)
   Location: Theme CSS (paste below OutSystems UI so it wins on equal specificity).
   Escalation Level: L1/L2 (native widget + token-driven theme override).

   OutSystems UI v2.28.1 baseline (src/scss/03-widgets/_radio-button.scss):
     .radio-button            → 24px input; ring via :before; checked = 6px primary border.
     .has-accessible-features → adds a real :after dot + recolors :before/:focus.
   The Loop overrides BOTH the plain and `.has-accessible-features` rule-sets (the
   accessible selectors carry higher specificity, so each conflicting rule is restated
   for `.has-accessible-features` to keep the override winning in either runtime).

   The Loop model (rebuilt from scratch, independent of the OS dot mechanism):
     :before = ring  (full size, 2px border, white interior)
     :after  = dot   (centered, 50% diameter, shown only when :checked)

   States (ring + dot color):
     enabled unchecked → border Outline/On Light/Emphasis  #00294d6b (neutral-alpha-42)
     hover unchecked   → border Outline/On Light/Link/Enabled #004370 (blue-70)
     checked           → border + dot blue-70
     required / error  → border + dot + label Red/70 #9d161d   (via [data-radio-group].not-valid)
     disabled          → fill #dae3eb (neutral-15), border #d4dee8 (neutral-20), dot #bdccdb (neutral-30)

   Sizes (loop/radio button/width · label font/line-height · gap) — default = XLarge:
     XLarge (base)        28 · 16/18 · gap 8
     .loop-radio-large    24 · 14/16 · gap 8
     .loop-radio-regular  20 · 13/15 · gap 4   (13/15 off the documented type scale — FND-022)
     .loop-radio-small    16 · 12/14 · gap 4   (label letter-spacing 0.25 off-scale — FND-022)

   Tokens consumed: --color-outline-on-light-emphasis, --color-outline-on-light-link-enabled,
     --color-outline-on-light-state-error-high, --color-outline-on-light-state-disable-low,
     --color-text-on-light-default, --color-text-on-light-state-disabled,
     --color-text-on-light-state-error, --color-white, --color-neutral-15, --color-neutral-30,
     --space-checkbox-gap, --space-checkbox-group-row, --space-checkbox-group-column,
     --space-tiny, --font-family-label, --font-weight-regular,
     --font-size-300/200/100, --letter-spacing-none.

   Fidelity note: enabled-unchecked ring #00294d6b on white is ~3:1 — meets WCAG 2.2 AA
     for UI components (1.4.11). The blue-70 dot/ring and red-70 required state pass.
     Required state is conveyed by COLOR ONLY in the mockup (red ring) — a 1.4.1
     "use of color" risk; the asterisk/helper text live on the Form field, not the radio.
     Logged as FND-023 (NOT silently re-designed; mirrors checkbox FND-017).
   ============================================ */

/* ---- The Loop ring + dot, rebuilt over the native input ----
   Restated for `.has-accessible-features` so the override beats the framework's
   higher-specificity accessible rules in both runtimes. */
.radio-button {
  width: 28px;                         /* loop/radio button/width — XLarge default */
  height: 28px;
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
  background-color: var(--color-outline-on-light-link-enabled);  /* blue-70 dot */
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
  background-color: var(--color-neutral-15);                       /* #dae3eb fill */
  border: 2px solid var(--color-outline-on-light-state-disable-low); /* #d4dee8 border */
}
.radio-button:disabled:after,
.has-accessible-features .radio-button:disabled:after {
  background-color: var(--color-neutral-30);                       /* #bdccdb muted dot */
}
.radio-button:disabled + label,
[data-radio-group] .radio-button:disabled + label {
  color: var(--color-text-on-light-state-disabled);                /* #00294d6b */
}

/* ---- Required / invalid — Red/70 ring, dot and label (native .not-valid hook) ---- */
[data-radio-group].not-valid .radio-button:before,
.has-accessible-features [data-radio-group].not-valid .radio-button:before {
  border: 2px solid var(--color-outline-on-light-state-error-high);  /* #9d161d */
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
  color: var(--color-text-on-light-state-error);                    /* #9d161d */
}

/* ---- Label — Open Sans 400, On Light/Default, default (XLarge) metrics ---- */
[data-radio-group] label,
[data-radio-button] label {
  margin-left: var(--space-checkbox-gap, 8px);   /* loop/checkbox/gap */
  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-weight: var(--font-weight-regular, 400);
  font-size: var(--font-size-300, 16px);         /* XLarge label */
  line-height: 18px;
  letter-spacing: var(--letter-spacing-none, 0px);
  color: var(--color-text-on-light-default);     /* #000d1ab2 */
}

/* ---- Size modifiers (apply via the widget's Extended Class on the input) ----
   Default (no class) = XLarge (28). The label is the adjacent sibling of the input. */
.radio-button.loop-radio-large  { width: 24px; height: 24px; }
.radio-button.loop-radio-large + label {
  font-size: var(--font-size-200, 14px); line-height: 16px;
}

.radio-button.loop-radio-regular { width: 20px; height: 20px; }
.radio-button.loop-radio-regular + label {
  margin-left: var(--space-tiny, 4px);
  font-size: 13px; line-height: 15px;            /* 13/15 off the type scale — FND-022 */
}

.radio-button.loop-radio-small { width: 16px; height: 16px; }
.radio-button.loop-radio-small + label {
  margin-left: var(--space-tiny, 4px);
  font-size: var(--font-size-100, 12px); line-height: 14px;
  letter-spacing: 0.25px;                        /* off-scale — FND-022 */
}

/* ---- Group layout — The Loop spacing ----
   Vertical (default): 14px between rows. Horizontal (.radio-group.is-horizontal): 20px. */
[data-radio-group] [data-radio-button] {
  align-items: center;
}
[data-radio-group] [data-radio-button]:not(:first-of-type) {
  margin-top: var(--space-checkbox-group-row, 14px);   /* loop/checkbox/group/vpadding */
}
.radio-group.is-horizontal [data-radio-button]:not(:first-of-type) {
  margin-top: 0px;
  margin-left: var(--space-checkbox-group-column, 20px);   /* loop/checkbox/group/hpadding */
}
.is-rtl .radio-group.is-horizontal [data-radio-button]:not(:first-of-type) {
  margin-left: 0px;
  margin-right: var(--space-checkbox-group-column, 20px);
}

/* ---- Focus indicator (WCAG 2.2 SC 2.4.7/2.4.13) — design's own brand color ----
   Neutralize OutSystems' accessible :focus:before recolor (it fills the ring and
   repaints the border on focus); keep each state's resting ring, then add a brand-blue
   focus-visible outline. State :focus rules are ordered by ascending specificity so the
   most specific (checked / not-valid) wins for that combination. */
.radio-button:focus:before,
.has-accessible-features .radio-button:focus:before {
  background-color: var(--color-white);
  border-color: var(--color-outline-on-light-emphasis);   /* unchecked focus keeps resting ring */
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
