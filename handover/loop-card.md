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

**Added 2026-07-21 — sectioned card (`card--sectioned`).** The "New Case" screen
([node 20020051-20914]) shows a card split into a **white form section** over a **muted section**
that hosts the AG Grid. In Figma these are two separate frames reading as one card; in code it is
one Card with two `card__section` children. See *Sectioned card* below.

**Added 2026-07-22 — status variants (`card--success` / `card--warning` / `card--neutral`).**
Three status card surfaces from the design: a green card (`#f6fef0` fill, 1px `#388004` outline),
an amber one (`#fef3d7` fill, no outline), and a neutral one (base white fill, 1px `#4b5e71`
outline). These are **surface-only** modifiers — they change the fill and/or outline and nothing
else, so they compose with the existing ones (`ExtendedClass="card--success card--no-shadow"`).
Success is outlined and warning is not, exactly as designed (FND-079); the neutral outline has no
matching `Outline/On Light/*` role in the library, so it aliases the `--color-neutral-60`
primitive (FND-081); and the mockups' 10px radius has no token, so these follow
`--loop-card-radius` (8px) like every other Loop card (FND-080).

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Card page.

**What it is.** A simple container surface — white, 8px radius, 24px padding, shadow by default with a no-shadow option. This is now the **default** for every native Card.

**When to use**
- Group related content into a contained surface — dashboard tiles, grid items, content panels.
- **Classic (default, with shadow)** → dashboard apps. **Modern (`card--no-shadow`)** → external web pages.
- **Status variants** → when the whole surface carries the status: `card--success` (green, outlined) / `card--warning` (amber) / `card--neutral` (white, outlined — the no-status sibling). Surface-only, so they stack with `card--no-shadow` / `card--flush`.

**When not to use** (reach for instead)
- A page-level message → **System Alert**.
- An inline contextual notice → **Note**.
- A floating panel anchored to a control → **Popover**.

**How to use**
- Use the native **Card** widget — it is styled by default. Drop content in the Card's placeholder. Add an Extended Class only to opt out (`card--no-shadow` / `card--flush`) or to set a status surface (`card--success` / `card--warning` / `card--neutral`).

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

/* ---------------------------------------------------------------------------
 * Status variants (2026-07-22 design — 292x180 tinted + 292x152 neutral surfaces)
 *
 * SURFACE-ONLY modifiers: they change the fill and/or the outline and nothing
 * else, so they compose with the existing modifiers —
 * ExtendedClass="card--success card--no-shadow" for the flat treatment,
 * "card--warning card--flush" for a bleed. Shadow and padding stay on the base
 * card deliberately; the mockups are flat rects that state neither.
 *
 * Success is outlined, warning is not — exactly as drawn (FND-079). The mockups
 * specify a 10px radius, which has no token (scale 2/4/8/16/32); we follow
 * --loop-card-radius (8px) so these match every other Loop card, the same call
 * as FND-077 — raised as FND-080.
 * ------------------------------------------------------------------------- */
.card--success {
  background-color: var(--loop-card-success-bg);
  /* base .card sets border:0, so the shorthand has to be restated here */
  border: var(--loop-card-status-border-size) solid var(--loop-card-success-border);
}

.card--warning {
  background-color: var(--loop-card-warning-bg);
  /* no border — the amber card is borderless in the design (FND-079) */
}

/* Neutral / no-status sibling: the base white fill, outlined. The mockup's rect is
 * fill="none", read as white per the 2026-07-22 user ruling, so the fill stays on
 * the base card and this modifier adds only the outline. */
.card--neutral {
  border: var(--loop-card-status-border-size) solid var(--loop-card-neutral-border);
}

/* ---------------------------------------------------------------------------
 * Sectioned card (Figma 20020051:21016 white section / 20020051:21413 muted)
 *
 * One card silhouette split into differently-tinted sections — a white form
 * section over a muted section hosting the AG Grid. The sections own the inset,
 * so the card's own padding is zeroed; overflow:hidden clips the section fills
 * to the card radius so the muted fill rounds into the bottom corners.
 *
 * The Figma frames specify a 16px radius; we follow --loop-card-radius (8px) so
 * the sectioned card matches every other Loop card — raised as FND-077.
 * ------------------------------------------------------------------------- */
.card--sectioned {
  padding: var(--space-none, 0px);
  border-radius: var(--loop-card-sectioned-radius);
  overflow: hidden;
}

.card__section {
  display: flex;
  flex-direction: column;
  gap: var(--loop-card-section-gap);
  padding: var(--loop-card-section-padding);
  background-color: var(--loop-card-section-color);
}

/* Muted section — the grey field the table/AG Grid sits on */
.card__section--muted {
  background-color: var(--loop-card-section-muted-color);
}

/* Seam between adjacent sections. Adjacent-sibling so it never lands above the
 * first section. (Figma draws this as a standalone Line node at the boundary.) */
.card--sectioned .card__section + .card__section {
  border-top: var(--border-size-s) solid var(--loop-card-section-divider);
}

.card__section-title {
  margin: 0;
  font-family: var(--font-family-heading, 'Open Sans', system-ui, sans-serif);
  font-size:   var(--font-size-600);          /* Figma Heading/H2/Tiny — 24px */
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-heading);
  color:       var(--loop-card-section-title-color);
}

/* Body copy. Figma sets this in the .Input/Label/Label role (SemiBold, line-height
 * 16px on 16px text, nowrap + ellipsis) — a label role applied to a paragraph;
 * rendered here as body copy per FND-078 so the sentence wraps and stays legible. */
.card__section-description {
  margin: 0;
  font-family: var(--font-family-body, 'Open Sans', system-ui, sans-serif);
  font-size:   var(--font-size-300);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-base);
  color:       var(--loop-card-section-text-color);
}

/* Neutral content slot — whatever lands here (AG Grid, table, form) brings its
 * own styling from its own block CSS; the slot deliberately adds none. */
.card__section-content {
  min-width: 0;   /* let a wide grid scroll instead of blowing out the card */
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
| Sectioned (nodes 20020051:21016 / 20020051:21413) | `card--sectioned` | one silhouette split into tinted sections; card padding zeroed, fills clipped to the radius |

> The multimedia hero / sectioned / list-card treatments from the earlier restyle are **out of
> scope**. Native Card Background / Card Sectioned / Card Item inherit the base `.card` look
> (white, 8px radius, shadow) but keep their own layout/structure.

## Layout / usage (Extended Class on the Card widget)
- **Default (Classic)** → no Extended Class; every native Card is styled.
- **Modern / external web** → add `card--no-shadow`.
- **No padding** → add `card--flush`.
- **Placeholder** → `card__placeholder` renders the grey dev placeholder before real content.

## Sectioned card (`card--sectioned`)

A single Card whose body is split into differently-tinted sections — used on **New Case**
([node 20020051-20914]) for a white "Requestor" form section over a muted "Matched Cases"
section hosting the AG Grid.

**In OutSystems:** one native **Card** widget with `ExtendedClass="card--sectioned"`, containing
one Container per section. The sections own the 48px inset, so `card--sectioned` zeroes the
Card's own padding and clips the section fills to the card radius.

```html
<div class="card card--sectioned">
  <div class="card__section">
    <h3 class="card__section-title">Requestor</h3>
    <div class="card__section-content">
      <!-- form fields -->
    </div>
  </div>

  <div class="card__section card__section--muted">
    <h3 class="card__section-title">Matched Cases</h3>
    <p class="card__section-description">Review the following cases for duplicates. Select an existing case below to continue with that case.</p>
    <div class="card__section-content">
      <!-- AG Grid -->
    </div>
  </div>
</div>
```

| Class | Role |
|---|---|
| `card--sectioned` | On the **Card** widget. Zeroes card padding, clips section fills to the 8px radius. |
| `card__section` | One section. 48px inset, 32px vertical gap between its children, white fill. |
| `card__section--muted` | Adds to `card__section` — the `#f5f7f9` field the grid sits on. |
| `card__section-title` | Section heading — 24px bold (Figma `Heading/H2/Tiny`). Use a real `<h2>`/`<h3>` so the heading order stays valid. |
| `card__section-description` | Supporting paragraph under the title — 16px/1.5 body copy. |
| `card__section-content` | Neutral slot for the section body. Adds no styling — the AG Grid brings its own from `loop-ag-grid.css`. |

**Notes**
- The seam between sections is a 1px `--color-divider-on-light-default` hairline applied with an
  adjacent-sibling selector, so it never appears above the first section. Any number of sections
  stack correctly.
- Sections are `display: flex; flex-direction: column` — order the children in the markup and the
  32px rhythm follows automatically; don't add margins.
- **Not** the native OSUI "Card Sectioned" pattern, which is a different (header/footer) widget.

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

Context (already done): loop-card.css, dist/tokens.css and dist/theme.css are already pasted into the ODC
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
- [ ] Card → native **Card** widget (styled by default, no Extended Class); Modern → `card--no-shadow`; No padding → `card--flush`; Sectioned → `card--sectioned` + `card__section` Containers.
- [ ] Sectioned card: confirm one continuous silhouette (no per-section corners/shadow), the muted fill rounds into the bottom corners, and the description **wraps** instead of truncating.
- [ ] Verify default Cards / Card Items now render the Loop look (white, 8px radius, shadow, 24px padding) app-wide, and Card Item titles stay legible.
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview).

## Findings linked to this work (register-only)
- **FND-034 resolved** — the previously zeroed card shadow is now explicitly a styles-collection
  switch in Figma (classic/mixed = 0 8 20, modern = none); built shadow-by-default accordingly.
- **FND-035 superseded** — the multimedia on-dark treatment left scope with the 2026-07-04 revert.
- **FND-065 (open, designer action)** — the ref's `effects/shadow/default` #00396b29 is
  unreconciled Figma drift; code uses the canonical `--shadow-color` #21262d29 per the
  FND-003 sign-off. No new finding filed (would duplicate FND-065).
- **FND-077 (open, medium)** — the sectioned-card frames specify a **16px** radius while the Loop
  card token is **8px**. Code follows the 8px token per the 2026-07-21 user ruling, so the
  sectioned card matches every other card; designer to confirm which is canonical.
- **FND-078 (open, medium)** — the "Matched Cases" description is set in Figma with the
  **input-label** type role (SemiBold, line-height 16px on 16px text, `nowrap` + ellipsis).
  Code renders it as body copy (16/1.5, wrapping) per the 2026-07-21 user ruling — line-height 1.0
  plus truncation on a full sentence conflicts with WCAG 2.2 1.4.12 / 1.4.10.

**Assumptions recorded (no finding filed)**
- The Figma seam is a standalone `Line` node whose stroke exports as an image, so no colour is
  exposed; the hairline uses `--color-divider-on-light-default` (#00396b29), the Loop divider used
  everywhere else.
- The Figma sections aren't auto-layout — the ~29px box-to-box vertical steps are text-box crop
  artifacts, normalised to `--space-medium` (32px). Not flagged: the project's spacing base is TBD.
