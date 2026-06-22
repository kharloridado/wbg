# Handover — Dropdown / Select (restyle native OutSystems UI Dropdown + VirtualSelect)

The Loop **Dropdown / Select** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Select" [node 18787-4817] · "Multiselect" [node 18830-17312].

**Approach:** No custom dropdown class system. This **restyles the two native OutSystems UI
dropdown widgets** to The Loop design — same pattern as the Button / Text Field:

1. **Dropdown PATTERN** (server-side single Select) → `.dropdown-container.dropdown` /
   `.dropdown-display` / `.dropdown-list` / `.dropdown-popup-row`.
2. **VirtualSelect PROVIDER** (Dropdown Search = searchable single; Dropdown Tags =
   multi-select with tag chips) → `.osui-dropdown-search` / `.osui-dropdown-tags`
   rendered as `.vscomp-*` DOM.

Developers keep using the stock **Dropdown** / **Dropdown Search** / **Dropdown Tags**
blocks; this layer makes them render to The Loop spec. The field reuses the Text Field's
state **colours** (shared semantic tokens) but has its own box metrics: a pill
(`--radius-pill` 32px), 13px text, ~40px tall. Focus = 2px Blue/50 brand ring (FND-012).

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-dropdown.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/component-field.css` → `dist/theme.css` | Theme CSS (adds the `--loop-select-*` / `--loop-multiselect-*` tokens) |

> Canonical CSS lives in `src/blocks/loop-dropdown.css`; it is embedded into this ticket by
> `node build/embed-handover-code.mjs` — re-run after editing the source to keep them in sync.

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-dropdown.css</code> → Theme CSS — paste below OutSystems UI</summary>

```css
/* ============================================
   Component: Dropdown / Select  ("The Loop" — loop/select + loop/multi-select)
   Figma: -The Loop- Main Library
     · "Select"      [node:18787-4817]  (states frame 18770-10424)
     · "Multiselect" [node:18830-17312] (Dropdown Tags)

   Approach: RESTYLE the two native OutSystems UI dropdown widgets — NOT a parallel
   class system:
     1. Dropdown PATTERN  → .dropdown-container.dropdown / .dropdown-display / .dropdown-list
        (server-side single Select; the simple Select in Figma)
     2. VirtualSelect PROVIDER → .osui-dropdown-search (searchable single) and
        .osui-dropdown-tags (multi-select with tag chips); rendered as .vscomp-* DOM.
   Devs reach for the stock OutSystems Dropdown / Dropdown Search / Dropdown Tags
   blocks; this layer makes them render to The Loop spec.

   Location: Theme CSS (loaded after OutSystems UI so it wins on equal specificity).
   Escalation Level: L1/L2 (native widget + token-driven theme override). The
   VirtualSelect provider ships its own CSS injected at runtime, so a few field-box
   properties use !important to guarantee the brand pill wins over the provider.

   Field box reuses the Text Field's STATE COLOURS (shared semantic tokens) but has
   its OWN metrics — a 32px-radius pill, 13px text, ~40px tall (see component-field.css
   --loop-select-*). Focus = 2px Blue/50 border (brand ring — FND-012), matching the
   Text Field rather than the native primary/yellow ring.

   OutSystems UI v2.28.1 baseline (src/scss/03-widgets/_dropdown.scss):
     .dropdown-display → neutral-0 bg, 1px neutral-5 border, radius-soft, h40,
       padding 0/base, font-size-s; :hover neutral-6; :focus / .dropdown-expanded
       primary; .not-valid → error; [disabled]/.dropdown-disabled → neutral fill.
     The container's .dropdown-display:after is `content:none` (no native chevron) —
     The Loop re-enables it to draw the Figma down-chevron.

   Fidelity notes (built faithfully; raised, NOT silently changed):
     - Field radius = --radius-pill (32px) while the Text Field uses --radius-medium
       (8px): sibling form controls diverge; Select label/value 13px ≠ 16px used by the
       Text Field & Multi-select; vpadding 11px off the 4pt grid    → FND-031
     - Popup-list border (Figma #dae1e8, a lift token with no WBG primitive) substituted
       to --color-outline-on-light-subdued                          → FND-032
     - Resting border --color-outline-on-light-default (#00396b3d) ≈ 1.45:1 on white,
       below the 3:1 non-text-contrast minimum (WCAG 2.2 SC 1.4.11) → FND-019 (shared)
   ============================================ */

/* =====================================================================
   1) Native Dropdown PATTERN — single Select  (.dropdown-container.dropdown)
   ===================================================================== */

/* ---- Field box (Default / Filled / Selected share this) ---- */
.dropdown-container.dropdown > div.dropdown-display,
.dropdown-container.dropdown > select.dropdown-display {
  height: auto;
  min-height: 40px;
  padding: var(--loop-select-padding-block, 11px) var(--loop-select-padding-inline, 16px);
  gap: var(--loop-select-gap, 8px);

  background-color: var(--color-bg-container-on-light-lowest);     /* white */
  border: 1px solid var(--color-outline-on-light-default);        /* #00396b3d — FND-019 */
  border-radius: var(--loop-select-radius);                      /* --radius-pill 32px — FND-031 */
  color: var(--color-text-on-light-default);

  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-select-text-size, 13px);
  font-weight: var(--font-weight-regular, 400);
  line-height: var(--loop-select-text-leading, 14px);
  letter-spacing: var(--loop-select-text-tracking, 0.5px);
}

/* label sizing for a Select field — the shared .loop-field label rule sizes it 16px
   (Text Field); the Select label is 13px (FND-031), applied via this modifier. */
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

/* ---- Down-chevron — re-enable the container's suppressed ::after ---- */
.dropdown-container.dropdown > div.dropdown-display::after,
.dropdown-container.dropdown > select.dropdown-display::after {
  content: "";
  flex-shrink: 0;
  margin-left: auto;
  width: 8px;
  height: 8px;
  margin-top: -3px;                                               /* optical centre of the rotated glyph */
  border-right: 1.5px solid var(--color-icon-on-light-default);
  border-bottom: 1.5px solid var(--color-icon-on-light-default);
  transform: rotate(45deg);
}
.dropdown-container.dropdown.dropdown-expanded > div.dropdown-display::after {
  margin-top: 1px;
  transform: rotate(-135deg);                                     /* flips up when open */
}

/* ---- Hover ---- */
.dropdown-container.dropdown > div.dropdown-display:hover,
.dropdown-container.dropdown > select.dropdown-display:hover {
  border: 1px solid var(--color-outline-on-light-emphasis);
}

/* ---- Focused / Expanded — 2px Blue/50 brand ring (FND-012); shrink padding 1px
   so the box does not jump when the border grows 1→2px ---- */
.dropdown-container.dropdown > div.dropdown-display:focus,
.dropdown-container.dropdown > div.dropdown-display:focus-visible,
.dropdown-container.dropdown > select.dropdown-display:focus,
.dropdown-container.dropdown.dropdown-expanded > div.dropdown-display {
  outline: none;
  border: 2px solid var(--color-outline-on-light-link-focused);  /* Blue/50 #0071bc */
  padding: calc(var(--loop-select-padding-block, 11px) - 1px) calc(var(--loop-select-padding-inline, 16px) - 1px);
}

/* ---- Error — native .not-valid on the container ---- */
.dropdown-container.dropdown.not-valid > div.dropdown-display,
.dropdown-container.dropdown.not-valid > select.dropdown-display {
  background-color: var(--color-bg-container-state-error-low);    /* Red/10 #fdf2f2 */
  border-color: var(--color-outline-on-light-state-error-high);  /* Red/70 #9d161d */
  color: var(--color-text-on-state-error-emphasis);              /* Red/80 #861319 */
}
.dropdown-container.dropdown.not-valid > div.dropdown-display::after {
  border-color: var(--color-icon-on-light-state-error);
}

/* ---- Warning — added modifier .is-warning (no native dropdown warning state) ---- */
.dropdown-container.dropdown.is-warning > div.dropdown-display,
.dropdown-container.dropdown.is-warning > select.dropdown-display {
  background-color: var(--color-domain-state-warning-low);        /* Yellow/03 #fef3d7 */
  border-color: var(--color-outline-on-light-state-warning-high); /* Yellow base #896001 */
  color: var(--color-text-on-state-warning-emphasis);            /* Yellow/90 #473201 */
}

/* ---- Disabled — native .dropdown-disabled / [disabled] ---- */
.dropdown-container.dropdown > div.dropdown-display.dropdown-disabled,
.dropdown-container.dropdown > div.dropdown-display[disabled],
.dropdown-container.dropdown > select.dropdown-display[disabled] {
  background-color: var(--color-domain-state-disable-low);        /* Neutral/15 #dae3eb */
  border-color: var(--color-domain-state-disable-low);
  color: var(--color-text-on-light-state-disabled);              /* neutral-alpha-42 */
}
.dropdown-container.dropdown > div.dropdown-display.dropdown-disabled::after,
.dropdown-container.dropdown > div.dropdown-display[disabled]::after {
  border-color: var(--color-icon-on-light-state-disabled);
}

/* ---- Popup list ---- */
.dropdown-container.dropdown > div.dropdown-list {
  background-color: var(--color-bg-container-on-light-lowest);    /* white */
  border: 1px solid var(--color-outline-on-light-subdued);       /* Figma list border #dae1e8 is a lift token w/ no WBG primitive → mapped to outline-subdued, FND-032 */
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
  background-color: var(--color-bg-container-on-light-low);       /* #f5f7f9 */
}
.dropdown-container.dropdown .dropdown-popup-row-selected {
  background-color: var(--color-bg-container-on-light-low);
  color: var(--color-text-on-light-default);
  font-weight: var(--font-weight-semibold, 600);
}

/* =====================================================================
   2) VirtualSelect PROVIDER — Dropdown Search (single) + Dropdown Tags (multi)
      .osui-dropdown-search / .osui-dropdown-tags  →  .vscomp-* runtime DOM.
      A few field-box props use !important to beat the provider's own injected CSS.
   ===================================================================== */

/* ---- Field box (the wrapper is the visible pill) ---- */
.osui-dropdown-search .vscomp-ele-wrapper,
.osui-dropdown-tags .vscomp-ele-wrapper {
  min-height: 40px;
  background-color: var(--color-bg-container-on-light-lowest) !important;  /* white */
  border: 1px solid var(--color-outline-on-light-default) !important;      /* #00396b3d */
  border-radius: var(--loop-select-radius) !important;                    /* --radius-pill 32px — FND-031 */
  color: var(--color-text-on-light-default);
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--font-size-300, 16px);                                   /* multi-select value = 16px */
}
.osui-dropdown-tags .vscomp-ele-wrapper.multiple {
  border-radius: var(--loop-select-radius, 32px) !important;
}

/* toggle button (content row) */
.osui-dropdown-search .vscomp-toggle-button,
.osui-dropdown-tags .vscomp-toggle-button {
  gap: var(--loop-select-gap, 8px);
  padding: var(--loop-multiselect-padding-block, 12px) var(--loop-select-padding-inline, 16px);
  min-height: var(--loop-multiselect-min-content, 28px);
}

/* value / placeholder text */
.osui-dropdown-search .vscomp-value,
.osui-dropdown-tags .vscomp-value {
  color: var(--color-text-on-light-default);
}
.osui-dropdown-search .vscomp-wrapper:not(.has-value) .vscomp-value,
.osui-dropdown-tags .vscomp-wrapper:not(.has-value) .vscomp-value {
  color: var(--color-text-on-light-subdued);
}

/* chevron arrow — provider draws it with borders; recolour to the icon token */
.osui-dropdown-search .vscomp-arrow::after,
.osui-dropdown-tags .vscomp-arrow::after,
.osui-dropdown-search .vscomp-arrow,
.osui-dropdown-tags .vscomp-arrow {
  border-color: var(--color-icon-on-light-default) !important;
}

/* focused state — 2px Blue/50 brand ring (FND-012) */
.osui-dropdown-search .vscomp-ele-wrapper.focused,
.osui-dropdown-tags .vscomp-ele-wrapper.focused {
  border: 2px solid var(--color-outline-on-light-link-focused) !important;  /* Blue/50 #0071bc */
  box-shadow: none !important;
}

/* clear button */
.osui-dropdown-search .vscomp-clear-icon,
.osui-dropdown-tags .vscomp-clear-icon {
  background-color: var(--color-icon-on-light-default);
}

/* ---- Tag chips (multi-select) — neutral chip, NOT the blue loop-tag block ---- */
.osui-dropdown-tags .vscomp-value-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--loop-select-tag-gap, 4px);
  padding: var(--loop-select-tag-padding-block, 8px) var(--loop-select-tag-padding-inline, 12px);
  border-radius: var(--loop-select-tag-radius, 48px) !important;
  background-color: var(--loop-select-tag-bg) !important;             /* Neutral/05 #f5f7f9 */
  color: var(--color-text-on-light-default);
  font-size: var(--font-size-300, 16px);
  line-height: var(--font-size-300, 16px);
  letter-spacing: 0.25px;
}
.osui-dropdown-tags .vscomp-value-tag-content {
  color: var(--color-text-on-light-default);
}
.osui-dropdown-tags .vscomp-value-tag-clear-button {
  width: var(--loop-select-tag-cross-size, 14px);
  height: var(--loop-select-tag-cross-size, 14px);
  /* Figma ✕ is an inline icon, not the provider's filled neutral circle —
     null the circle/absolute positioning the lib injects at runtime. */
  background: transparent !important;
  border-radius: 0 !important;
  position: static !important;
}
.osui-dropdown-tags .vscomp-value-tag-clear-button .vscomp-clear-icon {
  background-color: var(--color-icon-on-light-default);
}
.osui-dropdown-tags .vscomp-value-tag-clear-button:focus-visible {
  outline: 2px solid var(--color-outline-on-light-link-focused);
  outline-offset: 2px;
  border-radius: 2px;
}

/* ---- Options dropbox (open list) ---- */
.osui-dropdown-search .vscomp-dropbox,
.osui-dropdown-tags .vscomp-dropbox {
  background-color: var(--color-bg-container-on-light-lowest) !important;
  border: 1px solid var(--color-outline-on-light-subdued) !important;   /* see FND-032 */
  border-radius: var(--loop-select-list-radius, 8px) !important;
  box-shadow: var(--loop-select-list-shadow) !important;
}
.osui-dropdown-search .vscomp-option,
.osui-dropdown-tags .vscomp-option {
  padding: var(--space-xxsmall, 8px) var(--loop-select-padding-inline, 16px);
  color: var(--color-text-on-light-default);
  font-size: var(--font-size-200, 14px);
}
.osui-dropdown-search .vscomp-option.hovered,
.osui-dropdown-search .vscomp-option.focused,
.osui-dropdown-tags .vscomp-option.hovered,
.osui-dropdown-tags .vscomp-option.focused {
  background-color: var(--color-bg-container-on-light-low) !important;  /* #f5f7f9 */
}
.osui-dropdown-search .vscomp-option.selected,
.osui-dropdown-tags .vscomp-option.selected {
  background-color: var(--color-bg-container-on-light-low) !important;
  color: var(--color-text-on-light-default);
}

/* ---- Multi-select options: hide the lib's left checkbox; selected row gets a
        right-aligned check only (Figma node 18830-17312). Affordance change is
        raised as FND-033; ARIA role=option / aria-selected stay intact. ---- */
.osui-dropdown-tags .vscomp-option {
  display: flex;
  align-items: center;
}
.osui-dropdown-tags .vscomp-option .checkbox-icon {
  display: none;
}
.osui-dropdown-tags .vscomp-option-text {
  width: auto;  /* lib forces calc(100% - 25px) for the checkbox gutter */
}
.osui-dropdown-tags .vscomp-option.selected::after {
  content: "";
  margin-left: auto;
  width: calc(var(--loop-select-option-check-size, 14px) / 2);
  height: var(--loop-select-option-check-size, 14px);
  border: solid var(--color-icon-on-light-default);  /* #4b5e71 */
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  flex: 0 0 auto;
}

/* ---- "+N" overflow chip — provider renders .vscomp-value-tag.more-value-count
        when noOfDisplayValues (set via the block's Extensibility JSON) is below the
        selected count. Style it as the neutral Figma pill (no clear button). ---- */
.osui-dropdown-tags .vscomp-value-tag.more-value-count {
  background-color: var(--loop-select-morecount-bg) !important;
  border: 1px solid var(--color-outline-on-light-subdued) !important;
  border-radius: var(--radius-pill) !important;
  padding: var(--loop-select-morecount-padding-block, 8px) var(--loop-select-morecount-padding-inline, 12px) !important;
  font-size: var(--font-size-200, 14px);
  color: var(--color-text-on-light-default);
}

/* search input inside the open list */
.osui-dropdown-search .vscomp-search-input,
.osui-dropdown-tags .vscomp-search-input {
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--font-size-200, 14px);
  color: var(--color-text-on-light-default);
}

/* ---- Dropdown Search single: per-option left icon (provider renders it from the
        option's image_url_or_class). Give it a consistent box + gap to the text. ---- */
.osui-dropdown-search .vscomp-option {
  display: flex;
  align-items: center;
  gap: var(--loop-field-gap, 8px);
}
.osui-dropdown-search .vscomp-option-icon {
  display: inline-flex;
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  color: var(--color-icon-on-light-default);
}
.osui-dropdown-search .vscomp-option-icon svg,
.osui-dropdown-search .vscomp-option-icon img {
  width: 100%;
  height: 100%;
}

/* ---- Reduced motion (WCAG 2.2 SC 2.3.3) ---- */
@media (prefers-reduced-motion: reduce) {
  .dropdown-container.dropdown > div.dropdown-display,
  .dropdown-container.dropdown > div.dropdown-display::after,
  .osui-dropdown-search .vscomp-ele-wrapper,
  .osui-dropdown-tags .vscomp-ele-wrapper { transition: none; }
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
- Multi-select **tag chips** (`.vscomp-value-tag`): neutral pill (`#f5f7f9`, radius 48), 14px clear icon.
- Multi-select tag **`✕`** rendered as an inline icon (`--color-icon-on-light-default`), not the provider's filled neutral circle.
- Multi-select **open-list options**: the lib's left checkbox is hidden; a **selected** row shows a right-aligned check only (`--color-icon-on-light-default`). Affordance change → **FND-033** (ARIA `role=option` / `aria-selected` kept intact).
- **`+N` overflow chip** (`.vscomp-value-tag.more-value-count`): neutral pill matching the tag chip; appears once `noOfDisplayValues` is set (see below).

## Advanced / extensibility config (Dropdown Tags block)
Some Figma behaviours are **provider settings**, not CSS. Paste this JSON into the block's
**Extensibility** (Advanced) property — it is *not* a code artifact that goes into Theme CSS:
```json
{ "noOfDisplayValues": 3, "markSearchResults": true, "showSelectedOptionsFirst": true }
```
- `noOfDisplayValues` → collapses extra tags into the **`+N`** chip. The count is a
  **design-tunable** (set it to whatever the field width allows), not a fixed value.
- `markSearchResults` → highlights matched search text in the option list.
- `showSelectedOptionsFirst` → keeps checked options at the top of the open list.

**Dropdown Search:** search is on by default — no config needed. Per-option **left icons**
come from each option's **`image_url_or_class`** field (an icon class or image URL); populate
it so the search list renders the Figma leading icons.

## Checklist
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new `--loop-select-*` tokens).
- [ ] Paste `loop-dropdown.css` into Theme CSS, **below** OutSystems UI.
- [ ] Single Select → native **Dropdown** widget; Search → **Dropdown Search**; Multi → **Dropdown Tags**.
- [ ] Dropdown Tags → paste the **Extensibility JSON** above (drives the `+N` chip via `noOfDisplayValues`); Dropdown Search → set each option's `image_url_or_class` for left icons.
- [ ] Error → bind an OutSystems **Validation** (sets `.not-valid`); Warning → Extended Class `is-warning`; empty single Select → `is-placeholder`.
- [ ] Wrap Label + field + helper in a Container with `loop-field loop-field--select` (single) or `loop-field` (multi).
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview). The VirtualSelect DOM is provider-generated — confirm the `.vscomp-*` overrides land on the published markup.

## Open findings linked to this work (register-only — low, no GitHub Bug auto-filed)
- **FND-031** (consistency/design-token, low) — Select field metrics diverge from the Text Field & scale: pill `--radius-pill` 32px vs Text Field `--radius-medium` 8px; `vpadding` 11px off the 4pt grid; label/value 13px vs the 16px used by Text Field & Multi-select.
- **FND-032** (design-token, low) — popup-list border `#dae1e8` is a foreign `lift` token with no WBG primitive; substituted to `--color-outline-on-light-subdued`.
- **FND-019** (a11y/contrast, medium, shared) — resting border `#00396b3d` ≈ 1.45:1 on white (non-text contrast, SC 1.4.11).
- **FND-012** (a11y/brand, medium, cross-ref) — Blue/50 brand focus ring replaces OutSystems' high-contrast yellow ring.
- **FND-033** (a11y/consistency, low) — multi-select option rows hide the native checkbox affordance in favour of a right-aligned check; selection is conveyed by chips + check. Built faithfully to Figma; ARIA `role=option` / `aria-selected` retained.
