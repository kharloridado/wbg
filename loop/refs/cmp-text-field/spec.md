# Frozen Figma ref — cmp-text-field

- **Figma file:** aHtnwyPhI8WRbiGHZ8E5Gb (The Loop — Main Library)
- **Node:** 19336:9606 (Text Field page; original canvas 1842×4340 — figma.png is the scaled render)
- **Pulled:** 2026-07-04 (backfill; variables + screenshot). Deep-pull `get_design_context` on the component-set sublayer if a fine detail is disputed.
- Exact token values: `variables.json`.

## Key values

| Property | Value | Figma variable |
|---|---|---|
| Label font | Open Sans 600 16/16, ls 0 | `.UI Component/Input/Label/Label` |
| Input text/placeholder | Open Sans 400 16/16, ls 0.5 | `.UI Component/Input/Placeholder/Text FIeld` |
| Helper font | Open Sans 400 12/1, ls 0.5 | `.UI Component/Input/Label/Helper` |
| Word count font | Open Sans 400 12/1, ls 0.5 | `.UI Component/Input/Label/Word Count` |
| Field vpadding | 18px | `loop/field/vpadding` |
| Field hpadding | 16px both sides | `loop/field/hpadding left`/`right` |
| Field radius (pill) | 32px | `Input Fields` |
| Label→input gap | 6px | `loop/label/gap` |
| Inner gap | 8px | `loop/Field/hGap` |
| Placeholder vpadding | 2px | `loop/Field/Placeholder vPadding` |
| Default bg/border | #ffffff / rgba(0,57,107,0.24) | `Background/Container/On Light/Lowest`, `Outline/On Light/Default` |
| Focused border | #0071bc | `Outline/On Light/Link/Focused` |
| Error bg/border/text | #fdf2f2 / #9d161d / #861319-#9d161d | error state tokens |
| Warning bg/border/text | #fef3d7 / #896001 / #473201 | warning state tokens |
| Disabled bg/text | #dae3eb / #00294d6b | disable state tokens |
| Success icon/text | #388004 | success state tokens |

**Known divergence (already filed):** Select (cmp-dropdown-select) uses 13px text + 11px vpadding vs this 16px/18px — FND-031, register-only. Do not re-flag either side.

**Note (post-build reality):** the shipped text-field default was later aligned to Regular 13px text as the no-class default (commit 106b5f6) per the Component Sizes collection — when re-auditing, check the Figma "Component Sizes" collection variants before flagging size deltas (see memory: verify-component-sizes-in-figma).
