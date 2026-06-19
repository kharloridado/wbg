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

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-tooltip.css</code> → Theme CSS — paste below OutSystems UI</summary>

```css
/* ============================================
   Component: Tooltip  ("The Loop" — loop/tooltip)
   Figma: -The Loop- Main Library · "Tooltip" [node:17874-7113]
   Approach: RESTYLE the native OutSystems UI Tooltip pattern (.osui-tooltip)
             — NOT a parallel class system. Devs use the standard OutSystems
             Tooltip pattern; this theme override makes it render as The Loop
             tooltip.
   Location: Theme CSS (paste below OutSystems UI so it wins on equal specificity).

   OutSystems DOM structure (captured from published screen — tooltip.md):
     .osui-tooltip                              — pattern wrapper
       .osui-tooltip__content                   — trigger slot (any developer content)
       .osui-tooltip__balloon-wrapper           — floating balloon (positioned by OS JS)
         .osui-tooltip__balloon-wrapper__balloon  — visible bubble (text container)
         .osui-tooltip__balloon-arrow             — pointer triangle (position set inline by OS JS)
   Position class on .osui-tooltip__balloon-wrapper: .bottom | .top | .left | .right

   Variant mapping (Figma "type" → OutSystems ExtendedClass):
     (none / default)          → Dark  (black bg, white text)
     .loop-tooltip--light      → Light (white bg, dark text + drop-shadow)
   Apply via the Tooltip pattern's "ExtendedClass" property.

   Tokens consumed: --loop-tooltip-dark-bg, --loop-tooltip-dark-text,
     --loop-tooltip-light-bg, --loop-tooltip-light-text, --loop-tooltip-light-shadow,
     --loop-tooltip-radius, --loop-tooltip-padding-block, --loop-tooltip-padding-inline,
     --loop-tooltip-font-size, --loop-tooltip-font-weight, --loop-tooltip-line-height,
     --loop-tooltip-arrow-width, --loop-tooltip-arrow-height.

   Finding:
     FND-027 [design-token/low] — Light-mode drop-shadow 0px 2px 2px rgba(0,0,0,0.1)
     has no matching scale token (--shadow-low = 0 2px 8px, different blur + color).
     Implemented exact Figma value; waiting on token from design.
   ============================================ */

/* ---- Cascade context: per-variant bg/text private properties ---- */
.osui-tooltip {
  --_tt-bg:   var(--loop-tooltip-dark-bg,   var(--color-black, #000));
  --_tt-text: var(--loop-tooltip-dark-text, var(--color-gray-alpha-white-90, rgba(255,255,255,.9)));
}
.osui-tooltip.loop-tooltip--light {
  --_tt-bg:   var(--loop-tooltip-light-bg,   var(--color-white, #fff));
  --_tt-text: var(--loop-tooltip-light-text,  var(--color-text-on-light-default, rgba(0,13,26,.7)));
}

/* ---- Balloon bubble ---- */
.osui-tooltip__balloon-wrapper__balloon {
  background-color: var(--_tt-bg);
  border-radius:    var(--loop-tooltip-radius, 2px);
  padding:          var(--loop-tooltip-padding-block, 2px) var(--loop-tooltip-padding-inline, 8px);

  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size:   var(--loop-tooltip-font-size, 14px);
  font-weight: var(--loop-tooltip-font-weight, 400);
  line-height: var(--loop-tooltip-line-height, 1.25);
  color:       var(--_tt-text);
  white-space: nowrap;
}

/* ---- Light variant: drop-shadow applied to the full balloon+arrow cluster ---- */
.osui-tooltip.loop-tooltip--light .osui-tooltip__balloon-wrapper {
  filter: drop-shadow(var(--loop-tooltip-light-shadow, 0px 2px 2px rgba(0,0,0,.1)));
}

/* ---- Arrow (triangle) ---- */
.osui-tooltip__balloon-arrow {
  width:            var(--loop-tooltip-arrow-width, 8px);
  height:           var(--loop-tooltip-arrow-height, 4px);
  background-color: var(--_tt-bg);
  position:         absolute;
}

/* bottom balloon (arrow above bubble, pointing up ▲) */
.osui-tooltip__balloon-wrapper.bottom .osui-tooltip__balloon-arrow {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

/* top balloon (arrow below bubble, pointing down ▼) */
.osui-tooltip__balloon-wrapper.top .osui-tooltip__balloon-arrow {
  clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
}

/* left/right balloons — element is taller than wide (4px × 8px) */
.osui-tooltip__balloon-wrapper.left  .osui-tooltip__balloon-arrow,
.osui-tooltip__balloon-wrapper.right .osui-tooltip__balloon-arrow {
  width:  var(--loop-tooltip-arrow-height, 4px);
  height: var(--loop-tooltip-arrow-width, 8px);
}

/* right balloon (arrow at left side, pointing left ◀) */
.osui-tooltip__balloon-wrapper.right .osui-tooltip__balloon-arrow {
  clip-path: polygon(100% 0%, 100% 100%, 0% 50%);
}

/* left balloon (arrow at right side, pointing right ▶) */
.osui-tooltip__balloon-wrapper.left .osui-tooltip__balloon-arrow {
  clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
}

/* ---- Focus indicator on the trigger (WCAG 2.2 SC 2.4.7 / 2.4.11) ---- */
.osui-tooltip__content:focus-visible {
  outline:        2px solid var(--color-outline-on-light-link-enabled, var(--color-blue-70, #004370));
  outline-offset: 2px;
  border-radius:  2px;
}

/* ---- Reduced motion (WCAG 2.2 SC 2.3.3) ---- */
@media (prefers-reduced-motion: reduce) {
  .osui-tooltip__balloon-wrapper { transition: none; }
}
```

</details>

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
