# Frozen Figma ref — cmp-card (simple card, re-scoped 2026-07-04)

- **Figma file:** zx8q9nRf8Dbqam1rfquQ2E (The Loop — Main Library (2))
- **Nodes:** 20315:6129 (dev specs + classic/modern examples), 20315:6189 (external-web examples), 20376:15012 (classic w/ shadow + flush example 20376:15327)
- **Pulled:** 2026-07-04 via `get_design_context`. Screenshot: `figma.png` (node 20376:15012).
- Exact token values: `variables.json`.
- **Supersedes** the 2026-07-04 backfill of node 20315:6122 (file aHtnwyPhI8WRbiGHZ8E5Gb) — the multimedia/sectioned card family restyle was reverted; scope is now the simple card shell only.

## Key values (dev-specs node 20315:6129)

| Property | Value | Figma variable |
|---|---|---|
| Container bg | #ffffff | `loop/card/container-color` |
| Corner radius | 8px — medium, **all styles** (modern/classic/mixed) | `card/corner-radius` |
| Shadow — classic & mixed | x=0 y=8 blur=20 spread=0, color #00396b29 | `card/shadow/*` + `effects/shadow/default` |
| Shadow — modern (external web) | none (x=0 y=0 blur=0 spread=0) | `card/shadow/*` |
| Outline | transparent, **all styles** | `card/outline` |
| Padding | 24px (one flush/no-padding example: node 20376:15327) | `spacing/regular` |
| Placeholder bg | #e7edf3 | `neutral/solid/10-s` |
| Placeholder text | rgba(0,41,77,.42) | `text/on-light/state/disabled` |

## Build mapping

- Bare `.card` override (2026-07-05 user ruling, reversing the 2026-07-04 opt-in re-scope) —
  every native Card widget is restyled by default; no Extended Class needed for the default look.
- Default = classic (shadow). `.card--no-shadow` = modern. `.card--flush` = no padding.
- Shadow = `--shadow-medium` (same 0 8 20 geometry). The ref's `effects/shadow/default`
  **#00396b29 is known Figma drift** — the FND-003 sign-off (2026-06-24) fixed `#21262d29`
  canonical; drift tracked as **FND-065, do not re-flag**. FND-034 (zeroed shadow) is resolved
  by this spec: the styles collection now defines the classic/mixed shadow explicitly.

**Out of scope (reverted 2026-07-04):** multimedia hero, sectioned card, list-card margins, on-dark eyebrow/title roles (FND-035 superseded).
