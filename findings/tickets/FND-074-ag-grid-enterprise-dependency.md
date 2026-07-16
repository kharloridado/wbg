FND-074 [consistency] AG Grid Columns/Filters rail + row-group panel require Enterprise; deployed AGGrid_Lib is Community

<!-- dedup: [node:25983-72091] -->

**Type:** consistency (platform-capability) · **Severity:** high · **Issue:** [#159](https://github.com/kharloridado/wbg/issues/159)
**Location:** AG Grid · "AG Grid" component [node:25983-72091] — Columns/Filters side rail + "Drag here to set row groups" panel · live grid `AGGrid_Lib` at https://wbg-dev.outsystems.app/AGGridDemo/

**Observed (as designed):** the Figma grid draws a docked **Columns/Filters tool-panel rail** and a **row-group panel**. Both are AG Grid **Enterprise** features (`sideBar` → `agColumnsToolPanel`/`agFiltersToolPanel`; `rowGroupPanelShow`). Chrome probe (2026-07-15): the deployed `AGGrid_Lib` loads AG Grid **Community v33** (`aggridcommunity_min_noStyle_v33`), `agGrid.LicenseManager` absent, `columnsToolPanel` module **not** registered. Community **silently ignores** those grid options — the rail and row-group panel never render.

**Rule:** a rendered design must be buildable on the deployed platform; it should not depend on an un-provisioned paid capability without that dependency being surfaced.

**Recommendation:** provision AG Grid **Enterprise** v33 **inside the `AGGrid_Lib` library** — it must be the bundle AGGrid_Lib itself loads (built the same way as its community `noStyle` bundle), with the Enterprise modules registered and `LicenseManager.setLicenseKey` called **before** the grid is created. Check first whether AGGrid_Lib exposes a `LicenseKey`/`Enterprise` input; if not, fork/rebuild its script resource. Alternatively, design/brand owner accepts a Community-only substitute for the rail + row-group panel.

**Verified live (2026-07-16, ProductAGGrid screen + WBG key):** with an enterprise-enabled agGrid loaded, the modules registered, and the key set, the licence validates (watermark hidden, no console error) and the rail + "Drag here to set row groups" panel + Loop restyle all render. Two traps confirmed en route: (1) a CDN `ag-grid-enterprise` UMD added as an external resource does NOT attach — OutSystems' AMD/RequireJS loader registers it as an AMD module instead of augmenting `window.agGrid`, and AGGrid_Lib keeps its own module registry; (2) calling `setLicenseKey` while still on Community throws *"Cannot read properties of undefined (reading 'setLicenseKey')"* and aborts grid render — it must be guarded (`if (window.agGrid && window.agGrid.LicenseManager) …`). So the fix is library-internal, not a screen-level bolt-on.

**Implementation note:** built faithfully to the Enterprise target, no value changed — config `src/blocks/loop-ag-grid-enterprise.grid-options.js` + restyle `loop-ag-grid.css` §7/§8 (both inert on Community: the target DOM nodes are simply absent). **Column drag-and-drop reorder and per-column filters are Community capabilities and work today.** Licence + full render verified live 2026-07-16; only the AGGrid_Lib enterprise-bundle swap remains. Ref `loop/refs/cmp-ag-grid/`, `handover/loop-ag-grid.md`.

Labels: finding,bug,consistency,sev:high
