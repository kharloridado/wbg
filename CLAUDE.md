# CLAUDE.md — Project Rules

> Copy this whole folder for each new project, then fill in the placeholders below. This file tells Claude how to work on **this** project. It pairs with `project-context.md` (the values) and the installed OutSystems skills (the behavior).

## Project

- **Customer:** `World Bank Group`
- **Project:** `WBG`
- **Environment:** ODC (default) — change if O11
- **Class prefix:** `loop-`
- **Spacing base:** unconfirmed — grid spec TBD (do **not** flag values as "off the 4pt grid"). Scale extracted from Figma (`tokens/spacing.css`, descriptive `tiny`…`xhuge`); most steps are multiples of 4 but this is not a confirmed rule. See the 2026-06-16 Live Style Guide sync ("final grid spec not yet confirmed").
- **Token style:** OutSystems UI standard conventions
- **CSS methodology:** BEM (`block__element--modifier`)
- **Custom components:** vanilla JS Web Components wrapped in OutSystems Blocks
- **Accessibility target:** WCAG 2.2 AA — **fidelity-first**

## The one rule that matters most here

**Build the design exactly as specified. Never silently change a brand color, value, or token to satisfy accessibility or to "tidy" the design.** When the design conflicts with accessibility, brand, or token rules, implement it faithfully and raise a **finding** (see `findings/`). The finding carries the recommendation back to design; the code stays true to the mockup until design responds or the brand owner signs off.

Implementation-level accessibility that does NOT change the visual design — focus rings in the design's own colors, keyboard handlers, ARIA, semantic HTML, reduced-motion, labels — is applied automatically.

## Findings routing (used by the `outsystems-design-findings` skill)

```
findings.ticketing     = github            # default; alternatives: notion | jira
findings.ticket_target = <owner/repo>       # + optional GitHub Project name
findings.slack_channel = <#channel | none>  # GitHub Slack app or Slack connector
findings.gate          = high+              # high+ opens issues + notifies; medium/low batch to the register
```

Findings become **GitHub Issues filed as Bugs** (Bug issue type + `bug` label) in the project repo, created via `gh` from Claude Code (works on the private repo, no MCP). Labels: `finding` + `bug` + type (`a11y`/`brand`/`token`/`consistency`) + `sev:*`. A structured issue form lives at `.github/ISSUE_TEMPLATE/finding.yml`. The local register mirror is `findings/findings-register.md`; payloads are written to `findings/tickets/`.

## Code handover (this dev works mainly in OutSystems)

Generated code (CSS, Web Component `.js`, Block instructions) is **not** the end of the chat — it is handed over as a **GitHub issue filed as a Task and assigned to the developer**, so they add it into OutSystems themselves. Label `handover` + `task`; form at `.github/ISSUE_TEMPLATE/handover.yml`; example body in `handover/`.

**Rule: the handover ticket must CONTAIN the JS/CSS to copy into ODC — not just point at a repo path.** Every `handover/*.md` carries a `## Code to paste into ODC` section with the verbatim artifact(s) in a collapsed `<details>` block (source path in the `<summary>`). Tokens travel via `dist/theme.css` (its own paste) so they aren't duplicated there. Embed only what the developer hand-places: block CSS overrides and Web Component `.js`. The blocks are generated from source by `node build/embed-handover-code.mjs` (idempotent) — re-run it after editing a source file, and add new handovers to its `MAP`.

```bash
gh issue create --title "[handover] <component> — add in OutSystems" \
  --body-file handover/<artifact>.md --label "handover,task" --type "Task" \
  --assignee @me --repo <owner/repo>
```

Both findings (bugs) and handovers (tasks) can live on the same GitHub **Project** board — a kanban view with a `Status` column you drag items across.

## Build pipeline

- Source tokens live in `tokens/` (`colors.css`, `spacing.css`, `typography.css`).
- `npm run build:theme` → `dist/theme.css` to paste into the ODC Theme editor.
  Assembled by `build/build-theme.mjs` (comment-preserving), which prepends an
  **OutSystems-UI-style Table of Contents + `#SECTION` banners** and keeps the
  source provenance/finding comments. **Rule: `dist/theme.css` must always carry
  this TOC + sectioning** — never ship a flat, comment-stripped theme. Section
  order follows the `@import` order in `tokens/index.css`; add a file's title to
  the `META` map in the build script when you add a new token file.
- `npm run watch:theme` for live rebuilds while iterating.
- `npm run build:theme:min` → `dist/theme.min.css` via lightningcss (optional
  minified build; strips comments, so NOT the file pasted into ODC).

### All commands

| Command | What it does |
| --- | --- |
| `npm install` | Install build deps (lightningcss-cli, sass). |
| `npm run build:theme` | Assemble `tokens/*.css` → `dist/theme.css` (commented, TOC'd, single `:root`). Paste into ODC. |
| `npm run watch:theme` | Same, rebuilding on token changes. |
| `npm run build:theme:min` | Minified `dist/theme.min.css` (not for ODC paste). |
| `npm run gen:color-utilities` | Generate `.background-*` / `.text-*` utility classes (`tokens/color-utilities*.css`). |
| `npm run gen:type-utilities` | Generate `.font-size-*` / `.font-weight-*` classes (`tokens/typography-utilities.css`). |
| `npm run gen:spacing-utilities` | Generate directional margin/padding classes (`tokens/spacing-utilities.css`). |
| `npm run build:osui` | Compile the vendored OutSystems UI submodule → `preview/vendor/outsystems-ui/outsystems-ui.css` (the preview's real OSUI base). |
| `npm run preview` | Zero-dep static server (port 8088) serving `preview/index.html` over http:// for the local component preview. |
| `node build/embed-handover-code.mjs` | Idempotently embed source CSS/JS into the `handover/*.md` "Code to paste into ODC" blocks. Re-run after editing a handed-over source file. |

The `gen:*` outputs are GENERATED — edit the generator in `build/`, not the emitted `tokens/*-utilities.css`. There is no separate test/lint step; the **`@checker` agent** is the validation gate (see below).

## Hard rules (inherited from figma-to-outsystems orchestrator)

1. Never edit the OutSystems UI module directly.
2. Never validate in Service Studio Preview alone — publish and test in a real browser.
3. Never hard-code design values — always `var(--token)`. If a value has no token, that's a `design-token` finding.
4. Never silently substitute a brand color/value/token for accessibility — flag it.
5. Never drop a finding to avoid friction — log it at minimum.
6. For custom components: vanilla JS Web Components only (no Lit/Stencil/React).
7. Never attach classes by mutating OutSystems UI internals — use `ExtendedClass`.

## Workflow

Hybrid: Claude.ai for design analysis + generation, Claude Code for Git operations on the private repo.

## Architecture map

The repo turns Figma designs into three OutSystems-pasteable artifacts: **theme tokens**, **block CSS overrides**, and **Web Component JS**. How they fit together:

**Token layering (`tokens/`).** `tokens/index.css` is the single `@import` manifest and the order is load-bearing:
primitives (`colors`, `spacing`, `typography`, `radius`, `border`, `shadows`) → semantic role layer (`semantic-colors.css`) → generated utility classes → per-component token files (`component-*.css`) → **OutSystems UI overrides LAST** (`outsystems-ui-overrides.css`, `-header`, `-alert`, `-feedback-message`) so their `:root` redefinitions win over the framework defaults. `build/build-theme.mjs` lifts every file's `:root` into ONE consolidated block, keeps comments, and prepends an OutSystems-UI-style TOC. When you add a token file: add it to `index.css` AND to the `META` map in `build-theme.mjs`.

**`src/` — two delivery shapes:**
- `src/blocks/*.css` — BEM `ExtendedClass` overrides that **restyle native OutSystems UI widgets** (button, dropdown, switch, text-field…). Prefer overriding native `.btn`/`.dropdown`/etc. classes over building parallel systems. These are handed over as paste-in CSS.
- `src/components/*.js` (+ matching `.css`) — vanilla JS **Web Components** for L5 builds that don't exist in OSUI (`loop-alert`, `loop-modal`, `loop-toast`, `loop-system-alert`, plus the Live Style Guide reference components `loop-*-reference.js`). No Lit/Stencil/React.

**Local preview (`preview/`).** `preview/index.html` is the Live Style Guide harness. Layer 1 is the **real** compiled OSUI CSS (`npm run build:osui`), layer 2 is `dist/theme.css`, layer 3 is the `src/` overrides + Web Components. Chrome must stay token-only and class-only (no inline styles / ad-hoc hex). Serve with `npm run preview`, then validate in a real browser — never trust Service Studio Preview for Web Components.

**The design loop (`.claude/` + `loop/`).** `/design-loop` (or `loop/run.sh`) drives an autonomous Figma→OutSystems loop defined by `loop/goal.md`. Per component: **`@maker`** builds one artifact faithfully → **`@checker`** independently validates (fidelity, token-only, BEM, Web Component correctness, accessibility flag-don't-fix) and returns PASS/FAIL. On PASS it commits, opens a handover Task, and updates the Style Guide. State is resumable via `loop/state.json`; `loop/REPORT.md` summarizes the run.

**The agentic-review gate (lean, single checker).** The `@checker` is the project's code review. It runs in this order — detail lives in `.claude/agents/checker.md`:
1. **Deterministic gate (hard wall):** `npm run build:theme` must exit 0 + schema/contrast resolve, *before* any subjective judgment. A broken build is an instant FAIL.
2. **Risk-tiered depth:** scrutiny scales to blast radius — `trivial` (utility/config) gets a glance, `core` (L5 Web Components, interactive composites) gets the full stack. Not a uniform gate.
3. **Adversarial finding challenge:** every finding (raised or suspected) must survive a refutation against *real rendered usage* before it's filed (the FND-011 pattern). Refuted ones are `not-reproduced` (register-only, never a bug). Never flag "off the 4pt grid" — the spacing base is TBD (the FND-005/013/018/022 false-positive class).
4. **Decision-log capture:** `@maker` and `@checker` emit their reasoning / alternatives ruled out / assumptions; these persist to `state.json` and the handover so the human reviewer isn't reconstructing intent.
5. **Review metrics:** `loop/REPORT.md` carries a `## Review metrics` block each run (auto-pass vs needs-human, findings filed vs challenged-out, rounds, tier coverage, det-gate pass rate).

**Two GitHub outputs.** Design conflicts become **findings** (Bug issues; mirrored in `findings/findings-register.md`, payloads in `findings/tickets/`). Generated code becomes **handovers** (Task issues; bodies in `handover/*.md` with the verbatim code embedded by `build/embed-handover-code.mjs`). Both routed via `gh` per the routing block above.

**`vendor/outsystems-ui/`** is the OSUI git submodule — the source of truth for real rendered widget DOM/SCSS when designing an override. Read it; never edit it.
