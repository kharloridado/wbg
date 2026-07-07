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

/* ---- Single vs multi proportions ----
   The two providers share the field-box rules below, but the single Select
   (Dropdown Search, Figma 18770:10424) and the multi-select (Dropdown Tags,
   18830:17333) differ in text size, vertical padding, content floor, and right-
   icon size. Resolve those four through scoped alias vars so the grouped
   selectors stay DRY while each surface renders its own spec. */
.osui-dropdown-search {
  --loop-vs-text-size:     var(--loop-select-text-size, 13px);          /* 13px single Select */
  --loop-vs-padding-block: var(--loop-select-padding-block, 11px);      /* 11px */
  --loop-vs-min-content:   0px;                                         /* single line — no tag-row floor */
  --loop-vs-icon-size:     var(--loop-select-icon-size-single, 16px);   /* 16px chevron */
}
.osui-dropdown-tags {
  --loop-vs-text-size:     var(--font-size-300, 16px);                  /* 16px multi-select */
  --loop-vs-padding-block: var(--loop-multiselect-padding-block, 12px); /* 12px */
  --loop-vs-min-content:   var(--loop-multiselect-min-content, 28px);   /* 28px placeholder floor */
  --loop-vs-icon-size:     var(--loop-select-icon-size, 20px);          /* 20px xmark + chevron */
}

/* ---- Field box (the wrapper is the visible pill) ---- */
.osui-dropdown-search .vscomp-ele-wrapper,
.osui-dropdown-tags .vscomp-ele-wrapper {
  min-height: 40px;
  background-color: var(--color-bg-container-on-light-lowest) !important;
  border: 1px solid var(--color-outline-on-light-default) !important;
  border-radius: var(--loop-select-radius) !important;
  color: var(--color-text-on-light-default);
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-vs-text-size, 16px);   /* 13px single Select · 16px tags (scoped alias above) */
}
.osui-dropdown-tags .vscomp-ele-wrapper.multiple {
  border-radius: var(--loop-select-radius, 8px) !important;
}

/* toggle button (content row) */
.osui-dropdown-search .vscomp-toggle-button,
.osui-dropdown-tags .vscomp-toggle-button {
  gap: var(--loop-select-gap, 8px);
  padding: var(--loop-vs-padding-block, 12px) var(--loop-select-padding-inline, 16px);   /* 11px single · 12px tags */
  min-height: var(--loop-vs-min-content, 28px);                                           /* 0 single · 28px tags */
  border: none;   /* provider ships a 1px #ddd toggle border → a double box inside the wrapper; Figma field has ONE border (the wrapper's) */
}
/* Tags box inset — the provider ships several higher-specificity toggle-padding rules
   (`.vscomp-wrapper.has-clear-button …` 0,3,0, `.has-value.show-value-as-tags …` 0,4,0)
   that squash our left/vertical padding to ~10px/4px-0. Re-assert Figma's 16px hpadding
   left + 12px vpadding with !important (beats the provider's non-important rules), while
   RESERVING the right gutter so the tag row never slides under the absolutely-positioned
   clear-all (xmark) + chevron on the right edge. */
.osui-dropdown-tags .vscomp-ele-wrapper .vscomp-toggle-button {
  padding-top: var(--loop-multiselect-padding-block, 12px) !important;
  padding-bottom: var(--loop-multiselect-padding-block, 12px) !important;
  padding-left: var(--loop-select-padding-inline, 16px) !important;
  padding-right: var(--loop-select-tags-padding-right, 72px) !important;
  gap: var(--loop-select-gap, 8px) !important;
}

/* value / placeholder text */
.osui-dropdown-search .vscomp-value,
.osui-dropdown-tags .vscomp-value {
  color: var(--color-text-on-light-default);
  font-size: var(--loop-vs-text-size, 16px);   /* provider hard-sets 14px; re-assert the scoped size (13px single · 16px tags) */
}
/* single Select value/placeholder tracking + leading (Figma .UI Component/Input/Placeholder/Text Field: 13/14, ls 0.5) */
.osui-dropdown-search .vscomp-value {
  line-height: var(--loop-select-text-leading, 14px);
  letter-spacing: var(--loop-select-text-tracking, 0.5px);
}
.osui-dropdown-search .vscomp-wrapper:not(.has-value) .vscomp-value,
.osui-dropdown-tags .vscomp-wrapper:not(.has-value) .vscomp-value {
  color: var(--color-neutral-alpha-57);   /* Figma placeholder = Text/On Light/Subdued #00294d91 (frozen ref) — matches the sibling Text Field; NOT the #000d1a91 orphan --color-text-on-light-subdued (FND-020) */
}

/* chevron arrow — the provider draws the ⌄ as a 45°-rotated box showing only its
   bottom+right borders (`border-color: transparent #111 #111 transparent`). Recolour
   ONLY those two edges to the icon token — colouring all four (the old rule) turns the
   chevron into a full square outline. */
.osui-dropdown-search .vscomp-arrow::after,
.osui-dropdown-tags .vscomp-arrow::after {
  border-color: transparent var(--color-icon-on-light-default) var(--color-icon-on-light-default) transparent !important;
}

/* right-icon boxes sized to spec (loop/field/icon size): single Select chevron = 16px,
   multi-select xmark + chevron = 20px — via the scoped --loop-vs-icon-size alias.
   Per-tag clear crosses stay 14px (below). */
.osui-dropdown-search .vscomp-arrow,
.osui-dropdown-tags .vscomp-arrow,
.osui-dropdown-search .vscomp-clear-button,
.osui-dropdown-tags .vscomp-clear-button {
  width: var(--loop-vs-icon-size, 20px);
  height: var(--loop-vs-icon-size, 20px);
}

/* ---- Tags field right-icon cluster: keep BOTH icons visible + vertically centred ----
   The provider HIDES the chevron once tags carry a value
   (`.show-value-as-tags.has-value .vscomp-arrow{display:none}`) and pins the clear-all to
   the top-right (`top:5px`). Figma shows the clear-all (xmark) AND the chevron in EVERY
   state as a right-edge cluster [xmark][chevron], both centred. Re-show the chevron, centre
   both, and place the xmark just left of the rightmost chevron. Space is reserved by the
   toggle's --loop-select-tags-padding-right so the tag row never runs under them. */
.osui-dropdown-tags .vscomp-wrapper.show-value-as-tags.has-value .vscomp-arrow {
  display: flex !important;
}
.osui-dropdown-tags .vscomp-ele-wrapper .vscomp-arrow {
  top: 50% !important;
  right: var(--loop-select-padding-inline, 16px) !important;   /* rightmost — 16px gutter */
  height: var(--loop-select-icon-size, 20px) !important;
  transform: translateY(-50%);
}
.osui-dropdown-tags .vscomp-ele-wrapper .vscomp-clear-button {
  top: 50% !important;
  right: calc(var(--loop-select-padding-inline, 16px) + var(--loop-select-icon-size, 20px) + var(--loop-select-gap, 8px)) !important;  /* left of the chevron */
  transform: translateY(-50%);
}

/* focused state — 2px brand ring with ZERO layout shift: keep the border at 1px and
   recolour it, then stack a 1px INSET shadow so it reads as 2px without growing the box
   (a real 1→2px border would jump the field 2px on focus). */
.osui-dropdown-search .vscomp-ele-wrapper.focused,
.osui-dropdown-tags .vscomp-ele-wrapper.focused {
  border: 1px solid var(--color-outline-on-light-link-focused) !important;
  box-shadow: inset 0 0 0 1px var(--color-outline-on-light-link-focused) !important;
}

/* ---- Field states (Error / Warning / Disabled) — driven by the loop-field wrapper
   modifiers, mirroring loop-text-field.css. The provider has no native warning/error
   surface, so the state lives on the .loop-field ancestor. ---- */
.loop-field--error .osui-dropdown-tags .vscomp-ele-wrapper,
.loop-field--error .osui-dropdown-search .vscomp-ele-wrapper {
  background-color: var(--color-bg-container-state-error-low) !important;
  border: 1px solid var(--color-outline-on-light-state-error-high) !important;
}
.loop-field--warning .osui-dropdown-tags .vscomp-ele-wrapper,
.loop-field--warning .osui-dropdown-search .vscomp-ele-wrapper {
  background-color: var(--color-domain-state-warning-low) !important;
  border: 1px solid var(--color-outline-on-light-state-warning-high) !important;
}
.loop-field--disabled .osui-dropdown-tags .vscomp-ele-wrapper,
.loop-field--disabled .osui-dropdown-search .vscomp-ele-wrapper {
  background-color: var(--color-domain-state-disable-low) !important;
  border: 1px solid var(--color-domain-state-disable-low) !important;
  color: var(--color-text-on-light-state-disabled);
}
/* disabled placeholder / value text + chips mute with the box */
.loop-field--disabled .osui-dropdown-tags .vscomp-value,
.loop-field--disabled .osui-dropdown-search .vscomp-value {
  color: var(--color-text-on-light-state-disabled);
}
.loop-field--disabled .osui-dropdown-tags .vscomp-value-tag {
  color: var(--color-text-on-light-state-disabled);
  opacity: 0.7;
}

/* clear icons (clear-all xmark + per-tag cross) — draw a clean thin "×" in the icon
   token colour. The provider ships a MIXED mechanism: `.vscomp-clear-icon::before/::after`
   as two rotated 2px bars (#999), an OSUI override that turns `::after` into an icon-FONT
   glyph, and our old rule painted the icon element a SOLID block. Reset all three to a
   crisp two-bar cross so it reads as the Figma xmark, not a filled blob. */
.osui-dropdown-search .vscomp-clear-icon,
.osui-dropdown-tags .vscomp-clear-icon {
  background-color: transparent !important;   /* was a solid square */
  position: relative;
}
.osui-dropdown-search .vscomp-clear-icon::before,
.osui-dropdown-search .vscomp-clear-icon::after,
.osui-dropdown-tags .vscomp-clear-icon::before,
.osui-dropdown-tags .vscomp-clear-icon::after {
  content: "" !important;                      /* kill the osui icon-font glyph on ::after */
  font-family: inherit !important;
  position: absolute;
  left: 50%;
  top: 0;
  width: 2px;
  height: 100%;
  background-color: var(--color-icon-on-light-default) !important;
}
.osui-dropdown-search .vscomp-clear-icon::before,
.osui-dropdown-tags .vscomp-clear-icon::before { transform: translateX(-50%) rotate(45deg); }
.osui-dropdown-search .vscomp-clear-icon::after,
.osui-dropdown-tags .vscomp-clear-icon::after { transform: translateX(-50%) rotate(-45deg); }

/* ---- Tag chips (multi-select) — neutral chip, NOT the blue loop-tag block ----
   The provider (outsystems-ui.css) ships `.vscomp-wrapper.show-value-as-tags
   .vscomp-value-tag` (specificity 0,3,0) which beats our 0,2,0 selector and forces
   font-size 12px, font-weight 600, and `padding: 6px 35px 6px 10px` (the 35px right
   reserves room for an ABSOLUTELY-positioned clear cross). So the chip's type/padding
   overrides need `!important`, and the cross must be pulled back into normal flow
   (position:static) or it overlaps the label. */
.osui-dropdown-tags .vscomp-value-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--loop-select-tag-gap, 4px);
  padding: var(--loop-select-tag-padding-block, 8px) var(--loop-select-tag-padding-inline, 12px) !important;
  border: 1px solid var(--loop-select-tag-border-color) !important;   /* Figma -loop tag stroke (Outline/On Light/Default) */
  border-radius: var(--loop-select-tag-radius, 48px) !important;
  background-color: var(--loop-select-tag-bg) !important;
  color: var(--color-text-on-light-default);
  font-size: var(--font-size-300, 16px) !important;
  line-height: var(--font-size-300, 16px) !important;
  font-weight: var(--font-weight-regular, 400) !important;   /* provider bolds tags to 600; Figma tag label is 400 */
  letter-spacing: var(--loop-select-tag-tracking, 0.25px) !important;
}
.osui-dropdown-tags .vscomp-value-tag-content {
  color: var(--color-text-on-light-default);
  font-size: inherit !important;   /* provider re-declares 12px on the content span */
  max-width: var(--loop-select-tag-text-max, 200px);   /* Figma tag text wrapper max-w */
  overflow: hidden;
  text-overflow: ellipsis;
}
/* Pull the cross back into inline flow — provider pins it `position:absolute; right:10px`,
   which lands it on TOP of the label. Static + the chip's 4px gap places it after the text. */
.osui-dropdown-tags .vscomp-value-tag-clear-button {
  position: static !important;
  width: var(--loop-select-tag-cross-size, 14px) !important;
  height: var(--loop-select-tag-cross-size, 14px) !important;
  margin: 0 !important;
  padding: 0 !important;
  flex: 0 0 auto;
  background-color: transparent !important;   /* provider fills it neutral-7 + border-radius:100% (a dark circle); Figma is a bare × */
  border-radius: 0 !important;
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
  padding: var(--space-xxsmall, 8px) var(--space-xsmall, 12px);   /* Figma -loop dropdown/item: 8px v · 12px h */
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
/* leading magnifier glyph (provider ships none in this build) — FA 6 Pro font glyph */
.osui-dropdown-search .vscomp-search-container::before,
.osui-dropdown-tags .vscomp-search-container::before {
  content: var(--loop-select-search-icon-char, "\f002");
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: var(--space-xxsmall, 8px);
  color: var(--color-icon-on-light-subdued, var(--color-icon-on-light-default));   /* subdued icon token is not defined in the schema — fall back to the standard icon colour so the glyph never inherits body text */
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--loop-select-search-icon-weight, 400);
  font-size: var(--loop-select-search-icon-glyph, 14px);
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
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

/* "+N" overflow alias (.more-value-count) — a compact, non-removable neutral pill.
   Figma's +N pill uses a narrower 6px inline padding than the 12px real-chip padding. */
.osui-dropdown-tags .vscomp-value-tag.more-value-count {
  padding: var(--loop-select-tag-padding-block, 8px) var(--loop-select-tag-count-padding-inline, 6px) !important;
  font-weight: var(--font-weight-semibold, 600) !important;   /* beat the base tag's 400 !important */
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
- Multi-select **tag chips** (`.vscomp-value-tag`): neutral pill (`#f5f7f9`, radius 48, 1px `--color-outline-on-light-default` border), **16px / weight 400** label, 12px/8px padding, and a clean inline **14px** clear-cross. The provider (`outsystems-ui.css`) beats us on specificity (`.vscomp-wrapper.show-value-as-tags .vscomp-value-tag` 0,3,0 → 12px/600/`6px 35px`), absolutely-positions the cross over the label, and gives it a dark `neutral-7` circle — all reset via `!important` + `position:static` + a two-bar "×".
- Multi-select **right icons**: OSUI hides the chevron once tags are selected (`.show-value-as-tags.has-value .vscomp-arrow{display:none}`) and top-pins the clear-all. The Loop restores BOTH as a vertically-centred right-edge cluster **[× clear-all][⌄ chevron]** (20px each), matching Figma's filled state; the toggle reserves `--loop-select-tags-padding-right` so tags never run under them.
- Multi-select **"+N" overflow**: styled as a compact 6px-padding neutral pill. The badge **text** ("+ N more…") is provider-generated, NOT CSS — set the Dropdown Tags block's `moreText` (VirtualSelect option) to `""` for the Figma-style compact **"+N"**.

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
- [ ] **Dropdown Tags** overflow badge — set the block's `moreText` VirtualSelect option to `""` for the compact Figma **"+N"** (default renders "+ N more…").
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview). The VirtualSelect DOM is provider-generated — confirm the `.vscomp-*` overrides land on the published markup.

## Open findings linked to this work (register-only — low, no GitHub Bug auto-filed)
- **FND-031** (consistency/design-token, low) — Select field metrics diverge from the Text Field & scale: pill `--radius-pill` 32px vs Text Field `--radius-medium` 8px; `vpadding` 11px off the 4pt grid; label/value 13px vs the 16px used by Text Field & Multi-select.
- **FND-032** (design-token, low) — popup-list border `#dae1e8` is a foreign `lift` token with no WBG primitive; substituted to `--color-outline-on-light-subdued`.
- **FND-019** (a11y/contrast, medium, shared) — resting border `#00396b3d` ≈ 1.45:1 on white (non-text contrast, SC 1.4.11).
- **FND-012** (a11y/brand, medium, cross-ref) — Blue/50 brand focus ring replaces OutSystems' high-contrast yellow ring.
