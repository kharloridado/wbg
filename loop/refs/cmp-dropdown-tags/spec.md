# Frozen Figma ref — cmp-dropdown-tags (Dropdown Tags / Multi-select)

- **Figma file:** zx8q9nRf8Dbqam1rfquQ2E (The Loop — Main Library (2), the NEW file key)
- **Page frame:** 18830:17333 ("Copy Me" — Variants page; rendered in `figma.png`)
- **Spec component:** `-loop multi select` instances (18831:4009, :4059, :4213, :4320, :4486, :4600)
- **Design-context pulled from:** 18831:4009 (Placeholder state), 2026-07-06
- **Style Guide page:** https://wbg-dev.outsystems.app/TheLoopDesignSystem/PatternDetail?MenuCategoryId=3&MenuSubCategorId=35
- **How to read this:** the Dropdown Tags surface is a restyle of the OutSystems
  VirtualSelect "Tags" provider (`.osui-dropdown-tags` → `.vscomp-ele-wrapper`),
  implemented in `src/blocks/loop-dropdown.css` §2–3. Token values in `variables.json`
  are the spec of record; the JSX below is Figma-generated REFERENCE, never target code.

## States covered (see figma.png, top→bottom)

1. **Placeholder** — white box, placeholder text, `+3` overflow pill, clear-all `xmark`, `chevron-down`.
2. **Filled** — tag chips (`In Progress ×`, `Done ×`, `Closed ×`) + `+3` + xmark + chevron.
3. **Focused** — 2px `Outline/On Light/Link/Focused` (#0071bc) border.
4. **Error** — bg #fdf2f2, 1px border #9d161d, error helper icon.
5. **Warning** — bg #fef3d7, 1px border #896001, warning helper icon.
6. **Disabled** — bg #dae3eb, faded chips + text.

## Key values (for quick diffing)

| Property | Value | Figma variable |
|---|---|---|
| Field radius | **8px** (NOT the 32px single-select pill) | `input fields` |
| Field vpadding | 12px | `loop/multi-select/vpadding` |
| Field hpadding | 16px l/r | `loop/field/hpadding left`/`right` |
| Field internal gap | 8px | `loop/field/hgap` |
| Placeholder min-height | 28px | `loop/multi-select/placeholder height` |
| Right icon size | **20px** (clear-all xmark + chevron-down) | `loop/field/icon size` |
| Right icon colour | #4b5e71 | `Icon/On Light/Default` |
| Default border | rgba(0,57,107,0.24) 1px | `Outline/On Light/Default` (#00396b3d) |
| Focused border | #0071bc 2px | `Outline/On Light/Link/Focused` |
| Label | Open Sans 600 16/16, ls 0 | `.UI Component/Input/Label/Label` |
| Placeholder | Open Sans 400 16/16, ls 0.5, subdued | `.UI Component/Input/Placeholder/Text FIeld` |
| Helper | Open Sans 400 12/1, ls 0.5 | `.UI Component/Input/Label/Helper` |
| Label→input gap | 6px | `loop/label/gap` |
| **Tag chip bg** | #f5f7f9 | `Background/Container/On Light/Low` |
| **Tag chip border** | 1px rgba(0,57,107,0.24) | `Outline/On Light/Default` |
| Tag chip radius | 48px pill | `loop/tag/border radius` |
| Tag chip padding | 12px h / 8px v | `loop/tag/hpadding` / `loop/tag/vpadding` |
| Tag `+N` pill inline padding | 6px | (px-6 in the reference) |
| Tag text | Open Sans 400 16/16, ls 0.25, default | `.UI Component/Tag/Label` |
| Tag internal gap | 4px | `loop/tag/hgap` |
| Tag clear cross | 14px | `loop/tag/icon/cross-size` |
| Error bg/border/text | #fdf2f2 / #9d161d / #9d161d | state error tokens |
| Warning bg/border/text | #fef3d7 / #896001 / #473201 | state warning tokens |
| Disabled bg/border/text | #dae3eb / rgba(255,255,255,0.48) / #00294d6b | state disable tokens |

## Notable deltas vs the earlier single-select Select spec (cmp-dropdown-select)

- **Multi-select is 16px throughout** (label, placeholder, tag text) — the single Select
  used 13px. Do NOT apply the `.loop-field--select` 13px label override to the tags field.
- **Field radius is 8px**, not the 32px pill of the single Select (`input fields`=8 here).
- **Tag chips carry a 1px border** (`Outline/On Light/Default`) — the earlier build's chips
  were borderless; the border was added 2026-07-06 to match this spec.

## Reference code (condensed from get_design_context, node 18831:4009)

```jsx
// .-loop multi select: flex col, gap loop/label/gap(6px)
//   FieldLabel: Open Sans SemiBold 16/16 ls loop/label/letter-spacing(0), text/on-light/default
//   Input Field: flex items-center, rounded var(--input-fields,8px),
//     pl/pr loop/field/hpadding(16px), py loop/multi-select/vpadding(12px), gap loop/field/hgap(8px)
//     bg background/container/on-light/lowest(white), border 1px outline/on-light/default(rgba(0,57,107,0.24))
//     Placeholder: Open Sans 400 size loop/placeholder/text-field/font-size(16) lh 16 ls 0.5,
//       h 28px, color text/on-light/subdued
//     -loop tag (+N pill): bg background/container/on-light/low(#f5f7f9),
//       border 1px outline/on-light/default, rounded loop/tag/border-radius(48px),
//       px 6px, py loop/tag/vpadding(8px), gap loop/tag/hgap(4px)
//       Text Wrapper py loop/tag/label/label-wrapper(4px); text Open Sans 400 16/16 ls 0.25 default, max-w 200px
//     Right Icon I  (xmark / clear-all): size loop/field/icon size(20px)
//     Right Icon II (chevron-down):      size loop/field/icon size(20px)
//   Helper: circle-info 12px + Open Sans 400 12/1 ls 0.5 subdued
```

Re-pull node 18831:4009 (or the Filled/Error/Warning/Disabled siblings) if a finer detail is disputed.
