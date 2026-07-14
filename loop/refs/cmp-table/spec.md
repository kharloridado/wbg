# Frozen Figma ref — cmp-table (Table, "AG Grid" look on the native OSUI Table widget)

- **Figma file:** zx8q9nRf8Dbqam1rfquQ2E (The Loop — Main Library (2), the NEW file key)
- **Frame:** 25983:72091 ("AG Grid", 4 variants; Row-based Default rendered in `figma.png`)
- **Variants:** Type=Row-based/Column-based × Rows=Default/Zebra
  - 25983:72092 Row-based Default · 25983:73359 Row-based Zebra
  - 25983:72503 Column-based Default · 25983:72931 Column-based Zebra
- **Design-context pulled from:** 25983:72092 (header) + 25983:72133 (body Row 1), 2026-07-14
- **Style Guide page:** https://wbg-dev.outsystems.app/TheLoopLiveStyleGuide/PatternDetail?MenuCategoryId=7&MenuSubCategorId=85
- **How to read this:** STYLING-ONLY port. The surface is a restyle of the native
  OutSystems UI Table widget (`.table` / `.table-header` / `.table-row`), implemented in
  `src/blocks/loop-table.css` + `tokens/component-table.css`. AG Grid features in the
  frame (grouping panel, pinned row-number/checkbox columns, Columns/Filters rails,
  pagination footer) are OUT OF SCOPE — pagination is its own widget (cmp-pagination).

## Verified findings from the pull (2026-07-14)

- **Row-based vs Column-based render pixel-identical** (PNG diff bbox = None): "Type"
  is an AG Grid interaction distinction (hover orientation), NOT a static style. One
  base style + a zebra modifier covers all four variants.
- **Zebra stripe** = even rows `#f5f7f9`, pixel-verified `rgb(245,247,249)` =
  `Background/Container/On Light/Low`. Row dividers are kept under stripes.
- Body cells carry NO vertical borders in any variant; the only vertical lines are
  the short header separators and the pinned row-number column's border-right
  (that column is an AG Grid feature, out of scope).
- Header py fallback rendered inconsistently (16px in header pull, 24px in row pull);
  the variable `loop/ag-grids/v-padding` **= 16** and the 56px cell math (24 content
  + 2×16) confirms 16px.

## Key values (for quick diffing)

| Property | Value | Figma variable |
|---|---|---|
| Header bg | #f5f7f9 | `Background/Container/On Light/Low` |
| Header text | Open Sans **700** 16, lh 1.5, #000d1ab2 | `Body/Font Weight/Bold`, `Font-size/300`, `Text/On Light/Default` |
| Header column separator | 1px × **24px tall**, vertically centered, between cells only | `Divider/On Light/Default` #00396b29 |
| Body cell bg | #ffffff | `Background/Container/On Light/Lowest` |
| Body text | Open Sans 400 16, lh 1.5, #000d1ab2 | `Body/Text/Base/Regular`, `Text/On Light/Default` |
| Row divider | 1px border-bottom, header + every body row (incl. last) | `Divider/On Light/Subdued` #00396b14 |
| Cell padding | 12px h / 16px v | `loop/ag-grids/h-padding` / `v-padding` |
| Row height | 56px (24px content + 2×16) — header and body | (derived) |
| Zebra stripe | even rows #f5f7f9 | `Background/Container/On Light/Low` |
| Outer border / radius | **none** — flat edges | — |
| Numeric cells | **IBM Plex Mono** Regular 16, right-aligned — HARD-CODED, no variable → finding; implemented as Open Sans + tabular-nums (brand-owner ruling: font set closed) | — |
| H-scrollbar | 8px, rounded, thumb #bdccdb | `loop/scroll-bar/height`, `Background/Container/On Light/High` |
| Hover | NOT specified in the variants (AG Grid behavior) — implementation reuses the Low tone | — |
