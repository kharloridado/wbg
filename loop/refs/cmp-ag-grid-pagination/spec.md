# Frozen Figma ref — cmp-ag-grid-pagination (the AG Grid footer pager)

- **Figma file:** zx8q9nRf8Dbqam1rfquQ2E (The Loop — Main Library (2))
- **Node:** 27044:57397 ("-loop pagination" instance, 1373×72 — the footer inside the
  AG Grid frame 25983:72091; same width as `../cmp-ag-grid/figma.png`)
- **Pulled:** 2026-07-15 (get_design_context + get_variable_defs + 1373×72 render)
- **Sibling refs:** `../cmp-ag-grid/` (the grid this pager belongs under). Base
  pagination component was built earlier from node 23714:3726 (40px/14px default,
  `--small` 32px/13px) — `src/blocks/loop-pagination.css`.

## SIZE-MODE GOTCHA (why three value sets exist)

The generated reference code inlines **56px chips / 18px type** — that is a *different
size mode* of the component (the verify-component-sizes trap). The values that actually
render in THIS instance are proven two ways:

- geometry: bar 72px − 2 × `Spacing/xsmall` 12 = **48px** controls;
- `get_variable_defs` on the node: `loop/pagination/circle size = 48`,
  `loop/pagination/font size = 16`.

**Spec of record = 48px controls / 16px type.** Also note: an earlier Figma component
description said the `Small` (32px) size is "Used in AG-grid dashboard apps" — this
frame contradicts that (the AG Grid footer instance is the 48px scale). Trust the frame.

## Key values (mode-resolved)

| Piece | Value | Figma variable |
|---|---|---|
| Bar | full-width, 12px v-padding, transparent on the grid's white | `Spacing/xsmall` |
| Controls & page chips | **48×48** | `loop/pagination/circle size` |
| Nav gap (left side) | 4px | `loop/pagination/h padding simple` |
| Nav icons | angle-left/right + **custom** "angle-left first"/"angle-right last" (2px edge bar + angle), angle-down on the select; ~20px glyph in a 28px slot; color `#004370` | `Icon/On Light/Link/Enabled` |
| Page numerals | Open Sans **SemiBold 16** `#004370`, chip radius 4 | `.UI Component/Pagination/page number`, `lift/border radius/radius-1` |
| Active page | 48px **circle** (radius 32 pill-clamps), 2px border `#004370`, numeral Open Sans **Regular 16** `#004370` — a local override detaching from the SemiBold page-number style; implemented faithfully | `Outline/On Light/Link/Enabled`, `Border Radius/xLarge` |
| Ellipsis | SemiBold 16 `#004370`, 48px slot | — |
| Right rail gap | 16px between items-per-page / showing | `loop/pagination/h padding right side` |
| "items per page" label | Regular 16 `#000d1ab2`, 12px gap to input | `loop/pagination/pages font size`, `h padding items` |
| Items-per-page input | 48px tall, bg `#f5f7f9`, 1px border `#00396b29`, radius 4, 12px h-padding, value SemiBold 16 `#000d1ab2`, angle-down chevron | `Background/Container/On Light/Low`, `Outline/On Light/Subdued`, `loop/pagination/items corner`, `h padding left side` |
| "Showing 1-20 of 500" | Regular 16 `#000d1ab2` with **Bold** range + total | `.UI Component/Pagination/pages` |
| Hover / focus / disabled | not in this static node — inherit the base component (23714:1496: hover = blue-40 `#169af3` filled pill) | — |

## Integration ruling (AG Grid Community v33 / AGGrid_Lib)

AG's native paging panel (arrows + "x to y of z") cannot render numbered chips —
different DOM. The design is achieved by:

1. `suppressPaginationPanel: true` (+ `pagination: true`) on the grid;
2. `<loop-ag-grid-pagination>` (light-DOM Web Component,
   `src/components/loop-ag-grid-pagination.js` + `.css`) placed below the grid —
   renders the `.loop-pagination.loop-pagination--large` BEM structure (styled by
   `src/blocks/loop-pagination.css`) and drives the grid via the pagination API
   (`paginationGoToPage`, `paginationChanged` event, `setGridOption('paginationPageSize')`).
   Page-size changes need the sizes included in `paginationPageSizeSelector` (or set it
   `false`) — else AG logs errors #94/#95.
- Light DOM (not shadow) so the block CSS and the app's icon font reach the markup.
- Never flag "off the 4pt grid" — spacing base is TBD.
