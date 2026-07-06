# Frozen Figma ref — cmp-tag

- **Figma file:** aHtnwyPhI8WRbiGHZ8E5Gb (The Loop — Main Library)
- **Node:** 17313:5502 (Tag page; canvas 1550×12703). Originally built from a live desktop selection; node id recovered from FND-028/029/030 during the 2026-07-04 backfill.
- **Pulled:** 2026-07-04 (backfill; variables + screenshot). Deep-pull `get_design_context` on a sublayer if a fine detail is disputed.
- Exact token values: `variables.json`.

## Key values

| Property | Value | Figma variable |
|---|---|---|
| Label font | Open Sans 400 16/16, ls 0.25 (Selected: 700) | `.UI Component/Tag/Label` / `Label Selected` |
| H padding / inner gap | 12px / 4px | `loop/tag/hpadding`, `loop/tag/hgap` |
| V padding | 6.5 (small, retired — FND-029 resolved: heights pinned) / 8 | `loop/Tag/vPadding`, `loop/tag/vpadding` |
| Radius | 48px (FND-028: off-scale vs `--radius-pill` 32; visually identical) | `loop/tag/border radius` |
| Cross / leading icon | 14px | `loop/tag/icon/*` |
| Avatar/initials | 24px, initials Open Sans 700 10/10 | `loop/tag/avatar and initials/*` |
| Flag | 25×18px | `loop/tag/flag/*` |
| Resting bg / outline / text | #f5f7f9 / #00396b3d / #000d1ab2 | container-low + outline-default + text-default |
| Selected bg | `Domain/State/*/High` roles (FND-030: no tag-specific selected tokens) | state high tokens |
| Disabled | #e7edf3 / #d4dee8 / #00294d6b | disable tokens |

**Filed findings on this node:** FND-028 (radius 48), FND-029 (resolved — pinned heights), FND-030 (selected-state tokens). Do not re-flag.
