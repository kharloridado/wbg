# Handover — loop-button-dropdown (custom Web Component)

The Loop **Button Dropdown** — a button that opens a menu of actions.
Figma: "Button Dropdown" [node 15597-3469].

**Approach:** Per review, the dropdown is **custom**, not a native OutSystems button.
Built as a vanilla JS Web Component (CLAUDE.md hard rule #6 — no Lit/Stencil/React),
wrapped in an OutSystems Block. The trigger reuses the loop/button spec; the menu is
a shadow-DOM popover.

## Files
| File | OutSystems destination |
|---|---|
| `src/components/loop-button-dropdown.js` | Script resource (Theme/Library), Include = When invoked |
| `src/components/loop-button-dropdown.css` | Source of the shadow styles (edit here, mirror into `render()`) |
| Block: `ButtonDropdown` | Patterns Library |

## API
- **Attributes:** `label`, `options` (JSON `[{value,label}]`), `variant` (`primary`|`secondary`), `open`, `disabled`
- **Events:** `select` → `{ value, label }`; `toggle` → `{ open }`

## Accessibility (WCAG 2.2 AA)
Menu-button pattern: trigger `aria-haspopup="menu"` + `aria-expanded`; `role=menu`/`menuitem`;
ArrowUp/Down/Home/End nav; Escape closes + returns focus to trigger; click-outside closes;
44px item target size; brand-blue focus ring.

## Inferred values (no Figma token)
The trigger is fully tokenised (blue-70, pill, Open Sans 700, 18px chevron). The **menu/popover
detail is not tokenised in Figma**, so menu radius (`--radius-medium`), shadow (`--shadow-regular`),
item padding and hover (`--color-neutral-05`) are **derived from foundation tokens** — confirm
against the Figma menu spec when available.

## Checklist
- [ ] Import `loop-button-dropdown.js` as a Script resource (Include = When invoked).
- [ ] Create Block `ButtonDropdown`: inputs `Label`, `Options`, `Variant`, `Disabled`; events `OnSelect`, `OnToggle`; OnReady wiring `select` → `OnSelect(e.detail.value)`.
- [ ] 1-Click Publish → validate in a **real browser** (Web Components never work in Service Studio Preview).

## Open findings linked to this work
- (none yet) — menu styling derived from foundation tokens pending detailed Figma menu spec.
