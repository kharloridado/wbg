# Loop Engineering — Figma → OutSystems

A bounded, autonomous maker/checker loop that runs in **Claude Code**. Set a goal + Figma URL, let it run until every component is built and handed over (or flagged for a human).

## Pieces

- `loop/goal.md` — you fill this in: the goal, Figma URL, scope, done-criteria, caps.
- `loop/state.json` — the loop's memory: work queue, per-item status/rounds, findings, handovers. Resumable.
- `.claude/commands/design-loop.md` — the orchestrator procedure (`/design-loop`).
- `.claude/agents/maker.md` — builds one artifact faithfully (uses the outsystems-* skills).
- `.claude/agents/checker.md` — independently judges it (fidelity / token-only / BEM / a11y flag-don't-fix). Separate context = real critique.
- `.claude/settings.json` — scoped tool permissions so unattended runs don't prompt, a destructive-command deny-list, and an edit-logging hook. No `--dangerously-skip-permissions`.
- `loop/run.sh` — the external bounded loop (one item per call, until done or cap).

## Setup (once per project)

1. Fill in `loop/goal.md` (goal sentence + Figma URL + branch name + `mode`).
2. Confirm the Figma MCP is connected in Claude Code, and `gh` is authed on the repo.
3. Run the label setup once: `./.github/setup-finding-labels.sh <owner>/<repo>`.
4. For the GitHub Project board: `gh auth refresh -s project` (one-time scope), then
   `./.github/setup-project.sh <owner> <owner>/<repo> "Design System v1"`. Record the project number/owner in `loop/state.json.project`.

## Library mode (entire design system)

Set `mode: library` in `goal.md`. The loop then runs differently from single-screen mode:

- **Phase 0 — tokens first.** Extracts and reconciles the FULL token set, builds `theme.css`, files token-drift bugs, then PAUSES for designer sign-off. Nothing is built on unreviewed foundations.
- **Dependency-ordered, tier by tier.** foundations -> primitives -> composites -> patterns. A composite is never built before the primitives it contains.
- **Checkpoints.** Hard human gates after tokens and after primitives (configurable in `goal.md`).
- **Deliverables land in the GitHub Project.** Every component + finding becomes an issue added to the board; handovers are grouped into one epic per tier with a sub-issue per component (so you pull a family at a time, not 200 flat tasks).
- **Consistency pass per tier.** Catches drift per-item checks miss (uniform token usage, naming, no one-offs).
- **Dedup on re-runs.** Every issue carries `[node:<figma-node-id>]`; the loop checks before creating, so resuming never duplicates.

Reality check: a full library is hundreds of maker/checker rounds — real time and token cost. Run it unattended (`./loop/run.sh 500`) overnight, use the tier checkpoints as natural batch boundaries, and resume freely (state is durable). It is not instant and not free; the caps and checkpoints keep it bounded and reviewable.

## Run it — three modes

**A. In-session (start here).** Open Claude Code in the project and say:
```
/design-loop run until the goal in loop/goal.md is met
```
Claude audits the Figma file, seeds the queue, then loops maker → checker → commit + handover per component, filing bugs as it goes. You watch it work and can interrupt.

**B. Unattended bounded loop (the "set it and walk away" mode).**
```
./loop/run.sh 40        # advance up to 40 items; resumable
```
Each iteration runs Claude Code headless (`claude -p`) to advance exactly one item and persist state, stopping when `state.json.status == "done"` or the cap is hit. Cron-able.

**C. Cloud routines (laptop closed) — best for long or recurring runs.** Schedule the loop on Anthropic's cloud via `claude.ai/code/routines` or `/schedule`, on a cadence or a webhook. See `loop/ROUTINES.md` for ready-to-paste routine definitions (token-drift reconciliation, nightly loop-advance, findings digest). Routines respect the same checkpoints and `.claude/settings.json` guardrails — they advance work and report; you approve the gates.

## What it does / doesn't do

Does: audit, build (tokens / BEM CSS / Web Components), self-check, commit on a loop branch, file findings as GitHub **bugs**, open a handover **Task assigned to you** per artifact, update the Style Guide, write `loop/REPORT.md`.

Doesn't (by design): resolve a finding (flag-don't-fix — a designer/brand owner decides) or touch OutSystems (you integrate via the handover tasks). "Everything done" = everything up to the OutSystems handover.

## Guardrails

- Bounded: `max_rounds_per_item` (default 3) and `max_global_iterations` (default 40) in `goal.md`/`state.json`.
- Runs on a dedicated branch (`loop/<date>-<slug>`); the checker gates every commit.
- Scoped permissions + destructive-command deny-list in `.claude/settings.json`.
- Resumable: re-run `run.sh` (or `/design-loop`) and it picks up from `state.json`.
- Human exits: any item the checker can't pass within the round cap becomes `needs-human` with the critique, instead of looping forever.
