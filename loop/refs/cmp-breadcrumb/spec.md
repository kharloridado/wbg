# cmp-breadcrumb — Breadcrumbs colour override (native OutSystems UI `.breadcrumbs`)

- **Figma file:** zx8q9nRf8Dbqam1rfquQ2E (The Loop — Main Library (2), the NEW file key). The user-supplied URL used the old file key `A0G1V7u9lom9yMLnJ8Dzka` (no access — org View seat only); node **30367:747** exists in the new file, which is the spec of record.
- **Node:** 30367:747 — "-loop breadcrumb" (two trails: one with a home button + overflow menu, one Home-first).
- **Pulled:** 2026-07-06 via `get_design_context` + `get_variable_defs`; `figma.png` snapshot alongside this file.

## Goal / scope

Override **colours only** of the native OSUI Breadcrumbs pattern to match Figma. Geometry,
typography, and the native chevron separator glyph are intentionally left untouched.

## Colours (Figma variables → theme token)

| Role | Figma variable | Value | Theme token |
| --- | --- | --- | --- |
| Linked crumb | `Text/On Light/Link/Primary Enabled` | `#004370` | `--color-text-on-light-link-primary-enabled` |
| Current page (last, unlinked) | `Text/On Light/Subdued` | `rgba(0,41,77,0.57)` | `--color-text-on-light-subdued` |
| Separator "\|" / chevron | `Text/On Light/State/Disabled` | `rgba(0,41,77,0.42)` | `--color-text-on-light-state-disabled` |
| Leading icon (home) | `Icon/On Light/Primary` | `#004370` | `--color-icon-on-light-primary` |

Type reference (not changed by this override): Open Sans 14px / weight 400 / line-height 1.5
(`Body/Text/Small/Regular`, `Font-size/200`).

## Native DOM anchored on (outsystems-widgets-reference + `_breadcrumbs.scss`)

```
nav.breadcrumbs > .breadcrumbs-content > .breadcrumbs-item
    .title                            → <a> for a linked crumb, plain text for the current page
    .placeholder-empty > i.icon.fa    → the between-crumb separator glyph (default fa-angle-right)
```

OSUI defaults: `.breadcrumbs-item` = neutral-8 text, `.breadcrumbs-item .icon` = neutral-7.

## Implementation notes

- Deliverable: `src/blocks/loop-breadcrumb.css` — targets native `.breadcrumbs` classes directly
  (no ExtendedClass wrapper), applies to every OSUI Breadcrumbs instance. Pasted BELOW theme + OSUI.
- Separator recolour is targeted **structurally** via `.breadcrumbs-item > :not(.title) .icon`, never
  via the runtime `.placeholder-empty` utility (selecting on that hook previously wiped separators —
  see memory `never-select-on-placeholder-empty`).
- The Figma separator is a thin "|" bar while OSUI ships a `fa-angle-right` chevron. This override does
  **not** change the glyph (out of scope: colours only). The layout-scoped `.loop-content__breadcrumbs`
  in `tokens/outsystems-ui-side.css` does swap it to "|" for the app-header context; a global glyph swap
  could be a follow-up if design wants the bar everywhere.

## Observations (not filed as findings — colour-only scope)

- Glyph mismatch (chevron vs "|") noted above — a shape/content decision for design, not a colour issue.
