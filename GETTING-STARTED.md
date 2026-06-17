# Getting Started — Starting a New Project

How the team spins up a new OutSystems frontend project from this template and runs the Figma → OutSystems loop. Three sections: one-time per developer, one-time to publish the template, and the per-project steps.

---

## A. One-time per developer (do once on your machine)

1. **Claude Code** — `npm install -g @anthropic-ai/claude-code` (see docs.claude.com/claude-code for current install).
2. **GitHub CLI** — install `gh`, then `gh auth login` (needed for findings bugs + handover tasks on private repos).
3. **Node.js** — required for the lightningcss `build:theme` pipeline.
4. **Figma MCP** — connect the Figma connector in Claude Code so the loop can read designs.
5. **jq** — used by `loop/run.sh` for reading state (`brew install jq` / `apt install jq`).

---

## B. One-time — publish this template to GitHub (a lead does this once)

1. Unzip the template and `cd` into it.
2. Initialize and push it as a private repo:
   ```bash
   git init && git add -A && git commit -m "chore: initial OutSystems project template"
   gh repo create <org>/outsystems-project-template --private --source=. --push
   ```
3. **Mark it as a template:** on GitHub → the repo → **Settings → General →** check **"Template repository"**. (A "Use this template" button now appears on the repo home, plus a `/generate` URL.)
4. Optional but recommended: give the template a `CODEOWNERS` and a CHANGELOG, and have a "Templates" owner review changes so the standard stays consistent.

> Remember: files travel with the template (including the `.github/ISSUE_TEMPLATE/*` forms and the `.claude/` loop config). Labels and branch protection do **not** — those are set per new repo in step 3 below.

---

## C. Per-project — every new engagement

### 1. Create the project repo from the template
**UI:** open `outsystems-project-template` on GitHub → **Use this template → Create a new repository** → name it `<customer>-<project>` → **Private** → Create.

**CLI:**
```bash
gh repo create <org>/<customer>-<project> --private \
  --template <org>/outsystems-project-template --clone
cd <customer>-<project>
```

### 2. Create the finding/handover labels (labels don't copy from templates)
```bash
./.github/setup-finding-labels.sh <org>/<customer>-<project>
```

### 3. Fill in the project placeholders
- `project-context.md` — customer, project, repo, brand owner (who findings go to), and `findings.ticket_target = <org>/<customer>-<project>`.
- `CLAUDE.md` — confirm prefix (`rnt-`), environment (ODC), and the findings/handover routing block.

### 4. Add the brand source of truth
- `design/brand-guidelines.md` — the brand palette, type scale, spacing, signed-off exceptions.
- `design/figma-links.md` — the Figma file URLs + node ids.

### 5. (Optional) seed tokens + install build deps
```bash
npm install                 # lightningcss
# edit tokens/colors.css, spacing.css, typography.css — or let the loop's audit propose them
```

### 6. Set the loop goal
Edit `loop/goal.md`: the one-sentence goal, the Figma URL, the in-scope frames/nodes, and the branch name (`loop/<yyyy-mm-dd>-<slug>`).

### 7. Run the loop
**Watch it first (recommended for the first run):** open Claude Code in the repo and run
```
/design-loop run until the goal in loop/goal.md is met
```
**Unattended once you trust it:**
```bash
./loop/run.sh 40
```
The loop audits the Figma file, then per component: `@maker` builds → `@checker` judges → on PASS it commits on the loop branch, opens a handover **Task assigned to you**, and updates the Style Guide. Findings are filed as GitHub **bugs** (never auto-fixed).

### 8. Triage and integrate (the human part)
- **Findings (bugs):** review with the designer / brand owner. Each is "flag-don't-fix" — they decide to adjust the design, accept the deviation, or waive it.
- **Handover tasks (assigned to you):** open each, follow the OutSystems install checklist (paste Theme CSS, import the Web Component as a Script resource, build the Block), then **1-Click Publish and validate in a real browser** at all breakpoints. Never trust Service Studio Preview for Web Components.
- View everything on a **GitHub Project board** (kanban) over the repo if you want a single status view.

### 9. Wrap up
Push the loop branch and open a PR. `loop/REPORT.md` summarizes what was built, the bugs filed, and any items marked `needs-human`.

---

## Done-criteria

A run is "done" when every audited component is either **built** (maker built it + checker passed + committed + handover task opened) or **needs-human** (logged with the blocker), and all findings are filed as bugs. Final OutSystems integration is always manual — by design.
