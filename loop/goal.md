# Loop Goal

## Goal
<one sentence — e.g. "Implement the entire R&T Connect design system library as OutSystems-ready code.">

## Figma
- URL: <figma library url>
- In scope: <"entire library" | specific pages/frames/node ids>

## Mode
- `single`  — one screen / a few components (flat queue)
- `library` — full design system: dependency-ordered, tier-by-tier, with checkpoints  ← set this for the scenario

## Scope
- [ ] Phase 0: extract + reconcile the FULL token set (token-drift findings), build theme.css
- [ ] Audit every component; order by tier (foundations -> primitives -> composites -> patterns)
- [ ] Build L1–L5 artifacts, dependency-aware (don't build a composite before its primitives)
- [ ] File findings as GitHub bugs (flag-don't-fix)
- [ ] Add every deliverable (component + finding) to the GitHub Project board
- [ ] Group handovers into one epic per tier, sub-issue per component, assigned to me
- [ ] Update the Live Style Guide per tier

## Checkpoints (human gates — critical at library scale)
- After Phase 0 tokens: PAUSE for designer/brand-owner sign-off (a wrong token cascades into every component)
- After primitives: PAUSE (highest-reuse components; get them right before composites build on them)
- After composites: continue

## Done-criteria
Every audited component is "built" (maker + checker PASS + committed + on the Project board + handover sub-issue opened) or "needs-human" (logged with the blocker). All findings filed as bugs. A consistency pass has run per tier.

## Caps (guardrails)
- max maker/checker rounds per item: 3
- max global iterations: 500 (raise for very large libraries)
- branch: loop/<yyyy-mm-dd>-design-system
- the loop NEVER edits OutSystems and NEVER resolves a finding
- dedup: every issue carries [node:<figma-node-id>] in its body; check before creating to avoid duplicates on re-runs
