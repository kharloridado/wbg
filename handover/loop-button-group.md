# Handover — Button Group + Button Switch (restyle native `.button-group`)

The Loop **Button Group** and **Button Switch** styling.
Figma: "Button Group" [node 15597-2978] · "Button Switch" [node 15597-4070].

**Design note:** per review, the **Button Switch IS a Button Group** (a 2-option segmented
group). Same widget, same classes — one file covers both (#27 and #28).

**Approach:** Restyle the native OutSystems UI **Button Group** widget
(`.button-group` / `.button-group-item` / `.button-group-selected-item`). Devs use the
standard OutSystems ButtonGroup widget; no custom class system.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Button Group page.

**What it is.** A segmented control — native ButtonGroup restyled. The **Button Switch** is just the 2-option case.

**When to use**
- Pick **one** option from a small set (2–5) where all options should stay visible at once — view toggles, segmented filters, an A/B switch.

**When not to use** (reach for instead)
- Many options → **Dropdown / Select**.
- A single on/off setting → **Switch**.
- Independent multi-select → **Checkbox** or **Tag**.
- Firing actions rather than selecting → individual **Buttons**.

**How to use**
- Use the native **ButtonGroup** widget; the selected item carries `.button-group-selected-item` (driven by OutSystems logic). Button Switch = a 2-item group.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-button-group.css` | Theme CSS (paste below OutSystems UI) |
| `tokens/*` → `dist/theme.css` | adds `--radius-xs` (2px joined inner corners) |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-button-group.css</code> → Theme CSS — paste below OutSystems UI</summary>

```css
/* loop-button-group.css — Button Group / Button Switch: native .button-group restyle */

/* ---- Item — outlined (non-selected) look; Regular height (40px) ---- */
.button-group-item {
  display: inline-flex;                   /* deterministic vertical centring in the pinned box */
  align-items: center;
  justify-content: center;
  height: var(--loop-btn-h-regular, 40px); /* pinned fixed height so the border never grows the box */
  padding-block: 0;
  padding-inline: var(--space-medium, 32px);

  background-color: var(--color-bg-link-secondary-enabled);
  border: 1px solid var(--color-outline-on-light-link-enabled);
  color: var(--color-text-on-light-link-primary-enabled);

  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-weight: var(--font-weight-bold, 700);
  font-size: var(--font-size-300, 16px);
  line-height: var(--line-height-base, 1.5);
  letter-spacing: var(--letter-spacing-button, -0.5px);

  /* middle items: all corners joined (inner) — 2px */
  border-radius: var(--radius-xs, 2px);
}

/* collapse the shared border (keep native behaviour explicit) */
.button-group-item:not(:first-child) {
  border-left: 0px;
}

/* end caps: outer corners pill, inner corners 2px */
.button-group-item:first-child {
  border-radius: var(--radius-pill, 32px) var(--radius-xs, 2px) var(--radius-xs, 2px) var(--radius-pill, 32px);
}
.button-group-item:last-child {
  border-radius: var(--radius-xs, 2px) var(--radius-pill, 32px) var(--radius-pill, 32px) var(--radius-xs, 2px);
}
/* single item (first === last): fully pill */
.button-group-item:first-child:last-child {
  border-radius: var(--radius-pill, 32px);
}

/* ---- Selected — filled blue-70 (like Primary) ---- */
.button-group-selected-item,
.button-group-item.button-group-selected-item {
  background-color: var(--color-bg-link-primary-enabled);
  border-color: var(--color-bg-link-primary-enabled);
  color: var(--color-white, #ffffff);
}

/* ---- Disabled ---- */
.button-group-item[disabled],
.button-group-item[aria-disabled="true"] {
  background-color: var(--color-bg-link-secondary-disabled);
  border-color: var(--color-text-on-light-state-disabled);
  color: var(--color-text-on-light-state-disabled);
}
.button-group-item[disabled].button-group-selected-item {
  background-color: var(--color-text-on-light-state-disabled);
  color: var(--color-white, #ffffff);
}

/* ---- Focus indicator (WCAG 2.2 SC 2.4.7) — brand blue, raised above neighbours ---- */
.button-group-item:focus-visible {
  outline: 2px solid var(--color-outline-on-light-link-enabled, var(--color-blue-70));
  outline-offset: 2px;
  position: relative;
  z-index: 1;
}
```

</details>

## What the override changes vs OutSystems UI baseline
- Outer end-caps = pill **32px**; joined inner corners = **2px** (`--radius-xs`, Figma `Button/Border Raduis = 2`).
- Outlined items in **blue-70**; **selected item filled blue-70** + white label.
- Open Sans **700**, tracking **-0.5px**, padding 16/32.
- Shared border collapse (native behaviour) kept explicit; focus ring raised above neighbours.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for ButtonGroup to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-button-group.css and dist/theme.css are already pasted into the ODC
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

## Checklist
- [ ] Rebuild + paste latest `dist/theme.css` (carries `--radius-xs`).
- [ ] Paste `loop-button-group.css` into Theme CSS, below OutSystems UI.
- [ ] Use the native **Button Group** widget; mark the active item (`button-group-selected-item`).
- [ ] For a Switch, use a 2-item group.
- [ ] 1-Click Publish → validate in a **real browser** (never Service Studio Preview).

## Open findings linked to this work
- Shares **FND-013** (off-scale button gap/tracking) via the reused button label tokens.
- **FND-043** (consistency/fidelity, medium) — the Button Group default item height is **Regular
  (40px)**, reconciled from the Figma default instance's **xLarge (56px)** to align the button
  family (parallel to Button, Text Field FND-021, Checkbox FND-038). Built as Regular/40 per
  stakeholder direction; reconciliation disclosed here and in the Button handover. See
  `findings/findings-register.md` (FND-043).
