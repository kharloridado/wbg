# Frozen Figma ref — cmp-dropdown-select

- **Figma file:** zx8q9nRf8Dbqam1rfquQ2E (The Loop — Main Library (2), the NEW file key) — re-pulled 2026-07-06 for the Dropdown Search goal (node 18770:10424 exists in both the old `aHtnwyPhI8WRbiGHZ8E5Gb` and this new file; the new file is now the spec of record).
- **Page node:** 18787:4817 (Select — full documentation page; too large for one design-context pull, see figma.png for the rendered page)
- **Spec node:** 18770:10424 — the `-loop select` component set (State × Action symbols), re-pulled via `get_design_context` + `get_variable_defs` 2026-07-06

> **2026-07-06 update (Dropdown Search goal).** The single Select field radius is now
> **8px** (`input fields`=8), NOT the 32px pill this ref originally recorded — the field
> box was migrated to an 8px soft-rounded rectangle (32px pill is opt-in via
> `.loop-field--rounded`). The single-Select scale (13px text · 11px vpadding · **16px**
> chevron) is DISTINCT from the Dropdown Tags multi-select (16px text · 12px vpadding ·
> 20px icons); `loop-dropdown.css` resolves the difference via the scoped `--loop-vs-*`
> alias vars. The `Key values` table below still reads "32px" from the pre-migration pull —
> treat the 8px note here as authoritative.
- **Multiselect companion node:** 18830:17312 (not yet snapshotted; pull if the multiselect surface is re-reviewed)
- **How to read this:** the code below is Figma-generated React/Tailwind REFERENCE — never target code. The values that matter are the CSS custom properties and their fallbacks, e.g. `var(--loop\/field\/vpadding,11px)`. Cross-check exact token values in `variables.json`.

## States covered (component set 18770:10424)

Default/Closed, Filled/Closed, Selected/Closed, Error/Closed, Warning/Closed, Disabled/Closed, Placeholder/Closed, Default/Open (with `-loop selection options` popup list).

## Key values (extracted for quick diffing)

| Property | Value | Figma variable |
|---|---|---|
| Field radius | **8px** (`input fields`=8, new file; was 32px pill pre-2026-07-06) | `Input Fields` |
| Right icon size | **16px** (single Select chevron; Tags multi-select is 20px) | `loop/field/icon size` |
| Field vpadding | 11px | `loop/field/vpadding` |
| Field hpadding left/right | 16px | `loop/field/hpadding left` / `right` |
| Field internal gap | 8px | `loop/Field/hGap` |
| Icon size | 16px | `loop/field/icon size` |
| Label font | Open Sans 600 13/16, ls 0.25 | `.UI Component/Input/Label/Label` |
| Placeholder font | Open Sans 400 13/14, ls 0.5 | `.UI Component/Input/Placeholder/Text FIeld` |
| Helper font | Open Sans 400 12/1, ls 0.5 | `.UI Component/Input/Label/Helper` |
| Label→input gap | 6px | `loop/label/gap` |
| Default border | rgba(0,57,107,0.24) 1px | `Outline/On Light/Default` #00396b3d |
| Selected (focused) border | #0071bc 2px | `Outline/On Light/Link/Focused` |
| Error bg/border/text | #fdf2f2 / #9d161d / #861319-#9d161d | state error tokens |
| Warning bg/border/text | #fef3d7 / #896001 / #473201 | state warning tokens |
| Disabled bg/border/text | #dae3eb / rgba(255,255,255,0.48) / #00294d6b | state disable tokens |
| Popup list radius | 8px | `card/corner radius` |
| Popup item padding | 12px h, 8px v | `Spacing/xsmall` / `lift/spacing/space-2` |
| Popup item text | Open Sans 400 14/1.5 | `Body/Text/Small/Regular` |
| Popup shadow | 0 2 8 0 #00396b29 | `-loop shadows/Low` |

## Reference code (verbatim get_design_context output, node 18770:10424)

```jsx
type LoopSelectProps = {
  className?: string;
  action?: boolean;
  state?: "Default" | "Filled" | "Selected" | "Error" | "Warning" | "Disabled" | "Placeholder";
};

// Field container: flex column, w-383px
// Label row (".-loop FieldLabel"): Open Sans SemiBold 13px, lh var(--loop/label/font-height,16px),
//   tracking var(--loop/label/letter-spacing,0.25px), color var(--text/on-light/default,rgba(0,13,26,0.7))
// Label→input gap: var(--loop/label/gap,6px)
// Input Field: flex items-center, rounded var(--input-fields,32px),
//   pl/pr var(--loop/field/hpadding-*,16px), py var(--loop/field/vpadding,11px)
//   Default: bg var(--background/container/on-light/lowest,white),
//            border 1px var(--outline/on-light/default,rgba(0,57,107,0.24))
//   Selected: border 2px var(--outline/on-light/link/focused,#0071bc)
//   Error:    bg var(--background/container/on-light/state/error/low,#fdf2f2),
//             border 1px var(--outline/on-light/state/error/high,#9d161d)
//   Warning:  bg var(--background/container/on-light/state/warning/low,#fef3d7),
//             border 1px var(--outline/on-light/state/warning/high,#896001)
//   Disabled: bg var(--background/container/on-light/state/disable/low,#dae3eb),
//             border 1px var(--outline/on-dark/state/disable,rgba(255,255,255,0.48))
// Placeholder text: Open Sans Regular, size var(--loop/placeholder/text-field/font-size,13px),
//   lh var(--loop/placeholder/text-field/line-height,14px), tracking 0.5px,
//   color var(--text/on-light/subdued,rgba(0,41,77,0.57)) [default]
//        var(--text/on-light/default,rgba(0,13,26,0.7)) [filled/selected]
//        var(--text/on-state/error/emphasis,#861319) [error]
//        var(--text/on-state/warning/emphasis,#473201) [warning]
// Placeholder vpadding: var(--loop/field/placeholder-vpadding,2px); inner gap var(--loop/field/hgap,8px)
// Right chevron icon: 16px (chevron-down; angle-down in the open/action variant)
// Helper row: 12px status icon (circle-info / circle-exclamation / triangle-exclamation) + text
//   Open Sans 400, size var(--loop/label/helper-text-font-size,12px), lh 1, tracking 0.5px
//   color: subdued [default], default [filled], error/warning/disabled state text tokens
// Open variant popup ("-loop selection options", node 18770:11123):
//   w-383px, rounded var(--card/corner-radius,8px),
//   drop-shadow 0 var(--loop/shadows/low/y-position,2px) var(--loop/shadows/low/blur,8px)
//     var(--effects/shadow/default,rgba(0,57,107,0.16)), top offset 69px from field top
//   Items ("-loop dropdown / item"): bg white, px var(--spacing/xsmall,12px),
//     inner wrapper py var(--lift/spacing/space-2,8px),
//     16px leading icon + gap var(--elementts/space-inline,8px),
//     text Open Sans 400 var(--font-size/200,14px)/1.5 var(--text/on-light/default,rgba(0,13,26,0.7))
//   First/last items round their outer corners (8px)
```

Full verbatim JSX preserved by the pull is intentionally condensed above to the value-bearing lines; every custom property + fallback pair appears exactly as Figma emitted it. Re-pull node 18770:10424 if a finer detail is disputed.

**Ref-internal inconsistency (known, FND-020):** the reference code's subdued fallback is `rgba(0,41,77,0.57)` (#00294d91) while `variables.json` publishes `Text/On Light/Subdued` = `#000d1a91` — Figma carries two "subdued" values. `variables.json` is the declared spec of record; the build follows it. Do not flag either side as a new finding.
