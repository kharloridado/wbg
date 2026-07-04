/**
 * <loop-modal> — Centred dialog over a full-viewport overlay ("The Loop" Modal).
 *
 * Figma: -The Loop- Main Library · "Modal/Popup" [node:22049-35100]
 *   canonical sticker "-loop modal" [node:22200-69277].
 * Custom vanilla JS Web Component (no native OS widget). Replaces the earlier
 * native-Popup restyle so the dialog is fully self-contained and toggleable from
 * OutSystems with a single attribute. Reads the --loop-modal-* tokens (they cascade
 * into Shadow DOM) declared in tokens/component-modal.css.
 *
 * Attributes (all booleans are VALUE-AWARE: attr="false" ≡ absent, so ODC bindings
 * of the form If(Flag, "true", "false") work — presence alone also still works):
 *   open               Boolean — visible; omit/remove/"false" to hide (the toggle target)
 *   heading            Title text (fallback when no slot="heading" is provided)
 *   size               "medium" (default, 960px) | "small" (456px)
 *   no-icon            Boolean — hide the leading information icon
 *   no-close           Boolean — hide the ✕ close button (modal still closes via ESC / backdrop)
 *   no-backdrop-close  Boolean — clicking the overlay will NOT dismiss (ESC still works)
 *   static             Boolean — disable light-dismiss entirely (no ESC, no backdrop close)
 *
 * Public methods:  show()  ·  hide()  ·  toggle(force?)
 *
 * Events (bubbles, composed):
 *   open   — fired after the modal opens; detail: {}
 *   close  — fired after it closes; detail: { reason: 'close-button'|'backdrop'|'escape'|'api' }
 *
 * Slots (each shows a placeholder fallback when empty — dev scaffold):
 *   icon      — leading 24px icon; default = circle-info (hidden when no-icon)
 *   heading   — rich title; falls back to the `heading` attribute, then "Modal title"
 *   (default) — body content; falls back to the "Modal Content Placeholder" box
 *   footer    — action buttons; falls back to placeholder Tertiary / Secondary / Primary.
 *               Place real native .btn buttons here — global theme styles project onto them.
 *
 * Accessibility: role="dialog" aria-modal="true"; title linked via aria-labelledby;
 * focus moves into the dialog on open and is trapped (Tab cycles); ESC closes; focus
 * returns to the trigger on close; body scroll is locked while open; close button has
 * an aria-label; focus rings use the design's own blue. No visual design value altered.
 *
 * OutSystems: drop loop-modal.js into Resources. Wrap your content in this element inside
 * a Block; bind `open` to a page Boolean and flip it from a button's OnClick:
 *   document.querySelector('loop-modal').toggle();   // or .show() / .hide()
 */
class LoopModal extends HTMLElement {
  static get observedAttributes() {
    return ['open', 'heading', 'size', 'no-icon', 'no-close', 'no-backdrop-close', 'static'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._titleId = `lmo-title-${Math.random().toString(36).slice(2, 7)}`;
    this._returnFocus = null;
    this._scrollLocked = false;
    this._active = false;        // guards open/close so effects + events fire once per transition
    this._closeReason = 'api';   // reason carried into the next `close` event (set by dismiss handlers)
    this._onClose = this._onClose.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this._onBackdrop = this._onBackdrop.bind(this);
  }

  connectedCallback() {
    this._render();
    if (this._isOpen) this._activate();
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._onKeydown);
    this._unlockScroll();
    this._active = false;   // allow a clean re-activate if reconnected while open
  }

  attributeChangedCallback(name, oldV, newV) {
    if (oldV === newV || !this.isConnected) return;  // pre-connect changes are handled by connectedCallback
    this._render();
    if (name === 'open') (this._isOpen ? this._activate() : this._deactivate());
  }

  /* ---- value-aware boolean attribute helper ---- */
  /* Treats absent and "false" as falsy so ODC If(Flag,"true","false") bindings work. */
  _boolAttr(name) {
    const v = this.getAttribute(name);
    return v !== null && v !== 'false';
  }

  /* ---- attribute getters (booleans all value-aware) ---- */
  get _isOpen()         { return this._boolAttr('open'); }
  get _heading()        { return this.getAttribute('heading') || ''; }
  get _size()           { return this.getAttribute('size') === 'small' ? 'small' : 'medium'; }
  get _noIcon()         { return this._boolAttr('no-icon'); }
  get _noClose()        { return this._boolAttr('no-close'); }
  get _isStatic()       { return this._boolAttr('static'); }
  get _noBackdropClose(){ return this._boolAttr('no-backdrop-close') || this._isStatic; }

  /* ---- public API ---- */
  show()        { this.setAttribute('open', ''); }
  hide()        { this.removeAttribute('open'); }
  toggle(force) {
    const next = (force === undefined) ? !this._isOpen : !!force;
    next ? this.show() : this.hide();
  }

  /* ---- open / close lifecycle ---- */
  _activate() {
    if (this._active) return;            // idempotent — covers re-render / double attribute fire
    this._active = true;
    this._returnFocus = document.activeElement;
    this._lockScroll();
    document.addEventListener('keydown', this._onKeydown);
    // move focus into the dialog (first focusable, else the dialog itself)
    requestAnimationFrame(() => {
      const f = this._focusables();
      (f[0] || this.shadowRoot.querySelector('.lmo'))?.focus();
    });
    this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true, detail: {} }));
  }

  _deactivate() {
    if (!this._active) return;
    this._active = false;
    document.removeEventListener('keydown', this._onKeydown);
    this._unlockScroll();
    const el = this._returnFocus;
    if (el && typeof el.focus === 'function') el.focus();
    this._returnFocus = null;
    // `close` is lifecycle-driven so it fires however the modal closes (button, ESC,
    // backdrop, .hide(), or binding open=false) — reason defaults to 'api'.
    const reason = this._closeReason;
    this._closeReason = 'api';
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true, detail: { reason } }));
  }

  /* dismiss helper: record why, then drive the attribute → _deactivate emits `close` */
  _close(reason) {
    if (!this._isOpen) return;
    this._closeReason = reason;
    this.removeAttribute('open');
  }
  _onClose() { this._close('close-button'); }

  _onBackdrop(e) {
    // close only when the click lands on the overlay itself, not the dialog
    if (this._noBackdropClose) return;
    if (e.target === e.currentTarget) this._close('backdrop');
  }

  _onKeydown(e) {
    if (!this._isOpen) return;
    if (e.key === 'Escape' && !this._isStatic) { e.stopPropagation(); this._close('escape'); return; }
    if (e.key === 'Tab') this._trapFocus(e);
  }

  /* focusable elements across BOTH the shadow DOM (close button) and the slotted
   * light DOM (content + footer buttons), in rendered tab order. */
  _focusables() {
    const sel = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
                'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const isVisible = (el) => el.offsetWidth || el.offsetHeight || el.getClientRects().length;
    return [
      ...this.shadowRoot.querySelectorAll(sel),
      ...this.querySelectorAll(sel),
    ].filter(isVisible);
  }

  _trapFocus(e) {
    const f = this._focusables();
    if (!f.length) { e.preventDefault(); return; }
    const first = f[0], last = f[f.length - 1];
    const active = this.shadowRoot.activeElement || document.activeElement;
    if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  }

  /* ---- body scroll lock ---- */
  _lockScroll() {
    if (this._scrollLocked) return;
    this._prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    this._scrollLocked = true;
  }
  _unlockScroll() {
    if (!this._scrollLocked) return;
    document.body.style.overflow = this._prevOverflow || '';
    this._scrollLocked = false;
  }

  /* ---- icons — Font Awesome 6 Pro glyphs, rendered from unicode codepoints against the
     document-level @font-face (visible inside shadow DOM, unlike .fa-* classes) ---- */
  _circleInfoGlyph() {
    return `<span class="lmo__icon-glyph" aria-hidden="true">&#xf05a;</span>`;  /* fa-circle-info */
  }
  _closeGlyph() {
    return `<span class="lmo__close-glyph" aria-hidden="true">&#xf00d;</span>`;  /* fa-xmark */
  }

  _render() {
    const heading = this._heading || 'Modal title';
    const iconHtml = this._noIcon ? '' :
      `<span class="lmo__icon" part="icon"><slot name="icon">${this._circleInfoGlyph()}</slot></span>`;
    const closeHtml = this._noClose ? '' :
      `<button class="lmo__close" type="button" part="close" aria-label="Close dialog">${this._closeGlyph()}</button>`;

    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="lmo__overlay" part="backdrop">
      <div class="lmo lmo--${this._size}"
           role="dialog"
           aria-modal="true"
           aria-labelledby="${this._titleId}"
           tabindex="-1"
           part="dialog">
        <header class="lmo__header" part="header">
          <div class="lmo__heading-group">
            ${iconHtml}
            <h2 class="lmo__title" id="${this._titleId}" part="title">
              <slot name="heading">${heading}</slot>
            </h2>
          </div>
          ${closeHtml}
        </header>

        <div class="lmo__content" part="content">
          <slot>
            <div class="lmo__placeholder">Modal Content Placeholder</div>
          </slot>
        </div>

        <footer class="lmo__footer" part="footer">
          <slot name="footer">
            <button class="lmo__ph-btn lmo__ph-btn--tertiary" type="button">Tertiary</button>
            <div class="lmo__footer-end">
              <button class="lmo__ph-btn lmo__ph-btn--secondary" type="button">Secondary</button>
              <button class="lmo__ph-btn lmo__ph-btn--primary" type="button">Primary</button>
            </div>
          </slot>
        </footer>
      </div>
      </div>`;

    this.shadowRoot.querySelector('.lmo__close')?.addEventListener('click', this._onClose);
    this.shadowRoot.querySelector('.lmo__overlay')?.addEventListener('click', this._onBackdrop);
  }

  _css() {
    return `
:host {
  position: fixed;
  inset: 0;
  z-index: var(--loop-modal-z, 1000);
  display: none;
}
:host([open]) { display: block; }
:host([open="false"]) { display: none; }  /* value-aware: ODC If(Flag,"true","false") binding */

.lmo__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--loop-modal-gutter, 16px);
  box-sizing: border-box;
  background: var(--loop-modal-overlay, #012740e5);
}

.lmo {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: var(--loop-modal-width-medium, 960px);
  max-height: 100%;
  overflow: auto;
  border-radius: var(--loop-modal-radius, 16px);
  background: var(--loop-modal-bg, #ffffff);
  box-shadow: var(--loop-modal-shadow, none);
}
.lmo:focus { outline: none; }
.lmo--small { max-width: var(--loop-modal-width-small, 456px); }

/* ---- header ---- */
.lmo__header {
  display: flex;
  align-items: center;
  gap: var(--loop-modal-title-gap, 8px);
  padding: var(--loop-modal-header-pt, 24px) var(--loop-modal-side-padding, 40px)
           var(--loop-modal-header-pb, 16px) var(--loop-modal-side-padding, 40px);
}
.lmo__heading-group {
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  align-items: center;
  gap: var(--loop-modal-title-gap, 8px);
}
.lmo__icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  padding-top: var(--loop-modal-icon-pt, 2px);
  width: var(--loop-modal-icon-size, 24px);
  height: var(--loop-modal-icon-size, 24px);
  color: var(--loop-modal-icon-color, #004370);
}
.lmo__icon ::slotted(*) { width: 100%; height: 100%; }
/* FA circle-info (regular) — 20px em box ≈ the 20px outline circle the Figma header draws
   inside the 24px icon box */
.lmo__icon-glyph {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-regular, 400);
  font-size: var(--loop-modal-icon-glyph, 20px);
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
}
.lmo__title {
  flex: 1 0 0;
  min-width: 0;
  margin: 0;
  font-family: var(--font-family-heading, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-modal-title-size, 24px);
  font-weight: var(--loop-modal-title-weight, 700);
  line-height: var(--loop-modal-title-leading, normal);
  color: var(--loop-modal-title-color, #012740);
}

/* ---- close ---- */
.lmo__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: var(--loop-modal-close-size, 40px);
  height: var(--loop-modal-close-size, 40px);
  padding: 0;
  border: 0;
  border-radius: 100px;
  background: var(--loop-modal-close-bg, #169af3);
  color: var(--loop-modal-close-icon, #004370);
  cursor: pointer;
}
/* FA xmark (regular) — 14px em box renders the ~11px × the Figma close button draws */
.lmo__close-glyph {
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-regular, 400);
  font-size: var(--loop-modal-close-glyph, 14px);
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
}
.lmo__close:focus-visible {
  outline: 2px solid var(--loop-modal-close-focus, #0071bc);
  outline-offset: 2px;
}

/* ---- content ---- */
.lmo__content {
  padding: 0 var(--loop-modal-side-padding, 40px) var(--loop-modal-content-pb, 40px);
}
.lmo__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  width: 100%;
  border-radius: var(--radius-base, 4px);
  background: var(--color-neutral-10, #e7edf3);
  color: var(--color-text-on-light-state-disabled, rgba(0,41,77,0.42));
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--font-size-200, 14px);
}

/* ---- footer ---- */
.lmo__footer {
  display: flex;
  align-items: center;
  gap: var(--loop-modal-footer-gap, 8px);
  padding: 0 var(--loop-modal-side-padding, 40px) var(--loop-modal-footer-pb, 40px);
}
.lmo__footer-end {
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  align-items: center;
  justify-content: flex-end;
  gap: var(--loop-modal-footer-gap, 8px);
}

/* placeholder footer buttons (shadow-scoped scaffold — real .btn buttons slot in
   from the light DOM and inherit the global Loop button theme) */
.lmo__ph-btn {
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--font-size-200, 14px);
  font-weight: var(--font-weight-bold, 700);
  letter-spacing: -0.5px;
  padding: 12px 28px;
  border-radius: var(--radius-pill, 32px);
  border: 2px solid transparent;
  cursor: pointer;
}
.lmo__ph-btn--tertiary  { background: transparent; color: var(--color-blue-70, #004370); border-color: transparent; }
.lmo__ph-btn--secondary { background: var(--color-white, #fff); color: var(--color-blue-70, #004370); border-color: var(--color-blue-70, #004370); }
.lmo__ph-btn--primary   { background: var(--color-blue-70, #004370); color: var(--color-white, #fff); border-color: transparent; }

@media (prefers-reduced-motion: reduce) {
  .lmo, .lmo__close { transition: none; }
}`;
  }
}

if (!customElements.get('loop-modal')) {
  customElements.define('loop-modal', LoopModal);
}
