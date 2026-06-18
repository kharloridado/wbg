# Handover — Text Field (restyle native OutSystems UI Input)

The Loop **Text Field** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Text Field" [node 19336-9606].

**Approach:** This does NOT introduce a custom input class. It **restyles the native
OutSystems UI Input widget** (`.form-control[data-input]` / `[data-textarea]`) to The Loop
design — same pattern as the Button/Button Group. Developers keep using the standard
OutSystems **Input** widget; native form **validation** drives the Error state. The
Label + helper-text arrangement is a thin BEM wrapper (`loop-field`) applied via Extended
Class on the field Container.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-text-field.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/component-field.css` → `dist/theme.css` | Theme CSS (adds the `--loop-field-*` tokens) |

## State mapping (Figma "State" → OutSystems)
| The Loop | How |
|---|---|
| **Default / Filled / Focused** | native — base `.form-control[data-input]` (Focused = `:focus`) |
| **Error** | native — `.not-valid` (set automatically by OutSystems form validation) |
| **Warning** | added modifier — Extended Class `is-warning` |
| **Disabled** | native — Input widget *Enabled = False* (`[disabled]`) |
| **Read Only** | added modifier — Extended Class `is-read-only` |

> Warning / Read-Only have no native OutSystems input state, so they are the one-off
> added modifiers (same idea as `.btn-ghost`).

## Size mapping (Figma "Size" → OutSystems Input class)
| The Loop | OutSystems | How |
|---|---|---|
| **xLarge** (56px, default) | base `.form-control[data-input]` | native, no extra class |
| **Large** (48px) | `.input-large` | native size class |
| **Regular** (40px) | `is-regular` | Extended Class (OutSystems has no "medium") |
| **Small** (32px) | `.input-small` | native size class |

## Label + helper layout (apply on the field Container via Extended Class)
- `loop-field` — vertical label (default): label above the input.
- `loop-field loop-field--horizontal` — label inline, left of the input.
- The **Label** needs no extra class — The Loop restyles the native OutSystems label
  element (`[data-label]`) inside `loop-field`. Set the Label widget's **Mandatory**
  property for the required `*` marker (native `.mandatory` hook).
- `loop-field__helper` on the helper Text; add a state modifier to colour it:
  `--error` / `--warning` / `--success` / `--disabled`.

## What the override changes vs OutSystems UI baseline
- Corner radius **8px** (`--radius-medium`) — the **OutSystems/MUI target** called out in the
  Figma note (node 19336-17326). The "Modern" collection mode is 32px; OutSystems uses 8.
- Open Sans, padding **16/18** (→ **56px** tall xLarge default), field gap 8px.
- Placeholder = `neutral-alpha-57` (#00294d91); **2px Blue/50** focus border (padding shrinks
  1px on focus so the box doesn't jump).
- Tinted **Error** (red), **Warning** (yellow), **Disabled** (neutral) fills + borders.

## Checklist
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new `--loop-field-*` tokens).
- [ ] Paste `loop-text-field.css` into Theme CSS, **below** OutSystems UI.
- [ ] Use the native **Input** widget; bind to a variable + an OutSystems **Validation** for the Error state.
- [ ] Warning → Extended Class `is-warning`; Read-Only → `is-read-only`; Regular size → `is-regular`.
- [ ] Wrap Label + Input + helper in a Container with Extended Class `loop-field` (+ `loop-field--horizontal` for inline labels).
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview).

## Open findings linked to this work (register-only — low/medium, no GitHub issue)
- **FND-018** (design-token, low) — field `vpadding 18px` + label `gap 6px` off the 4pt grid; disabled border uses an On-Dark token with no light primitive (rendered borderless).
- **FND-019** (a11y/contrast, medium) — resting input border `#00396b3d` ≈ 1.45:1 on white (non-text contrast, SC 1.4.11); sibling of the checkbox FND-016.
- **FND-020** (consistency, low) — placeholder "subdued" `#00294d91` differs from the semantic `--color-text-on-light-subdued` `#000d1a91` (FND-006).
- **FND-021** (consistency, low) — size system documented two ways (3 vs 4 sizes) with an ambiguous default; built all 4 with xLarge as default.
