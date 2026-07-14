# Handover — Table (native `.table` restyle, "AG Grid" look)

The Loop **Table** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library (2)` · "AG Grid" [node 25983-72091] · frozen ref `loop/refs/cmp-table/`.

**Approach:** A **bare restyle** of the native OutSystems UI **Table** widget (`.table` /
`.table-header` / `.table-row`) — every native Table renders the AG-Grid look by default:
Low `#f5f7f9` header with bold 16px labels and short 24px column separators, white body rows
with subdued 1px dividers, 56px rows, 12/16px cell padding, flat edges (no outer border or
radius). **Styling only** — none of the AG Grid *features* in the Figma frame (grouping
panel, pinned row-number/checkbox columns, Columns/Filters rails) are in scope; pagination
is its own component (see the Pagination handover).

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Table page.

**What it is.** The data table surface — header row on the Low container tone, white rows,
hairline dividers, optional zebra striping.

**When to use**
- Tabular records rendered with the native **Table** widget (with or without sorting).
- Zebra: long, dense tables where row tracking matters — turn on the widget's striped rows.

**When not to use** (reach for instead)
- Card-per-record layouts → **Card / Card Item**.
- True AG Grid features (pinning, grouping, column tools) → a dedicated grid component
  (not in the current scope).

**How to use**
- Use the native **Table** widget — it is styled by default, no Extended Class needed.
- **Zebra** → the widget's striped-rows path (per-row class `table-row-stripping`) is
  restyled to the Figma even-row `#f5f7f9` fill; enable striping on the widget as usual.
- **Numeric columns** → add `loop-table-cell--numeric` to the column's header + cells
  (Extended Class / cell style): right-aligns and uses tabular lining figures.
- Sorting, row sizes (`table-row-small` / `table-row-medium`), selected rows, and the
  phone/tablet stacked layout stay native.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-table.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/component-table.css` → `dist/theme.css` | Theme CSS (adds the `--loop-table-*` tokens) |

> Canonical CSS lives in `src/blocks/loop-table.css`; it is embedded into this ticket by
> `node build/embed-handover-code.mjs` — re-run after editing the source to keep them in sync.

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-table.css</code> → Theme CSS — paste below OutSystems UI</summary>

```css
/* ============================================
   Component: Table  ("The Loop" — AG Grid look)
   Figma: -The Loop- Main Library · "AG Grid" [node:25983-72091] · ref loop/refs/cmp-table/
   Approach: RESTYLE the native OutSystems UI Table widget (.table / .table-header /
             .table-row) — NOT a parallel class system. STYLING ONLY: backgrounds,
             borders, text, zebra. No AG Grid features (pinning, grouping, filters).
   Location: Theme CSS (paste below OutSystems UI so it wins on equal specificity).
   Escalation Level: L2 (native widget + token-driven theme override)
   OutSystems UI v2.28.1 baseline (src/scss/03-widgets/_table.scss):
     .table has a 1px neutral-4 outer border + soft radius (incl. first/last th/td
     corner radii); th 48px semi-bold on neutral-0; td 56px on neutral-0; hover
     neutral-2; zebra hook = .table-row-stripping:nth-child(even) td (neutral-1).
   Tokens consumed: --loop-table-* (component-table.css) → foundation
     --color-bg-container-on-light-*, --color-divider-on-light-*,
     --color-text-on-light-default, --font-*, --space-*.
   Fidelity notes:
     · Figma has NO outer border and NO corner radius — both reset from the OSUI default.
     · Figma's Row-based vs Column-based variants are pixel-identical (AG Grid hover
       behavior, not static style) — one base style + the zebra modifier covers all four.
     · Row hover isn't specified in the Figma variants; we reuse the design's own
       Low tone rather than OSUI's off-palette neutral-2 (documented assumption).
     · Figma numeric cells hard-code IBM Plex Mono (untokenized). Font set is closed
       per brand-owner ruling → Open Sans + tabular-nums (design-token finding).
     · .table-row-selected and the phone/tablet stacked layout stay native (out of
       the Figma scope).
*/

/* ===== 1) Container — flat edges per Figma (no outer border, no radius) ===== */
.table {
  border: 0;
  border-radius: 0;
  border-spacing: 0;
  background: var(--loop-table-row-bg, #ffffff);
}

/* OSUI rounds the first/last header and last-row cells — reset to the flat look. */
.table .table-header th:first-child,
.table .table-header th:last-child,
.table .table-row:last-child > td:first-child,
.table .table-row:last-child > td:last-child {
  border-radius: 0;
}

/* ===== 2) Header — Low fill, bold 16, centered 24px column separators ===== */
/* Row dividers are drawn as INSET box-shadows, not borders: Figma strokes sit
 * inside the 56px cell, and a real border would grow the row to 57px (the
 * border-no-height-shift rule — zero layout impact, pinned height). */
.table .table-header th {
  position: relative;                       /* anchors the ::after separator */
  background-color: var(--loop-table-header-bg, #f5f7f9);
  border-bottom: 0;
  box-shadow: inset 0 calc(-1 * var(--border-size-s, 1px)) 0 var(--loop-table-divider, #00396b14);
  color: var(--loop-table-text, #000d1ab2);
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-table-font-size, 16px);
  font-weight: var(--font-weight-bold, 700);
  line-height: var(--line-height-base, 1.5);
  height: var(--loop-table-row-height, 56px);
  padding: var(--loop-table-cell-padding-y, 16px) var(--loop-table-cell-padding-x, 12px);
}

/* Short vertical separator between header cells — 1px × 24px, vertically centered
 * (Figma draws it as a standalone divider line, not a full-height cell border). */
.table .table-header th:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: var(--border-size-s, 1px);
  height: var(--loop-table-header-separator-height, 24px);
  background: var(--loop-table-header-separator, #00396b29);
}

/* Sorted / sortable-hover stay in the design's own text color (OSUI recolors to
 * primary — the Figma header has a single text tone for all states). */
.table .table-header th.sorted,
.desktop .table-header th.sortable:hover {
  color: var(--loop-table-text, #000d1ab2);
}

/* ===== 3) Body — Lowest fill, regular 16, subdued row dividers ===== */
.table .table-row td {
  background: var(--loop-table-row-bg, #ffffff);
  border-bottom: 0;
  box-shadow: inset 0 calc(-1 * var(--border-size-s, 1px)) 0 var(--loop-table-divider, #00396b14);
  color: var(--loop-table-text, #000d1ab2);
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-table-font-size, 16px);
  line-height: var(--line-height-base, 1.5);
  height: var(--loop-table-row-height, 56px);
  padding: var(--loop-table-cell-padding-y, 16px) var(--loop-table-cell-padding-x, 12px);
}

/* Keep OSUI's native RowSize modifiers working — the token rule above (0,2,1)
 * out-specifies the framework's .table-row-small/-medium td (0,1,1), so restate
 * the native heights at matching specificity. (Figma specs one 56px size only.) */
.table .table-row-small td  { height: 48px; }
.table .table-row-medium td { height: 64px; }

/* Figma keeps the divider under the last row too (OSUI strips the border there;
 * our divider is the inset shadow above, so just keep the border at 0) */
.table .table-row:last-child > td {
  border-bottom: 0;
}

/* Keep the phone/tablet STACKED layout fully native: OSUI resets the td border
 * there but knows nothing of our inset-shadow divider, which would otherwise draw
 * a hairline under every stacked cell (native shows one per row, on the tr). */
.phone .table:not(.table-no-responsive) .table-row td,
.tablet .table:not(.table-no-responsive) .table-row td {
  box-shadow: none;
}

/* ===== 4) Hover — design's Low tone (assumption: no hover in the Figma variants) ===== */
.table .table-row:hover td {
  background: var(--loop-table-header-bg, #f5f7f9);
}

/* ===== 5) Zebra — native OSUI striping hook, Figma Rows=Zebra fill ===== */
.table .table-row-stripping:nth-child(even) td {
  background: var(--loop-table-row-bg-striped, #f5f7f9);
}
.table .table-row-stripping:nth-child(even):hover td {
  background: var(--loop-table-row-bg-striped, #f5f7f9);
}

/* ===== 6) Numeric cell helper — right-aligned lining figures ===== */
/* Apply per column via the cell's style/ExtendedClass. Figma specs IBM Plex Mono
 * here; the project font set is closed, so Open Sans + tabular-nums stands in
 * (finding logged — see the header note). */
.table td.loop-table-cell--numeric,
.table th.loop-table-cell--numeric {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* ===== 7) Horizontal-scroll wrapper — slim rounded scrollbar per Figma ===== */
.overflow-horizontal::-webkit-scrollbar,
.table-responsive::-webkit-scrollbar {
  height: var(--loop-table-scrollbar-size, 8px);
  width: var(--loop-table-scrollbar-size, 8px);
}
.overflow-horizontal::-webkit-scrollbar-thumb,
.table-responsive::-webkit-scrollbar-thumb {
  background: var(--loop-table-scrollbar-thumb, #bdccdb);
  border-radius: var(--radius-base, 4px);
}
.overflow-horizontal::-webkit-scrollbar-track,
.table-responsive::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-horizontal,
.table-responsive {
  scrollbar-width: thin;                                        /* Firefox */
  scrollbar-color: var(--loop-table-scrollbar-thumb, #bdccdb) transparent;
}
```

</details>

## Variant mapping
| Figma variant | Extended Class / widget property | Treatment |
|---|---|---|
| Type=Row-based / Column-based (Default) | _(none — native Table default)_ | one shared static style — the two Types are **pixel-identical** in Figma (the Type axis is AG Grid hover behavior, not styling) |
| Rows=Zebra | the widget's striped rows (`table-row-stripping` per row) | even rows filled Low `#f5f7f9`, dividers kept |
| Numeric cells | `loop-table-cell--numeric` on th + td | right-aligned, `tabular-nums` (see FND-072 note below) |

## What the override changes vs OutSystems UI baseline
- `.table`: outer 1px border + soft radius **removed** (Figma has flat edges); first/last
  cell corner radii reset.
- Header `th`: neutral-0 → **Low `#f5f7f9`**, semi-bold → **bold**, 48px → **56px**,
  padding → **16px/12px**, plus the 1px × 24px vertically-centered `::after` column
  separator (`Divider/On Light/Default`). `.sorted`/sortable-hover keep the design's single
  text tone instead of OSUI's primary recolor.
- Body `td`: 16px/1.5 text in `Text/On Light/Default`, padding → 16px/12px.
- **Row dividers are inset box-shadows, not borders** — Figma's strokes sit inside the 56px
  cell; a real border made rows 57px (border-no-height-shift rule). The divider also stays
  under the **last** row (OSUI strips it).
- Row hover → the Low tone (assumption: hover isn't specified in the static Figma variants;
  OSUI's neutral-2 is off-palette here).
- Zebra even-row fill: neutral-1 → **Low `#f5f7f9`**.
- Native row-size modifiers restated at matching specificity so they keep working.
- Horizontal-scroll wrappers (`.overflow-horizontal` / `.table-responsive`) get the slim 8px
  rounded scrollbar (`#bdccdb` thumb).
- `.table-row-selected` + the phone/tablet stacked layout are untouched (out of Figma scope).

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for Table to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-table.css and dist/theme.css are already pasted into the ODC
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
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the `--loop-table-*` tokens).
- [ ] Paste `loop-table.css` into Theme CSS, **below** OutSystems UI.
- [ ] Table → native **Table** widget (styled by default, no Extended Class); zebra → the widget's striped rows; numeric columns → `loop-table-cell--numeric` on th + td.
- [ ] Verify: 56px rows, grey bold header with short separators, hairline dividers (incl. under the last row), zebra on even rows, no outer border/radius.
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview) — check the stacked mobile view still reads correctly.

## Findings linked to this work (register-only)
- **FND-072 (open, designer action)** — Figma numeric cells hard-code **IBM Plex Mono**
  (untokenized, outside the confirmed Open Sans brand set, not hosted in ODC). Brand-owner
  ruling 2026-07-14: font set is closed → built as Open Sans + `font-variant-numeric:
  tabular-nums`, right-aligned. Design to either publish a tokenized numeric style with a
  hostable font or align the spec on Open Sans.
