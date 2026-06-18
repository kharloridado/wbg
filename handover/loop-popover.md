# Handover — loop-popover (custom Web Component)

The Loop **Popover** — floating contextual panel anchored to a trigger element.
Figma: "Popover" [node 26345-2762].

**Approach:** Custom component, no native OutSystems widget equivalent. Built as a
vanilla JS Web Component (Shadow DOM) wrapped in an OutSystems Block. Four pointer
positions plus none; optional title header with dismiss button; default width 320px.

## Files
| File | OutSystems destination |
|---|---|
| `src/components/loop-popover.js` | Script resource (Theme/Library), Include = **When invoked** |
| `src/components/loop-popover.css` | CSS reference only — styles are embedded in the `.js` Shadow DOM |
| `tokens/component-popover.css` | Included automatically in `dist/theme.css` |

## API — Attributes
| Attribute | Values | Description |
|---|---|---|
| `pointer` | `top` \| `bottom` \| `left` \| `right` \| `none` | Pointer triangle position (default: `bottom`) |
| `title` | Text | Optional header title (14px Bold, with separator below) |
| `has-dismiss` | Boolean | Shows × close button in header |
| `open` | Boolean | Visible; omit/remove attribute to hide |

## API — Events
| Event | Detail | Description |
|---|---|---|
| `close` | `{}` | Fired when dismiss button clicked or Escape pressed |

## API — Slots
| Slot | Description |
|---|---|
| (default) | Body content — place Text/Expression/HTML widgets here (12px Regular) |

## Pointer positions explained
The pointer triangle (18×8px) visually connects the popover to the trigger:
- `pointer="top"` → triangle at top, popover placed **below** the trigger
- `pointer="bottom"` → triangle at bottom, popover placed **above** the trigger (default)
- `pointer="left"` → triangle at left, popover placed to the **right** of trigger
- `pointer="right"` → triangle at right, popover placed to the **left** of trigger
- `pointer="none"` → no triangle (tooltip-style floating panel)

## Example HTML
```html
<!-- Trigger button -->
<button id="info-trigger"
  onclick="document.getElementById('my-popover').toggleAttribute('open')"
  aria-controls="my-popover"
  aria-expanded="false">
  More info
</button>

<!-- Popover -->
<loop-popover id="my-popover" pointer="top" title="About this field" has-dismiss open>
  <p>This value determines the project priority level for reporting purposes.</p>
</loop-popover>
```

## CSS customisation
Override width on the host:
```css
#my-popover { --loop-popover-width: 280px; }
```

## OutSystems Block wiring
1. Create Block `Popover`: inputs `Pointer`, `Title`, `HasDismiss`, `Open`; event `OnClose`.
2. In OnReady, set attributes from inputs via JavaScript node.
3. Wire `close` CustomEvent → `OnClose`.
4. Use an OutSystems Placeholder for the default slot (body content).
5. Trigger show/hide by toggling the `open` attribute from the trigger's OnClick JavaScript node.

## Accessibility (WCAG 2.2 AA)
`role="dialog"` + `aria-modal="false"`; title linked via `aria-labelledby`; dismiss has
`aria-label="Close popover"`; Escape key fires `close` and removes `open` attribute;
focus ring uses `--loop-popover-focus` (brand blue `#0071bc`).
⚠️ Popover positioning relative to trigger is the Block author's responsibility —
the component renders in document flow. Use absolute/fixed positioning on the wrapping
Container to align with the trigger.

## Checklist
- [ ] Import `loop-popover.js` as Script resource, Include = When invoked.
- [ ] Rebuild `dist/theme.css` and paste into ODC Theme editor (includes `--loop-popover-*` tokens).
- [ ] Create Block `Popover` with inputs, event, and Placeholder for body above.
- [ ] Test all five pointer positions; test with/without title; test dismiss and Escape.
- [ ] Position the popover relative to the trigger using OutSystems layout tools.
- [ ] 1-Click Publish → validate in a **real browser** (Web Components never work in Service Studio Preview).
