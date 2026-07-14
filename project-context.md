# Project Context

Fill this in at project kickoff. The OutSystems skills read these values so they don't have to ask every session.

## Identity
- Customer: `World Bank Group`
- Project: `WBG`
- Repo: `kharloridado/wbg`
- Start date: `2026-06-17`

## Brand source of truth
- Brand guidelines: see `design/brand-guidelines.md`
- Figma files: see `design/figma-links.md`
- Designer / brand owner contact (who findings go back to): `<name / channel>`

## Conventions (override CLAUDE.md defaults only if this project differs)
- Prefix: `loop-`
- Environment: ODC
- Token style: OutSystems UI standard

### Conventions are three-state — only `confirmed` is a rule
A convention that has not actually been confirmed by the designer or brand owner is **not a
rule**, and nothing may be flagged as a finding for "violating" it.

| Convention | Value | Status |
| --- | --- | --- |
| Spacing base / grid | — | **TBD** — not confirmed. Scale is per `tokens/spacing.css`. |
| Breakpoints | OutSystems UI `.tablet` / `.phone` | assumed |
| Default component size | — | **TBD** — confirm per component against the Figma Component Sizes collection. |

> The spacing base was originally carried over from the project template as "4pt". Nobody had
> verified it. The loop believed it and flagged every value that wasn't a multiple of 4,
> producing findings FND-005/013/018/022 — all false positives, one of which had already been
> filed as a GitHub issue and had to be closed as not-planned. **Never flag a value for being
> off a grid that isn't a confirmed rule.** See the 2026-06-16 Live Style Guide sync: the final
> grid spec is still not confirmed.

## Framework reference — OutSystems UI
- **Source of truth for framework conventions:** [`OutSystems/outsystems-ui`](https://github.com/OutSystems/outsystems-ui), vendored read-only as a git submodule at `vendor/outsystems-ui`, **pinned to `v2.28.1`** — ✅ confirmed to match the target ODC environment's OutSystems UI version (2026-06-17). We build *on top of* this — never edit it (hard rule #1). `git submodule update --init` after cloning.
- **Brand inheritance:** OutSystems UI declares its whole design-token system as `:root` custom properties (`src/scss/01-foundations/_root.scss`); components resolve `var(--color-…)`, `var(--space-…)`, `var(--border-radius-…)`, `var(--shadow-…)`. `tokens/outsystems-ui-overrides.css` redefines those variables to point at The Loop tokens — bundled **last** in `tokens/index.css` so it wins. Covers **color** (full retint), **spacing** (1:1 name remap), **border-radius** (`soft`→`radius-base`), and **shadow/elevation** (mapped to the Loop lift scale). Result: the framework renders in WBG/"The Loop" branding with no framework edits and no hard-coded values.

## Findings routing
- Ticketing: `github`            # default; alternatives: notion | jira
- Ticket target: `<owner/repo>`   # + optional GitHub Project board name
- Slack channel: `<#channel | none>`
- Gate: `high+`

> Findings open as **GitHub Issues** via `gh` from Claude Code — works on the private repo, no MCP needed (GitHub CLI v2.94.0+). For Slack, subscribe the channel with GitHub's Slack app: `/github subscribe <owner/repo> issues +label:finding`. Notion/Jira (Rovo is connected) remain available if a project prefers them.

## Notes
`<anything project-specific: known brand quirks, accessibility exceptions already signed off, etc.>`
