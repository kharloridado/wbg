# Handover — Radio Button (restyle native OutSystems UI `.radio-button`)

The Loop **Radio Button** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Radio Button" [node 19336-18637].

**Approach:** This does NOT introduce a custom radio class. It **restyles the native
OutSystems UI RadioButtons widget** (`.radio-button` / `[data-radio-group]` /
`[data-radio-button]`) to The Loop design — same pattern as `loop-button.css`.
Developers keep using the standard OutSystems **RadioButtons** widget; the theme makes
it look like The Loop. No Web Component.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-radio-button.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/*` → `dist/theme.css` | Theme CSS (adds `--space-checkbox-gap`, `--space-checkbox-group-row`, `--space-checkbox-group-column`) |

## What the override builds
The Loop ring + dot are rebuilt from scratch over the native input:
`:before` = ring (2px border, white interior), `:after` = dot (50% diameter, shown only when `:checked`).
Each conflicting rule is also restated for `.has-accessible-features` so the override
wins whether or not the app runs with accessibility features on.

**States (ring + dot color):**
| State | Treatment |
|---|---|
| Enabled · unchecked | border `Outline/On Light/Emphasis` #00294d6b |
| Hover · unchecked | border `Blue/70` #004370 |
| Checked | border + dot `Blue/70` #004370 |
| Required / invalid | border + dot + label `Red/70` #9d161d (native `[data-radio-group].not-valid`) |
| Disabled | fill #dae3eb · border #d4dee8 · dot #bdccdb · label #00294d6b |

**Label:** Open Sans 400, `Text/On Light/Default` #000d1ab2, gap 8px (`loop/checkbox/gap`).

## Sizes (apply via the widget's **Extended Class** on the input — default = XLarge)
| The Loop size | Class | Circle | Label |
|---|---|---|---|
| **XLarge** (default) | _(none)_ | 28px | 16/18 |
| Large | `loop-radio-large` | 24px | 14/16 |
| Regular | `loop-radio-regular` | 20px | 13/15 |
| Small | `loop-radio-small` | 16px | 12/14 |

## Group layout (native)
- **Vertical** (default): 14px between rows (`loop/checkbox/group/vpadding`).
- **Horizontal**: set the RadioButtons group container class to `radio-group is-horizontal` → 20px between items (`loop/checkbox/group/hpadding`). RTL-aware.

## Checklist
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new spacing tokens).
- [ ] Paste `loop-radio-button.css` into Theme CSS, below OutSystems UI.
- [ ] Use the native **RadioButtons** widget. For a non-default size, set Extended Class = `loop-radio-large` / `loop-radio-regular` / `loop-radio-small`.
- [ ] Always pair each radio with a visible **label** (the widget's label); one option pre-selected by default per the DS guidelines.
- [ ] Required: drive the native group **not-valid** state for the red treatment; pair it with a visible required marker / helper text on the Form field (see FND-023 — don't rely on the red ring alone).
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview alone). Check keyboard focus ring + arrow-key navigation within a group.

## Open findings linked to this work
- **FND-022** (design-token, low) — group `vpadding 14px` off the 4pt grid; Regular label `13/15`, Small label tracking `0.25px` off the documented scales. Register-only.
- **FND-023** (consistency/a11y, low) — "Required" renders identical error-red before interaction and is color-only on the control (mirrors checkbox FND-017). Register-only.

> Note: the enabled-unchecked ring uses `Outline/On Light/Emphasis` (#00294d6b ≈ 3:1 on white), which **meets** WCAG 2.2 SC 1.4.11 — it is the darker token recommended as the fix for the checkbox/field resting-border findings (FND-016 / FND-019), so no contrast finding applies here.
