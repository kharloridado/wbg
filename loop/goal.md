# Loop Goal — The Loop Design System

## Goal
Translate the Figma library into OutSystems faithfully, tier by tier. For **every** audited component, the loop decides one of three outcomes and produces the matching artifacts:

| Audit class | Outcome | Artifacts the loop generates |
|---|---|---|
| ✅ **Exists as-is** | Use OutSystems UI OOTB | None (just verify it matches Figma within tolerance; if it doesn't, it's really 🎨) |
| 🎨 **Exists, not exact** | **Dual-track** | (1) *Alignment track* — L1–L3 overrides (token / utility / `ExtendedClass`+BEM) so the OOTB component renders **close to Figma** for any dev who reaches for it; (2) *Canonical track* — the custom Block / Web Component (L4–L5) the team actually ships |
| 🆕 **Doesn't exist** | Build custom | Web Component (L5) + Block wrapper. Canonical. |

The dual-track on 🎨 is deliberate: the **custom** is the team default, but devs who grab the stock OutSystems UI component still land near the Figma intent instead of something visibly off-brand.

> **"Customize OutSystems UI" never means editing/forking the OutSystems UI module.** It means overrides through `:root` tokens, utility classes, `ExtendedClass`+BEM, or a wrapping Block — upgrade-safe layers on top.

## Figma
- URL: [The Loop — Main Library](https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?m=auto&t=Nn0446OIuqhWPaxx-1)

## Mode & this run
- **Mode:** `library` — full design system, dependency-ordered, tier-by-tier, with human gates.
- **This run:** **Phase 0 (tokens) only.** Hard stop at the Phase 0 checkpoint. No component work executes this run.

## This run — Phase 0 scope
- [ ] Extract the **full** token set from Figma (every collection / variable / mode) via Figma MCP.
- [ ] Reconcile against current `rnt-connect-theme` (`dist/theme.css`); log **every** drift as a token-drift finding (GitHub Bug).
- [ ] Compute contrast for every color pair the tokens define; flag failures as findings — **never re-shade to pass**.
- [ ] Regenerate the theme via `build:theme` (lightningcss) → flat `dist/theme.css`; confirm the three-layer fallback chain (tint contract → R&T semantic alias → Figma hex) resolves.
- [ ] Put the token set + Findings Register on the GitHub Project board.

## Standing scope (full program — later runs, after sign-off)
- [ ] Audit every component; assign each an **escalation level (L1–L5)** = how it gets built.
- [ ] Build in **tier / dependency order** (foundations → primitives → composites → patterns) — never build a composite before its primitives.
- [ ] Produce dual-track artifacts for 🎨 components; custom build for 🆕.
- [ ] File findings as **GitHub Bugs** (flag-don't-fix).
- [ ] Add every deliverable (component + finding) to the GitHub Project board.
- [ ] One **epic per tier**, **sub-issue per component**, handovers filed as GitHub **Tasks assigned to me**.
- [ ] Update the Live Style Guide per tier.

## Build model — two independent axes (don't conflate)
- **Tier** = position in the dependency graph → sets **build order**: foundations (tokens, this Phase 0) → primitives → composites → patterns.
- **Escalation level (L1–L5)** = implementation approach → sets **effort**: L1 token / L2 utility / L3 `ExtendedClass`+BEM / L4 custom Block / L5 Web Component.
- A single component has **one tier** and **one level** (L1–L5). The alignment track of a 🎨 component may add a *second, lower* level (e.g., L2/L3 OOTB override) alongside its canonical L4/L5 build.

## Checkpoints (human gates — critical at library scale)
- **After Phase 0 tokens → PAUSE for designer / brand-owner sign-off.** A wrong token cascades into every component. *(This run ends here.)*
- After primitives → PAUSE. Highest-reuse components; lock them before composites build on them.
- After composites → continue.

## Done-criteria
**This run (Phase 0):** full token set extracted, every drift reconciled-or-flagged, contrast computed, `build:theme` compiles to `dist/theme.css`, token set + findings on the board → then **hard stop at the sign-off gate**.

**Program (full library):** every audited component is either **built** (maker + checker PASS + committed + on the Project board + handover Task opened) or **needs-human** (logged with the blocker). All findings filed as Bugs. A consistency pass has run per tier.

## Checker gates (Phase 0)
Token schema valid · `build:theme` exits 0 · no unresolved drift without a finding · contrast computed for every defined pair · fallback chain resolves.

## Caps (guardrails)
- max maker/checker rounds per item: **3**
- max global iterations: **500** (raise for very large libraries)
- branch: `loop/<yyyy-mm-dd>-design-system` *(add a phase suffix on re-runs to avoid collisions)*
- the loop **never applies changes to the live OutSystems environment** and **never resolves a finding** — it produces artifacts handed over as GitHub Tasks for a human to add in ODC Studio
- the loop **never edits/forks the OutSystems UI module** — overrides only (tokens / utility / `ExtendedClass` / wrapping Block)
- findings = GitHub **Bug** (Bug type + `bug` label); handovers = GitHub **Task** (assigned to me)
- **dedup:** every issue carries `[node:<figma-node-id>]` in its body; **search before create** to avoid duplicates on re-runs

## Open decisions (confirm before primitives)
1. **Dual-track scope:** every 🎨 component, or only when the OOTB-vs-Figma delta exceeds a threshold? (Default: build both tracks; let the alignment track be skippable per-component when delta is trivial.)
2. **Tier taxonomy:** confirm the primitives / composites / patterns boundaries for The Loop (foundations = these Phase 0 tokens).
3. **Branch reuse** across multiple runs on the same date.