# Handover — Tabs (restyle native OutSystems UI Tabs widget)

The Loop **Tabs / Tab Group** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Tabs" [node 18686-5559].

**Approach:** This does NOT introduce a custom tabs Web Component. It **restyles the
native OutSystems UI Tabs pattern** (`.osui-tabs` / `.osui-tabs__header-item` /
`.osui-tabs__header__indicator`) into The Loop **underline** look. Developers keep using
the standard OutSystems **Tabs** widget; the theme repaints it. No Web Component, no
parallel class system, upgrade-safe.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Tabs page.

**What it is.** The Loop tabs — a row of bold labels with a full-width 2px divider beneath
and a 4px bright-blue active bar under the selected tab. Inactive labels are blue-70 links;
the active label darkens to emphasis; hover darkens and shows a 2px underline.

**When to use**
- Switch between **peer views of the same context** in place — sections of a page, related
  lists, content filters (e.g. "News, stories and blogs").

**When not to use** (reach for instead)
- Navigate to a different page/area → app **navigation / menu**, not tabs.
- One-of-many in a form → **Radio Button** or **Button Group**.
- Progressive disclosure of stacked sections → **Accordion**.

**How to use**
- Use the native **Tabs** widget (horizontal). Put each tab's label in its header item and
  the panel content in the matching content item. The theme styles the header row, divider,
  and active bar; the widget owns selection, keyboard nav, and the moving indicator.
- Sizing: header labels are **x-large** (20px desktop) → **large** (18px) on tablet+mobile.
  The content-panel body text steps **20 → 18 → 16px** (desktop → tablet → mobile). Both are
  keyed on OutSystems' runtime body classes `.tablet` (≤1024px) / `.phone` (≤700px). Note the
  header holds 18px on mobile while the content drops to 16px — separate sizes by design.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-tabs.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/component-tabs.css` → `dist/theme.css` | Theme CSS (adds `--loop-tabs-*` metrics) |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-tabs.css</code> → Theme CSS — paste below OutSystems UI</summary>

```css
/* loop-tabs.css — Tabs: native OutSystems UI Tabs pattern restyle (underline tabs) */

/* ---- Header row: space the tabs ---- */
.osui-tabs--is-horizontal > .osui-tabs__header {
  column-gap: var(--loop-tabs-gap, 24px);
}

/* ---- Tab button — The Loop label identity + per-state color.
   Selector mirrors native OSUI's own `... > .osui-tabs__header .osui-tabs__header-item`
   (0,3,0) so The Loop geometry wins over native's `padding: var(--space-s) var(--space-base)`
   by source order — otherwise native forces 8px/16px padding and the tokens never apply. ---- */
.osui-tabs--is-horizontal > .osui-tabs__header .osui-tabs__header-item {
  gap: var(--loop-tabs-h-padding, 12px);                 /* icon ↔ label */
  padding-block: var(--loop-tabs-v-padding, 12px);       /* label ↔ active bar */
  padding-inline: 0;                                     /* the header column-gap handles tab separation */

  font-family: var(--loop-tabs-label-family, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-tabs-label-size, 20px);
  line-height: var(--loop-tabs-label-leading, 20px);
  letter-spacing: var(--loop-tabs-label-tracking, -0.13px);
  font-weight: var(--loop-tabs-label-weight, 700);       /* bold in every state */

  color: var(--loop-tabs-label-color, #004370);          /* inactive/enabled */
  text-shadow: none;                                     /* native fakes bold via text-shadow on active; labels are already 700 */
}

/* Hover (non-active): darken + 2px underline affordance, drawn inset so it adds no height. */
.osui-tabs--is-horizontal .osui-tabs__header-item:hover:not(.osui-tabs--is-active):not([disabled]) {
  color: var(--loop-tabs-label-color-hover, #012740);
  box-shadow: inset 0 calc(-1 * var(--loop-tabs-divider-size, 2px)) 0 0 var(--loop-tabs-indicator-color, #169af3);
}

/* Selected/active: darken to emphasis (the 4px bar is the indicator, below). */
.osui-tabs--is-horizontal .osui-tabs__header-item.osui-tabs--is-active {
  color: var(--loop-tabs-label-color-active, #012740);
}

/* Disabled: muted, no affordance. */
.osui-tabs--is-horizontal .osui-tabs__header-item[disabled] {
  color: var(--loop-tabs-label-color-disabled, #00294d6b);
}

/* ---- Active bar — 4px bright blue (native default is 2px) ---- */
.osui-tabs--is-horizontal .osui-tabs__header__indicator {
  height: var(--loop-tabs-indicator-size, 4px);
  background-color: var(--loop-tabs-indicator-color, #169af3);
}

/* ---- Divider beneath the header (the native content border-top) + content body text.
   The content panel renders body-medium copy that steps down per device (20/18/16),
   scoped here so it doesn't touch any other component (see per-device overrides below). ---- */
.osui-tabs--is-horizontal .osui-tabs__content {
  border-top: var(--loop-tabs-divider-size, 2px) solid var(--loop-tabs-divider-color, #00396b14);
  font-size: var(--loop-tabs-content-size, 20px);   /* desktop body-medium; tablet/phone step down below */
}

/* ---- Focus ring — brand blue ---- */
.osui-tabs__header-item:focus-visible {
  outline: 2px solid var(--color-domain-interactive-focused, #0071bc);
  outline-offset: -2px;   /* inset: the item fills its grid track edge-to-edge */
  border-radius: 2px;
}

/* ---- Compact (tablet / mobile): smaller label, tighter gap & padding.
   Keyed on OSUI's runtime body device classes (.tablet ≤1024px, .phone ≤700px) so Tabs
   steps down in lockstep with the rest of the library — not a standalone @media breakpoint.
   Explicit .tablet/.phone prefixes make each rule (0,3,0) so it beats the (0,2,0) base. ---- */
.tablet .osui-tabs--is-horizontal > .osui-tabs__header,
.phone  .osui-tabs--is-horizontal > .osui-tabs__header {
  column-gap: var(--loop-tabs-gap-compact, 20px);
}
.tablet .osui-tabs--is-horizontal .osui-tabs__header-item,
.phone  .osui-tabs--is-horizontal .osui-tabs__header-item {
  font-size: var(--loop-tabs-label-size-compact, 18px);
  line-height: var(--loop-tabs-label-leading-compact, 18px);
  gap: var(--loop-tabs-h-padding-compact, 10px);
  padding-block: var(--loop-tabs-v-padding-compact, 10px);
}
/* Content body text steps down per device (tablet 18 / phone 16) — differs from the
   header label (which holds 18 on both), so tablet & phone get separate rules. */
.tablet .osui-tabs--is-horizontal .osui-tabs__content {
  font-size: var(--loop-tabs-content-size-tablet, 18px);
}
.phone .osui-tabs--is-horizontal .osui-tabs__content {
  font-size: var(--loop-tabs-content-size-compact, 16px);
}

/* ---- Reduced motion: kill the sliding-bar animation ---- */
@media (prefers-reduced-motion: reduce) {
  .osui-tabs__header__indicator { transition: none; }
}
```

</details>

## What the override builds

**Header row & tab buttons (`.osui-tabs__header-item`):**
- Open Sans **700** in every state, 20px / 18px (compact), line-height 20 / 18 (compact), tracking −0.13
- 24px gap between tabs (20px compact); 12px vertical padding (10px compact)
- Color by state — Enabled blue-70 `#004370` · Hover/Selected emphasis `#012740` · Disabled muted

**Active bar (`.osui-tabs__header__indicator`):** 4px, blue-40 `#169af3` (native default is 2px). The widget sizes and slides it under the selected tab.

**Content panel (`.osui-tabs__content`):**
- Divider: 2px top border, `Divider/On Light/Subdued` `#00396b14`.
- Body text steps down per device — **20px desktop / 18px tablet / 16px mobile** (Figma body
  `Font-size/500` device axis). Scoped to the tabs content panel only, referencing the fixed
  scale steps `--font-size-500/400/300`, so no other component is affected. Note the header
  label holds **18px** on both tablet+mobile while the content drops to **16px** on mobile —
  they're separate sizes by design.

**Accessibility (free, no design change required):**
- Hover underline drawn with **inset box-shadow** — zero layout shift ([[border-no-height-shift]])
- Focus ring on `.osui-tabs__header-item:focus-visible` — 2px brand blue-50 `#0071bc` (FND-012)
- `prefers-reduced-motion` disables the sliding-bar transition
- Roving tabindex / `aria-selected` / arrow-key nav are owned by the native widget

## Example markup (rendered native OutSystems Tabs)

```html
<div class="osui-tabs osui-tabs--is-horizontal osui-tabs--has-auto-height">
  <div class="osui-tabs__header">
    <div class="osui-tabs__header-item osui-tabs--is-active">News</div>
    <div class="osui-tabs__header-item">Stories</div>
    <div class="osui-tabs__header-item">Blogs</div>
    <div class="osui-tabs__header-item" disabled>Archive</div>
    <span class="osui-tabs__header__indicator"></span>
  </div>
  <div class="osui-tabs__content">
    <div class="osui-tabs__content-item osui-tabs--is-active"><!-- panel 1 --></div>
    <div class="osui-tabs__content-item"><!-- panel 2 --></div>
    <div class="osui-tabs__content-item"><!-- panel 3 --></div>
    <div class="osui-tabs__content-item"><!-- panel 4 --></div>
  </div>
</div>
```

## Steps in OutSystems

1. Open the **ODC Theme** and paste the updated `dist/theme.css` content into the theme editor.
2. In any screen, drop the OutSystems **Tabs** widget (horizontal); add a header item +
   content item per tab.
3. Set the active tab; the theme renders the divider and slides the 4px blue bar under it.
4. No ExtendedClass needed for the default look — the restyle targets the native classes.
5. Publish to a real browser and verify labels, divider, active bar, hover underline, and
   the compact size on `.tablet`/`.phone` (≤1024/≤700px).

## Finding

| ID | Severity | Issue |
|---|---|---|
| — | low | Active-bar thickness **4px** has no `--border-size-*` step (s 1 / m 2 / l 3) and label tracking **−0.13px** is off the foundation tracking scale (−0.35 / −0.5 / −1.5). Both are real named Figma tokens, kept verbatim as `--loop-tabs-*` and flagged in `tokens/component-tabs.css` — register-only, pending a scale token from design. |

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for Tabs to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-tabs.css, dist/tokens.css and dist/theme.css are already pasted into the ODC
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