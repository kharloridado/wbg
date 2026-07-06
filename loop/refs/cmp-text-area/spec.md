# cmp-text-area — frozen Figma ref

- **File:** `zx8q9nRf8Dbqam1rfquQ2E` (-The Loop- Main Library (2))
- **Node:** `19336:10332` — "States" frame, header: **Responsive (spacing and font adjusted based on breakpoint)**
- **Pulled:** 2026-07-05 (get_metadata + get_design_context + get_variable_defs per breakpoint instance + get_screenshot)
- **Breakpoint instances:** Desktop `19336:10337` · Tablet `19336:10340` · Mobile `19336:10343` (each an instance of `-loop text area`, 400×168)

## What this node specifies

The Text Area (multi-line input) with its FieldLabel, rendered at three device modes. Structure is
identical across breakpoints — only the mode-resolved variable values change. Spacing and font
sizing must adapt on the OutSystems `.desktop` / `.tablet` / `.phone` device classes.

## Key values (mode-resolved per breakpoint)

| Property | Figma variable | Desktop | Tablet | Mobile | Token |
|---|---|---|---|---|---|
| Field padding-inline | `Spacing/small` | 16 | 12 | 8 | `--space-small` / `--space-xsmall` / `--space-xxsmall` |
| Field padding-block | `Spacing/xsmall` | 12 | 8 | 8 | `--space-xsmall` / `--space-xxsmall` / `--space-xxsmall` |
| Text area font size | `loop/text area/font size` | 14 | 14 | 12 | `--font-size-200` / same / `--font-size-100` |
| Text area line height | `loop/text area/line height` | 18 | 18 | 16 | literal |
| Text area letter spacing | `loop/text area/letter spacing` | 0.5 | 0.5 | 0.5 | literal (shared `--loop-field-text-tracking`) |
| Text area font weight | `loop/text area/font weight` | 400 | 400 | 400 | `--font-weight-regular` |
| Label font size | `loop/label/font size` | 16 | 14 | 14 | `--font-size-300` / `--font-size-200` / `--font-size-200` |
| Label line height | `loop/label/font height` | 16 | 16 | 16 | `--loop-field-label-leading` |
| Label weight | `loop/label/font weight` | 600 | 600 | 600 | `--font-weight-semibold` |
| Label → field gap | `loop/label/gap` | 6 | 6 | 6 | `--loop-field-label-gap` |
| Field min-height | (layout) | 80 | 80 | 80 | `--loop-textarea-min-h` |
| Border radius | `Border Radius/Medium` | 8 | 8 | 8 | `--radius-medium` (via `--loop-field-radius`) |
| Border | `Outline/On Light/Default` #00396b3d | 1px | 1px | 1px | `--color-outline-on-light-default` |
| Background | `Background/Container/On Light/Lowest` #fff | — | — | — | `--color-bg-container-on-light-lowest` |
| Placeholder colour | `Text/On Light/Subdued` #00294d91 | — | — | — | subdued |
| Label colour | `Text/On Light/Default` #000d1ab2 | — | — | — | `--color-text-on-light-default` |

## Layout notes (from get_design_context)

- Wrapper: column flex, `gap: var(--loop/label/gap, 6px)`, FieldLabel row above the field box.
- Input Field box: `min-h 80px`, `min-w 250px`, `px Spacing/small`, `py Spacing/xsmall`,
  1px `Outline/On Light/Default` border, `Border Radius/Medium` (8), white bg, content top-aligned.
- Custom "grip corner" resize glyph bottom-right (16px, `Icon/On Light/Default`) — cosmetic
  representation of the native textarea resizer; native resizer kept in code.
- Only the **default size** is specified per breakpoint in this node — no per-size (xlarge…small)
  responsive matrix here; explicit `.input-*` / `.loop-field--*` size steps remain (19336-9729).

## Implementation mapping

- `src/blocks/loop-text-field.css` — "Text Area — responsive" section; device overrides at
  `.tablet` / `.phone` scope (OutSystems device classes on `body`). OSUI re-asserts
  `font-size` at `(0,3,0)` in its own `.tablet/.phone .form-control[data-textarea]` rule, so the
  loop overrides re-declare `font-size` at the same specificity (loaded after OSUI).
- `tokens/component-field.css` — `--loop-textarea-*` component tokens (desktop defaults).
