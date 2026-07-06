# Frozen Figma ref — cmp-button-group

- **Figma file:** aHtnwyPhI8WRbiGHZ8E5Gb (The Loop — Main Library)
- **Node:** 15597:2978 (Button Group page; original canvas 1825×3076). Button Switch companion node: 15597-4070 (per state.json approach note; not separately snapshotted).
- **Pulled:** 2026-07-04 (backfill; variables + screenshot). Deep-pull `get_design_context` on a sublayer if a fine detail is disputed.
- Exact token values: `variables.json`.

## Key values

| Property | Value | Figma variable |
|---|---|---|
| Label font | Open Sans 700 16/24, ls -0.5 | `.UI Component/Button/Label` |
| Segment padding | 32px h / 16px v | `loop/button/h-padding` / `v-padding` |
| Group outer radius (pill ends) | 32px | `loop/button/border radius` |
| Inner segment corner radius | 2px | `Button/Border Raduis/Top Right` / `Bottom Right` |
| Small radius variant | 16px | `Border Radius/Small` |
| Active bg / text | #004370 / (label on primary) | `Background/Container/On Light/Link/Primary/Enabled` |
| Inactive bg / outline / text | transparent / #004370 / #004370 | secondary link tokens |
