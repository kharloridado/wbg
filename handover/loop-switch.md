# Handover — Toggle / Switch (restyle native OutSystems UI `[data-switch]`)

The Loop **Toggle** styling, ready to add into OutSystems.
Figma: `-The Loop- Main Library` · "Toggle" [node 25344-27822] · switch set [node 25344-27924].

**Approach:** This does NOT introduce a custom toggle class. It **restyles the native
OutSystems UI Switch widget** (`[data-switch]`) to The Loop design — same pattern as
`loop-button.css` / `loop-radio-button.css`. Developers keep using the standard
OutSystems **Switch** widget; the theme makes it look like The Loop. No Web Component.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-switch.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/component-toggle.css` → `dist/theme.css` | Theme CSS (adds `--loop-toggle-*` track/thumb/label metrics) |

## What the override builds
The native switch pseudo-elements are restyled: `:before` = the 56×32 pill track,
`:after` = the 24px white thumb (4px padding, travel 28px). Each conflicting rule is
also restated for `.has-accessible-features` so the override wins whether or not the app
runs with accessibility features on.

**States (track color — `Domain/Interactive/On Light/*` + `Icon/On Light/*`):**
| State | Treatment |
|---|---|
| Off (unchecked) | track `Icon/On Light/Default` #4b5e71 (neutral-60), thumb left |
| On (checked) | track `Enabled Primary` #004370 (blue-70), thumb right |
| On · hover | track `Hover` #169af3 (blue-40) |
| On · pressed | track `Pressed` #012740 (blue-90) |
| Disabled | track `Disable` #8a9db1 (neutral-40), inert |
| Focus | 2px `Focused` #0071bc (blue-50) ring, offset 2px |

Thumb is always `Background/White`. **Label:** Open Sans 400, 16/18, `Text/On Light/Default`,
gap 8px (`loop/toggle/label/gap`), row min-height 40px.

## Label layout (BEM wrapper `.loop-toggle`, applied via **Extended Class** on the container)
The OutSystems Switch has no bound label element (unlike Checkbox/Radio), so the label is
a sibling laid out by the wrapper. Default = label **Right**.
| Position | Class |
|---|---|
| Right (default) | `loop-toggle` |
| Left | `loop-toggle loop-toggle--left` |
| Top | `loop-toggle loop-toggle--top` |
| Bottom | `loop-toggle loop-toggle--bottom` |

## Sizes (apply via the widget's **Extended Class** on the input — default = xLarge)
| The Loop size | Class | Track |
|---|---|---|
| **xLarge** (default) | _(none)_ | 56×32, circle 24 |
| Large | `loop-toggle-large` | 48×26, circle 18 |
| Regular | `loop-toggle-regular` | 40×20, circle 12 |
| Small | `loop-toggle-small` | 32×16, circle 8 |

## Checklist
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new `--loop-toggle-*` tokens).
- [ ] Paste `loop-switch.css` into Theme CSS, below OutSystems UI.
- [ ] Use the native **Switch** widget. For a non-default size set Extended Class = `loop-toggle-large` / `loop-toggle-regular` / `loop-toggle-small`.
- [ ] Pair each Switch with a visible label; wrap the Switch + label container with Extended Class `loop-toggle` (+ a position modifier). Per the DS guidelines, use a Toggle when there are exactly two options.
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview alone). Check the keyboard focus ring + that Space toggles state.

## Open findings linked to this work
- **FND-024** (design-token, low) — label line-height published twice with different values (`loop/Toggle/Label/Line Height` 16 vs `loop/toggle/label/line height` 18); built on 18 (the assembled instance). Register-only.
- **FND-025** (design-token, low) — only the xLarge switch has published `loop/toggle/switch/*` tokens; Large/Regular/Small reuse observed track dims with padding held at 4px (circle = h − 2·padding). Confirm the smaller-size metrics. Register-only.
- **FND-026** (consistency, low) — the ON thumb carries a 16px check glyph [node 25845-30789] in Figma; its colour/asset wasn't published as a token, so the thumb renders without it. Additive detail; colours/geometry are faithful. Register-only.
