/**
 * <loop-alert> — Contextual inline alert (light, left-accent-border callout).
 *
 * Figma: "Alerts" [node:17868-3944]. Custom Web Component — no native OS widget.
 * Renders a tinted alert with a 4px LEFT accent border (plus 1px top/right/bottom in the
 * same accent color), a type icon, optional title, message, action link/button, and a
 * dismiss (×) button. Four semantic types; single-line and multi-line layouts.
 *
 * Colors (per the 2026-07-02 Figma update): title/message/icon are STATE-COLORED per type
 * (--loop-alert-<type>-title/-message/-icon), not a shared dark text; the warning message
 * intentionally differs by layout (single-line #896001 vs multi-line #473201 — FND-062,
 * faithful per-layout); the dismiss × is neutral-60 (--loop-alert-dismiss); the action is
 * the primary link color for every type/layout. Icons are FILLED glyphs (solid shape in the
 * per-type icon color with white knockout marks), matching the updated Figma assets.
 *
 * NOT to be confused with <loop-system-alert> (the dark, full-width status banner with an
 * "offline" type). This is the light, in-page contextual alert that lives in the Notes/Alerts
 * family. The two components coexist.
 *
 * Layout (per Figma):
 *   single-line — icon + title + message + action in one centered row (message ellipsizes);
 *                 dismiss × pinned far right. ~40px tall.
 *   multi-line  — icon top-left; title / message / action stacked left-aligned in a column;
 *                 dismiss × top-right.
 *
 * Type classes: the rendered root carries OutSystems UI's native alert type vocabulary —
 * `<div class="loop-alert alert alert-<type>">` where <type> is OSUI's modifier suffix
 * (error / warning / info / success; "information" maps to `alert-info`). The component
 * speaks the same type classes as the stock OSUI Alert (vendor _alert.scss) rather than a
 * parallel `loop-alert--<type>` set; `loop-alert` + `loop-alert__*` remain the structural hooks.
 *
 * Attributes:
 *   type          "error" | "warning" | "information" | "success"  (default: "error")
 *   title         Optional bold title text (14px Bold)
 *   message       Alert body text (14px Regular)
 *   action-label  Optional action link/button label (14px Bold)
 *   action-href   If present, renders action as <a href>; otherwise fires "action" event
 *   dismissible   Boolean — shows × button; fires "dismiss" event + hides host.
 *                 Value-aware: absent or "false"/"0" → off; any other value → on.
 *   multiline     Boolean — stacks title, message and action vertically (icon top-aligned).
 *                 Value-aware: absent or "false"/"0" → off; any other value → on.
 *   hide-icon     Boolean — suppress the built-in type icon (Figma "leftIcon = false").
 *                 Value-aware: absent or "false"/"0" → off; any other value → on.
 *
 * Events (bubbles, composed):
 *   dismiss — fired when dismiss button clicked; detail: { type }
 *   action  — fired when action clicked without action-href; detail: { type }
 *
 * Slots:
 *   icon — overrides the built-in type icon, e.g. <img slot="icon" src="…" alt="">.
 *          When empty, a default type-specific 16×16 icon is shown (error/warning/information/success).
 *
 * Accessibility: role="alert" (live region); dismiss has aria-label; focus rings use
 * currentColor per CLAUDE.md (no silent color substitution).
 *
 * OutSystems: drop loop-alert.js into Resources. In a Block, add an HTML element and bind
 * attributes declaratively from Block inputs — booleans are value-aware, so:
 *   dismissible = If(Dismissible, "true", "false")   multiline = If(Multiline, "true", "false")
 * ODC rewrites the attribute when the input changes; observedAttributes re-renders reactively.
 */
class LoopAlert extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'title', 'message', 'action-label', 'action-href', 'dismissible', 'multiline', 'hide-icon'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onDismiss = this._onDismiss.bind(this);
    this._onAction  = this._onAction.bind(this);
  }

  connectedCallback()  { this._render(); }
  disconnectedCallback() {
    this._dismissBtn?.removeEventListener('click', this._onDismiss);
    this._actionBtn?.removeEventListener('click', this._onAction);
  }
  attributeChangedCallback(n, o, v) { if (o !== v) this._render(); }

  get _type()        { return this.getAttribute('type') || 'error'; }
  // Normalize whatever's bound to `type` to ONE canonical semantic type used for both the
  // icon and the OSUI class. Tolerant on purpose: trims/lowercases, accepts the `info` alias,
  // AND strips a leading `alert-` so binding the OSUI class form (`alert-info`, `alert-success`)
  // resolves too — otherwise an unrecognized value silently fell back to `error` (the reported
  // ODC bug: passing `alert-info` always rendered as error).
  get _semanticType() {
    const raw = this._type.trim().toLowerCase().replace(/^alert-/, '');
    return { error: 'error', warning: 'warning', information: 'information', info: 'information', success: 'success' }[raw] || 'error';
  }
  // Map the semantic type onto OutSystems UI's NATIVE alert modifier suffix so the host adopts
  // the stock `.alert` / `.alert-<type>` class vocabulary (vendor _alert.scss). Only `information`
  // differs (OSUI uses `info`); the rest are 1:1.
  get _osuiType()    { return this._semanticType === 'information' ? 'info' : this._semanticType; }
  get _title()       { return this.getAttribute('title') || ''; }
  get _message()     { return this.getAttribute('message') || ''; }
  get _actionLabel() { return this.getAttribute('action-label') || ''; }
  get _actionHref()  { return this.getAttribute('action-href') || ''; }
  get _dismissible() { return this._boolAttr('dismissible'); }
  get _multiline()   { return this._boolAttr('multiline'); }
  get _hideIcon()    { return this._boolAttr('hide-icon'); }

  // Value-aware boolean: absent or "false"/"0" → off; present with any other value → on.
  // Lets OutSystems drive it declaratively via If(Flag, "true", "false") (ODC always emits
  // a value), while bare `<loop-alert dismissible>` (value "") still reads as on.
  _boolAttr(name) {
    const v = this.getAttribute(name);
    if (v === null) return false;
    return v !== 'false' && v !== '0';
  }

  _onDismiss() {
    this.dispatchEvent(new CustomEvent('dismiss', { bubbles: true, composed: true, detail: { type: this._type } }));
    this.hidden = true;
  }

  _onAction() {
    this.dispatchEvent(new CustomEvent('action', { bubbles: true, composed: true, detail: { type: this._type } }));
  }

  // Built-in type icon (Figma renders one per type). 16×16 FILLED glyphs — solid shape in
  // currentColor (driven by the per-type --loop-alert-<type>-icon token) with white knockout
  // marks, modeled on the Figma 17868-3944 assets. Overridden by a slotted `slot="icon"` element.
  _defaultIcon(type) {
    const svg = (inner) =>
      `<svg class="loop-alert__icon" viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">${inner}</svg>`;
    switch (type) {
      case 'warning':
        return svg('<path d="M8 1c.44 0 .85.23 1.08.62l6.75 11.5c.23.39.23.86.01 1.25-.22.39-.64.63-1.09.63H1.25c-.45 0-.86-.24-1.08-.63-.22-.39-.22-.86.01-1.25L6.92 1.62C7.15 1.23 7.56 1 8 1Z" fill="currentColor"/><line x1="8" y1="5.75" x2="8" y2="9.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="12" r="1" fill="white"/>');
      case 'information':
        return svg('<circle cx="8" cy="8" r="8" fill="currentColor"/><circle cx="8" cy="4.5" r="1" fill="white"/><line x1="8" y1="7.2" x2="8" y2="11.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>');
      case 'success':
        return svg('<circle cx="8" cy="8" r="8" fill="currentColor"/><path d="M4.7 8.4 7 10.7 11.3 5.9" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>');
      case 'error':
      default:
        return svg('<circle cx="8" cy="8" r="8" fill="currentColor"/><line x1="8" y1="4.5" x2="8" y2="9" stroke="white" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="11.5" r="1" fill="white"/>');
    }
  }

  _render() {
    const t            = this._semanticType;
    const multiline    = this._multiline;
    const title        = this._title;
    const message      = this._message;
    const actionLabel  = this._actionLabel;
    const actionHref   = this._actionHref;
    const dismissible  = this._dismissible;

    const actionHtml = actionLabel
      ? actionHref
        ? `<a class="loop-alert__action" href="${actionHref}">${actionLabel}</a>`
        : `<button class="loop-alert__action" type="button">${actionLabel}</button>`
      : '';

    const iconHtml = this._hideIcon
      ? ''
      : `<slot name="icon" class="loop-alert__icon-slot" part="icon">${this._defaultIcon(t)}</slot>`;

    const titleHtml   = title   ? `<span class="loop-alert__title">${title}</span>` : '';
    const messageHtml = message ? `<p class="loop-alert__message">${message}</p>`   : '';

    const dismissHtml = dismissible
      ? `<button class="loop-alert__dismiss" type="button" aria-label="Dismiss alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>`
      : '';

    // single-line: __text is display:contents, so title + message become flex items of
    // __content directly (message flex:1 ellipsizes); action is a content-level sibling.
    // multi-line:  __text is a real column holding title / message / action.
    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="loop-alert alert alert-${this._osuiType}${multiline ? ' loop-alert--multiline' : ''}" role="alert" part="alert">
        <div class="loop-alert__content" part="content">
          ${iconHtml}
          <div class="loop-alert__text" part="text">
            ${titleHtml}
            ${messageHtml}
            ${multiline ? actionHtml : ''}
          </div>
          ${multiline ? '' : actionHtml}
        </div>
        ${dismissHtml}
      </div>`;

    this._dismissBtn = dismissible ? this.shadowRoot.querySelector('.loop-alert__dismiss') : null;
    this._actionBtn  = (actionLabel && !actionHref) ? this.shadowRoot.querySelector('.loop-alert__action') : null;
    this._dismissBtn?.addEventListener('click', this._onDismiss);
    this._actionBtn?.addEventListener('click', this._onAction);
  }

  _css() {
    return `
:host { display: block; width: 100%; }
:host([hidden]) { display: none; }

.loop-alert {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--loop-alert-gap, 16px);
  min-width: var(--loop-alert-min-width, 230px);
  min-height: var(--loop-alert-min-height, 40px);
  padding: 0 var(--loop-alert-padding-h, 16px);
  border: var(--loop-alert-hairline-width, 1px) solid;
  border-left-width: var(--loop-alert-accent-width, 4px);
  border-radius: var(--loop-alert-corner-radius, 4px);
}
.loop-alert--multiline {
  align-items: flex-start;
  gap: var(--loop-alert-gap-multi, 8px);
  min-height: 0;
  padding: var(--loop-alert-padding-v-multi, 8px) var(--loop-alert-padding-h-multi, 12px);
}

/* Per-type background (low) + accent border (all sides; left is thicker via border-left-width).
 * Keyed on OutSystems UI's native alert type modifiers (.alert-error/-warning/-info/-success)
 * so the component speaks the same type vocabulary as the stock OSUI Alert. */
.alert-error   { background-color: var(--loop-alert-error-bg, #fdf2f2);       border-color: var(--loop-alert-error-accent, #9d161d); }
.alert-warning { background-color: var(--loop-alert-warning-bg, #fef3d7);     border-color: var(--loop-alert-warning-accent, #896001); }
.alert-info    { background-color: var(--loop-alert-information-bg, #f6fcff); border-color: var(--loop-alert-information-accent, #00538a); }
.alert-success { background-color: var(--loop-alert-success-bg, #f6fef0);     border-color: var(--loop-alert-success-accent, #388004); }

.loop-alert__content {
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--loop-alert-gap, 16px);
}
.loop-alert--multiline .loop-alert__content { align-items: flex-start; gap: var(--loop-alert-gap-multi, 8px); }

/* slot is transparent to flex so its content (default svg or slotted icon) is the flex item */
.loop-alert__icon-slot { display: contents; }
.loop-alert__icon { flex-shrink: 0; display: block; width: var(--loop-alert-icon-size, 16px); height: var(--loop-alert-icon-size, 16px); }
::slotted([slot="icon"]) {
  flex-shrink: 0;
  width: var(--loop-alert-icon-size, 16px);
  height: var(--loop-alert-icon-size, 16px);
}
.loop-alert--multiline .loop-alert__icon,
.loop-alert--multiline ::slotted([slot="icon"]) { margin-top: 2px; }

/* icon color = per-type icon role — decoupled from the border accent (warning icon is
 * yellow-50 on a yellow-base border; info icon is blue-70 on a blue-60 border) */
.alert-error   .loop-alert__icon { color: var(--loop-alert-error-icon, #9d161d); }
.alert-warning .loop-alert__icon { color: var(--loop-alert-warning-icon, #e19d00); }
.alert-info    .loop-alert__icon { color: var(--loop-alert-information-icon, #004370); }
.alert-success .loop-alert__icon { color: var(--loop-alert-success-icon, #388004); }

/* title (emphasis) + message = per-type state text roles */
.alert-error   .loop-alert__title { color: var(--loop-alert-error-title, #861319); }
.alert-warning .loop-alert__title { color: var(--loop-alert-warning-title, #473201); }
.alert-info    .loop-alert__title { color: var(--loop-alert-information-title, #004370); }
.alert-success .loop-alert__title { color: var(--loop-alert-success-title, #234f03); }

.alert-error   .loop-alert__message { color: var(--loop-alert-error-message, #9d161d); }
.alert-warning .loop-alert__message { color: var(--loop-alert-warning-message, #896001); }
.alert-info    .loop-alert__message { color: var(--loop-alert-information-message, #00538a); }
.alert-success .loop-alert__message { color: var(--loop-alert-success-message, #388004); }
/* Figma splits the warning message shade by layout (single #896001 / multi #473201) — FND-062 */
.alert-warning.loop-alert--multiline .loop-alert__message { color: var(--loop-alert-warning-message-multi, #473201); }

/* single-line: promote title + message into the content flex row; multi-line: real column */
.loop-alert__text { display: contents; }
.loop-alert--multiline .loop-alert__text {
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.loop-alert__title {
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:   var(--loop-alert-title-size, 14px);
  font-weight: var(--font-weight-bold, 700);
  line-height: 1.25;
  white-space: nowrap;
  flex-shrink: 0;
}
.loop-alert__message {
  margin: 0;
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:   var(--loop-alert-body-size, 14px);
  font-weight: var(--font-weight-regular, 400);
  line-height: 1.5;
}
/* single-line: message takes remaining space and ellipsizes; multi-line: full-width, wraps */
.loop-alert:not(.loop-alert--multiline) .loop-alert__message {
  flex: 1 0 0;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.loop-alert--multiline .loop-alert__message { width: 100%; }

.loop-alert__action {
  font-family:     var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:       var(--loop-alert-body-size, 14px);
  font-weight:     var(--font-weight-bold, 700);
  line-height:     1.5;
  color:           var(--loop-alert-action, #004370);
  text-decoration: none;
  background:      none;
  border:          0;
  padding:         0;
  cursor:          pointer;
  white-space:     nowrap;
  flex-shrink:     0;
}
.loop-alert__action:hover { text-decoration: underline; }
.loop-alert--multiline .loop-alert__action { margin-top: var(--loop-alert-action-pt, 12px); align-self: flex-start; }
.loop-alert__action:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; border-radius: 2px; }

.loop-alert__dismiss {
  flex-shrink: 0;
  display:     flex;
  align-items: center;
  justify-content: center;
  width:       var(--loop-alert-icon-size, 16px);
  height:      var(--loop-alert-icon-size, 16px);
  background:  none;
  border:      0;
  padding:     0;
  cursor:      pointer;
  color:       var(--loop-alert-dismiss, #4b5e71);
}
.loop-alert--multiline .loop-alert__dismiss { align-self: flex-start; margin-top: 2px; }
.loop-alert__dismiss:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; border-radius: 2px; }

@media (prefers-reduced-motion: reduce) {
  .loop-alert__action, .loop-alert__dismiss { transition: none; }
}`;
  }
}

if (!customElements.get('loop-alert')) {
  customElements.define('loop-alert', LoopAlert);
}
