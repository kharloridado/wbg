# Project Context

Fill this in at project kickoff. The OutSystems skills read these values so they don't have to ask every session.

## Identity
- Customer: `<CUSTOMER>`
- Project: `<PROJECT>`
- Repo: `<git remote / repo name>`
- Start date: `<YYYY-MM-DD>`

## Brand source of truth
- Brand guidelines: see `design/brand-guidelines.md`
- Figma files: see `design/figma-links.md`
- Designer / brand owner contact (who findings go back to): `<name / channel>`

## Conventions (override CLAUDE.md defaults only if this project differs)
- Prefix: `rnt-`
- Environment: ODC
- Spacing base: 4pt
- Token style: OutSystems UI standard

## Findings routing
- Ticketing: `github`            # default; alternatives: notion | jira
- Ticket target: `<owner/repo>`   # + optional GitHub Project board name
- Slack channel: `<#channel | none>`
- Gate: `high+`

> Findings open as **GitHub Issues** via `gh` from Claude Code — works on the private repo, no MCP needed (GitHub CLI v2.94.0+). For Slack, subscribe the channel with GitHub's Slack app: `/github subscribe <owner/repo> issues +label:finding`. Notion/Jira (Rovo is connected) remain available if a project prefers them.

## Notes
`<anything project-specific: known brand quirks, accessibility exceptions already signed off, etc.>`
