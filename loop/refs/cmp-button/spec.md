# Frozen Figma ref — cmp-button

- **Figma file:** aHtnwyPhI8WRbiGHZ8E5Gb (The Loop — Main Library)
- **Node:** 15597:766 (Button page; original canvas 1808×8267 — figma.png is the scaled render)
- **Pulled:** 2026-07-04 (backfill; variables + screenshot). For a disputed fine detail, deep-pull `get_design_context` on the relevant component-set sublayer of 15597:766.
- **Shared with:** cmp-button-dropdown (same source node)
- Exact token values: `variables.json`.

## Key values

| Property | Value | Figma variable |
|---|---|---|
| Label font | Open Sans 700 16/24, ls -0.5 | `.UI Component/Button/Label` |
| Padding | 32px h / 16px v | `loop/button/h-padding` / `v-padding` |
| Radius (pill) | 32px | `loop/button/border radius` / `Buttons` |
| Content gap | 6px | `loop/button/gap` |
| Icon-button | 18px icon, 19px h / 17px v padding, 2px wrapper padding | `loop/button/icon/*` |

## Per-size modes (deep-pull 2026-07-04 — file `zx8q9nRf8Dbqam1rfquQ2E` "Main Library (2)", node 15597:847)

The `loop/button/*` variables are **mode-based per size** — the flat values above/in
`variables.json` are the xLarge mode only. Resolved per size (label + icon buttons):

| Size | Height | Label font/lh | Icon glyph | Gap | Label-btn pad h/v | Icon-btn pad h/v | Icon wrapper v-pad |
|---|---|---|---|---|---|---|---|
| xLarge | 56 | 16/24 | 18 | 6 | 32/16 | 19/17 | 2 |
| Large | 48 | 14/24 | 16 | 6 | 28/12 | 16/14 | 2 |
| Regular (base) | 40 | 12/24 | 14 | 6 | 20/8 | 13/9 | 4 |
| Small | 32 | 11/20 | 12 | 4 | 14/6 | 10/7 | 3 |

Source nodes: labels 15597:955/954/965/970 · icon-only 15597:976/975/985/990 · icon+label 15597:960/959/966/971.
Note: implementation keeps the user-approved 16px inline padding (PR #124) — the per-size
paddings above are recorded for the spec but were deliberately not applied.
| Primary bg enabled/hover/pressed/disabled | #004370 / #169af3 / #012740 / #8a9db1 | `Background/Container/On Light/Link/Primary/*` |
| Primary label | #ffffff | `Button/Primary/Label/Default` |
| Secondary | transparent bg, #004370 outline+text; hover #169af3, pressed #a3daff | `…/Link/Secondary/*`, `Outline/On Light/Link/Enabled` |
| Tertiary | transparent bg; hover #cde7f9, pressed #a3daff, disabled #ffffff | `…/Link/Tertiary/*` |
| Disabled (low) bg/outline | #dae3eb / #d4dee8 | `…/State/Disable/Low` |
| On-dark variants | see `variables.json` (`On Dark` roles) — dark phase deferred | |
