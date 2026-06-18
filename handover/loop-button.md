# Handover — Button (restyle native OutSystems UI `.btn`)

The Loop **Button** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Button" [node 15597-766].

**Approach:** This does NOT introduce a custom button class. It **restyles the native
OutSystems UI Button widget** (`.btn` / `.btn-primary`) to The Loop design — same pattern
the project uses in `outsystems-ui-overrides.css`. Developers keep using the standard
OutSystems **Button** widget; the theme makes it look like The Loop.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-button.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/*` → `dist/theme.css` | Theme CSS (adds `--radius-pill`, `--space-button-gap`, `--letter-spacing-button`, `--color-bg-link-tertiary-*`) |

## Variant mapping (OutSystems Button "Style" → The Loop "Type")
| The Loop | OutSystems Button | How |
|---|---|---|
| **Secondary** (outlined blue-70) | base `.btn` (Style = None) | native, no extra class |
| **Primary** (filled blue-70) | `.btn-primary` (Style = Primary) | native, no extra class |
| **Ghost / Tertiary** (text, no border) | `.btn` + `btn-ghost` | Extended Class = `btn-ghost` (one added modifier; OutSystems has no native ghost) |

## Size mapping (Figma "Size" → OutSystems Button class)
| The Loop | OutSystems | How |
|---|---|---|
| **xLarge** (56px, default) | base `.btn` | native, no extra class |
| **Large** (48px) | `.btn-large` | native size class |
| **Regular** (40px) | `.btn` + `is-regular` | Extended Class = `is-regular` (added modifier; OutSystems has no native h40 Button size — mirrors the Text Field's `is-regular`) |
| **Small** (32px) | `.btn-small` | native size class |

## What the override changes vs OutSystems UI baseline
- Pill radius **32px**, Open Sans **700**, label tracking **-0.5px**, icon gap **6px**, padding **16/32** (→ 56px tall default).
- **Primary fill = blue-70 (#004370)** — overridden directly because `.btn-primary` otherwise resolves through `--color-primary` (blue-50), which other components share.
- Explicit Loop hover/pressed hues (replaces OutSystems' `filter: brightness()` darkening).
- Sizes: native `.btn-large` → 48px, `.btn-small` → 32px, added `is-regular` → 40px (Regular).

## Checklist
- [ ] Rebuild + paste latest `dist/theme.css` into ODC Theme editor (carries the new tokens).
- [ ] Paste `loop-button.css` into Theme CSS, below OutSystems UI.
- [ ] Use the native **Button** widget; pick Style = Primary/None. For ghost set Extended Class = `btn-ghost`; for Regular (40px) set Extended Class = `is-regular`.
- [ ] Icon-only buttons: keep an accessible name (`aria-label`).
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview).

## Open findings linked to this work
- **FND-013** (design-token, low) — `loop/button/gap`=6px off the 4pt grid; label tracking -0.5px off the documented scale. Register-only.
- **FND-014** (a11y/contrast, medium) — secondary/ghost hover fill (Blue/40 · Blue/20) under Blue/70 label may fail WCAG 1.4.3; confirm intended hover label color. Register-only.
