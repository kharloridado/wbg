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

  // Built-in type icon (Figma renders one per type). Font Awesome 6 Pro SOLID glyph;
  // currentColor inherits the per-type icon color. Rendered from the unicode codepoint
  // against the document-level
  // @font-face (visible inside shadow DOM, unlike .fa-* classes). Overridden by a slotted
  // `slot="icon"` element.
  _defaultIcon(type) {
    const glyph = {
      warning:     '&#xf071;',  /* fa-triangle-exclamation */
      informative: '&#xf05a;',  /* fa-circle-info */
      offline:     '&#xf1eb;',  /* fa-wifi */
      error:       '&#xf06a;',  /* fa-circle-exclamation */
    }[type] || '&#xf06a;';
    return `<span class="lsa__icon" aria-hidden="true">${glyph}</span>`;
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

    const iconHtml = hideIcon
      ? ''
      : `<slot name="icon" class="lsa__icon-slot" part="icon">${this._defaultIcon(t)}</slot>`;

    const titleHtml   = title   ? `<span class="lsa__title">${title}</span>` : '';
    const messageHtml = message ? `<p class="lsa__message">${message}</p>`   : '';

    const dismissHtml = dismissible
      ? `<button class="lsa__dismiss" type="button" aria-label="Dismiss alert">
          <span class="lsa__dismiss-glyph" aria-hidden="true">&#xf00d;</span>
        </button>`
      : '';

    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="lsa lsa--${t}${multiline ? ' lsa--multiline' : ''}" role="alert" part="alert">
        <div class="lsa__content" part="content">
          ${iconHtml}
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

/* slot is transparent to flex so its content (default glyph or slotted icon) is the flex item */
.lsa__icon-slot { display: contents; }
/* FA 6 Pro solid glyph — 13px em box reproduces the 13px-diameter circles the
   Figma assets draw inside the 16px icon box */
.lsa__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--loop-sysalert-icon-size, 16px);
  height: var(--loop-sysalert-icon-size, 16px);
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-solid, 900);
  font-size: var(--loop-sysalert-icon-glyph, 13px);
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
}
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

/* Per-element colors follow Figma's distinct title / message / action / icon roles per type,
   per-layout faithful (multi-line shades differ by design — FND-048). Warning title is the
   sticker's white-75 (≈1.9:1 on the amber bg — FND-067, flagged not fixed). */
.lsa--error       .lsa__icon,
.lsa--error       .lsa__dismiss { color: var(--loop-sysalert-error-icon, #ffffff); }
.lsa--warning     .lsa__icon,
.lsa--warning     .lsa__dismiss { color: var(--loop-sysalert-warning-icon, #473201); }
.lsa--informative .lsa__icon,
.lsa--informative .lsa__dismiss { color: var(--loop-sysalert-informative-icon, #ffffff); }
.lsa--offline     .lsa__icon,
.lsa--offline     .lsa__dismiss { color: var(--loop-sysalert-offline-icon, #ffffff); }

.lsa--error       .lsa__title { color: var(--loop-sysalert-error-title, rgba(255, 255, 255, 0.75)); }
.lsa--warning     .lsa__title { color: var(--loop-sysalert-warning-title, rgba(255, 255, 255, 0.75)); }
.lsa--informative .lsa__title { color: var(--loop-sysalert-informative-title, rgba(255, 255, 255, 0.75)); }
.lsa--offline     .lsa__title { color: var(--loop-sysalert-offline-title, rgba(255, 255, 255, 0.75)); }

.lsa--error       .lsa__message { color: var(--loop-sysalert-error-message, rgba(255, 255, 255, 0.75)); }
.lsa--warning     .lsa__message { color: var(--loop-sysalert-warning-message, #473201); }
.lsa--informative .lsa__message { color: var(--loop-sysalert-informative-message, #f6fcff); }
.lsa--offline     .lsa__message { color: var(--loop-sysalert-offline-message, rgba(255, 255, 255, 0.9)); }

.lsa--multiline.lsa--error   .lsa__message { color: var(--loop-sysalert-error-message-multi, rgba(255, 255, 255, 0.9)); }
.lsa--multiline.lsa--offline .lsa__message { color: var(--loop-sysalert-offline-message-multi, rgba(255, 255, 255, 0.75)); }

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
.lsa--multiline.lsa--error       .lsa__action { color: var(--loop-sysalert-error-action-multi, rgba(255, 255, 255, 0.9)); }
.lsa--multiline.lsa--informative .lsa__action { color: var(--loop-sysalert-informative-action-multi, #ffffff); }
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
/* FA xmark (solid) — 14px em box renders the ~10px × the Figma 16px dismiss box draws */
.lsa__dismiss-glyph {
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-solid, 900);
  font-size: var(--loop-sysalert-dismiss-glyph, 14px);
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
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
