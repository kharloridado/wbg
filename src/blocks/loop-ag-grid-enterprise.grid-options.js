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
   └────────────────────────────────────────────────────────────────────────────┘

   ══ PREREQUISITES (platform work, done ONCE on the AGGrid_Lib library) ═════════
   The live demo (wbg-dev.outsystems.app/AGGridDemo) currently loads AG Grid
   COMMUNITY v33 (`aggridcommunity_min_noStyle_v33`). Community SILENTLY IGNORES
   `sideBar` and `rowGroupPanelShow` — the panels below will not render until:
     A) AGGrid_Lib is pointed at the AG Grid ENTERPRISE bundle
        (`aggridenterprise_*` v33) instead of the community bundle;
     B) a valid Enterprise licence key is installed at startup:
           agGrid.LicenseManager.setLicenseKey("<WBG_AG_GRID_LICENSE_KEY>");
     C) the required Enterprise modules are registered (v33 is modular):
           agGrid.ModuleRegistry.registerModules([
             SideBarModule, ColumnsToolPanelModule, FiltersToolPanelModule,
             RowGroupingModule, MenuModule, SetFilterModule,
           ]);
   Until (A)+(B)+(C) exist, column drag-reorder (#1) and per-column filters (#4)
   still work on Community; the rail (#2) and row-group panel (#3) stay dark.
   See handover/loop-ag-grid.md and the finding in findings/findings-register.md.

   ══ HOW TO APPLY IN OUTSYSTEMS ════════════════════════════════════════════════
   Merge LOOP_AG_GRID_ENTERPRISE_OPTIONS into the grid options AGGrid_Lib passes to
   `createGrid` (via the block's GridOptions / advanced-config input, or in the
   OnReady handler with AgGridAPI). It is plain JSON-serialisable data — no
   functions — so it can equally be pasted as a JSON config string.

   NOTE — styling lives in CSS, not here. Do NOT set an AG `theme` object; the look
   comes entirely from loop-ag-grid.css + dist/theme.css (Theming API params +
   `.ag-*` overrides). Icon keys below (`columns`, `filter`) select AG's built-in
   tool-panel tab icons, which the CSS restyles to the Figma.
============================================================================ */

export const LOOP_AG_GRID_ENTERPRISE_OPTIONS = {
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
