# Handover — loop-system-alert (custom Web Component)

The Loop **System Alert** — full-width notification banner for page-level messages.
Figma: "System Alerts" [node 17873-7603].

**Approach:** Custom component, no native OutSystems widget equivalent. Built as a
vanilla JS Web Component (Shadow DOM) wrapped in an OutSystems Block. Four types;
single-line and multi-line layouts; optional icon slot, action link, dismiss button.

## Files
| File | OutSystems destination |
|---|---|
| `src/components/loop-system-alert.js` | Script resource (Theme/Library), Include = **Always** (banner is rendered on page load) |
| `src/components/loop-system-alert.css` | CSS reference only — styles are embedded in the `.js` Shadow DOM |
| `tokens/component-system-alert.css` | Included automatically in `dist/theme.css` |

## API — Attributes
| Attribute | Values | Description |
|---|---|---|
| `type` | `error` \| `warning` \| `informative` \| `offline` | Alert variant (default: `error`) |
| `title` | Text | Optional bold title (16px Bold) |
| `message` | Text | Alert body text (14px) |
| `action-label` | Text | Optional action link/button label |
| `action-href` | URL | If set, action renders as `<a>`; if omitted, fires `action` event |
| `dismissible` | Boolean | Shows × dismiss button |
| `multiline` | Boolean | Stacks title + message + action vertically (icon top-aligned) |

## API — Events
| Event | Detail | Description |
|---|---|---|
| `dismiss` | `{ type }` | Fired when dismiss button clicked; component auto-hides |
| `action` | `{ type }` | Fired when action clicked without `action-href` |

## API — Slots
| Slot | Description |
|---|---|
| `icon` | Optional 16×16 icon element, e.g. `<img slot="icon" src="…" alt="">` |

## Example HTML
```html
<!-- Single-line, error, with action -->
<loop-system-alert
  type="error"
  title="Connection failed"
  message="Could not connect to the server."
  action-label="Retry"
  dismissible>
  <img slot="icon" src="icon-error.svg" alt="">
</loop-system-alert>

<!-- Multi-line, informative -->
<loop-system-alert
  type="informative"
  title="New update available"
  message="A new version of the application is available. Please save your work before updating."
  action-label="Update now"
  action-href="/update"
  multiline>
</loop-system-alert>
```

## OutSystems Block wiring
1. Create Block `SystemAlert`: inputs `Type`, `Title`, `Message`, `ActionLabel`, `ActionHref`, `Dismissible`, `Multiline`; event `OnDismiss`, `OnAction`.
2. In OnReady, set attributes from inputs via JavaScript node.
3. Wire `dismiss` CustomEvent → `OnDismiss`. Wire `action` CustomEvent → `OnAction`.
4. For dynamic server-side messages: use a Block variable + `SetAttribute` on the element.

## Accessibility (WCAG 2.2 AA)
`role="alert"` = live region; screen readers announce on insertion. Dismiss has
`aria-label="Dismiss alert"`. Focus ring uses `currentColor` (visible on all four backgrounds).
⚠️ **Pending finding:** `rgba(255,255,255,0.75)` text on `offline` background (`#8a9db1`) may
fail WCAG contrast — exact computation needed. Filed as a11y finding.

## Checklist
- [ ] Import `loop-system-alert.js` as Script resource, Include = Always.
- [ ] Rebuild `dist/theme.css` and paste into ODC Theme editor (includes `--loop-sysalert-*` tokens).
- [ ] Create Block `SystemAlert` with inputs and events above.
- [ ] Test all four types; test dismiss; test single-line and multiline; test with/without icon.
- [ ] 1-Click Publish → validate in a **real browser** (Web Components never work in Service Studio Preview).
