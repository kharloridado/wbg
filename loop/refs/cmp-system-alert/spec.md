# Frozen Figma ref — cmp-system-alert

- **Figma file:** aHtnwyPhI8WRbiGHZ8E5Gb (The Loop — Main Library)
- **Node:** 17873:7603 (System Alert page; original canvas 1815×3904). Originally built from a live desktop selection — this node (from design/figma-links.md) is now the durable ref.
- **Pulled:** 2026-07-04 (backfill; variables + screenshot). Deep-pull `get_design_context` on a sublayer if a fine detail is disputed.
- Exact token values: `variables.json`.

## Key values

| Property | Value | Figma variable |
|---|---|---|
| Text | Open Sans 400 14/1.25 | `Body/Text/Small/Narrow` |
| Info bar bg / text | #004370 / #f6fcff–#ffffff | `…/State/Information/High`, `Text/On State/Primary/*` |
| Error bar bg | #9d161d | `…/State/Error/High` |
| Warning bar bg / text | #e19d00 / #473201 | `…/State/Warning/Regular`, `Text/On Light/State/Warning` |
| Neutral/disabled bar bg | #8a9db1 | `…/State/Disable/High` |
| On-dark link | #f5f7f9 | `Text/On Dark/Link/Secondary` |
| Icon (on dark) | #ffffff | `Icon/On Dark/Emphasis` |
| Spacing steps present | 4 / 8 / 12 / 24 | `Spacing/tiny…regular` |

Component: `src/components/loop-system-alert.js` (value-aware `_boolAttr` pattern — keep; see memory web-component-boolean-attrs-odc).
