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
/* loop-switch.css — Switch: native [data-switch] restyle (self-contained :before track + :after thumb) */

/* ---- Track box — hide the native checkbox; :before/:after draw the switch ---- */
[data-switch],
.has-accessible-features [data-switch] {
  /* Size geometry — only these vars change per size; :before/:after derive from them */
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
  border: 0px;
  border-radius: var(--radius-pill, 50px);
  background-color: var(--color-icon-on-light-default);   /* OFF track */
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
  background-color: var(--color-domain-interactive-enabled-primary);
}
[data-switch]:checked:after,
.has-accessible-features [data-switch]:checked:after {
  /* travel = track − circle − padding */
  transform: translateX(calc(var(--loop-toggle-track-w, 56px) - var(--loop-toggle-circle, 24px) - var(--loop-toggle-padding, 4px))) translateZ(0);
}

/* ---- Hover / pressed (the interactive ON track shifts hue) ---- */
[data-switch]:checked:hover:before,
.has-accessible-features [data-switch]:checked:hover:before {
  background-color: var(--color-domain-interactive-hover);
  border: 0px;
}
[data-switch]:checked:active:before,
.has-accessible-features [data-switch]:checked:active:before {
  background-color: var(--color-domain-interactive-pressed);
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
  background-color: var(--color-domain-interactive-disable);
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

/* ---- Sizes — apply via the Switch widget's Extended Class; only the geometry vars change ---- */
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

/* ---- Label wrapper — Switch has no bound label, so the label is a sibling laid out here ---- */
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
/* Label position — Right (default) / Left / Top / Bottom */
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

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for Switch to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-switch.css and dist/theme.css are already pasted into the ODC
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
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new `--loop-toggle-*` tokens).
- [ ] Paste `loop-switch.css` into Theme CSS, below OutSystems UI.
- [ ] Use the native **Switch** widget. For a non-default size set Extended Class = `loop-toggle-large` / `loop-toggle-regular` / `loop-toggle-small`.
- [ ] Pair each Switch with a visible label; wrap the Switch + label container with Extended Class `loop-toggle` (+ a position modifier). Per the DS guidelines, use a Toggle when there are exactly two options.
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview alone). Check the keyboard focus ring + that Space toggles state.

## Open findings linked to this work
- **FND-024** (design-token, low) — label line-height published twice with different values (`loop/Toggle/Label/Line Height` 16 vs `loop/toggle/label/line height` 18); built on 18 (the assembled instance). Register-only.
- **FND-025** (design-token, low) — only the xLarge switch has published `loop/toggle/switch/*` tokens; Large/Regular/Small reuse observed track dims with padding held at 4px (circle = h − 2·padding). Confirm the smaller-size metrics. Register-only.
- **FND-026** (consistency, low) — the ON thumb carries a 16px check glyph [node 25845-30789] in Figma; its colour/asset wasn't published as a token, so the thumb renders without it. Additive detail; colours/geometry are faithful. Register-only.
