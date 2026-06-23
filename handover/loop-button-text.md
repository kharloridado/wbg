# Handover — Button Text (native `.btn` + `btn-text` modifier)

The Loop **Button Text** — a link-style text button.
Figma: "Button Text" [node 15597-4652].

**Approach:** Restyle the native OutSystems UI Button (`.btn`) with a single `btn-text`
modifier (OutSystems UI has no native text/link button style). Apply via the Button
widget's **Extended Class = `btn-text`**.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Button Text page.

**What it is.** A link-style text button — native `.btn` with the `btn-text` modifier.

**When to use**
- Low-emphasis inline actions that read like a link — "Learn more", "Edit", "Cancel".
- Inside dense layouts: table rows, card footers, toolbars, form rows.

**When not to use** (reach for instead)
- The main call-to-action → **Button** (Primary).
- Real navigation between pages → a standard **Link**.
- A menu of actions → **Button Dropdown**.

**How to use**
- Use the native **Button** widget, Extended Class = `btn-text`.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-button-text.css` | Theme CSS (paste below OutSystems UI) |
| `tokens/*` → `dist/theme.css` | adds `--color-focus-keyboard-on-light` (#b6490c) |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-button-text.css</code> → Theme CSS — paste below OutSystems UI</summary>

```css
/* ============================================
   Component: Button Text  ("The Loop" — loop/button/text)
   Figma: "Button Text" [node:15597-4652]

   A link-style text button: no fill, no border, blue-70 label. Distinct from the
   Button's GHOST variant (which keeps button padding + a light hover fill); Button
   Text is inline/link-like and gets a dedicated high-contrast ORANGE keyboard-focus
   ring (Keyboard Focus/On Light #b6490c) instead of the blue ring used elsewhere.

   Approach: RESTYLE the native OutSystems UI Button (.btn) with a `btn-text` modifier
     — OutSystems UI has no native text/link button style, so this is the one added
     modifier (apply via the Button widget's Extended Class = "btn-text").
   Location: Theme CSS (paste below OutSystems UI so it wins).
   Escalation Level: L2 (native widget + token-driven modifier)

   Tokens: --space-button-gap, --space-xxsmall, --font-family-label, --font-weight-bold,
     --font-size-300, --letter-spacing-button, --line-height-button-text,
     --color-text-on-light-link-primary-enabled, --color-blue-90,
     --color-text-on-light-link-underline-{enabled,hover,disabled},
     --color-bg-link-primary-disabled (Text/On Light/Link/Disabled #8a9db1),
     --color-focus-keyboard-on-light.

   Fidelity note: in Figma the label is a true link — it is UNDERLINED in every state
     (2px), not only on hover. The underline color shifts per state (rest = blue-70 @55%,
     hover = blue-40, disabled = neutral-15); the label color itself stays blue-70 on hover.
   ============================================ */

.btn-text {
  min-height: 44px;                                    /* WCAG 2.2 SC 2.5.8 target size (implementation-level) */
  height: auto;
  gap: var(--space-button-gap, 6px);
  padding: var(--space-xxsmall, 8px);                  /* minimal click padding around the label */

  background-color: transparent;
  border: 0px;
  color: var(--color-text-on-light-link-primary-enabled);   /* blue-70 #004370 */

  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-weight: var(--font-weight-bold, 700);
  font-size: var(--font-size-300, 16px);
  line-height: var(--line-height-button-text, 1.9);
  letter-spacing: var(--letter-spacing-button, -0.5px);

  /* Permanent link underline (Figma: every state) — 2px, blue-70 @ 55% at rest */
  text-decoration-line: underline;
  text-decoration-thickness: 2px;
  text-decoration-color: var(--color-text-on-light-link-underline-enabled);  /* #0043708c */
}

/* Hover — keep the blue-70 label; brighten the underline to blue-40 (Figma #169af3) */
.btn-text:hover {
  filter: none;
  color: var(--color-text-on-light-link-primary-enabled);   /* blue-70 — stays */
  text-decoration-color: var(--color-text-on-light-link-underline-hover);    /* blue-40 #169af3 */
}
.desktop .btn-text:hover  { filter: none; }
.btn-text:active          { color: var(--color-blue-90); }   /* Blue/90 #012740 (Link Pressed) */

/* Disabled — Text/On Light/Link/Disabled #8a9db1 (neutral-40); underline neutral-15 */
.btn-text[disabled],
.btn-text[aria-disabled="true"] {
  background-color: transparent;
  color: var(--color-bg-link-primary-disabled);              /* #8a9db1 */
  text-decoration-line: underline;
  text-decoration-color: var(--color-text-on-light-link-underline-disabled); /* #dae3eb */
}

/* Focus indicator (WCAG 2.2 SC 2.4.7/2.4.13) — The Loop's dedicated high-contrast
   ORANGE keyboard-focus ring (not the blue used on filled/outlined buttons). */
.btn-text:focus-visible {
  outline: 2px solid var(--color-focus-keyboard-on-light, #b6490c);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .btn-text { transition: none; }
}
```

</details>

































## What it does
- No fill, no border; **blue-70** label, Open Sans **700**, tracking **-0.5px**, leading **1.9**.
- **Underlined in every state** (true link affordance, 2px) — the underline color shifts: rest = blue-70 @55% (`#0043708c`), hover = Blue/40 (`#169af3`), disabled = Neutral/15 (`#dae3eb`). The label color stays blue-70 on hover; pressed = Blue/90.
- Disabled label = `#8a9db1`.
- **Dedicated high-contrast ORANGE keyboard-focus ring** (`#b6490c`) — distinct from the blue ring on filled/outlined buttons (faithful to Figma `Keyboard Focus/On Light`).
- Distinct from the Button's **ghost** variant (which keeps button padding + a light hover fill).

## Checklist
- [ ] Rebuild + paste latest `dist/theme.css` (carries the focus token).
- [ ] Paste `loop-button-text.css` into Theme CSS, below OutSystems UI.
- [ ] Use the native **Button** widget with Extended Class = `btn-text`.
- [ ] 1-Click Publish → validate in a **real browser**.

## Open findings linked to this work
- **FND-015** (design-token, low) — `Keyboard Focus/On Light #b6490c` / `On Dark #f5926c` have no orange primitive. Built faithfully as a literal. Register-only.
- **FND-033** (design-token, low) — the at-rest underline is a raw `rgba(0,67,112,0.55)` (blue-70 @55%) with no Figma variable / WBG primitive. Built faithfully as `--color-text-on-light-link-underline-enabled: #0043708c`. Register-only.
