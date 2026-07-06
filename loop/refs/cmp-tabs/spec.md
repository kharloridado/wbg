# Frozen Figma ref — cmp-tabs

- **Figma file:** zx8q9nRf8Dbqam1rfquQ2E (The Loop — Main Library (2))
- **Node:** 18686:5828 ("Examples" frame — renders the tab component in three device
  frames: Desktop, Tablet, Mobile). Component instances captured: `18686:5833` (Desktop),
  `18686:5837` (Tablet), `18686:5841` (Mobile) — all "Lift Tabs 3".
- **Pulled:** 2026-07-06 (device-responsive font-size validation; variables + screenshot).
- Exact token values: `variables.json`.

## Key values — tab label (the component under validation), by device

The tab label uses its **own** typography variables (`loop/tabs/label/*`), independent of
the body type ramp. Two distinct value sets: Desktop vs. Tablet = Mobile.

| Property | Desktop | Tablet | Mobile | Figma variable |
|---|---|---|---|---|
| font size | 20 | 18 | 18 | `loop/tabs/label/font size` |
| line height | 20 | 18 | 18 | `loop/tabs/label/line height` |
| letter spacing | −0.13 | −0.13 | −0.13 | `loop/tabs/label/letter spacing` |
| font weight | 700 | 700 | 700 | `loop/tabs/label/font weight` |
| gap between tabs | 24 | 20 | 20 | `loop/tabs/gap between tabs` |
| h-padding (icon↔label) | 12 | 10 | 10 | `loop/tabs/h-padding` |
| v-padding (label↔bar) | 12 | 10 | 10 | `loop/tabs/v-padding` |
| label enabled | #004370 | — | — | `Text/On Light/Link/Primary Enabled` |
| label active/hover | #012740 | — | — | `Text/On Light/Emphasis` |
| active indicator | #169af3 | — | — | `Background/Container/On Light/Link/Primary/Hover` |
| header divider | #00396b14 | — | — | `Divider/On Light/Subdued` |

**Font family:** Open Sans (`Global/Font Family`) in every state.

Implementation maps: base (desktop, no device class) = the 20/20/24/12 set; compact
(OSUI `.tablet` ≤1024px / `.phone` ≤700px runtime body classes) = the 18/18/20/10 set.
Both device thresholds match Figma's three frames (`DeviceDetection.ts`: phoneMax 700,
tabletMax 1024). Implemented in `src/blocks/loop-tabs.css` + `tokens/component-tabs.css`.

## Content-panel body text (implemented tab-scoped)

The content copy in the same Examples frame uses `Font-size/500`, whose resolved value is
**device-varying**: Desktop **20** (`18686:5834`) / Tablet **18** (`18686:5838`) / Mobile
**16** (`18686:5842`) — Open Sans 400, line-height 1.5, tracking −0.25.

This is implemented **scoped to the tabs content panel** (`.osui-tabs__content`):
`--loop-tabs-content-size` = `var(--font-size-500)` 20 / tablet `var(--font-size-400)` 18 /
mobile `var(--font-size-300)` 16 — referencing the FIXED scale steps so the per-device
switch touches tabs alone (no global `--font-size-*` change; other components unaffected).

Intentional divergence on Mobile: tab **header = 18px** (its own token, held on both
tablet+mobile) while **content body = 16px** — separate sizes by design.

Broader note: this same `Font-size/500` device axis (20/18/16) is evidence that the WBG
type ramp is responsive globally, which **contradicts the premise of FND-059**. The global
body ramp is still held fixed in `tokens/typography.css` pending design sign-off — only the
tabs content panel implements the axis locally here.
