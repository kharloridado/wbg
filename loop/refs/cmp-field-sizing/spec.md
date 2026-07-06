# Frozen Figma ref — cmp-field-sizing (Field Wrapper size cascade)

- **Figma file:** zx8q9nRf8Dbqam1rfquQ2E (**-The Loop- Main Library (2)** — the NEWER library file;
  earlier cmp-* refs froze aHtnwyPhI8WRbiGHZ8E5Gb)
- **Nodes:** Text Field Sizes `19336:9726` · Checkbox group Sizes `19336:17818` ·
  Search Sizes `17191:8819` · Toggle group Sizes `25862:14729`
- **Pulled:** 2026-07-05 (`get_design_context` per size instance; screenshots below).
- **Rule captured:** every sizeable control **inside a sized Field Wrapper follows the wrapper** —
  FieldLabel, control geometry, control label and gaps step together (the Figma DS note:
  "associate Label Size with variable Label Size so the label changes along with the field").

## FieldLabel (shared across all four components)

| Size | Font/leading | Tracking |
|---|---|---|
| xLarge | 16/16 SemiBold | 0 |
| Large | 14/16 | 0 |
| Regular | 13/16 | 0.25 |
| Small | 12/16 | 0.5 |

Label→control gap = **6px** (`loop/label/gap`) for Text Field / Checkbox group / Toggle group,
but **4px** in the Search Field container — FND-069 (consistency, built faithfully at 4px).

## Text Field / Search box (nodes 19336:9729 · 17191:8830/8840)

| Size | Height | vPad | hPad | Text/leading | Glass icon | Glass inset | pad-left |
|---|---|---|---|---|---|---|---|
| xLarge | 56 | 18 | 16 | 16/16 | 20 (18 glyph) | 16 | 44 |
| Large | 48 | 14 | 16 | 14/16 | 20 (18 glyph) | 16 | 44 |
| Regular | 40 | 11 | 16 | 13/14 | 16 (14 glyph) | 16 | 40 |
| Small | 32 | 8 | **12** | 12/12 | 12 (10 glyph) | 12 | 32 |

Small pulls `loop/field/hpadding` in to 12px (node 19336:9755). Clear (×) 16px, 14px at Small.

## Checkbox group (node 19336:17831 horizontal / 17821 vertical)

| Size | Box | Box↔label gap | Label/leading | Tracking | Column gap (horizontal) |
|---|---|---|---|---|---|
| xLarge | 28 | 8 | 16/18 | 0 | 20 |
| Large | 24 | 8 | 14/16 | 0 | 20 |
| Regular | 20 | 4 | 13/15 | **0** | 16 |
| Small | 16 | 4 | 12/14 | 0.25 | 14 |

Regular label tracking is **0** here (the earlier build's 0.25 was corrected 2026-07-05).
Group error state = red helper line, boxes stay default. Box border drawn 1.5px in this file
(build keeps 1px + inset shadow treatment — border-no-height-shift rule).

## Toggle group (nodes 25862:14736/14737/14860/14900)

| Size | Track | Padding | Thumb | Label/leading | Tracking | Toggle↔label gap | Row min-h |
|---|---|---|---|---|---|---|---|
| xLarge | 56×32 | 4 | 24 | 16/18 | 0 | 8 | 40 |
| Large | 48×26 | **3** | **20** | 14/16 | 0 | 8 | 40 |
| Regular | 40×20 | **2** | **16** | 13/15 | 0 | 4 | 32 |
| Small | 32×16 | **2** | **12** | 12/14 | 0.25 | 4 | 32 |

Supersedes the extrapolated 4px-padding geometry from the old-file ref (cmp-toggle,
25344:27822 = today's xLarge only). The ON thumb carries the **check glyph** at every size
(glyph box = thumb − 2×padding → 16/14/12/8); colour unpublished — FND-026, built as
`Domain/Interactive/Enabled Primary` (visual match).

Helper text: 12px/1, ls 0.5, 4px icon gap — unchanged at every size, for all four components.
