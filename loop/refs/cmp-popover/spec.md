# Frozen Figma ref — cmp-popover

- **Figma file:** aHtnwyPhI8WRbiGHZ8E5Gb (The Loop — Main Library)
- **Node:** 26345:2762 (Popover page; original canvas 2151×8767). Originally built from a live desktop selection — this node (from design/figma-links.md) is now the durable ref.
- **Pulled:** 2026-07-04 (backfill; variables + screenshot). Deep-pull `get_design_context` on a sublayer if a fine detail is disputed.
- Exact token values: `variables.json`.

## Key values

| Property | Value | Figma variable |
|---|---|---|
| Balloon bg | #ffffff | `Domain/Elevations/Light/Lowest` |
| Balloon padding | 16px h / 16px v | `loop/popover/horizontal`/`vertical padding` |
| Balloon radius | 4px | `lift/border radius/radius-1` / `Border Radius/Base` |
| Elevation/edge | #d4dee8 | `Domain/Elevations/Light/Medium` |
| Title font | Open Sans 700 14/20, ls 0.25 | `UI Component/popover/label` |
| Body font | Open Sans 400 12/18 | `UI Component/popover/body` |
| Divider | rgba(0,57,107,0.16) | `Divider/On Light/Default` |
| Icon default | #4b5e71 | `Icon/On Light/Default` |

**Beware in-page variants:** popover examples embed a mini toggle (32×16, 12px knob) and small buttons (12px label, 20×8 padding) — those are popover-scoped sizes, not changes to the global toggle/button specs.

Component: `src/components/loop-popover.js`.
