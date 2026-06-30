/**
 * <loop-system-alert> — Full-width system notification banner.
 *
 * Figma: "System Alerts" [node:17873-7603]. Custom Web Component — no native OS widget.
 * Renders a full-width alert banner with a type icon, title, body text, action
 * link/button, and dismiss (×) button. Four semantic types; single-line and multi-line.
 *
 * Layout (per Figma):
 *   single-line — icon + title + message + action are a horizontally CENTERED group;
 *                 dismiss × pinned far right.
 *   multi-line  — icon top-left; title / message / action stacked left-aligned in a column;
 *                 dismiss × top-right.
 *
 * Attributes:
 *   type          "error" | "warning" | "informative" | "offline"  (default: "error")
 *   title         Optional bold title text (16px Bold)
 *   message       Alert body text (14px Regular)
 *   action-label  Optional action link/button label (14px Bold underline)
 *   action-href   If present, renders action as <a href>; otherwise fires "action" event
 *   dismissible   Boolean — shows × button; fires "dismiss" event + hides host
 *   multiline     Boolean — stacks title, message and action vertically (icon top-aligned)
 *   hide-icon     Boolean — hides the icon slot entirely
 *
 * Events (bubbles, composed):
 *   dismiss — fired when dismiss button clicked; detail: { type }
 *   action  — fired when action clicked without action-href; detail: { type }
 *
 * Slots:
 *   icon — overrides the built-in type icon, e.g. <img slot="icon" src="…" alt="">.
 *          When empty, a default type-specific 16×16 icon is shown (error/warning/info/offline).
 *
 * Accessibility: role="alert" (live region); dismiss has aria-label; Escape key does
 * nothing (the banner is page-level, not a modal); focus ring uses currentColor per
 * CLAUDE.md (no silent color substitution).
 *
 * OutSystems: drop loop-system-alert.js into Resources. In a Block, add an HTML element and
 * bind attributes declaratively from Block inputs — booleans are value-aware, so:
 *   dismissible = If(Dismissible, "true", "false")   multiline = If(Multiline, "true", "false")
 * ODC rewrites the attribute when the input changes; observedAttributes re-renders reactively.
 */
class LoopSystemAlert extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'title', 'message', 'action-label', 'action-href', 'dismissible', 'multiline', 'hide-icon'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onClick = this._onClick.bind(this);
  }

  connectedCallback() {
    this._render();
    this.shadowRoot.addEventListener('click', this._onClick);
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this._onClick);
  }

  attributeChangedCallback(n, o, v) {
    if (o === v) return;
    if (this.isConnected) this._render();
  }

  /* OutSystems binds booleans as If(Flag,"true","false") so hasAttribute() alone is
     insufficient — must treat "false" and "0" as falsy. */
  _boolAttr(name) {
    const v = this.getAttribute(name);
    if (v === null) return false;
    return v !== 'false' && v !== '0';
  }

  get _type()        { return this.getAttribute('type') || 'error'; }
  get _title()       { return this.getAttribute('title') || ''; }
  get _message()     { return this.getAttribute('message') || ''; }
  get _actionLabel() { return this.getAttribute('action-label') || ''; }
  get _actionHref()  { return this.getAttribute('action-href') || ''; }
  get _dismissible() { return this._boolAttr('dismissible'); }
  get _multiline()   { return this._boolAttr('multiline'); }
  get _hideIcon()    { return this._boolAttr('hide-icon'); }

  /* Single delegated listener on shadowRoot — survives innerHTML replacements in _render(). */
  _onClick(e) {
    if (e.target.closest('.lsa__dismiss')) {
      this.dispatchEvent(new CustomEvent('dismiss', { bubbles: true, composed: true, detail: { type: this._type } }));
      this.hidden = true;
      return;
    }
    const actionBtn = e.target.closest('.lsa__action');
    if (actionBtn && !this._actionHref) {
      this.dispatchEvent(new CustomEvent('action', { bubbles: true, composed: true, detail: { type: this._type } }));
    }
  }

  // Built-in type icon (Figma renders one per type). 16×16, stroke/fill currentColor so it
  // inherits the per-type icon color. Overridden by a slotted `slot="icon"` element.
  _defaultIcon(type) {
    const svg = (inner) =>
      `<svg class="lsa__icon" viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">${inner}</svg>`;
    switch (type) {
      case 'warning':
        return svg('<path d="M8 2.3 14.4 13.1H1.6L8 2.3Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><line x1="8" y1="6.4" x2="8" y2="9.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="11.3" r="0.8" fill="currentColor"/>');
      case 'informative':
        return svg('<circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="5" r="0.85" fill="currentColor"/><line x1="8" y1="7.2" x2="8" y2="11.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>');
      case 'offline':
        return svg('<path d="M2.6 6.3C5.6 3.6 10.4 3.6 13.4 6.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M4.9 8.7C6.7 7.1 9.3 7.1 11.1 8.7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="11.6" r="1" fill="currentColor"/>');
      case 'error':
      default:
        return svg('<circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><line x1="8" y1="4.5" x2="8" y2="8.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="11" r="0.85" fill="currentColor"/>');
    }
  }

  _render() {
    const t            = this._type;
    const multiline    = this._multiline;
    const title        = this._title;
    const message      = this._message;
    const actionLabel  = this._actionLabel;
    const actionHref   = this._actionHref;
    const dismissible  = this._dismissible;
    const hideIcon     = this._hideIcon;

    const actionHtml = actionLabel
      ? actionHref
        ? `<a class="lsa__action" href="${actionHref}">${actionLabel}</a>`
        : `<button class="lsa__action" type="button">${actionLabel}</button>`
      : '';

    const iconHtml = this._hideIcon
      ? ''
      : `<slot name="icon" class="lsa__icon-slot" part="icon">${this._defaultIcon(t)}</slot>`;

    const titleHtml   = title   ? `<span class="lsa__title">${title}</span>` : '';
    const messageHtml = message ? `<p class="lsa__message">${message}</p>`   : '';

    const dismissHtml = dismissible
      ? `<button class="lsa__dismiss" type="button" aria-label="Dismiss alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>`
      : '';

    const iconSlot = hideIcon ? '' : `<slot name="icon" class="lsa__icon-slot"></slot>`;

    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="lsa lsa--${t}${multiline ? ' lsa--multiline' : ''}" role="alert" part="alert">
        <div class="lsa__content" part="content">
          ${iconSlot}
          <div class="lsa__text" part="text">
            ${titleHtml}
            ${messageHtml}
            ${multiline ? actionHtml : ''}
          </div>
          ${multiline ? '' : actionHtml}
        </div>
        ${dismissHtml}
      </div>`;
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
  min-width: var(--loop-sysalert-min-width, 280px);
}
.lsa--multiline {
  align-items: flex-start;
  min-width: var(--loop-sysalert-min-width-multiline, 230px);
}

.lsa--error       { background-color: var(--loop-sysalert-error-bg, #9d161d); }
.lsa--warning     { background-color: var(--loop-sysalert-warning-bg, #e19d00); }
.lsa--informative { background-color: var(--loop-sysalert-informative-bg, #004370); }
.lsa--offline     { background-color: var(--loop-sysalert-offline-bg, #8a9db1); }

/* single-line: icon + text + action centered as a group; multi-line: left-aligned row */
.lsa__content {
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--loop-sysalert-gap, 8px);
}
.lsa--multiline .lsa__content { align-items: flex-start; justify-content: flex-start; }

/* slot is transparent to flex so its content (default svg or slotted icon) is the flex item */
.lsa__icon-slot { display: contents; }
.lsa__icon { flex-shrink: 0; display: block; width: var(--loop-sysalert-icon-size, 16px); height: var(--loop-sysalert-icon-size, 16px); }
::slotted([slot="icon"]) {
  flex-shrink: 0;
  width: var(--loop-sysalert-icon-size, 16px);
  height: var(--loop-sysalert-icon-size, 16px);
}
.lsa--multiline .lsa__icon,
.lsa--multiline ::slotted([slot="icon"]) { margin-top: 2px; }

/* single-line: title+message inline (shrink, so the group can center) */
.lsa__text {
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: var(--space-tiny, 4px);
  flex-wrap: wrap;
}
.lsa--multiline .lsa__text {
  flex: 1 0 0;
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

/* Per-element colors mirror Figma's distinct title / message / action / icon roles per type. */
.lsa--error       .lsa__icon,
.lsa--error       .lsa__dismiss { color: var(--loop-sysalert-error-icon, rgba(255, 255, 255, 0.75)); }
.lsa--warning     .lsa__icon,
.lsa--warning     .lsa__dismiss { color: var(--loop-sysalert-warning-icon, #473201); }
.lsa--informative .lsa__icon,
.lsa--informative .lsa__dismiss { color: var(--loop-sysalert-informative-icon, rgba(255, 255, 255, 0.75)); }
.lsa--offline     .lsa__icon,
.lsa--offline     .lsa__dismiss { color: var(--loop-sysalert-offline-icon, rgba(255, 255, 255, 0.75)); }

.lsa--error       .lsa__title { color: var(--loop-sysalert-error-title, rgba(255, 255, 255, 0.75)); }
.lsa--warning     .lsa__title { color: var(--loop-sysalert-warning-title, #473201); }
.lsa--informative .lsa__title { color: var(--loop-sysalert-informative-title, rgba(255, 255, 255, 0.75)); }
.lsa--offline     .lsa__title { color: var(--loop-sysalert-offline-title, rgba(255, 255, 255, 0.75)); }

.lsa--error       .lsa__message { color: var(--loop-sysalert-error-message, rgba(255, 255, 255, 0.75)); }
.lsa--warning     .lsa__message { color: var(--loop-sysalert-warning-message, #473201); }
.lsa--informative .lsa__message { color: var(--loop-sysalert-informative-message, #f6fcff); }
.lsa--offline     .lsa__message { color: var(--loop-sysalert-offline-message, rgba(255, 255, 255, 0.9)); }

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
.lsa--multiline .lsa__action { height: var(--loop-sysalert-action-height, 42px); min-height: var(--loop-sysalert-action-height, 42px); margin-top: 0; display: flex; align-items: center; }

.lsa--error       .lsa__action { color: var(--loop-sysalert-error-action, #f5f7f9); }
.lsa--warning     .lsa__action { color: var(--loop-sysalert-warning-action, #473201); }
.lsa--informative .lsa__action { color: var(--loop-sysalert-informative-action, rgba(255, 255, 255, 0.9)); }
.lsa--offline     .lsa__action { color: var(--loop-sysalert-offline-action, rgba(255, 255, 255, 0.9)); }
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
.lsa__dismiss:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; border-radius: 2px; }

@media (prefers-reduced-motion: reduce) {
  .lsa, .lsa__action, .lsa__dismiss { transition: none; }
}`;
  }
}

if (!customElements.get('loop-system-alert')) {
  customElements.define('loop-system-alert', LoopSystemAlert);
}
