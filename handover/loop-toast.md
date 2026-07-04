# Handover — loop-toast (custom Web Component)

The Loop **Toast** — a transient notification that slides into one of **6 screen positions**
(**bottom-centre** by default), stays for a few seconds, then slides back out. Figma: "Toast"
[node 17874-6524]. Per the Figma responsive variants the card narrows and the type/icon/padding
step down on tablet (≤1024px) and phone (≤700px); anchoring works on every device.

**Approach:** Custom component, no native OutSystems widget equivalent. Built as a vanilla JS
Web Component (Shadow DOM) wrapped in an OutSystems Block. Five types; with/without a title;
optional action (text/link) button; optional dismiss (×). Each toast is **addressable by id**
and shown from a **Client Action** with a one-line JavaScript call.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Toast page.

**What it is.** A small, elevated, auto-dismissing toast (Web Component) that animates into one
of 6 screen anchors (bottom-centre by default; also top-centre and all four corners). Five
semantic types, optional title, optional action, optional dismiss.

**When to use**
- Brief, transient confirmation or status after an action ("Saved", "Upload failed — Retry").

**When not to use** (reach for instead)
- A persistent, page-width banner → **System Alert**.
- An inline contextual message → **Note** / native **Feedback Message** (Alerts look).
- A blocking decision → **Modal**.

**How to use**
- Drop one **Toast** Block per message you might raise, give each a unique **id**, and set the
  type / title / message / button. From a Client Action, a "Run JavaScript" node calls
  `window.LoopToast.show('<id>')` to pop it. Script Include = Always.

## Files
| File | OutSystems destination |
|---|---|
| `src/components/loop-toast.js` | Script resource (Theme/Library), Include = **Always** (the `window.LoopToast` helper must exist before any Client Action calls it) |
| `src/components/loop-toast.css` | CSS reference only — styles are embedded in the `.js` Shadow DOM |
| `tokens/component-toast.css` | Included automatically in `dist/theme.css` |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-toast.js</code> → Script resource (Theme/Library), Include = Always</summary>

```js
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
    return ['type', 'position', 'title', 'message', 'button-label', 'button-href', 'dismissible'];
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

  /* Built-in per-type icon — Font Awesome 6 Pro REGULAR glyph (outline weight matches the
   * Figma 1.8px-stroke assets); currentColor so it inherits the per-type icon colour.
   * Rendered from the unicode codepoint against the document-level @font-face (visible
   * inside shadow DOM, unlike .fa-* classes). */
  _defaultIcon(type) {
    const glyph = {
      success:     '&#xf058;',  /* fa-circle-check */
      warning:     '&#xf071;',  /* fa-triangle-exclamation */
      error:       '&#xf06a;',  /* fa-circle-exclamation */
      information: '&#xf05a;',  /* fa-circle-info */
      default:     '&#xf05a;',  /* fa-circle-info */
    }[type] || '&#xf05a;';
    return `<span class="lt__icon" aria-hidden="true">${glyph}</span>`;
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

    const actionHtml = buttonLabel
      ? buttonHref
        ? `<a class="lt__action" href="${buttonHref}">${buttonLabel}</a>`
        : `<button class="lt__action" type="button">${buttonLabel}</button>`
      : '';

    const titleHtml   = titled  ? `<p class="lt__title">${title}</p>`     : '';
    const messageHtml = message ? `<p class="lt__message">${message}</p>` : '';

    const dismissHtml = dismissible
      ? `<div class="lt__dismiss-wrap" part="dismiss-wrap">
          <button class="lt__dismiss" type="button" aria-label="Dismiss">
            <span class="lt__dismiss-glyph" aria-hidden="true">&#xf00d;</span>
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

    this._actionBtn  = (buttonLabel && !buttonHref) ? this.shadowRoot.querySelector('.lt__action') : null;
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
/* FA 6 Pro regular glyph — 20px em box ≈ the 19px outline circles the Figma assets draw
   inside the 24px icon box */
.lt__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--loop-toast-icon-size, 24px);
  height: var(--loop-toast-icon-size, 24px);
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-regular, 400);
  font-size: var(--loop-toast-icon-glyph, 20px);
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
}
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
/* FA xmark (regular) — 16px em box renders the ~12px × the Figma 24px dismiss box draws */
.lt__dismiss-glyph {
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-regular, 400);
  font-size: var(--loop-toast-dismiss-glyph, 16px);
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
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
/* glyphs scale with the mobile icon box (24→18 keeps the same 5:6 optical ratio) */
:host-context(.phone) .lt__icon          { font-size: var(--loop-toast-icon-glyph-mobile, 15px); }
:host-context(.phone) .lt__dismiss-glyph { font-size: var(--loop-toast-dismiss-glyph-mobile, 13px); }

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
    duration: 'duration', dismissible: 'dismissible',
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
```

</details>

## API — Attributes
| Attribute | Values | Description |
|---|---|---|
| `type` | `default` \| `success` \| `warning` \| `error` \| `information` | Toast variant (default: `default`) |
| `position` | `bottom` (default) \| `top` \| `bottom-left` \| `bottom-right` \| `top-left` \| `top-right` | Screen anchor. `bottom`/`top` are horizontally centred; the four corners pin to the side gutter. Each anchor stacks independently |
| `title` | Text | Optional title (20px). Its presence switches to the wider "with title" layout |
| `message` | Text | Body text (14px / line-height 21px) |
| `button-label` | Text | Optional action button label (bold, underlined). Omit for no button |
| `button-href` | URL | If set, the action renders as `<a>`; if omitted, the action fires the `action` event |
| `dismissible` | Boolean — **default ON**; `false`/`0` = off | Shows the × button. Value-aware |
| `duration` | ms (default `5000`); `0` = no auto-dismiss | Auto-dismiss delay; the timer pauses on hover/focus |
| `open` | presence | Reflects visibility; set/removed by `show()`/`hide()` — not usually bound directly |

## API — Methods (callable from OutSystems / JS)
| Method | Description |
|---|---|
| `show()` | Slide in (restarts the auto-dismiss timer) |
| `hide()` | Slide out |
| `toggle(force?)` | Show/hide; optional boolean `force` |

## API — Global helper `window.LoopToast`
The id you pass may be the `<loop-toast>` element **or** the parent Block/Container that wraps
it — it resolves either way (in ODC you can usually only reach the Block's id, not the inner
element's), exactly like the Modal trigger. You can also pass the DOM element directly.

| Call | Description |
|---|---|
| `window.LoopToast.show('<id>')` | Show the toast at that id (toast element or wrapping Block) |
| `window.LoopToast.show('<id>', { type, position, title, message, buttonLabel, buttonHref, duration, dismissible })` | Patch attributes (incl. `position`), then show. Useful when one placed toast is reused for several messages/anchors |
| `window.LoopToast.hide('<id>')` | Hide it early |
| `window.LoopToast.toggle('<id>', force?)` | Show/hide; optional boolean `force` |

## API — Events
| Event | Detail | Description |
|---|---|---|
| `show` | `{ id, type }` | Fired when the toast starts showing |
| `hide` | `{ id, type }` | Fired when the toast has finished hiding |
| `action` | `{ id, type }` | Fired when the action is clicked without a `button-href` |
| `dismiss` | `{ id, type }` | Fired when the × is clicked (the toast then hides) |

## API — Slots
| Slot | Description |
|---|---|
| `icon` | Overrides the **built-in** per-type icon (e.g. `<img slot="icon" src="…" alt="">`). Each type ships a default 24×24 icon (info / check / triangle / circle-exclamation). The defaults are **Font Awesome 6 Pro regular glyphs** rendered from unicode against the self-hosted icon font. |

## Example HTML
```html
<!-- Placed once on the screen/layout, addressed by id -->
<loop-toast id="prefsToast"
  type="error"
  title="Oh, no. There is a problem!"
  message="User preferences failed. Site loaded with default preferences!"
  button-label="Retry">
</loop-toast>

<!-- Fired from a Client Action "Run JavaScript" node -->
<script>window.LoopToast.show('prefsToast');</script>

<!-- Anchor elsewhere: set the attribute, or pass position when showing -->
<loop-toast id="savedToast" type="success" position="top-right" message="Saved."></loop-toast>
<script>window.LoopToast.show('savedToast', { position: 'bottom-left' });</script>
```

## OutSystems Block wiring
1. Create Block `Toast`: inputs `Type` (**Static Entity** `ToastType`, default `Default`),
   `Position` (**Static Entity** `ToastPosition`, default `Bottom`), `Title`, `Message`,
   `ButtonLabel`, `ButtonHref` (all Text), `Dismissible` (Boolean, default True),
   `Duration` (Integer, default 5000); events `OnAction`, `OnDismiss` (and optionally `OnShow`/`OnHide`).
   Model the enumerations as Static Entities, **not** free Text: `ToastType` (records
   `Default`/`Success`/`Warning`/`Error`/`Information`) and `ToastPosition` (`Bottom`/`Top`/
   `BottomLeft`/`BottomRight`/`TopLeft`/`TopRight`). Give each entity a **single Text attribute
   `Value` set as the record Identifier** (delete the default `Id`/`Label`/`Order`/`Is_Active`);
   each record's value is the literal the component expects (`default`…; `bottom`, `bottom-left`…).
   **Do not add a string `Id` input** — OutSystems generates element ids at runtime; you
   address a toast by its widget's platform-generated `.Id` (step 4).
2. On the `<loop-toast>` HTML element, bind attributes from the inputs (ODC requires a Value
   expression on every attribute):
   - `type` → `Type`, `position` → `Position` (bind the Static-Entity input directly — its `Value` is the identifier)
   - `title` → `Title`, `message` → `Message`, `button-label` → `ButtonLabel`,
     `button-href` → `ButtonHref`, `duration` → `Duration`
   - `dismissible` → `If(Dismissible, "true", "false")`
   The boolean attribute is **value-aware** (`"false"`/`"0"`/absent = off), so the `If(...)`
   expression works directly — no OnReady JavaScript node needed. Do **not** set the `id`
   attribute.
3. Wire `action` CustomEvent → `OnAction`, `dismiss` CustomEvent → `OnDismiss`.
4. To **trigger** the toast, give the `<loop-toast>` element (or its wrapping Block/Container)
   a **Name**, then add a Client Action with a **"Run JavaScript"** node whose `WidgetId` input
   is set to that widget's **platform-generated** `.Id` (e.g. `ToastEl.Id`) — never a hand-typed
   string. The helper resolves the `<loop-toast>` whether the id points at the element itself or
   at the Block/Container wrapping it:
   ```js
   window.LoopToast.show($parameters.WidgetId);
   // or override content on the fly:
   // window.LoopToast.show($parameters.WidgetId, { type: $parameters.Type, title: $parameters.Title, message: $parameters.Message });
   ```
   If you'd rather not use the helper, the equivalent inline resolution (mirrors the Modal trigger):
   ```js
   var root  = document.getElementById($parameters.WidgetId);
   var toast = !root ? null
             : (root.tagName && root.tagName.toLowerCase() === 'loop-toast'
                 ? root                                  // id pointed straight at the toast
                 : root.querySelector('loop-toast'));    // id was the Block — find the toast inside
   if (toast) { toast.show ? toast.show() : toast.setAttribute('open', ''); }
   ```
   Place one `Toast` instance per message you might raise (each with a unique **Name** so its
   runtime `.Id` is addressable) and trigger the one you want.

## Accessibility (WCAG 2.2 AA)
- `role="alert"` + `aria-live="assertive"` for `error`/`warning`; `role="status"` +
  `aria-live="polite"` for `default`/`success`/`information` (screen readers announce on show).
- The **auto-dismiss timer pauses on hover/focus**, so keyboard/AT users are never rushed; the ×
  stays reachable. × has `aria-label="Dismiss"`. Focus rings use `currentColor` (no colour
  substitution), per CLAUDE.md. `prefers-reduced-motion` → fade only, no slide.
- Contrast (validated): success white-90 on `#388004` ≈ 5.0:1, warning `#473201` on `#e19d00`
  ≈ 5.2:1 — both ≥ 4.5:1. Built faithfully to the Figma colours.
- ⚠️ **token gap (FND-055):** the warning **title** shade `#612705` (Figma `lift/text/on state/warning/emphasis`)
  has no primitive token; `--loop-toast-warning-title` falls back to the warning text token
  (`#473201`), so the title renders one shade lighter than Figma pending a primitive — see `findings/findings-register.md`.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, wire up an OutSystems Block that wraps the already-imported custom
Web Component <loop-toast> for the WBG "The Loop" design system.

Context (already done manually — do NOT re-create or edit these):
- dist/theme.css (brand + component tokens) is already pasted into the ODC Theme editor.
- loop-toast.js is already imported as a Script resource (Theme/Library), Include = Always. It
  defines the custom element <loop-toast> and the global helper window.LoopToast.
- Do NOT write CSS, author or modify JavaScript, or edit the Theme. Your job is only the
  Block, its inputs/events, the attribute bindings, the event wiring, and the Client
  Actions that drive the component.

Task — create these elements, referencing each by the exact name given:

1. Create a Block named "Toast" with input parameters:
     Type        : ToastType (Static Entity)     : ToastType.Default
     Position    : ToastPosition (Static Entity) : ToastPosition.Bottom
     Title       : Text                          : ""
     Message     : Text                          : ""
     ButtonLabel : Text                          : ""
     ButtonHref  : Text                          : ""
     Dismissible : Boolean                       : True
     Duration    : Integer                       : 5000
   and Block events: OnAction, OnDismiss.
   Static Entities — create these first. Give each a SINGLE Text attribute "Value"
   set as the record Identifier, and delete the default Id/Label/Order/Is_Active attributes.
   Each record's value IS the literal the Web Component expects, so the input binds straight
   to the attribute (no .Value suffix). Model the matching inputs as the entity, NOT free Text:
   - ToastType: Default = "default", Success = "success", Warning = "warning", Error = "error", Information = "information"
   - ToastPosition: Bottom = "bottom", Top = "top", BottomLeft = "bottom-left", BottomRight = "bottom-right", TopLeft = "top-left", TopRight = "top-right"
   Do NOT add a string Id input or set the element's id — OutSystems generates ids at
   runtime (see step 4 for addressing).

2. Place an HTML element <loop-toast> in the Block. Set one attribute per input via a Value
   expression (ODC requires an expression on every attribute):
     type         = Type
     position     = Position
     title        = Title
     message      = Message
     button-label = ButtonLabel
     button-href  = ButtonHref
     dismissible  = If(Dismissible, "true", "false")
     duration     = Duration
   Static-Entity inputs bind directly (e.g. type = Type) — the Value attribute is the
   record Identifier. Use If(flag,"true","false") for every Boolean (values, not presence).

3. Wire CustomEvents to Block events: the "action" CustomEvent triggers OnAction, and the "dismiss" CustomEvent triggers OnDismiss. Implement with a "Run JavaScript" that
   addEventListener's each event on the <loop-toast> element and raises the Block event.

4. OutSystems generates element ids at runtime, so you address a specific instance by its
   widget's platform id — NOT a hand-typed string. Give the <loop-toast> element (or its
   Block) a Name, then create client action(s) with a "Run JavaScript" node that take a
   WidgetId Text input set to <thatWidgetName>.Id and call the helper:
     - "ShowToast": window.LoopToast.show($parameters.WidgetId);
     - "HideToast": window.LoopToast.hide($parameters.WidgetId);
     - "ToggleToast": window.LoopToast.toggle($parameters.WidgetId);
   The helper resolves the <loop-toast> from that id (it accepts the element id or a
   wrapping Block/Container id).

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values (styling
comes from var(--token) in the Theme). After generating, list every element you created by
name and flag any step you could not finish so I can do it manually.

Start with step 1 (the Block "Toast" interface) and show it to me before wiring.
```

## Checklist
- [ ] Import `loop-toast.js` as a Script resource, Include = **Always**.
- [ ] Rebuild `dist/theme.css` and paste into the ODC Theme editor (includes `--loop-toast-*` tokens).
- [ ] Create the `ToastType` / `ToastPosition` Static Entities (records + `Value` attr).
- [ ] Create Block `Toast` with the inputs/events above (Static-Entity `Type`/`Position`, no `Id` input); give each placed instance a unique **Name**.
- [ ] Add a Client Action with a "Run JavaScript" node calling `window.LoopToast.show($parameters.WidgetId)`, with `WidgetId` set to the toast widget's platform-generated `.Id`.
- [ ] Test all five types and both layouts (with/without title); test action + dismiss; test
      auto-dismiss + hover-to-pause; test multiple toasts stacking at one anchor.
- [ ] Test all 6 positions (bottom/top + 4 corners); resize to phone (≤700px) / tablet (≤1024px)
      to confirm the card scales per the Figma breakpoints and corners stay within the viewport.
- [ ] 1-Click Publish → validate in a **real browser** (Web Components never work in Service Studio Preview).
