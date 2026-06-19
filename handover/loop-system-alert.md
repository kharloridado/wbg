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

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-system-alert.js</code> → Script resource (Theme/Library), Include = Always</summary>

```js
/**
 * <loop-system-alert> — Full-width system notification banner.
 *
 * Figma: "System Alerts" [node:17873-7603]. Custom Web Component — no native OS widget.
 * Renders a full-width alert banner with optional icon slot, title, body text, action
 * link/button, and dismiss (×) button. Four semantic types; single-line and multi-line.
 *
 * Attributes:
 *   type          "error" | "warning" | "informative" | "offline"  (default: "error")
 *   title         Optional bold title text (16px Bold)
 *   message       Alert body text (14px Regular)
 *   action-label  Optional action link/button label (14px Bold underline)
 *   action-href   If present, renders action as <a href>; otherwise fires "action" event
 *   dismissible   Boolean — shows × button; fires "dismiss" event + hides host
 *   multiline     Boolean — stacks title, message and action vertically (icon top-aligned)
 *
 * Events (bubbles, composed):
 *   dismiss — fired when dismiss button clicked; detail: { type }
 *   action  — fired when action clicked without action-href; detail: { type }
 *
 * Slots:
 *   icon — optional 16×16 icon element, e.g. <img slot="icon" src="…" alt="">
 *
 * Accessibility: role="alert" (live region); dismiss has aria-label; Escape key does
 * nothing (the banner is page-level, not a modal); focus ring uses currentColor per
 * CLAUDE.md (no silent color substitution).
 *
 * OutSystems: drop loop-system-alert.js into Resources. In a Block, add an HTML element:
 *   <loop-system-alert type="error" title="Title" message="Alert text" dismissible></loop-system-alert>
 * Pass dynamic values via the OutSystems JavaScript node that sets attributes after render.
 */
class LoopSystemAlert extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'title', 'message', 'action-label', 'action-href', 'dismissible', 'multiline'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onDismiss = this._onDismiss.bind(this);
    this._onAction  = this._onAction.bind(this);
  }

  connectedCallback()  { this._render(); }
  attributeChangedCallback(n, o, v) { if (o !== v) this._render(); }

  get _type()        { return this.getAttribute('type') || 'error'; }
  get _title()       { return this.getAttribute('title') || ''; }
  get _message()     { return this.getAttribute('message') || ''; }
  get _actionLabel() { return this.getAttribute('action-label') || ''; }
  get _actionHref()  { return this.getAttribute('action-href') || ''; }
  get _dismissible() { return this.hasAttribute('dismissible'); }
  get _multiline()   { return this.hasAttribute('multiline'); }

  _onDismiss() {
    this.dispatchEvent(new CustomEvent('dismiss', { bubbles: true, composed: true, detail: { type: this._type } }));
    this.hidden = true;
  }

  _onAction() {
    this.dispatchEvent(new CustomEvent('action', { bubbles: true, composed: true, detail: { type: this._type } }));
  }

  _render() {
    const t            = this._type;
    const multiline    = this._multiline;
    const title        = this._title;
    const message      = this._message;
    const actionLabel  = this._actionLabel;
    const actionHref   = this._actionHref;
    const dismissible  = this._dismissible;

    const actionHtml = actionLabel
      ? actionHref
        ? `<a class="lsa__action" href="${actionHref}">${actionLabel}</a>`
        : `<button class="lsa__action" type="button">${actionLabel}</button>`
      : '';

    const titleHtml   = title   ? `<span class="lsa__title">${title}</span>` : '';
    const messageHtml = message ? `<p class="lsa__message">${message}</p>`   : '';

    const dismissHtml = dismissible
      ? `<button class="lsa__dismiss" type="button" aria-label="Dismiss alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>`
      : '';

    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="lsa lsa--${t}${multiline ? ' lsa--multiline' : ''}" role="alert" part="alert">
        <div class="lsa__content" part="content">
          <slot name="icon" class="lsa__icon-slot"></slot>
          <div class="lsa__text" part="text">
            ${titleHtml}
            ${messageHtml}
            ${multiline ? '' : actionHtml}
          </div>
          ${multiline && actionHtml ? actionHtml : ''}
        </div>
        ${dismissHtml}
      </div>`;

    if (dismissible) {
      this.shadowRoot.querySelector('.lsa__dismiss').addEventListener('click', this._onDismiss);
    }
    if (actionLabel && !actionHref) {
      this.shadowRoot.querySelector('.lsa__action')?.addEventListener('click', this._onAction);
    }
  }

  _css() {
    return `
:host { display: block; width: 100%; }
:host([hidden]) { display: none; }

.lsa {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--loop-sysalert-gap, 8px);
  padding: var(--loop-sysalert-padding-v, 8px) var(--loop-sysalert-padding-h, 12px);
  min-width: 280px;
}
.lsa--multiline { align-items: flex-start; }

.lsa--error       { background-color: var(--loop-sysalert-error-bg, #9d161d); }
.lsa--warning     { background-color: var(--loop-sysalert-warning-bg, #e19d00); }
.lsa--informative { background-color: var(--loop-sysalert-informative-bg, #004370); }
.lsa--offline     { background-color: var(--loop-sysalert-offline-bg, #8a9db1); }

.lsa__content {
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--loop-sysalert-gap, 8px);
}
.lsa--multiline .lsa__content { align-items: flex-start; }

::slotted([slot="icon"]) {
  flex-shrink: 0;
  width: var(--loop-sysalert-icon-size, 16px);
  height: var(--loop-sysalert-icon-size, 16px);
}
.lsa--multiline ::slotted([slot="icon"]) { margin-top: 2px; }

.lsa__text {
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: var(--space-tiny, 4px);
  flex-wrap: wrap;
}
.lsa--multiline .lsa__text {
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}

.lsa__title {
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:   var(--loop-sysalert-title-size, 16px);
  font-weight: var(--font-weight-bold, 700);
  line-height: 1.5;
  white-space: nowrap;
  flex-shrink: 0;
}
.lsa__message {
  margin: 0;
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:   var(--loop-sysalert-body-size, 14px);
  font-weight: var(--font-weight-regular, 400);
  line-height: 1.25;
}

.lsa--error       .lsa__title, .lsa--error       .lsa__message {
  color: var(--loop-sysalert-error-text, rgba(255, 255, 255, 0.75));
}
.lsa--offline     .lsa__title, .lsa--offline     .lsa__message {
  color: var(--loop-sysalert-offline-text, rgba(255, 255, 255, 0.75));
}
.lsa--warning     .lsa__title, .lsa--warning     .lsa__message {
  color: var(--loop-sysalert-warning-text, #473201);
}
.lsa--informative .lsa__title, .lsa--informative .lsa__message {
  color: var(--loop-sysalert-informative-text, #f6fcff);
}

.lsa__action {
  font-family:     var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:       var(--loop-sysalert-body-size, 14px);
  font-weight:     var(--font-weight-bold, 700);
  line-height:     1.25;
  text-decoration: underline;
  background:      none;
  border:          0;
  padding:         0;
  cursor:          pointer;
  white-space:     nowrap;
  flex-shrink:     0;
}
.lsa--multiline .lsa__action { margin-top: var(--loop-sysalert-action-pt, 12px); }

.lsa--error       .lsa__action { color: var(--loop-sysalert-error-text, rgba(255, 255, 255, 0.75)); }
.lsa--offline     .lsa__action { color: var(--loop-sysalert-offline-text, rgba(255, 255, 255, 0.75)); }
.lsa--warning     .lsa__action { color: var(--loop-sysalert-warning-text, #473201); }
.lsa--informative .lsa__action { color: var(--loop-sysalert-informative-text, #f6fcff); }
.lsa__action:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; border-radius: 2px; }

.lsa__dismiss {
  flex-shrink: 0;
  display:     flex;
  align-items: center;
  justify-content: center;
  width:       var(--loop-sysalert-icon-size, 16px);
  height:      var(--loop-sysalert-icon-size, 16px);
  background:  none;
  border:      0;
  padding:     0;
  cursor:      pointer;
}
.lsa--multiline .lsa__dismiss { align-self: flex-start; margin-top: 2px; }

.lsa--error       .lsa__dismiss { color: var(--loop-sysalert-error-text, rgba(255, 255, 255, 0.75)); }
.lsa--offline     .lsa__dismiss { color: var(--loop-sysalert-offline-text, rgba(255, 255, 255, 0.75)); }
.lsa--warning     .lsa__dismiss { color: var(--loop-sysalert-warning-text, #473201); }
.lsa--informative .lsa__dismiss { color: var(--loop-sysalert-informative-text, #f6fcff); }
.lsa__dismiss:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; border-radius: 2px; }

@media (prefers-reduced-motion: reduce) {
  .lsa, .lsa__action, .lsa__dismiss { transition: none; }
}`;
  }
}

if (!customElements.get('loop-system-alert')) {
  customElements.define('loop-system-alert', LoopSystemAlert);
}
```

</details>

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
