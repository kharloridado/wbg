/**
 * <loop-toast> — Transient toast notification that pops up at a configurable screen position.
 *
 * Figma: "Toast" [node:17874-6524 / component set 17874-6271]. Custom Web Component —
 * no native OS widget. A small elevated card that slides into one of 6 viewport anchors
 * (bottom-centre by default), stays for a configurable duration, then slides back out
 * (cf. the native Feedback Message slide animation). Bottom anchors slide UP/DOWN; top
 * anchors slide DOWN/UP. Five semantic types; two layouts (with / without a title);
 * optional action (text/link) button; optional dismiss (×). Per the Figma responsive
 * variants, the card narrows and the type/icon/padding step down on tablet and phone;
 * uses OutSystems' .tablet/.phone body classes via :host-context() — matches OutSystems UI breakpoints exactly.
 *
 * Triggered from OutSystems by a JS call in a Client Action — each toast is addressable
 * by id, so a "Run JavaScript" node fires the one it wants:
 *   window.LoopToast.show('prefsToast');
 *   window.LoopToast.show('prefsToast', { type: 'error', title: 'Oops', message: '…' });
 *   window.LoopToast.hide('prefsToast');
 *
 * Layout (per Figma):
 *   w/o title — icon + message (+ action) ; min width 400.
 *   w title   — icon + 20px title + message (+ action) ; min width 450.
 *   Dismiss × sits at the right behind a 1px left divider, full card height.
 *
 * Attributes:
 *   type          "default" | "success" | "warning" | "error" | "information"  (default: "default")
 *   position      "bottom" (default) | "top" | "bottom-left" | "bottom-right" | "top-left" | "top-right".
 *                 Where the toast anchors on screen. "bottom"/"top" are horizontally centred;
 *                 the four corners pin to the side gutter. Each anchor stacks independently.
 *   title         Optional title text (20px). Its presence switches to the "with title" layout.
 *   message       Body text (14px / line-height 21px).
 *   button-label  Optional action button label (bold, underlined). Omit for no button.
 *   button-href   If set, the action renders as <a href>; otherwise it fires the "action" event.
 *   dismissible   Boolean — shows the × button. Value-aware; DEFAULT ON (absent → on; "false"/"0" → off).
 *   no-action     Boolean — hides the action button even when button-label is set. Value-aware; default OFF.
 *   duration      Auto-dismiss delay in ms. Absent/empty → 5000. "0" → no auto-dismiss (stays until × / action).
 *   open          Presence reflects visibility. Set/removed by show()/hide(); not usually bound directly.
 *
 * Public methods (callable from OutSystems / JS):
 *   show()         slide in (restarts the auto-dismiss timer)
 *   hide()         slide out
 *   toggle(force)  show/hide (optional boolean force)
 *
 * Events (bubbles, composed) — detail: { id, type }:
 *   show    — fired when the toast starts showing
 *   hide    — fired when the toast has finished hiding
 *   action  — fired when the action is clicked without a button-href
 *   dismiss — fired when the × is clicked (the toast then hides)
 *
 * Slots:
 *   icon — overrides the built-in per-type icon (e.g. <img slot="icon" src="…" alt="">).
 *
 * Accessibility: role/aria-live track urgency — error/warning use role="alert" + assertive,
 * the rest role="status" + polite. The auto-dismiss timer PAUSES on hover/focus so it never
 * strands keyboard/AT users. × has aria-label; focus rings use currentColor (no colour
 * substitution), per CLAUDE.md. prefers-reduced-motion → fade only, no slide.
 *
 * NOTE: the built-in icons APPROXIMATE the Figma glyphs (filled FontAwesome-style circles);
 * slot an exact asset via slot="icon" if design supplies one (mirrors loop-system-alert).
 */
class LoopToast extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'position', 'title', 'message', 'button-label', 'button-href', 'dismissible', 'no-action'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onAction  = this._onAction.bind(this);
    this._onDismiss = this._onDismiss.bind(this);
    this._onEnter   = this._onEnter.bind(this);
    this._onLeave   = this._onLeave.bind(this);
    this._timer = 0;
  }

  connectedCallback() {
    this._render();
    this.addEventListener('mouseenter', this._onEnter);
    this.addEventListener('mouseleave', this._onLeave);
    this.addEventListener('focusin',  this._onEnter);
    this.addEventListener('focusout', this._onLeave);
    if (this._open) this._arm();      // already open at connect (e.g. re-attach)
  }

  disconnectedCallback() {
    clearTimeout(this._timer);
    this.removeEventListener('mouseenter', this._onEnter);
    this.removeEventListener('mouseleave', this._onLeave);
    this.removeEventListener('focusin',  this._onEnter);
    this.removeEventListener('focusout', this._onLeave);
    this._actionBtn?.removeEventListener('click', this._onAction);
    this._dismissBtn?.removeEventListener('click', this._onDismiss);
    LoopToast._unstack(this);
  }

  attributeChangedCallback(n, o, v) {
    if (o === v || !this.isConnected) return;
    // position is read live from the host attribute by the Shadow-DOM CSS, so it needs
    // no re-render — but an open toast must re-stack into its new anchor group.
    if (n === 'position') { if (this._open) LoopToast._restack(); return; }
    this._render();
  }

  /* ---- attribute getters ---- */
  get _type()        { const t = this.getAttribute('type'); return LoopToast.TYPES.includes(t) ? t : 'default'; }
  get _position()    { const p = (this.getAttribute('position') || '').toLowerCase(); return LoopToast.POSITIONS.includes(p) ? p : 'bottom'; }
  get _title()       { return this.getAttribute('title') || ''; }
  get _message()     { return this.getAttribute('message') || ''; }
  get _buttonLabel() { return this.getAttribute('button-label') || ''; }
  get _buttonHref()  { return this.getAttribute('button-href') || ''; }
  get _open()        { return this.hasAttribute('open'); }
  get _dismissible() {
    const v = this.getAttribute('dismissible');
    if (v === null) return true;                 // default ON
    return v !== 'false' && v !== '0';           // value-aware (ODC emits a value)
  }
  get _noAction() {
    const v = this.getAttribute('no-action');
    if (v === null) return false;
    return v !== 'false' && v !== '0';           // value-aware (ODC emits a value)
  }
  get _duration() {
    const v = this.getAttribute('duration');
    if (v === null || v === '') return 5000;     // default 5s
    const n = parseInt(v, 10);
    return isNaN(n) ? 5000 : n;                   // 0 → no auto-dismiss
  }

  /* ---- public API ---- */
  show() {
    if (this._open) { this._arm(); return; }      // restart timer if re-shown
    this.removeAttribute('closing');
    this.setAttribute('open', '');
    LoopToast._stack(this);
    this._emit('show');
    // double-rAF so the [open] transition runs from the off-screen base state
    requestAnimationFrame(() => requestAnimationFrame(() => this._arm()));
  }
  hide() {
    if (!this._open) return;
    clearTimeout(this._timer);
    this.setAttribute('closing', '');
    const card = this.shadowRoot.querySelector('.lt');
    let done = false;
    const finish = () => {
      if (done) return; done = true;
      card?.removeEventListener('transitionend', onEnd);
      this.removeAttribute('open');
      this.removeAttribute('closing');
      LoopToast._unstack(this);
      this._emit('hide');
    };
    const onEnd = (e) => { if (e.target === card && e.propertyName === 'transform') finish(); };
    card?.addEventListener('transitionend', onEnd);
    setTimeout(finish, 600);                       // fallback if transitionend never fires
  }
  toggle(force) {
    const next = (force === undefined) ? !this._open : !!force;
    next ? this.show() : this.hide();
  }

  /* ---- auto-dismiss timer (pauses on hover/focus) ---- */
  _arm() {
    clearTimeout(this._timer);
    const d = this._duration;
    if (d > 0 && this._open && !this.hasAttribute('closing')) this._timer = setTimeout(() => this.hide(), d);
  }
  _onEnter() { clearTimeout(this._timer); }
  _onLeave() { this._arm(); }

  _emit(name) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail: { id: this.id || null, type: this._type } }));
  }
  _onAction()  { this._emit('action'); }
  _onDismiss() { this._emit('dismiss'); this.hide(); }

  /* ---- stacking: keep open toasts from overlapping, newest nearest the edge.
     Each of the 6 anchors stacks independently (its own column out from the edge). ---- */
  static get _open()    { return LoopToast.__open || (LoopToast.__open = []); }
  static _stack(el)     { const a = LoopToast._open; if (!a.includes(el)) a.push(el); LoopToast._restack(); }
  static _unstack(el)   { const a = LoopToast._open; const i = a.indexOf(el); if (i !== -1) a.splice(i, 1); LoopToast._restack(); }
  static _restack() {
    const base = 24;                               // base edge gap (matches --loop-toast-edge-block default)
    const gap = 12;
    const offset = {};                             // per-position running offset from the anchored edge
    for (const el of LoopToast._open) {
      const pos = el._position;
      const off = offset[pos] === undefined ? base : offset[pos];
      el.style.setProperty('--loop-toast-offset', off + 'px');
      offset[pos] = off + (el.offsetHeight || 72) + gap;
    }
  }

  /* Built-in per-type icon. 24×24, currentColor so it inherits the per-type icon colour. */
  _defaultIcon(type) {
    const svg = (inner) =>
      `<svg class="lt__icon" viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">${inner}</svg>`;
    switch (type) {
      case 'success':
        return svg('<circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.8"/><path d="M7.8 12.3 10.6 15 16.4 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>');
      case 'warning':
        return svg('<path d="M12 3.2 21.6 19.8H2.4L12 3.2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><line x1="12" y1="9.6" x2="12" y2="14.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16.9" r="1.15" fill="currentColor"/>');
      case 'error':
        return svg('<circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.8"/><line x1="12" y1="6.8" x2="12" y2="12.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16.5" r="1.15" fill="currentColor"/>');
      case 'information':
      case 'default':
      default:
        return svg('<circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="7.6" r="1.15" fill="currentColor"/><line x1="12" y1="10.8" x2="12" y2="17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>');
    }
  }

  _render() {
    const t           = this._type;
    const title       = this._title;
    const message     = this._message;
    const buttonLabel = this._buttonLabel;
    const buttonHref  = this._buttonHref;
    const dismissible = this._dismissible;
    const titled      = !!title;
    const urgent      = (t === 'error' || t === 'warning');

    const showAction = !!buttonLabel && !this._noAction;
    const actionHtml = showAction
      ? buttonHref
        ? `<a class="lt__action" href="${buttonHref}">${buttonLabel}</a>`
        : `<button class="lt__action" type="button">${buttonLabel}</button>`
      : '';

    const titleHtml   = titled  ? `<p class="lt__title">${title}</p>`     : '';
    const messageHtml = message ? `<p class="lt__message">${message}</p>` : '';

    const dismissHtml = dismissible
      ? `<div class="lt__dismiss-wrap" part="dismiss-wrap">
          <button class="lt__dismiss" type="button" aria-label="Dismiss">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </button>
        </div>`
      : '';

    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="lt lt--${t}${titled ? ' lt--titled' : ''}"
           role="${urgent ? 'alert' : 'status'}" aria-live="${urgent ? 'assertive' : 'polite'}" part="toast">
        <div class="lt__content" part="content">
          <span class="lt__icon-slot" part="icon"><slot name="icon">${this._defaultIcon(t)}</slot></span>
          <div class="lt__text" part="text">
            ${titleHtml}
            ${messageHtml}
            ${actionHtml}
          </div>
        </div>
        ${dismissHtml}
      </div>`;

    this._actionBtn  = (showAction && !buttonHref) ? this.shadowRoot.querySelector('.lt__action') : null;
    this._dismissBtn = dismissible ? this.shadowRoot.querySelector('.lt__dismiss') : null;
    this._actionBtn?.addEventListener('click', this._onAction);
    this._dismissBtn?.addEventListener('click', this._onDismiss);
  }

  _css() {
    return `
/* Positioning — the toast anchors to one of 6 spots via [position]:
 *   bottom (default) · top · bottom-left · bottom-right · top-left · top-right.
 * --loop-toast-offset = gap from the anchored top/bottom edge; the stacking logic
 * overrides it per-toast so multiple toasts at the same anchor never overlap.
 * --loop-toast-tx = horizontal translate: -50% for the centred anchors, 0 for corners.
 * Closed state slides the card off toward its nearest edge; open slides it to rest. */
:host {
  position: fixed;
  z-index: var(--loop-toast-z, 9000);
  width: max-content;
  max-width: calc(100vw - 2 * var(--loop-toast-edge-gap, 16px));
  opacity: 0;
  visibility: hidden;
  --loop-toast-offset: var(--loop-toast-edge-block, 24px);
  --loop-toast-tx: -50%;
  transition: transform .28s cubic-bezier(.2, .7, .3, 1), opacity .28s ease;
  transform: translate(var(--loop-toast-tx), calc(100% + var(--loop-toast-offset)));
}

/* horizontal anchor */
:host,
:host([position="bottom"]),
:host([position="top"])          { left: 50%; right: auto; }
:host([position="top-left"]),
:host([position="bottom-left"])  { left: var(--loop-toast-edge-gap, 16px); right: auto; --loop-toast-tx: 0; }
:host([position="top-right"]),
:host([position="bottom-right"]) { right: var(--loop-toast-edge-gap, 16px); left: auto; --loop-toast-tx: 0; }

/* vertical anchor (default = bottom) */
:host,
:host([position="bottom"]),
:host([position="bottom-left"]),
:host([position="bottom-right"]) { bottom: var(--loop-toast-offset); top: auto; }
:host([position="top"]),
:host([position="top-left"]),
:host([position="top-right"])    { top: var(--loop-toast-offset); bottom: auto; }

/* closed (off-screen) transform — top anchors slide up & out, bottom anchors slide down & out */
:host([position="top"]),
:host([position="top-left"]),
:host([position="top-right"]) {
  transform: translate(var(--loop-toast-tx), calc(-100% - var(--loop-toast-offset)));
}

:host([open]) { visibility: visible; }
:host([open]:not([closing])) { opacity: 1; transform: translate(var(--loop-toast-tx), 0); }

.lt {
  display: flex;
  align-items: center;
  gap: var(--loop-toast-gap, 8px);
  box-sizing: border-box;
  min-width: var(--loop-toast-min-width, 400px);
  max-width: var(--loop-toast-max-width, 550px);
  padding: var(--loop-toast-padding-v, 16px) var(--loop-toast-padding-h, 24px);
  border-radius: var(--loop-toast-radius, 8px);
  box-shadow: var(--loop-toast-shadow, 0 2px 8px 0 rgba(33, 38, 45, 0.16));
}
.lt--titled { min-width: var(--loop-toast-min-width-titled, 450px); }

.lt--default     { background-color: var(--loop-toast-default-bg, #252e37); }
.lt--success     { background-color: var(--loop-toast-success-bg, #388004); }
.lt--warning     { background-color: var(--loop-toast-warning-bg, #e19d00); }
.lt--error       { background-color: var(--loop-toast-error-bg, #9d161d); }
.lt--information { background-color: var(--loop-toast-information-bg, #004370); }

/* icon + text row — icon top-aligned (Figma: items-start, icon pt 4px) */
.lt__content {
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: var(--loop-toast-content-gap, 12px);
}
.lt__icon-slot { flex-shrink: 0; display: flex; padding-top: var(--loop-toast-icon-pt, 4px); }
.lt__icon { display: block; width: var(--loop-toast-icon-size, 24px); height: var(--loop-toast-icon-size, 24px); }
::slotted([slot="icon"]) { flex-shrink: 0; width: var(--loop-toast-icon-size, 24px); height: var(--loop-toast-icon-size, 24px); }

.lt__text {
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--loop-toast-text-gap, 4px);
}

.lt__title {
  margin: 0;
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:   var(--loop-toast-title-size, 20px);
  font-weight: var(--font-weight-regular, 400);
  line-height: 1.25;
  letter-spacing: var(--loop-toast-title-tracking, -0.25px);
}
.lt__message {
  margin: 0;
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:   var(--loop-toast-body-size, 14px);
  font-weight: var(--font-weight-regular, 400);
  line-height: var(--loop-toast-body-line-height, 21px);
}

/* Per-type text / icon / action / divider colours mirror Figma's roles per type. */
.lt--default     .lt__title, .lt--default     .lt__message { color: var(--loop-toast-default-text, #ffffffe5); }
.lt--success     .lt__title, .lt--success     .lt__message { color: var(--loop-toast-success-text, #ffffffe5); }
.lt--error       .lt__title, .lt--error       .lt__message { color: var(--loop-toast-error-text, #ffffffe5); }
.lt--information .lt__title, .lt--information .lt__message { color: var(--loop-toast-information-text, #ffffffe5); }
.lt--warning     .lt__message { color: var(--loop-toast-warning-text, #473201); }
.lt--warning     .lt__title   { color: var(--loop-toast-warning-title, #612705); }

.lt--default     .lt__icon { color: var(--loop-toast-default-icon, #ffffff); }
.lt--success     .lt__icon { color: var(--loop-toast-success-icon, #ffffff); }
.lt--error       .lt__icon { color: var(--loop-toast-error-icon, #ffffff); }
.lt--information .lt__icon { color: var(--loop-toast-information-icon, #ffffff); }
.lt--warning     .lt__icon { color: var(--loop-toast-warning-icon, #473201); }

.lt__action {
  align-self: flex-start;
  margin: 0;
  padding: var(--space-xtiny, 2px);
  font-family:     var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:       var(--loop-toast-action-size, 14px);
  font-weight:     var(--font-weight-bold, 700);
  line-height:     1.25;
  letter-spacing:  var(--letter-spacing-button, -0.5px);
  text-decoration: underline;
  text-decoration-thickness: 2px;
  background:      none;
  border:          0;
  cursor:          pointer;
  white-space:     nowrap;
}
.lt--default     .lt__action,
.lt--success     .lt__action,
.lt--error       .lt__action,
.lt--information .lt__action { color: var(--loop-toast-action-on-dark, #ffffffe5); text-decoration-color: var(--loop-toast-action-underline-on-dark, #ffffff99); }
.lt--warning     .lt__action { color: var(--loop-toast-action-on-light, #004370); text-decoration-color: var(--loop-toast-action-underline-on-light, #0043708c); }
.lt__action:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; border-radius: 2px; }

/* dismiss × — full-height column behind a 1px left divider (Figma) */
.lt__dismiss-wrap {
  align-self: stretch;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: var(--loop-toast-dismiss-pad-v, 8px) 0 var(--loop-toast-dismiss-pad-v, 8px) var(--loop-toast-dismiss-pad-l, 16px);
  border-left: 1px solid currentColor;
}
.lt--default     .lt__dismiss-wrap { color: var(--loop-toast-default-divider, #586e84); }
.lt--success     .lt__dismiss-wrap,
.lt--error       .lt__dismiss-wrap,
.lt--information .lt__dismiss-wrap { color: var(--loop-toast-divider-on-dark, #8a9db1); }
.lt--warning     .lt__dismiss-wrap { color: var(--loop-toast-warning-divider, #896001); }

.lt__dismiss {
  display: flex;
  align-items: center;
  justify-content: center;
  width:  var(--loop-toast-icon-size, 24px);
  height: var(--loop-toast-icon-size, 24px);
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}
.lt--default     .lt__dismiss { color: var(--loop-toast-default-icon, #ffffff); }
.lt--success     .lt__dismiss { color: var(--loop-toast-success-icon, #ffffff); }
.lt--error       .lt__dismiss { color: var(--loop-toast-error-icon, #ffffff); }
.lt--information .lt__dismiss { color: var(--loop-toast-information-icon, #ffffff); }
.lt--warning     .lt__dismiss { color: var(--loop-toast-warning-icon, #473201); }
.lt__dismiss:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; border-radius: 2px; }

/* Responsive — OutSystems sets .tablet / .phone on the body (≤1024 px / ≤700 px).
 * :host-context() reads those classes across the shadow boundary so these rules
 * fire on the same breakpoints as the rest of the OS UI. */
:host-context(.tablet) .lt,
:host-context(.phone) .lt          { max-width: var(--loop-toast-max-width-tablet, 450px); }
:host-context(.tablet) .lt--titled,
:host-context(.phone) .lt--titled  { min-width: var(--loop-toast-min-width-titled-tablet, 450px); }

:host-context(.phone) .lt {
  min-width: min(var(--loop-toast-min-width-mobile, 300px), 100%);
  gap: var(--loop-toast-gap-mobile, 4px);
  padding: var(--loop-toast-padding-v-mobile, 8px) var(--loop-toast-padding-h-mobile, 16px);
}
:host-context(.phone) .lt--titled  { min-width: min(var(--loop-toast-min-width-titled-mobile, 316px), 100%); }
:host-context(.phone) .lt__content { gap: var(--loop-toast-content-gap-mobile, 8px); }
:host-context(.phone) .lt__message {
  font-size:   var(--loop-toast-body-size-mobile, 12px);
  line-height: var(--loop-toast-body-line-height-mobile, 18px);
}
:host-context(.phone) .lt__icon,
:host-context(.phone) ::slotted([slot="icon"]),
:host-context(.phone) .lt__dismiss {
  width:  var(--loop-toast-icon-size-mobile, 18px);
  height: var(--loop-toast-icon-size-mobile, 18px);
}

@media (prefers-reduced-motion: reduce) {
  :host { transition: opacity .2s ease; transform: translate(var(--loop-toast-tx), 0); }
  :host([position="top"]),
  :host([position="top-left"]),
  :host([position="top-right"]) { transform: translate(var(--loop-toast-tx), 0); }
  :host([open]:not([closing]))  { transform: translate(var(--loop-toast-tx), 0); }
}`;
  }
}

LoopToast.TYPES = ['default', 'success', 'warning', 'error', 'information'];
LoopToast.POSITIONS = ['bottom', 'top', 'bottom-left', 'bottom-right', 'top-left', 'top-right'];

if (!customElements.get('loop-toast')) {
  customElements.define('loop-toast', LoopToast);
}

/* Global helper so an OutSystems Client Action can show/hide a specific toast with one
 * "Run JavaScript" call. The id you pass may be the <loop-toast> element itself OR the
 * parent Block/Container that wraps it (in ODC the Block's id is what you can reach, not
 * the inner element's) — it resolves either way, like the Modal trigger. Optional `opts`
 * patches attributes before showing, e.g.
 *   window.LoopToast.show($parameters.WidgetId, { type: 'error', title: 'Oops', message: '…' }) */
if (!window.LoopToast) {
  const ATTR = {
    type: 'type', position: 'position', title: 'title', message: 'message',
    buttonLabel: 'button-label', buttonHref: 'button-href',
    duration: 'duration', dismissible: 'dismissible', noAction: 'no-action',
  };
  // idOrEl may be: a <loop-toast>, a wrapping Block/Container, or an element id string for either.
  const resolve = (idOrEl) => {
    const root = (typeof idOrEl === 'string') ? document.getElementById(idOrEl) : idOrEl;
    if (!root) return null;
    if (root.tagName && root.tagName.toLowerCase() === 'loop-toast') return root;  // id → the toast
    return (typeof root.querySelector === 'function') ? root.querySelector('loop-toast') : null; // id → the Block; find the toast inside
  };
  const patch = (el, opts) => {
    if (!opts || typeof opts !== 'object') return;
    for (const k of Object.keys(opts)) {
      const attr = ATTR[k] || k;
      if (opts[k] == null) el.removeAttribute(attr);
      else el.setAttribute(attr, String(opts[k]));
    }
  };
  window.LoopToast = {
    show(idOrEl, opts) {
      const el = resolve(idOrEl);
      if (!el || typeof el.show !== 'function') {
        console.warn(`[LoopToast] no <loop-toast> found for "${idOrEl}"`);
        return null;
      }
      patch(el, opts);
      el.show();
      return el;
    },
    hide(idOrEl) {
      const el = resolve(idOrEl);
      if (el && typeof el.hide === 'function') el.hide();
      return el || null;
    },
    toggle(idOrEl, force) {
      const el = resolve(idOrEl);
      if (el && typeof el.toggle === 'function') el.toggle(force);
      return el || null;
    },
  };
}
