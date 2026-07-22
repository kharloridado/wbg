# Handover — Button (restyle native OutSystems UI `.btn`)

The Loop **Button** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Button" [node 15597-766].

**Approach:** This does NOT introduce a custom button class. It **restyles the native
OutSystems UI Button widget** (`.btn` / `.btn-primary`) to The Loop design — same pattern
the project uses in `outsystems-ui-overrides.css`. Developers keep using the standard
OutSystems **Button** widget; the theme makes it look like The Loop.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Button page.

**What it is.** The Loop action control — a native OutSystems Button restyled to 8px rounded corners (default) or 32px pill (`.btn-rounded` modifier), Open Sans 700, blue-70 identity.

**When to use**
- Any clickable action that submits, navigates, or triggers something.
- **Primary** (filled blue-70) — the single most important action on a view.
- **Secondary** (outlined) — alternative actions next to a Primary.
- **Ghost / Tertiary** (text, no border) — low-emphasis actions in dense layouts.

**When not to use** (reach for instead)
- Link-style inline action → **Button Text**.
- One trigger that opens several actions → **Button Dropdown**.
- Pick one of a few always-visible options → **Button Group**.

**How to use**
- Use the native **Button** widget. Style = Primary → filled; Style = None → Secondary (outlined).
- Ghost: Extended Class = `btn-ghost`. Sizes: default `.btn` is Regular (40); `btn-xlarge` (56), `btn-large` (48), `btn-small` (32), `btn-regular` (40, explicit alias of the default).
- **Corner radius:** default is 8px (`--radius-medium`). For the 32px pill variant, add Extended Class = `btn-rounded`.
- Icon-only buttons must keep an accessible name (`aria-label`).

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-button.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/*` → `dist/theme.css` | Theme CSS (adds `--radius-pill`, `--space-button-gap`, `--letter-spacing-button`, `--color-bg-link-tertiary-*`) |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-button.css</code> → Theme CSS — paste below OutSystems UI</summary>

```css
/* ============================================
   Component: Button  ("The Loop" — loop/button)
   Figma: -The Loop- Main Library · "Button" [node:15597-766]
   Approach: RESTYLE the native OutSystems UI Button widget (.btn / .btn-primary)
             — NOT a parallel class system. Devs use the standard OutSystems Button
             widget; this theme override makes it render as The Loop button.
   Location: Theme CSS (paste below OutSystems UI so it wins on equal specificity).
   Escalation Level: L1/L2 (native widget + token-driven theme override)

   OutSystems UI v2.28.1 baseline (src/scss/03-widgets/_btn.scss):
     .btn          → outlined: white bg, currentColor border, text 'primary', radius soft, h40, fw semi-bold
     .btn-primary  → filled:   bg/border 'primary', text neutral-0
     .btn-small    → h32 ·  .btn-large → h48 · [disabled] → neutral
   The Loop overrides that baseline to: 8px default radius (--radius-medium; 32px pill
   via .btn-rounded), Open Sans 700, label tracking -0.5, padding 16/0, the WB blue-70
   primary fill, and a per-size type/icon scale (Figma node 15597:847 size modes):
     xLarge 56 → label 16/24, icon 18, gap 6
     Large  48 → label 14/24, icon 16, gap 6
     Regular 40 → label 12/24, icon 14, gap 6   (default .btn)
     Small  32 → label 11/20, icon 12, gap 4

   Variant mapping (OutSystems Button "Style" → The Loop "Type"):
     (none / base .btn)  → Secondary (outlined blue-70)
     .btn-primary        → Primary  (filled blue-70)
     .btn.btn-ghost      → Ghost/Tertiary (text-fill, no border) — added modifier, no native
                            ghost in OutSystems UI.
     .btn.btn-rounded    → any variant with 32px pill radius (opt-in).
     .btn-error          → Danger (filled red) — native OSUI class, restyled here.
     .btn-success        → Success (filled green) — native OSUI class, restyled here.
     .btn-error.btn-ghost / .btn-success.btn-ghost → low-emphasis status (text-fill).
       NOTE: the status pair is NOT in the Figma library (only Primary/Secondary/Tertiary
       exist at node 15597:766). Fills derive from the shipped status roles; hover/pressed
       are invented ramp steps. See tokens/component-button.css and FND-082.

   Tokens consumed: --radius-pill, --radius-medium, --space-small, --space-button-gap,
     --loop-btn-h-*, --loop-btn-font-*, --loop-btn-lh(-small), --loop-btn-icon-*,
     --loop-btn-gap-small, --loop-btn-adjacent-gap (component-button.css),
     --font-family-label, --font-weight-bold, --letter-spacing-button,
     --color-bg-link-primary-{enabled,hover,pressed,disabled}, --color-white,
     --color-text-on-light-link-primary-enabled, --color-outline-on-light-link-enabled,
     --color-bg-link-secondary-{hover,pressed,disabled},
     --color-bg-link-tertiary-{hover,pressed,disabled},
     --color-text-on-light-state-disabled,
     --loop-btn-{error,success}-{bg,bg-hover,bg-pressed,text,text-pressed,ghost-hover,ghost-pressed}
       (component-button.css).

   Fidelity note: secondary/ghost HOVER fill (blue-40 / blue-20) under the blue-70 label
     is a WCAG 2.2 AA contrast risk — logged as FND-014, NOT silently re-shaded.
   ============================================ */

/* ---- Base .btn → The Loop identity + Secondary (outlined) look ----
   Size-scoped custom props (label font / line height / icon glyph / gap) default to
   Regular here; the .btn-* size modifiers re-point them so label AND icon scale together. */
.btn {
  --loop-btn-font: var(--loop-btn-font-regular, 12px);
  --loop-btn-line-height: var(--loop-btn-lh, 24px);
  --loop-btn-icon: var(--loop-btn-icon-regular, 14px);
  --loop-btn-gap: var(--space-button-gap, 6px);

  gap: var(--loop-btn-gap);
  height: var(--loop-btn-h-regular, 40px);             /* pinned height so the border never grows the box */
  padding-block: 0;
  padding-inline: var(--space-small, 16px);
  border-radius: var(--radius-medium, 8px);
  border-width: 2px;

  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-weight: var(--font-weight-bold, 700);
  font-size: var(--loop-btn-font);
  line-height: var(--loop-btn-line-height);
  letter-spacing: var(--letter-spacing-button, -0.5px);

  /* Secondary / outlined (base, no variant class) */
  background-color: transparent;
  border-color: var(--color-outline-on-light-link-enabled);
  color: var(--color-text-on-light-link-primary-enabled);
}

/* Use The Loop's exact hover/pressed hues instead of OutSystems' brightness filter */
.btn:hover,
.desktop .btn:hover,
.btn:hover:active {
  filter: none;
}
.btn:hover {
  background-color: var(--color-bg-link-secondary-hover);
  border-color:     var(--color-bg-link-secondary-hover);
  color:            var(--color-text-on-light-emphasis);
}
.btn:active {
  background-color: var(--color-bg-link-secondary-pressed);
  border-color:     var(--color-text-on-light-link-primary-enabled);
  color:            var(--color-text-on-light-link-primary-enabled);
}
.btn[disabled],
.btn[aria-disabled="true"] {
  background-color: var(--color-bg-link-secondary-disabled);
  border-color: var(--color-text-on-light-state-disabled);
  color: var(--color-text-on-light-state-disabled);
}

/* ---- .btn-primary → Primary (filled) ---- */
.btn-primary {
  background-color: var(--color-bg-link-primary-enabled);
  border-color: var(--color-bg-link-primary-enabled);
  color: var(--color-white, #ffffff);
}
.btn-primary:hover  { background-color: var(--color-bg-link-primary-hover);  border-color: var(--color-bg-link-primary-hover);  color: var(--color-text-on-light-emphasis); }
.btn-primary:active { background-color: var(--color-bg-link-primary-pressed); border-color: var(--color-bg-link-primary-pressed); color: var(--color-white, #ffffff); }
.btn-primary[disabled],
.btn-primary[aria-disabled="true"] {
  background-color: var(--color-bg-link-primary-disabled);
  border-color: var(--color-bg-link-primary-disabled);
  color: var(--color-white, #ffffff);
}

/* ---- .btn.btn-ghost → Ghost / Tertiary (text-fill, no border) ---- */
.btn-ghost {
  background-color: transparent;
  border-color: transparent;
  color: var(--color-text-on-light-link-primary-enabled);
}
.btn-ghost:hover  { background-color: var(--color-bg-link-tertiary-hover); }
.btn-ghost:active { background-color: var(--color-bg-link-tertiary-pressed); }
.btn-ghost[disabled],
.btn-ghost[aria-disabled="true"] {
  background-color: transparent;
  border-color: transparent;
  color: var(--color-text-on-light-state-disabled);
}

/* ---- .btn-error / .btn-success → status (filled) ----
   Restyles the native OutSystems UI status classes (OSUI v2.28.1 _btn.scss) so the stock
   Button widget's Style value renders as a Loop button instead of the framework default.
   Disabled reuses the SAME neutral fill as .btn-primary so every filled button disables
   identically. Sizes / rounded / icon scaling / adjacent gap all inherit — nothing to add.
   Hover direction is asymmetric on purpose: error LIGHTENS (red-70 -> red-60), following
   the Figma brand pattern of .btn-primary; success DARKENS (green-60 -> green-70) because
   no lighter green keeps the white label at 4.5:1. Unresolved — see FND-082. */
.btn-error {
  background-color: var(--loop-btn-error-bg);
  border-color: var(--loop-btn-error-bg);
  color: var(--color-white, #ffffff);
}
.btn-error:hover  { background-color: var(--loop-btn-error-bg-hover);   border-color: var(--loop-btn-error-bg-hover);   color: var(--color-white, #ffffff); }
.btn-error:active { background-color: var(--loop-btn-error-bg-pressed); border-color: var(--loop-btn-error-bg-pressed); color: var(--color-white, #ffffff); }

.btn-success {
  background-color: var(--loop-btn-success-bg);
  border-color: var(--loop-btn-success-bg);
  color: var(--color-white, #ffffff);
}
.btn-success:hover  { background-color: var(--loop-btn-success-bg-hover);   border-color: var(--loop-btn-success-bg-hover);   color: var(--color-white, #ffffff); }
.btn-success:active { background-color: var(--loop-btn-success-bg-pressed); border-color: var(--loop-btn-success-bg-pressed); color: var(--color-white, #ffffff); }

.btn-error[disabled],
.btn-error[aria-disabled="true"],
.btn-success[disabled],
.btn-success[aria-disabled="true"] {
  background-color: var(--color-bg-link-primary-disabled);
  border-color: var(--color-bg-link-primary-disabled);
  color: var(--color-white, #ffffff);
}

/* ---- .btn-error.btn-ghost / .btn-success.btn-ghost → low-emphasis status (text-fill) ----
   The :hover/:active rules here (0,3,0) out-specify everything above. The BASE rule is only
   a specificity TIE with .btn-error / .btn:hover (0,2,0) and wins on SOURCE ORDER — so this
   block must stay below .btn-ghost and .btn-error; reordering it silently breaks the label
   colour. Pressed deepens the LABEL as well as the tint: the enabled label on the pressed
   tint fails 4.5:1 on the green side (3.6:1) — see component-button.css. */
.btn-error.btn-ghost {
  background-color: transparent;
  border-color: transparent;
  color: var(--loop-btn-error-text);
}
.btn-error.btn-ghost:hover  { background-color: var(--loop-btn-error-ghost-hover); }
.btn-error.btn-ghost:active {
  background-color: var(--loop-btn-error-ghost-pressed);
  color: var(--loop-btn-error-text-pressed);
}

.btn-success.btn-ghost {
  background-color: transparent;
  border-color: transparent;
  color: var(--loop-btn-success-text);
}
.btn-success.btn-ghost:hover  { background-color: var(--loop-btn-success-ghost-hover); }
.btn-success.btn-ghost:active {
  background-color: var(--loop-btn-success-ghost-pressed);
  color: var(--loop-btn-success-text-pressed);
}

/* The ghost rules above (0,3,0) out-specify .btn-ghost[disabled] (0,2,0), so the disabled
   ghost needs its own rule or it keeps the red/green label. */
.btn-error.btn-ghost[disabled],
.btn-error.btn-ghost[aria-disabled="true"],
.btn-success.btn-ghost[disabled],
.btn-success.btn-ghost[aria-disabled="true"] {
  background-color: transparent;
  border-color: transparent;
  color: var(--color-text-on-light-state-disabled);
}

/* ---- Sizes — native .btn-small/.btn-large + added .btn-xlarge/.btn-regular ----
   Each size re-points the size-scoped props: label 16/14/12/11, line height 24 (20 on
   Small), icon glyph 18/16/14/12, gap 6 (4 on Small) — Figma node 15597:847 size modes. */
.btn-xlarge {
  height: var(--loop-btn-h-xlarge, 56px);
  --loop-btn-font: var(--loop-btn-font-xlarge, 16px);
  --loop-btn-icon: var(--loop-btn-icon-xlarge, 18px);
}
.btn-large {
  height: var(--loop-btn-h-large, 48px);
  --loop-btn-font: var(--loop-btn-font-large, 14px);
  --loop-btn-icon: var(--loop-btn-icon-large, 16px);
}
.btn-regular {
  height: var(--loop-btn-h-regular, 40px);
  --loop-btn-font: var(--loop-btn-font-regular, 12px);
  --loop-btn-icon: var(--loop-btn-icon-regular, 14px);
}
.btn-small {
  height: var(--loop-btn-h-small, 32px);
  --loop-btn-font: var(--loop-btn-font-small, 11px);
  --loop-btn-line-height: var(--loop-btn-lh-small, 20px);
  --loop-btn-icon: var(--loop-btn-icon-small, 12px);
  --loop-btn-gap: var(--loop-btn-gap-small, 4px);
}

/* ---- Icon glyphs (Font Awesome via the native Icon widget) scale with the button size ---- */
.btn [class*="fa-"] {
  font-size: var(--loop-btn-icon);
  line-height: 1;
}

/* ---- Adjacent buttons — The Loop spacing is 8px (OSUI baseline: --space-m / 16px);
   the phone layout stacks buttons full-width, same 8px between them ---- */
.btn + .btn {
  margin-left: var(--loop-btn-adjacent-gap, 8px);
}
.phone .layout:not(.layout-native) .btn + .btn {
  margin-top: var(--loop-btn-adjacent-gap, 8px);
}

/* ---- .btn.btn-rounded → 32px pill corners (opt-in variant; confirmed: kharloridado 2026-06-30) ---- */
.btn.btn-rounded {
  border-radius: var(--radius-pill, 32px);
}

/* ---- .btn.btn-suggestion → Suggestion row (AI "Suggested Topics") ----
   Full-width, left-aligned, wrapping click target: one tinted row per suggested
   question. Restyles the NATIVE Button widget (ExtendedClass="btn-suggestion") so the
   real <button> carries click/keyboard/focus/ARIA and ODC's OnClick for free — no Web
   Component. Named like the other added modifiers in this file (.btn-ghost,
   .btn-rounded) rather than loop-*, because it modifies a native widget class.

   Deltas from base .btn: 1px hairline instead of 2px, height auto (base pins 40px) with
   a 36px floor, regular weight at the body-small step instead of bold 12px, and text
   that wraps + aligns left instead of centring on one line. */
.btn.btn-suggestion {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  text-align: left;
  white-space: normal;              /* questions wrap; base .btn keeps one line */
  height: auto;                     /* base pins --loop-btn-h-regular */
  min-height: var(--loop-btn-suggestion-h, 36px);
  padding-block: var(--loop-btn-suggestion-padding-v, 8px);
  border-width: var(--border-size-s, 1px);
  border-radius: var(--loop-btn-suggestion-radius, 4px);

  font-weight: var(--font-weight-regular, 400);
  font-size: var(--loop-btn-suggestion-font, 14px);
  line-height: var(--loop-btn-suggestion-lh, 1.25);
  letter-spacing: normal;           /* base applies the -0.5px button tracking */

  background-color: var(--loop-btn-suggestion-bg);
  border-color:     var(--loop-btn-suggestion-border);
  color:            var(--loop-btn-suggestion-text);
}
.btn.btn-suggestion:hover {
  background-color: var(--loop-btn-suggestion-bg);
  border-color:     var(--loop-btn-suggestion-border-hover);
  color:            var(--loop-btn-suggestion-text);
}
.btn.btn-suggestion:active {
  background-color: var(--loop-btn-suggestion-bg-pressed);
  border-color:     var(--loop-btn-suggestion-border-hover);
  color:            var(--loop-btn-suggestion-text);
}
.btn.btn-suggestion[disabled],
.btn.btn-suggestion[aria-disabled="true"] {
  background-color: var(--color-bg-link-secondary-disabled);
  border-color:     var(--color-outline-on-light-state-disable-low);
  color:            var(--color-text-on-light-state-disabled);
}

/* Suggestions stack vertically — undo the horizontal 8px gap the generic
   `.btn + .btn` rule above would otherwise apply between adjacent rows. */
.btn.btn-suggestion + .btn.btn-suggestion {
  margin-left: 0;
  margin-top: var(--loop-btn-adjacent-gap, 8px);
}

/* ---- Focus indicator (WCAG 2.2 SC 2.4.7/2.4.13) — design's own brand color ---- */
.btn:focus-visible {
  outline: 2px solid var(--color-outline-on-light-link-enabled, var(--color-blue-70));
  outline-offset: 2px;
}

/* ---- Reduced motion (WCAG 2.2 SC 2.3.3) ---- */
@media (prefers-reduced-motion: reduce) {
  .btn { transition: none; }
}
```

</details>

## Variant mapping (OutSystems Button "Style" → The Loop "Type")
| The Loop | OutSystems Button | How |
|---|---|---|
| **Secondary** (outlined blue-70) | base `.btn` (Style = None) | native, no extra class |
| **Primary** (filled blue-70) | `.btn-primary` (Style = Primary) | native, no extra class |
| **Ghost / Tertiary** (text, no border) | `.btn` + `btn-ghost` | Extended Class = `btn-ghost` (one added modifier; OutSystems has no native ghost) |

## Size mapping (Figma "Size" → OutSystems Button class)
| The Loop | OutSystems | How |
|---|---|---|
| **Regular** (40px, **default**) | base `.btn` | native, no extra class — Loop default per **FND-043** (reconciled from Figma xLarge/56) |
| **xLarge** (56px) | `.btn` + `btn-xlarge` | Extended Class = `btn-xlarge` (added modifier; OutSystems UI has no native h56 Button size) |
| **Large** (48px) | `.btn-large` | native size class |
| **Small** (32px) | `.btn-small` | native size class |

## What the override changes vs OutSystems UI baseline
- **Default radius 8px** (`--radius-medium`), Open Sans **700**, label tracking **-0.5px**. Add `.btn-rounded` Extended Class for the 32px pill variant (`--radius-pill`). Default `.btn` is **Regular (40px)** per FND-043; `btn-xlarge` raises it to 56px.
- **Primary fill = blue-70 (#004370)** — overridden directly because `.btn-primary` otherwise resolves through `--color-primary` (blue-50), which other components share.
- Explicit Loop hover/pressed hues (replaces OutSystems' `filter: brightness()` darkening).
- Sizes: default `.btn` → 40px (Regular), native `.btn-large` → 48px, `.btn-small` → 32px, added `.btn-xlarge` → 56px (xLarge), `.btn-regular` → 40px (explicit alias of the default).
- **Label, icon and gap scale with the size** (Figma node 15597:847 size modes): label **16/14/12/11px** (line height 24, 20 on Small), Font Awesome icon glyph **18/16/14/12px**, icon↔label gap **6px** (4px on Small) for xLarge/Large/Regular/Small. Icons placed with the native Icon widget inside the Button pick this up automatically (`.btn [class*="fa-"]`).
- **Adjacent buttons sit 8px apart** (`.btn + .btn` margin via `--loop-btn-adjacent-gap`, replacing the OutSystems UI 16px `--space-m` default; the phone stacked layout gets the same 8px vertical gap). No extra classes needed — place Buttons side by side as usual.

## Radius variant mapping
| The Loop | OutSystems | How |
|---|---|---|
| **Default (8px rounded)** | base `.btn` | no modifier needed |
| **Pill (32px)** | `.btn` + `btn-rounded` | Extended Class = `btn-rounded` |

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for Button to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-button.css, dist/tokens.css and dist/theme.css are already pasted into the ODC
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
- [ ] Rebuild + paste latest `dist/theme.css` into ODC Theme editor (carries the new tokens).
- [ ] Paste `loop-button.css` into Theme CSS, below OutSystems UI.
- [ ] Use the native **Button** widget; pick Style = Primary/None. For ghost set Extended Class = `btn-ghost`; the default `.btn` is already Regular (40px) — set Extended Class = `btn-xlarge` only when you need the 56px xLarge.
- [ ] Icon-only buttons: keep an accessible name (`aria-label`).
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview).

## Open findings linked to this work
- **FND-013** (design-token, low) — `loop/button/gap`=6px off the 4pt grid; label tracking -0.5px off the documented scale. Register-only.
- **FND-014** (a11y/contrast, medium) — secondary/ghost hover fill (Blue/40 · Blue/20) under Blue/70 label may fail WCAG 1.4.3; confirm intended hover label color. Register-only.
