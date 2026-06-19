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
