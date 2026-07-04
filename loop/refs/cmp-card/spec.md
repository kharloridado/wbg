# Frozen Figma ref — cmp-card

- **Figma file:** aHtnwyPhI8WRbiGHZ8E5Gb (The Loop — Main Library)
- **Node:** 20315:6122 (Cards page; original canvas 1824×6376). Sub-nodes: base card 19547:47101, multimedia 20315:7404.
- **Pulled:** 2026-07-04 (backfill; variables + screenshot). Deep-pull `get_design_context` on a sub-node if a fine detail is disputed.
- Exact token values: `variables.json`.

## Key values

| Property | Value | Figma variable |
|---|---|---|
| Container bg | #ffffff | `loop/card/container color` |
| Corner radius | 8px | `card/corner radius` |
| Card shadow | 0 0 0 0 #00396b29 — **deliberately zero/flat** | `-loop shadows/cards` (FND-033, filed) |
| Padding (loop card) | 24px | `Spacing/regular` (per handover/loop-card.md build) |
| Multimedia card width | 464px | `loop/extweb/card/multimedia/width` |
| Hero icon size | 40px | `loop/icons/xxlarge` |
| On-dark scrim text | #ffffffbf / #ffffffe5 over `Gray/Alpha/White/60 A` | on-dark tokens (FND-034: direct primitives, dark role layer deferred) |
| Body type roles | Body/Text 12–24px ladder, Eyebrow 13 Bold | `Body/*` styles in `variables.json` |
| Card-scoped button | label 12/24 Bold ls -0.5, 20px h / 8px v padding, radius 32 | card-scoped `loop/button/*` overrides |

**Known filed findings:** FND-033 (zeroed shadow — built flat, confirm intent), FND-034 (multimedia on-dark text uses primitives directly). Do not re-flag.
**Scope note:** Featured-item & chart cards are bespoke compositions, deferred (user decision 2026-06-20); restyle covers card shell + multimedia hero only.
