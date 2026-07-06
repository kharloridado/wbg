# Handover — Card (bare `.card` override on the native Card widget)

The Loop **Card** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library (2)` · dev specs [node 20315-6129] · examples [node 20315-6189] · [node 20376-15012].

**Approach:** A **bare override** of the native OutSystems UI `.card` — **every** native Card
widget renders as The Loop card by default: white, 8px radius, transparent outline, 24px
padding, and the Classic shadow (`--shadow-medium`, 0 8px 20px). No Extended Class is needed
for the default look. Opt out per-instance with `ExtendedClass="card--no-shadow"` (Modern /
external web, flat) or `ExtendedClass="card--flush"` (no padding). Because `.card` is the base
class under Card Item / Card Sectioned / Card Background, this restyle applies app-wide.
**(This reverses the 2026-07-04 opt-in `.loop-card` re-scope per the 2026-07-05 user ruling.)**

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Card page.

**What it is.** A simple container surface — white, 8px radius, 24px padding, shadow by default with a no-shadow option. This is now the **default** for every native Card.

**When to use**
- Group related content into a contained surface — dashboard tiles, grid items, content panels.
- **Classic (default, with shadow)** → dashboard apps. **Modern (`card--no-shadow`)** → external web pages.

**When not to use** (reach for instead)
- A page-level message → **System Alert**.
- An inline contextual notice → **Note**.
- A floating panel anchored to a control → **Popover**.

**How to use**
- Use the native **Card** widget — it is styled by default. Drop content in the Card's placeholder. Add an Extended Class only to opt out (`card--no-shadow` / `card--flush`).

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-card.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/component-card.css` → `dist/theme.css` | Theme CSS (adds the `--loop-card-*` tokens) |

> Canonical CSS lives in `src/blocks/loop-card.css`; it is embedded into this ticket by
> `node build/embed-handover-code.mjs` — re-run after editing the source to keep them in sync.

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-card.css</code> → Theme CSS (also folded into dist/theme.css)</summary>

```css
/* loop-card.css — The Loop card (Figma 20315-6129 dev specs · 20315-6189 · 20376-15012)
 *
 * BARE restyle: overrides the native OutSystems UI .card directly, so EVERY native Card
 * widget gets The Loop look by default — white, 8px radius, transparent outline, 24px
 * padding, Classic shadow. Paste BELOW OutSystems UI so source order wins. Opt out with
 * the modifiers .card--no-shadow (Modern / external web, flat) and .card--flush (no padding).
 * (Reverses the 2026-07-04 opt-in re-scope per the 2026-07-05 user ruling.) */

.card {
  background-color: var(--loop-card-container-color);
  border: 0;                                /* Figma card/outline: transparent (all styles) */
  border-radius: var(--loop-card-radius);
  box-shadow: var(--loop-card-shadow);      /* default = Classic (dashboard apps) shadow */
  padding: var(--loop-card-padding);
}

/* Note: native .layout-native .card (0,2,0) out-specifies bare .card (0,1,0) on padding.
 * WBG is ODC web, where .layout-native is not in play, so we keep the selector flat. If
 * native-layout support is later required, add a .layout-native-scoped rule / bump the
 * modifier specificity so 24px and .card--flush still hold there. */

/* Modern (external web) style — no shadow */
.card--no-shadow {
  box-shadow: none;
}

/* No-padding variant (Figma 20376:15327 — content bleeds to the card edge) */
.card--flush {
  padding: var(--space-none, 0px);
}

/* Content placeholder (dev affordance shown before real content is swapped in) */
.card .card__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  width: 100%;
  background-color: var(--loop-card-placeholder-bg);
  color: var(--loop-card-placeholder-text);
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--font-size-200, 14px);
}

@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
}
```

</details>

## Variant mapping
| Figma style | Extended Class | Treatment |
|---|---|---|
| Classic / mixed (dashboard apps) | _(none — native Card default)_ | white, 8px radius, `--shadow-medium` shadow (0 8px 20px), 24px padding |
| Modern (external web) | `card--no-shadow` | same, no shadow |
| No padding (node 20376:15327) | `card--flush` | content bleeds to the card edge |

> The multimedia hero / sectioned / list-card treatments from the earlier restyle are **out of
> scope**. Native Card Background / Card Sectioned / Card Item inherit the base `.card` look
> (white, 8px radius, shadow) but keep their own layout/structure.

## Layout / usage (Extended Class on the Card widget)
- **Default (Classic)** → no Extended Class; every native Card is styled.
- **Modern / external web** → add `card--no-shadow`.
- **No padding** → add `card--flush`.
- **Placeholder** → `card__placeholder` renders the grey dev placeholder before real content.

## What the override changes vs OutSystems UI baseline
- The native `.card` itself is restyled, so **all** Cards change: white fill, **8px** radius
  (`--radius-medium`), **no border** (Figma outline: transparent), **24px** padding, and the
  Figma classic card shadow (x0 y8 blur20) = `--shadow-medium`.
- Opt-out modifiers: `.card--no-shadow` drops the shadow (Modern); `.card--flush` drops the
  padding (content bleeds to the edge).
- The Figma shadow *color* (`effects/shadow/default` #00396b29) is known drift — the FND-003
  sign-off fixed `--shadow-color` #21262d29 canonical (tracked FND-065).
- **Specificity note:** native `.layout-native .card` out-specifies bare `.card` on padding.
  WBG is ODC web (no `.layout-native`), so this is a no-op here; revisit if native layouts ship.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for Card to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-card.css and dist/theme.css are already pasted into the ODC
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
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the `--loop-card-*` tokens and the `--text-color-neutral-10` contrast fix).
- [ ] Paste `loop-card.css` into Theme CSS, **below** OutSystems UI.
- [ ] Card → native **Card** widget (styled by default, no Extended Class); Modern → `card--no-shadow`; No padding → `card--flush`.
- [ ] Verify default Cards / Card Items now render the Loop look (white, 8px radius, shadow, 24px padding) app-wide, and Card Item titles stay legible.
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview).

## Findings linked to this work (register-only)
- **FND-034 resolved** — the previously zeroed card shadow is now explicitly a styles-collection
  switch in Figma (classic/mixed = 0 8 20, modern = none); built shadow-by-default accordingly.
- **FND-035 superseded** — the multimedia on-dark treatment left scope with the 2026-07-04 revert.
- **FND-065 (open, designer action)** — the ref's `effects/shadow/default` #00396b29 is
  unreconciled Figma drift; code uses the canonical `--shadow-color` #21262d29 per the
  FND-003 sign-off. No new finding filed (would duplicate FND-065).
