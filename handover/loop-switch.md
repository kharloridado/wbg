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
/* loop-switch.css — Toggle/Switch: native [data-switch] restyle (self-contained :before track + :after thumb)
   Sizes + geometry per Figma 25862-14729 ("Sizes", Main Library 2): the track/thumb geometry and the
   label step together, and the ON thumb carries a check glyph. Size resolution order (low → high):
   :root tokens (Regular) → .loop-field--* wrapper cascade → .loop-toggle-* explicit size class. */

/* ---- Track box — hide the native checkbox; :before/:after draw the switch ----
   Geometry comes from the --loop-toggle-* tokens (component-toggle.css; Regular 40×20, 16px thumb,
   2px padding). NOT re-declared here so a .loop-field--* wrapper or a size class can re-point them. */
[data-switch],
.has-accessible-features [data-switch] {
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

/* ---- Thumb (:after) — white circle (= track height − 2×padding), OFF sits at the left padding ---- */
[data-switch]:empty:after,
.has-accessible-features [data-switch]:empty:after {
  content: "";
  position: absolute;
  display: block;
  box-sizing: border-box;
  width: var(--loop-toggle-circle, 16px);
  height: var(--loop-toggle-circle, 16px);
  top: var(--loop-toggle-padding, 2px);
  left: 0px;
  margin-left: 0px;
  border: 0px;
  border-radius: 100%;
  box-shadow: none;
  background-color: var(--color-white, #ffffff);
  transform: translateX(var(--loop-toggle-padding, 2px)) translateZ(0);
  transition: transform 180ms linear, background-color 180ms linear;
}

/* ---- Checked — blue-70 track, thumb slides to the right, check glyph inside the thumb ---- */
[data-switch]:checked:before,
.has-accessible-features [data-switch]:checked:before {
  border: 0px;
  background-color: var(--color-domain-interactive-enabled-primary);
}
[data-switch]:checked:after,
.has-accessible-features [data-switch]:checked:after {
  /* travel = track − circle − padding */
  transform: translateX(calc(var(--loop-toggle-track-w, 40px) - var(--loop-toggle-circle, 16px) - var(--loop-toggle-padding, 2px))) translateZ(0);
}
/* ON check — FA 6 Pro check rendered as a font glyph on the thumb pseudo-element (shadow-free
   light DOM but [data-switch] is an <input>, so no child markup — codepoint via content).
   Glyph box = thumb − 2×padding (Figma: 16/14/12/8 across the four sizes). */
[data-switch]:checked:empty:after,
.has-accessible-features [data-switch]:checked:empty:after {
  content: var(--loop-toggle-check-char, "\f00c");
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--loop-toggle-check-weight, var(--font-weight-icon-solid, 900));
  font-size: calc(var(--loop-toggle-circle, 16px) - 2 * var(--loop-toggle-padding, 2px));
  font-style: normal;
  line-height: 1;
  color: var(--loop-toggle-check-color, var(--color-domain-interactive-enabled-primary));
  -webkit-font-smoothing: antialiased;
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

/* ---- Disabled — muted interactive track, white thumb, muted check, inert ---- */
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
[data-switch][disabled]:checked:empty:after,
[data-switch][aria-disabled="true"]:checked:empty:after,
.has-accessible-features [data-switch][disabled]:checked:empty:after {
  color: var(--color-domain-interactive-disable);
}

/* ---- Read-Only — added modifier .is-read-only (+ .loop-field--read-only wrapper cascade).
   NOT disabled: the control shows its state but can't be toggled, and the LABEL stays fully
   readable (default color, unlike disabled). Figma 25862-16199 "Read-Only": light
   Disable/Lowest track (#e7edf3) regardless of on/off, a white thumb ringed with a 2px
   Blue/90 (Pressed) halo, and — when ON — the Blue/70 check stays. The native checkbox
   ignores [readonly], so this is class-driven + made inert here (also set aria-readonly). */
[data-switch].is-read-only,
.loop-field--read-only [data-switch] {
  pointer-events: none;
  cursor: default;
}
/* Track — flat light fill in both states (overrides OFF neutral + checked/hover Blue) */
[data-switch].is-read-only:empty:before,
.loop-field--read-only [data-switch]:empty:before,
.has-accessible-features [data-switch].is-read-only:empty:before,
.has-accessible-features .loop-field--read-only [data-switch]:empty:before {
  background-color: var(--color-domain-state-disable-lowest);
  border: 0px;
}
/* Thumb — white circle carrying the 2px Blue/90 ring (Figma drop-shadow spread 2, blur 0).
   Position/travel + the ON check glyph are inherited from the base :checked rules. */
[data-switch].is-read-only:empty:after,
.loop-field--read-only [data-switch]:empty:after,
.has-accessible-features [data-switch].is-read-only:empty:after,
.has-accessible-features .loop-field--read-only [data-switch]:empty:after {
  background-color: var(--color-white, #ffffff);
  box-shadow: 0 0 0 2px var(--color-domain-interactive-pressed);
}

/* ---- Focus indicator (WCAG 2.2 SC 2.4.7/2.4.13) — design's own Blue/50 ring ---- */
[data-switch]:focus-visible {
  outline: 2px solid var(--color-domain-interactive-focused, var(--color-blue-50));
  outline-offset: 2px;
}

/* ============================================================
   Sizing — Figma 25862-14729: geometry + label step TOGETHER.
   ============================================================ */

/* Field Wrapper cascade — a .loop-field--* size on the wrapping Field (loop-text-field.css)
   re-points the toggle tokens by inheritance, so every toggle inside follows the wrapper size.
   :where() keeps these at zero extra weight so the explicit .loop-toggle-* classes below win. */
:where(.loop-field--xlarge) {
  --loop-toggle-track-w: 56px;  --loop-toggle-track-h: 32px;  --loop-toggle-circle: 24px;
  --loop-toggle-padding: var(--space-tiny, 4px);
  --loop-toggle-label-size: var(--font-size-300, 16px); --loop-toggle-label-leading: 18px;
  --loop-toggle-label-tracking: 0px;
  --loop-toggle-label-gap: var(--space-xxsmall, 8px);   --loop-toggle-row-minh: 40px;
}
:where(.loop-field--large) {
  --loop-toggle-track-w: 48px;  --loop-toggle-track-h: 26px;  --loop-toggle-circle: 20px;
  --loop-toggle-padding: 3px;                            /* off-grid (Figma 25862-14737) */
  --loop-toggle-label-size: var(--font-size-200, 14px); --loop-toggle-label-leading: 16px;
  --loop-toggle-label-tracking: 0px;
  --loop-toggle-label-gap: var(--space-xxsmall, 8px);   --loop-toggle-row-minh: 40px;
}
:where(.loop-field--regular) {
  --loop-toggle-track-w: 40px;  --loop-toggle-track-h: 20px;  --loop-toggle-circle: 16px;
  --loop-toggle-padding: var(--space-xtiny, 2px);
  --loop-toggle-label-size: 13px;                        --loop-toggle-label-leading: 15px;
  --loop-toggle-label-tracking: 0px;
  --loop-toggle-label-gap: var(--space-tiny, 4px);      --loop-toggle-row-minh: 32px;
}
:where(.loop-field--small) {
  --loop-toggle-track-w: 32px;  --loop-toggle-track-h: 16px;  --loop-toggle-circle: 12px;
  --loop-toggle-padding: var(--space-xtiny, 2px);
  --loop-toggle-label-size: var(--font-size-100, 12px); --loop-toggle-label-leading: 14px;
  --loop-toggle-label-tracking: 0.25px;
  --loop-toggle-label-gap: var(--space-tiny, 4px);      --loop-toggle-row-minh: 32px;
}

/* Explicit size classes — apply via ExtendedClass to the Switch widget, the .loop-toggle label
   wrapper, or a containing row. Declared after (and heavier than) the wrapper cascade, so a
   per-instance size always wins inside a differently-sized Field Wrapper. */
.loop-toggle-xlarge {
  --loop-toggle-track-w: 56px;  --loop-toggle-track-h: 32px;  --loop-toggle-circle: 24px;
  --loop-toggle-padding: var(--space-tiny, 4px);
  --loop-toggle-label-size: var(--font-size-300, 16px); --loop-toggle-label-leading: 18px;
  --loop-toggle-label-tracking: 0px;
  --loop-toggle-label-gap: var(--space-xxsmall, 8px);   --loop-toggle-row-minh: 40px;
}
.loop-toggle-large {
  --loop-toggle-track-w: 48px;  --loop-toggle-track-h: 26px;  --loop-toggle-circle: 20px;
  --loop-toggle-padding: 3px;                            /* off-grid (Figma 25862-14737) */
  --loop-toggle-label-size: var(--font-size-200, 14px); --loop-toggle-label-leading: 16px;
  --loop-toggle-label-tracking: 0px;
  --loop-toggle-label-gap: var(--space-xxsmall, 8px);   --loop-toggle-row-minh: 40px;
}
.loop-toggle-regular {                                   /* explicit Regular — same as default */
  --loop-toggle-track-w: 40px;  --loop-toggle-track-h: 20px;  --loop-toggle-circle: 16px;
  --loop-toggle-padding: var(--space-xtiny, 2px);
  --loop-toggle-label-size: 13px;                        --loop-toggle-label-leading: 15px;
  --loop-toggle-label-tracking: 0px;
  --loop-toggle-label-gap: var(--space-tiny, 4px);      --loop-toggle-row-minh: 32px;
}
.loop-toggle-small {
  --loop-toggle-track-w: 32px;  --loop-toggle-track-h: 16px;  --loop-toggle-circle: 12px;
  --loop-toggle-padding: var(--space-xtiny, 2px);
  --loop-toggle-label-size: var(--font-size-100, 12px); --loop-toggle-label-leading: 14px;
  --loop-toggle-label-tracking: 0.25px;
  --loop-toggle-label-gap: var(--space-tiny, 4px);      --loop-toggle-row-minh: 32px;
}

/* ---- Label wrapper — Switch has no bound label, so the label is a sibling laid out here ---- */
.loop-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--loop-toggle-label-gap, 4px);
  min-height: var(--loop-toggle-row-minh, 32px);
}
.loop-toggle__label {
  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-toggle-label-size, 13px);
  font-weight: var(--loop-toggle-label-weight, 400);
  line-height: var(--loop-toggle-label-leading, 15px);
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
| Disabled | track `Disable` #8a9db1 (neutral-40), inert, label muted |
| Read-Only | track `Disable/Lowest` #e7edf3 (neutral-10) both states, thumb ringed 2px `Pressed` #012740, ON check stays #004370, **label NOT muted**, inert |
| Focus | 2px `Focused` #0071bc (blue-50) ring, offset 2px |

Thumb is always `Background/White`. **Label:** Open Sans 400, 16/18, `Text/On Light/Default`,
gap 8px (`loop/toggle/label/gap`), row min-height 40px.

### Read-Only (Figma 25862-16199) — not the same as Disabled
Read-Only shows the current state but **can't be toggled**, while the label stays fully
readable (Disabled mutes it). Native checkboxes ignore `[readonly]`, so it is class-driven:
add **`.is-read-only`** on the Switch widget (Extended Class), or drive the whole field with
**`.loop-field--read-only`** on the wrapping Field. Both make the control inert
(`pointer-events:none`) — also set `aria-readonly="true"` on the widget for assistive tech.
The rule keys off `:empty` pseudo-elements, so it needs the same native `[data-switch]` markup.

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

Context (already done): loop-switch.css, dist/tokens.css and dist/theme.css are already pasted into the ODC
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
