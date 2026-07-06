# Frozen Figma ref — cmp-tooltip

- **Figma file:** aHtnwyPhI8WRbiGHZ8E5Gb (The Loop — Main Library)
- **Node:** 17874:7113 (Tooltip page; original canvas 861×1141). Originally built from a live desktop selection — this node (from design/figma-links.md) is now the durable ref.
- **Pulled:** 2026-07-04 (backfill; variables + screenshot). Deep-pull `get_design_context` on a sublayer if a fine detail is disputed.
- Exact token values: `variables.json`.

## Key values

| Property | Value | Figma variable |
|---|---|---|
| Balloon bg | #000000 | `Background/Black` |
| Text | Open Sans 400 14/1.25, #ffffffe5 | `Body/Text/Small/Narrow`, `Text/On Dark/Emphasis` |
| Radius | 2px | `Border Radius/Small` |

Artifact: `src/blocks/loop-tooltip.css` (styles the shared `.osui-balloon` Feature — see memory restyle-verify-against-live-runtime-dom).
