# Handover — Dropdown Tags (one-line "+N" tag row · checkmark balloon · search in the field)

The Loop **Dropdown Tags** (multi-select) styling and behaviour, ready to add into OutSystems.
ODC provider: **VirtualSelect** (the library OutSystems' Dropdown Tags block wraps).

**Approach:** No custom multi-select widget. This **restyles the native OutSystems UI Dropdown Tags**
— same pattern as the Dropdown / Text Field / DatePicker. The block is used stock; the CSS scopes the
field under `osui-dropdown-tags` (OutSystems' own class on the widget root, so nothing has to be
attached by hand) and the balloon under the provider's own mirrored wrapper classes, and one
vanilla-JS script adds the two behaviours the provider cannot express: the width-aware one-line
tag row, and type-to-filter **in the field** instead of inside the balloon.

**Design source.** Figma "The Loop / Main Library" — frame **18830:17333** (`-loop multi select`),
overflow state **18830:16426**, open/balloon state **18830:18200**. Frozen ref:
`loop/refs/cmp-dropdown-tags/`. Field: 8px radius (not the Select's pill), 12px vertical padding,
16px text (the single Select is 13px — FND-031), neutral chips (`#f5f7f9`, 1px
`Outline/On Light/Default`, 48px pill, 12px inline padding, 14px cross), compact **"+N"** pill pinned
right. Balloon: **no checkboxes, no search row** — white 14px rows at a 37px rhythm, selected rows
`#e7edf3` with a right-aligned 16px check, 8px radius, `0 2px 3px` shadow.
Metrics live in `tokens/component-field.css`.

## The problem this solves

Out of the box the provider's tag row is `flex-wrap: wrap; overflow: auto` — pick enough options and
the field grows to several lines. The design is the opposite: **one clipped row, with whatever doesn't
fit collapsed into a "+N" pill**.

The provider *does* render a "+N" pill — but only once you exceed its `noOfDisplayValues` option, which
is a **fixed count**. The design's rule is a **fit** rule ("one line"), so N depends on the field's
width and on how long the chosen labels happen to be: three chips fit a wide field and overflow a
narrow one. No provider option and no OutSystems API expresses that, so `loop-dropdown-tags.js`
measures the rendered row and drives `noOfDisplayValues` itself.

**Do not set `noOfDisplayValues` or `moreText` in the block's ExtendedOptions** — the script owns them.
(Worth correcting an older note in `handover/loop-dropdown.md`: setting `moreText: ""` does *not* give
you the compact Figma "+3". The provider's template is `"+ " + N + " " + moreText`, so an empty
`moreText` still renders `"+ 3 "`. The script rewrites the pill's text to `+3`.)

## Search in the field, not the balloon

The design's open state (Figma 18830-18200) has **no search row in the balloon** — typing happens
directly in the field, combobox-style, after the chips. The provider cannot do this: OutSystems
hard-forces `search: true` and VirtualSelect only ever builds its search input inside the balloon.

So the script injects a **proxy input** after the tag row and makes the provider adopt it:

```js
vs.$searchInput = proxy;   // the keystone
```

Every focus guard in the provider compares `document.activeElement` against `$searchInput` — one
reassignment stops the focus-stealing on type/hover/scroll, makes the balloon opening put the caret
in the field, and keeps `setSearchValue` state coherent. The proxy carries the provider's own
`toggle-button-child` class (clicks on it don't toggle the balloon), handles Arrow/Enter/Escape
itself (the provider `preventDefault()`s every keydown that reaches the toggle button, which would
kill typing), and mirrors `aria-activedescendant` so it is the field's single combobox tab stop.
The balloon's search row (which also hosts Select-All — the design shows neither) is hidden by CSS
**gated on a marker class the script stamps** (`loop-tags--inline-search`), so with the script absent
the stock balloon search stays visible and functional.

Typing behaviour (stock provider semantics, kept): the query **persists across picks** — type
"fra", select two matches, keep typing — and clears when the balloon closes. Backspace in an empty
search does not remove chips; chips are removed via their own `×` or clear-all.

## The balloon (open state)

Restyled purely in CSS — **no checkboxes** (selection = `#e7edf3` row fill + right-aligned 16px FA
check), white 14px rows, 8px radius, soft shadow. Two things to know:

- **The balloon CSS is scoped to `.vscomp-wrapper.multiple.show-value-as-tags`, not the OSUI root
  class.** In ODC the balloon is appended to `<body>` and its wrapper mirrors only the provider's
  wrapper classes — a root-scoped rule would silently never reach it. This intentionally styles
  every Dropdown Tags app-wide.
- **Row height (37px) travels as a provider option, never CSS.** Rows are virtually scrolled at
  fixed `optionHeight` intervals; a CSS height would corrupt the scroll math. Set it on the block:
  **ExtendedOptions → `{"optionHeight":"37px"}`** (extended options merge last and win).

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Dropdown Tags page.

**What it is.** The Loop multi-select — the native OutSystems Dropdown Tags restyled: one line of
chips with a "+N" overflow pill, type-to-filter in the field, and a checkmark option list.

**When to use**
- Pick **several** values from a list, and show which ones are picked as removable chips.

**When not to use** (reach for instead)
- Pick exactly one value → **Dropdown** (single Select).
- More than a handful of selections that all need to stay visible → a list or a transfer control; this
  field deliberately hides the overflow behind "+N".

**How to use**
- Use the stock **Dropdown Tags** block. Put `osui-dropdown-tags` in its **ExtendedClass** only if your
  OutSystems UI version does not already add it (it normally does — check the rendered DOM first).
- Add `loop-dropdown-tags.js` as a **Script resource** (Theme or Library), **Include = Always**.
  Nothing else to wire: it finds every Dropdown Tags on the screen by itself.
- If a Dropdown Tags is rendered *after* first paint by your own logic, call
  `LoopDropdownTags.refresh()` from a Run JavaScript node. (Usually unnecessary — the script watches
  the DOM.)
- **Sizes** (Figma 18830-17324): put `loop-field--xlarge` / `--large` / `--regular` / `--small` on the
  **Field Wrapper's** ExtendedClass — the label, field box, chips and icons all step together
  (field 64/56/44/32, chips 40/40/32/24, icons 20/20/16/12). The unmodified default **is** xLarge.
  Nothing size-specific goes on the Dropdown itself, and the "+N" fit recomputes per size on its own.
- **Border radius** is the shared 8px field radius (`--loop-field-radius`) at every size; the pill
  variant is the same `loop-field--rounded` wrapper modifier the other inputs use.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-dropdown-tags.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/component-field.css` → `dist/theme.css` | Theme CSS (adds the `--loop-multiselect-*` / `--loop-select-tag-*` / `--loop-select-option-*` tokens) |
| `src/components/loop-dropdown-tags.js` | Script resource (Theme/Library), Include = Always |

> Canonical CSS/JS lives in `src/`; it is embedded into this ticket by
> `node build/embed-handover-code.mjs` — re-run after editing the source to keep them in sync.

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-dropdown-tags.css</code> → Theme CSS — paste below OutSystems UI (VirtualSelect provider CSS ships inside outsystems-ui.css)</summary>

```css
/* loop-dropdown-tags.css — Dropdown TAGS (multi-select).
   A restyle of the OutSystems VirtualSelect "Tags" provider. ExtendedClass hook:
   `osui-dropdown-tags` (already OSUI's own class on the .vscomp-ele root — we simply
   scope to it; nothing here mutates OSUI internals).

   Frozen ref: loop/refs/cmp-dropdown-tags (Figma 18830:17333; overflow state 18830:16426;
   size ramp 18830:17324 — §9).
   Companion script: src/components/loop-dropdown-tags.js — computes how many chips fit
   on ONE line and collapses the rest into the "+N" pill. The CSS below holds the row to one
   line on its own, so if the script never loads the field still cannot grow to two rows.

   THE CASCADE WE ARE FIGHTING (all of it ships inside outsystems-ui.css):
     · OSUI bundles VirtualSelect v1.1.5's stylesheet verbatim, THEN layers its own theme on
       top. Our rules land after both, so specificity ties are enough — we out-specify rather
       than spray !important.
     · Strongest rules to beat, by selector weight:
         0,3,0  .vscomp-wrapper.has-value.show-value-as-tags .vscomp-toggle-button  (padding)
         0,3,0  .vscomp-wrapper.show-value-as-tags .vscomp-value-tag .vscomp-value-tag-clear-button
         0,3,0  .vscomp-wrapper:not(.text-direction-rtl).has-value .vscomp-clear-button
         0,2,0  .vscomp-wrapper.show-value-as-tags .vscomp-value      (flex-wrap:wrap; overflow:auto)
         0,2,0  .vscomp-wrapper.show-value-as-tags .vscomp-value-tag  (12px/600 chip, 6px 35px pad)
       Prefixing with `.osui-dropdown-tags` buys us +0,1,0 on every one of them.
     · The chevron is NOT the provider's `.vscomp-arrow` — OSUI sets that to display:none and
       draws the caret as an icon-font glyph on `.vscomp-toggle-button::after`, sized by the
       `--vscomp-toogle-btn-arrow-size` custom prop. We re-point that prop rather than redraw it.
     · The clear-all `×` is likewise an OSUI icon-font glyph (`.vscomp-clear-icon::after`); the
       provider's two rotated background bars underneath are already neutralised by OSUI.
   ===================================================================== */

/* =====================================================================
   1) Field box
   ===================================================================== */
.osui-dropdown-tags .vscomp-toggle-button {
  /* re-point the provider/OSUI knobs instead of redrawing what they draw */
  --vscomp-toogle-btn-arrow-size: var(--loop-select-icon-size, 20px);

  height: auto;
  min-height: auto;                /* the row's own min-height governs (see §2) */
  line-height: normal;             /* OSUI pins 40px here for the single-line dropdown */

  background-color: var(--color-bg-container-on-light-lowest);
  /* The outline is an INSET SHADOW, not a border, so it occupies zero layout: Figma's field is
     64px (12 + a 40px chip + 12) with the stroke inside. A real 1px border would make it 66. */
  border: 0;
  box-shadow: inset 0 0 0 1px var(--color-outline-on-light-default);
  border-radius: var(--loop-field-radius);        /* 8px — NOT the Select's pill */
  color: var(--color-text-on-light-default);

  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-multiselect-text-size, 16px);
}

/* Padding. Two OSUI rules squash this (0,2,0 shorthand + a 0,3,0 padding-left on .has-value),
   so both of ours carry the wrapper classes to out-specify them. The right side reserves the
   gutter that the absolutely-positioned icon cluster lives in (§4) — without it the tag row
   would slide underneath the chevron. */
.osui-dropdown-tags .vscomp-wrapper.show-value-as-tags .vscomp-toggle-button,
.osui-dropdown-tags .vscomp-wrapper.has-value.show-value-as-tags .vscomp-toggle-button {
  padding: var(--loop-multiselect-padding-block, 12px)
           var(--loop-select-tags-padding-right, 72px)
           var(--loop-multiselect-padding-block, 12px)
           var(--loop-field-padding-inline, 16px);
  gap: var(--loop-field-gap, 8px);
  /* OSUI ALSO pins `min-height: var(--vscomp-toogle-btn-height)` (40px) at this same 0,3,0
     weight (`.vscomp-wrapper.show-value-as-tags .vscomp-toggle-button`), so §1's 0,2,0 `auto`
     loses that tie. Re-assert it here at 0,4,0 — otherwise the Small size (32px field) can
     never drop under 40px. Invisible at xLarge/Large/Regular, whose content is ≥ 40px anyway. */
  min-height: auto;
}

.osui-dropdown-tags .vscomp-toggle-button:hover {
  box-shadow: inset 0 0 0 1px var(--color-outline-on-light-subdued);
}

/* Focus — the design's own 2px focus colour. Same inset-shadow trick, so the thicker ring
   still costs zero layout.
   The :focus-within arm is LOAD-BEARING for the inline-search build: the provider applies
   `.focused` only while the balloon is OPEN, and the keyboard tab stop is the injected proxy
   INPUT (the wrapper is demoted to tabindex -1) — so after Escape closes the balloon with the
   caret kept in the field, only :focus-within still shows the ring (WCAG 2.4.7). */
.osui-dropdown-tags .vscomp-wrapper.focused .vscomp-toggle-button,
.osui-dropdown-tags .vscomp-wrapper:focus .vscomp-toggle-button,
.osui-dropdown-tags .vscomp-wrapper:focus-visible .vscomp-toggle-button,
.osui-dropdown-tags .vscomp-wrapper:focus-within .vscomp-toggle-button {
  box-shadow: inset 0 0 0 2px var(--color-outline-on-light-link-focused);
  outline: none;
}

/* =====================================================================
   2) The tag row — ONE LINE (the crux)
   ===================================================================== */
/* The provider ships `flex-wrap: wrap; overflow: auto`, which is what lets the field grow to
   several rows. Figma's "Tags Wapper" is `overflow: clip` on a single flex row. */
.osui-dropdown-tags .vscomp-wrapper.show-value-as-tags .vscomp-value {
  display: flex;
  flex-wrap: nowrap;                                   /* provider: wrap  */
  overflow: hidden;                                    /* provider: auto  */
  align-items: center;
  gap: var(--loop-select-tag-row-gap, 4px);
  height: auto;
  min-height: var(--loop-multiselect-min-content, 28px);
  margin: 0;                                           /* OSUI adds margin-right on .has-value; the gutter is the toggle's padding, not this */
  font-size: var(--loop-multiselect-text-size, 16px);  /* OSUI hard-sets --font-size-s */
  color: var(--color-text-on-light-default);

  /* Figma's Tags Wapper is `flex: 1 0 0` + `min-w-px`. The min-width is LOAD-BEARING: a flex
     item defaults to `min-width: auto`, i.e. it refuses to shrink below its content — so with
     nowrap the row would just push the field wider and NEVER report an overflow, and the fit
     script would have nothing to measure. This one line is what makes the row clip. */
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
}

/* Placeholder. OSUI re-colours it to neutral-7 at 0,2,0; Figma's is the subdued alpha the
   sibling Text Field uses — the #00294d91 primitive, NOT the orphan --color-text-on-light-subdued
   (see FND-020). */
.osui-dropdown-tags .vscomp-wrapper:not(.has-value) .vscomp-value {
  color: var(--color-neutral-alpha-57);
  opacity: 1;
}

/* =====================================================================
   3) Tag chip  (the `-loop tag` component, neutral variant)
   ===================================================================== */
.osui-dropdown-tags .vscomp-wrapper.show-value-as-tags .vscomp-value-tag {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;                                      /* chips keep their size; the row clips instead */
  gap: var(--loop-select-tag-gap, 4px);
  margin: 0;                                           /* provider spaces chips with margin; we use the row's gap */
  max-width: 100%;

  /* Height is PINNED so the 1px border cannot grow the chip (border-no-height-shift) — see the
     token's own note for how 40px is composed. */
  height: var(--loop-select-tag-h, 40px);
  padding-block: 0;
  padding-inline: var(--loop-select-tag-padding-inline, 12px);

  background-color: var(--loop-select-tag-bg);
  border: 1px solid var(--loop-select-tag-border-color);
  border-radius: var(--loop-select-tag-radius, 48px);
  color: var(--color-text-on-light-default);

  font-size: var(--loop-select-tag-text-size, 16px);   /* OSUI forces 12px */
  font-weight: var(--font-weight-regular, 400);        /* OSUI forces 600 */
  line-height: var(--loop-select-tag-text-leading, 16px);
  letter-spacing: var(--loop-select-tag-text-tracking, 0.25px);
  position: relative;
}

/* Label. OSUI stretches it to width:100% (it has to, because it absolutely-positions the cross
   on top of the label — see below). We restore normal flow and cap it at Figma's 200px. */
.osui-dropdown-tags .vscomp-wrapper.show-value-as-tags .vscomp-value-tag .vscomp-value-tag-content {
  width: auto;
  max-width: var(--loop-select-tag-text-max, 200px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* The cross. OSUI absolutely-positions this at `right: 10px` INSIDE a dark neutral-7 circle —
   so it floats over the end of the label. Figma sits it beside the label as a bare 14px glyph.
   Put it back in flow and strip the circle. */
.osui-dropdown-tags .vscomp-wrapper.show-value-as-tags .vscomp-value-tag .vscomp-value-tag-clear-button {
  position: static;
  flex-shrink: 0;
  width: var(--loop-select-tag-cross-size, 14px);
  height: var(--loop-select-tag-cross-size, 14px);
  background-color: transparent;
  border-radius: 0;
  cursor: pointer;
}

/* Keyboard reachability for the per-tag cross (implementation-level a11y — the design's own
   focus colour, no visual value changed). */
.osui-dropdown-tags .vscomp-wrapper.show-value-as-tags .vscomp-value-tag .vscomp-value-tag-clear-button:focus-visible {
  outline: 2px solid var(--color-outline-on-light-link-focused);
  outline-offset: 2px;
  border-radius: var(--radius-xs, 2px);
}

/* ---- The "+N" overflow pill ----
   Same chip component, exactly two deltas: 6px inline padding (vs 12px), and no cross.
   `margin-left: auto` is what pins it to the right edge, as in Figma — where the pill sits
   OUTSIDE the clipped tags wrapper, ahead of the icon cluster.
   The COUNT and its text are owned by loop-dropdown-tags.js: the provider would render
   "+ 3 more..." (its template hard-codes the space, so even moreText:"" yields "+ 3 "), and
   the script rewrites it to Figma's compact "+3". */
.osui-dropdown-tags .vscomp-wrapper.show-value-as-tags .vscomp-value-tag.more-value-count {
  margin-left: auto;
  flex-shrink: 0;
  padding-inline: var(--loop-select-tag-count-padding-inline, 6px);
  white-space: nowrap;
  cursor: pointer;

  /* Belt and braces. The fit script normally leaves slack, so `margin-left: auto` alone pins
     the pill right. But in the degenerate case — one chip so long it overflows on its own, or
     the script not running at all — an auto margin collapses and the pill would be clipped
     along with the overflow. Sticky keeps it parked on the row's right edge regardless
     (`overflow: hidden` above makes .vscomp-value the scrollport it sticks to). */
  position: sticky;
  right: 0;
}

/* =====================================================================
   4) Right icon cluster — clear-all ×  +  chevron ⌄
      Both are absolutely positioned by OSUI inside the toggle button, which is why §1 reserves
      a 72px right gutter. Figma: chevron 20px at the 16px edge, clear-all 20px one 8px gap to
      its left  →  right = 16 + 20 + 8 = 44px.
   ===================================================================== */
.osui-dropdown-tags .vscomp-toggle-button::after {          /* the chevron glyph */
  right: var(--loop-field-padding-inline, 16px);
  color: var(--color-icon-on-light-default);
}

.osui-dropdown-tags .vscomp-wrapper.show-value-as-tags .vscomp-clear-button,
.osui-dropdown-tags .vscomp-wrapper:not(.text-direction-rtl).has-value .vscomp-clear-button {
  right: calc(var(--loop-field-padding-inline, 16px)
              + var(--loop-select-icon-size, 20px)
              + var(--loop-field-gap, 8px));             /* 44px */
  top: 50%;
  margin-top: 0;
  transform: translateY(-50%);
  width: var(--loop-select-icon-size, 20px);
  height: var(--loop-select-icon-size, 20px);
  border-radius: 0;
}

.osui-dropdown-tags .vscomp-clear-button:hover {
  background-color: transparent;
}

.osui-dropdown-tags .vscomp-clear-button:focus-visible {
  outline: 2px solid var(--color-outline-on-light-link-focused);
  outline-offset: 2px;
}

/* =====================================================================
   5) Icons — FA 6 Pro glyphs
      OSUI draws the caret and both crosses from ITS OWN icon font
      (`content: var(--osui-icon-arrow-down)` / `var(--osui-icon-clear)` against
      `--osui-icon-font-family`). The Loop's icons are FontAwesome 6 Pro glyphs — no inline
      SVGs — so we re-point the same ::after pseudo-elements at the FA family + codepoint,
      exactly as loop-search.css and loop-datepicker.css do.
   ===================================================================== */
.osui-dropdown-tags .vscomp-toggle-button::after,
.osui-dropdown-tags .vscomp-clear-icon::after {
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-solid, 900);
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: var(--color-icon-on-light-default);
}

/* chevron-down (Right Icon II) */
.osui-dropdown-tags .vscomp-toggle-button::after {
  content: "\f078";                                    /* fa-chevron-down */
  font-size: var(--loop-select-icon-size, 20px);
}

/* xmark — used by BOTH the clear-all (Right Icon I) and the per-tag cross. The provider also
   draws two rotated background bars on ::before/::after to fake an ×; neutralise them so only
   the glyph shows. */
.osui-dropdown-tags .vscomp-clear-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}
.osui-dropdown-tags .vscomp-clear-icon::before {
  display: none;
}
.osui-dropdown-tags .vscomp-clear-icon::after {
  content: "\f00d";                                    /* fa-xmark */
  position: static;
  width: auto;
  height: auto;
  background: none;
  transform: none;
  text-indent: 0;
}

.osui-dropdown-tags .vscomp-clear-button .vscomp-clear-icon::after {
  font-size: var(--loop-select-icon-size, 20px);       /* 20px clear-all */
}
.osui-dropdown-tags .vscomp-value-tag-clear-button .vscomp-clear-icon::after {
  font-size: var(--loop-select-tag-cross-size, 14px);  /* 14px tag cross */
}

/* =====================================================================
   6) States — inherited from the Field Wrapper, matching loop-dropdown.css
   ===================================================================== */
/* All three re-colour the same inset ring §1 draws — never a real border, or the field would
   change height between states. */
.loop-field--error .osui-dropdown-tags .vscomp-toggle-button,
.osui-dropdown-tags.osui-dropdown--not-valid .vscomp-toggle-button {
  background-color: var(--color-bg-container-state-error-low);
  box-shadow: inset 0 0 0 1px var(--color-outline-on-light-state-error-high);
}

.loop-field--warning .osui-dropdown-tags .vscomp-toggle-button {
  background-color: var(--color-domain-state-warning-low);
  box-shadow: inset 0 0 0 1px var(--color-outline-on-light-state-warning-high);
}

.loop-field--disabled .osui-dropdown-tags .vscomp-toggle-button,
.osui-dropdown-tags.vscomp-ele[disabled] .vscomp-toggle-button {
  background-color: var(--color-domain-state-disable-low);
  /* The ref's disabled outline is white-48 (#ffffff7a) over the #dae3eb fill — a light inner
     edge. Do NOT reuse the fill colour here; the ring would be invisible. */
  box-shadow: inset 0 0 0 1px var(--color-gray-alpha-white-48);
  color: var(--color-text-on-light-state-disabled);
}

.loop-field--disabled .osui-dropdown-tags .vscomp-value,
.osui-dropdown-tags.vscomp-ele[disabled] .vscomp-value {
  color: var(--color-text-on-light-state-disabled);
}

/* The disabled token already carries the fade (it is an alpha colour) — no extra opacity, or the
   chip label double-fades. */
.loop-field--disabled .osui-dropdown-tags .vscomp-wrapper.show-value-as-tags .vscomp-value-tag,
.osui-dropdown-tags.vscomp-ele[disabled] .vscomp-wrapper.show-value-as-tags .vscomp-value-tag {
  color: var(--color-text-on-light-state-disabled);
}

/* =====================================================================
   7) Option list — the open balloon  (Figma 18830:18200)
      SCOPING RULE (load-bearing): these rules are prefixed with
      `.vscomp-wrapper.multiple.show-value-as-tags`, NOT `.osui-dropdown-tags`. In ODC the
      provider appends the balloon to <body> as a `.vscomp-dropbox-wrapper` that MIRRORS the
      wrapper's classes (`vscomp-wrapper multiple show-value-as-tags …`) — the OSUI root class
      is not mirrored, so a root-scoped rule would silently never reach the balloon. The
      mirrored-class scope matches both append paths (body and in-field) and intentionally
      hits every Dropdown Tags app-wide. If per-instance scoping is ever needed, pass
      `additionalDropboxContainerClasses` via the block's ExtendedOptions.

      Rows carry NO checkbox: selection = row fill + right-aligned check. Row HEIGHT is not
      set here — rows are virtually scrolled at fixed `optionHeight` intervals, so the height
      travels as the provider option (ExtendedOptions {"optionHeight":"37px"}), never as CSS.
   ===================================================================== */
.vscomp-wrapper.multiple.show-value-as-tags .vscomp-dropbox {
  background-color: var(--color-bg-container-on-light-lowest);
  border-radius: var(--loop-select-list-radius, 8px);
  /* Replaces OSUI's inset-shadow "border" — Figma's balloon has a soft drop shadow and no
     visible outline. */
  box-shadow: var(--loop-multiselect-list-shadow, 0 2px 3px rgba(0, 0, 0, 0.08));
  padding: 0;
}

.vscomp-wrapper.multiple.show-value-as-tags .vscomp-option {
  background-color: var(--color-bg-container-on-light-lowest);
  padding: 0 var(--loop-select-option-padding-inline, 12px);
}

.vscomp-wrapper.multiple.show-value-as-tags .vscomp-option-text {
  /* the lib stretches the label to width:100%, which would shove our right-aligned check
     out of the row — let it flex instead */
  width: auto;
  flex: 1;
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-select-option-text-size, 14px);
  font-weight: var(--font-weight-regular, 400);
  line-height: 1.5;
  color: var(--color-text-on-light-default);
}

/* No checkbox — one rule kills both the lib's bordered box and OSUI's primary-filled glyph
   (their strongest rule, `.vscomp-wrapper.multiple .vscomp-option.selected .checkbox-icon:after`
   at 0,5,0, dies with its parent). */
.vscomp-wrapper.multiple.show-value-as-tags .vscomp-option .checkbox-icon {
  display: none;
}

/* Selected row — #e7edf3 fill + a right-aligned FA check (same glyph pattern as §5).
   The row is display:flex and the label is flex:1, so margin-left:auto lands the glyph
   on the right edge of the padded row. */
.vscomp-wrapper.multiple.show-value-as-tags .vscomp-option.selected {
  background-color: var(--loop-select-option-selected-bg);
}
.vscomp-wrapper.multiple.show-value-as-tags .vscomp-option.selected::after {
  content: "\f00c";                                    /* fa-check */
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-solid, 900);
  font-size: var(--loop-select-option-check-size, 16px);
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: var(--color-icon-on-light-default);
  margin-left: var(--loop-select-option-check-gap, 8px);
  flex-shrink: 0;
}

/* Hover / keyboard-focused row — not drawn in Figma (recorded assumption in the ref):
   one step lighter than the selected fill. Selected wins even while focused. */
.vscomp-wrapper.multiple.show-value-as-tags .vscomp-option.focused {
  background-color: var(--color-bg-container-on-light-low);
}
.vscomp-wrapper.multiple.show-value-as-tags .vscomp-option.selected.focused {
  background-color: var(--loop-select-option-selected-bg);
}

/* =====================================================================
   8) Inline search — gated on `.loop-tags--inline-search`
      The marker class is stamped by loop-dropdown-tags.js on BOTH wrappers
      (vs.$allWrappers = the in-field wrapper AND the body-appended balloon wrapper), because
      the design puts the search in the FIELD, not the balloon — and the provider can only
      build its search input inside the balloon. The script injects a proxy input after
      .vscomp-value and reassigns the provider's $searchInput reference to it; these rules
      lay the proxy out and hide the now-redundant balloon search row.
      Script absent ⇒ no marker ⇒ none of this fires and the stock balloon search stays
      visible and functional (graceful degradation).
   ===================================================================== */

/* The balloon's search row (which also hosts Select-All — Figma shows neither). */
.vscomp-wrapper.loop-tags--inline-search .vscomp-search-wrapper {
  display: none;
}

/* With a proxy in the row, the tag row stops growing (the proxy takes the slack, which is
   also what keeps the typing caret visible) — the fit measurement still works because
   flexbox now shrinks the value row to (container − proxy min − pill). */
.osui-dropdown-tags .vscomp-wrapper.loop-tags--inline-search.show-value-as-tags .vscomp-value {
  flex: 0 1 auto;                                      /* §2 sets 1 1 auto; min-width:0 stays load-bearing */
}

.osui-dropdown-tags .loop-tags-search {
  flex: 1 1 24px;
  min-width: 24px;
  border: 0;
  background: transparent;
  outline: none;
  padding: 0;
  font-family: inherit;
  font-size: var(--loop-multiselect-text-size, 16px);
  color: var(--color-text-on-light-default);
}
.osui-dropdown-tags .loop-tags-search::placeholder {
  /* same subdued alpha as the provider placeholder it replaces (FND-020 / FND-071 lineage) */
  color: var(--color-neutral-alpha-57);
  opacity: 1;
}

/* The proxy owns the placeholder (a native input placeholder vanishes while typing, which
   the provider's .vscomp-value text can't do) — hide the provider's copy. */
.osui-dropdown-tags .vscomp-wrapper.loop-tags--inline-search:not(.has-value) .vscomp-value {
  display: none;
}

.loop-field--disabled .osui-dropdown-tags .loop-tags-search,
.osui-dropdown-tags.vscomp-ele[disabled] .loop-tags-search {
  pointer-events: none;                                /* belt — the script also syncs .disabled */
  color: var(--color-text-on-light-state-disabled);
}

/* =====================================================================
   9) Sizes — the Field Wrapper cascade  (Figma 18830:17324, "How To Use — Sizes")
      One modifier on the wrapper scales the WHOLE field, like every other sizeable
      control (cmp-field-sizing rule) — the Figma page's own note says size is picked
      on the nested Field label / loop input and "this parent component will adjust".
      Each block just re-points the custom props the rules above already read, scoped
      under `.osui-dropdown-tags` so wrapper-level props shared with siblings (the
      row gap feeding §1's padding rule and §4's clear-button offset) can step to the
      multi-select's own 6px at Regular/Small without leaking to other controls in
      the wrapper. The :root defaults ARE the XLarge scale (the component's default —
      unlike the Text Field whose family default is Regular / FND-021); the xlarge
      block re-declares them so a field nested under an outer sized wrapper still
      resolves to its own size, exactly like the single Select's ramp.
      FieldLabel size/tracking come from the shared .loop-field--* ramp
      (loop-text-field.css); helper text never changes size. The body-appended
      balloon inherits none of this — correct, the option list is size-independent
      (the Sizes page draws closed fields only; recorded in the ref).
      Radius does NOT step: `input fields` = 8px at every size, consumed in §1 as
      var(--loop-field-radius) — which is also what makes the .loop-field--rounded
      pill variant work here for free.
      Chip heights stay PINNED (border-no-height-shift): 40/40/32/24 =
      vpad + label-wrapper + line + label-wrapper + vpad per the ref's Sizes table.
      Large shrinks only the FIELD (vpadding 8, text 14/16) — its chips are
      identical to XLarge's; the tag scale first steps down at Regular.
      The right gutter = clear-button offset (hpadding + icon + gap) + icon + gap
      of slack, so it tracks the icon cluster at each size: 72/72/60/48. */
.loop-field--xlarge .osui-dropdown-tags {
  --loop-multiselect-padding-block: var(--space-xsmall);       /* 12px */
  --loop-multiselect-min-content: 28px;
  --loop-multiselect-text-size: 16px;
  --loop-field-gap: var(--space-xxsmall);                      /* 8px */
  --loop-select-icon-size: 20px;
  --loop-select-tags-padding-right: 72px;                      /* 16+20+8 + 20 + 8 */
  --loop-select-tag-h: 40px;
  --loop-select-tag-padding-inline: var(--space-xsmall);       /* 12px */
  --loop-select-tag-text-size: 16px;
  --loop-select-tag-text-leading: 16px;
  --loop-select-tag-cross-size: 14px;
}
.loop-field--large .osui-dropdown-tags {
  --loop-multiselect-padding-block: var(--space-xxsmall);      /* 8px */
  --loop-multiselect-min-content: 26px;
  --loop-multiselect-text-size: 14px;
  --loop-field-gap: var(--space-xxsmall);                      /* 8px */
  --loop-select-icon-size: 20px;
  --loop-select-tags-padding-right: 72px;                      /* 16+20+8 + 20 + 8 */
  --loop-select-tag-h: 40px;                                   /* chips don't shrink until Regular */
  --loop-select-tag-padding-inline: var(--space-xsmall);       /* 12px */
  --loop-select-tag-text-size: 16px;
  --loop-select-tag-text-leading: 16px;
  --loop-select-tag-cross-size: 14px;
}
.loop-field--regular .osui-dropdown-tags {
  --loop-multiselect-padding-block: 6px;                       /* off-scale literal, like the Select's 11px */
  --loop-multiselect-min-content: 24px;
  --loop-multiselect-text-size: 13px;
  --loop-field-gap: 6px;                                       /* loop/field/hgap steps to 6 — off-scale literal */
  --loop-select-icon-size: 16px;
  --loop-select-tags-padding-right: 60px;                      /* 16+16+6 + 16 + 6 */
  --loop-select-tag-h: 32px;                                   /* 5+4+14+4+5 */
  --loop-select-tag-padding-inline: var(--space-xsmall);       /* 12px */
  --loop-select-tag-text-size: 14px;
  --loop-select-tag-text-leading: 14px;
  --loop-select-tag-cross-size: 12px;
}
.loop-field--small .osui-dropdown-tags {
  /* --loop-field-padding-inline steps to 12px via the shared .loop-field--small (loop-text-field.css) */
  --loop-multiselect-padding-block: var(--space-tiny);         /* 4px */
  --loop-multiselect-min-content: 20px;
  --loop-multiselect-text-size: 12px;
  --loop-field-gap: 6px;                                       /* off-scale literal */
  --loop-select-icon-size: 12px;
  --loop-select-tags-padding-right: 48px;                      /* 12+12+6 + 12 + 6 */
  --loop-select-tag-h: 24px;                                   /* 4+2+12+2+4 */
  --loop-select-tag-padding-inline: 10px;                      /* loop/tag/hpadding pulls in — off-scale literal */
  --loop-select-tag-text-size: 12px;
  --loop-select-tag-text-leading: 12px;
  --loop-select-tag-cross-size: 12px;
}
```

</details>
<details>
<summary><code>loop-dropdown-tags.js</code> → Script resource (Theme/Library), Include = Always — no wiring needed; it finds every Dropdown Tags itself</summary>

```js
/**
 * loop-dropdown-tags.js — the Dropdown Tags behaviour layer. Two jobs:
 *
 *   1. FIT   — hold the tag row to ONE line, collapsing whatever doesn't fit into the
 *              "+N" overflow pill (Figma 18830-16426).
 *   2. SEARCH — put the type-to-filter INPUT in the field itself, combobox-style, instead
 *              of the provider's search row inside the balloon (Figma 18830-18200 shows
 *              no search row in the balloon at all).
 *
 * Figma ref: loop/refs/cmp-dropdown-tags. NOT a Web Component — it progressively enhances
 * the NATIVE OutSystems Dropdown Tags widget restyled by loop-dropdown-tags.css, matching
 * the "restyle native widgets, don't build a parallel system" rule.
 *
 * WHY FIT EXISTS
 * The VirtualSelect provider renders a "+N" pill only past its `noOfDisplayValues` option —
 * a FIXED COUNT. The design's rule is a FIT rule ("one line"), so N depends on the field's
 * width and the labels' lengths. No provider option and no OutSystems API expresses that,
 * so we measure the rendered row and drive `noOfDisplayValues` ourselves: render every chip,
 * shrink one at a time until the row stops overflowing (each step is one synchronous
 * re-render; the loop self-corrects for the pill's own width because the pill IS rendered
 * as soon as n < total). Floor: one chip always renders — an over-long lone label ellipsises
 * at its 200px max-width instead of collapsing the field to a bare pill.
 *
 * WHY SEARCH EXISTS
 * OutSystems hard-forces the provider's `search: true`, and the provider can only build its
 * search input inside the balloon — no option relocates it. So we inject a PROXY input after
 * the tag row and make the provider adopt it:
 *
 *   vs.$searchInput = proxy;      ← the keystone
 *
 * Every focus guard in the provider compares `document.activeElement` against `$searchInput`
 * (typing, hover, virtual-scroll re-render, open-focus). One reassignment makes all of them
 * treat the field's input as the search input: no focus stealing while typing, the caret
 * lands in the field when the balloon opens (`focusElementOnOpen`), and `setSearchValue`
 * state stays coherent. The balloon's own search row (which also hosts Select-All — the
 * design shows neither) is hidden by CSS, gated on the `loop-tags--inline-search` marker
 * this script stamps — so with the script absent the stock balloon search stays functional.
 *
 * The proxy carries the provider's own `toggle-button-child` class (clicks on it don't
 * toggle the balloon) and handles its own keys with stopPropagation — the provider
 * preventDefault()s EVERY keydown that reaches the toggle button, which would kill typing.
 *
 * PROVIDER INTERNALS — the one liberty this file takes.
 * `el.virtualSelect`, `noOfDisplayValues`, `setValueText()`, `$searchInput`, and the
 * instance methods called on the proxy's behalf (`openDropbox`, `closeDropbox`,
 * `setSearchValue`, `onDownArrowPress`/`onUpArrowPress`/`onEnterPress`) are provider
 * internals, not a public OutSystems API. There is no supported hook for width-aware
 * overflow or field-side search, so this is the seam. It is confined to this file and
 * degrades safely: with the script absent the CSS alone keeps the field to one clipped
 * line and the stock balloon search renders. Re-check this file if VirtualSelect is ever
 * bumped past 1.1.x.
 * (`setValueText()` does NOT dispatch `change` — only `setValue()` does — so driving it
 * cannot re-enter our own change handler.)
 *
 * Markup it builds (inside the Block's ExtendedClass hook):
 *   <div class="osui-dropdown-tags vscomp-ele">            ← carries .virtualSelect
 *     <div class="vscomp-wrapper show-value-as-tags loop-tags--inline-search">
 *       <div class="vscomp-toggle-button">
 *         <div class="vscomp-value">…chips…</div>
 *         <input class="loop-tags-search toggle-button-child">   ← injected proxy
 *         <span class="vscomp-value-tag more-value-count">+3</span> ← relocated by fit()
 *
 * SURVIVING A REDRAW.
 * OutSystems rebuilds the provider in place whenever a redraw-triggering input changes —
 * the bound datasource (`OptionsList`) is one of them — destroying the inner DOM (proxy
 * included) inside the same root element. Wiring therefore REBINDS to whatever nodes are
 * live rather than latching once; the proxy is re-injected and `$searchInput` re-pointed
 * on every rebind. See `wire()`.
 *
 * Public API (for ODC to call after a dynamic render):
 *   window.LoopDropdownTags.refresh(root?)  — (re)wire every Dropdown Tags under `root`
 *   (window.LoopDropdownTagsFit remains as an alias for pre-rename callers.)
 */
(function () {
  "use strict";

  var HOOK = ".osui-dropdown-tags";
  var WRAPPER = ".vscomp-wrapper";
  var VALUE = ".vscomp-value";
  var TOGGLE = ".vscomp-toggle-button";
  var PILL = ".more-value-count";
  var PROXY = ".loop-tags-search";
  var MARKER = "loop-tags--inline-search";
  var STATE = "__loopDropdownTags";
  var MAX_STEPS = 200;   // runaway guard; a real field never has this many tags

  /** The element VirtualSelect parked itself on — the hook root itself, or a descendant. */
  function instanceEl(root) {
    if (root.virtualSelect) return root;
    var kids = root.querySelectorAll("*");
    for (var i = 0; i < kids.length; i++) {
      if (kids[i].virtualSelect) return kids[i];
    }
    return null;
  }

  /** Shrink the rendered chip count until the row fits on one line, then relabel the pill. */
  function fit(st) {
    // Re-read both the instance and the row every time: a redraw (see `wire`) replaces them.
    var el = st.el;
    var vs = el.virtualSelect;
    if (!vs || !vs.showValueAsTags) return;

    var valueEl = el.querySelector(VALUE);
    var toggleEl = el.querySelector(TOGGLE);
    if (!valueEl || !toggleEl) return;

    // With the inline-search proxy in the row, the visual order must be
    // [chips][typed text / slack][+N][icons] — so the pill moves out of .vscomp-value to sit
    // AFTER the proxy, still pinned right (the proxy's flex:1 pushes it there). This runs on
    // EVERY re-render inside the measure loop, not once at the end, so the measurement sees
    // the true final layout — measuring with the pill still in the row would double-reserve
    // its width (once in the row, once outside) and collapse one chip too many.
    // Also drops the STALE relocated pill each time: setValueText() rebuilds the pill inside
    // .vscomp-value but never touches the copy previously moved out.
    // Safe: the provider re-collects $valueTags inside .vscomp-value only, and
    // setValueTagAttr skips nodes without data-index (the pill has none). The pill
    // deliberately does NOT get `toggle-button-child`, so clicking it opens the list.
    function relocatePill() {
      var strays = toggleEl.querySelectorAll(":scope > " + PILL);
      for (var s = 0; s < strays.length; s++) strays[s].remove();
      var pill = valueEl.querySelector(PILL);
      if (pill && st.proxy && st.proxy.parentElement === toggleEl) {
        toggleEl.insertBefore(pill, st.proxy.nextSibling);
      }
      return pill || null;
    }

    // Keep the proxy's disabled state in step with the widget (redraws can flip it), and
    // re-assert the wrapper demotion — the provider's enable() re-promotes it to tabindex 0,
    // which would restore a second, role-less tab stop until the next open.
    if (st.proxy) {
      st.proxy.disabled = !!vs.$ele.disabled;
      if (st.wrapper && st.wrapper.getAttribute("tabindex") !== "-1") {
        st.wrapper.setAttribute("tabindex", "-1");
      }
    }

    var total = (vs.selectedValues || []).length;
    if (total === 0) return;                    // placeholder — nothing to collapse

    // Never measure a row that has no layout — a field inside a collapsed accordion, an
    // inactive Tabs pane, or a `display: none` ancestor reports clientWidth 0, and fitting
    // against zero would collapse every chip into "+N" for no reason. The ResizeObserver
    // refits the moment the field is actually given a width.
    if (valueEl.clientWidth === 0) {
      if (st.mo) st.mo.takeRecords();
      return;
    }

    var n = total;
    vs.noOfDisplayValues = n;
    vs.setValueText();
    var pill = relocatePill();

    var steps = 0;
    // +1 absorbs sub-pixel rounding in the layout engine.
    while (valueEl.scrollWidth > valueEl.clientWidth + 1 && n > 1 && steps++ < MAX_STEPS) {
      n -= 1;
      vs.noOfDisplayValues = n;
      vs.setValueText();
      pill = relocatePill();
    }

    var hidden = total - n;

    if (hidden > 0 && pill) {
      // The provider renders "+ 3 more..." — its template hard-codes the space, so even
      // moreText:"" yields "+ 3 ". Figma's pill is the compact "+3".
      pill.textContent = "+" + hidden;
      pill.setAttribute("aria-label", hidden + " more selected");
    }

    // Every setValueText() above rewrote the row — and the relocation just now mutated it
    // again — and the row is what the MutationObserver watches. Drop those records before
    // its microtask can deliver them, or it would refit in response to its own refit,
    // forever. MUST stay the last statement.
    if (st.mo) st.mo.takeRecords();
  }

  // Coalesce on a TIMER, not requestAnimationFrame. rAF does not fire at all while the tab is
  // hidden (backgrounded, or restored from bfcache), so an rAF-scheduled fit would simply never
  // run and the field would paint with every chip on one clipped line. Timers still fire when
  // hidden. We don't need rAF's paint alignment anyway — reading scrollWidth forces layout on
  // demand.
  function schedule(st) {
    if (st.busy) return;
    st.busy = true;
    window.setTimeout(function () {
      st.busy = false;
      fit(st);
    }, 0);
  }

  /** Build the field-side search proxy and make the provider adopt it. */
  function injectSearch(st, vs, wrapper, valueEl) {
    var toggleEl = wrapper.querySelector(TOGGLE);
    if (!toggleEl) return;

    var proxy = toggleEl.querySelector(PROXY);
    if (!proxy) {
      proxy = document.createElement("input");
      proxy.type = "text";
      // `toggle-button-child` is the provider's own opt-out: clicks on it inside the toggle
      // button do not toggle the balloon (verified in onToggleButtonPress).
      proxy.className = "loop-tags-search toggle-button-child";
      proxy.autocomplete = "off";
      toggleEl.insertBefore(proxy, valueEl.nextSibling);
    }
    st.proxy = proxy;

    // ---- The keystone: the provider adopts the proxy as its search input. ----
    // Every provider focus guard compares against $searchInput; from here on typing, hover,
    // virtual-scroll and open-focus all treat the field input as the search box.
    vs.$searchInput = proxy;

    proxy.placeholder = (!vs.selectedValues || vs.selectedValues.length === 0)
      ? (vs.placeholder || "")
      : "";
    proxy.disabled = !!vs.$ele.disabled;

    // ARIA: ONE combobox, ONE tab stop — the proxy. The provider marks the WRAPPER as the
    // combobox; demote it, and mirror aria-activedescendant (which the provider keeps
    // writing on the wrapper for every nav/filter path) onto the proxy.
    proxy.setAttribute("role", "combobox");
    proxy.setAttribute("aria-autocomplete", "list");
    proxy.setAttribute("aria-expanded", vs.isOpened() ? "true" : "false");
    proxy.setAttribute("aria-controls", "vscomp-dropbox-container-" + vs.uniqueId);
    var lbl = wrapper.getAttribute("aria-label");
    var lblBy = wrapper.getAttribute("aria-labelledby");
    if (lbl) proxy.setAttribute("aria-label", lbl);
    if (lblBy) proxy.setAttribute("aria-labelledby", lblBy);
    wrapper.setAttribute("tabindex", "-1");
    wrapper.removeAttribute("role");

    if (st.ado) st.ado.disconnect();
    if (window.MutationObserver) {
      st.ado = new MutationObserver(function () {
        var ad = wrapper.getAttribute("aria-activedescendant");
        if (ad) proxy.setAttribute("aria-activedescendant", ad);
        else proxy.removeAttribute("aria-activedescendant");
      });
      st.ado.observe(wrapper, { attributes: true, attributeFilter: ["aria-activedescendant"] });
    }

    // The marker gates all inline-search CSS (hide the balloon's search row, lay the proxy
    // out). Stamped on BOTH wrappers — in ODC the balloon is appended to <body> as a
    // .vscomp-dropbox-wrapper that mirrors the wrapper classes, and the hide-search rule
    // must reach it there. Script absent ⇒ no marker ⇒ stock search remains usable.
    var all = vs.$allWrappers || [wrapper];
    for (var i = 0; i < all.length; i++) {
      if (all[i]) all[i].classList.add(MARKER);
    }

    // ---- Proxy events. Listeners live on nodes that die with the redraw, so binding here
    //      (bind() runs per redraw) cannot double-register. ----
    // Open on CLICK / typing / arrows — deliberately NOT on focus. Tab-focus shouldn't pop
    // the balloon (combobox convention), and a focus-open would loop: afterClose redirects
    // focus back to the proxy, which would instantly reopen what the user just closed.
    proxy.addEventListener("click", function () {
      if (!proxy.disabled && !vs.isOpened()) vs.openDropbox();
    });
    proxy.addEventListener("input", function () {
      if (!vs.isOpened()) vs.openDropbox();
      // silent=true mirrors the provider's own onSearch (we ARE the input; no write-back).
      vs.setSearchValue(proxy.value, true);
    });
    proxy.addEventListener("keydown", function (e) {
      // Shield the provider's blanket keydown-preventDefault on the toggle button (it would
      // cancel character insertion) and its wrapper-level onKeyDown (double handling).
      e.stopPropagation();
      // IME composition: committing CJK text or navigating the candidate window emits
      // Enter/Arrow keydowns with isComposing (keyCode 229) — those belong to the IME, not
      // the list. (Stock is immune by accident: its dispatch is keyCode-based.)
      if (e.isComposing || e.keyCode === 229) return;
      switch (e.key) {
        case "ArrowDown": vs.onDownArrowPress(e); break;   // preventDefault + open-or-focus inside
        case "ArrowUp":   vs.onUpArrowPress(e);   break;
        case "Enter":     vs.onEnterPress(e);     break;   // preventDefault kills form submit too
        case "Tab":
          // Stock closes on Tab via the balloon's sentinel rows — which the focus never
          // reaches now that it lives in the field. Close here (no preventDefault: focus
          // moves on normally) or the balloon would stay floating over the page.
          if (vs.isOpened()) {
            vs.shouldFocusWrapperOnClose = false;
            vs.closeDropbox();
          }
          break;
        case "Escape":
          // The provider's own Escape path needs focus inside the balloon wrapper — it can
          // never fire from the field, so close from here and keep the caret in the field.
          // shouldFocusWrapperOnClose=false is the provider's OWN escape-close idiom: without
          // it, afterHidePopper yanks focus from the proxy onto the (tabindex -1) wrapper.
          vs.shouldFocusWrapperOnClose = false;
          vs.closeDropbox();
          proxy.focus();
          break;
        // everything else: native editing in the proxy
      }
    });

    // Picking options must not move the caret out of the proxy: mousedown → focus is the
    // browser default we cancel; the provider's click handler still selects. Multiple mode
    // never closes on select, so the user can type → click → keep typing. Scoped to option
    // rows so the scrollbar still drags.
    if (vs.$dropboxContainer && !vs.$dropboxContainer.__loopTagsMousedown) {
      vs.$dropboxContainer.__loopTagsMousedown = true;
      vs.$dropboxContainer.addEventListener("mousedown", function (e) {
        if (e.target && e.target.closest && e.target.closest(".vscomp-option")) e.preventDefault();
      });
    }

    // afterOpen / afterClose are dispatched NON-bubbling on the instance element — listen
    // there, not on the root. Unlike the inner DOM, $ele SURVIVES a provider destroy()
    // (its innerHTML is emptied, the node stays), so guard against re-registering on every
    // redraw rebind. The handlers read the live state from `st`, so surviving one bind is
    // enough.
    if (!vs.$ele.__loopTagsLifecycle) {
      vs.$ele.__loopTagsLifecycle = true;

      // Both handlers DERIVE aria-expanded from live state instead of asserting their own
      // event's meaning: afterOpen is dispatched from the popper's show transition while
      // afterClose dispatches straight from closeDropbox, so a fast open→close can deliver
      // them out of order — a late afterOpen would stamp a stale "true" onto a closed field.
      function syncExpanded() {
        var p = st.proxy;
        var cvs = st.el.virtualSelect;
        if (!p || !cvs) return;
        p.setAttribute("aria-expanded", cvs.isOpened() ? "true" : "false");
      }

      vs.$ele.addEventListener("afterOpen", function () {
        syncExpanded();
        // the provider re-promotes the wrappers to tabindex 0 on every open — re-demote
        st.wrapper.setAttribute("tabindex", "-1");
      });

      vs.$ele.addEventListener("afterClose", function () {
        var p = st.proxy;
        var cvs = st.el.virtualSelect;
        if (!p || !cvs) return;
        syncExpanded();
        p.removeAttribute("aria-activedescendant");
        // Reset the query so reopening shows the full list. Guarded in the provider
        // (only acts when the value actually changed), so this never loops.
        p.value = "";
        cvs.setSearchValue("", true);
        // Mouse-path close (chevron / outside click): afterHidePopper focuses the wrapper —
        // now role-less and tabindex -1, so a screen reader announces nothing there. Hand
        // the focus back to the combobox input instead.
        if (document.activeElement === st.wrapper) p.focus();
      });

      // The placeholder lives on the proxy only while nothing is selected (the CSS hides the
      // provider's own placeholder text under the marker).
      vs.$ele.addEventListener("change", function () {
        var p = st.proxy;
        var cvs = st.el.virtualSelect;
        if (!p || !cvs) return;
        p.placeholder = (!cvs.selectedValues || cvs.selectedValues.length === 0)
          ? (cvs.placeholder || "")
          : "";
      });
    }
  }

  /** Point the observers + proxy at the nodes that are live RIGHT NOW, dropping any earlier set. */
  function bind(st, el, wrapper, valueEl) {
    if (st.mo) st.mo.disconnect();
    if (st.ro) st.ro.disconnect();
    if (st.ado) { st.ado.disconnect(); st.ado = null; }

    st.el = el;
    st.wrapper = wrapper;
    st.valueEl = valueEl;
    st.lastWidth = -1;

    var vs = el.virtualSelect;
    if (vs) injectSearch(st, vs, wrapper, valueEl);

    // The row's content changing is the ONE trigger we cannot do without. The provider applies
    // the starting selection AFTER it builds the DOM — and OutSystems initialises it with
    // `silentInitialValueSet: true`, so no `change` event is dispatched for it. Without this
    // observer the first paint would keep every chip and never collapse. `fit` calls
    // takeRecords() so our own re-renders don't come back around.
    if (window.MutationObserver) {
      st.mo = new MutationObserver(function () { schedule(st); });
      st.mo.observe(valueEl, { childList: true });
    }

    if (window.ResizeObserver) {
      // Our own re-render changes the row, which can nudge the wrapper's box and re-fire the
      // observer. Only refit when the WIDTH actually moved — that is the only input `fit`
      // reads — so the observer cannot chase its own tail.
      st.ro = new ResizeObserver(function (entries) {
        var w = entries[0] && entries[0].contentRect ? Math.round(entries[0].contentRect.width) : -1;
        if (w === st.lastWidth) return;
        st.lastWidth = w;
        schedule(st);
      });
      st.ro.observe(wrapper);
    }
  }

  function wire(root) {
    var el = instanceEl(root);
    if (!el) return;                            // provider hasn't initialised yet — the
    var wrapper = el.querySelector(WRAPPER);    // document observer will bring us back
    var valueEl = el.querySelector(VALUE);
    if (!wrapper || !valueEl) return;

    var st = root[STATE];

    // Already bound to these exact nodes — nothing to do. This is the common case: our own
    // setValueText() rewrites the row's CHILDREN, which trips the document observer, but leaves
    // .vscomp-value itself in place.
    if (st && st.valueEl === valueEl && st.wrapper === wrapper) return;

    if (!st) {
      st = root[STATE] = {
        el: el, wrapper: null, valueEl: null, proxy: null,
        mo: null, ro: null, ado: null, busy: false, lastWidth: -1,
      };
      // Bound ONCE, to the hook root — which survives a redraw (below), unlike the inner nodes.
      // Fires on select / deselect / clear-all.
      root.addEventListener("change", function () { schedule(st); });
    }

    // REBIND, don't skip. OutSystems tears the provider down and rebuilds it in place whenever a
    // redraw-triggering input changes — and `OptionsList`, the bound datasource, is one of them
    // (AbstractVirtualSelect.changeProperty → redraw → AbstractProviderPattern._handleRedraw →
    // provider.destroy() + re-create). So an ordinary aggregate refresh replaces .vscomp-wrapper
    // and .vscomp-value with NEW nodes inside the SAME root — taking the proxy and the marker
    // classes with them. A one-shot "already wired" latch would leave the observers watching
    // detached nodes, the search dead, and the field rendering every chip clipped with no "+N".
    bind(st, el, wrapper, valueEl);
    schedule(st);                               // seed from whatever is already selected
  }

  /** (Re)wire every Dropdown Tags under `root`. Safe to call repeatedly. */
  function refresh(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var hooks = scope.querySelectorAll(HOOK);
    for (var i = 0; i < hooks.length; i++) wire(hooks[i]);
  }

  // Re-scan as ODC renders Blocks — and as the provider builds its DOM — after load.
  function observe() {
    if (!window.MutationObserver) return;
    var mo = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes && mutations[i].addedNodes.length) { refresh(document); break; }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  function init() { refresh(document); observe(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.LoopDropdownTags = { refresh: refresh };
  window.LoopDropdownTagsFit = window.LoopDropdownTags;   // pre-rename alias
})();
```

</details>

## How the fit works

Render every chip, then shrink the count one at a time until the row stops overflowing. Each step is one
synchronous re-render, and it self-corrects for the pill's own width because the pill *is* rendered as
soon as `n < total`. Floor: one chip always renders — an over-long lone label ellipsises at its 200px
`max-width` rather than collapsing the field to a bare pill.

Refits on three triggers: the row's content changing (the provider applies the starting selection
*after* it builds the DOM, and OutSystems initialises it with `silentInitialValueSet: true`, so no
`change` event fires for it — without this the first paint would keep every chip), selection changes,
and the field's width changing.

**It survives a redraw.** OutSystems tears the provider down and rebuilds it in place whenever a
redraw-triggering input changes — and the bound datasource (`OptionsList`) is one of them, so an
ordinary aggregate refresh replaces the widget's inner DOM with *new* nodes inside the same root.
The script therefore **rebinds** its observers to whatever row is live, rather than wiring once. (A
one-shot "already wired" latch would leave them watching detached nodes: after a datasource refresh
the field would quietly render every chip, clipped, with no "+N" at all — and because the post-redraw
value is set silently, nothing would ever bring it back until the user changed the selection by hand.)

## What the override changes vs the VirtualSelect / OutSystems baseline

| Element | Baseline | The Loop |
|---|---|---|
| `.vscomp-value` (tag row) | `flex-wrap: wrap; overflow: auto` — grows to N lines | `nowrap` + `overflow: hidden` + `min-width: 0` — one clipped line |
| `.vscomp-value-tag` | 12px / 600 chip, `2px 3px 2px 8px`, 20px radius | 16px / 400, 40px pinned height, 12px inline, 48px pill, 1px outline |
| `.vscomp-value-tag-clear-button` | `position: absolute; right: 10px` — a dark circle **over** the label | back in flow beside the label, bare 14px FA `xmark` |
| `.vscomp-value-tag.more-value-count` | inline, after the chips, text `"+ 3 more..."` | pinned right (`margin-left: auto` + `sticky`), 6px inline padding, text `"+3"` |
| `.vscomp-toggle-button` | 1px border, 40px fixed height | inset-shadow outline (zero layout — a real border would make the field 66px, not 64), 12px/16px padding, 72px right gutter for the icon cluster |
| Icons | OutSystems' own icon font (`--osui-icon-font-family`) | FA 6 Pro glyphs — `chevron-down` 20px, `xmark` 20px (clear-all) / 14px (tag cross), `check` 16px (selected row) |
| Search | input row at the top of the balloon (+ Select-All) | proxy input **in the field** after the chips; balloon search row hidden (script-gated) |
| `.vscomp-option` | 40px rows, primary-filled `.checkbox-icon`, neutral-3 selected fill | 37px rows (`optionHeight` option), **no checkbox**, selected = `#e7edf3` + right-aligned 16px check |

## Notes for the reviewer

- **Specificity, not `!important`.** OutSystems UI bundles VirtualSelect's stylesheet *inside*
  `outsystems-ui.css` and then layers its own theme on top (rules up to 0,3,0). Prefixing every selector
  with `.osui-dropdown-tags` buys +0,1,0, which is enough to win outright — so this file contains no
  `!important` at all.
- **The script touches provider internals.** `el.virtualSelect`, `noOfDisplayValues` and
  `setValueText()` are VirtualSelect's own, not a supported OutSystems API — there is no hook for
  width-aware overflow, so that is the seam. It is confined to one file and degrades safely: the CSS
  holds the row to one line on its own, so with the script absent the field still cannot grow to a
  second row (it clips instead of collapsing). **Re-check it if VirtualSelect is bumped past 1.1.x.**
- The design does **not** specify a collapse threshold — it simply draws "+3". "Exactly the chips that
  don't fit on one line" is a recorded assumption, not a Figma value; see the Overflow section of
  `loop/refs/cmp-dropdown-tags/spec.md`.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for DropdownTags to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-dropdown-tags.css, dist/tokens.css and dist/theme.css are already pasted into the ODC
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

- [ ] Paste `dist/theme.css` (carries the `--loop-multiselect-*` / `--loop-select-tag-*` /
      `--loop-select-option-*` tokens).
- [ ] Paste `src/blocks/loop-dropdown-tags.css` into Theme CSS, **below** OutSystems UI.
- [ ] Add `src/components/loop-dropdown-tags.js` as a Script resource, **Include = Always**.
- [ ] Confirm the widget root carries `osui-dropdown-tags`; if not, add it via **ExtendedClass**.
- [ ] Set the block's **ExtendedOptions** to `{"optionHeight":"37px"}` (the Figma row rhythm —
      a provider option because rows are virtually scrolled; CSS cannot set it).
- [ ] Do **not** set `noOfDisplayValues` / `moreText` / `search` in ExtendedOptions — the script
      owns the first two, and search must stay on for the field-side filter to work.
- [ ] Publish and check in a **real browser** (not Service Studio Preview): select 5–6 values, confirm
      one line + "+N" pinned right, then narrow the window and confirm N recomputes.
- [ ] Open the balloon: no search row, no checkboxes, selected rows `#e7edf3` + right check; type in
      the **field** and confirm the list filters live; Enter selects, Escape closes, the caret stays
      in the field throughout.
