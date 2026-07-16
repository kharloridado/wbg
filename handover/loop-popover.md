# Handover — Popover (restyle native OutSystems UI `[data-popover]` widget)

The Loop **Popover** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Popover" [node 26345-2762].

**Approach:** This does NOT introduce a custom popover Web Component. It **restyles the
native OutSystems UI Popover widget** (`[data-popover] > .popover-bottom`) to The Loop
design and **adds the Figma pointer triangle** as a CSS pseudo-element. Developers keep
using the standard OutSystems **Popover**; the theme makes it look like The Loop. No
Web Component, no parallel class system, upgrade-safe.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Popover page.

**What it is.** The Loop popover — the native OutSystems Popover widget restyled into a
floating white card (4px radius, drop shadow, 16px padding, 320px wide) with a pointer.

**When to use**
- Reveal extra content or actions **on demand**, anchored to a control — info panels, small forms, secondary content (e.g. an info-icon → "Notifications" card).

**When not to use** (reach for instead)
- A short text hint → **Tooltip**.
- A menu of actions → **Button Dropdown**.
- A page-level banner → **System Alert**.
- A persistent inline notice → **Note**.

**How to use**
- Use the native **Popover** widget; put the trigger in the top slot and the card
  content (a `.heading6` title + body text, optional `×` dismiss) in the bottom slot.
  The theme styles `.popover-bottom` into the card and draws the pointer.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-popover.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/component-popover.css` → `dist/theme.css` | Theme CSS (adds `--loop-popover-*` metrics) |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-popover.css</code> → Theme CSS — paste below OutSystems UI</summary>

```css
/* loop-popover.css — Popover: native [data-popover] restyle (.popover-bottom panel + CSS pointer triangle) */

/* ---- The floating panel IS the Figma card ---- */
[data-popover] > .popover-bottom {
  position:      relative;   /* anchor for the pointer pseudo-element */
  box-sizing:    border-box;
  width:         var(--loop-popover-width, 320px);
  max-width:     var(--loop-popover-width, 320px);
  min-width:     auto;

  background-color: var(--loop-popover-bg, #fff);
  border:        0;   /* no border — shadow only */
  border-radius: var(--loop-popover-radius, 4px);
  box-shadow:    var(--loop-popover-shadow, 0px 2px 3px rgba(0, 0, 0, 0.12));
  padding:       var(--loop-popover-padding-v, 16px) var(--loop-popover-padding-h, 16px);

  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size:   var(--loop-popover-body-size, 12px);
  font-weight: var(--loop-popover-body-weight, 400);
  line-height: var(--loop-popover-body-leading, 18px);
  color:       var(--loop-popover-body-color, rgba(0, 13, 26, 0.7));
}

/* ---- Title — author marks it .heading6; scoped so the global .heading6 utility is untouched ---- */
[data-popover] > .popover-bottom .heading6 {
  font-family:    var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size:      var(--loop-popover-title-size, 14px);
  font-weight:    var(--loop-popover-title-weight, 700);
  line-height:    var(--loop-popover-title-leading, 20px);
  letter-spacing: var(--loop-popover-title-tracking, 0.25px);
  color:          var(--loop-popover-title-color, rgba(0, 13, 26, 0.96));
}

/* Optional divider under the title — opt-in via .loop-popover--divided */
[data-popover] > .popover-bottom.loop-popover--divided .heading6 {
  padding-bottom: var(--loop-popover-header-gap, 16px);
  border-bottom:  1px solid var(--loop-popover-divider-color, rgba(0, 57, 107, 0.16));
  margin-bottom:  var(--loop-popover-header-gap, 16px);
}

/* ---- Pointer triangle — CSS border-triangle in the panel's own bg; points up by default ---- */
[data-popover] > .popover-bottom::before {
  content:  "";
  position: absolute;
  bottom:   100%;
  left:     var(--loop-popover-pointer-offset, 24px);
  width:    0;
  height:   0;
  border-left:   calc(var(--loop-popover-pointer-w, 18px) / 2) solid transparent;
  border-right:  calc(var(--loop-popover-pointer-w, 18px) / 2) solid transparent;
  border-bottom: var(--loop-popover-pointer-h, 8px) solid var(--loop-popover-bg, #fff);
}

/* Centred panel → centred pointer. */
[data-popover] > .popover-bottom.align-center::before {
  left:      50%;
  transform: translateX(-50%);
}

/* Panel flipped above the trigger → pointer flips to the bottom edge, points down. */
[data-popover] > .popover-bottom.align-bottom::before {
  bottom:        auto;
  top:           100%;
  border-bottom: 0;
  border-top:    var(--loop-popover-pointer-h, 8px) solid var(--loop-popover-bg, #fff);
}

/* Panel to the RIGHT of the trigger → arrow on the left edge, points left toward trigger.
   Apply via ExtendedClass on the popover trigger: loop-popover--left */
[data-popover] > .popover-bottom.loop-popover--left::before {
  bottom:        auto;
  left:          auto;
  right:         100%;
  top:           var(--loop-popover-pointer-offset, 24px);
  border-left:   0;
  border-right:  var(--loop-popover-pointer-h, 8px) solid var(--loop-popover-bg, #fff);
  border-top:    calc(var(--loop-popover-pointer-w, 18px) / 2) solid transparent;
  border-bottom: calc(var(--loop-popover-pointer-w, 18px) / 2) solid transparent;
}

/* Panel to the LEFT of the trigger → arrow on the right edge, points right toward trigger.
   Apply via ExtendedClass on the popover trigger: loop-popover--right */
[data-popover] > .popover-bottom.loop-popover--right::before {
  bottom:        auto;
  right:         auto;
  left:          100%;
  top:           var(--loop-popover-pointer-offset, 24px);
  border-right:  0;
  border-left:   var(--loop-popover-pointer-h, 8px) solid var(--loop-popover-bg, #fff);
  border-top:    calc(var(--loop-popover-pointer-w, 18px) / 2) solid transparent;
  border-bottom: calc(var(--loop-popover-pointer-w, 18px) / 2) solid transparent;
}

/* ---- Dismiss (×) affordance, when the author places one in the title row ---- */
[data-popover] > .popover-bottom .close,
[data-popover] > .popover-bottom [data-dismiss] {
  color:  var(--loop-popover-dismiss-color, #4b5e71);
  cursor: pointer;
}

/* ---- Focus indicator on the trigger (WCAG 2.2 SC 2.4.7 / 2.4.11) ---- */
[data-popover] > .popover-top:focus-visible {
  outline:        2px solid var(--loop-popover-focus, #004370);
  outline-offset: 2px;
  border-radius:  2px;
}

/* ---- Reduced motion (WCAG 2.2 SC 2.3.3) — OS UI fades the panel on open ---- */
@media (prefers-reduced-motion: reduce) {
  [data-popover] > .popover-bottom { transition: none; }
}
```

</details>

## What the override builds

**The floating panel (`.popover-bottom`) → the Figma card:**
- White background, **no border** (Figma uses shadow only), `border-radius: 4px`
- Drop shadow `0px 2px 3px rgba(0,0,0,0.12)`
- Padding `16px`, width `320px` (override per-instance via `--loop-popover-width`)
- Body text: Open Sans, 12px / 18px, `Text/On Light/Default`
- Title (`.heading6` inside the panel): 14px **Bold** / 20px, `+0.25px` tracking, `Text/On Light/Headers`

**Pointer (Figma `.dls Pointer`, 18×8):** drawn as `.popover-bottom::before`, a pure CSS
border-triangle in the card's own background colour (so it recolours for free, zero layout).
| Panel placement | Class on `.popover-bottom` | Pointer |
|---|---|---|
| Below the trigger (default) | _(none)_ | Points **up** ▲ off the top edge, 24px from the leading edge |
| Below, centred on trigger | `.align-center` | Points **up** ▲, centred |
| Above the trigger (flipped) | `.align-bottom` | Points **down** ▼ off the bottom edge |

**Optional divider** under the title (Figma "with title" variant): add
`loop-popover--divided` to `.popover-bottom`.

**Accessibility (free, no design change required):**
- Focus ring on `.popover-top:focus-visible` — 2px `Outline/On Light/Link/Enabled` (`#004370`)
- `prefers-reduced-motion` disables the open transition

## Example markup (the goal use case)

```html
<div data-popover class="popover popover-expanded">
  <div class="popover-top" tabindex="0">
    Show Popover
    <i class="icon ThemeGrid_MarginGutter fa fa-sort-desc fa-1x" aria-hidden="true" data-icon></i>
  </div>
  <div data-container class="popover-bottom align-center">
    <div data-container class="heading6" style="margin-bottom: 16px;">Notifications</div>
    <div data-container>
      <span style="font-weight: bold;">Fannie Woods</span> has received your request.
      You’ll be notified soon.<br>September 28, 12:09PM<br>
    </div>
  </div>
</div>
```

## Steps in OutSystems

1. Open the **ODC Theme** and paste the updated `dist/theme.css` content into the theme editor.
2. In any screen, drop the OutSystems **Popover** widget; put the trigger in the top
   placeholder and the card content (title + body) in the bottom placeholder.
3. Set the Popover **Position / alignment** — the theme flips the pointer to match
   (`.align-bottom` → pointer down; `.align-center` → pointer centred).
4. For the title divider, add `loop-popover--divided` to the popover (ExtendedClass).
5. Publish to a real browser and verify the card, shadow, pointer, and dismiss.

## Finding

| ID | Severity | Issue |
|---|---|---|
| — | low | Figma drop-shadow `0px 2px 3px rgba(0,0,0,0.12)` has no matching scale token (`--shadow-low` = `0 2px 8px --shadow-color`). Implemented the exact Figma value as `--loop-popover-shadow`. Same shape as tooltip FND-027 — pending a shallow shadow token from design. |

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for Popover to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-popover.css, dist/tokens.css and dist/theme.css are already pasted into the ODC
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