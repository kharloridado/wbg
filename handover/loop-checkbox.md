# Handover — Checkbox (restyle native OutSystems UI `[data-checkbox]`)

The Loop **Checkbox** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Checkbox" [node 19336-17679].

**Approach:** This does NOT introduce a custom checkbox widget. It **restyles the native
OutSystems UI Checkbox widget** (`[data-checkbox]`) to The Loop design — same pattern the
project uses for the Button (`loop-button.css`). Developers keep using the standard
OutSystems **Checkbox** widget; the theme makes it look like The Loop. The box graphic is
the input's `::before`; the check / dash glyph is its `::after`.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-checkbox.css` | Theme CSS (paste **below** OutSystems UI so it wins) |

No new global tokens — the component sizing (28px control / 20px box / 4px padding / 4 radius)
is defined as `--loop-checkbox-*` custom properties scoped to `[data-checkbox]`, and all colors
reference existing semantic tokens already in `dist/theme.css`.

## State / type mapping (Figma → native checkbox)
| The Loop | OutSystems / DOM | How |
|---|---|---|
| **Unchecked** (enabled) | base `[data-checkbox]` | native, no extra class |
| **Checked** (Yes) | `:checked` | native checked |
| **Multi** (indeterminate) | `:indeterminate` | set `el.indeterminate = true` in JS (OnReady / on a flag) |
| **Disabled** | `[disabled]` / `[aria-disabled="true"]` | native Enabled = False |
| **Error / Required** | `.loop-checkbox--error` or `[aria-invalid="true"]` | Extended Class = `loop-checkbox--error`; OR auto when OutSystems validation sets `aria-invalid` |

## What the override changes vs OutSystems UI baseline
- Control **28px** (touch target), visible box **20px**, radius **4px** (centered via 4px padding token).
- **Checked fill = blue-70 (#004370)** with a white check; **hover border = blue-70** (Outline/Primary).
- Adds an **indeterminate ("Multi") dash** — OutSystems UI has no native indeterminate style.
- Adds an **Error/Required red-70 type** (`#9d161d`) — box border (unchecked) and fill (checked/multi).
- Disabled: neutral-15 fill (#dae3eb), neutral-20 border (#d4dee8).
- Touch (`.tablet`/`.phone`): control grows to 32px / box 24px (keeps OutSystems' larger target).

## Sizes (XLarge / Large / Regular / Small)
Per the Figma "Sizes" frame the **box stays constant**; only the **label** text scales with the
`LABEL SIZE` variable. Label sizing is therefore driven by the field/label typography, **not** the
checkbox box — no box CSS changes per size.

## Checklist
- [ ] Ensure latest `dist/theme.css` is pasted into the ODC Theme editor (provides the semantic color tokens).
- [ ] Paste `loop-checkbox.css` into Theme CSS, below OutSystems UI.
- [ ] Use the native **Checkbox** widget. For Multi/indeterminate, set `el.indeterminate = true` in JS.
- [ ] For Error/Required, set Extended Class = `loop-checkbox--error` (or rely on OutSystems `aria-invalid`).
- [ ] Always pair the checkbox with a real `<label>` / accessible name.
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview).

## Open findings linked to this work
- **FND-016** (a11y/contrast, medium) — unchecked border `#00396b3d` ≈ 1.45:1 vs white fails WCAG 2.2 SC 1.4.11 (3:1 boundary). Register-only; built faithfully.
- **FND-017** (consistency/a11y, low) — "Required" renders in error-red by default, identical to the Error type. Register-only; built faithfully.
