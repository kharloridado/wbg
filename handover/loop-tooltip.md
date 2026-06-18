# Handover — Tooltip (restyle native OutSystems UI `.osui-tooltip` pattern)

The Loop **Tooltip** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Tooltip" [node 17874-7113].

**Approach:** This does NOT introduce a custom tooltip class. It **restyles the native
OutSystems UI Tooltip pattern** (`.osui-tooltip` / `.osui-balloon`) to The Loop design.
Developers keep using the standard OutSystems **Tooltip** pattern; the theme makes it
look like The Loop. No Web Component.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-tooltip.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/component-tooltip.css` → `dist/theme.css` | Theme CSS (adds `--loop-tooltip-*` metrics) |

## What the override builds

**Two variants (toggle via the Tooltip pattern's `ExtendedClass` property):**
| Figma type | OutSystems ExtendedClass | Appearance |
|---|---|---|
| Dark (default) | _(none)_ | Black bg `#000`, white text `rgba(255,255,255,0.9)` |
| Light | `loop-tooltip--light` | White bg, dark text `rgba(0,13,26,0.7)`, drop-shadow |

**Four pointer/position directions (set in the Tooltip pattern's `Position` property):**
| Figma pointer | OutSystems position | CSS class on balloon |
|---|---|---|
| Top (default) | Bottom | `.bottom` — arrow points up ▲ |
| Bottom | Top | `.top` — arrow points down ▼ |
| Left | Right | `.right` — arrow points left ◀ |
| Right | Left | `.left` — arrow points right ▶ |

**Balloon styling:**
- Container: `border-radius: 2px`, `padding: 2px 8px`
- Text: Open Sans, 14px, weight 400, line-height 1.25
- Arrow: 8×4 px CSS `clip-path` triangle (4×8 px for left/right), color matches bg
- Shadow (Light only): `filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.1))` — applied on the balloon wrapper so the shadow follows the arrow shape

**Accessibility (free, no design change required):**
- Focus ring on `.osui-tooltip__content:focus-visible` — 2px blue-70 outline
- `prefers-reduced-motion` disables balloon transition

## Steps in OutSystems

1. Open the **ODC Theme** and paste the updated `dist/theme.css` content into the theme editor.
2. In any screen, drag a **Tooltip** pattern widget (OutSystems UI patterns → Tooltip).
3. Set the Tooltip `Position` property (Bottom / Top / Left / Right) to control arrow direction.
4. For the **Light** variant, set `ExtendedClass = "loop-tooltip--light"`.
5. Publish to a real browser and verify hover/focus triggers the balloon correctly.

## Finding

| ID | Severity | Issue |
|---|---|---|
| FND-027 | low | Light-mode shadow `0px 2px 2px rgba(0,0,0,0.1)` has no matching scale token. Implemented exact Figma value as `--loop-tooltip-light-shadow`. Pending design confirmation of a shallow shadow token. |
