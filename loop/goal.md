# Loop Goal

## Goal
Extract and reconcile the FULL WBG token set from The Loop — Main Library into OutSystems-ready `dist/theme.css` (Phase 0), file token-drift findings, then PAUSE for brand-owner sign-off before any component is built.

## Figma
- URL: [The Loop — Main Library](https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?m=auto&t=Nn0446OIuqhWPaxx-1)
- In scope: entire library — ALL published variables/tokens (color, spacing, type, radius, shadow, motion). Phase 0 only this run; component tiers are seeded but NOT built (paused at after_tokens checkpoint).

## Mode
- `library` — full design system: dependency-ordered, tier-by-tier, with checkpoints. **This run: Phase 0 (tokens) only, then pause.**

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
