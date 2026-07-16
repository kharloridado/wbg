# Frozen Figma ref — cmp-ag-grid (real AG Grid Community v33, "The Loop" look)

- **Figma file:** zx8q9nRf8Dbqam1rfquQ2E (The Loop — Main Library (2))
- **Frame:** 25983:72091 ("AG Grid", 4 variants; Row-based Default rendered in `figma.png`)
- **Variants:** Type=Row-based/Column-based × Rows=Default/Zebra (same node as cmp-table)
- **Design-context pulled:** 25983:72092 full variant, 2026-07-15 (persisted reference code
  covered grouping panel + header row + floating-filter row before truncation; rows/footer
  geometry recovered via get_metadata on 25983:72132/72493/72496/72500)
- **Target:** the LIVE AG Grid instance at https://wbg-dev.outsystems.app/AGGridDemo/ —
  OutSystems library module `AGGrid_Lib` (ODC), NOT the native OSUI Table widget.
- **Sibling ref:** `../cmp-table/spec.md` is the spec of record for every shared value
  (56px rows, header bg/typography, dividers, separators, padding, zebra, scrollbar,
  hover, sort-icon clearance, IBM-Plex-Mono ruling). This file adds only what the AG
  Grid surface needs on top. `figma.png` + `variables.json` are copies of the same
  2026-07-14 pull (identical node).

## Live-demo DOM facts (Chrome probe, 2026-07-15)

- `AGGrid_Lib` loads **`aggridcommunity_min_noStyle_v33`** (+ AG Charts community 11.3.2
  and an `agGridCustomTooltip` user script).
- Wrapper: `DIV.ag-grid__wrapper.ag-theme-quartz` inside an `OSBlockWidget`. Styling is
  the **v33 Theming API** — runtime-injected `<style data-ag-global-css>` elements. There
  is NO legacy theme stylesheet; the `ag-theme-quartz` class is just the block's wrapper
  class. Override path = CSS custom properties (`--ag-*` theme params) + plain `.ag-*`
  class rules, won by **specificity** over the injected CSS.
- Demo features: paging panel present but `display:none`; select-all checkbox machinery;
  pinned-left containers (width 0, unused); column filter buttons; sortable headers.
  No floating filters / side bar / status bar / row-group panel.
- The demo app does NOT load the Loop theme or Open Sans — deliverable CSS must keep
  `var(--token, literal)` fallbacks, and the handover must note the theme/font paste.

## AG-specific values (not in the cmp-table ref)

| Piece | Value | Figma variable |
|---|---|---|
| Grouping panel | bg `#f5f7f9`, border-bottom 1px `#00396b14`, Open Sans 400 **14px** lh 1.5 `#000d1ab2`, 16px icon `#4b5e71`, "Drag here to set row groups" | `Background/Container/On Light/Low`, `Divider/On Light/Subdued`, `Body/Text/Small/Regular` (`Font-size/200`), `Icon/On Light/Default` |
| Row-number pinned column | 64px wide body cell; its border-right is the only vertical line in the body | `Divider/On Light/Default` #00396b29 |
| Checkbox column | 64px, hidden in the Default variant (`columnCheckbox=false`); checkbox = the Loop Checkbox (checked bg `#004370`, outline `#00396b3d`, white glyph) | component cross-ref cmp-checkbox |
| Floating filter row | 56px, hidden by default (`floatingFilter=false`); per-column `-loop text field` (search icon + placeholder) | cross-ref cmp-field |
| V-scrollbar | 8px wide, 56px header spacer above the thumb track, thumb `#bdccdb` rounded | `loop/scroll-bar/height`, `Background/Container/On Light/High` |
| H-scrollbar | 8px tall, same thumb | same |
| Pagination footer | the Loop Pagination component (cmp-pagination; `.loop-pagination--large` documented "Used in AG-grid dashboard apps") | cross-ref cmp-pagination |
| Default variant props | groupingPanel=true, pagination=true, columnsFilters=true (side rail), columnNumbers=true, columnCheckbox=false, floatingFilter=false, h/vScrollbar=true | — |

## Interaction build — Columns/Filters rail + row-group panel + drag-drop (decided 2026-07-15)

User goal (2026-07-15): make the grid interactions real — **column drag-and-drop reorder**,
the **Columns/Filters side rail** with tool panels, the **"Drag here to set row groups"**
panel, and **per-column filters** — using AG Grid's own APIs, feasible for OutSystems. Decision:
**target AG Grid Enterprise** (1:1 with the Figma), delivered as grid-config + CSS restyle.

- **Delivery = two paste-in artifacts, no Web Component:**
  - `src/blocks/loop-ag-grid-enterprise.grid-options.js` — the behaviour:
    `sideBar` (`agColumnsToolPanel` + `agFiltersToolPanel`, collapsed by default = Figma
    Default variant), `rowGroupPanelShow:'always'`, `defaultColDef` (`filter:true`,
    `floatingFilter:false`, `enableRowGroup:true`), columns left movable.
  - `src/blocks/loop-ag-grid.css` §7/§8 — the look: active restyle of AG's Enterprise DOM.
- **Live-demo probe (2026-07-15, Chrome):** `window.AgGridAPI` is the live Grid API instance
  (`getColumnState`/`applyColumnState`, `setColumnsVisible`, `moveColumns`,
  `getColumnFilterInstance`, `setFilterModel`, `updateGridOptions`/`setGridOption`). Column
  drag-reorder already works — `suppressMovableColumns:false`, all columns `movable:true`.
  `LicenseManager:false`, `columnsToolPanel` module NOT registered → Community, no Enterprise.
- **Side-rail values (get_variable_defs on 25983:72496, 2026-07-15):** collapsed tabs are the
  tertiary `-loop button` read vertically — label + icon `#004370` (Text/Icon On Light/Primary),
  Open Sans **Bold 14**, letter-spacing -0.5px; Columns icon = table-layout, Filters icon =
  funnel. Tool panel = **250px**, bg Low `#f5f7f9`, left edge Outline/On Light/Default `#00396b3d`,
  padding px 8 (xxsmall) / py 12 (xsmall). Row-group panel: Low fill, 1px subdued bottom divider,
  Open Sans 400 14/1.5 `#000d1ab2`, 16px icon `#4b5e71`. Tokens added to `component-table.css`
  (`--loop-table-sidebar-border`, `--loop-table-toolpanel-*`, `--loop-table-sidebtn-*`).
- **Platform dependency (blocking for rail + row-group panel):** the deployed `AGGrid_Lib` is
  Community v33; `sideBar`/`rowGroupPanelShow` are silently ignored until WBG swaps to the
  Enterprise bundle + licence + module registration. Tracked as **FND-074** and unmissable in
  the handover. The CSS is inert on Community (target nodes absent). Column drag-reorder +
  per-column filters are Community and work regardless. **Runtime verification of the rail +
  row-group panel is deferred until the Enterprise bundle is provisioned** — re-probe the demo
  then to confirm render + restyle and close FND-074.

## Scope rulings (fidelity-first, decided 2026-07-15)

- **Grouping panel + Columns/Filters side rail are AG Grid Enterprise features.** Community v33
  cannot render them. Superseded by the interaction build above (Enterprise now the target); the
  §7 CSS is an active restyle, and the capability gap is filed as FND-074.
- **AG's native paging panel** has a different DOM than the design's numbered pager
  (arrows + "x to y of z" — no page-number buttons). It gets a token-faithful restyle of
  its native structure; the handover recommends the OSUI Pagination widget
  (`.loop-pagination--large`) under the grid for the true numbered look. Demo currently
  hides the panel anyway.
- IBM-Plex-Mono numeric cells → Open Sans + `tabular-nums` (existing brand-owner ruling
  + already-filed finding from cmp-table — do not re-file).
- Row hover reuses the design's Low tone (same documented assumption as loop-table.css).
- Filter popup menus and the custom tooltip are unspecced in the variants → stay native.
- Selection state is unspecced → derived from the brand accent (`--ag-accent-color`
  #004370), documented assumption.
- Never flag "off the 4pt grid" — spacing base is TBD.
- **Clean header (2026-07-15):** the Figma header cell shows only label + sort — NO per-column
  filter (funnel) or column-menu (kebab) buttons. Filters/columns are reached from the side
  rail. Enforced both in CSS (`loop-ag-grid.css` §3b hides `.ag-header-cell-filter-button` +
  `.ag-header-cell-menu-button`) and in the grid options (`suppressHeaderFilterButton` /
  `suppressHeaderMenuButton`). Verified live against licensed AG Grid Enterprise v33
  (2026-07-15): 0 header filter/menu buttons, sort + side rail intact.
