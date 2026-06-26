---
description: Run the autonomous Figma -> OutSystems design loop until the goal in loop/goal.md is met. Supports single-screen and full-library mode.
---
Run the design loop, governed by this project's CLAUDE.md and the outsystems-* skills.

Read `loop/goal.md` (goal, Figma URL, mode, scope, checkpoints, caps) and `loop/state.json` (queue + progress).

## Phase 0 — Tokens (library mode, runs once)
If `state.json.items` is empty and mode is "library":
1. Pull the full Figma library via Figma MCP. Extract the ENTIRE token set (color, spacing, type, radius, shadow, motion).
2. Reconcile against tokens/*.css: classify each as new / changed / off-scale / removed. File token-drift findings (design-token bugs) for anything off-scale or ambiguous.
3. Run `npm run build:theme` to produce dist/theme.css.
4. Seed `state.json.items[]` from the audit, each tagged with its `tier` (foundations|primitives|composites|patterns), `level` (L1-L5), `node` (Figma node id), status "todo".
5. Create/checkout the branch from goal.md. Then honor the `after_tokens` checkpoint: if "pause", write loop/REPORT.md (token summary + findings) and STOP for sign-off.

For single mode: seed the queue from a normal Phase 1 audit; skip tiers/checkpoints.

## Per-item loop (repeat until done-criteria or a cap/checkpoint)
1. Pick the next "todo" item in dependency order: never start a tier until the previous tier is fully "built"/"needs-human"; within a tier, build primitives a composite depends on first.
2. Delegate to @maker to implement it. The maker returns a self-declared RISK-TIER and a DECISION-LOG.
3. Delegate to @checker to validate. The checker runs a deterministic gate FIRST (`npm run build:theme` exit 0 + schema/contrast), scales depth to the item's risk tier, and adversarially challenges every finding before confirming it. It returns VERDICT, RISK-TIER, DET-GATE, CONFIDENCE, CRITIQUE, FINDINGS-CONFIRMED, FINDINGS-CHALLENGED-OUT, DECISION-LOG.
   - DET-GATE: fail -> this is a build break, not a design miss. Feed the breakage to @maker to fix; log it as `det_gate: fail` but do NOT count it against `max_rounds_per_item` the same way a fidelity FAIL does (a broken build is mechanical, fix and re-run).
   - PASS -> record `risk_tier`, `det_gate: pass`, `confidence`, and `decision_log` (maker + checker) on the item in state.json; status "built"; commit on the loop branch (outsystems-git-helpers message); ensure the component's GitHub issue exists (dedup: search for `[node:<id>]`; create only if absent) as type Component/handover; include the DECISION-LOG in the handover doc inside a collapsed `<details>` ("Why / alternatives ruled out"); add it to the GitHub Project (`gh project item-add <num> --owner <owner> --url <issue-url>`); attach to the tier's handover epic as a sub-issue (`gh issue edit <child> --parent <epic>`); update the Style Guide page.
   - FAIL (subjective) -> feed the CRITIQUE to @maker, increment the item's round counter; if over caps.max_rounds_per_item, status "needs-human" with the critique, move on.
4. Findings — file ONLY what survived the checker's challenge:
   - For every FINDINGS-CONFIRMED: dedup by `[node:<id>]`, then file a GitHub Bug (type Bug + labels finding,bug,<type>,sev:*), add it to the Project, set `disposition: filed`. NEVER resolve a brand/a11y conflict.
   - For every FINDINGS-CHALLENGED-OUT: record it in findings/findings-register.md as `disposition: not-reproduced` with the checker's usage evidence and `challenged_by: round <n>`. Do NOT open a bug. This is the false-positive filter — a refuted finding never reaches a human's triage queue.
5. Persist state.json after every item; increment iteration. Keep the per-item `rounds`, `risk_tier`, `det_gate`, `confidence`, `decision_log`, and per-finding `disposition` so the run's Review metrics can be computed.

## Tier boundaries
When a tier completes: run a CONSISTENCY PASS (do all components in the tier use tokens uniformly? naming consistent? no divergent one-offs? record result in consistency_passes[]). Then honor that tier's checkpoint (pause -> REPORT + STOP for sign-off; continue -> next tier).

## Stop
Stop when all items are "built"/"needs-human" (set status "done"), or iteration >= caps.max_global_iterations, or a checkpoint says pause, or a blocking finding needs a human.

## Headless one-step mode
When invoked to advance one step (from loop/run.sh), do exactly ONE item (or ONE phase-0/tier-boundary action), persist state, and exit.

## Report
Always end a run by writing loop/REPORT.md: tier progress, items built, Project URL, handover epics + sub-issues, bugs filed (links), needs-human items, consistency-pass results. Also write a `## Review metrics` section so review coverage is visible run-over-run:
- items auto-passed vs needs-human (review coverage)
- findings filed vs challenged-out (false-positive rate)
- checker rounds distribution (round-1-pass rate)
- risk-tier coverage (how many `core` items got full-stack depth)
- deterministic-gate pass rate
Do NOT touch OutSystems — integration is manual via the handover sub-issues.

$ARGUMENTS
