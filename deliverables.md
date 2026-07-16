# WBG Loop Design System — Deliverables (Single Source of Truth)

> This file is the canonical list of deliverables for the WBG Loop design system. It mirrors **GitHub
> Project #1** (`kharloridado/wbg` → "World Bank Live Style Guide"). The board is the live tracker; this
> file is the human-readable map. Keep them in sync.

## How we work (review-gated workflow)

The build order follows the categories below, top-down: **Foundation → Layouts → Form Control →
Messaging → Navigation**. Within OutSystems, we **restyle the native widget where OutSystems UI can
support it**, and only build a **vanilla JS Web Component** when it can't.

Each deliverable moves through the board's **Status** gate:

| Status | Meaning |
|---|---|
| **Backlog** | Not started (to-build) |
| **In Progress** | Claude is generating tokens / CSS / Web Component |
| **Needs Review** | Code generated + handover ready — **awaiting your review** |
| **In Review** | You are actively reviewing the generated code |
| **Reviewed** | You reviewed & left comments to implement — **Claude reads the card's comments, makes the changes, and opens a PR**; back to you to review again, then **Approved** |
| **Approved** | You reviewed & signed off — **this is what ships in the final `dist/theme.css` + blocks** |
| **Blocked** | Waiting on Figma node IDs or a designer (finding) decision |

**Rule:** only **Approved** items are treated as final/shipped. Claude generates and hands over; *you*
move an item to **Approved** after reviewing the code. Findings (design-conformance issues) are a
**separate track** — see `findings/findings-register.md`.

**The `Reviewed` lane:** when you've looked at an item and want changes, move its card to **Reviewed** and
leave the specifics as a **comment on the issue/card** (e.g. "tighten card padding", "wrong hover color").
On every **scheduled routine** run (and whenever you ask), Claude scans the **Reviewed** lane, reads each
card's comments, implements the changes, and **opens a PR** for you to review. After you review the PR you
move the item on to **Approved** (or back to **Reviewed** with more comments). Only **Approved** ships.

Status legend below: **Built** = exists in repo · **Partial** = variant of a built component, needs
verify/finish · **To build** = net-new.

---

## Foundation
| Deliverable | Status | Source |
|---|---|---|
| Typography | Built | `tokens/typography*.css` |
| Colors | Built | `tokens/colors.css`, `semantic-colors*.css` |
| Spacing | Built | `tokens/spacing*.css` |
| Borders | Built | `tokens/border.css`, `radius*.css` |
| Shadows | Built | `tokens/shadows*.css` |
| WBG Icons | Built | `vendor/fontawesome-6/` + `build/build-fontawesome.mjs` → `dist/fontawesome.css` (self-hosted **FA6 Pro** — solid · regular · light, ~3,323 icons, no brands, handover #137) · searchable reference `src/components/loop-icon-reference.js` + `loop-icon-data.js`, `handover/loop-icon-reference.md` (handover #138) |

## Layouts
| Deliverable | Status | Source |
|---|---|---|
| Layout Side | Built | `tokens/outsystems-ui-side.css`, `handover/loop-layout-side.md` |

## Form Control
| Deliverable | Status | Source |
|---|---|---|
| Badge Status | Built | `src/blocks/loop-badge-status.css` |
| Badge Label | Built | `src/blocks/loop-badge.css` |
| Button | Built | `src/blocks/loop-button.css` |
| Button Group / Switch | Built | `src/blocks/loop-button-group.css` |
| Button with Dropdown | Built | `src/components/loop-button-dropdown.js` |
| Button Text | Built | `src/blocks/loop-button-text.css` |
| Checkbox | Built | `src/blocks/loop-checkbox.css` |
| Date Picker | Built | `src/blocks/loop-datepicker.css` + year-grid WC |
| Date Range Picker | **To build** | (Flatpickr range mode) |
| Time Picker | **To build** | (Flatpickr time / OSUI Time Picker) |
| File Uploader | Built | `src/components/loop-file-uploader.js` |
| Field Wrapper (Text Field) | Needs Review | `handover/loop-field-wrapper.md` · `src/blocks/loop-text-field.css` · `src/components/loop-field-count.js` |
| Field Wrapper size + state cascade | Needs Review | `.loop-field--*` scales input/textarea/Search/Checkbox/Toggle inside; `--error/--warning/--disabled/--read-only` states · ref `loop/refs/cmp-field-sizing` (Figma 19336-9726 · 19336-17818 · 17191-8819 · 25862-14729) |
| Text Area (responsive) | Needs Review | `src/blocks/loop-text-field.css` (device steps) · tokens `--loop-textarea-*` · ref `loop/refs/cmp-text-area` (Figma 19336-10332) |
| Numeric Field | **To build** | (text-field variant) |
| Radio Button | Built | `src/blocks/loop-radio-button.css` |
| Search | Built | `src/blocks/loop-search.css` |
| Search Typeahead (= Dropdown Search) | **Won't ship** | Not shipping (decision 2026-07-07). VirtualSelect restyle removed from `loop-dropdown.css`; restore from git (commit 51969e8) if reinstated. |
| Select / Dropdown Native | Built | `src/blocks/loop-dropdown.css` (native single Select only) |
| Multi-select (= Dropdown Tags) | Needs Review | Back in scope 2026-07-14; **rebuilt from scratch** (not restored from 149022f). `src/blocks/loop-dropdown-tags.css` + `src/components/loop-dropdown-tags.js`: width-aware one-line tag row + "+N" pill; checkmark balloon (no checkboxes, no Select-All, 37px rows via `optionHeight`); **search in the field** (proxy input adopted as the provider's `$searchInput`) · tokens `--loop-multiselect-*` / `--loop-select-tag-*` / `--loop-select-option-*` · ref `loop/refs/cmp-dropdown-tags` (Figma 18830-17333; overflow 18830-16426; open state 18830-18200) · handover `loop-dropdown-tags.md` |
| Tag & Meta Tag | Partial | Tag built (`loop-tag.css`); Meta Tag to build/verify |

## Messaging, Alerts, Notification
| Deliverable | Status | Source |
|---|---|---|
| Alerts | Built | `src/components/loop-alert.js` |
| System Alerts | Built | `src/components/loop-system-alert.js` |
| Modal | Built | `src/components/loop-modal.js` |
| Popover | Built | `src/blocks/loop-popover.css` |
| Toast | Built | `src/components/loop-toast.js` |
| Notes | Built | `src/blocks/loop-note.css` |
| Tooltip | Built | `src/blocks/loop-tooltip.css` |

## Navigation
| Deliverable | Status | Source |
|---|---|---|
| Pagination | Needs Review | `src/blocks/loop-pagination.css` (`.loop-pagination--large` 48px size) + `src/components/loop-ag-grid-pagination.js` — numbered pager driving the AG Grid pagination API; `handover/loop-ag-grid-pagination.md` · ref `loop/refs/cmp-ag-grid-pagination` (Figma 27044-57397) |
| Tab | Built | `src/blocks/loop-tabs.css` |

## Data Display
| Deliverable | Status | Source |
|---|---|---|
| AG Grid (restyle) | Needs Review | `src/blocks/loop-ag-grid.css` + `tokens/component-table.css` — restyle of the real AG Grid Community v33 (`AGGrid_Lib`) to the Loop look via the v33 Theming API; `handover/loop-ag-grid.md` · ref `loop/refs/cmp-ag-grid` (Figma 25983-72091) |

---

## Built but NOT on the canonical list — awaiting keep/archive ruling
These exist in the repo but are not on the list above. Default disposition = **Archive** unless you say keep.
- **Card** — **Kept; bare `.card` override adopted 2026-07-05** (user ruling, reversing the
  2026-07-04 opt-in re-scope): the Loop card look (white, 8px radius, no border, shadow, 24px
  padding) is now the **default for every native Card** via a bare `.card` override, with
  `.card--no-shadow` (modern) / `.card--flush` (no padding) as opt-out modifiers (renamed from
  `loop-card--*`) per Figma 20315-6129 / 20315-6189 / 20376-15012. `src/blocks/loop-card.css`,
  `handover/loop-card.md`, in preview; issue #48.
- **Layout Top** — **Archived 2026-07-04** (user ruling: no header override; default OutSystems header). `tokens/outsystems-ui-header.css`, `--header-color`, the preview section and `handover/loop-layout-top-header.md` removed; handover #68 to close.
- **rnt-segmented** — example/reference only → archive (not a WBG deliverable).
- **Reference renderers** (color / type / spacing / shadow / border reference + class-inspector) — kept
  as internal Live Style Guide tooling under Foundation (not separate board items).
