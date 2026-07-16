FND-074 [consistency] AG Grid Columns/Filters rail + row-group panel require Enterprise; deployed AGGrid_Lib is Community

<!-- dedup: [node:25983-72091] -->

**Type:** consistency (platform-capability) · **Severity:** high · **Issue:** [#159](https://github.com/kharloridado/wbg/issues/159)
**Location:** AG Grid · "AG Grid" component [node:25983-72091] — Columns/Filters side rail + "Drag here to set row groups" panel · live grid `AGGrid_Lib` at https://wbg-dev.outsystems.app/AGGridDemo/

**Observed (as designed):** the Figma grid draws a docked **Columns/Filters tool-panel rail** and a **row-group panel**. Both are AG Grid **Enterprise** features (`sideBar` → `agColumnsToolPanel`/`agFiltersToolPanel`; `rowGroupPanelShow`). Chrome probe (2026-07-15): the deployed `AGGrid_Lib` loads AG Grid **Community v33** (`aggridcommunity_min_noStyle_v33`), `agGrid.LicenseManager` absent, `columnsToolPanel` module **not** registered. Community **silently ignores** those grid options — the rail and row-group panel never render.

**Rule:** a rendered design must be buildable on the deployed platform; it should not depend on an un-provisioned paid capability without that dependency being surfaced.

**Recommendation:** provision AG Grid **Enterprise** on the `AGGrid_Lib` library — swap to the `aggridenterprise_*` v33 bundle, install a licence key (`LicenseManager.setLicenseKey`), and register the Enterprise modules (`SideBarModule, ColumnsToolPanelModule, FiltersToolPanelModule, RowGroupingModule, MenuModule, SetFilterModule`). Alternatively, design/brand owner accepts a Community-only substitute for the rail + row-group panel.

**Implementation note:** built faithfully to the Enterprise target, no value changed — config `src/blocks/loop-ag-grid-enterprise.grid-options.js` + restyle `loop-ag-grid.css` §7/§8 (both inert on Community: the target DOM nodes are simply absent). **Column drag-and-drop reorder and per-column filters are Community capabilities and work today.** Runtime verification of the rail + row-group panel is deferred until the Enterprise bundle is provisioned. Ref `loop/refs/cmp-ag-grid/`, `handover/loop-ag-grid.md`.

Labels: finding,bug,consistency,sev:high
