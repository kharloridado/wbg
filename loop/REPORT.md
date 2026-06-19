# Design Loop — REPORT

**Run:** 2026-06-18 · **Mode:** library · **Branch:** `loop/2026-06-17-design-system`
**Status:** ▶️ composites in progress — Dropdown/Select delivered; remaining queue blocked on Figma node ids.

## This iteration
1. **State reconciliation.** `state.json` was stale at `primitives-delivered / pause` while later commits (8501fa3, eb83379) had already shipped the composites + utilities tiers. Reconciled to reality: status `composites-in-progress`, `utilities` tier added, 9 built items tracked (Tag, Tooltip, Notes, System Alert, Popover, segmented, color/type utilities), FND-012 added to the findings array.
2. **Dropdown / Select (#38) — BUILT, checker PASS.** Restyle of the two native OutSystems UI dropdown widgets (no parallel class system):
   - **Dropdown PATTERN** (single Select) — `.dropdown-container.dropdown` / `.dropdown-display` / `.dropdown-list` / `.dropdown-popup-row`.
   - **VirtualSelect PROVIDER** — `.osui-dropdown-search` (searchable single) + `.osui-dropdown-tags` (multi-select tag chips) → `.vscomp-*` DOM.
   - Figma: Select [node 18787-4817] + Multiselect [node 18830-17312]; rendered DOM in `outsystems-widgets-reference/widgets/dropdown*.md` (user-supplied 2026-06-18).
   - Field = `--radius-pill` pill / 13px / ~40px / 2px Blue/50 focus ring; popup list (white, 8px, low shadow); neutral tag chips (radius 48, `#f5f7f9`).
   - Token-only, BEM, `loop-` prefix. New tokens `--loop-select-*` / `--loop-multiselect-*` in `tokens/component-field.css`.

## Checker
Round 1 FAIL → finding-ID collisions (had reused FND-027/028/029, which belong to Tooltip/Tag) + a dead hex fallback + unapplied label size. Round 2 **PASS** after re-citing to FND-031/032, removing the fallback, and adding `.loop-field--select` (13px label). All 46 consumed tokens resolve in `dist/theme.css`; no hard-coded values; `npm run build:theme` exits 0.

## Findings filed (flag-don't-fix — NONE resolved)
- **FND-031** (consistency, low, register-only) — Select metrics diverge from Text Field & scale: pill `--radius-pill` 32px vs Text Field `--radius-medium` 8px; vpadding 11px off-grid; 13px text vs 16px.
- **FND-032** (design-token, low, register-only) — popup-list border `#dae1e8` (foreign lift token, no WBG primitive) substituted to `--color-outline-on-light-subdued`.
Both are low → register-only per `findings.gate = high+` (no GitHub Bug opened, matching FND-013…030).

## Board / handover
- Commit `5fc456e` on `loop/2026-06-17-design-system`.
- Handover Task **#66** (`[handover] Dropdown / Select`) created, assigned, added to Project #1.
- To-build issue **#38** commented + closed as completed.

## Needs-human (to advance further)
The rest of the to-build queue (#39 Search, #40 Date Picker, #41 Upload, #42 Alert, #43 Toast, #44 Badge, #47 Progress Bar, #48 Card, #49 Tabs, #50 Accordion, #51 Modal, #52 Breadcrumbs, #53 Pagination, #54 Avatar) carries **no Figma node ids**. Provide node ids — and for provider/JS patterns the rendered OutSystems HTML — to continue. `after_composites` checkpoint = continue.
