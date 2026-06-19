# Handover — Checkbox (restyle native OutSystems UI `[data-checkbox]`)

The Loop **Checkbox** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Checkbox" [node 19336-17679].

**Approach:** This does NOT introduce a custom checkbox widget. It **restyles the native
OutSystems UI Checkbox widget** (`[data-checkbox]`) to The Loop design — same pattern the
project uses for the Button (`loop-button.css`). Developers keep using the standard
OutSystems **Checkbox** widget; the theme makes it look like The Loop. The box graphic is
the input's `::before`; the check / dash glyph is its `::after`.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-checkbox.css` | Theme CSS (paste **below** OutSystems UI so it wins) |

No new global tokens — the component sizing (28px control / 20px box / 4px padding / 4 radius)
is defined as `--loop-checkbox-*` custom properties scoped to `[data-checkbox]`, and all colors
reference existing semantic tokens already in `dist/theme.css`.

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-checkbox.css</code> → Theme CSS — paste below OutSystems UI</summary>

```css
/* ============================================
   Component: Checkbox  ("The Loop" — -loop checkbox)
   Figma: -The Loop- Main Library · "Checkbox" [node:19336-17679]
          input atom [node:15848-1644] · box+label [node:15848-1651]
   Approach: RESTYLE the native OutSystems UI Checkbox widget ([data-checkbox])
             — NOT a parallel class system. Devs use the standard OutSystems
             Checkbox widget; this theme override makes it render as The Loop
             checkbox. The box graphic is the input's ::before; the check / dash
             glyph is its ::after (same technique OutSystems UI uses).
   Location: Theme CSS (paste below OutSystems UI so it wins on equal specificity).
   Escalation Level: L1/L2 (native widget + token-driven theme override)

   OutSystems UI v2.28.1 baseline (src/scss/03-widgets/_checkbox.scss):
     [data-checkbox]            → 24x24 input, ::before 22x22 box (neutral-0 bg,
                                  neutral-5 border, radius soft)
     :hover::before             → neutral-6 border
     :checked::before / ::after → primary fill + neutral-0 check (border trick)
     [disabled]                 → neutral-2 fill, neutral-4 border
   The Loop overrides that baseline to: 28px control / 20px box, radius 4, the
   WB blue-70 checked fill, a blue-70 hover border, an indeterminate ("Multi")
   dash, and an Error/Required red-70 type.

   Type / state mapping (Figma "State"/"Type"/"Checked" → native):
     Unchecked          → default (no class)
     Checked (Yes)      → :checked
     Multi              → :indeterminate   (set el.indeterminate = true in JS)
     Disabled           → [disabled]
     Error / Required   → .loop-checkbox--error  /  [aria-invalid="true"]
                          (Extended Class = "loop-checkbox--error"; Required uses
                           the same red treatment per the Figma "Required" state)

   Component tokens (scoped below) trace to Figma `loop/checkbox/*`:
     control size 28, box 20, padding 4, radius 4 (== --radius-base).

   Tokens consumed: --radius-base, --color-bg-container-on-light-lowest,
     --color-outline-on-light-default, --color-outline-primary,
     --color-bg-link-primary-enabled, --color-white,
     --color-domain-state-disable-low, --color-outline-on-light-state-disable-low,
     --color-bg-container-state-error-high, --color-outline-on-light-state-error-high,
     --color-outline-on-light-link-focused.

   Fidelity notes (flagged, NOT silently re-shaded):
     - FND-016 (a11y/contrast): the unchecked border Outline/On-Light/Default
       (#00396b3d ≈ 1.45:1 vs white) fails WCAG 2.2 SC 1.4.11 (3:1 for the
       checkbox boundary). Built as designed; recommendation carried to design.
     - FND-017 (consistency/a11y): the "Required" state renders in error-red by
       default (identical to the Error type), which may read as a validation
       error before the user interacts. Built as designed; confirm intent.
   ============================================ */

/* ---- Base [data-checkbox] → The Loop identity + Unchecked (enabled) look ---- */
[data-checkbox] {
  /* component tokens — Figma loop/checkbox/* */
  --loop-checkbox-control-size: 28px;                 /* loop/checkbox/icon/{width,height} */
  --loop-checkbox-box-size: 20px;                     /* control - 2*padding */
  --loop-checkbox-padding: 4px;                       /* loop/checkbox/icon/padding */
  --loop-checkbox-radius: var(--radius-base, 4px);    /* loop/checkbox/border radius */
  --loop-checkbox-glyph: var(--color-white, #ffffff); /* Icon/On Dark/Emphasis */

  appearance: none;                                   /* hide native control; ::before is the box */
  position: relative;
  box-sizing: border-box;
  width: var(--loop-checkbox-control-size);
  height: var(--loop-checkbox-control-size);
  padding: var(--space-none, 0px);
  cursor: pointer;
}

/* The visible 20x20 box, centered in the 28px control via the padding token */
[data-checkbox]::before {
  content: "";
  position: absolute;
  top: var(--loop-checkbox-padding);
  left: var(--loop-checkbox-padding);
  width: var(--loop-checkbox-box-size);
  height: var(--loop-checkbox-box-size);
  box-sizing: border-box;
  border: var(--border-size-s, 1px) solid var(--color-outline-on-light-default);  /* #00396b3d — FND-016 */
  border-radius: var(--loop-checkbox-radius);
  background: var(--color-bg-container-on-light-lowest, var(--color-white));        /* white */
  opacity: 1;
  transition: background-color 180ms linear, border-color 180ms linear;
}

/* ---- Hover → blue-70 border (Outline/Primary) ---- */
[data-checkbox]:hover::before,
.desktop [data-checkbox]:hover::before {
  border-color: var(--color-outline-primary);          /* blue-70 #004370 */
}

/* ---- Checked → filled blue-70 + white check ---- */
[data-checkbox]:checked::before {
  background: var(--color-bg-link-primary-enabled);     /* blue-70 #004370 */
  border-color: var(--color-bg-link-primary-enabled);
}
[data-checkbox]:checked::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 46%;                                             /* slight optical lift for the check */
  width: 10px;
  height: 5px;
  border-left: 2.5px solid var(--loop-checkbox-glyph);
  border-bottom: 2.5px solid var(--loop-checkbox-glyph);
  border-top: 0px;
  border-right: 0px;
  background: none;
  transform: translate(-50%, -50%) rotate(-45deg);
}

/* ---- Multi / indeterminate → filled blue-70 + white dash ---- */
[data-checkbox]:indeterminate::before {
  background: var(--color-bg-link-primary-enabled);     /* blue-70 #004370 */
  border-color: var(--color-bg-link-primary-enabled);
}
[data-checkbox]:indeterminate::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 10px;
  height: 2.5px;
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
[data-checkbox][aria-disabled="true"]::before {
  background: var(--color-domain-state-disable-low);          /* neutral-15 #dae3eb */
  border-color: var(--color-outline-on-light-state-disable-low); /* neutral-20 #d4dee8 */
}

/* ---- Error / Required → red-70 outline (unchecked) + fill (checked/multi) ----
   Apply via the Checkbox widget Extended Class = "loop-checkbox--error", or it
   activates automatically when OutSystems marks the field [aria-invalid="true"].
   Required uses the same red treatment per the Figma "Required" state — FND-017. */
[data-checkbox].loop-checkbox--error::before,
[data-checkbox].loop-checkbox--required::before,
[data-checkbox][aria-invalid="true"]::before {
  border-color: var(--color-outline-on-light-state-error-high);  /* red-70 #9d161d */
}
[data-checkbox].loop-checkbox--error:checked::before,
[data-checkbox].loop-checkbox--error:indeterminate::before,
[data-checkbox].loop-checkbox--required:checked::before,
[data-checkbox].loop-checkbox--required:indeterminate::before,
[data-checkbox][aria-invalid="true"]:checked::before,
[data-checkbox][aria-invalid="true"]:indeterminate::before {
  background: var(--color-bg-container-state-error-high);        /* red-70 #9d161d */
  border-color: var(--color-bg-container-state-error-high);
}

/* ---- Focus indicator (WCAG 2.2 SC 2.4.7/2.4.13) — design's own brand color ---- */
[data-checkbox]:focus-visible {
  outline: 2px solid var(--color-outline-on-light-link-focused, var(--color-blue-50));
  outline-offset: 2px;
  border-radius: var(--loop-checkbox-radius);
}

/* ---- Responsive — keep OutSystems' larger touch target on touch devices ---- */
.tablet [data-checkbox],
.phone [data-checkbox] {
  --loop-checkbox-control-size: 32px;
  --loop-checkbox-box-size: 24px;
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
| **Multi** (indeterminate) | `:indeterminate` | set `el.indeterminate = true` in JS (OnReady / on a flag) |
| **Disabled** | `[disabled]` / `[aria-disabled="true"]` | native Enabled = False |
| **Error / Required** | `.loop-checkbox--error` or `[aria-invalid="true"]` | Extended Class = `loop-checkbox--error`; OR auto when OutSystems validation sets `aria-invalid` |

## What the override changes vs OutSystems UI baseline
- Control **28px** (touch target), visible box **20px**, radius **4px** (centered via 4px padding token).
- **Checked fill = blue-70 (#004370)** with a white check; **hover border = blue-70** (Outline/Primary).
- Adds an **indeterminate ("Multi") dash** — OutSystems UI has no native indeterminate style.
- Adds an **Error/Required red-70 type** (`#9d161d`) — box border (unchecked) and fill (checked/multi).
- Disabled: neutral-15 fill (#dae3eb), neutral-20 border (#d4dee8).
- Touch (`.tablet`/`.phone`): control grows to 32px / box 24px (keeps OutSystems' larger target).

## Sizes (XLarge / Large / Regular / Small)
Per the Figma "Sizes" frame the **box stays constant**; only the **label** text scales with the
`LABEL SIZE` variable. Label sizing is therefore driven by the field/label typography, **not** the
checkbox box — no box CSS changes per size.

## Checklist
- [ ] Ensure latest `dist/theme.css` is pasted into the ODC Theme editor (provides the semantic color tokens).
- [ ] Paste `loop-checkbox.css` into Theme CSS, below OutSystems UI.
- [ ] Use the native **Checkbox** widget. For Multi/indeterminate, set `el.indeterminate = true` in JS.
- [ ] For Error/Required, set Extended Class = `loop-checkbox--error` (or rely on OutSystems `aria-invalid`).
- [ ] Always pair the checkbox with a real `<label>` / accessible name.
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview).

## Open findings linked to this work
- **FND-016** (a11y/contrast, medium) — unchecked border `#00396b3d` ≈ 1.45:1 vs white fails WCAG 2.2 SC 1.4.11 (3:1 boundary). Register-only; built faithfully.
- **FND-017** (consistency/a11y, low) — "Required" renders in error-red by default, identical to the Error type. Register-only; built faithfully.
