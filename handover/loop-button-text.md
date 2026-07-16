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
   Re-validated: 2026-06-29 (kharloridado review)

   A link-style text button: no fill, no border, blue-70 label, UNDERLINED IN EVERY
   STATE (only the underline colour shifts per state). Distinct from the Button's GHOST
   variant. Dedicated high-contrast ORANGE keyboard-focus ring (#b6490c).

   Approach: RESTYLE the native OutSystems UI Button (.btn) with a `btn-text` modifier.
     Apply via Button widget's Extended Class = "btn-text".
   Location: Theme CSS (paste below OutSystems UI so it wins).
   Escalation Level: L2 (native widget + token-driven modifier)

   Figma state summary (node:15597-4652):
     Enabled  — label #004370, underline rgba(0,67,112,0.55) 2px
     Hover    — label #004370 (unchanged), underline #169af3 (Blue/40)
     Disabled — label #8a9db1, underline #dae3eb (Neutral/15)
     Focus    — 1px solid #b6490c border-radius:2px outline (tight, offset 0)

   Tokens: --space-button-gap, --font-family-label, --font-weight-bold,
     --font-size-300, --letter-spacing-button,
     --color-text-on-light-link-primary-enabled,
     --color-text-on-light-link-underline-enabled,
     --color-blue-40, --color-neutral-15,
     --color-bg-link-primary-disabled,
     --color-focus-keyboard-on-light.
   ============================================ */

.btn-text {
  min-height: 44px;                                    /* WCAG 2.2 SC 2.5.8 target size */
  height: auto;
  gap: var(--space-button-gap, 6px);
  padding: 2px 2px 4px;                               /* Figma container: pt-2 pb-4 px-2 */

  background-color: transparent;
  border: 0;
  border-radius: 2px;                                  /* matches focus-ring radius */
  color: var(--color-text-on-light-link-primary-enabled, #004370);

  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-weight: var(--font-weight-bold, 700);
  font-size: var(--font-size-300, 16px);
  line-height: 1.9;                                    /* Figma: lh 1.9, not base 1.5 */
  letter-spacing: var(--letter-spacing-button, -0.5px);

  /* Underline in EVERY state — colour shifts per state via text-decoration-color */
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-decoration-color: var(--color-text-on-light-link-underline-enabled, rgba(0,67,112,0.55));
}

/* Hover — underline shifts to Blue/40; label colour stays blue-70 */
.btn-text:hover {
  filter: none;
  text-decoration-color: var(--color-blue-40, #169af3);
}
.desktop .btn-text:hover { filter: none; }

/* Disabled — Neutral/40 label, Neutral/15 underline */
.btn-text[disabled],
.btn-text[aria-disabled="true"] {
  background-color: transparent;
  color: var(--color-bg-link-primary-disabled, #8a9db1);
  text-decoration-color: var(--color-neutral-15, #dae3eb);
}

/* Focus indicator — tight 1px orange ring (Figma: Keyboard Focus/On Light #b6490c)
   outline inherits border-radius:2px in modern browsers (Chrome 94+, Firefox 92+). */
.btn-text:focus-visible {
  outline: 1px solid var(--color-focus-keyboard-on-light, #b6490c);
  outline-offset: 0;
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

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for ButtonText to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-button-text.css, dist/tokens.css and dist/theme.css are already pasted into the ODC
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
- [ ] Rebuild + paste latest `dist/theme.css` (carries the focus token).
- [ ] Paste `loop-button-text.css` into Theme CSS, below OutSystems UI.
- [ ] Use the native **Button** widget with Extended Class = `btn-text`.
- [ ] 1-Click Publish → validate in a **real browser**.

## Open findings linked to this work
- **FND-015** (design-token, low) — `Keyboard Focus/On Light #b6490c` / `On Dark #f5926c` have no orange primitive. Built faithfully as a literal. Register-only.
- **FND-033** (design-token, low) — the at-rest underline is a raw `rgba(0,67,112,0.55)` (blue-70 @55%) with no Figma variable / WBG primitive. Built faithfully as `--color-text-on-light-link-underline-enabled: #0043708c`. Register-only.
