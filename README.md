# OutSystems Frontend Project Template

A reusable scaffold for every new OutSystems frontend engagement. Copy this folder, rename it, and fill in the placeholders.

> **New project? Follow `GETTING-STARTED.md`** — the step-by-step the team uses to spin up a project from this template and run the loop.

## Quick start

1. **Copy** this folder → `customer-project/`.
2. **Fill in** `CLAUDE.md` and `project-context.md` (customer, project, brand owner, findings routing).
3. **Drop brand assets** into `design/` — fill `brand-guidelines.md` with the palette, type scale, spacing, and `figma-links.md` with the frame URLs/node ids.
4. **Seed tokens** in `tokens/` (colors / spacing / typography), then `npm install` and `npm run build:theme`.
5. **Work the Figma → OutSystems workflow.** When the design conflicts with accessibility/brand/token rules, findings land in `findings/`.

## Folder map

```
.
├── CLAUDE.md              # project rules Claude follows (the flag-don't-fix rule lives here)
├── project-context.md     # customer/project/brand/findings-routing values
├── README.md              # this file
├── package.json           # lightningcss build:theme / watch:theme scripts
├── .gitignore
├── .github/
│   ├── ISSUE_TEMPLATE/finding.yml   # finding issue form (filed as Bug)
│   ├── ISSUE_TEMPLATE/handover.yml  # code-handover task form (assigned to you)
│   └── setup-finding-labels.sh      # one-time label taxonomy setup (gh)
├── .claude/                # Claude Code loop engineering
│   ├── agents/maker.md      # builds one artifact faithfully
│   ├── agents/checker.md    # independently judges it
│   ├── commands/design-loop.md  # the orchestrator (/design-loop)
│   └── settings.json        # scoped permissions + deny-list + logging hook
├── loop/                   # the autonomous loop
│   ├── goal.md              # you fill in: goal + Figma URL + caps
│   ├── state.json           # work queue + progress (resumable)
│   ├── run.sh               # external bounded loop (set-and-walk-away)
│   └── README.md            # how loop engineering works here
├── design/                # brand guidelines + Figma links = the source of truth
├── docs/
│   └── meetings/           # meeting summaries & notes (reference; distill decisions into the active files)
├── tokens/                # lightningcss source: colors.css, spacing.css, typography.css
├── src/
│   ├── components/         # vanilla JS Web Components (e.g. loop-toast.js / loop-modal.js)
│   └── blocks/             # OutSystems Block wrappers + ExtendedClass CSS (e.g. loop-button.css)
├── style-guide/           # Live Style Guide doc pages
├── handover/              # handover issue bodies for generated code (example included)
├── findings/              # design-conformance findings register + ticket payloads
│   ├── findings-register.md
│   └── tickets/
└── dist/                  # build output (gitignored) → theme.css to paste into ODC
```

## The findings workflow

This template bakes in the **flag-don't-fix** rule. The implementation always matches the approved design. When something in the design fails WCAG 2.2 AA, uses an off-palette color, or hard-codes a value with no token, it's logged in `findings/findings-register.md` and (for `high+`) opened as a ticket and posted to Slack — never silently changed. See `findings/README.md`.

## Build

```bash
npm install
npm run build:theme      # → dist/theme.css (flat, paste into ODC Theme editor)
npm run watch:theme      # rebuild on change while iterating
```
