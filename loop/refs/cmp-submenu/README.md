# Frozen Figma ref — Side-nav Submenu (`.osui-submenu` in Layout Side)

**Source:** The Loop — Main Library (2), file key `zx8q9nRf8Dbqam1rfquQ2E`
**Frame:** `23980:12219` — "DSTheLoop / Nav/Menu-Actions"
**Captured:** 2026-07-06 (snapshot is the spec of record; subagents have no Figma MCP).

Customization target: the native OutSystems UI **Submenu** pattern used inside **Layout Side**.
Look-and-feel only — behaviour (open/close, keyboard, ARIA) is the stock OSUI pattern.

## Screenshots
| File | Node | What |
| --- | --- | --- |
| `copy-example.png` | `23980:12227` | Copy-ready menu-item list (white pills, icon + label + `›` chevron) |
| `parent-open.png` | `21807:3153` | Parent open — chevron down, children as indented plain-text list |
| `menu-l2.png` | `24260:14651` | L2 child list (Nav/Menu-L2) |
| `selected-indicator.png` | `26346:23547` | Selected + indicator (4×18 Blue/40 bar, 5% neutral pill) |
| `submenu-overview.png` | `23980:12219` | Full documentation frame |

## Key symbol node ids
- Item states: `22088:3646` (enabled) · `22088:3653` (hover) · `22088:3660` (pressed) · `22088:3667` (focused)
- Selected: `29243:31152` · Selected+indicator: `26346:23547`
- Parent closed: `20702:3579` · Parent open: `21807:3153`
- L2 item states: under `22619:12922` · L2 list: `21807:3293`

## Confirmed tokens (Figma → existing Loop primitive)
| Role | Figma | Token |
| --- | --- | --- |
| Item text | `#252e37` | `--color-neutral-9` |
| Leading icon | `#4b5e71` | `--color-icon-on-light-default` |
| L1 hover fill | `#cde7f9` | `--color-blue-20` |
| Pressed fill | `#a3daff` | `--color-blue-30` |
| L2 (content) hover | `#e7edf3` | `--color-neutral-2` |
| Selected fill | `#00396b0d` | `--color-neutral-alpha-04` |
| Selected indicator bar | `#169af3` (4×18, r4) | `--color-blue-40` + `--space-tiny` + `--radius-base` |
| Focus ring | `#0071bc` | `--color-outline-on-light-link-focused` |
| Font | Open Sans SemiBold (L1) / Regular (L2) 16/24, radius 32, min-h 48, pad 8/16, gap 8 | body/300/semibold·regular / base / pill / xlarge / xxsmall·small |

This frame ships the full interaction set, resolving the provisional **FND-057** (side-nav hover/selected).

Implemented in `tokens/outsystems-ui-side.css` (folded into `dist/theme.css`); preview specimen in `preview/index.html` (Layout Side section).
