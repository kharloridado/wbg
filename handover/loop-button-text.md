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
/* loop-button-text.css — Button Text: native .btn + .btn-text modifier (link-style text button) */

.btn-text {
  min-height: 44px;                                    /* WCAG 2.5.8 target floor (a min, not a fixed height) */
  height: auto;
  gap: var(--space-button-gap, 6px);
  padding: 6px var(--space-xxsmall, 8px);              /* vpad trimmed so the 1.9 line-height label stays within the 44px floor */

  background-color: transparent;
  border: 0px;
  color: var(--color-text-on-light-link-primary-enabled);

  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-weight: var(--font-weight-bold, 700);
  font-size: var(--font-size-300, 16px);
  line-height: var(--line-height-button-text, 1.9);
  letter-spacing: var(--letter-spacing-button, -0.5px);

  /* permanent link underline — 2px, blue-70 @ 55% at rest */
  text-decoration-line: underline;
  text-decoration-thickness: 2px;
  text-decoration-color: var(--color-text-on-light-link-underline-enabled);
}

/* Hover — keep the blue-70 label; brighten the underline to blue-40 */
.btn-text:hover {
  filter: none;
  color: var(--color-text-on-light-link-primary-enabled);
  text-decoration-color: var(--color-text-on-light-link-underline-hover);
}
.desktop .btn-text:hover  { filter: none; }
.btn-text:active          { color: var(--color-blue-90); }

/* Disabled — muted label; underline neutral-15 */
.btn-text[disabled],
.btn-text[aria-disabled="true"] {
  background-color: transparent;
  color: var(--color-bg-link-primary-disabled);
  text-decoration-line: underline;
  text-decoration-color: var(--color-text-on-light-link-underline-disabled);
}

/* Focus — The Loop's dedicated high-contrast orange keyboard ring (not the blue used elsewhere) */
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

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for ButtonText to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-button-text.css and dist/theme.css are already pasted into the ODC
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
