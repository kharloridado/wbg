# Handover — Tooltip (restyle native OutSystems UI `.osui-tooltip` pattern)

The Loop **Tooltip** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Tooltip" [node 17874-7113].

**Approach:** This does NOT introduce a custom tooltip class. It **restyles the native
OutSystems UI Tooltip pattern** (`.osui-tooltip` / `.osui-balloon`) to The Loop design.
Developers keep using the standard OutSystems **Tooltip** pattern; the theme makes it
look like The Loop. No Web Component.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Tooltip page.

**What it is.** The Loop tooltip — native OutSystems Tooltip pattern restyled.

**When to use**
- Brief, supplementary text revealed on hover/focus — label clarifications, icon-button names, terse help.

**When not to use** (reach for instead)
- Rich content or actions → **Popover**.
- Persistent guidance → **Note**.
- A page-level message → **System Alert**.

**How to use**
- Use the native **Tooltip** pattern; set the content and position.

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
/* loop-tooltip.css — Tooltip: native OutSystems UI Tooltip restyle via its custom props + the Balloon Feature */

/* ---- Per-variant fill + text (Dark default; Light via ExtendedClass) ----
   --osui-tooltip-background-color feeds both the bubble and the arrow; --_tt-text is the bubble text colour. */
.osui-tooltip {
  --osui-tooltip-background-color: var(--loop-tooltip-dark-bg, var(--color-black, #000));
  --_tt-text: var(--loop-tooltip-dark-text, var(--color-gray-alpha-white-90, rgba(255,255,255,.9)));
  /* Dark variant has no shadow. */
  --osui-balloon-shadow: none;
  /* Arrow is the native rotated square; side = visible height × √2, so the visible triangle resolves to 8×4. */
  --osui-tooltip-arrow-size: calc(var(--loop-tooltip-arrow-height, 4px) * 1.41421356);
}

.osui-tooltip.loop-tooltip--light {
  --osui-tooltip-background-color: var(--loop-tooltip-light-bg, var(--color-white, #fff));
  --_tt-text: var(--loop-tooltip-light-text, var(--color-text-on-light-default, rgba(0,13,26,.7)));
  --osui-balloon-shadow: var(--loop-tooltip-light-shadow, 0px 2px 2px rgba(0,0,0,.1));
}

/* ---- The visible bubble IS .osui-balloon (the wrapper), not the inner span ----
   The block emits an inline --osui-balloon-shape on this element, and inline custom
   props beat stylesheet ones, so we set border-radius directly instead of overriding that var. */
.osui-tooltip .osui-balloon {
  background-color: var(--osui-tooltip-background-color);
  border-radius:    var(--loop-tooltip-radius, 2px);   /* set directly: inline --osui-balloon-shape would win otherwise */
  box-shadow:       var(--osui-balloon-shadow, none);
  padding: var(--loop-tooltip-padding-block, 2px) var(--loop-tooltip-padding-inline, 8px);

  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size:   var(--loop-tooltip-font-size, 14px);
  font-weight: var(--loop-tooltip-font-weight, 400);
  line-height: var(--loop-tooltip-line-height, 1.25);
  color:       var(--_tt-text);
  white-space: nowrap;   /* single-line; overrides native wrap + max-width:250px */
}

/* ---- Arrow: keep the native rotated-square mechanism (positioned by OS JS); do NOT clip-path it or branch on placement classes. ---- */
.osui-tooltip__balloon-arrow {
  position:         absolute;
  width:            var(--osui-tooltip-arrow-size);
  height:           var(--osui-tooltip-arrow-size);
  background-color: var(--osui-tooltip-background-color);
  transform:        rotate(45deg);
}

/* ---- Focus indicator on the trigger ---- */
.osui-tooltip__content:focus-visible {
  outline:        2px solid var(--color-outline-on-light-link-enabled, var(--color-blue-70, #004370));
  outline-offset: 2px;
  border-radius:  2px;
}

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .osui-tooltip .osui-balloon,
  .osui-tooltip .osui-balloon--is-open { transition: none; }
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

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for Tooltip to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-tooltip.css and dist/theme.css are already pasted into the ODC
Theme editor (below OutSystems UI). The look is pure CSS + tokens — there is nothing for
you to style, and you must not write or edit CSS.

Task — this component RESTYLES a native OutSystems widget, so the work is using the right
widget, not generating styles. Referencing elements by name:
1. Use the native OutSystems widget this maps to (see this handover's "When to use" /
   "Variant mapping" section), not a custom element.
2. Apply each variant via the Extended Class property only (e.g. ExtendedClass =
   "<documented-modifier>") — never mutate OutSystems UI internals.
3. Build any screen/Block logic the screen needs around it.

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values. After
generating, list what you created by name and flag anything you could not finish.
```