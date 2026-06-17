# Design Loop — REPORT

**Run:** 2026-06-17 · **Mode:** library (Phase 0 — tokens only) · **Branch:** `loop/2026-06-17-design-system`
**Status:** ⏸️ PAUSED at the `after_tokens` checkpoint — awaiting designer / brand-owner sign-off.

## Goal
Extract + reconcile the FULL WBG token set from **The Loop — Main Library** (`aHtnwyPhI8WRbiGHZ8E5Gb`) into OutSystems-ready `dist/theme.css`, file token-drift findings, then pause before any component is built.

## What happened
- Figma MCP connected; `gh` **not** authenticated (findings/handover/Project steps deferred — see below).
- The configured node `10124-7594` and `figma-links.md` were dead ends; the file's MCP bridge reads the **live desktop selection**. With the right frames selected, tokens were extracted from 5 nodes:
  `11122-2143` (primitive ramps), `11122-2879` (semantic role layer), `10995-7259` (type), `10994-5086` (spacing), `19737-9489` (radius + shadows).

## Tier progress
| Tier | Status |
|---|---|
| foundations (tokens) | ✅ built — see below |
| primitives | ⏳ not audited (deferred to post-sign-off; only token frames were exposed this run) |
| composites | ⏳ not started |
| patterns | ⏳ not started |

## Tokens built → `dist/theme.css` (361 tokens)
| File | Tokens | Notes |
|---|---|---|
| `tokens/colors.css` | ~140 primitives | Blue/Neutral(solid+alpha)/Gray-alpha/Red/Green/Yellow/Purple + Accent(Orange/Pale-Green/Teal/Indigo/Magenta) + brand `#002244` |
| `tokens/semantic-colors.css` | ~170 roles | Domain / Interactive / Elevations / States / Background / Text / Icon / Divider / Outline |
| `tokens/spacing.css` | 16 | full descriptive scale (none…xhuge) + lift `space.N` aliases + grid gutter |
| `tokens/typography.css` | 24 | body=Inter, heading/label=Poppins, Font-size/100..1200, weights, line-heights, letter-spacing |
| `tokens/radius.css` | 3 | base 4 / medium 8 / large 16 |
| `tokens/shadows.css` | 6 | lowest/low/regular/medium/high + shadow color |

Built with `npm run build:theme:dev` (the prod `build:theme` `--targets` flag panics lightningcss-cli 1.0.0-alpha.71 in this env — fix before handover).

## Consistency pass (foundations)
**pass-with-findings.** Canonical = `lift` + primitive ramps. Naming consistent within that set; all divergences captured as findings. Foreign systems excluded from the theme.

## Findings filed (flag-don't-fix — NONE resolved)
`gh` not authenticated → all queued locally in `findings/findings-register.md`; high-sev payloads in `findings/tickets/`. File once authed.

| ID | Type | Sev | Summary |
|---|---|---|---|
| FND-001 | consistency | high | Foreign token systems leaked in (`_ITSES`/Open Sans, `_GDS`/Manrope, `Headings Desktop`/Andes, `DS L2.0`/IBM Plex) |
| FND-002 | design-token | high | Ambiguous brand font — 6 families; Inter vs Open Sans conflict inside `lift` |
| FND-003 | design-token | medium | Shadow color drift `#21262d29` vs `#000d1a29` |
| FND-004 | design-token | medium | Radius naming/value mismatch (`radius-4` = 16px) |
| FND-005 | design-token | low | `Spacing/xtiny` = 2px off the 4pt grid |
| FND-006 | design-token | low | Orphan semantic tokens with no primitive (4) |
| FND-007 | design-token | low | `Domain/States/informational` lowercase casing clash |
| FND-008 | consistency | low | Cross-group role spelling variants (info / Information / Informational / Info; Suggestion / Suggestional / Suggest) |
| FND-009 | brand | medium | Accent/Indigo ramp inversion (40 `#9fa9f7` darker than 50 `#a8b2ff`) |
| FND-010 | design-token | low | Green/Yellow mixed step naming (`$lift-core` base/on-dark vs numeric 10–90) |
| FND-011 | a11y/contrast | medium | `Blue/40 #169af3` = 3.02:1 on white — fails normal-text AA when used as interactive/link text |

## Project board / handover epics
None yet — `gh` unauthenticated. No issues, no Project items, no tier handover epic created this run.

## Needs-human (blockers for resume)
1. **`gh auth login`** (+ `gh auth refresh -s project`) — to file findings as Bugs, create the Project board, and open the foundations handover epic.
2. **Sign-off on FND-001 & FND-002** — the brand-font decision (FND-002) gates every type token; resolve before building components.
3. **Confirm component scope** — the file exposed only token frames; point the loop at the component pages (live-select per the MCP behaviour) to audit primitives→patterns.

## Resume
After sign-off + `gh` auth, re-run `/design-loop`. State is durable in `loop/state.json` (`status: paused`); the token foundations are marked `built` and won't be redone. Findings dedup on `[node:<id>]`.
