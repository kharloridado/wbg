# Frozen Figma ref — cmp-toggle

- **Figma file:** aHtnwyPhI8WRbiGHZ8E5Gb (The Loop — Main Library)
- **Node:** 25344:27822 (Toggle/Switch page; original canvas 1860×4688)
- **Pulled:** 2026-07-04 (backfill; variables + screenshot). Deep-pull `get_design_context` on a sublayer if a fine detail is disputed.
- Exact token values: `variables.json`.

## Key values

| Property | Value | Figma variable |
|---|---|---|
| Track | 56×32px, 4px padding | `loop/toggle/switch/*` |
| Knob | 24px circle, white | `loop/toggle/switch/circle size`, `Background/White` |
| On track | #004370 | `Domain/Interactive/On Light/Enabled Primary` |
| Hover / Focus / Pressed halo | 2px spread ring, 0 blur — #169af3 / #0071bc / #012740 | `-loop interactive shadows/*` |
| Disabled track/knob-ring | #8a9db1 / #bdccdb / #e7edf3 | `Domain/States/Disable/*` |
| Label font | Open Sans 400 16/18, ls 0 | `UI Component/.Toggle/Label` |
| Toggle→label gap | 8px; row min-height 40px | `loop/toggle/label/gap` / `minH` |

Note: two Toggle label variable sets coexist (`loop/toggle/label` lh 18 vs `loop/Toggle/Label` lh 16); the lowercase set is bound to the `.Toggle/Label` type style — treat lh 18 as spec, casing clash is FND-007 territory.

## States ref — node 25862:16199 (file zx8q9nRf8Dbqam1rfquQ2E, "Copy Me")

Screenshot: `figma-states-25862-16199.png` (Enabled · Disabled · Read-Only columns, on/off rows). Pulled 2026-07-05.

| State | Track | Thumb | Check (on) | Label |
|---|---|---|---|---|
| Enabled on / off | #004370 (`Enabled Primary`) / #4b5e71 (`Icon/On Light/Default`) | white | Blue/70 | `Text/On Light/Default` |
| Disabled | #8a9db1 (`Domain/Interactive/On Light/Disable`) | white | muted | muted (`Text/On Light/State/Disabled`) |
| **Read-Only** | **#e7edf3** (`Domain/States/Disable/Lowest`), same on & off | white + **2px #012740 ring** (`Pressed` shadow, spread 2 blur 0) | Blue/70 | **`Text/On Light/Default` — NOT muted** |

Read-Only = shows state but inert (can't toggle); distinguished from Disabled by the light track + dark thumb ring + fully-readable label. Built as `.is-read-only` on `[data-switch]` (+ `.loop-field--read-only` wrapper cascade).
