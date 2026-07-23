# Handover — Dropdown Search (restyle native OutSystems UI Dropdown Search)

The Loop **Dropdown Search** styling (single-select, searchable), ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Select" [node 18787-4817] (the closed field reuses the single
Select surface; the open balloon reuses the Select popup spec).

> **Revived 2026-07-23.** Dropdown Search was descoped on 2026-07-07; it was brought back into
> scope per the customer goal (the two OSUI Dropdown pattern pages, `Native=True`). This ticket
> is the **single-select searchable** variant only. The **multi-select** cousin (Dropdown Tags)
> is a separate ticket — `handover/loop-dropdown-tags.md`. The plain single Select (div + native
> `<select>`) is `handover/loop-dropdown.md`.

**Approach:** No custom class system. This **restyles the native OutSystems UI Dropdown Search
pattern** (`Interaction.DropdownSearch`), which OSUI builds on the **VirtualSelect** provider —
exactly like Dropdown Tags, but single-select. The override is scoped to OSUI's own
`osui-dropdown-search` class on the `.vscomp-ele` root; nothing mutates OSUI/VirtualSelect
internals. It **reuses the same techniques** as `loop-dropdown-tags.css` (inset-shadow ring,
FA-6-Pro icon glyphs re-pointed onto OSUI's `::after` pseudo-elements, mirrored-class balloon
scoping) and the **same `--loop-select-*` / `--loop-select-option-*` tokens** as the single
Select — so the closed field is pixel-consistent with `loop-dropdown.css` and the open balloon
matches the Select popup.

Key differences from Tags: the value is **one text label** (no chips, no "+N", no companion
fit-script), and the **search input lives in the provider's own balloon** (not in the field).

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Dropdown Search page.

**What it is.** The Loop searchable single-select — native Dropdown Search restyled.

**When to use**
- Choose **one** value from a **long** list where scanning/scrolling is slow — typing filters.

**When not to use** (reach for instead)
- Short list (≤ a screen) → **Dropdown / Select** (`handover/loop-dropdown.md`).
- Multiple values → **Dropdown Tags** (`handover/loop-dropdown-tags.md`).
- ≤5 always-visible options → **Radio Button** / **Button Group**.

**How to use**
- Use the stock **Dropdown Search** block — the styling applies automatically (the block already
  carries the `osui-dropdown-search` class the CSS scopes to).
- Field size follows the wrapper: put the Dropdown Search inside a `.loop-field--xlarge/large/
  regular/small` Field Wrapper to scale it (56/48/40/32), same ramp as the single Select.

## Notes / known limitations

- **Balloon scoping.** In ODC the VirtualSelect balloon is appended to `<body>` and mirrors the
  wrapper's provider classes but **not** the OSUI `osui-dropdown-search` root class — so the
  balloon rules are scoped on `.vscomp-wrapper.has-search-input:not(.multiple)` (the `:not(.multiple)`
  keeps them off the Dropdown Tags balloon). Do not re-scope them under `.osui-dropdown-search`.
- **Placeholder contrast** inherits the system-wide **FND-071** (the shared subdued placeholder
  token is 3.83:1 on white) — built faithfully, flagged, awaiting a designer call on the token.
- **Balloon search magnifier** is drawn by OSUI's legacy `FontAwesome` icon font, which this
  theme deliberately never declares (**FND-084**) — it renders in ODC but shows as a tofu box in
  the local `preview/` harness.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-dropdown-search.css` | Theme CSS (paste **below** OutSystems UI so it wins; VirtualSelect provider CSS already ships inside `outsystems-ui.css`) |
| `tokens/component-field.css` → `dist/theme.css` | Theme CSS (the `--loop-select-*` / `--loop-select-option-*` tokens — shared with the single Select, paste once) |

> Canonical CSS lives in `src/blocks/loop-dropdown-search.css`; it is embedded into this ticket by
> `node build/embed-handover-code.mjs` — re-run after editing the source to keep them in sync.

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-dropdown-search.css</code> → Theme CSS — paste below OutSystems UI (VirtualSelect provider CSS ships inside outsystems-ui.css)</summary>

```css
/* loop-dropdown-search.css — Dropdown SEARCH (single-select, searchable).
   A restyle of the OutSystems VirtualSelect provider in its SINGLE-select form
   (Interaction.DropdownSearch). ExtendedClass hook: `osui-dropdown-search` — already OSUI's
   own class on the .vscomp-ele root, we simply scope to it; nothing here mutates OSUI internals.

   Revived 2026-07-23 (it was descoped 2026-07-07). Sibling of loop-dropdown-tags.css, which
   restyles the SAME provider in its multi-select "Tags" form — this file reuses that file's
   proven techniques (inset-shadow ring, FA-glyph icons, mirrored-class balloon scoping) but for
   single-select: the value is ONE text label (no chips, no "+N", no fit-script), and the search
   input lives in the provider's own balloon rather than in the field.

   Closed field matches the native single Select (loop-dropdown.css §1): the --loop-select-*
   scale (40px box · 13px text · 16px chevron · 8px radius). Open balloon matches the Select
   popup: 8px radius, --shadow-low, 14px rows with a right-aligned selected check.

   THE CASCADE WE ARE FIGHTING (same as Tags — all ships inside outsystems-ui.css):
     · OSUI bundles VirtualSelect v1.1.5's stylesheet verbatim then layers its own theme; our
       rules land after both, so prefixing with `.osui-dropdown-search` (+0,1,0) out-specifies
       the provider/theme rules rather than spraying !important.
     · The chevron is NOT `.vscomp-arrow` (OSUI hides it) — OSUI draws the caret as an icon-font
       glyph on `.vscomp-toggle-button::after`; we re-point that pseudo at the FA family + codepoint.
     · The clear × is OSUI's icon-font glyph on `.vscomp-clear-icon::after`; the provider's two
       rotated background bars underneath are already neutralised by OSUI.
   ===================================================================== */

/* =====================================================================
   1) Field box — the single Select surface (--loop-select-* scale)
   ===================================================================== */
.osui-dropdown-search {
  /* single-select cluster is a 16px chevron (Select scale), NOT the Tags 20px */
  --loop-select-icon-size: 16px;
}

.osui-dropdown-search .vscomp-toggle-button {
  --vscomp-toogle-btn-arrow-size: var(--loop-select-icon-size, 16px);

  height: var(--loop-select-h, 40px);
  min-height: var(--loop-select-h, 40px);
  line-height: normal;

  background-color: var(--color-bg-container-on-light-lowest);
  /* Outline is an INSET shadow, not a border, so it occupies zero layout (same reasoning as
     loop-dropdown-tags.css §1 — the provider pins the toggle height, a real border would grow it). */
  border: 0;
  box-shadow: inset 0 0 0 1px var(--color-outline-on-light-default);
  border-radius: var(--loop-select-radius);
  color: var(--color-text-on-light-default);

  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-select-text-size, 13px);
}

/* Padding. Carry the wrapper class to out-specify OSUI's toggle padding rule. The right side
   reserves the gutter the absolutely-positioned icon cluster lives in (§3): 16 edge + 16 chevron
   + 8 gap + 16 clear + 8 gap = 64px. */
.osui-dropdown-search .vscomp-wrapper .vscomp-toggle-button {
  padding: var(--loop-select-padding-block, 11px)
           calc(var(--loop-select-padding-inline, 16px)
                + var(--loop-select-icon-size, 16px)
                + var(--loop-field-gap, 8px)
                + var(--loop-select-icon-size, 16px)
                + var(--loop-field-gap, 8px))
           var(--loop-select-padding-block, 11px)
           var(--loop-select-padding-inline, 16px);
  gap: var(--loop-field-gap, 8px);
}

.osui-dropdown-search .vscomp-toggle-button:hover {
  box-shadow: inset 0 0 0 1px var(--color-outline-on-light-emphasis);
}

/* Focus — the design's own 2px ring; inset shadow so the thicker ring still costs zero layout.
   The :focus-within arm matches loop-dropdown-tags.css: the provider adds `.focused` only while
   the balloon is open, so after Escape (caret kept in the field) only :focus-within still shows
   the ring (WCAG 2.4.7). */
.osui-dropdown-search .vscomp-wrapper.focused .vscomp-toggle-button,
.osui-dropdown-search .vscomp-wrapper:focus .vscomp-toggle-button,
.osui-dropdown-search .vscomp-wrapper:focus-visible .vscomp-toggle-button,
.osui-dropdown-search .vscomp-wrapper:focus-within .vscomp-toggle-button {
  box-shadow: inset 0 0 0 2px var(--color-outline-on-light-link-focused);
  outline: none;
}

/* =====================================================================
   2) Value / placeholder — a single text label (NOT chips)
   ===================================================================== */
.osui-dropdown-search .vscomp-value {
  /* The provider pins this a fixed ~20px tall; with our 14px line-height the single line then sits
     at the TOP of that box and reads high. Collapse it to its own line (height:auto) so the
     toggle's `align-items:center` (§1) centres the text. */
  height: auto;
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-select-text-size, 13px);
  line-height: var(--loop-select-text-leading, 14px);
  letter-spacing: var(--loop-select-text-tracking, 0.5px);
  color: var(--color-text-on-light-default);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Placeholder — the subdued alpha the sibling Text Field / Tags use, NOT the orphan
   --color-text-on-light-subdued (FND-020 / FND-071 lineage). */
.osui-dropdown-search .vscomp-wrapper:not(.has-value) .vscomp-value {
  color: var(--color-neutral-alpha-57);
  opacity: 1;
}

/* =====================================================================
   3) Right icon cluster — clear × + chevron ⌄  (absolutely positioned by OSUI)
      Figma single Select: chevron 16px at the 16px edge; clear-all 16px one 8px gap to its left
      → clear right = 16 + 16 + 8 = 40px.
   ===================================================================== */
.osui-dropdown-search .vscomp-toggle-button::after {          /* chevron glyph */
  right: var(--loop-select-padding-inline, 16px);
  color: var(--color-icon-on-light-default);
}

.osui-dropdown-search .vscomp-clear-button,
.osui-dropdown-search .vscomp-wrapper:not(.text-direction-rtl).has-value .vscomp-clear-button {
  right: calc(var(--loop-select-padding-inline, 16px)
              + var(--loop-select-icon-size, 16px)
              + var(--loop-field-gap, 8px));               /* 40px */
  top: 50%;
  margin-top: 0;
  transform: translateY(-50%);
  width: var(--loop-select-icon-size, 16px);
  height: var(--loop-select-icon-size, 16px);
  border-radius: 0;
}

.osui-dropdown-search .vscomp-clear-button:hover {
  background-color: transparent;
}

.osui-dropdown-search .vscomp-clear-button:focus-visible {
  outline: 2px solid var(--color-outline-on-light-link-focused);
  outline-offset: 2px;
}

/* =====================================================================
   4) Icons — FA 6 Pro glyphs (re-point OSUI's icon-font ::after pseudo-elements,
      exactly as loop-search.css / loop-datepicker.css / loop-dropdown-tags.css §5).
   ===================================================================== */
.osui-dropdown-search .vscomp-toggle-button::after,
.osui-dropdown-search .vscomp-clear-icon::after {
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-solid, 900);
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: var(--color-icon-on-light-default);
}

/* chevron-down */
.osui-dropdown-search .vscomp-toggle-button::after {
  content: "\f078";                                    /* fa-chevron-down */
  font-size: var(--loop-select-icon-size, 16px);
}

/* xmark (clear-all) — neutralise the provider's two rotated background bars so only the glyph shows */
.osui-dropdown-search .vscomp-clear-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}
.osui-dropdown-search .vscomp-clear-icon::before {
  display: none;
}
.osui-dropdown-search .vscomp-clear-icon::after {
  content: "\f00d";                                    /* fa-xmark */
  position: static;
  width: auto;
  height: auto;
  background: none;
  transform: none;
  text-indent: 0;
  font-size: var(--loop-select-icon-size, 16px);
}

/* =====================================================================
   5) States — inherited from the Field Wrapper, matching loop-dropdown.css /
      loop-dropdown-tags.css §6. All re-colour the same inset ring §1 draws (never a real
      border, or the field would change height between states).
   ===================================================================== */
.loop-field--error .osui-dropdown-search .vscomp-toggle-button,
.osui-dropdown-search.osui-dropdown--not-valid .vscomp-toggle-button {
  background-color: var(--color-bg-container-state-error-low);
  box-shadow: inset 0 0 0 1px var(--color-outline-on-light-state-error-high);
}

.loop-field--warning .osui-dropdown-search .vscomp-toggle-button {
  background-color: var(--color-domain-state-warning-low);
  box-shadow: inset 0 0 0 1px var(--color-outline-on-light-state-warning-high);
}

.loop-field--disabled .osui-dropdown-search .vscomp-toggle-button,
.osui-dropdown-search.vscomp-ele[disabled] .vscomp-toggle-button {
  background-color: var(--color-domain-state-disable-low);
  /* disabled outline is white-48 over the #dae3eb fill — a light inner edge (do NOT reuse the
     fill colour, the ring would vanish). Same as loop-dropdown-tags.css §6. */
  box-shadow: inset 0 0 0 1px var(--color-gray-alpha-white-48);
  color: var(--color-text-on-light-state-disabled);
}
.loop-field--disabled .osui-dropdown-search .vscomp-value,
.osui-dropdown-search.vscomp-ele[disabled] .vscomp-value {
  color: var(--color-text-on-light-state-disabled);
}

/* =====================================================================
   6) Option list — the open balloon (matches the single Select popup)
      SCOPING RULE (load-bearing, same lesson as loop-dropdown-tags.css §7): in ODC the provider
      appends the balloon to <body> as a `.vscomp-dropbox-wrapper` that MIRRORS the wrapper's
      classes — but NOT the OSUI `osui-dropdown-search` root class — so a root-scoped rule would
      never reach it. Scope on the mirrored provider classes instead:
      `.vscomp-wrapper.has-search-input:not(.multiple)` — `.has-search-input` is the Search
      variant's marker, `:not(.multiple)` excludes the Tags balloon (which is `.multiple`).
   ===================================================================== */
.vscomp-wrapper.has-search-input:not(.multiple) .vscomp-dropbox {
  background-color: var(--color-bg-container-on-light-lowest);
  border-radius: var(--loop-select-list-radius, 8px);
  box-shadow: var(--loop-select-list-shadow);          /* 0 2px 8px — the single Select popup shadow */
  padding: 0;
}

/* Balloon search input — Open Sans, subdued placeholder, no provider chrome */
.vscomp-wrapper.has-search-input:not(.multiple) .vscomp-search-input {
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-select-text-size, 13px);
  color: var(--color-text-on-light-default);
}
.vscomp-wrapper.has-search-input:not(.multiple) .vscomp-search-input::placeholder {
  color: var(--color-neutral-alpha-57);
  opacity: 1;
}

.vscomp-wrapper.has-search-input:not(.multiple) .vscomp-option {
  background-color: var(--color-bg-container-on-light-lowest);
  padding: 0 var(--loop-select-option-padding-inline, 12px);
}

.vscomp-wrapper.has-search-input:not(.multiple) .vscomp-option-text {
  width: auto;
  flex: 1;
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-select-option-text-size, 14px);
  font-weight: var(--font-weight-regular, 400);
  line-height: 1.5;
  color: var(--color-text-on-light-default);
}

/* Selected row — #e7edf3 fill + a right-aligned FA check (same glyph pattern as §4). */
.vscomp-wrapper.has-search-input:not(.multiple) .vscomp-option.selected {
  background-color: var(--loop-select-option-selected-bg);
}
.vscomp-wrapper.has-search-input:not(.multiple) .vscomp-option.selected::after {
  content: "\f00c";                                    /* fa-check */
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-solid, 900);
  font-size: var(--loop-select-option-check-size, 16px);
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: var(--color-icon-on-light-default);
  margin-left: var(--loop-select-option-check-gap, 8px);
  flex-shrink: 0;
}

/* Hover / keyboard-focused row — one step lighter than the selected fill; selected wins. */
.vscomp-wrapper.has-search-input:not(.multiple) .vscomp-option.focused {
  background-color: var(--color-bg-container-on-light-low);
}
.vscomp-wrapper.has-search-input:not(.multiple) .vscomp-option.selected.focused {
  background-color: var(--loop-select-option-selected-bg);
}

/* Empty state ("Nothing to show") */
.vscomp-wrapper.has-search-input:not(.multiple) .vscomp-no-options {
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-select-option-text-size, 14px);
  color: var(--color-text-on-light-subdued);
}

/* =====================================================================
   7) Sizes — the Field Wrapper cascade, matching the single Select ramp (loop-dropdown.css §2):
      height 56/48/40/32, vpadding 18/14/11/8, text 16/14/13/12. One modifier re-points the
      --loop-select-* props the rules above already read. Regular is the token default but is
      re-declared so a field nested under an outer sized wrapper still resolves to its own size.
      The body-appended balloon inherits none of this — correct, the option list is size-independent.
   ===================================================================== */
.loop-field--xlarge .osui-dropdown-search {
  --loop-select-h: 56px;
  --loop-select-padding-block: var(--loop-field-padding-block, 18px);
  --loop-select-text-size: 16px;    --loop-select-text-leading: 16px;
}
.loop-field--large .osui-dropdown-search {
  --loop-select-h: 48px;
  --loop-select-padding-block: 14px;
  --loop-select-text-size: 14px;    --loop-select-text-leading: 16px;
}
.loop-field--regular .osui-dropdown-search {
  --loop-select-h: 40px;
  --loop-select-padding-block: 11px;
  --loop-select-text-size: 13px;    --loop-select-text-leading: 14px;
}
.loop-field--small .osui-dropdown-search {
  --loop-select-h: 32px;
  --loop-select-padding-block: 8px;
  --loop-select-padding-inline: var(--space-xsmall, 12px);
  --loop-select-text-size: 12px;    --loop-select-text-leading: 12px;
}
```

</details>

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for DropdownSearch to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-dropdown-search.css, dist/tokens.css and dist/theme.css are already pasted into the ODC
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
- [ ] Paste `loop-dropdown-search.css` into Theme CSS, below OutSystems UI.
- [ ] Confirm `dist/theme.css` (tokens) is already pasted (shared with the single Select).
- [ ] Drop a **Dropdown Search** block on a screen; verify closed field, open balloon (search +
      options + selected fill/check), states, and the size ramp.
