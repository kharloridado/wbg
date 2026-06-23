# Handover — Tabs (restyle native OutSystems UI Tabs pattern)

The Loop **Tabs** bar styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · page "⤵ ✅ Tab & Tab Group" [node 18672-2679] · tab bar
"-loop tab / group" [node 18683-4865].

**Approach:** No custom tabs class system. This **restyles the native OutSystems UI Tabs
pattern** to The Loop design — same idea as the Button / Text Field / Dropdown:

- **Tabs PATTERN** → `.tabs` › `.tabs-header[role=tablist]` › `.tabs-header-item[role=tab]`
  (`+ .active`) › `.tabs-header-item-content`, with `.tabs-content` › `.tabs-content-item`.

Developers keep using the stock **Tabs** block; this layer makes its header render as The
Loop's underlined tab bar — a horizontal row of bold text tabs (Open Sans 700 / 20px), 24px
apart, on a full-width subdued hairline divider; the active tab is emphasis-blue with a 2px
underline indicator, and hovering any tab previews that underline. **No JavaScript is added**
— the native Tabs pattern already provides `role=tablist/tab/tabpanel`, Arrow-key roving
focus, and panel switching; this is purely the brand skin. Focus = 2px Blue/50 brand ring
(cf. FND-012).

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-tabs.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/component-tab.css` → `dist/theme.css` | Theme CSS (adds the `--loop-tab-*` tokens) |

> Canonical CSS lives in `src/blocks/loop-tabs.css`; it is embedded into this ticket by
> `node build/embed-handover-code.mjs` — re-run after editing the source to keep them in sync.

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-tabs.css</code> → Theme CSS — paste below OutSystems UI</summary>

```css
/* ============================================
   Component: Tabs  ("The Loop" — the "Lift Tabs" bar)
   Figma: -The Loop- Main Library
     · page "⤵ ✅ Tab & Tab Group"  [node:18672-2679]
     · tab BAR ("-loop tab / group") [node:18683-4865]  ← built here

   Approach: RESTYLE the native OutSystems UI Tabs pattern — NOT a parallel class
   system. Devs reach for the stock OutSystems Tabs block; this layer makes its
   header render as The Loop's underlined tab bar:
     .tabs > .tabs-header[role=tablist] > .tabs-header-item[role=tab]
            (+ .active) > .tabs-header-item-content
     .tabs > .tabs-content > .tabs-content-item

   Location: Theme CSS (loaded after OutSystems UI so it wins on equal specificity).
   Escalation Level: L1/L2 (native widget + token-driven theme override). The native
   Tabs pattern already ships role=tablist/tab/tabpanel + Arrow-key roving focus and
   panel switching, so no JS is added — this is purely the brand skin.

   The bar = a horizontal row of bold text tabs (Open Sans 700 / 20px), 24px apart,
   sitting on a full-width subdued hairline divider; the active tab is emphasis-blue
   with a 2px underline indicator, and hovering any tab previews that underline.

   Fidelity notes (built faithfully; raised, NOT silently changed):
     - label letter-spacing -0.13px is off the -0.35/-1.5 tracking scale       → FND-033
     - label line-height 20px == font-size (ratio 1.0), tighter than the
       1.12–1.25 heading rhythm                                                → FND-033
     - active/hover underline = Blue/40 #169af3 ≈ 3.0:1 on white; as a 2px
       graphical indicator it sits on the 3:1 SC 1.4.11 minimum (cf. FND-011)  → FND-034
   ============================================ */

/* ---- The bar: full-width subdued baseline divider; tabs laid out 24px apart ---- */
.tabs > .tabs-header {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  gap: var(--loop-tab-gap, 24px);
  border-bottom: var(--loop-tab-divider-size, 1px) solid var(--loop-tab-divider-color);
}

/* ---- Tab (enabled / inactive) ---- */
.tabs > .tabs-header > .tabs-header-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xxsmall, 8px);                  /* label ↔ icon, when an icon is present */
  margin: 0;
  padding: var(--loop-tab-padding-block, 12px) var(--loop-tab-padding-inline, 12px);
  background: transparent;
  border: 0;
  cursor: pointer;

  color: var(--loop-tab-label-color);              /* #004370 blue-70 */
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-tab-label-size, 20px);
  font-weight: var(--loop-tab-label-weight, 700);
  line-height: var(--loop-tab-label-leading, 20px);
  letter-spacing: var(--loop-tab-label-tracking, -0.13px);

  /* the underline indicator — transparent until hover/active so the row never jumps */
  border-bottom: var(--loop-tab-indicator-size, 2px) solid transparent;
  margin-bottom: calc(-1 * var(--loop-tab-divider-size, 1px));   /* overlap the bar divider */
  transition: color 120ms ease, border-color 120ms ease;
}

/* icon glyph inside a tab (OutSystems UI .icon) tracks the label colour */
.tabs > .tabs-header > .tabs-header-item .icon {
  color: inherit;
}

/* ---- Hover — preview the underline indicator ---- */
.tabs > .tabs-header > .tabs-header-item:hover {
  border-bottom-color: var(--loop-tab-indicator-color);   /* #169af3 blue-40 — FND-034 */
}

/* ---- Selected / active — emphasis label + persistent underline ---- */
.tabs > .tabs-header > .tabs-header-item.active,
.tabs > .tabs-header > .tabs-header-item[aria-selected="true"] {
  color: var(--loop-tab-label-color-active);              /* #012740 blue-90 */
  border-bottom-color: var(--loop-tab-indicator-color);   /* #169af3 blue-40 */
}

/* ---- Disabled — native .disabled / [disabled] / aria-disabled ---- */
.tabs > .tabs-header > .tabs-header-item.disabled,
.tabs > .tabs-header > .tabs-header-item[disabled],
.tabs > .tabs-header > .tabs-header-item[aria-disabled="true"] {
  color: var(--loop-tab-label-color-disabled);           /* #00294d6b neutral-alpha-42 */
  border-bottom-color: transparent;
  cursor: not-allowed;
  pointer-events: none;
}

/* ---- Keyboard focus — 2px Blue/50 brand ring (cf. FND-012); offset inward so the
   ring is visible without disturbing the underline indicator ---- */
.tabs > .tabs-header > .tabs-header-item:focus-visible {
  outline: 2px solid var(--loop-tab-focus-ring);          /* #0071bc blue-50 */
  outline-offset: -2px;
  border-radius: var(--radius-base, 4px);
}

/* ---- Size: Large (tablet / mobile) — apply .tabs--large via ExtendedClass.
   XLarge (20px) is the desktop default above. ---- */
.tabs.tabs--large > .tabs-header > .tabs-header-item {
  font-size: var(--loop-tab-label-size-large, 18px);
}

/* ---- Reduced motion (WCAG 2.2 SC 2.3.3) ---- */
@media (prefers-reduced-motion: reduce) {
  .tabs > .tabs-header > .tabs-header-item { transition: none; }
}
```

</details>

## State mapping (Figma "State" → OutSystems)
| The Loop | How |
|---|---|
| **Enabled (inactive)** | native — base `.tabs-header-item` (Link Primary blue-70 label) |
| **Hover** | native `:hover` — previews the Blue/40 underline indicator |
| **Selected (active)** | native — `.tabs-header-item.active` (emphasis blue-90 label + persistent 2px underline) |
| **Disabled** | native — `.disabled` / `[disabled]` / `aria-disabled="true"` on the item (subdued, no underline, not focusable) |

## Size mapping (Figma sizes → OutSystems)
- **XLarge (20px)** — the **default**; desktop. No extra class.
- **Large (18px)** — tablet / mobile. Apply Extended Class **`tabs--large`** on the Tabs block.

## What the override changes vs OutSystems UI baseline
- **Header bar**: flex row, **24px** gap between tabs, full-width **1px** baseline divider in
  `--color-divider-on-light-subdued` (`#00396b14`).
- **Tab label**: Open Sans **700**, **20px**, line-height 20, letter-spacing **-0.13px**,
  colour Link Primary `#004370` (blue-70); padding 12/12.
- **Underline indicator**: transparent by default (so the row never jumps), **2px Blue/40**
  `#169af3` on hover, and persistent on `.active` (which also shifts the label to emphasis
  blue-90 `#012740`).
- **Disabled**: label `--color-text-on-light-state-disabled`, no indicator, `pointer-events:none`.
- **Focus**: 2px Blue/50 `:focus-visible` ring, `outline-offset:-2px` (no layout shift).
- **Reduced motion**: indicator/colour transitions removed under `prefers-reduced-motion`.

## Checklist
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new `--loop-tab-*` tokens).
- [ ] Paste `loop-tabs.css` into Theme CSS, **below** OutSystems UI.
- [ ] Build the tab strip with the native **Tabs** widget (TabsHeader / TabsHeaderItem / TabsContent).
- [ ] Tablet/mobile sizing → add Extended Class `tabs--large` on the Tabs block.
- [ ] Disabled tab → set the TabsHeaderItem to disabled (native `.disabled` / `aria-disabled`).
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service
      Studio Preview): bold 20px labels 24px apart, full-width subdued divider, active tab
      emphasis + blue underline, hover underline, Tab/Arrow-key focus shows the Blue/50 ring,
      and reduced-motion disables the transitions.

## Open findings linked to this work (register-only — no GitHub Bug auto-filed, gate = high+)
- **FND-033** (design-token, low) — label `letter-spacing -0.13px` is off the `-0.35`/`-1.5`
  tracking scale and `line-height 20px` equals the font-size (ratio 1.0).
- **FND-034** (a11y/contrast, medium) — the active/hover underline `Blue/40 #169af3` ≈ 3.02:1
  on white (2px graphical indicator on the 3:1 SC 1.4.11 floor; cf. FND-011); active status
  leans on this borderline-contrast colour plus the label emphasis shift.
