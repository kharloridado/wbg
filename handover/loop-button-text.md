# Handover — Button Text (native `.btn` + `btn-text` modifier)

The Loop **Button Text** — a link-style text button.
Figma: "Button Text" [node 15597-4652].

**Approach:** Restyle the native OutSystems UI Button (`.btn`) with a single `btn-text`
modifier (OutSystems UI has no native text/link button style). Apply via the Button
widget's **Extended Class = `btn-text`**.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-button-text.css` | Theme CSS (paste below OutSystems UI) |
| `tokens/*` → `dist/theme.css` | adds `--color-focus-keyboard-on-light` (#b6490c) |

## What it does
- No fill, no border; **blue-70** label, Open Sans **700**, tracking **-0.5px**.
- Hover = underline; pressed = Blue/90; disabled = `#8a9db1`.
- **Dedicated high-contrast ORANGE keyboard-focus ring** (`#b6490c`) — distinct from the blue ring on filled/outlined buttons (faithful to Figma `Keyboard Focus/On Light`).
- Distinct from the Button's **ghost** variant (which keeps button padding + a light hover fill).

## Checklist
- [ ] Rebuild + paste latest `dist/theme.css` (carries the focus token).
- [ ] Paste `loop-button-text.css` into Theme CSS, below OutSystems UI.
- [ ] Use the native **Button** widget with Extended Class = `btn-text`.
- [ ] 1-Click Publish → validate in a **real browser**.

## Open findings linked to this work
- **FND-015** (design-token, low) — `Keyboard Focus/On Light #b6490c` / `On Dark #f5926c` have no orange primitive. Built faithfully as a literal. Register-only.
