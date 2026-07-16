# Handover — AG Grid (The Loop restyle of AGGrid_Lib Community v33)

The Loop **AG Grid** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library (2)` · "AG Grid" [node 25983-72091] · frozen ref `loop/refs/cmp-ag-grid/`.

**Approach:** A **restyle** of the real **AG Grid Community v33** instance rendered by the
OutSystems `AGGrid_Lib` block (`.ag-grid__wrapper.ag-theme-quartz`). v33 ships no legacy
theme stylesheet — its look is runtime-injected via the **Theming API** (`<style
data-ag-global-css>`), so the override works in two layers: (1) `--ag-*` theme-param custom
properties set on the wrapper, which the injected CSS consumes, and (2) direct `.ag-*` class
rules for what the params can't express. Wins by **specificity** (wrapper-class prefix),
never `!important`. Same pixel-verified core values as the native `.table` restyle (see
`handover/loop-table.md`) re-expressed for AG's DOM — **styling only**, no AG Grid features
added or removed.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the AG Grid page.

**What it is.** The AG Grid data-grid surface at the Figma "AG Grid" look: Low `#f5f7f9`
header with bold 16px labels and short inset column separators, white body rows with subdued
1px dividers, 56px rows, 12/16px cell padding, flat edges (no outer border or radius) — the
same visual language as the native Table restyle, applied to the real AG Grid library instead.

**When to use**
- Any screen already using the OutSystems `AGGrid_Lib` block (real AG Grid Community v33) —
  sorting, column resize, per-column filters, row selection, virtualized scrolling.
- Reach for AG Grid over the native **Table** when the app needs AG Grid's own feature set
  (column tooling, large virtualized datasets); reach for the native **Table** restyle
  (`loop-table.css`) when it doesn't — don't add AG Grid just for the look.

**When not to use** (reach for instead)
- Plain tabular records with no AG Grid dependency → the native **Table** restyle
  (`handover/loop-table.md`).
- Card-per-record layouts → **Card / Card Item**.

**How to use**
- Paste `loop-ag-grid.css` into the Theme CSS below OutSystems UI (see Files). No
  ExtendedClass needed for the base look — it targets the AG Grid wrapper classes directly.
- **Zebra** → add `loop-ag-grid--zebra` to the block's wrapper element to fill even
  (`ag-row-odd`) rows with the Figma zebra tone.
- **Numeric columns** → set the column's AG Grid `type: 'rightAligned'` (or add
  `cellClass`/`headerClass` including `ag-right-aligned-cell` / `ag-right-aligned-header`) to
  get right-aligned tabular figures.
- **Pagination** → do not rely on AG's native paging panel for the Figma numbered-pager look;
  see `handover/loop-ag-grid-pagination.md`.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-ag-grid.css` | Theme CSS — paste below OutSystems UI (AG Grid v33 Theming API CSS is runtime-injected) |
| `tokens/component-table.css` → `dist/theme.css` | Theme CSS (adds the `--loop-table-*` AG Grid chrome tokens — shared with the Table restyle) |

> Canonical CSS lives in `src/blocks/loop-ag-grid.css`; it is embedded into this ticket by
> `node build/embed-handover-code.mjs` — re-run after editing the source to keep them in sync.

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-ag-grid.css</code> → Theme CSS — paste below OutSystems UI (AG Grid v33 Theming API CSS is runtime-injected)</summary>

```css
/* ============================================
   Component: AG Grid  ("The Loop" — real AG Grid, AGGrid_Lib)
   Figma: -The Loop- Main Library · "AG Grid" [node:25983-72091] · ref loop/refs/cmp-ag-grid/
   Approach: RESTYLE the AG Grid Community v33 instance rendered by the OutSystems
             `AGGrid_Lib` block (`.ag-grid__wrapper.ag-theme-quartz`). v33 styles are
             runtime-injected (Theming API, `<style data-ag-global-css>`) — there is no
             legacy theme stylesheet to replace. Overrides work in two layers:
             (1) `--ag-*` theme-param custom properties on the wrapper, which the
             injected CSS consumes; (2) direct `.ag-*` class rules for what params
             can't express. Win by SPECIFICITY (wrapper-class prefix), never !important.
   Location: Theme CSS of the consuming app (paste below OutSystems UI).
   Escalation Level: L2 (library widget + token-driven theme override)
   Shared spec: identical Figma component as loop-table.css — see loop/refs/cmp-table/
     for the pixel-verified core values. This file only re-expresses them for AG DOM.
   Tokens consumed: --loop-table-* (component-table.css) → foundation
     --color-*, --font-*, --space-*, --radius-*.
   Fidelity notes:
     · Flat edges per Figma — the Quartz wrapper border AND radius are reset.
     · Grouping panel + Columns/Filters side rail are AG Grid ENTERPRISE features;
       Community v33 (the demo) never renders them. Hooks ship below so they inherit
       the look on an Enterprise upgrade — scope note, not a finding.
     · AG's native paging panel keeps its own DOM (arrows + "x to y of z"); the
       design's numbered pager is the OSUI Pagination widget (.loop-pagination--large)
       placed below the grid — see the handover.
     · Numeric cells: Figma hard-codes IBM Plex Mono; font set is closed per
       brand-owner ruling → Open Sans + tabular-nums (finding already filed, cmp-table).
     · Row hover reuses the design's Low tone; selection/checkbox accent derives from
       the brand primary (#004370) — both documented assumptions (unspecced variants).
*/

/* ===== 1) Theme-param overrides (v33 Theming API custom properties) =====
 * Set on the block wrapper so they inherit into the whole grid; the doubled
 * selector out-specifies the injected defaults. Values mirror loop-table.css. */
.ag-grid__wrapper.ag-theme-quartz,
.ag-grid__wrapper .ag-root-wrapper {
  /* type */
  --ag-font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  --ag-font-size: var(--loop-table-font-size, 16px);
  --ag-header-font-weight: var(--font-weight-bold, 700);
  /* surfaces + text */
  --ag-background-color: var(--loop-table-row-bg, #ffffff);
  --ag-foreground-color: var(--loop-table-text, #000d1ab2);
  --ag-text-color: var(--loop-table-text, #000d1ab2);
  --ag-header-background-color: var(--loop-table-header-bg, #f5f7f9);
  --ag-header-text-color: var(--loop-table-text, #000d1ab2);
  /* geometry — 56px cells (24px content + 2×16px v-padding), 12px h-padding */
  --ag-row-height: var(--loop-table-row-height, 56px);
  --ag-header-height: var(--loop-table-row-height, 56px);
  --ag-cell-horizontal-padding: var(--loop-table-cell-padding-x, 12px);
  --ag-icon-size: 16px;
  /* borders — flat outer edges, subdued row dividers, inset header separators */
  --ag-wrapper-border: none;
  --ag-wrapper-border-radius: 0;
  --ag-border-radius: 0;
  --ag-row-border: solid var(--border-size-s, 1px) var(--loop-table-divider, #00396b14);
  --ag-header-row-border: solid var(--border-size-s, 1px) var(--loop-table-divider, #00396b14);
  --ag-column-border: none;
  --ag-header-column-border: solid var(--border-size-m, 2px) var(--loop-table-header-separator, #00396b29);
  --ag-header-column-border-height: calc(var(--loop-table-row-height, 56px) - 2 * var(--loop-table-header-separator-inset, 12px));
  /* Quartz also paints its own resize-handle line (2px×30%) on the same edge —
   * with the header-column-border above that reads as a doubled separator.
   * Make the handle invisible; the resize HIT AREA is untouched. */
  --ag-header-column-resize-handle-color: transparent;
  --ag-pinned-column-border: solid var(--border-size-s, 1px) var(--loop-table-pinned-divider, #00396b29);
  /* states — hover reuses the Low tone; accent drives checkbox/selection/focus */
  --ag-row-hover-color: var(--loop-table-header-bg, #f5f7f9);
  --ag-header-cell-hover-background-color: var(--loop-table-header-bg, #f5f7f9);
  --ag-accent-color: var(--loop-table-accent, #004370);
  --ag-checkbox-checked-background-color: var(--loop-table-accent, #004370);
  --ag-checkbox-checked-border-color: var(--loop-table-accent, #004370);
  --ag-checkbox-unchecked-border-color: var(--color-outline-on-light-default, #00396b3d);
}

/* ===== 2) Structural backstops — flat edges + header type =====
 * Guarantees for the load-bearing visuals in case a param name shifts between
 * v33 minors (the injected CSS is versioned with the lib bundle). Same values
 * as §1, so no double-draw when both apply. */
.ag-grid__wrapper .ag-root-wrapper {
  border: 0;
  border-radius: 0;
  background: var(--loop-table-row-bg, #ffffff);
}
.ag-grid__wrapper .ag-header {
  background-color: var(--loop-table-header-bg, #f5f7f9);
}
.ag-grid__wrapper .ag-header-cell {
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-table-font-size, 16px);
  font-weight: var(--font-weight-bold, 700);
  color: var(--loop-table-text, #000d1ab2);
}
.ag-grid__wrapper .ag-cell {
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-table-font-size, 16px);
  color: var(--loop-table-text, #000d1ab2);
}

/* ===== 3) Sort-icon clearance =====
 * Port of the 2026-07-14 brand-owner request from loop-table.css: 4px + the 12px
 * cell padding = 16px effective clearance when the sort icon abuts the right edge
 * (right-aligned / last column). Invisible in left-aligned headers. */
.ag-grid__wrapper .ag-header-cell .ag-sort-indicator-container {
  margin-right: var(--space-tiny, 4px);
}

/* ===== 4) Numeric cells — right-aligned lining figures =====
 * AG's own rightAligned column type adds these classes; Figma specs IBM Plex Mono
 * here, but the font set is closed → tabular-nums stands in (finding on file). */
.ag-grid__wrapper .ag-right-aligned-cell,
.ag-grid__wrapper .ag-right-aligned-header {
  font-variant-numeric: tabular-nums;
}

/* ===== 5) Scrollbars — slim rounded thumb per Figma (8px, High tone) ===== */
.ag-grid__wrapper .ag-body-viewport::-webkit-scrollbar,
.ag-grid__wrapper .ag-body-horizontal-scroll-viewport::-webkit-scrollbar,
.ag-grid__wrapper .ag-body-vertical-scroll-viewport::-webkit-scrollbar,
.ag-grid__wrapper .ag-center-cols-viewport::-webkit-scrollbar {
  width: var(--loop-table-scrollbar-size, 8px);
  height: var(--loop-table-scrollbar-size, 8px);
}
.ag-grid__wrapper .ag-body-viewport::-webkit-scrollbar-thumb,
.ag-grid__wrapper .ag-body-horizontal-scroll-viewport::-webkit-scrollbar-thumb,
.ag-grid__wrapper .ag-body-vertical-scroll-viewport::-webkit-scrollbar-thumb,
.ag-grid__wrapper .ag-center-cols-viewport::-webkit-scrollbar-thumb {
  background: var(--loop-table-scrollbar-thumb, #bdccdb);
  border-radius: var(--radius-base, 4px);
}
.ag-grid__wrapper .ag-body-viewport::-webkit-scrollbar-track,
.ag-grid__wrapper .ag-body-horizontal-scroll-viewport::-webkit-scrollbar-track,
.ag-grid__wrapper .ag-body-vertical-scroll-viewport::-webkit-scrollbar-track,
.ag-grid__wrapper .ag-center-cols-viewport::-webkit-scrollbar-track {
  background: transparent;
}
.ag-grid__wrapper .ag-body-viewport,
.ag-grid__wrapper .ag-body-horizontal-scroll-viewport,
.ag-grid__wrapper .ag-body-vertical-scroll-viewport,
.ag-grid__wrapper .ag-center-cols-viewport {
  scrollbar-width: thin;                                        /* Firefox */
  scrollbar-color: var(--loop-table-scrollbar-thumb, #bdccdb) transparent;
}

/* ===== 6) Paging panel — token-faithful restyle of AG's native footer =====
 * (Hidden in the demo today. AG's DOM = arrows + "x to y of z"; the design's
 * numbered pager is the OSUI Pagination widget — see the handover note.) */
.ag-grid__wrapper .ag-paging-panel {
  height: var(--loop-table-row-height, 56px);
  background: var(--loop-table-row-bg, #ffffff);
  border-top: var(--border-size-s, 1px) solid var(--loop-table-divider, #00396b14);
  color: var(--loop-table-text, #000d1ab2);
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size: var(--font-size-200, 14px);
}
.ag-grid__wrapper .ag-paging-button {
  color: var(--color-text-on-light-link-primary-enabled, #004370);
  cursor: pointer;
}

/* ===== 7) Grouping panel + side rail — ENTERPRISE-ONLY hooks =====
 * Community v33 (the demo) never renders these; they inherit the Figma look if
 * AGGrid_Lib moves to Enterprise. Grouping strip: Low fill, subdued bottom
 * divider, Open Sans 400 14, default icon tone. */
.ag-grid__wrapper .ag-column-drop-horizontal {
  background-color: var(--loop-table-grouping-bg, #f5f7f9);
  border-bottom: var(--border-size-s, 1px) solid var(--loop-table-divider, #00396b14);
  color: var(--loop-table-text, #000d1ab2);
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-table-grouping-font-size, 14px);
  line-height: var(--line-height-base, 1.5);
}
.ag-grid__wrapper .ag-column-drop-horizontal .ag-icon {
  color: var(--loop-table-grouping-icon, #4b5e71);
}
.ag-grid__wrapper .ag-side-bar {
  background-color: var(--loop-table-header-bg, #f5f7f9);
  border-left: var(--border-size-s, 1px) solid var(--loop-table-divider, #00396b14);
}
.ag-grid__wrapper .ag-side-buttons .ag-side-button-button {
  color: var(--color-text-on-light-link-primary-enabled, #004370);
}

/* ===== 8) Floating filter — the design's per-column search field =====
 * Hidden in the Default variant (floatingFilter=false); minimal loop text-field
 * alignment for apps that enable it. */
.ag-grid__wrapper .ag-floating-filter-input .ag-input-field-input {
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size: var(--font-size-200, 14px);
  color: var(--loop-table-text, #000d1ab2);
  background: var(--loop-table-row-bg, #ffffff);
  border: var(--border-size-s, 1px) solid var(--color-outline-on-light-default, #00396b3d);
  border-radius: var(--radius-medium, 8px);
}

/* ===== 9) Zebra — opt-in modifier via ExtendedClass on the block wrapper =====
 * Figma Rows=Zebra: even rows (1-indexed) carry the Low fill — AG's .ag-row-odd
 * (0-indexed) is exactly those rows. Var + direct rule so it holds either way. */
.loop-ag-grid--zebra,
.loop-ag-grid--zebra .ag-root-wrapper {
  --ag-odd-row-background-color: var(--loop-table-row-bg-striped, #f5f7f9);
}
.loop-ag-grid--zebra .ag-row-odd {
  background-color: var(--loop-table-row-bg-striped, #f5f7f9);
}
```

</details>

## What the override changes vs OutSystems UI baseline
- Theme-param overrides on `.ag-grid__wrapper.ag-theme-quartz` / `.ag-root-wrapper`: font
  family/size → Open Sans 16px, header weight → bold, surfaces/text recolored to the Loop
  tokens, row/header height → **56px**, cell h-padding → **12px**, outer border/radius →
  **none**, row/header-row border → 1px subdued divider, header column separator → 2px inset
  divider (matches the native Table's `::after` treatment), the resize-handle line hidden so it
  doesn't double the separator, row hover → the Low tone, accent (checkbox/selection focus) →
  the brand primary `#004370`.
- Structural backstops on `.ag-root-wrapper` / `.ag-header` / `.ag-header-cell` / `.ag-cell`
  restate the same values directly, guarding against a theme-param name shifting between v33
  minors.
- Sort-icon clearance: 4px `margin-right` on `.ag-sort-indicator-container`, same 2026-07-14
  brand-owner request ported from `loop-table.css`.
- Numeric cells (`.ag-right-aligned-cell` / `.ag-right-aligned-header`): `tabular-nums` — see
  the findings note below (FND-072).
- Scrollbars: slim 8px rounded thumb on every AG viewport (body / horizontal / vertical /
  center-cols), same treatment as the Table restyle.
- Paging panel: AG's native footer (hidden in the demo) gets a token-faithful restyle in case
  an app surfaces it directly — but see **Scope** below for the recommended replacement.
- Zebra: opt-in `.loop-ag-grid--zebra` modifier fills `.ag-row-odd` with the striped tone
  (AG's 0-indexed odd rows are the Figma's 1-indexed even rows).

## Scope
- **Columns/Filters side rail + the grouping panel are AG Grid Enterprise features.**
  Community v33 (what `AGGrid_Lib` ships) cannot render them, and the live demo never shows
  them. Style hooks for both (`.ag-column-drop-horizontal`, `.ag-side-bar`,
  `.ag-side-buttons`) ship in the CSS so they pick up the Loop look automatically if the
  library is ever upgraded to Enterprise — this is a **platform-capability scope note**, not a
  design finding, and nothing further is needed here.
- **Pagination is its own component.** AG's native paging panel renders arrows + "x to y of
  z" — a different DOM than the Figma numbered pager, so it cannot be restyled into the
  numbered-chip look. Use `<loop-ag-grid-pagination>` below the grid instead (with
  `suppressPaginationPanel: true` on the grid) — see `handover/loop-ag-grid-pagination.md`
  for the full wiring.
- Floating filter (per-column search row) and the grid's own filter popups / custom tooltip
  are unspecced in the Figma variants and stay native; a minimal loop-text-field alignment is
  included for floating filter in case an app enables it.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for AgGrid to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-ag-grid.css and dist/theme.css are already pasted into the ODC
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
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the shared `--loop-table-*` tokens, incl. the AG Grid chrome additions).
- [ ] Paste `loop-ag-grid.css` into Theme CSS, **below** OutSystems UI.
- [ ] Confirm the app's `AGGrid_Lib` instance renders `.ag-grid__wrapper.ag-theme-quartz` — this override targets that wrapper class exactly.
- [ ] Zebra → add `loop-ag-grid--zebra` on the wrapper; numeric columns → AG's `rightAligned` column type.
- [ ] Pagination → follow `handover/loop-ag-grid-pagination.md` instead of relying on AG's native paging panel.
- [ ] Verify: 56px rows, grey bold header with short separators, hairline dividers, flat outer edges (no border/radius), slim 8px scrollbars.
- [ ] 1-Click Publish → validate in a **real browser** (never Service Studio Preview) — check sort, column resize, and row selection still work with the new colors/geometry.

## Findings linked to this work (register-only)
- **FND-072 (open, designer action)** — Figma numeric cells hard-code **IBM Plex Mono**
  (untokenized, outside the confirmed Open Sans brand set). Already register-only from the
  native Table restyle (`cmp-table`) — this AG Grid restyle re-uses the same brand-owner
  ruling (Open Sans + `font-variant-numeric: tabular-nums`, right-aligned). **Do not re-file.**
