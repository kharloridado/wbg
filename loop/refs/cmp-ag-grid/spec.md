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
| Pagination footer | the Loop Pagination component (cmp-pagination; `.loop-pagination--small` documented "Used in AG-grid dashboard apps") | cross-ref cmp-pagination |
| Default variant props | groupingPanel=true, pagination=true, columnsFilters=true (side rail), columnNumbers=true, columnCheckbox=false, floatingFilter=false, h/vScrollbar=true | — |

## Scope rulings (fidelity-first, decided 2026-07-15)

- **Grouping panel + Columns/Filters side rail are AG Grid Enterprise features.**
  Community v33 cannot render them; the demo never shows them. Style hooks ship
  (commented Enterprise-only) so they inherit the look if the lib upgrades. This is a
  platform-capability scope note, NOT a design finding.
- **AG's native paging panel** has a different DOM than the design's numbered pager
  (arrows + "x to y of z" — no page-number buttons). It gets a token-faithful restyle of
  its native structure; the handover recommends the OSUI Pagination widget
  (`.loop-pagination--small`) under the grid for the true numbered look. Demo currently
  hides the panel anyway.
- IBM-Plex-Mono numeric cells → Open Sans + `tabular-nums` (existing brand-owner ruling
  + already-filed finding from cmp-table — do not re-file).
- Row hover reuses the design's Low tone (same documented assumption as loop-table.css).
- Filter popup menus and the custom tooltip are unspecced in the variants → stay native.
- Selection state is unspecced → derived from the brand accent (`--ag-accent-color`
  #004370), documented assumption.
- Never flag "off the 4pt grid" — spacing base is TBD.
