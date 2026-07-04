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
2. SNAPSHOT REF (orchestrator only — subagents have no Figma MCP): ensure `loop/refs/<item-id>/` exists with `spec.md` (get_design_context of the item's `node`), `variables.json` (get_variable_defs), and `figma.png` (get_screenshot). If missing, pull it now and set the item's `ref` field in state.json. If the item has no `node` id, or Figma MCP is unavailable and no ref is saved, set status "needs-human" (reason: no ref) and move on — NEVER build without a frozen ref.
3. Delegate to @maker to implement it (point it at `loop/refs/<item-id>/` as the spec of record).
4. Delegate to @checker to validate (it judges against `loop/refs/<item-id>/`, never live Figma).
   - PASS -> run the VISUAL CHECK (step 5), then on visual pass: status "built"; commit on the loop branch (outsystems-git-helpers message); ensure the component's GitHub issue exists (dedup: search for `[node:<id>]`; create only if absent) as type Component/handover; add it to the GitHub Project (`gh project item-add <num> --owner <owner> --url <issue-url>`); attach to the tier's handover epic as a sub-issue (`gh issue edit <child> --parent <epic>`); update the Style Guide page.
   - FAIL or BLOCKED -> feed the CRITIQUE to @maker (BLOCKED = re-run step 2 first), increment the item's round counter; if over caps.max_rounds_per_item, status "needs-human" with the critique, move on.
5. VISUAL CHECK (orchestrator only — needs Chrome MCP): render the component's section of `preview/index.html` in Chrome, screenshot it, and compare side by side against `loop/refs/<item-id>/figma.png`. Judge layout, spacing, type, color, and states visible in the ref. Record `visual: pass|fail|skipped` on the item in state.json (skipped only if Chrome MCP is unavailable — say so in the report). On visible mismatch: treat as a checker FAIL — feed the observed differences to @maker and increment the same round counter.
6. For every finding: dedup by `[node:<id>]`, then file a GitHub Bug (type Bug + labels finding,bug,<type>,sev:*), add it to the Project. NEVER resolve a brand/a11y conflict.
7. Persist state.json after every item; increment iteration.

## Tier boundaries
When a tier completes: run a CONSISTENCY PASS (do all components in the tier use tokens uniformly? naming consistent? no divergent one-offs? record result in consistency_passes[]). Then honor that tier's checkpoint (pause -> REPORT + STOP for sign-off; continue -> next tier).

## Stop
Stop when all items are "built"/"needs-human" (set status "done"), or iteration >= caps.max_global_iterations, or a checkpoint says pause, or a blocking finding needs a human.

## Headless one-step mode
When invoked to advance one step (from loop/run.sh), do exactly ONE item (or ONE phase-0/tier-boundary action), persist state, and exit. Interactively-authenticated MCPs (Figma, Chrome) are typically ABSENT headless: fidelity checking still works because it reads the pre-saved `loop/refs/<item-id>/` snapshot; items with no saved ref go "needs-human" (snapshot them in an interactive session); the visual check records `skipped`.

## Report
Always end a run by writing loop/REPORT.md: tier progress, items built, Project URL, handover epics + sub-issues, bugs filed (links), needs-human items, consistency-pass results. Do NOT touch OutSystems — integration is manual via the handover sub-issues.

$ARGUMENTS
