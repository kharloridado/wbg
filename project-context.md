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
- Prefix: `rnt-`
- Environment: ODC
- Spacing base: unconfirmed — grid spec TBD (don't flag values as "off the 4pt grid"); scale per `tokens/spacing.css`, confirm base/grid with the Loop team
- Token style: OutSystems UI standard

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
