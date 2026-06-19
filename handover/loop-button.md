# Handover — Button (restyle native OutSystems UI `.btn`)

The Loop **Button** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Button" [node 15597-766].

**Approach:** This does NOT introduce a custom button class. It **restyles the native
OutSystems UI Button widget** (`.btn` / `.btn-primary`) to The Loop design — same pattern
the project uses in `outsystems-ui-overrides.css`. Developers keep using the standard
OutSystems **Button** widget; the theme makes it look like The Loop.

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
   The Loop overrides that baseline to: pill radius (32), Open Sans 700, label
   tracking -0.5, icon gap 6, padding 16/32, and the WB blue-70 primary fill.

   Variant mapping (OutSystems Button "Style" → The Loop "Type"):
     (none / base .btn)  → Secondary (outlined blue-70)
     .btn-primary        → Primary  (filled blue-70)
     .btn.btn-ghost      → Ghost/Tertiary (text-fill, no border) — the ONE added modifier,
                            since OutSystems UI has no native ghost button style.

   Tokens consumed: --radius-pill, --space-small, --space-medium, --space-button-gap,
     --font-family-label, --font-weight-bold, --font-size-300, --letter-spacing-button,
     --color-bg-link-primary-{enabled,hover,pressed,disabled}, --color-white,
     --color-text-on-light-link-primary-enabled, --color-outline-on-light-link-enabled,
     --color-bg-link-secondary-{hover,pressed,disabled},
     --color-bg-link-tertiary-{hover,pressed,disabled},
     --color-text-on-light-state-disabled.

   Fidelity note: secondary/ghost HOVER fill (blue-40 / blue-20) under the blue-70 label
     is a WCAG 2.2 AA contrast risk — logged as FND-014, NOT silently re-shaded.
   ============================================ */

/* ---- Base .btn → The Loop identity + Secondary (outlined) look ---- */
.btn {
  gap: var(--space-button-gap, 6px);
  height: auto;                                        /* let padding drive height (→ 56px) */
  min-height: 56px;                                    /* Figma default size */
  padding: var(--space-small, 16px) var(--space-medium, 32px);
  border-radius: var(--radius-pill, 32px);

  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-weight: var(--font-weight-bold, 700);
  font-size: var(--font-size-300, 16px);
  line-height: var(--line-height-base, 1.5);           /* 24px @16px */
  letter-spacing: var(--letter-spacing-button, -0.5px);

  /* Secondary / outlined (base, no variant class) — blue-70, transparent fill */
  background-color: transparent;
  border-color: var(--color-outline-on-light-link-enabled);   /* blue-70 */
  color: var(--color-text-on-light-link-primary-enabled);     /* blue-70 */
}

/* Use The Loop's EXACT hover/pressed hues instead of OutSystems' brightness filter */
.btn:hover,
.desktop .btn:hover,
.btn:hover:active {
  filter: none;
}
.btn:hover           { background-color: var(--color-bg-link-secondary-hover); }   /* blue-40 — FND-014 */
.btn:active          { background-color: var(--color-bg-link-secondary-pressed); } /* blue-30 */
.btn[disabled],
.btn[aria-disabled="true"] {
  background-color: var(--color-bg-link-secondary-disabled);  /* white */
  border-color: var(--color-text-on-light-state-disabled);    /* neutral-alpha-42 */
  color: var(--color-text-on-light-state-disabled);
}

/* ---- .btn-primary → The Loop Primary (filled blue-70) ---- */
.btn-primary {
  background-color: var(--color-bg-link-primary-enabled);     /* blue-70 #004370 */
  border-color: var(--color-bg-link-primary-enabled);
  color: var(--color-white, #ffffff);
}
.btn-primary:hover  { background-color: var(--color-bg-link-primary-hover);  border-color: var(--color-bg-link-primary-hover);  }  /* blue-40 */
.btn-primary:active { background-color: var(--color-bg-link-primary-pressed); border-color: var(--color-bg-link-primary-pressed); } /* blue-90 */
.btn-primary[disabled],
.btn-primary[aria-disabled="true"] {
  background-color: var(--color-bg-link-primary-disabled);    /* neutral-40 */
  border-color: var(--color-bg-link-primary-disabled);
  color: var(--color-white, #ffffff);
}

/* ---- .btn.btn-ghost → The Loop Ghost / Tertiary (text-fill, no border) ----
   The single added modifier (OutSystems UI has no native ghost button). Apply via
   the Button widget's Extended Class = "btn-ghost". */
.btn-ghost {
  background-color: transparent;
  border-color: transparent;
  color: var(--color-text-on-light-link-primary-enabled);     /* blue-70 */
}
.btn-ghost:hover  { background-color: var(--color-bg-link-tertiary-hover); }    /* blue-20 */
.btn-ghost:active { background-color: var(--color-bg-link-tertiary-pressed); }  /* blue-30 */
.btn-ghost[disabled],
.btn-ghost[aria-disabled="true"] {
  background-color: transparent;
  border-color: transparent;
  color: var(--color-text-on-light-state-disabled);
}

/* ---- Sizes — keep native .btn-small / .btn-large, restyle to The Loop heights ----
   Size mapping (OutSystems Button class → The Loop "Size"):
     (none / base)  → xLarge  (56px, The Loop default)
     .btn-large     → Large   (48px)
     .btn.is-regular → Regular (40px) — added modifier; OutSystems has no native h40
                       Button size (its baseline .btn is 40px, but The Loop's base is
                       the 56px xLarge). Apply via Extended Class = "is-regular",
                       mirroring the Text Field's .is-regular Regular size. */
.btn-large { min-height: 48px; padding-block: 12px; font-size: var(--font-size-300, 16px); }
.btn.is-regular { min-height: 40px; padding-block: 8px; font-size: var(--font-size-300, 16px); }
.btn-small { min-height: 32px; padding-block: 4px;  font-size: var(--font-size-200, 14px); }

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
| **xLarge** (56px, default) | base `.btn` | native, no extra class |
| **Large** (48px) | `.btn-large` | native size class |
| **Regular** (40px) | `.btn` + `is-regular` | Extended Class = `is-regular` (added modifier; OutSystems has no native h40 Button size — mirrors the Text Field's `is-regular`) |
| **Small** (32px) | `.btn-small` | native size class |

## What the override changes vs OutSystems UI baseline
- Pill radius **32px**, Open Sans **700**, label tracking **-0.5px**, icon gap **6px**, padding **16/32** (→ 56px tall default).
- **Primary fill = blue-70 (#004370)** — overridden directly because `.btn-primary` otherwise resolves through `--color-primary` (blue-50), which other components share.
- Explicit Loop hover/pressed hues (replaces OutSystems' `filter: brightness()` darkening).
- Sizes: native `.btn-large` → 48px, `.btn-small` → 32px, added `is-regular` → 40px (Regular).

## Checklist
- [ ] Rebuild + paste latest `dist/theme.css` into ODC Theme editor (carries the new tokens).
- [ ] Paste `loop-button.css` into Theme CSS, below OutSystems UI.
- [ ] Use the native **Button** widget; pick Style = Primary/None. For ghost set Extended Class = `btn-ghost`; for Regular (40px) set Extended Class = `is-regular`.
- [ ] Icon-only buttons: keep an accessible name (`aria-label`).
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview).

## Open findings linked to this work
- **FND-013** (design-token, low) — `loop/button/gap`=6px off the 4pt grid; label tracking -0.5px off the documented scale. Register-only.
- **FND-014** (a11y/contrast, medium) — secondary/ghost hover fill (Blue/40 · Blue/20) under Blue/70 label may fail WCAG 1.4.3; confirm intended hover label color. Register-only.
