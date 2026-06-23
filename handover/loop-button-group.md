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
/* ============================================
   Component: Button Group  ("The Loop" — loop/button/group)
   Also covers: Button Switch (loop/button/switch) — per design review, the
     Button Switch IS a Button Group (a 2-option segmented group). Same widget,
     same classes; a switch is just a group with two items.
   Figma: "Button Group" [node:15597-2978] · "Button Switch" [node:15597-4070]

   Approach: RESTYLE the native OutSystems UI Button Group widget
     (.button-group / .button-group-item / .button-group-selected-item) — NOT a
     parallel class system. Devs use the standard OutSystems ButtonGroup widget.
   Location: Theme CSS (paste below OutSystems UI so it wins).
   Escalation Level: L1/L2 (native widget + token-driven theme override)

   OutSystems UI v2.28.1 baseline (src/scss/03-widgets/_button-group.scss):
     .button-group-item               → outlined: white bg, 1px border 'primary', text 'primary', radius 0, h40
     :first-child                     → radius soft 0 0 soft (left rounded)
     :not(:first-child)               → border-left: none (collapse shared border)
     :last-child                      → radius 0 soft soft 0 (right rounded)
     .button-group-selected-item      → bg 'primary', text neutral-0 (filled)
     [disabled]                       → neutral

   The Loop overrides: pill OUTER corners (32px), 2px joined INNER corners
     (--radius-xs, per Figma "Button/Border Radius = 2" — see FND-004),
     Open Sans 700 / tracking -0.5, and WB blue-70 outline/text + blue-70 selected fill.

   Tokens: --radius-pill, --space-medium, --font-family-label,
     --font-weight-bold, --font-size-300, --letter-spacing-button,
     --color-outline-on-light-link-enabled, --color-text-on-light-link-primary-enabled,
     --color-bg-link-primary-enabled, --color-white, --color-text-on-light-state-disabled,
     --color-bg-link-secondary-disabled.

   Fidelity note: selected-item fill is blue-70 (#004370) on white text — passes AA.
     Non-selected outlined items reuse the secondary button treatment.
   ============================================ */

/* ---- Item — The Loop identity + outlined (non-selected) look ----
   Default item height is Regular (40px), matching the Button's Regular default. */
.button-group-item {
  min-height: 40px;                       /* Regular default per FND-043 (reconciled from Figma xLarge/56) */
  height: auto;
  padding: var(--space-xxsmall, 8px) var(--space-medium, 32px);

  background-color: var(--color-bg-link-secondary-enabled);     /* transparent */
  border: 1px solid var(--color-outline-on-light-link-enabled); /* blue-70 */
  color: var(--color-text-on-light-link-primary-enabled);       /* blue-70 */

  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-weight: var(--font-weight-bold, 700);
  font-size: var(--font-size-300, 16px);
  line-height: var(--line-height-base, 1.5);
  letter-spacing: var(--letter-spacing-button, -0.5px);

  /* middle items: all corners are joined (inner) — 2px (Figma Button/Border Radius = 2) */
  border-radius: var(--radius-xs, 2px);
}

/* collapse the shared border (keep native behaviour explicit) */
.button-group-item:not(:first-child) {
  border-left: 0px;
}

/* end caps: outer corners pill (32px), inner (joined) corners 2px (--radius-xs) */
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
  background-color: var(--color-bg-link-primary-enabled);   /* blue-70 */
  border-color: var(--color-bg-link-primary-enabled);
  color: var(--color-white, #ffffff);
}

/* ---- Disabled ---- */
.button-group-item[disabled],
.button-group-item[aria-disabled="true"] {
  background-color: var(--color-bg-link-secondary-disabled);   /* white */
  border-color: var(--color-text-on-light-state-disabled);     /* neutral-alpha-42 */
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
