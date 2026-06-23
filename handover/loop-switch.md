# Handover — Toggle / Switch (restyle native OutSystems UI `[data-switch]`)

The Loop **Toggle** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Toggle" [node 25344-27822] · switch set [node 25344-27924].

**Approach:** This does NOT introduce a custom toggle class. It **restyles the native
OutSystems UI Switch widget** (`[data-switch]`) to The Loop design — same pattern as
`loop-button.css` / `loop-radio-button.css`. Developers keep using the standard
OutSystems **Switch** widget; the theme makes it look like The Loop. No Web Component.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Toggle / Switch page.

**What it is.** The Loop toggle — native OutSystems Switch restyled.

**When to use**
- An instant on/off setting that takes effect **immediately**, with no Save — e.g. enable notifications, dark mode, a feature flag.

**When not to use** (reach for instead)
- A choice that only applies on Submit/Save → **Checkbox**.
- One of multiple options → **Radio Button** or **Button Group**.

**How to use**
- Use the native **Switch** widget; supports on, off, and disabled.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-switch.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/component-toggle.css` → `dist/theme.css` | Theme CSS (adds `--loop-toggle-*` track/thumb/label metrics) |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-switch.css</code> → Theme CSS — paste below OutSystems UI</summary>

```css
/* ============================================
   Component: Toggle / Switch  ("The Loop" — loop/toggle)
   Figma: -The Loop- Main Library · "Toggle" [node:25344-27822]
          switch component set [node:25344-27924] · default switch [node:25344-27925]
   Approach: RESTYLE the native OutSystems UI Switch widget ([data-switch]) — NOT a
             parallel class system. Devs use the standard OutSystems Switch widget; this
             theme override makes it render as The Loop toggle. (Same pattern as
             loop-button.css / loop-checkbox.css / loop-radio-button.css.)
             SELF-CONTAINED: the override supplies its own structural reset
             (appearance:none on the input; content/position/display on the track :before
             + thumb :after) rather than leaning on OutSystems UI's baseline switch CSS.
             So the control renders correctly even where that baseline isn't present
             (e.g. the local preview), exactly like loop-checkbox.css / loop-radio-button.css.
   Location: Theme CSS (paste below OutSystems UI so it wins on equal specificity).
   Escalation Level: L1/L2 (native widget + token-driven theme override).

   OutSystems UI v2.28.1 baseline (src/scss/03-widgets/_switch.scss):
     [data-switch]          → 50×32 box; :empty:before = 48×30 track pill (neutral-5),
                              :empty:after = 24px thumb, translateX(4px) off / 22px on;
                              :checked:before = primary; [disabled] = neutral; hover neutral-6.
     .has-accessible-features [data-switch] → restates colours at higher specificity
                              (neutral-7/8, focus-inner) — so each conflicting rule below
                              is restated for `.has-accessible-features` to keep winning.
   The Loop overrides that baseline to: a 56×32 pill track (transparent border), a 24px
     white thumb with 4px padding (travel 28px), the WB neutral-60 OFF track, blue-70 ON
     track, and the interactive hover/pressed/focus brand colours.

   Colour mapping (Figma "Domain/Interactive/On Light/*" + "Icon/On Light/*"):
     OFF track (unchecked)  → --color-icon-on-light-default            (neutral-60 #4b5e71)
     ON track  (checked)    → --color-domain-interactive-enabled-primary (blue-70 #004370)
     ON hover               → --color-domain-interactive-hover          (blue-40 #169af3)
     ON pressed             → --color-domain-interactive-pressed        (blue-90 #012740)
     focus ring             → --color-domain-interactive-focused        (blue-50 #0071bc)
     disabled track         → --color-domain-interactive-disable        (neutral-40 #8a9db1)
     thumb                  → --color-white

   Sizes (loop/toggle/switch track w×h — default = Regular): published switch tokens cover
     only the xLarge size (56×32, circle 24, padding 4); the default base is Regular (40×20,
     circle 12). xLarge/Large/Small reuse the observed track dimensions
     (56×32 / 48×26 / 32×16) with padding held at the one published 4px value and
     circle = height − 2·padding — flagged for confirmation (FND-025).

   Fidelity notes (built faithfully; raised, NOT silently changed):
     - Label line-height token is published twice with different values (16 vs 18) — FND-024.
     - The ON thumb carries a 16px check glyph in Figma [node:25845-30789]; its colour/asset
       weren't published as a token, so the thumb is rendered without the glyph pending the
       asset — FND-026 (additive detail; colours/geometry are faithful).
   ============================================ */

/* ---- Track box — hide the native checkbox; :before/:after draw the switch ---- */
[data-switch],
.has-accessible-features [data-switch] {
  /* Size geometry — default is Regular (40×20, circle 12); .loop-toggle-* override these.
     Only these vars change per size; the :before/:after rules derive from them. */
  --loop-toggle-track-w: 40px;
  --loop-toggle-track-h: 20px;
  --loop-toggle-circle: 12px;
  --loop-toggle-padding: 4px;
  appearance: none;
  -webkit-appearance: none;
  position: relative;                                     /* positioning context for track + thumb */
  display: inline-block;
  box-sizing: border-box;
  vertical-align: middle;
  width: var(--loop-toggle-track-w, 40px);
  height: var(--loop-toggle-track-h, 20px);
  background-color: transparent;
  border: 0px;
  border-radius: var(--radius-pill, 50px);
  overflow: initial;
  cursor: pointer;
}

/* ---- Track pill (:before) — fill the box, transparent border, OFF = neutral-60 ---- */
[data-switch]:empty:before,
.has-accessible-features [data-switch]:empty:before {
  content: "";
  position: absolute;
  display: block;
  top: 0px;
  left: 0px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 0px;                                            /* Outline/Transparent */
  border-radius: var(--radius-pill, 50px);
  background-color: var(--color-icon-on-light-default);   /* OFF track — neutral-60 #4b5e71 */
  opacity: 1;
  transition: background-color 180ms linear, border-color 180ms linear;
}

/* ---- Thumb (:after) — 24px white circle, OFF sits +4px from the left ---- */
[data-switch]:empty:after,
.has-accessible-features [data-switch]:empty:after {
  content: "";
  position: absolute;
  display: block;
  box-sizing: border-box;
  width: var(--loop-toggle-circle, 24px);
  height: var(--loop-toggle-circle, 24px);
  top: var(--loop-toggle-padding, 4px);
  left: 0px;
  margin-left: 0px;
  border: 0px;
  border-radius: 100%;
  box-shadow: none;
  background-color: var(--color-white, #ffffff);
  transform: translateX(var(--loop-toggle-padding, 4px)) translateZ(0);
  transition: transform 180ms linear, background-color 180ms linear;
}

/* ---- Checked — blue-70 track, thumb slides to the right ---- */
[data-switch]:checked:before,
.has-accessible-features [data-switch]:checked:before {
  border: 0px;
  background-color: var(--color-domain-interactive-enabled-primary);   /* blue-70 #004370 */
}
[data-switch]:checked:after,
.has-accessible-features [data-switch]:checked:after {
  /* travel = track − circle − padding (xLarge: 56−24−4 = 28px; derives per size) */
  transform: translateX(calc(var(--loop-toggle-track-w, 56px) - var(--loop-toggle-circle, 24px) - var(--loop-toggle-padding, 4px))) translateZ(0);
}

/* ---- Hover / pressed (the interactive ON track shifts hue) ---- */
[data-switch]:checked:hover:before,
.has-accessible-features [data-switch]:checked:hover:before {
  background-color: var(--color-domain-interactive-hover);     /* blue-40 #169af3 */
  border: 0px;
}
[data-switch]:checked:active:before,
.has-accessible-features [data-switch]:checked:active:before {
  background-color: var(--color-domain-interactive-pressed);   /* blue-90 #012740 */
  border: 0px;
}

/* ---- Disabled — muted interactive track, white thumb, inert ---- */
[data-switch][disabled],
[data-switch][aria-disabled="true"] {
  pointer-events: none;
}
[data-switch][disabled]:empty:before,
[data-switch][aria-disabled="true"]:empty:before,
.has-accessible-features [data-switch][disabled]:empty:before {
  background-color: var(--color-domain-interactive-disable);   /* neutral-40 #8a9db1 */
  border: 0px;
}
[data-switch][disabled]:empty:after,
[data-switch][aria-disabled="true"]:empty:after,
.has-accessible-features [data-switch][disabled]:empty:after {
  background-color: var(--color-white, #ffffff);
}

/* ---- Focus indicator (WCAG 2.2 SC 2.4.7/2.4.13) — design's own Blue/50 ring ---- */
[data-switch]:focus-visible {
  outline: 2px solid var(--color-domain-interactive-focused, var(--color-blue-50));
  outline-offset: 2px;
}

/* ---- Sizes — apply via the Switch widget's Extended Class on the input ----
   Only the geometry vars change; the before/after rules above derive from them.
   Default (no class) = Regular (40×20). Track w×h are the observed Figma dimensions;
   padding is held at the one published 4px value, circle = h − 2·padding (FND-025). */
[data-switch].loop-toggle-xlarge {
  --loop-toggle-track-w: 56px;  --loop-toggle-track-h: 32px;  --loop-toggle-circle: 24px;
}
[data-switch].loop-toggle-large {
  --loop-toggle-track-w: 48px;  --loop-toggle-track-h: 26px;  --loop-toggle-circle: 18px;
}
[data-switch].loop-toggle-regular {
  --loop-toggle-track-w: 40px;  --loop-toggle-track-h: 20px;  --loop-toggle-circle: 12px;
}
[data-switch].loop-toggle-small {
  --loop-toggle-track-w: 32px;  --loop-toggle-track-h: 16px;  --loop-toggle-circle: 8px;
}

/* ============================================================
   Label wrapper — Switch + label layout (BEM, applied via Extended Class on the
   container). OutSystems' Switch has no bound label element (unlike Checkbox/Radio),
   so the label is a sibling laid out by this thin wrapper.
   ============================================================ */
.loop-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--loop-toggle-label-gap, 8px);
  min-height: var(--loop-toggle-row-minh, 40px);
}
.loop-toggle__label {
  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-toggle-label-size, 16px);
  font-weight: var(--loop-toggle-label-weight, 400);
  line-height: var(--loop-toggle-label-leading, 18px);
  letter-spacing: var(--loop-toggle-label-tracking, 0px);
  color: var(--color-text-on-light-default);
}
/* Label position (Figma "Label Position" = Right [default] / Left / Top / Bottom) */
.loop-toggle--left   { flex-direction: row-reverse; }
.loop-toggle--top    { flex-direction: column;         align-items: flex-start; }
.loop-toggle--bottom { flex-direction: column-reverse; align-items: flex-start; }
.loop-toggle--disabled .loop-toggle__label {
  color: var(--color-text-on-light-state-disabled);
}

/* ---- Reduced motion (WCAG 2.2 SC 2.3.3) — native animates before/after 180ms ---- */
@media (prefers-reduced-motion: reduce) {
  [data-switch]:empty:before,
  [data-switch]:empty:after { transition: none; }
}
```

</details>

































## What the override builds
The native switch pseudo-elements are restyled: `:before` = the 56×32 pill track,
`:after` = the 24px white thumb (4px padding, travel 28px). Each conflicting rule is
also restated for `.has-accessible-features` so the override wins whether or not the app
runs with accessibility features on.

**States (track color — `Domain/Interactive/On Light/*` + `Icon/On Light/*`):**
| State | Treatment |
|---|---|
| Off (unchecked) | track `Icon/On Light/Default` #4b5e71 (neutral-60), thumb left |
| On (checked) | track `Enabled Primary` #004370 (blue-70), thumb right |
| On · hover | track `Hover` #169af3 (blue-40) |
| On · pressed | track `Pressed` #012740 (blue-90) |
| Disabled | track `Disable` #8a9db1 (neutral-40), inert |
| Focus | 2px `Focused` #0071bc (blue-50) ring, offset 2px |

Thumb is always `Background/White`. **Label:** Open Sans 400, 16/18, `Text/On Light/Default`,
gap 8px (`loop/toggle/label/gap`), row min-height 40px.

## Label layout (BEM wrapper `.loop-toggle`, applied via **Extended Class** on the container)
The OutSystems Switch has no bound label element (unlike Checkbox/Radio), so the label is
a sibling laid out by the wrapper. Default = label **Right**.
| Position | Class |
|---|---|
| Right (default) | `loop-toggle` |
| Left | `loop-toggle loop-toggle--left` |
| Top | `loop-toggle loop-toggle--top` |
| Bottom | `loop-toggle loop-toggle--bottom` |

## Sizes (apply via the widget's **Extended Class** on the input — default = xLarge)
| The Loop size | Class | Track |
|---|---|---|
| **xLarge** (default) | _(none)_ | 56×32, circle 24 |
| Large | `loop-toggle-large` | 48×26, circle 18 |
| Regular | `loop-toggle-regular` | 40×20, circle 12 |
| Small | `loop-toggle-small` | 32×16, circle 8 |

## Checklist
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new `--loop-toggle-*` tokens).
- [ ] Paste `loop-switch.css` into Theme CSS, below OutSystems UI.
- [ ] Use the native **Switch** widget. For a non-default size set Extended Class = `loop-toggle-large` / `loop-toggle-regular` / `loop-toggle-small`.
- [ ] Pair each Switch with a visible label; wrap the Switch + label container with Extended Class `loop-toggle` (+ a position modifier). Per the DS guidelines, use a Toggle when there are exactly two options.
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview alone). Check the keyboard focus ring + that Space toggles state.

## Open findings linked to this work
- **FND-024** (design-token, low) — label line-height published twice with different values (`loop/Toggle/Label/Line Height` 16 vs `loop/toggle/label/line height` 18); built on 18 (the assembled instance). Register-only.
- **FND-025** (design-token, low) — only the xLarge switch has published `loop/toggle/switch/*` tokens; Large/Regular/Small reuse observed track dims with padding held at 4px (circle = h − 2·padding). Confirm the smaller-size metrics. Register-only.
- **FND-026** (consistency, low) — the ON thumb carries a 16px check glyph [node 25845-30789] in Figma; its colour/asset wasn't published as a token, so the thumb renders without it. Additive detail; colours/geometry are faithful. Register-only.
