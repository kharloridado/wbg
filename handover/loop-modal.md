# Handover — loop-modal (custom Web Component)

The Loop **Modal** — centred dialog over a full-viewport overlay.
Figma: "Modal/Popup" [node 22049-35100] · canonical sticker "-loop modal" [node 22200-69277].

**Approach:** Custom component (no native OutSystems Popup restyle — the Web Component is
self-contained and fully toggleable). Built as a vanilla JS Web Component (Shadow DOM)
wrapped in an OutSystems Block. Medium (960px, default) and Small (456px) size variants; four named
slots with placeholder fallbacks; focus trap; body scroll lock; ESC + backdrop dismiss.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Modal page.

**What it is.** A centred dialog layered over a full-viewport blue-90 @ 90% overlay
(effects/modal/overlay). Toggleable by attribute — no page reload.

**When to use**
- Collect input or confirm an action that **blocks** the current task.
- Display detail that needs the user's full attention before continuing.

**When not to use** (reach for instead)
- A brief contextual hint → **Popover** or **Tooltip**.
- A page-level status banner → **System Alert**.
- A non-blocking inline notice → **Note**.

**How to use**
- Drop the **Modal** Block; set `Heading`, `Size`, and optional boolean flags.
  Call `show()` / `hide()` / `toggle()` from JavaScript (e.g., a button's `OnClick` JS node).
  Script Include = **When invoked**.

## Files
| File | OutSystems destination |
|---|---|
| `src/components/loop-modal.js` | Script resource (Theme/Library), Include = **When invoked** |
| `tokens/component-modal.css` | Included automatically in `dist/theme.css` |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-modal.js</code> → Script resource (Theme/Library), Include = When invoked</summary>

```js
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
```

</details>

## API — Attributes
All Boolean attributes are **value-aware**: `attr="false"` behaves the same as the attribute
being absent, so they bind directly to ODC Boolean inputs with `If(Flag, "true", "false")`.

| Attribute | Values | ODC binding | Description |
|---|---|---|---|
| `open` | Boolean | `If(IsOpen, "true", "false")` (or drive via `show()`/`hide()`) | Visible; toggle to show/hide |
| `heading` | Text | `Heading` | Heading text (fallback when `slot="heading"` is empty) |
| `size` | `medium` (default) \| `small` | `Size` | Medium = 960px, Small = 456px |
| `no-icon` | Boolean | `If(NoIcon, "true", "false")` | Hide the leading information icon |
| `no-close` | Boolean | `If(NoClose, "true", "false")` | Hide the ✕ close button |
| `no-backdrop-close` | Boolean | `If(NoBackdropClose, "true", "false")` | Clicking the overlay will not dismiss |
| `static` | Boolean | `If(Static, "true", "false")` | Disable all light-dismiss (no ESC, no backdrop) |

## API — Methods (call from JavaScript node)
| Method | Description |
|---|---|
| `show()` | Opens the modal |
| `hide()` | Closes the modal |
| `toggle(force?)` | Toggles; optional `force` boolean overrides direction |

## API — Events
| Event | Detail | Description |
|---|---|---|
| `open` | `{}` | Fired after the modal opens |
| `close` | `{ reason: 'close-button' \| 'backdrop' \| 'escape' \| 'api' }` | Fired after it closes |

## API — Slots
| Slot | Fallback placeholder | Description |
|---|---|---|
| `icon` | circle-info SVG | Leading 24px icon in the header |
| `heading` | `heading` attribute → "Modal title" | Rich heading content |
| (default) | Grey "Modal Content Placeholder" box | Body content — drop Containers, forms, text here |
| `footer` | Scaffold Tertiary / Secondary / Primary buttons | Action buttons row |

## Example HTML
```html
<!-- Trigger -->
<button class="btn btn-primary" onclick="document.getElementById('my-modal').show()">
  Open modal
</button>

<!-- Modal (Medium, default) -->
<loop-modal id="my-modal" heading="Energy is creating jobs">
  <p>Your body content goes here.</p>
  <!-- footer buttons: tertiary left, secondary + primary right -->
  <button slot="footer" class="btn" onclick="document.getElementById('my-modal').hide()">Cancel</button>
  <div slot="footer" style="display:flex;gap:8px;margin-left:auto">
    <button class="btn btn-secondary" onclick="document.getElementById('my-modal').hide()">Save draft</button>
    <button class="btn btn-primary" onclick="document.getElementById('my-modal').hide()">Submit</button>
  </div>
</loop-modal>

<!-- Small variant -->
<loop-modal id="confirm-modal" size="small" heading="Confirm deletion">
  <p>This action can't be undone.</p>
  <div slot="footer" style="display:flex;gap:8px;margin-left:auto">
    <button class="btn btn-secondary" onclick="document.getElementById('confirm-modal').hide()">Cancel</button>
    <button class="btn btn-primary" onclick="document.getElementById('confirm-modal').hide()">Delete</button>
  </div>
</loop-modal>
```

## Footer layout note
The `footer` slot is a flex row (`align-items: center; gap: 8px`). Tertiary actions go in
first (sit left naturally); group secondary + primary in a `<div style="display:flex;gap:8px;margin-left:auto">` to pin them right. Real `.btn` buttons slot in from the light DOM and inherit the global Loop button theme automatically.

## Slots in OutSystems — IMPORTANT (named slots need a `slot` attribute)
> ⚠️ An OutSystems Block **Placeholder does NOT automatically add a `slot="…"` attribute** to
> the content you drop into it. The default (unnamed) slot works with a bare Placeholder, but
> for the **named** slots (`icon`, `heading`, `footer`) the projected content must sit on an
> element that carries the literal `slot` attribute — otherwise the content lands in the default
> slot (or nowhere) and the component falls back to its placeholder scaffold.

**Most modals only need two Placeholders** — the rest is covered by attributes/defaults:

| Region | Recommended path | Needs a `slot` attribute? |
|---|---|---|
| Heading | `Heading` **text input** → `heading` attribute | No (no Placeholder) |
| Icon | built-in circle-info (or `NoIcon` to hide) | No (no Placeholder) |
| **Content** | **Placeholder `Content`** → default slot | **No** — bare Placeholder works |
| **Footer** | **Placeholder `Footer`** wrapped in a Container with `slot="footer"` | **Yes** |

**How to set the `slot` attribute in Service Studio:** select the wrapper **Container**, open its
**Properties → Attributes** (the custom HTML attributes list / "Extended Properties"), and add
`Name = slot`, `Value = footer` (or `icon` / `heading`). The Block markup then resolves to:

```html
<loop-modal id="..." heading="...">
  <!-- default slot: bare Placeholder, no attribute -->
  <Placeholder: Content />

  <!-- named slot: Container carries slot="footer", Placeholder lives inside it -->
  <div slot="footer">
    <Placeholder: Footer />
  </div>
</loop-modal>
```

Inside the **Footer** Placeholder, lay the buttons out yourself (a flex Container): put the
tertiary action first and pin secondary + primary to the right with `margin-left:auto`. The
`.lmo__footer-end` helper is shadow-internal and not reachable from slotted content.

Optional rich **Heading**/**Icon**: add a `Heading`/`Icon` Placeholder the same way, each wrapped
in a Container carrying `slot="heading"` / `slot="icon"`. Skip these unless you need markup richer
than the `heading` text or a custom icon.

## OutSystems Block wiring
1. Create Block `Modal` with inputs:
   - `Heading` (Text), `Size` (Text, default `"medium"`), `NoIcon` (Boolean, default `False`),
     `NoClose` (Boolean), `NoBackdropClose` (Boolean), `Static` (Boolean)
2. Events: `OnOpen` (no params), `OnClose` with `Reason` (Text).
3. Placeholders (see the slot rules above):
   - `Content` — bare Placeholder → default slot (main body widgets)
   - `Footer` — Placeholder inside a Container with attribute `slot="footer"` (button row)
   - *(optional)* `Icon` / `Heading` — each inside a Container with `slot="icon"` / `slot="heading"`
4. Bind the inputs **directly on the `<loop-modal>` element's attributes** (Properties →
   Attributes; ODC requires a Value expression on every attribute — no JavaScript node needed;
   all booleans are value-aware, so `"false"` behaves like absent):
   | Attribute | Value expression |
   |---|---|
   | `heading` | `Heading` |
   | `size` | `Size` |
   | `no-icon` | `If(NoIcon, "true", "false")` |
   | `no-close` | `If(NoClose, "true", "false")` |
   | `no-backdrop-close` | `If(NoBackdropClose, "true", "false")` |
   | `static` | `If(Static, "true", "false")` |
5. Wire `open`/`close` CustomEvents to `OnOpen`/`OnClose` actions:
   ```javascript
   var el = document.getElementById($parameters.WidgetId);
   el.addEventListener('close', function(e) { $actions.OnClose(e.detail.reason); });
   el.addEventListener('open',  function()  { $actions.OnOpen(); });
   ```
6. Toggle visibility from a trigger button's OnClick — call the reusable **ToggleModal**
   client action below, passing the **Block** id (it resolves the modal nested inside).

## Reusable Client Action — `ToggleModal`
A modal placed inside a Block is a **child** of that Block, so a parent screen usually only has
the **Block's** widget id, not the modal's own id. This one client action accepts either: if you
hand it the `<loop-modal>` id it uses it directly; if you hand it the Block (or any wrapping
Container) id it finds the `<loop-modal>` inside. Reuse it from every trigger.

**Client Action `ToggleModal`** — Inputs: `WidgetId` (Text), `Action` (Text: `show` | `hide` |
`toggle`, default `toggle`). Optional Output: `Found` (Boolean). One JavaScript node:

```javascript
// WidgetId may be the <loop-modal> id OR the parent Block/Container id (modal is a child).
var root  = document.getElementById($parameters.WidgetId);
var modal = !root ? null
          : (root.tagName && root.tagName.toLowerCase() === 'loop-modal'
              ? root                                 // id pointed straight at the modal
              : root.querySelector('loop-modal'));   // id was the Block — find the modal inside

if (modal) {
  var a = ($parameters.Action || 'toggle').toLowerCase();
  if      (a === 'show') { modal.show   ? modal.show()   : modal.setAttribute('open', ''); }
  else if (a === 'hide') { modal.hide   ? modal.hide()   : modal.removeAttribute('open'); }
  else                   { modal.toggle ? modal.toggle() : modal.toggleAttribute('open'); }
}
$parameters.Found = !!modal;   // optional — false if the id resolved to no modal
```

Notes:
- The method/attribute fallback (`modal.show ? … : setAttribute('open','')`) keeps it working even
  if the element hasn't upgraded yet — the component reads the `open` attribute on connect.
- `querySelector('loop-modal')` matches at any depth and returns the **first** modal in the Block.
  If a Block hosts several modals, add a `ModalId` input and use `root.querySelector('#'+id)`.

```javascript
// Trigger button OnClick → ToggleModal( WidgetId: BlockContainer.Id, Action: "show" )
```

## Accessibility (WCAG 2.2 AA)
`role="dialog"` + `aria-modal="true"`; heading linked via `aria-labelledby`; close button has
`aria-label="Close dialog"`; **focus trap** (Tab cycles within the modal, Shift+Tab reverses);
focus returns to the trigger on close; **body scroll locked** while open; ESC and backdrop
dismiss (suppressible); focus ring uses `--loop-modal-close-focus` (#0071bc).

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, wire up an OutSystems Block that wraps the already-imported custom
Web Component <loop-modal> for the WBG "The Loop" design system.

Context (already done manually — do NOT re-create or edit these):
- dist/theme.css and any block CSS are already pasted into the ODC Theme editor.
- loop-modal.js is already imported as a Script resource (Theme/Library), Include = When invoked. It defines the custom element <loop-modal>.
- Do NOT write CSS, author/modify JavaScript, or edit the Theme. Your job is only the
  Block, its inputs/events, the attribute bindings, the event wiring, and any Client
  Actions that drive it.

Task — reference every element by the exact name given. Take the exact inputs, attribute
bindings, events and any global helper from this handover's "API — Attributes / Methods /
Events" tables (paste the relevant table into the chat so I work from real names):

1. Create a Block named "Modal". Add one input per attribute (use the documented
   default) and one event per CustomEvent. Model enumerable attributes (variant / type /
   size / position / status) as Static Entities — one record per allowed value, with a
   single Text attribute (e.g. "Value") set as the record Identifier (delete the default
   Id/Label/Order/Is_Active) holding the literal the component expects — not free Text;
   keep free-form text as Text and flags as Boolean. Do NOT add a string Id input or set
   the element's id; OutSystems generates ids at runtime (see step 4).
2. Place <loop-modal> in the Block. Bind each attribute to its input with a Value expression
   (ODC requires one on every attribute). Static-Entity inputs bind directly (e.g.
   type = Type) since their Value attribute is the identifier; Booleans use
   If(Flag, "true", "false") — not presence.
3. Wire each CustomEvent to its Block event via a "Run JavaScript" handler that
   addEventListener's the event on the <loop-modal> element and raises the Block event.
4. If the component exposes a global helper (see its API section), give the element/Block
   a Name and pass its platform-generated runtime .Id, e.g.
   window.LoopX.show($parameters.WidgetId) where the WidgetId input = <WidgetName>.Id.

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values (styling
comes from var(--token) in the Theme). After generating, list every element you created by
name and flag anything you could not finish.

Work iteratively: create the Block interface in step 1 and show it to me before wiring.
```

## Checklist
- [ ] Import `loop-modal.js` as Script resource, Include = **When invoked**.
- [ ] Rebuild `dist/theme.css` and paste into ODC Theme editor (includes `--loop-modal-*` tokens).
- [ ] Create Block `Modal` with inputs, events, a `Content` Placeholder (default slot) and a `Footer` Placeholder wrapped in a Container carrying the HTML attribute `slot="footer"` (see slot rules).
- [ ] Bind inputs directly on the element's attributes (booleans via `If(Flag, "true", "false")`, e.g. `no-icon` = `If(NoIcon, "true", "false")`); wire close/open CustomEvent listeners in a JS node.
- [ ] Create the reusable `ToggleModal` client action (resolves modal from a Block id) and call it from triggers.
- [ ] Test Medium + Small; test ESC, close button, backdrop click; test `static` + `no-backdrop-close`.
- [ ] Test with all slots populated and all slots empty (placeholder fallbacks).
- [ ] 1-Click Publish → validate in a **real browser** (Web Components never work in Service Studio Preview).
