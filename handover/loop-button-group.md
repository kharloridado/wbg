# Handover — Button Group + Button Switch (restyle native `.button-group`)

The Loop **Button Group** and **Button Switch** styling.
Figma: "Button Group" [node 15597-2978] · "Button Switch" [node 15597-4070].

**Design note:** per review, the **Button Switch IS a Button Group** (a 2-option segmented
group). Same widget, same classes — one file covers both (#27 and #28).

**Approach:** Restyle the native OutSystems UI **Button Group** widget
(`.button-group` / `.button-group-item` / `.button-group-selected-item`). Devs use the
standard OutSystems ButtonGroup widget; no custom class system.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-button-group.css` | Theme CSS (paste below OutSystems UI) |
| `tokens/*` → `dist/theme.css` | adds `--radius-xs` (2px joined inner corners) |

## What the override changes vs OutSystems UI baseline
- Outer end-caps = pill **32px**; joined inner corners = **2px** (`--radius-xs`, Figma `Button/Border Raduis = 2`).
- Outlined items in **blue-70**; **selected item filled blue-70** + white label.
- Open Sans **700**, tracking **-0.5px**, padding 16/32.
- Shared border collapse (native behaviour) kept explicit; focus ring raised above neighbours.

## Checklist
- [ ] Rebuild + paste latest `dist/theme.css` (carries `--radius-xs`).
- [ ] Paste `loop-button-group.css` into Theme CSS, below OutSystems UI.
- [ ] Use the native **Button Group** widget; mark the active item (`button-group-selected-item`).
- [ ] For a Switch, use a 2-item group.
- [ ] 1-Click Publish → validate in a **real browser** (never Service Studio Preview).

## Open findings linked to this work
- Shares **FND-013** (off-scale button gap/tracking) via the reused button label tokens.
