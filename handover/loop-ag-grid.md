# Handover — AG Grid: Columns/Filters rail + row-group panel + drag-drop columns

Adds the Figma's grid interactions to the real AG Grid rendered by `AGGrid_Lib`:
**column drag-and-drop reorder**, a docked **Columns / Filters side rail** (with tool
panels), a **"Drag here to set row groups"** panel, and **per-column filters** — using
AG Grid's own APIs, skinned to "The Loop".
Figma: `-The Loop- Main Library (2)` · "AG Grid" [node 25983-72091] · frozen ref `loop/refs/cmp-ag-grid/`.

**Approach.** Two paste-in artifacts, no Web Component:
1. **Grid options** (`loop-ag-grid-enterprise.grid-options.js`) — the *behaviour*: turns on
   `sideBar` (Columns + Filters tool panels), `rowGroupPanelShow`, a left-edge **row-number
   index column** (`rowNumbers`), per-column filters, and keeps columns movable. Plain
   JSON-serialisable data merged into the `AGGrid_Lib` grid config.
2. **Restyle** (`loop-ag-grid.css` §7/§8) — the *look*: skins AG's native Enterprise DOM
   (row-group panel, side bar, side buttons, tool panels, filter inputs) to the Figma, via
   the v33 Theming-API params + `.ag-*` overrides won by specificity (no `!important`).

Column drag-reorder is a **Community** capability (already live on the demo — dragging a
header reorders it). The side rail and row-group panel are **Enterprise** — see Prerequisites.

> This handover extends the base **AG Grid restyle** (`loop-ag-grid.css`, already shipped) with
> the interaction layer. The base-look usage (zebra, numeric columns, when-to-use) is below;
> the new interactions follow.

## When to use / How to use (base restyle)

> **Live Style Guide doc** — short usage spec for the AG Grid page.

**What it is.** The real AG Grid (`AGGrid_Lib`, Community v33) at the Figma "AG Grid" look:
Low `#f5f7f9` header with bold 16px labels and short inset column separators, white body rows
with subdued 1px dividers, 56px rows, 12/16px cell padding, flat edges — the same visual
language as the native Table restyle, applied to the real AG Grid library.

**When to use**
- Any screen already using the OutSystems `AGGrid_Lib` block — sorting, column resize,
  per-column filters, row selection, virtualized scrolling.
- Reach for AG Grid over the native **Table** when the app needs AG Grid's own feature set
  (column tooling, large virtualized datasets); reach for the native **Table** restyle
  (`handover/loop-table.md`) when it doesn't — don't add AG Grid just for the look.

**How to use**
- Paste `loop-ag-grid.css` into the Theme CSS below OutSystems UI (see Files). No ExtendedClass
  needed for the base look — it targets the AG Grid wrapper classes directly.
- **Zebra** → add `loop-ag-grid--zebra` to the block's wrapper element to fill even
  (`ag-row-odd`) rows with the Figma zebra tone.
- **Numeric columns** → set the column's AG Grid `type: 'rightAligned'` (or add
  `ag-right-aligned-cell` / `ag-right-aligned-header` via `cellClass`/`headerClass`) for
  right-aligned tabular figures.
- **Pagination** → don't rely on AG's native paging panel for the numbered-pager look; see
  `handover/loop-ag-grid-pagination.md`.

## ⚠ Prerequisites — AG Grid Enterprise (blocking for the rail + row-group panel)

`AGGrid_Lib` loads AG Grid **Community v33** (`aggridcommunity_min_noStyle_v33`,
`LicenseManager: false`). Community **silently ignores** `sideBar` and `rowGroupPanelShow`, so
the side rail and the row-group panel **will not render** until Enterprise is provisioned
**inside the `AGGrid_Lib` library** (a one-time platform change, outside this repo):

1. **Swap the bundle** to an AG Grid **Enterprise v33** build — built the same way as the
   community bundle (same global, `noStyle`), in place of `aggridcommunity_min_noStyle_v33`.
2. **Register the Enterprise modules** (v33 is modular): `SideBarModule, ColumnsToolPanelModule,
   FiltersToolPanelModule, RowGroupingModule, MenuModule, SetFilterModule`.
3. **Install the licence key**: `agGrid.LicenseManager.setLicenseKey("<WBG key>")`.

**⚠ Order + location matter — the traps we hit live (2026-07-16):**
- **Modules + licence must be set BEFORE the grid is created.** AG v33 reads the module
  registry at `createGrid` time; a Community grid already on the page **cannot be upgraded**
  afterward. That is why this belongs **inside AGGrid_Lib** (which owns `createGrid`), not in a
  screen-level "Run JavaScript" node.
- **A CDN `ag-grid-enterprise` script added as an app/theme resource does NOT work.** Two
  reasons, both verified on the live page: OutSystems' AMD (RequireJS) loader makes the UMD
  register as an AMD module instead of augmenting `window.agGrid`, **and** AGGrid_Lib's custom
  bundle keeps its own module registry. So the enterprise build has to be the one AGGrid_Lib
  itself loads — check first whether AGGrid_Lib exposes a `LicenseKey` / `Enterprise` input or
  a documented enterprise option; if not, fork/rebuild its script resource.
- **Guard `setLicenseKey`.** Calling it while still on Community throws *"Cannot read properties
  of undefined (reading 'setLicenseKey')"* and **aborts the whole grid render** (blank grid).
  Always wrap it:
  ```js
  if (window.agGrid && window.agGrid.LicenseManager) {
      window.agGrid.LicenseManager.setLicenseKey("<WBG key>");
  }
  ```

**Reference — the init AGGrid_Lib's enterprise bundle must run before `createGrid`** (verified
live with the WBG key: licence valid, rail + row-group panel + Loop restyle all rendered):
```js
// inside the library, after the enterprise-enabled agGrid global is loaded:
agGrid.ModuleRegistry.registerModules([
    agGrid.AllCommunityModule,
    agGrid.AllEnterpriseModule,        // or the named modules listed above
]);
if (window.agGrid && window.agGrid.LicenseManager) {
    agGrid.LicenseManager.setLicenseKey("<WBG key>");
}
// … AGGrid_Lib then calls agGrid.createGrid(el, gridOptions) as usual.
```

Until Enterprise is in place: **column drag-reorder and per-column filters still work**
(Community); the **rail + row-group panel stay dark**, and — because the Figma-clean header
hides the per-column filter/menu buttons — filtering has no header UI on Community (it lives in
the rail). This dependency is tracked as **FND-074** (see below). The CSS is inert on Community,
so it is safe to paste now.

**Note on the licence.** The WBG key is a *Developer* license and its text states it "has not
been granted a Deployment License Add-on" — confirm the deployment add-on with WBG before
production go-live.

## Capabilities & how to use

| Capability | AG tier | How it's delivered | Verify |
|---|---|---|---|
| **Column drag-reorder** | Community | Movable columns are default-on; the grid options do **not** set `suppressMovableColumns` | Drag a header left/right — the column moves |
| **Columns panel** (show/hide + reorder) | Enterprise | `sideBar` → `agColumnsToolPanel`; checkbox list toggles visibility, drag reorders | Open the **Columns** tab in the right rail |
| **Filters panel** | Enterprise | `sideBar` → `agFiltersToolPanel`; per-column filters + search | Open the **Filters** tab in the right rail |
| **Row-group panel** | Enterprise | `rowGroupPanelShow: 'always'` + `enableRowGroup` on columns | Drag a column into the top strip to group |
| **Per-column filters** | Community | `defaultColDef.filter: true` (floating filter off by default, matching the Figma Default variant) | Filters appear in the Filters panel / column menu |
| **Row-number index column** | Community (v33.1+) | `rowNumbers: true` — pinned left, auto-renumbers on sort/filter/scroll. **⚠ initial-only** (must be in the grid options *before* `createGrid`, not set via `AgGridAPI` in OnReady) | A 60px left column shows 1, 2, 3…; restyled by `loop-ag-grid.css` §10 |

**Applying the grid options.** Merge `LOOP_AG_GRID_ENTERPRISE_OPTIONS` into the options
`AGGrid_Lib` passes to `createGrid` — either via the block's GridOptions/advanced-config input,
or in the grid's OnReady using the exposed `window.AgGridAPI` (e.g. `AgGridAPI.setGridOption(...)`
/ `updateGridOptions(...)`). It carries no functions, so it can equally be pasted as a JSON
config string. **Do not** set an AG `theme` object — the look comes entirely from the CSS +
`dist/theme.css`.

> **⚠ `rowNumbers` is initial-only.** `sideBar`, `rowGroupPanelShow` and `defaultColDef`
> can be applied in OnReady via `AgGridAPI`, but `rowNumbers` is read once at `createGrid` —
> a later `AgGridAPI.setGridOption("rowNumbers", true)` is silently ignored (verified live
> 2026-07-16). So the row-number column **must** go through the GridOptions/advanced-config
> input (merged before the grid is created). If the screen can only reach the grid in OnReady,
> the other options still apply there; row numbers need the pre-`createGrid` path.

**Numbered pager.** AG's own paging panel keeps its arrow/"x to y of z" DOM. The Figma's
numbered pager is the separate Loop Pagination component (`src/components/loop-ag-grid-pagination.js`
+ `.loop-pagination--large`) placed under the grid — unchanged by this handover.

## Combining with a custom OnReady grid script

If the screen already runs its own "Run JavaScript" node against the grid (e.g. cell editors,
dirty-cell tracking, value formatters), the Loop options **coexist** with it — they touch
different grid options:

| Grid option | Owner | Combine rule |
|---|---|---|
| `columnDefs` (editors, formatters, per-column tweaks) | your script | Loop doesn't touch it — leave as-is |
| `defaultColDef` | **both** (you: `cellClassRules` / `onCellValueChanged`; Loop: `filter` / `enableRowGroup` / clean-header flags) | **merge into one object — don't replace** |
| `sideBar`, `rowGroupPanelShow` | Loop only | independent — just add the two `setGridOption` calls |

Merge `defaultColDef` in place (so both sets of keys survive), then add the two top-level
options. Keep your `columnDefs` mapping unchanged:

```js
// defaultColDef — MERGE your editing hooks with the Loop options (don't overwrite)
let defaultColDef = GridAPI.getGridOption("defaultColDef") || {};
Object.assign(defaultColDef, {
    // Loop options — Figma look + behaviour
    sortable: true, resizable: true,
    filter: true, floatingFilter: false,   // filters surface in the Filters tool panel
    enableRowGroup: true,                   // draggable into the row-group panel
    suppressHeaderMenuButton: true,         // Figma-clean header (no kebab)
    suppressHeaderFilterButton: true,       // Figma-clean header (no funnel)
    // your editing hooks (unchanged)
    cellClassRules: {
        "ag-cell-dirty": (p) => p.node.editedCols && p.node.editedCols[p.column.getId()],
    },
    onCellValueChanged: cellEdited,
});
GridAPI.setGridOption("defaultColDef", defaultColDef);

// top-level Loop options (independent of columnDefs / defaultColDef)
GridAPI.setGridOption("rowGroupPanelShow", "always");
GridAPI.setGridOption("sideBar", {
    position: "right",
    toolPanels: [
        { id:"columns", labelDefault:"Columns", labelKey:"columns", iconKey:"columns",
          toolPanel:"agColumnsToolPanel",
          toolPanelParams:{ suppressRowGroups:false, suppressValues:true, suppressPivots:true, suppressPivotMode:true } },
        { id:"filters", labelDefault:"Filters", labelKey:"filters", iconKey:"filter", toolPanel:"agFiltersToolPanel" },
    ],
});
```

Gotchas:
- **`Object.assign` order = who wins.** Loop keys apply *over* the existing `defaultColDef`;
  Loop never sets `editable`, so your editing stays intact. Put a key *after* the Loop block
  if you need your value to win on a shared key.
- **Set `defaultColDef` before `columnDefs`** if the clean header / filter doesn't take on first
  paint (v33 usually re-processes columns on a `defaultColDef` change, but ordering removes doubt).
- **`sideBar` + `rowGroupPanelShow` need the Enterprise bundle** (see Prerequisites / FND-074);
  cell editors, dirty-tracking, and formatters are Community and work regardless.

## Row click → OutSystems Client Action (navigate to a detail screen)

Row click is **not** a Loop option — it is AG Grid's own `rowClicked` event bridged to an
OutSystems Client Action via `$actions`, the same JS→OutSystems bridge the Web Components use
(see `handover/loop-multilevel-dropdown.md` § Event wiring). Community feature; works today.

**⚠ The row object is nested under `bulk_record`.** `AGGrid_Lib` does not hand AG Grid a flat
row — it wraps each record. Verified live on `TheLoopLiveStyleGuide/Cases` (2026-07-21), the
first row node's `data` is:

```json
{ "bulk_record": { "Id": 1, "Name": "Product1", "Price": 51, "Brand": "Brand2", "…": "…" } }
```

Top-level keys: `["bulk_record"]` — so **`e.data.Id` is `undefined`**. A handler guarded on
`e.data.Id` never fires and reports **no error**: a silent no-op that looks like the listener
never attached. Read the ID through the wrapper. The same nesting shows up in `columnDefs`,
whose fields are `bulk_record.Name`, `bulk_record.Price`, … — match on those prefixed field
names in any per-column editor/formatter mapping too.

**Wiring** — in the grid's OnReady (or the Client Action that already configures the grid,
alongside the `defaultColDef` merge above):

```js
// AGGrid_Lib nests the row under `bulk_record`; the fallback keeps this working
// if a future library version hands over a flat row.
var handleRowClicked = function (e) {
    var row = e.data && (e.data.bulk_record || e.data);
    var id = row && row.Id;
    if (id !== undefined && id !== null && id !== '') {
        $actions.OnRowClicked(String(id));   // -> Client Action, input ProductId: Text
    }
};

// Bind once — see the duplicate-listener note below.
if (!GridAPI.__loopRowClickBound) {
    GridAPI.__loopRowClickBound = true;
    GridAPI.addEventListener('rowClicked', handleRowClicked);
}
```

Then in the Client Action `OnRowClicked(ProductId: Text)`: convert if the target screen takes
an Integer (`TextToIntegerValidate`), then a **Destination** node to the detail screen. If the
grid sits in a Block, declare `OnRowClicked` as a **Block event** and put the Destination on
the consuming screen so the Block stays reusable.

Gotchas:
- **`addEventListener`, not `setGridOption("onRowClicked", …)`.** `setGridOption` replaces any
  handler `AGGrid_Lib` or another script already set; `addEventListener` composes.
- **Guard against double-binding.** When this runs in a *Client Action* (not a Block OnReady)
  there is no OnDestroy to `removeEventListener` from, so a second run — grid re-ready, data
  refresh, tab revisit — stacks a second handler and fires the action twice per click. The
  `__loopRowClickBound` flag above is the cheap fix. In a Block, prefer the proper
  OnReady/OnDestroy pair and stash the handler on `$public` for removal by reference.
- **`$public` is Block/Screen scope.** Inside a Client Action JS node use a plain local `var`
  (as above) — you cannot clean up from there anyway, so stashing it buys nothing.
- **Ignore clicks on action/checkbox columns** by binding `cellClicked` instead and returning
  early on `e.colDef.field`.
- **Affordance + a11y.** Rows do not look clickable — add `cursor: pointer` on `.ag-row`. A
  click-only row is also unreachable by keyboard and invisible to assistive tech (WCAG 2.2 AA
  2.1.1): make the first cell a real link via a `cellRenderer` and keep the row click as a
  convenience on top, or raise an `a11y` finding rather than shipping it silently.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-ag-grid.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `src/blocks/loop-ag-grid-enterprise.grid-options.js` | Grid config — merge into the `AGGrid_Lib` grid options (or apply via `AgGridAPI` in OnReady) |
| `tokens/component-table.css` → `dist/theme.css` | Theme CSS (adds the `--loop-table-*` tokens the restyle consumes) |

> Canonical sources live in `src/blocks/`; they are embedded into this ticket by
> `node build/embed-handover-code.mjs` — re-run after editing a source to keep them in sync.

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-ag-grid.css</code> → Theme CSS — paste below OutSystems UI</summary>

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
     · Row-group panel ("Drag here to set row groups") + the Columns/Filters side
       rail with its tool panels are AG Grid ENTERPRISE features (§7). They are now
       an ACTIVE restyle (the design calls for them — decided 2026-07-15), driven by
       the grid-options in src/blocks/loop-ag-grid-enterprise.grid-options.js. They
       render only on the AG Grid ENTERPRISE bundle; the deployed AGGrid_Lib is
       Community v33, so they stay dark until the bundle + licence are provisioned —
       a platform dependency tracked as a finding, NOT a design change. Every rule
       is inert in Community (its DOM nodes are simply absent).
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

/* ===== 3aa) Header separators — no trailing line after the last column =====
 * AG's injected Quartz CSS paints the inset header separator via
 * `.ag-header-cell::after { border-right: var(--ag-header-column-border) }` on
 * EVERY header cell — including the rightmost, which leaves a stray separator
 * hanging at the grid's right edge (Figma draws separators only BETWEEN columns).
 * AG tags the real last column with `.ag-column-last` (that class travels with the
 * true last column, not the last *rendered* one, so this survives AG's column
 * virtualisation where a `:last-child` selector would wrongly drop a mid-grid
 * separator). Suppress its separator only. Verified live 2026-07-16. */
.ag-grid__wrapper .ag-header-cell.ag-column-last::after {
  display: none;
}

/* ===== 3) Sort-icon clearance =====
 * Port of the 2026-07-14 brand-owner request from loop-table.css: 4px + the 12px
 * cell padding = 16px effective clearance when the sort icon abuts the right edge
 * (right-aligned / last column). Invisible in left-aligned headers. */
.ag-grid__wrapper .ag-header-cell .ag-sort-indicator-container {
  margin-right: var(--space-tiny, 4px);
}

/* ===== 3b) Clean header per Figma — no per-column filter / column-menu buttons =====
 * The Figma header cell carries only its label + sort indicator; filters and
 * column options are reached from the side rail (§7), NOT per-column header icons.
 * Hide AG's header filter button (funnel, .ag-icon-filter) and column-menu button
 * (kebab, .ag-icon-menu-alt). The sort indicator (§3) is untouched, and filtering /
 * column management stay fully available via the Columns/Filters tool panels. */
.ag-grid__wrapper .ag-header-cell-filter-button,
.ag-grid__wrapper .ag-header-cell-menu-button {
  display: none;
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

/* ===== 7) ENTERPRISE chrome — row-group panel + Columns/Filters side rail =====
 * Active restyle of AG Grid Enterprise DOM (row-group panel, side bar, tool
 * panels), turned on by loop-ag-grid-enterprise.grid-options.js. Every rule is
 * scoped under .ag-grid__wrapper so it wins on specificity (never !important) and
 * is inert on Community, whose bundle never renders these nodes. Values mirror the
 * Figma "AG Grid" component (node 25983-72091, ref loop/refs/cmp-ag-grid/). */

/* 7a) Row-group panel — the "Drag here to set row groups" strip.
 * Low fill, subdued bottom divider, Open Sans 400 14/1.5, default icon tone. */
.ag-grid__wrapper .ag-column-drop-horizontal.ag-column-drop-row-group,
.ag-grid__wrapper .ag-column-drop-horizontal {
  background-color: var(--loop-table-grouping-bg, #f5f7f9);
  border-bottom: var(--border-size-s, 1px) solid var(--loop-table-divider, #00396b14);
  color: var(--loop-table-text, #000d1ab2);
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-table-grouping-font-size, 14px);
  font-weight: var(--font-weight-regular, 400);
  line-height: var(--line-height-base, 1.5);
}
.ag-grid__wrapper .ag-column-drop-horizontal .ag-column-drop-empty-message {
  color: var(--loop-table-text, #000d1ab2);
}
.ag-grid__wrapper .ag-column-drop-horizontal .ag-icon {
  color: var(--loop-table-grouping-icon, #4b5e71);
}

/* 7b) Side bar — the docked rail on the right. Low fill, outline-default left edge. */
.ag-grid__wrapper .ag-side-bar,
.ag-grid__wrapper .ag-side-bar-right {
  background-color: var(--loop-table-grouping-bg, #f5f7f9);
  border-left: var(--border-size-s, 1px) solid var(--loop-table-sidebar-border, #00396b3d);
}
.ag-grid__wrapper .ag-side-buttons {
  background-color: var(--loop-table-grouping-bg, #f5f7f9);
}

/* 7c) Side buttons — the collapsed "Columns" / "Filters" tabs. Figma styles them
 * as the tertiary -loop button (link tone), read vertically. AG already orients
 * the button vertically; we only set the tone + type. */
.ag-grid__wrapper .ag-side-button-button {
  /* Figma side tab: 48px rail width, 12px horizontal padding (AG defaults to a
   * ~34px-wide button with 8px h-padding). Vertical padding is AG's own. */
  width: var(--space-xlarge, 48px);
  padding-left: var(--loop-table-sidebtn-pad-x, 12px);
  padding-right: var(--loop-table-sidebtn-pad-x, 12px);
  color: var(--loop-table-sidebtn-text, #004370);
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-table-sidebtn-font-size, 14px);
  font-weight: var(--font-weight-bold, 700);
  letter-spacing: var(--letter-spacing-button, -0.5px);
}
.ag-grid__wrapper .ag-side-button-label {
  color: var(--loop-table-sidebtn-text, #004370);
}
.ag-grid__wrapper .ag-side-button-icon-wrapper .ag-icon,
.ag-grid__wrapper .ag-side-button .ag-icon {
  color: var(--loop-table-sidebtn-icon, #004370);
}
/* Selected/open tab — keep the link tone, lift with the Lowest surface so the open
 * panel reads continuous with its button (AG's default recolors off-palette). */
.ag-grid__wrapper .ag-side-button.ag-selected .ag-side-button-button {
  background-color: var(--loop-table-row-bg, #ffffff);
  color: var(--loop-table-sidebtn-text, #004370);
}

/* 7d) Tool panels — the 250px expanded body behind a tab (Columns / Filters).
 * Low fill, outline-default left edge, Figma padding. */
.ag-grid__wrapper .ag-tool-panel-wrapper {
  width: var(--loop-table-toolpanel-width, 250px);
  padding: var(--loop-table-toolpanel-pad-y, 12px) var(--loop-table-toolpanel-pad-x, 8px);
  background-color: var(--loop-table-grouping-bg, #f5f7f9);
  border-left: var(--border-size-s, 1px) solid var(--loop-table-sidebar-border, #00396b3d);
  color: var(--loop-table-text, #000d1ab2);
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-table-sidebtn-font-size, 14px);
}
/* Columns tool panel — the checkbox list of columns. The checkboxes inherit the
 * Loop accent from the --ag-checkbox-* params set in §1. */
.ag-grid__wrapper .ag-column-select,
.ag-grid__wrapper .ag-column-select-list {
  background-color: var(--loop-table-grouping-bg, #f5f7f9);
}
.ag-grid__wrapper .ag-column-select-column-label,
.ag-grid__wrapper .ag-column-select-column-group-label {
  color: var(--loop-table-text, #000d1ab2);
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-table-sidebtn-font-size, 14px);
}
/* Filters tool panel — the search field + per-column filter list. */
.ag-grid__wrapper .ag-filter-toolpanel,
.ag-grid__wrapper .ag-filter-toolpanel-search {
  background-color: var(--loop-table-grouping-bg, #f5f7f9);
  color: var(--loop-table-text, #000d1ab2);
}
.ag-grid__wrapper .ag-filter-toolpanel-group-title {
  color: var(--loop-table-text, #000d1ab2);
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-table-sidebtn-font-size, 14px);
  font-weight: var(--font-weight-bold, 700);
}

/* ===== 8) Text inputs in filters — the design's Loop text field =====
 * Both the floating-filter row (per-column, hidden in the Default variant) and the
 * Filters tool-panel search share AG's .ag-input-field-input; align both to the
 * Loop text field (white fill, outline-default 1px, 8px radius). */
.ag-grid__wrapper .ag-floating-filter-input .ag-input-field-input,
.ag-grid__wrapper .ag-filter-toolpanel-search .ag-input-field-input,
.ag-grid__wrapper .ag-mini-filter .ag-input-field-input {
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

/* ===== 10) Row-number index column (AG built-in `rowNumbers`) =====
 * Turned on by `rowNumbers: true` in the grid-options delta (Community, v33.1+).
 * AG pins the row-number column down the left edge and, under the §1 params, ALREADY
 * renders it as the Figma index column — 60px wide, Low `#f5f7f9` fill, right-aligned
 * `#000d1ab2` numbers, with the pinned 1px right divider (`--ag-pinned-column-border`)
 * and the gray header fill all inherited. The ONE deviation is weight: AG styles the
 * numbers header-bold (700); the Figma index numbers are regular. Drop them to 400 and
 * give them tabular figures so the digits align (matches the §4 numeric-cell treatment).
 * Header cell is empty (no label) per Figma, so it needs no rule. Inert on grids that
 * don't enable rowNumbers (the DOM node is simply absent). Verified live 2026-07-16. */
.ag-grid__wrapper .ag-row-number-cell {
  font-weight: var(--font-weight-regular, 400);
  font-variant-numeric: tabular-nums;
}
/* The row-number HEADER doubles its divider: the 1px pinned column border (which
 * the body cells also carry, `--ag-pinned-column-border`) PLUS the generic 2px
 * inset `::after` header separator every header cell gets (§1). That reads as a
 * thick/doubled line against the body's single 1px. Drop the header's `::after`
 * so the index column shows one clean 1px divider, header and body matching. */
.ag-grid__wrapper .ag-row-number-header::after {
  display: none;
}
```

</details>
<details>
<summary><code>loop-ag-grid-enterprise.grid-options.js</code> → Grid options — merge into the AGGrid_Lib grid config / apply via AgGridAPI in OnReady (NOT a Theme paste)</summary>

```js
/* ============================================================================
   AG Grid — Enterprise grid-options delta  ("The Loop" — Columns/Filters rail +
   row-group panel + drag-drop columns)
   Figma: -The Loop- Main Library · "AG Grid" [node:25983-72091] · ref loop/refs/cmp-ag-grid/
   Pairs with the restyle in  src/blocks/loop-ag-grid.css  (the LOOK) — this file is
   the BEHAVIOUR: the grid options that make AG Grid render the three interaction
   affordances the Figma draws, using AG Grid's own APIs.

   ┌─ WHAT THIS TURNS ON ──────────────────────────────────────────────────────┐
   │ 1. Column drag-and-drop reorder — dragging a header to reorder columns.     │
   │    COMMUNITY feature, on by default (we simply do NOT suppress it).          │
   │ 2. Right-hand side rail with "Columns" + "Filters" tool panels (collapsed    │
   │    by default, matching the Figma Default variant). ENTERPRISE.              │
   │ 3. "Drag here to set row groups" panel across the top. ENTERPRISE.           │
   │ 4. Per-column filters (surfaced by the Filters tool panel). COMMUNITY.       │
   │ 5. Row-number index column down the left edge. COMMUNITY (v33.1+).           │
   └────────────────────────────────────────────────────────────────────────────┘

   ══ PREREQUISITES (platform work, done ONCE INSIDE the AGGrid_Lib library) ═════
   The live demo (wbg-dev.outsystems.app/AGGridDemo) currently loads AG Grid
   COMMUNITY v33 (`aggridcommunity_min_noStyle_v33`). Community SILENTLY IGNORES
   `sideBar` and `rowGroupPanelShow` — the panels below will not render until:
     A) AGGrid_Lib is pointed at an AG Grid ENTERPRISE v33 bundle (built the same
        way as its community bundle — same global, `noStyle`) instead of community;
     B) a valid Enterprise licence key is installed:
           agGrid.LicenseManager.setLicenseKey("<WBG_AG_GRID_LICENSE_KEY>");
     C) the Enterprise modules are registered (v33 is modular):
           agGrid.ModuleRegistry.registerModules([
             SideBarModule, ColumnsToolPanelModule, FiltersToolPanelModule,
             RowGroupingModule, MenuModule, SetFilterModule,
           ]);

   ⚠ ORDER + LOCATION MATTER (verified live 2026-07-16):
   • (B)+(C) must run BEFORE the grid is created — AG v33 reads the module registry
     at createGrid time; an already-created Community grid CANNOT be upgraded after.
   • This is why it must live INSIDE AGGrid_Lib (which owns createGrid), NOT as an
     external screen-level Script resource. A CDN `ag-grid-enterprise` UMD dropped
     next to AGGrid_Lib does NOT attach: OutSystems' AMD (RequireJS) loader makes the
     UMD register as an AMD module instead of augmenting `window.agGrid`, and AGGrid_Lib's
     custom bundle keeps its own module registry. So the enterprise bundle must be the
     one AGGrid_Lib itself loads.
   • Calling `LicenseManager.setLicenseKey` while still on Community THROWS
     ("Cannot read properties of undefined (reading 'setLicenseKey')") and aborts grid
     render — always guard it:  if (window.agGrid && window.agGrid.LicenseManager) { … }

   Until (A)+(B)+(C) exist, column drag-reorder (#1) and per-column filters (#4)
   still work on Community; the rail (#2) and row-group panel (#3) stay dark.
   See handover/loop-ag-grid.md and the finding in findings/findings-register.md.

   ══ HOW TO APPLY IN OUTSYSTEMS ════════════════════════════════════════════════
   Merge LOOP_AG_GRID_ENTERPRISE_OPTIONS into the grid options AGGrid_Lib passes to
   `createGrid` (via the block's GridOptions / advanced-config input, or in the
   OnReady handler with AgGridAPI). It is plain JSON-serialisable data — no
   functions — so it can equally be pasted as a JSON config string.

   ⚠ `rowNumbers` is INITIAL-ONLY. `sideBar` / `rowGroupPanelShow` / `defaultColDef`
   are dynamic (settable in OnReady via AgGridAPI.setGridOption). `rowNumbers` is NOT:
   AG reads it at createGrid time, so it renders ONLY when merged into the grid
   options BEFORE the grid is created (the GridOptions input) — a later
   AgGridAPI.setGridOption("rowNumbers", true) is silently ignored (verified live
   2026-07-16). If you can only reach the grid in OnReady, the other three still
   apply there; row numbers need the pre-createGrid path.

   NOTE — styling lives in CSS, not here. Do NOT set an AG `theme` object; the look
   comes entirely from loop-ag-grid.css + dist/theme.css (Theming API params +
   `.ag-*` overrides). Icon keys below (`columns`, `filter`) select AG's built-in
   tool-panel tab icons, which the CSS restyles to the Figma.
============================================================================ */

export const LOOP_AG_GRID_ENTERPRISE_OPTIONS = {
  /* 5) Row-number index column — AG's built-in row numbers, pinned down the left
   *    edge (Figma "columnNumbers"). COMMUNITY, v33.1+ (needs RowNumbersModule,
   *    which ships inside AllCommunityModule, so it's already registered wherever
   *    the community grid runs). ⚠ INITIAL-ONLY: must be present at createGrid — see
   *    the HOW TO APPLY note. Renumbers automatically on sort/filter/scroll.
   *    The Figma index look (60px, Low #f5f7f9 fill, right-aligned #000d1ab2, pinned
   *    1px right divider) comes from loop-ag-grid.css §1 + §10 — nothing to set here. */
  rowNumbers: true,

  /* 3) Row-group panel — the "Drag here to set row groups" strip (Enterprise). */
  rowGroupPanelShow: "always",

  /* 2) Right side rail — Columns + Filters tool panels (Enterprise).
   *    defaultToolPanel omitted ⇒ rail starts COLLAPSED, matching the Figma
   *    Default variant (columnsToolPanel=false, filtersToolPanel=false). */
  sideBar: {
    position: "right",
    toolPanels: [
      {
        id: "columns",
        labelDefault: "Columns",
        labelKey: "columns",
        iconKey: "columns",
        toolPanel: "agColumnsToolPanel",
        toolPanelParams: {
          // Show the column list + the drag-to-group affordance; hide the
          // pivot/values controls the Figma doesn't draw.
          suppressRowGroups: false,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
        },
      },
      {
        id: "filters",
        labelDefault: "Filters",
        labelKey: "filters",
        iconKey: "filter",
        toolPanel: "agFiltersToolPanel",
      },
    ],
  },

  /* 1) + 4) Column behaviour applied to every column unless a colDef overrides it.
   *    - filter/floatingFilter: per-column filters, surfaced in the Filters panel.
   *      floatingFilter stays FALSE — the Figma Default variant has no floating
   *      filter row (flip to true, or set per-column, if that variant is wanted).
   *    - enableRowGroup: lets a column be dragged into the row-group panel (#3).
   *    - movable is default-on: we deliberately DO NOT set suppressMovableColumns,
   *      so header drag-reorder (#1) works. (Community already allows this.) */
  defaultColDef: {
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: false,
    enableRowGroup: true,
    // Figma header carries only label + sort — no per-column filter/menu icons.
    // Filters + column options are reached from the side rail, so hide the header
    // buttons (filtering stays available via the Filters tool panel). The CSS
    // restyle (loop-ag-grid.css §3b) also hides them as a backstop for consumers
    // that don't apply this options delta.
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
};

/* Convenience for environments that consume a global instead of an ES import
 * (e.g. an OutSystems Script resource). Mirrors the LoopIconData / LoopFieldCount
 * pattern used elsewhere in this repo. */
if (typeof window !== "undefined") {
  window.LoopAgGridEnterpriseOptions = LOOP_AG_GRID_ENTERPRISE_OPTIONS;
}
```

</details>

## Variant mapping
| Figma prop (component 25983-72091) | Grid option | Notes |
|---|---|---|
| `groupingPanel` | `rowGroupPanelShow: 'always'` | the "Drag here to set row groups" strip (Enterprise) |
| `columnsFilters` (side rail) | `sideBar.toolPanels` | Columns + Filters tabs, collapsed by default (`defaultToolPanel` omitted) |
| `columnsToolPanel` | `agColumnsToolPanel` | expanded Columns panel (250px) |
| `filtersToolPanel` | `agFiltersToolPanel` | expanded Filters panel |
| `floatingFilter` | `defaultColDef.floatingFilter` | **false** in the Default variant; flip per-column to show the search row |
| `columnNumbers` | `rowNumbers: true` | AG's built-in left-edge row-number index column (Community v33.1+); restyled to the Figma index look by `loop-ag-grid.css` §10. **Initial-only** — set before `createGrid` |
| `columnCheckbox` | (selection column) | governed by `rowSelection` / column defs, not this options delta |

## What the restyle changes vs AG Quartz baseline
- **Clean header per Figma** — hides the per-column **filter button** (`.ag-header-cell-filter-button`,
  funnel) and **column-menu button** (`.ag-header-cell-menu-button`, kebab); the header keeps
  only its label + sort indicator. Filters and column options are reached from the side rail,
  not the header (also enforced in the grid options via `suppressHeaderFilterButton` /
  `suppressHeaderMenuButton`). Filtering stays available through the Filters tool panel.
- **Row-group panel** (`.ag-column-drop-horizontal`): Low `#f5f7f9` fill, 1px subdued bottom
  divider, Open Sans 400 14/1.5 `#000d1ab2`, 16px icon `#4b5e71`.
- **Side bar** (`.ag-side-bar` / `.ag-side-buttons`): Low fill, `outline/default` `#00396b3d`
  left edge.
- **Side buttons** (`.ag-side-button-button` / `-label` / icon): the Figma tertiary `-loop
  button` tone — label + icon `#004370`, Open Sans **Bold 14**, letter-spacing -0.5px; the
  open tab lifts onto the Lowest surface.
- **Tool panels** (`.ag-tool-panel-wrapper`): 250px, Low fill, `outline/default` left edge,
  8/12px padding; column list labels + filter titles in Open Sans; the Columns checkboxes
  inherit the Loop accent `#004370` from the `--ag-checkbox-*` params (§1).
- **Filter inputs** (`.ag-floating-filter-input`, `.ag-filter-toolpanel-search`,
  `.ag-mini-filter`): the Loop text field — white fill, `outline/default` 1px, 8px radius.
- **Row-number index column** (`.ag-row-number-cell`, §10): AG's built-in `rowNumbers` column
  already lands on the Figma index look from the §1 params (60px, Low `#f5f7f9` fill,
  right-aligned `#000d1ab2`, pinned 1px right divider); §10 only drops the numbers from AG's
  header-bold 700 to regular **400** + `tabular-nums` to match the design. Inert unless
  `rowNumbers` is enabled.
- Every rule is scoped under `.ag-grid__wrapper` and inert on Community.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, enable the WBG "The Loop" AG Grid interactions (Columns/Filters
side rail, "Drag here to set row groups" panel, per-column filters, column drag-reorder)
on the screen/Block that uses the AGGrid_Lib grid. This is grid CONFIGURATION + wiring,
not styling — the look is already handled by CSS.

Context (already done manually — do NOT re-create or edit these):
- dist/tokens.css, dist/theme.css and loop-ag-grid.css are already pasted into the ODC Theme editor
  (below OutSystems UI). The rail/panel look is pure CSS + var(--token) — do NOT write,
  edit, or add CSS, and do NOT set an AG Grid `theme` object.
- The grid-options delta LOOP_AG_GRID_ENTERPRISE_OPTIONS (from
  loop-ag-grid-enterprise.grid-options.js, embedded in this handover) is the config to
  apply. It is plain JSON-serialisable data: sideBar (agColumnsToolPanel + agFiltersToolPanel),
  rowGroupPanelShow:'always', and a defaultColDef enabling filter + enableRowGroup while
  keeping columns movable.

Platform prerequisite (NOT your task — flag it, don't attempt it): the side rail and
row-group panel are AG Grid ENTERPRISE features. They render only once AGGrid_Lib is on
the Enterprise bundle with a licence key + the Enterprise modules registered. Until then,
column drag-reorder and per-column filters still work; the rail/panel stay dark.

Task — reference each element by the exact name:
1. On the Block/screen hosting the AGGrid_Lib widget, apply LOOP_AG_GRID_ENTERPRISE_OPTIONS
   to the grid — merge it into the block's GridOptions / advanced-config input if it exposes
   one; otherwise add a "Run JavaScript" node in the grid's OnReady that calls
   window.AgGridAPI.updateGridOptions(<the options object>) (or setGridOption per key).
2. Ensure the column definitions the app passes carry filter:true and enableRowGroup:true
   for the columns that should be filterable / groupable (defaultColDef already sets these
   as the baseline — only override per-column where needed). Do NOT set suppressMovableColumns.
3. Leave the numbered pager as-is — it is the separate Loop Pagination component under the
   grid, not part of this config.

Constraints: never edit the OutSystems UI module or the AGGrid_Lib library; add no CSS and
no hard-coded style values. After applying, list what you changed by name and flag the
Enterprise-bundle prerequisite as blocking for the rail + row-group panel.
```

## Checklist
- [ ] **Platform (blocking):** point `AGGrid_Lib` at the AG Grid **Enterprise** v33 bundle, install the licence key, register the Enterprise modules (see Prerequisites).
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new `--loop-table-*` side-rail/tool-panel tokens).
- [ ] Paste `loop-ag-grid.css` into Theme CSS, **below** OutSystems UI.
- [ ] Merge `LOOP_AG_GRID_ENTERPRISE_OPTIONS` into the `AGGrid_Lib` grid options (block GridOptions input, or `AgGridAPI` in OnReady). **`rowNumbers` must go through the pre-`createGrid` GridOptions input** — it is ignored if set in OnReady.
- [ ] 1-Click Publish → validate in a **real browser**: a 60px **row-number column** (1, 2, 3…) is pinned at the left edge and renumbers on sort/filter; the right rail shows **Columns** + **Filters** tabs, both expand to 250px Loop-styled panels; the top strip reads "Drag here to set row groups"; dragging a header reorders columns.
- [ ] Confirm column drag-reorder + Filters work even before the Enterprise swap (Community capabilities).
- [ ] **If wiring row click:** read the ID as `e.data.bulk_record.Id` (not `e.data.Id` — silently undefined), bind once via `addEventListener('rowClicked', …)`, and verify the Client Action fires exactly once per click. See § Row click → OutSystems Client Action.

## Findings linked to this work
- **FND-074 (open, platform dependency)** — the Figma AG Grid requires **AG Grid Enterprise**
  (`sideBar` tool panels + `rowGroupPanelShow`), but the deployed `AGGrid_Lib` loads Community
  v33. The Columns/Filters rail and row-group panel cannot render until WBG provisions the
  Enterprise bundle + licence. Column drag-reorder and per-column filters are unaffected
  (Community). Not a design change — a platform-capability gap.
- **FND-072 (open, designer action)** — numeric cells hard-code IBM Plex Mono (closed font
  set → Open Sans + `tabular-nums`). Carried over from the Table handover; do not re-file.
