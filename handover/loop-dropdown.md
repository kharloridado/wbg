# Handover — Dropdown / Select (restyle native OutSystems UI Dropdown)

The Loop **Dropdown / Select** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Select" [node 18787-4817].

> **Scope: this ticket is the native single Select — BOTH renderings of the OSUI Dropdown widget:**
> the div-based variant (`.dropdown-container.dropdown > div.dropdown-display`) AND the
> **native `<select>` variant (IsNative=True)** — added 2026-07-23 (§1b in the CSS). Dropdown
> **Search** (`.osui-dropdown-search`) was **revived 2026-07-23** and has its own ticket —
> `handover/loop-dropdown-search.md` (`src/blocks/loop-dropdown-search.css`). Dropdown **Tags**
> is a separate ticket — `handover/loop-dropdown-tags.md`.

**Approach:** No custom dropdown class system. This **restyles the native OutSystems UI
single-Select Dropdown widget** to The Loop design — same pattern as the Button / Text Field:

1. **Dropdown PATTERN** (server-side single Select) → `.dropdown-container.dropdown` /
   `.dropdown-display` / `.dropdown-list` / `.dropdown-popup-row`.
2. **Native `<select>` (IsNative=True)** → OSUI renders `<div class="dropdown-container"><select
   class="dropdown-display dropdown">`, so the `.dropdown` class is on the `<select>`, not the
   container. §1b targets `.dropdown-container > select.dropdown-display` (scoped by the select
   child so the div variant is untouched) and recolours OSUI's caret. **The open option list is
   the browser-native popup and cannot be CSS-styled (FND-083);** only the closed field + caret +
   states follow The Loop.

Developers keep using the stock **Dropdown** block; this layer makes it render to The Loop
spec. The field reuses the Text Field's state **colours** (shared semantic tokens) but has its
own box metrics: 8px soft-rounded (`--radius-medium`; 32px pill is opt-in via
`.loop-field--rounded`), 13px text, ~40px tall. Focus = 2px Blue/50 brand ring (FND-012).

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Dropdown / Select page.

**What it is.** The Loop select — native single Dropdown restyled.

**When to use**
- Choose one value from a longer list.

**When not to use** (reach for instead)
- ≤5 always-visible options → **Radio Button** or **Button Group**.
- Free-text entry → **Text Field**.

**How to use**
- Use the stock **Dropdown** block — the styling applies automatically.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-dropdown.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/component-field.css` → `dist/theme.css` | Theme CSS (adds the `--loop-select-*` tokens) |

> Canonical CSS lives in `src/blocks/loop-dropdown.css`; it is embedded into this ticket by
> `node build/embed-handover-code.mjs` — re-run after editing the source to keep them in sync.

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-dropdown.css</code> → Theme CSS — paste below OutSystems UI (provider CSS is runtime-injected)</summary>

```css
/* loop-dropdown.css — Dropdown / Select: native single-Select Dropdown pattern.
   Covers BOTH renderings of the OSUI Dropdown widget:
     · §1  the div-based variant  (.dropdown-container.dropdown > div.dropdown-display)
     · §1b the NATIVE variant (IsNative = True) — a real <select>: OSUI renders
           <div class="dropdown-container"><select class="dropdown-display dropdown">, so the
           `.dropdown` class is on the <select>, NOT the container. §1's
           `.dropdown-container.dropdown > …` selectors never reach it; §1b does (added 2026-07-23).
   Dropdown SEARCH (the single-select VirtualSelect provider) came BACK into scope 2026-07-23
   and is restyled in its own file, src/blocks/loop-dropdown-search.css.
   Dropdown TAGS (multi-select VirtualSelect) lives in src/blocks/loop-dropdown-tags.css. */

/* =====================================================================
   1) Native Dropdown PATTERN — single Select  (.dropdown-container.dropdown)
   ===================================================================== */
[data-dropdown] .dropdown-display-content {
  display: inline-flex;
  gap: var(--space-s);
}

/* ---- Field box (Default / Filled / Selected share this) ---- */
.dropdown-container.dropdown > div.dropdown-display,
.dropdown-container.dropdown > select.dropdown-display {
  height: var(--loop-select-h, 40px);   /* pinned height so the border never grows the box */
  padding: var(--loop-select-padding-block, 11px) var(--loop-select-padding-inline, 16px);
  gap: var(--loop-select-gap, 8px);

  background-color: var(--color-bg-container-on-light-lowest);
  border: 1px solid var(--color-outline-on-light-default);
  border-radius: var(--loop-select-radius);
  color: var(--color-text-on-light-default);

  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-select-text-size, 13px);
  font-weight: var(--font-weight-regular, 400);
  line-height: var(--loop-select-text-leading, 14px);
  letter-spacing: var(--loop-select-text-tracking, 0.5px);
}

/* Select label is 13px, vs the shared .loop-field 16px label */
.loop-field--select [data-label],
.loop-field--select label {
  font-size: var(--loop-select-label-size, 13px);
  line-height: var(--loop-select-label-leading, 16px);
  letter-spacing: var(--loop-select-label-tracking, 0.25px);
}

/* value / placeholder content */
.dropdown-container.dropdown .dropdown-display-content > span,
.dropdown-container.dropdown .dropdown-display-content > div {
  font-size: var(--loop-select-text-size, 13px);
}
/* placeholder (no value yet) — author adds .is-placeholder on the container */
.dropdown-container.dropdown.is-placeholder .dropdown-display-content {
  color: var(--color-text-on-light-subdued);
}

/* ---- Hover ---- */
.dropdown-container.dropdown > div.dropdown-display:hover,
.dropdown-container.dropdown > select.dropdown-display:hover {
  border: 1px solid var(--color-outline-on-light-emphasis);
}

/* ---- Focused / Expanded — 2px brand ring; shrink padding 1px so the box doesn't jump as the border grows 1→2px ---- */
.dropdown-container.dropdown > div.dropdown-display:focus,
.dropdown-container.dropdown > div.dropdown-display:focus-visible,
.dropdown-container.dropdown > select.dropdown-display:focus,
.dropdown-container.dropdown.dropdown-expanded > div.dropdown-display {
  outline: none;
  border: 2px solid var(--color-outline-on-light-link-focused);
  padding: calc(var(--loop-select-padding-block, 11px) - 1px) calc(var(--loop-select-padding-inline, 16px) - 1px);
}

/* ---- Error — native .not-valid on the container ---- */
.dropdown-container.dropdown.not-valid > div.dropdown-display,
.dropdown-container.dropdown.not-valid > select.dropdown-display {
  background-color: var(--color-bg-container-state-error-low);
  border-color: var(--color-outline-on-light-state-error-high);
  color: var(--color-text-on-state-error-emphasis);
}
.dropdown-container.dropdown.not-valid > div.dropdown-display::after {
  border-color: var(--color-icon-on-light-state-error);
}

/* ---- Warning — added modifier .is-warning (no native dropdown warning state) ---- */
.dropdown-container.dropdown.is-warning > div.dropdown-display,
.dropdown-container.dropdown.is-warning > select.dropdown-display {
  background-color: var(--color-domain-state-warning-low);
  border-color: var(--color-outline-on-light-state-warning-high);
  color: var(--color-text-on-state-warning-emphasis);
}

/* ---- Disabled — native .dropdown-disabled / [disabled] ---- */
.dropdown-container.dropdown > div.dropdown-display.dropdown-disabled,
.dropdown-container.dropdown > div.dropdown-display[disabled],
.dropdown-container.dropdown > select.dropdown-display[disabled] {
  background-color: var(--color-domain-state-disable-low);
  border-color: var(--color-domain-state-disable-low);
  color: var(--color-text-on-light-state-disabled);
}
.dropdown-container.dropdown > div.dropdown-display.dropdown-disabled::after,
.dropdown-container.dropdown > div.dropdown-display[disabled]::after {
  border-color: var(--color-icon-on-light-state-disabled);
}

/* ---- Popup list ---- */
.dropdown-container.dropdown > div.dropdown-list {
  background-color: var(--color-bg-container-on-light-lowest);
  border: 1px solid var(--color-outline-on-light-subdued);
  border-radius: var(--loop-select-list-radius, 8px);
  box-shadow: var(--loop-select-list-shadow);
}
.dropdown-container.dropdown.dropdown-expanded-down > div.dropdown-list {
  margin-top: var(--space-tiny, 4px);
}

/* option rows */
.dropdown-container.dropdown .dropdown-popup-row {
  height: auto;
  min-height: 40px;
  gap: var(--loop-select-gap, 8px);
  padding: var(--space-xxsmall, 8px) var(--loop-select-padding-inline, 16px);
  color: var(--color-text-on-light-default);
  font-size: var(--loop-select-text-size, 13px);
}
.dropdown-container.dropdown .dropdown-popup-row:hover,
.dropdown-container.dropdown .dropdown-popup-row-selected:hover {
  background-color: var(--color-bg-container-on-light-low);
}
.dropdown-container.dropdown .dropdown-popup-row-selected {
  background-color: var(--color-bg-container-on-light-low);
  color: var(--color-text-on-light-default);
  font-weight: var(--font-weight-semibold, 600);
}

/* =====================================================================
   1b) Native <select> variant  (IsNative = True)
   OSUI renders <div class="dropdown-container"><select class="dropdown-display dropdown">, so
   the `.dropdown` class is on the <select> and §1's `.dropdown-container.dropdown > …` rules
   never match. These do, scoped by the `> select.dropdown-display` child (the div variant has
   no <select>), so §1 is left untouched. OSUI already sets appearance:none on the select and
   draws the caret as a border-triangle on `.dropdown-container::after` — we recolour that caret
   and restyle the closed field/states. The OPEN option list is the browser's native popup and
   cannot be CSS-styled (recorded as a native-limitation finding — flag-don't-fix).
   ===================================================================== */
.dropdown-container > select.dropdown-display {
  -webkit-appearance: none;
          appearance: none;                 /* OSUI sets this; reassert so the browser arrow never returns */
  height: var(--loop-select-h, 40px);
  padding: var(--loop-select-padding-block, 11px) var(--loop-select-padding-inline, 16px);
  /* reserve the right gutter for the container's caret: 16 edge + 16 caret + 8 gap */
  padding-right: calc(var(--loop-select-padding-inline, 16px) + 16px + var(--loop-select-gap, 8px));

  background-color: var(--color-bg-container-on-light-lowest);
  border: 1px solid var(--color-outline-on-light-default);
  border-radius: var(--loop-select-radius);
  color: var(--color-text-on-light-default);

  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-select-text-size, 13px);
  font-weight: var(--font-weight-regular, 400);
  line-height: var(--loop-select-text-leading, 14px);
  letter-spacing: var(--loop-select-text-tracking, 0.5px);
}

/* Caret — redraw OSUI's caret as the FA 6 Pro chevron so the native Select matches Search / Tags
   (and renders in the local preview, where OSUI's legacy 'FontAwesome' family is deliberately not
   declared). We keep OSUI's ::after box/position (absolute, right:16px, line-height:30px centres
   it) and only swap the glyph, family, size and colour. Native-only via :has(> select). The
   div-based Select keeps OSUI's own caret (out of scope — native only). */
.dropdown-container:has(> select.dropdown-display)::after {
  content: "\f078";                                    /* fa-chevron-down */
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-solid, 900);
  font-size: var(--loop-select-chevron-size, 16px);
  color: var(--color-icon-on-light-default);
  border: 0;                                           /* drop OSUI's border-triangle geometry if that impl is active */
  -webkit-font-smoothing: antialiased;
}

/* Placeholder — a native <select> shows its selected <option>; OSUI renders the "Prompt" as a
   value-less <option>, so subdue the field text only while that option is the selected one
   (reverts to the default colour on a real selection). Same subdued alpha as the div-mode
   .is-placeholder and the sibling controls (FND-020/071 lineage). */
.dropdown-container > select.dropdown-display:has(option[value=""]:checked) {
  color: var(--color-neutral-alpha-57);
}

/* Hover */
.dropdown-container > select.dropdown-display:hover {
  border-color: var(--color-outline-on-light-emphasis);
}

/* Focus — 2px brand ring; shrink padding 1px so the box doesn't jump as the border grows 1→2px */
.dropdown-container > select.dropdown-display:focus,
.dropdown-container > select.dropdown-display:focus-visible {
  outline: none;
  border: 2px solid var(--color-outline-on-light-link-focused);
  padding: calc(var(--loop-select-padding-block, 11px) - 1px) calc(var(--loop-select-padding-inline, 16px) - 1px);
  padding-right: calc(var(--loop-select-padding-inline, 16px) + 16px + var(--loop-select-gap, 8px) - 1px);
}

/* Error — native .not-valid lands on the container in native mode too */
.dropdown-container.not-valid > select.dropdown-display {
  background-color: var(--color-bg-container-state-error-low);
  border-color: var(--color-outline-on-light-state-error-high);
  color: var(--color-text-on-state-error-emphasis);
}
.dropdown-container.not-valid:has(> select.dropdown-display)::after {
  color: var(--color-icon-on-light-state-error);
}

/* Warning — author modifier .is-warning (no native dropdown warning state) */
.dropdown-container.is-warning > select.dropdown-display {
  background-color: var(--color-domain-state-warning-low);
  border-color: var(--color-outline-on-light-state-warning-high);
  color: var(--color-text-on-state-warning-emphasis);
}

/* Disabled — container gets .dropdown-disabled, the <select> gets [disabled] + aria-disabled */
.dropdown-container > select.dropdown-display[disabled],
.dropdown-container.dropdown-disabled > select.dropdown-display {
  background-color: var(--color-domain-state-disable-low);
  border-color: var(--color-domain-state-disable-low);
  color: var(--color-text-on-light-state-disabled);
}
.dropdown-container.dropdown-disabled:has(> select.dropdown-display)::after {
  color: var(--color-icon-on-light-state-disabled);
}

/* =====================================================================
   2) Field Wrapper size cascade — Select follows the .loop-field--* size
   =====================================================================
   Mirrors the Text Field / Search size ramp (cmp-field-sizing ref: "every sizeable control
   inside a sized Field Wrapper follows the wrapper"). The select has no documented standalone
   size ramp in Figma — its component set publishes only the Regular 40px surface — so it adopts
   the shared field ramp: height 56/48/40/32, vpadding 18/14/11/8, text 16/14/13/12, label
   16/14/13/12. One modifier on the wrapper re-points the --loop-select-* custom props that the
   field-box, native dropdown-display, value text, and label rules already read — so the native
   Select scales together with the label, exactly like the sibling controls. Regular is the token
   default but is re-declared so a select nested under an outer sized wrapper still resolves to
   its own size. */
.loop-field--xlarge {
  --loop-select-h: 56px;
  --loop-select-padding-block: var(--loop-field-padding-block, 18px);
  --loop-select-text-size: 16px;    --loop-select-text-leading: 16px;
  --loop-select-label-size: 16px;   --loop-select-label-tracking: 0px;
}
.loop-field--large {
  --loop-select-h: 48px;
  --loop-select-padding-block: 14px;
  --loop-select-text-size: 14px;    --loop-select-text-leading: 16px;
  --loop-select-label-size: 14px;   --loop-select-label-tracking: 0px;
}
.loop-field--regular {
  --loop-select-h: 40px;
  --loop-select-padding-block: 11px;
  --loop-select-text-size: 13px;    --loop-select-text-leading: 14px;
  --loop-select-label-size: 13px;   --loop-select-label-tracking: 0.25px;
}
.loop-field--small {
  --loop-select-h: 32px;
  --loop-select-padding-block: 8px;
  --loop-select-padding-inline: var(--space-xsmall, 12px);   /* Small pulls the side padding in (Figma 19336-9755) */
  --loop-select-text-size: 12px;    --loop-select-text-leading: 12px;
  --loop-select-label-size: 12px;   --loop-select-label-tracking: 0.5px;
}

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .dropdown-container.dropdown > div.dropdown-display,
  .dropdown-container.dropdown > div.dropdown-display::after,
  .dropdown-container > select.dropdown-display { transition: none; }
}
```

</details>

## State mapping (Figma "State" → OutSystems)
| The Loop | How |
|---|---|
| **Default / Filled / Selected** | native — base `.dropdown-display` / `.vscomp-ele-wrapper` |
| **Placeholder** | single Dropdown: add `is-placeholder` on the container (subdued text); VirtualSelect: native `:not(.has-value)` |
| **Open / Expanded** | native — `.dropdown-expanded` (chevron flips, 2px Blue ring) |
| **Error** | native — `.not-valid` on the dropdown container (OutSystems validation) |
| **Warning** | added modifier — Extended Class `is-warning` on the container |
| **Disabled** | native — Dropdown *Enabled = False* (`.dropdown-disabled` / `[disabled]`) |

> Warning has no native dropdown state, so it is the one-off added modifier (same idea as
> the Text Field's `is-warning`).

## Label + helper layout (apply on the field Container via Extended Class)
- `loop-field loop-field--select` — vertical label sized for the **single Select** (13px).
- `loop-field` (no `--select`) — for the **Multi-select**, whose Figma label is 16px.
- `loop-field loop-field--horizontal` — label inline, left of the field.
- The **Label** needs no extra class — The Loop restyles the native `[data-label]`.
- `loop-field__helper` on the helper Text; state modifier colours it: `--error` / `--warning` / `--success` / `--disabled`.

## What the override changes vs OutSystems UI baseline
- Field **pill** radius (`--radius-pill` 32px) — note this differs from the Text Field's 8px (FND-031).
- White fill, 1px `--color-outline-on-light-default` border, **13px** value/placeholder (single Select), Open Sans.
- **Chevron** re-enabled on `.dropdown-display::after` (native suppresses it) — CSS glyph in `--color-icon-on-light-default`, flips up when open.
- **2px Blue/50** focus/expanded ring (padding shrinks 1px so the box doesn't jump).
- Tinted **Error** (red) / **Warning** (yellow) / **Disabled** (neutral) fills + borders.
- Popup **list**: white, 8px radius, low shadow, subtle border.
- Multi-select (**Dropdown Tags**) is no longer part of this ticket — it was rebuilt from scratch on
  2026-07-14 and ships separately as `handover/loop-dropdown-tags.md`
  (`src/blocks/loop-dropdown-tags.css` + `src/components/loop-dropdown-tags.js`). That ticket owns
  the tag chips, the right-icon cluster, the one-line tag row and the "+N" overflow pill.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for Dropdown to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-dropdown.css, dist/tokens.css and dist/theme.css are already pasted into the ODC
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
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new `--loop-select-*` tokens).
- [ ] Paste `loop-dropdown.css` into Theme CSS, **below** OutSystems UI.
- [ ] Single Select → native **Dropdown** widget; Search → **Dropdown Search**; Multi → **Dropdown Tags**.
- [ ] Error → bind an OutSystems **Validation** (sets `.not-valid`); Warning → Extended Class `is-warning`; empty single Select → `is-placeholder`.
- [ ] Wrap Label + field + helper in a Container with `loop-field loop-field--select` (single) or `loop-field` (multi).
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview). The VirtualSelect DOM is provider-generated — confirm the `.vscomp-*` overrides land on the published markup.

## Open findings linked to this work (register-only — low, no GitHub Bug auto-filed)
- **FND-031** (consistency/design-token, low) — Select field metrics diverge from the Text Field & scale: pill `--radius-pill` 32px vs Text Field `--radius-medium` 8px; `vpadding` 11px off the 4pt grid; label/value 13px vs the 16px used by Text Field & Multi-select.
- **FND-032** (design-token, low) — popup-list border `#dae1e8` is a foreign `lift` token with no WBG primitive; substituted to `--color-outline-on-light-subdued`.
- **FND-019** (a11y/contrast, medium, shared) — resting border `#00396b3d` ≈ 1.45:1 on white (non-text contrast, SC 1.4.11).
- **FND-012** (a11y/brand, medium, cross-ref) — Blue/50 brand focus ring replaces OutSystems' high-contrast yellow ring.
