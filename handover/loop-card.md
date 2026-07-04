# Handover — Card (restyle native OutSystems UI Card family)

The Loop **Card** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Card" [node 20315-6122] · base [node 19547-47101] · multimedia [node 20315-7404].

**Approach:** No custom card class system. This **restyles the native OutSystems UI Card
family** to The Loop — same pattern as the Button / Text Field / Dropdown. The Loop "Card" is
a flexible **container shell** (white, 8px radius, **flat — the Figma shadow is zeroed**, 24px
padding, content placeholder). Built one variant at a time: `.card` → `.card-background` →
`.card-sectioned` → list cards.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Card page.

**What it is.** A flexible container shell — white, 8px radius, flat (shadow zeroed), 24px padding — native Card family restyled.

**When to use**
- Group related content into a contained surface — dashboard tiles, list/grid items, media cards, sectioned panels.

**When not to use** (reach for instead)
- A page-level message → **System Alert**.
- An inline contextual notice → **Note**.
- A floating panel anchored to a control → **Popover**.

**How to use**
- Use the native **Card** widget; variants `.card-background`, `.card-sectioned`, and list cards. Place content in the placeholder.

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
/* loop-card.css — Card: native OutSystems UI Card family restyle (not a parallel class system) */

/* =====================================================================
   1) Native Card  (.card)  — base card
   ===================================================================== */
.card {
  display: flex;
  flex-direction: column;
  gap: var(--loop-card-gap, 24px);
  align-items: stretch;

  background-color: var(--loop-card-container-color);
  border: 0;
  border-radius: var(--loop-card-radius);
  box-shadow: var(--loop-card-shadow);
  padding: var(--loop-card-padding);
}

/* Type=No Padding — Extended Class is-flush (or BEM card--no-padding) */
.card.is-flush,
.card--no-padding {
  padding: var(--space-none, 0px);
}

/* Optional elevation — Extended Class card--elevated */
.card--elevated {
  box-shadow: var(--loop-card-shadow-elevated);
}

/* Content placeholder (dev affordance shown before real content is swapped in) */
.card .loop-card__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  width: 100%;
  background-color: var(--loop-card-placeholder-bg);
  border-radius: var(--radius-base, 4px);
  color: var(--loop-card-placeholder-text);
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--font-size-200, 14px);
}

/* =====================================================================
   2) Card Background  (.card-background)  — multimedia hero
   ===================================================================== */
.card-background {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  border-radius: var(--loop-card-radius);
  box-shadow: var(--loop-card-shadow);
  width: var(--loop-card-multimedia-width);
  max-width: 100%;
}

/* the background image fills the card */
.card-background .card-background-image,
.card-background > img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

/* bottom scrim so on-dark text stays legible over any image */
.card-background::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--loop-card-multimedia-scrim);
  pointer-events: none;
}

/* content overlay — bottom-aligned, padded, on-dark */
.card-background .card-background-content,
.card-background .card-item {
  position: relative;            /* above the ::after scrim */
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--space-small, 16px);
  padding: var(--loop-card-multimedia-pad);
}

/* eyebrow — bold uppercase, on-dark */
.card-background .loop-card__eyebrow {
  margin: 0;
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-card-multimedia-eyebrow-size, 13px);
  font-weight: var(--font-weight-bold, 700);
  line-height: var(--line-height-narrow, 1.25);
  text-transform: uppercase;
  color: var(--loop-card-multimedia-eyebrow);
}

/* title — on-dark emphasis */
.card-background .loop-card__title,
.card-background h1, .card-background h2, .card-background h3 {
  margin: 0;
  font-family: var(--font-family-heading, "Open Sans", system-ui, sans-serif);
  font-size: var(--font-size-500, 20px);
  font-weight: var(--font-weight-bold, 700);
  line-height: var(--line-height-narrow, 1.25);
  letter-spacing: var(--loop-card-multimedia-title-tracking, -0.25px);
  color: var(--loop-card-multimedia-title);
}

/* round media affordance (play / microphone) — holds a Font Awesome glyph
   (`fa-solid fa-…` <i>); font-size sizes the glyph inside the 64px circle */
.card-background .loop-card__media-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--loop-card-multimedia-icon-size, 64px);
  height: var(--loop-card-multimedia-icon-size, 64px);
  border: 0;
  border-radius: 100px;
  background-color: var(--loop-card-multimedia-icon-bg);
  color: var(--color-blue-90, #012740);
  font-size: var(--loop-card-multimedia-glyph, 22px);
  cursor: pointer;
}
.card-background .loop-card__media-button:focus-visible {
  outline: 2px solid var(--color-outline-white, #ffffff);
  outline-offset: 2px;
}

/* =====================================================================
   3) Card Sectioned  (.card-sectioned)  — branded sectioned card
   ===================================================================== */
.card-sectioned {
  background-color: var(--loop-card-container-color);
  border: 0;
  border-radius: var(--loop-card-radius);
  box-shadow: var(--loop-card-shadow);
  overflow: hidden;                                          /* clip section corners */
}
.card-sectioned .card-sectioned-item {
  padding: var(--loop-card-padding);
}
/* divider between consecutive sections */
.card-sectioned .card-sectioned-item + .card-sectioned-item {
  border-top: 1px solid var(--loop-card-divider);
}

/* =====================================================================
   4) List cards  (.card inside a List / .card-item)
   ===================================================================== */
.list .card,
.card-item.card {
  margin-bottom: var(--space-regular, 24px);
}

/* =====================================================================
   Reduced motion
   ===================================================================== */
@media (prefers-reduced-motion: reduce) {
  .card,
  .card-background .loop-card__media-button { transition: none; }
}
```

</details>

## OutSystems UI variant ↔ The Loop mapping
| OutSystems UI pattern | The Loop variant | Treatment |
|---|---|---|
| **Card** `.card` | Base card (Type=With Padding) | white, 8px radius, **flat**, 24px padding, 24px gap |
| **Card** `.card.is-flush` | Base card (Type=No Padding) | padding 0 (Extended Class `is-flush` / BEM `card--no-padding`) |
| **Card** `.card--elevated` | "Classic / Dashboard" | adds `--shadow-low` (opt-in; Loop default is flat) |
| **Card Background** `.card-background` | Multimedia hero | full-bleed image + bottom blue-90 scrim + on-dark eyebrow/title/media button |
| **Card Sectioned** `.card-sectioned` | (no exact Loop variant) | branded: 8px, flat, Loop divider between `.card-sectioned-item`, 24px sections |
| **Card** in a **List** / `.card-item` | List cards | inherit base `.card`; 24px list rhythm |

> **Featured item** and **chart** cards in Figma are bespoke compositions (not native OS card
> patterns) → a later custom-block pass, out of scope here.

## Layout / usage (Extended Class on the Card widget)
- **No Padding** → `is-flush` (or `card--no-padding`).
- **Elevated / dashboard** → `card--elevated`.
- **Multimedia** → Card Background widget; mark up content with `loop-card__eyebrow`,
  `loop-card__title`, and a `loop-card__media-button` for the play/microphone affordance.
- **Placeholder** → `loop-card__placeholder` renders the grey dev placeholder before real content.

## What the override changes vs OutSystems UI baseline
- `.card` is **flat** (no shadow) with an **8px** radius and **24px** padding — vs OutSystems UI's
  default shadowed card. Flat is faithful to The Loop (FND-033); `card--elevated` restores a subtle shadow.
- `.card-background` clips to 8px, lays an image full-bleed, adds a bottom blue-90 **scrim** and
  bottom-anchored **on-dark** content (eyebrow 13px bold uppercase, title 20px bold), plus a
  white/60 round media button.
- `.card-sectioned` is branded white/flat/8px with a Loop **divider** (`--color-divider-on-light-default`)
  between sections and 24px section padding.

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
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new `--loop-card-*` tokens).
- [ ] Paste `loop-card.css` into Theme CSS, **below** OutSystems UI.
- [ ] Base → native **Card**; No-Padding → Extended Class `is-flush`; Dashboard → `card--elevated`.
- [ ] Multimedia → native **Card Background**; add `loop-card__eyebrow` / `loop-card__title` / `loop-card__media-button`.
- [ ] Sectioned → native **Card Sectioned**.
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio
      Preview). OutSystems UI is not vendored in the repo, so **confirm the `.card-background` /
      `.card-sectioned` inner class names** match the published markup and the overrides land.

## Open findings linked to this work (register-only — low, no GitHub Bug auto-filed)
- **FND-033** (design-token/consistency, low) — The Loop card defines `-loop shadows/cards` but its
  x/y/blur/spread are all `0` → no visible elevation, vs OutSystems UI's default card shadow. Built
  flat; confirm whether the zeroed shadow is intentional or a token-authoring slip.
- **FND-034** (consistency, low) — the multimedia card's on-dark text/scrim reference the
  `--color-gray-alpha-white-*` / `--color-blue-90` **primitives** directly, because the semantic
  **On-Dark** role layer is parked in `semantic-colors-dark.css` (not in the light build). Revisit
  when the dark-mode phase lands so these point at semantic On-Dark roles.
