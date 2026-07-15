# Frozen Figma ref — cmp-dropdown-tags (Dropdown Tags / Multi-select)

- **Figma file:** zx8q9nRf8Dbqam1rfquQ2E (The Loop — Main Library (2), the NEW file key)
- **Page frame:** 18830:17333 ("Copy Me" — Variants page; rendered in `figma.png`)
- **Spec component:** `-loop multi select` instances (18831:4009, :4059, :4213, :4320, :4486, :4600)
- **Design-context pulled from:** 18831:4009 (Placeholder state), 2026-07-06
- **Style Guide page:** https://wbg-dev.outsystems.app/TheLoopDesignSystem/PatternDetail?MenuCategoryId=3&MenuSubCategorId=35
- **How to read this:** the Dropdown Tags surface is a restyle of the OutSystems
  VirtualSelect "Tags" provider (`.osui-dropdown-tags` → `.vscomp-ele-wrapper`),
  implemented in `src/blocks/loop-dropdown-tags.css` + `src/components/loop-dropdown-tags-fit.js`
  (rebuilt from scratch 2026-07-14; the earlier `loop-dropdown.css` §2–3 build was de-scoped
  2026-07-07 and is not the reference). Token values in `variables.json`
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

## Tag overflow — the single-line row + `+N` pill

- **Snapshot:** `figma-overflow.png` — node **18830:16426** ("Input Field"), pulled 2026-07-14.
  This is the state the `+N` pill is actually specified in; the states above merely *draw* it.

Structure of the row (Figma names → geometry, field 620×64):

| Layer | Geometry | Notes |
|---|---|---|
| `Tags Wapper` (sic) | flex row, `gap 4px`, `flex: 1 0 0`, **`overflow: clip`** | this clip is what holds the row to ONE line |
| `-loop tag` ×3 | `shrink-0`, chip skin | ordinary removable chips |
| `-loop tag` (`+3`) | x=517, **outside** the Tags Wapper, `shrink-0` | right-aligned, ahead of the two right icons |
| `Right Icon I` | 20px `xmark` (clear-all) | |
| `Right Icon II` | 20px `chevron-down` | |

The `+N` pill is the same `-loop tag` component as a chip — bg `#f5f7f9`, 1px
`Outline/On Light/Default`, radius 48px, `py 8px` — with exactly two differences:
**inline padding is 6px** (a chip's is 12px) and it has **no cross icon**.

Chip label: Open Sans 400 16/16, ls 0.25px, **`max-width: 200px` + ellipsis**.

### What the design does NOT specify

The design does not give the **threshold** at which `+N` appears — it draws `+3` beside three
chips with no rule attached, and there is no wrap-vs-scroll or count rule anywhere in the frame.
The `overflow: clip` on the Tags Wapper is the only behavioural signal, and it says *one line*.

**Assumption of record (decision log, not a finding — spec silence is not a design conflict):**

> `+N` collapses exactly the tags that do not fit on one line, at the field's current width.
> N is therefore computed at runtime, not configured. Floor: at least one chip always renders
> (an over-long lone label ellipsises at the 200px `max-width` instead of collapsing to a bare pill).

This is why the implementation cannot use the VirtualSelect provider's `noOfDisplayValues` as a
static config — that option is a fixed count, blind to width and label length. See
`src/components/loop-dropdown-tags-fit.js`.

## Open state / balloon — option list with checkmark rows, search in the FIELD

- **Snapshot:** `figma-open.png` — node **18830:18200** (`-loop multi select`, open state), pulled 2026-07-14.

The balloon (Figma `-loop dropdown / item` rows inside a drop-shadowed column):

| Property | Value | Figma variable |
|---|---|---|
| Balloon radius | 8px | `lift/border radius/radius-2` (= `Border Radius/Medium`) |
| Balloon shadow | `0 2px 3px rgba(0,0,0,0.08)` | **none — token gap** (not `--shadow-low`'s 0 2px 8px) |
| Row height | **37px** (8 + 14×1.5 + 8) | `lift/spacing/space-2` py + `Body/Text/Small/Regular` |
| Row inline padding | 12px | `Spacing/xsmall` |
| Row text | Open Sans 400 **14**/1.5, ls 0 | `Body/Text/Small/Regular` (`Font-size/200`) |
| Row text colour | rgba(0,13,26,0.7) | `Text/On Light/Default` |
| Row bg (unselected) | #ffffff | `Background/Container/On Light/Lowest` |
| **Row bg (selected)** | **#e7edf3** | `Background/Container/On Light/Regular` |
| **Selected marker** | **16px checkmark, right-aligned** (gap 8px `elementts/space-inline`) | glyph box 16px; fill = row text/icon default |

**What the open state does NOT have — three deliberate absences:**

1. **No checkbox** on option rows (OSUI's default multiple-mode rows carry a primary-filled
   `.checkbox-icon`). Selection is communicated by the row fill + the right-aligned check.
2. **No search row in the balloon.** Typing happens **directly in the field**, combobox-style,
   after the chips. (OSUI hard-forces the provider's `search: true` and the provider can only
   render its search input inside the dropbox — so the implementation injects a proxy input in
   the field, reassigns the provider's `$searchInput` reference to it, and hides the balloon's
   search row. See `src/components/loop-dropdown-tags.js`.)
3. **No Select-All row** (it lives in the provider's search container, hidden with it).

### Assumptions of record (spec silence, not design conflicts)

- **Hover / keyboard-focused row:** not drawn in Figma. Implemented as `Background/Container/
  On Light/Low` (#f5f7f9), one step lighter than the selected fill.
- **Query lifecycle:** the typed query **persists across user picks** (select several matches
  without retyping) and clears when the balloon closes, and on programmatic value sets
  (`afterValueSet` → `setSearchValue("")` runs only on the `setValue` API path) — stock
  VirtualSelect behaviour, verified empirically and kept.
- **Backspace in an empty search** does NOT remove the last chip; chips are removed only via
  their own `×` or clear-all.
- **Row height 37px** is passed as the provider's `optionHeight` option (rows are virtually
  scrolled at fixed intervals — CSS heights would corrupt the scroll math).

## Sizes — the Field Wrapper cascade (Figma 18830:17324, "How To Use — Sizes")

- **Snapshot:** `figma-sizes.png` — node **18830:17324**, pulled 2026-07-14.
- The Figma page's own note: size is selected on the nested **Field label** and **loop input**
  components and "this parent component will adjust" — i.e. the size ramp is **wrapper-driven**,
  exactly the cmp-field-sizing rule ("every sizeable control inside a sized Field Wrapper
  follows the wrapper"). No standalone per-control size classes are drawn.
- The four instances are XLarge (18831:3988), Large (18831:3852), Regular (18831:3903 — Figma
  group mis-named "Small"; its 13px/0.25 label is the Regular step) and Small (18831:3955).
- **The component's unmodified default is the XLarge scale** (the Variants page 18830:17333 —
  the spec of record above — draws XLarge geometry), unlike the Text Field whose family
  default is Regular (FND-021).
- **Radius is `input fields` = 8px at every size** (the 32px in the generated code is a stale
  mode fallback; the variable resolves to 8). Nothing else about the radius changes with size.
- FieldLabel + helper follow the shared cmp-field-sizing ramp (label 16/14/13/12, tracking
  0/0/0.25/0.5; helper 12px/1 unchanged at every size).
- The **open balloon is not drawn on the Sizes page** — option-list geometry (37px rows, 14px
  text) stays size-independent (assumption of record: spec silence, not a conflict).

| Property | XLarge | Large | Regular | Small | Figma variable |
|---|---|---|---|---|---|
| Field vpadding | 12 | 8 | 6 | 4 | `loop/multi-select/vpadding` |
| Field hpadding | 16 | 16 | 16 | **12** | `loop/field/hpadding left`/`right` |
| Field internal gap | 8 | 8 | **6** | **6** | `loop/field/hgap` |
| Placeholder box height | 28 | 26 | 24 | 20 | (`h-[NN]` per instance) |
| Placeholder font/leading | 16/16 | 14/16 | 13/14 | 12/12 | `loop/placeholder/text field/*` |
| Right icons (clear-all + chevron) | 20 | 20 | 16 | 12 | `loop/field/icon size` |
| Tag hpadding | 12 | 12 | 12 | **10** | `loop/tag/hpadding` |
| Tag vpadding | 8 | 8 | 5 | 4 | `loop/tag/vpadding` |
| Tag label-wrapper vpad | 4 | 4 | 4 | 2 | `loop/tag/label/label wrapper` |
| Tag text/leading | 16/16 | 16/16 | 14/14 | 12/12 | `loop/tag/label/*` |
| Tag cross | 14 | 14 | 12 | 12 | `loop/tag/icon/cross-size` |
| → Tag chip height (derived, PINNED in build) | **40** | **40** | **32** | **24** | vpad + wrapper + line |
| → Field height (derived) | 64 | 56 | 44 | 32 | vpad×2 + chip |

Large only shrinks the FIELD (vpadding 8, placeholder 14/16) — its tag chips are identical to
XLarge's. The tag scale first steps down at Regular.

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
