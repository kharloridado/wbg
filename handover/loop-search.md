# Handover — Search (restyle native OutSystems UI Search)

The Loop **Search** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Search Field" [node 17191-8728].

**Approach:** This does NOT introduce a custom search class. It **restyles the native
OutSystems UI Search widget** (`.osui-search`), which renders a standard
`.form-control[data-input]`. Because of that, the Search field **inherits the entire Loop
field identity from the Text Field override** — the box (white, 32px pill, 16px text), all
6 states (Default / Filled / Focused / Error / Warning / Disabled), the 4 sizes
(`.input-*`), and the `loop-field` label/helper wrapper. This file adds only the two things
unique to Search: the **leading magnifying-glass icon** and the **Filled-state clear (×)**.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Search page.

**What it is.** The Loop search field — native OutSystems **Search** restyled with a leading
glass icon and a clear (×), reusing the Text Field box/states/sizes.

**When to use**
- Let the user filter or look something up by typing a query — list/table search, global search, "Enter your search".

**When not to use** (reach for instead)
- Free-text data entry that is saved (names, emails, amounts) → **Text Field**.
- Pick from a known option set, with type-to-filter → **Dropdown Search / Select**.

**How to use**
- Use the native **Search** widget. Set the inner Input's **type = Search** so the clear (×)
  appears in the Filled state. Wrap Label + Search in a Container with Extended Class
  `loop-field` (+ `loop-field--horizontal` for an inline "Search" label). Sizes via the
  Input size classes.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-search.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/component-search.css` → `dist/theme.css` | Theme CSS (adds the `--loop-search-*` tokens) |
| `src/blocks/loop-text-field.css` (already handed over) | Theme CSS — supplies the inherited field box/states/sizes/`loop-field` |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-search.css</code> → Theme CSS — paste below OutSystems UI</summary>

```css
/* ============================================
   Component: Search  ("The Loop" — loop search)
   Figma: -The Loop- Main Library · "Search Field" [node:17191-8728]

   Approach: RESTYLE the native OutSystems UI Search widget (.osui-search), which
     renders a standard `.form-control[data-input]`. That means the Search field
     INHERITS the entire Loop field identity from src/blocks/loop-text-field.css:
       • box (white, 1px Outline/On Light/Default border, 32px pill, 16px text)
       • all 6 states — Default / Filled / Focused (2px Blue/50 inset ring, no
         height jump) / Error (.not-valid) / Warning (.is-warning) / Disabled
       • the 4 sizes (.input-xlarge 56 / .input-large 48 / .input-regular|base 40
         / .input-small 32)  ← reused as-is, see FND-051
       • the Label + helper wrapper (.loop-field / .loop-field--horizontal) for the
         Vertical / Horizontal label orders
     This file therefore adds ONLY what is unique to Search: the leading
     magnifying-glass icon and the Filled-state clear (×). No parallel class system.
   Location: Theme CSS (paste below OutSystems UI so it wins on equal specificity).
   Escalation Level: L1/L2 (native widget + token-driven theme override)

   OutSystems UI v2.28.1 baseline (src/scripts/.../Pattern/Search/scss/_search.scss):
     .osui-search            → position: relative
     .osui-search__input     → position: relative (wraps the input)
     .osui-search .form-control[data-input] → padding-left: var(--space-xl) (reserves
                                space for OutSystems' own glyph)
   The Loop overrides that to draw the Loop glass at the field's hpadding offset and to
   size the value's padding-left from tokens (hpadding + icon + gap).

   Tokens consumed: --loop-search-* (component-search.css), --loop-field-* + state/size
     rules (component-field.css + loop-text-field.css), --color-icon-on-light-default.

   Fidelity notes (built faithfully; raised, NOT silently changed):
     - Glass fill: Figma "Icon/Default" #000000 has no neutral primitive; the mock reads
       muted, so built on --color-icon-on-light-default (neutral-60)          → FND-049
     - Clear (×): native Search ships no clear affordance; delivered via the input's
       type=search cancel button — WebKit/Blink only, absent in Firefox       → FND-050
     - Sizes: native Search has no size variants; the 4 sizes reuse the Text Field's
       .input-* classes on the inner input                                    → FND-051
   ============================================ */

/* ---- Leading search-glass icon (Default / Filled / Focused / states all share it) ---- */
.osui-search__input {
  position: relative;                                            /* anchor for the glass (native already sets this; restated for safety) */
}

/* Make room for the glass: text starts after hpadding + icon + gap. Equal specificity
   with the native `.osui-search .form-control[data-input]` rule, loaded later → wins.
   NOTE: loop-text-field.css draws the focus ring as an INSET box-shadow (not a 2px
   border), so focus does NOT reset this padding-left and the value never slides under
   the glass. */
.osui-search .form-control[data-input] {
  padding-left: var(--loop-search-pad-left, 44px);
}

.osui-search__input::after {
  content: "";
  position: absolute;
  left: var(--loop-search-icon-inset, 16px);
  top: 50%;
  transform: translateY(-50%);
  width: var(--loop-search-icon-size, 20px);
  height: var(--loop-search-icon-size, 20px);
  background-color: var(--loop-search-icon-color);              /* neutral-60 — FND-049 */
  -webkit-mask: var(--loop-search-icon) center / contain no-repeat;
  mask: var(--loop-search-icon) center / contain no-repeat;
  pointer-events: none;                                          /* glyph never eats clicks/focus */
}

/* ---- Clear (×) — Filled state (FND-050) ----
   WebKit/Blink render the cancel button on an <input type="search"> only while it holds
   a value, which exactly matches the Figma "Filled" state. Set the Search Input's type
   to Search in OutSystems to surface it. Firefox draws no cancel button (disclosed). */
.osui-search input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
          appearance: none;
  width: var(--loop-search-clear-glyph, 16px);
  height: var(--loop-search-clear-glyph, 16px);
  margin: 0;
  cursor: pointer;
  background-color: var(--loop-search-clear-color);             /* neutral-60 */
  -webkit-mask: var(--loop-search-clear-icon) center / contain no-repeat;
          mask: var(--loop-search-clear-icon) center / contain no-repeat;
}
/* Hide the browser's default decoration in case appearance:none is ignored */
.osui-search input[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
          appearance: none;
}
```

</details>


## State mapping (Figma "State" → OutSystems)
| The Loop | How |
|---|---|
| **Default / Filled / Focused** | native — inherited `.form-control[data-input]` (Focused = `:focus`; Filled shows the clear ×) |
| **Error** | native — `.not-valid` (set automatically by OutSystems form validation) |
| **Warning** | added modifier — Extended Class `is-warning` |
| **Disabled** | native — Search/Input *Enabled = False* (`[disabled]`) |

> All state visuals come from the Text Field override (shared `.form-control[data-input]`
> rules). Search adds no new state colours.

## Size mapping (Figma "Size" → OutSystems Input class)
| The Loop | OutSystems | How |
|---|---|---|
| **xLarge** (56px) | `.input-xlarge` | added size class |
| **Large** (48px) | `.input-large` | native size class |
| **Regular** (40px, default) | base / `.input-regular` | native default (explicit alias) |
| **Small** (32px) | `.input-small` | native size class |

> Same size system as the Text Field (FND-021) — **Regular (40px) is the family default**.
> The glass stays 20px across sizes (single Figma icon-size token). The native Search widget
> has no size variants, so these are the inner Input's `.input-*` classes — FND-051.

## Icon + clear + label layout
- **Leading glass** — drawn by the override on `.osui-search__input::after`; nothing to add
  in OutSystems. Colour = `--color-icon-on-light-default` (neutral-60) — FND-049.
- **Clear (×)** — set the Input **type = Search**; WebKit/Blink show the cancel button while
  the field has a value (the Figma Filled state). **Firefox shows no cancel button** — FND-050.
- **Label** — wrap on the field Container via Extended Class:
  - `loop-field` — vertical label (default): label above the field.
  - `loop-field loop-field--horizontal` — label inline, left of the field ("Search").
  - The Label needs no extra class — The Loop restyles the native `[data-label]` element.

## What the override changes vs OutSystems UI baseline
- Replaces OutSystems' own search glyph + `padding-left: var(--space-xl)` with the Loop glass
  at the field's 16px hpadding offset and a tokenised value indent (`16 + 20 + 8 = 44px`).
- Styles the `type=search` cancel button into the Loop × (neutral-60, 16px).
- Everything else (pill box, states, focus ring, sizes, label) is inherited from the Text
  Field override — Search ships no duplicate field CSS.

## Checklist
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new `--loop-search-*` tokens).
- [ ] Paste `loop-search.css` into Theme CSS, **below** OutSystems UI (and ensure `loop-text-field.css` is already there — Search depends on it).
- [ ] Use the native **Search** widget; set the Input **type = Search** so the clear (×) shows when filled.
- [ ] Warning → Extended Class `is-warning`; sizes → `.input-xlarge` / `.input-large` / `.input-small` (Regular = default).
- [ ] Wrap Label + Search in a Container with Extended Class `loop-field` (+ `loop-field--horizontal` for inline labels).
- [ ] 1-Click Publish → validate in a **real browser** (Chrome/Edge for the clear ×) at phone/tablet/desktop (never Service Studio Preview).

## Open findings linked to this work (register-only — low/medium, no GitHub issue)
- **FND-049** (design-token, low) — glass fill is Figma "Icon/Default" `#000000`, which has no neutral primitive; built on `--color-icon-on-light-default` (neutral-60), matching the muted mock.
- **FND-050** (consistency/a11y, low) — native Search ships no clear affordance; the Filled-state × uses the `type=search` cancel button, which is **WebKit/Blink only** (absent in Firefox).
- **FND-051** (consistency, low) — native Search has no size variants; the 4 sizes reuse the Text Field `.input-*` classes on the inner Input (size system + default per FND-021).
- Inherited from the shared field box: **FND-018** (off-grid metrics), **FND-019** (resting border 1.45:1 contrast), **FND-020** (placeholder "subdued" value).
