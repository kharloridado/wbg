# Routines — Cloud Scheduling for the Loop

[Claude Code Routines](https://claude.ai/code/routines) run the loop on Anthropic's cloud on a schedule or webhook — your laptop can be off. Create them at `claude.ai/code/routines` or with `/schedule` in the CLI; attach this repo + your Figma connector. (Research preview, all paid plans.)

These are the cloud-native counterpart to `loop/run.sh`. Same loop, same `.claude/settings.json` guardrails — no local machine required.

> **Checkpoints still rule.** Every routine below is told to STOP at the human gates in `loop/goal.md`. A routine never auto-approves foundations or primitives. It advances work and reports; you approve.

---

## 1. Token-drift reconciliation  (highest value — recurring forever)
**Trigger:** weekly (Mon 06:00) + webhook on Figma "library published".
**Prompt:**
```
Re-pull the Figma library at <FIGMA_LIBRARY_URL> via the Figma MCP. Extract the full
token set and reconcile against tokens/*.css: classify each token new / changed /
off-scale / removed. For any drift, file a design-token bug (type Bug, labels
finding,bug,token), dedup by a [token:<name>] marker in the body. Run
`npm run build:theme`. If tokens changed, open a PR "chore(tokens): reconcile design
tokens" on a fresh branch and summarize the drift in the PR body — do NOT merge, do
NOT rebuild components. End with a 5-line summary.
```

**Webhook wiring:** the routine has its own endpoint + token. Point a Figma webhook (or middleware like Zapier) at it so a library publish POSTs the endpoint and triggers a reconcile.

---

## 2. Nightly loop-advance  (while a library build is in progress)
**Trigger:** nightly (02:00).
**Prompt:**
```
Follow .claude/commands/design-loop.md for this repo. Advance the design-system loop
by up to 15 items tonight, in dependency order. RESPECT every checkpoint in
loop/goal.md — if you reach a checkpoint marked "pause", STOP immediately, write
loop/REPORT.md, and do not proceed past it. Persist loop/state.json; commit on the
loop branch and push; ensure new deliverables are on the GitHub Project; open handover
sub-issues under the tier epic; file findings as bugs. Do NOT touch OutSystems. End by
writing a short summary to loop/REPORT.md.
```

---

## 3. Findings digest  (visibility)
**Trigger:** daily (08:00).
**Prompt:**
```
List open issues labeled "finding" in this repo, grouped by severity. Write a short
digest: counts per severity + the blocker/high titles with links. Post it to the team
Slack channel (GitHub Slack app) or, if unavailable, append it to loop/REPORT.md.
Make NO changes to any issue.
```

---

## Which scheduler for which job

- **Routines (cloud):** the loop, token reconciliation, digests — anything that should run with your laptop closed. Start here.
- **`/loop` (in-session):** quick "watch this for the next hour" while you're actively working. Dies when the session ends.
- **`loop/run.sh` (local):** manual unattended runs when you specifically want local execution / local logs.

## Cost note
Routines consume usage; heavy multi-step runs cost more. Prefer nightly/weekly over hourly, let the tier checkpoints bound each run, and test a couple of runs to learn the usage profile before setting an aggressive cadence.
