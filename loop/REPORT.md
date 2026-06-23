# Design Loop — REPORT

**Run:** 2026-06-23 · **Mode:** library · **Branch:** `claude/components-tab-build-dw66k0`
**Status:** ▶️ composites in progress — Tabs delivered; remaining queue blocked on Figma node ids.

## This iteration (4)
1. **Tabs (#49) — BUILT, checker PASS.** Restyle of the **native OutSystems UI Tabs pattern**
   as The Loop's underlined "Lift Tabs" bar (no parallel class system, no JS):
   - Pattern → `.tabs` › `.tabs-header[role=tablist]` › `.tabs-header-item[role=tab]` (`+ .active`)
     › `.tabs-header-item-content`, with `.tabs-content` › `.tabs-content-item`.
   - Figma: page "⤵ ✅ Tab & Tab Group" [node 18672-2679]; tab bar "-loop tab / group"
     [node 18683-4865] (node id supplied by user 2026-06-23).
   - **Scope = the tab BAR** shown in the Desktop/Tablet/Mobile examples; the standalone pill
     "tab item" chip [node 18672-2680] is out of scope for this build.
   - Bar = bold text tabs (Open Sans 700 / 20px) 24px apart on a full-width subdued hairline
     divider (`#00396b14`); enabled label Link Primary blue-70; **active** = emphasis blue-90
     + persistent 2px Blue/40 underline; **hover** previews that underline; **disabled** subdued
     + not focusable; **focus** = 2px Blue/50 brand ring; reduced-motion honoured.
   - Size step: XLarge 20px (desktop default) → Large 18px (`.tabs--large` via ExtendedClass).
   - Token-only, BEM, `loop-` prefix. New tokens `--loop-tab-*` in `tokens/component-tab.css`;
     theme sections added to `build/build-theme.mjs` META (Components / Tabs + Widget Overrides / Tabs).

## Checker
Round 1 FAIL → the cited findings FND-033/FND-034 were not yet logged (CSS itself fidelity-correct).
Round 2 **PASS** after logging both findings (no CSS change). All `--loop-tab-*` tokens resolve in
`dist/theme.css`; no hard-coded values; `npm run build:theme` exits 0 (1 :root, 15 token sections,
17 class sections).

## Findings filed (flag-don't-fix — NONE resolved)
- **FND-033** (design-token, low, register-only) — Tabs label `letter-spacing -0.13px` off the
  `-0.35`/`-1.5` tracking scale; `line-height 20px` equals font-size (ratio 1.0).
- **FND-034** (a11y/contrast, medium, register-only) — Tabs active/hover underline `Blue/40 #169af3`
  ≈ 3.02:1 on white (2px graphical indicator on the 3:1 SC 1.4.11 floor; cf. FND-011).
Both below the `findings.gate = high+` → register-only (no GitHub Bug opened, matching FND-013…032).

## Board / handover
- Handover doc `handover/loop-tabs.md` (CSS embedded via `node build/embed-handover-code.mjs`).
- Handover Task + Project #1 board entry: see this iteration's commit/issue.

## Needs-human (to advance further)
The rest of the to-build queue (#39 Search, #40 Date Picker, #41 Upload, #42 Alert, #43 Toast,
#44 Badge, #47 Progress Bar, #48 Card, #50 Accordion, #51 Modal, #52 Breadcrumbs, #53 Pagination,
#54 Avatar) carries **no Figma node ids**. Provide node ids — and for provider/JS patterns the
rendered OutSystems HTML — to continue. `after_composites` checkpoint = continue.
