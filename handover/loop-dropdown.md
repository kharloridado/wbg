# Handover — Dropdown / Select (restyle native OutSystems UI Dropdown + VirtualSelect)

The Loop **Dropdown / Select** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Select" [node 18787-4817] · "Multiselect" [node 18830-17312].

**Approach:** No custom dropdown class system. This **restyles the two native OutSystems UI
dropdown widgets** to The Loop design — same pattern as the Button / Text Field:

1. **Dropdown PATTERN** (server-side single Select) → `.dropdown-container.dropdown` /
   `.dropdown-display` / `.dropdown-list` / `.dropdown-popup-row`.
2. **VirtualSelect PROVIDER** (Dropdown Search = searchable single; Dropdown Tags =
   multi-select with tag chips) → `.osui-dropdown-search` / `.osui-dropdown-tags`
   rendered as `.vscomp-*` DOM.

Developers keep using the stock **Dropdown** / **Dropdown Search** / **Dropdown Tags**
blocks; this layer makes them render to The Loop spec. The field reuses the Text Field's
state **colours** (shared semantic tokens) but has its own box metrics: a pill
(`--radius-pill` 32px), 13px text, ~40px tall. Focus = 2px Blue/50 brand ring (FND-012).

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Dropdown / Select page.

**What it is.** The Loop select — native Dropdown (single) and VirtualSelect (searchable single / multi-tag) restyled.

**When to use**
- Choose one or several values from a longer list.
- **Dropdown Search** for long lists that benefit from filtering.
- **Dropdown Tags** when the user picks several values shown as chips.

**When not to use** (reach for instead)
- ≤5 always-visible options → **Radio Button** or **Button Group**.
- Free-text entry → **Text Field**.

**How to use**
- Use the stock **Dropdown** / **Dropdown Search** / **Dropdown Tags** blocks — the styling applies automatically.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-dropdown.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/component-field.css` → `dist/theme.css` | Theme CSS (adds the `--loop-select-*` / `--loop-multiselect-*` tokens) |

> Canonical CSS lives in `src/blocks/loop-dropdown.css`; it is embedded into this ticket by
> `node build/embed-handover-code.mjs` — re-run after editing the source to keep them in sync.

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-dropdown.css</code> → Theme CSS — paste below OutSystems UI (provider CSS is runtime-injected)</summary>

```css
/* loop-dropdown.css — Dropdown / Select: native Dropdown pattern + VirtualSelect provider restyle */

/* =====================================================================
   1) Native Dropdown PATTERN — single Select  (.dropdown-container.dropdown)
   ===================================================================== */

/* ---- Field box (Default / Filled / Selected share this) ---- */
.dropdown-container.dropdown > div.dropdown-display,
.dropdown-container.dropdown > select.dropdown-display {
  height: var(--loop-select-h, 40px);   /* pinned height so the border never grows the box */
  padding: var(--loop-select-padding-block, 11px) var(--loop-select-padding-inline, 16px);
  gap: var(--loop-select-gap, 8px);

  background-color: var(--color-bg-container-on-light-lowest);
  border: 1px solid var(--color-outline-on-light-default);
  border-radius: var(--loop-select-radius);
  color: var(--color-text-on-light-default);

  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-select-text-size, 13px);
  font-weight: var(--font-weight-regular, 400);
  line-height: var(--loop-select-text-leading, 14px);
  letter-spacing: var(--loop-select-text-tracking, 0.5px);
}

/* Select label is 13px, vs the shared .loop-field 16px label */
.loop-field--select [data-label],
.loop-field--select label {
  font-size: var(--loop-select-label-size, 13px);
  line-height: var(--loop-select-label-leading, 16px);
  letter-spacing: var(--loop-select-label-tracking, 0.25px);
}

/* value / placeholder content */
.dropdown-container.dropdown .dropdown-display-content > span,
.dropdown-container.dropdown .dropdown-display-content > div {
  font-size: var(--loop-select-text-size, 13px);
}
/* placeholder (no value yet) — author adds .is-placeholder on the container */
.dropdown-container.dropdown.is-placeholder .dropdown-display-content {
  color: var(--color-text-on-light-subdued);
}

/* ---- Down-chevron — re-enable the container's suppressed ::after ---- */
.dropdown-container.dropdown > div.dropdown-display::after,
.dropdown-container.dropdown > select.dropdown-display::after {
  content: "";
  flex-shrink: 0;
  margin-left: auto;
  width: 8px;
  height: 8px;
  margin-top: -3px;                                               /* optical centre of the rotated glyph */
  border-right: 1.5px solid var(--color-icon-on-light-default);
  border-bottom: 1.5px solid var(--color-icon-on-light-default);
  transform: rotate(45deg);
}
.dropdown-container.dropdown.dropdown-expanded > div.dropdown-display::after {
  margin-top: 1px;
  transform: rotate(-135deg);                                     /* flips up when open */
}

/* ---- Hover ---- */
.dropdown-container.dropdown > div.dropdown-display:hover,
.dropdown-container.dropdown > select.dropdown-display:hover {
  border: 1px solid var(--color-outline-on-light-emphasis);
}

/* ---- Focused / Expanded — 2px brand ring; shrink padding 1px so the box doesn't jump as the border grows 1→2px ---- */
.dropdown-container.dropdown > div.dropdown-display:focus,
.dropdown-container.dropdown > div.dropdown-display:focus-visible,
.dropdown-container.dropdown > select.dropdown-display:focus,
.dropdown-container.dropdown.dropdown-expanded > div.dropdown-display {
  outline: none;
  border: 2px solid var(--color-outline-on-light-link-focused);
  padding: calc(var(--loop-select-padding-block, 11px) - 1px) calc(var(--loop-select-padding-inline, 16px) - 1px);
}

/* ---- Error — native .not-valid on the container ---- */
.dropdown-container.dropdown.not-valid > div.dropdown-display,
.dropdown-container.dropdown.not-valid > select.dropdown-display {
  background-color: var(--color-bg-container-state-error-low);
  border-color: var(--color-outline-on-light-state-error-high);
  color: var(--color-text-on-state-error-emphasis);
}
.dropdown-container.dropdown.not-valid > div.dropdown-display::after {
  border-color: var(--color-icon-on-light-state-error);
}

/* ---- Warning — added modifier .is-warning (no native dropdown warning state) ---- */
.dropdown-container.dropdown.is-warning > div.dropdown-display,
.dropdown-container.dropdown.is-warning > select.dropdown-display {
  background-color: var(--color-domain-state-warning-low);
  border-color: var(--color-outline-on-light-state-warning-high);
  color: var(--color-text-on-state-warning-emphasis);
}

/* ---- Disabled — native .dropdown-disabled / [disabled] ---- */
.dropdown-container.dropdown > div.dropdown-display.dropdown-disabled,
.dropdown-container.dropdown > div.dropdown-display[disabled],
.dropdown-container.dropdown > select.dropdown-display[disabled] {
  background-color: var(--color-domain-state-disable-low);
  border-color: var(--color-domain-state-disable-low);
  color: var(--color-text-on-light-state-disabled);
}
.dropdown-container.dropdown > div.dropdown-display.dropdown-disabled::after,
.dropdown-container.dropdown > div.dropdown-display[disabled]::after {
  border-color: var(--color-icon-on-light-state-disabled);
}

/* ---- Popup list ---- */
.dropdown-container.dropdown > div.dropdown-list {
  background-color: var(--color-bg-container-on-light-lowest);
  border: 1px solid var(--color-outline-on-light-subdued);
  border-radius: var(--loop-select-list-radius, 8px);
  box-shadow: var(--loop-select-list-shadow);
}
.dropdown-container.dropdown.dropdown-expanded-down > div.dropdown-list {
  margin-top: var(--space-tiny, 4px);
}

/* option rows */
.dropdown-container.dropdown .dropdown-popup-row {
  height: auto;
  min-height: 40px;
  gap: var(--loop-select-gap, 8px);
  padding: var(--space-xxsmall, 8px) var(--loop-select-padding-inline, 16px);
  color: var(--color-text-on-light-default);
  font-size: var(--loop-select-text-size, 13px);
}
.dropdown-container.dropdown .dropdown-popup-row:hover,
.dropdown-container.dropdown .dropdown-popup-row-selected:hover {
  background-color: var(--color-bg-container-on-light-low);
}
.dropdown-container.dropdown .dropdown-popup-row-selected {
  background-color: var(--color-bg-container-on-light-low);
  color: var(--color-text-on-light-default);
  font-weight: var(--font-weight-semibold, 600);
}

/* =====================================================================
   2) VirtualSelect PROVIDER — Dropdown Search (single) + Dropdown Tags (multi)
      A few field-box props use !important to beat the provider's own injected CSS.
   ===================================================================== */

/* ---- Field box (the wrapper is the visible pill) ---- */
.osui-dropdown-search .vscomp-ele-wrapper,
.osui-dropdown-tags .vscomp-ele-wrapper {
  min-height: 40px;
  background-color: var(--color-bg-container-on-light-lowest) !important;
  border: 1px solid var(--color-outline-on-light-default) !important;
  border-radius: var(--loop-select-radius) !important;
  color: var(--color-text-on-light-default);
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--font-size-300, 16px);
}
.osui-dropdown-tags .vscomp-ele-wrapper.multiple {
  border-radius: var(--loop-select-radius, 32px) !important;
}

/* toggle button (content row) */
.osui-dropdown-search .vscomp-toggle-button,
.osui-dropdown-tags .vscomp-toggle-button {
  gap: var(--loop-select-gap, 8px);
  padding: var(--loop-multiselect-padding-block, 12px) var(--loop-select-padding-inline, 16px);
  min-height: var(--loop-multiselect-min-content, 28px);
}

/* value / placeholder text */
.osui-dropdown-search .vscomp-value,
.osui-dropdown-tags .vscomp-value {
  color: var(--color-text-on-light-default);
}
.osui-dropdown-search .vscomp-wrapper:not(.has-value) .vscomp-value,
.osui-dropdown-tags .vscomp-wrapper:not(.has-value) .vscomp-value {
  color: var(--color-text-on-light-subdued);
}

/* chevron arrow — provider draws it with borders; recolour to the icon token */
.osui-dropdown-search .vscomp-arrow::after,
.osui-dropdown-tags .vscomp-arrow::after,
.osui-dropdown-search .vscomp-arrow,
.osui-dropdown-tags .vscomp-arrow {
  border-color: var(--color-icon-on-light-default) !important;
}

/* focused state */
.osui-dropdown-search .vscomp-ele-wrapper.focused,
.osui-dropdown-tags .vscomp-ele-wrapper.focused {
  border: 2px solid var(--color-outline-on-light-link-focused) !important;
  box-shadow: none !important;
}

/* clear button */
.osui-dropdown-search .vscomp-clear-icon,
.osui-dropdown-tags .vscomp-clear-icon {
  background-color: var(--color-icon-on-light-default);
}

/* ---- Tag chips (multi-select) — neutral chip, NOT the blue loop-tag block ---- */
.osui-dropdown-tags .vscomp-value-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--loop-select-tag-gap, 4px);
  padding: var(--loop-select-tag-padding-block, 8px) var(--loop-select-tag-padding-inline, 12px);
  border-radius: var(--loop-select-tag-radius, 48px) !important;
  background-color: var(--loop-select-tag-bg) !important;
  color: var(--color-text-on-light-default);
  font-size: var(--font-size-300, 16px);
  line-height: var(--font-size-300, 16px);
  letter-spacing: 0.25px;
}
.osui-dropdown-tags .vscomp-value-tag-content {
  color: var(--color-text-on-light-default);
}
.osui-dropdown-tags .vscomp-value-tag-clear-button {
  width: var(--loop-select-tag-cross-size, 14px);
  height: var(--loop-select-tag-cross-size, 14px);
}
.osui-dropdown-tags .vscomp-value-tag-clear-button .vscomp-clear-icon {
  background-color: var(--color-icon-on-light-default);
}
.osui-dropdown-tags .vscomp-value-tag-clear-button:focus-visible {
  outline: 2px solid var(--color-outline-on-light-link-focused);
  outline-offset: 2px;
  border-radius: 2px;
}

/* ---- Options dropbox (open list) ---- */
.osui-dropdown-search .vscomp-dropbox,
.osui-dropdown-tags .vscomp-dropbox {
  background-color: var(--color-bg-container-on-light-lowest) !important;
  border: 1px solid var(--color-outline-on-light-subdued) !important;
  border-radius: var(--loop-select-list-radius, 8px) !important;
  box-shadow: var(--loop-select-list-shadow) !important;
}
.osui-dropdown-search .vscomp-option,
.osui-dropdown-tags .vscomp-option {
  padding: var(--space-xxsmall, 8px) var(--loop-select-padding-inline, 16px);
  color: var(--color-text-on-light-default);
  font-size: var(--font-size-200, 14px);
}
.osui-dropdown-search .vscomp-option.hovered,
.osui-dropdown-search .vscomp-option.focused,
.osui-dropdown-tags .vscomp-option.hovered,
.osui-dropdown-tags .vscomp-option.focused {
  background-color: var(--color-bg-container-on-light-low) !important;
}
.osui-dropdown-search .vscomp-option.selected,
.osui-dropdown-tags .vscomp-option.selected {
  background-color: var(--color-bg-container-on-light-low) !important;
  color: var(--color-text-on-light-default);
}

/* search box inside the open list */
.osui-dropdown-search .vscomp-search-container,
.osui-dropdown-tags .vscomp-search-container {
  border-bottom: 1px solid var(--color-outline-on-light-subdued);
  padding: var(--space-xtiny, 4px) var(--loop-select-padding-inline, 16px);
}
/* leading magnifier glyph (provider ships none in this build) */
.osui-dropdown-search .vscomp-search-container::before,
.osui-dropdown-tags .vscomp-search-container::before {
  content: "";
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  margin-right: var(--space-xxsmall, 8px);
  background-color: var(--color-icon-on-light-subdued);
  -webkit-mask: var(--loop-select-search-icon) center / contain no-repeat;
  mask: var(--loop-select-search-icon) center / contain no-repeat;
}
.osui-dropdown-search .vscomp-search-input,
.osui-dropdown-tags .vscomp-search-input {
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--font-size-200, 14px);
  color: var(--color-text-on-light-default);
}

/* =====================================================================
   3) Live-provider refinements — DOM only the runtime VirtualSelect emits
   ===================================================================== */

/* Move the provider's left .checkbox-icon to the trailing edge and suppress the
   unchecked square, so selected rows get a right-aligned check and others are bare. */
.osui-dropdown-tags .vscomp-option .vscomp-option-text { order: 1; }
.osui-dropdown-tags .vscomp-option .checkbox-icon {
  order: 2;
  margin-left: auto;          /* push the marker to the trailing edge */
  margin-right: 0;
  width: 16px;
  height: 16px;
}
/* unchecked rows: no marker at all (provider draws a square checkbox by default) */
.osui-dropdown-tags .vscomp-option:not(.selected) .checkbox-icon { display: none; }
/* selected rows: a clean brand check mark (fully redefined so the provider's
   purple-tick geometry never partially wins on equal specificity) */
.osui-dropdown-tags .vscomp-option.selected .checkbox-icon::after {
  width: 60%;
  height: 100%;
  margin: 0 auto;
  border: 2px solid var(--color-icon-on-light-link-enabled);
  border-top-color: transparent;
  border-left-color: transparent;
  transform: rotate(45deg) translate(-1px, -2px);
}

/* "+N" overflow alias (.more-value-count) — a compact, non-removable neutral pill */
.osui-dropdown-tags .vscomp-value-tag.more-value-count {
  font-weight: var(--font-weight-semibold, 600);
}

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .dropdown-container.dropdown > div.dropdown-display,
  .dropdown-container.dropdown > div.dropdown-display::after,
  .osui-dropdown-search .vscomp-ele-wrapper,
  .osui-dropdown-tags .vscomp-ele-wrapper { transition: none; }
}
```

</details>

## State mapping (Figma "State" → OutSystems)
| The Loop | How |
|---|---|
| **Default / Filled / Selected** | native — base `.dropdown-display` / `.vscomp-ele-wrapper` |
| **Placeholder** | single Dropdown: add `is-placeholder` on the container (subdued text); VirtualSelect: native `:not(.has-value)` |
| **Open / Expanded** | native — `.dropdown-expanded` (chevron flips, 2px Blue ring) |
| **Error** | native — `.not-valid` on the dropdown container (OutSystems validation) |
| **Warning** | added modifier — Extended Class `is-warning` on the container |
| **Disabled** | native — Dropdown *Enabled = False* (`.dropdown-disabled` / `[disabled]`) |

> Warning has no native dropdown state, so it is the one-off added modifier (same idea as
> the Text Field's `is-warning`).

## Label + helper layout (apply on the field Container via Extended Class)
- `loop-field loop-field--select` — vertical label sized for the **single Select** (13px).
- `loop-field` (no `--select`) — for the **Multi-select**, whose Figma label is 16px.
- `loop-field loop-field--horizontal` — label inline, left of the field.
- The **Label** needs no extra class — The Loop restyles the native `[data-label]`.
- `loop-field__helper` on the helper Text; state modifier colours it: `--error` / `--warning` / `--success` / `--disabled`.

## What the override changes vs OutSystems UI baseline
- Field **pill** radius (`--radius-pill` 32px) — note this differs from the Text Field's 8px (FND-031).
- White fill, 1px `--color-outline-on-light-default` border, **13px** value/placeholder (single Select), Open Sans.
- **Chevron** re-enabled on `.dropdown-display::after` (native suppresses it) — CSS glyph in `--color-icon-on-light-default`, flips up when open.
- **2px Blue/50** focus/expanded ring (padding shrinks 1px so the box doesn't jump).
- Tinted **Error** (red) / **Warning** (yellow) / **Disabled** (neutral) fills + borders.
- Popup **list**: white, 8px radius, low shadow, subtle border.
- Multi-select **tag chips** (`.vscomp-value-tag`): neutral pill (`#f5f7f9`, radius 48), 14px clear icon.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for Dropdown to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-dropdown.css and dist/theme.css are already pasted into the ODC
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
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new `--loop-select-*` tokens).
- [ ] Paste `loop-dropdown.css` into Theme CSS, **below** OutSystems UI.
- [ ] Single Select → native **Dropdown** widget; Search → **Dropdown Search**; Multi → **Dropdown Tags**.
- [ ] Error → bind an OutSystems **Validation** (sets `.not-valid`); Warning → Extended Class `is-warning`; empty single Select → `is-placeholder`.
- [ ] Wrap Label + field + helper in a Container with `loop-field loop-field--select` (single) or `loop-field` (multi).
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview). The VirtualSelect DOM is provider-generated — confirm the `.vscomp-*` overrides land on the published markup.

## Open findings linked to this work (register-only — low, no GitHub Bug auto-filed)
- **FND-031** (consistency/design-token, low) — Select field metrics diverge from the Text Field & scale: pill `--radius-pill` 32px vs Text Field `--radius-medium` 8px; `vpadding` 11px off the 4pt grid; label/value 13px vs the 16px used by Text Field & Multi-select.
- **FND-032** (design-token, low) — popup-list border `#dae1e8` is a foreign `lift` token with no WBG primitive; substituted to `--color-outline-on-light-subdued`.
- **FND-019** (a11y/contrast, medium, shared) — resting border `#00396b3d` ≈ 1.45:1 on white (non-text contrast, SC 1.4.11).
- **FND-012** (a11y/brand, medium, cross-ref) — Blue/50 brand focus ring replaces OutSystems' high-contrast yellow ring.
