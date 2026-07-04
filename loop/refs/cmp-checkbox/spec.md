# Frozen Figma ref — cmp-checkbox

- **Figma file:** aHtnwyPhI8WRbiGHZ8E5Gb (The Loop — Main Library)
- **Node:** 19336:17679 (Checkbox page; original canvas 1318×6698)
- **Pulled:** 2026-07-04 (backfill; variables + screenshot). Deep-pull `get_design_context` on a sublayer if a fine detail is disputed.
- Exact token values: `variables.json`.

## Key values

| Property | Value | Figma variable |
|---|---|---|
| Box size | 28×28px (icon wrapper), 4px padding | `loop/checkbox/icon/*` |
| Box radius | 4px | `loop/checkbox/border radius` |
| Box→label gap | 8px | `loop/checkbox/gap` |
| Label font | Open Sans 400 16/18, ls 0 | `.UI Component/Checkbox/Label` |
| Checked bg / tick | #004370 / #ffffff | `Background/Container/On Light/Link/Primary/Enabled`, `Icon/On Dark/Emphasis` |
| Unchecked bg / border | #ffffff / rgba(0,57,107,0.24) | `Background/Container/On Light/Lowest`, `Outline/On Light/Default` |
| Focus/primary outline | #004370 | `Outline/Primary` |
| Disabled bg / border / text | #dae3eb / #d4dee8 / #00294d6b | disable state tokens |
| Error border/icon/text | #9d161d | error state tokens |
| Group (bordered) padding | 20px h / 14px v | `loop/checkbox/group/*` |
| Field label (group heading) | Open Sans 600 16/16 | `.UI Component/Input/Label/Label` |
| Helper | Open Sans 400 12/1, ls 0.5 | `.UI Component/Input/Label/Helper` |

**Caution:** the node also carries a legacy `Checkbox/label` set (14/14) from a foreign system — the `loop/checkbox/label` values (16/18) are the WBG spec (foreign-system leakage is FND-001).
