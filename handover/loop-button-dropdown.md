# Handover — loop-button-dropdown (custom Web Component)

The Loop **Button Dropdown** — a button that opens a menu of actions.
Figma: "Button Dropdown" [node 15597-3469].

**Approach:** Per review, the dropdown is **custom**, not a native OutSystems button.
Built as a vanilla JS Web Component (CLAUDE.md hard rule #6 — no Lit/Stencil/React),
wrapped in an OutSystems Block. The trigger reuses the loop/button spec; the menu is
a shadow-DOM popover.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Button Dropdown page.

**What it is.** A button that opens a menu of related actions (custom Web Component + Block).

**When to use**
- One trigger that reveals several related actions — overflow / "More" menus, row actions, grouped action sets.

**When not to use** (reach for instead)
- Selecting a **value** from a list → **Dropdown / Select**.
- A single action → **Button**.
- Page/section navigation → the Layout Top header menu.

**How to use**
- Drop the **ButtonDropdown** Block; provide the menu items. Keyboard and focus are handled by the component. Script Include = When invoked.

## Files
| File | OutSystems destination |
|---|---|
| `src/components/loop-button-dropdown.js` | Script resource (Theme/Library), Include = When invoked |
| `src/components/loop-button-dropdown.css` | Source of the shadow styles (edit here, mirror into `render()`) |
| Block: `ButtonDropdown` | Patterns Library |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-button-dropdown.js</code> → Script resource (Theme/Library), Include = When invoked</summary>

```js
/**
 * <loop-button-dropdown>  —  Button that opens a menu of actions/options.
 *
 * An L5 custom Web Component (CLAUDE.md hard rule #6: vanilla JS only). OutSystems UI
 * has no native "button dropdown" pattern that matches The Loop's design, so it is
 * built from scratch. The trigger reuses the loop/button spec (pill, Open Sans 700,
 * blue-70 primary / outlined secondary, 18px chevron). Menu styling is in
 * loop-button-dropdown.css (mirrored into the <style> below).
 *
 * Figma: "Button Dropdown" [node:15597-3469].
 *
 * Attributes:
 *   label     (Text)    trigger label
 *   options   (Text)    JSON array of {value,label}, e.g. '[{"value":"edit","label":"Edit"}]'
 *   variant   (Text)    "primary" (default) | "secondary"
 *   open      (Boolean) reflects menu open state
 *   disabled  (Boolean) disables the whole control
 * Properties: options (get/set), value-less (menu is action-style)
 * Events:
 *   select  -> detail: { value, label }   fired when a menu item is chosen (composed, bubbles)
 *   toggle  -> detail: { open }            fired when the menu opens/closes
 *
 * Usage in OutSystems:
 *   <loop-button-dropdown label="Actions"
 *     options='[{"value":"edit","label":"Edit"},{"value":"del","label":"Delete"}]'>
 *   </loop-button-dropdown>
 *
 * Accessibility: WCAG 2.2 AA. Menu-button pattern — trigger aria-haspopup="menu"
 *   + aria-expanded; role=menu / role=menuitem; ArrowUp/Down/Home/End nav, Escape
 *   closes + returns focus to the trigger; click-outside closes; focus ring in the
 *   design's own brand color.
 */
class LoopButtonDropdown extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'options', 'variant', 'open', 'disabled'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onClick = this._onClick.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this._onDocPointer = this._onDocPointer.bind(this);
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.addEventListener('click', this._onClick);
    this.shadowRoot.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this._onClick);
    this.shadowRoot.removeEventListener('keydown', this._onKeydown);
    document.removeEventListener('pointerdown', this._onDocPointer, true);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'open') {
      this._syncOpen();
    } else {
      this.render();
    }
  }

  /* ---- Public API ---- */
  get options() {
    try { return JSON.parse(this.getAttribute('options') || '[]'); }
    catch { return []; }
  }
  set options(arr) { this.setAttribute('options', JSON.stringify(arr || [])); }

  get open() { return this.hasAttribute('open'); }
  set open(v) { v ? this.setAttribute('open', '') : this.removeAttribute('open'); }

  /* ---- Internal ---- */
  _toggle(force) {
    if (this.hasAttribute('disabled')) return;
    const next = typeof force === 'boolean' ? force : !this.open;
    this.open = next;                 // reflected → _syncOpen via attributeChangedCallback
  }

  _syncOpen() {
    const menu = this.shadowRoot.querySelector('.lbd__menu');
    const trigger = this.shadowRoot.querySelector('.lbd__trigger');
    if (!menu || !trigger) return;
    const open = this.open;
    menu.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));

    if (open) {
      document.addEventListener('pointerdown', this._onDocPointer, true);
      const first = menu.querySelector('[role="menuitem"]');
      if (first) first.focus();
    } else {
      document.removeEventListener('pointerdown', this._onDocPointer, true);
    }
    this._emit('toggle', { open });
  }

  _onClick(e) {
    const trigger = e.target.closest('.lbd__trigger');
    if (trigger) { this._toggle(); return; }

    const item = e.target.closest('[role="menuitem"]');
    if (item) {
      this._emit('select', { value: item.dataset.value, label: item.textContent.trim() });
      this._toggle(false);
      this.shadowRoot.querySelector('.lbd__trigger')?.focus();
    }
  }

  _onKeydown(e) {
    const trigger = e.target.closest('.lbd__trigger');

    // Open from the trigger with Down/Enter/Space
    if (trigger && !this.open && ['ArrowDown', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      this._toggle(true);
      return;
    }
    if (!this.open) return;

    const items = [...this.shadowRoot.querySelectorAll('[role="menuitem"]')];
    if (!items.length) return;
    const idx = items.indexOf(this.shadowRoot.activeElement);

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this._toggle(false);
        this.shadowRoot.querySelector('.lbd__trigger')?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        items[(idx + 1) % items.length].focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        items[(idx - 1 + items.length) % items.length].focus();
        break;
      case 'Home':
        e.preventDefault();
        items[0].focus();
        break;
      case 'End':
        e.preventDefault();
        items[items.length - 1].focus();
        break;
      default:
        break;
    }
  }

  _onDocPointer(e) {
    // composedPath lets us detect clicks inside our shadow tree
    if (!e.composedPath().includes(this)) this._toggle(false);
  }

  _emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  render() {
    const label = this.getAttribute('label') || '';
    const opts = this.options;
    const disabled = this.hasAttribute('disabled');
    const open = this.open;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          --lbd-radius:      var(--radius-pill, 32px);
          --lbd-pad-y:       var(--space-small, 16px);
          --lbd-pad-x:       var(--space-medium, 32px);
          --lbd-gap:         var(--space-button-gap, 6px);
          --lbd-font:        var(--font-family-label, "Open Sans", system-ui, sans-serif);
          --lbd-weight:      var(--font-weight-bold, 700);
          --lbd-size:        var(--font-size-300, 16px);
          --lbd-tracking:    var(--letter-spacing-button, -0.5px);
          --lbd-primary-bg:  var(--color-bg-link-primary-enabled, #004370);
          --lbd-primary-fg:  var(--color-white, #ffffff);
          --lbd-outline:     var(--color-outline-on-light-link-enabled, #004370);
          --lbd-link-fg:     var(--color-text-on-light-link-primary-enabled, #004370);
          --lbd-menu-bg:     var(--color-white, #ffffff);
          --lbd-menu-radius: var(--radius-medium, 8px);
          --lbd-menu-shadow: var(--shadow-regular, 0 4px 12px rgba(0,13,26,.16));
          --lbd-item-fg:     var(--color-text-on-light-default, #000d1ab2);
          --lbd-item-hover:  var(--color-neutral-05, #f5f7f9);
          --lbd-item-pad-y:  var(--space-xxsmall, 8px);
          --lbd-item-pad-x:  var(--space-small, 16px);
          --lbd-focus:       var(--color-outline-on-light-link-enabled, #004370);
        }
        :host([disabled]) { opacity: .5; pointer-events: none; }
        .lbd__trigger {
          display: inline-flex; align-items: center; justify-content: center;
          gap: var(--lbd-gap); min-height: 56px;
          padding: var(--lbd-pad-y) var(--lbd-pad-x);
          border: 1px solid transparent; border-radius: var(--lbd-radius);
          font-family: var(--lbd-font); font-weight: var(--lbd-weight);
          font-size: var(--lbd-size); line-height: 1.5; letter-spacing: var(--lbd-tracking);
          cursor: pointer; transition: background-color 120ms ease, border-color 120ms ease;
          background-color: var(--lbd-primary-bg); color: var(--lbd-primary-fg);
        }
        :host([variant="secondary"]) .lbd__trigger {
          background-color: transparent; border-color: var(--lbd-outline); color: var(--lbd-link-fg);
        }
        .lbd__icon { width: 18px; height: 18px; flex: 0 0 auto; transition: transform 120ms ease; }
        :host([open]) .lbd__icon { transform: rotate(180deg); }
        .lbd__menu {
          position: absolute; top: calc(100% + var(--space-tiny, 4px)); left: 0;
          min-width: 100%; margin: 0; padding: var(--space-tiny, 4px); list-style: none;
          background: var(--lbd-menu-bg); border-radius: var(--lbd-menu-radius);
          box-shadow: var(--lbd-menu-shadow); z-index: 10;
        }
        .lbd__menu[hidden] { display: none; }
        .lbd__item {
          display: block; width: 100%; text-align: left;
          padding: var(--lbd-item-pad-y) var(--lbd-item-pad-x); min-height: 44px;
          border: 0; border-radius: var(--radius-base, 4px); background: transparent;
          color: var(--lbd-item-fg); font-family: var(--lbd-font); font-size: var(--lbd-size);
          cursor: pointer; white-space: nowrap;
        }
        .lbd__item:hover, .lbd__item:focus-visible { background: var(--lbd-item-hover); }
        .lbd__item:focus-visible { outline: 2px solid var(--lbd-focus); outline-offset: -2px; }
        .lbd__trigger:focus-visible { outline: 2px solid var(--lbd-focus); outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .lbd__trigger, .lbd__icon { transition: none; } }
      </style>

      <button type="button" class="lbd__trigger"
              aria-haspopup="menu" aria-expanded="${open}" ${disabled ? 'disabled' : ''}>
        <span class="lbd__label">${label}</span>
        <svg class="lbd__icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <ul class="lbd__menu" role="menu" ${open ? '' : 'hidden'}>
        ${opts.map(o => `
          <li role="none">
            <button type="button" class="lbd__item" role="menuitem" tabindex="-1"
                    data-value="${o.value}">${o.label}</button>
          </li>`).join('')}
      </ul>
    `;
  }
}

// Guard against multiple registrations (OutSystems may load the script more than once)
if (!customElements.get('loop-button-dropdown')) {
  customElements.define('loop-button-dropdown', LoopButtonDropdown);
}
```

</details>

























## API
- **Attributes:** `label`, `options` (JSON `[{value,label}]`), `variant` (`primary`|`secondary`), `open`, `disabled`
- **Events:** `select` → `{ value, label }`; `toggle` → `{ open }`

## Accessibility (WCAG 2.2 AA)
Menu-button pattern: trigger `aria-haspopup="menu"` + `aria-expanded`; `role=menu`/`menuitem`;
ArrowUp/Down/Home/End nav; Escape closes + returns focus to trigger; click-outside closes;
44px item target size; brand-blue focus ring.

## Inferred values (no Figma token)
The trigger is fully tokenised (blue-70, pill, Open Sans 700, 18px chevron). The **menu/popover
detail is not tokenised in Figma**, so menu radius (`--radius-medium`), shadow (`--shadow-regular`),
item padding and hover (`--color-neutral-05`) are **derived from foundation tokens** — confirm
against the Figma menu spec when available.

## Checklist
- [ ] Import `loop-button-dropdown.js` as a Script resource (Include = When invoked).
- [ ] Create Block `ButtonDropdown`: inputs `Label`, `Options`, `Variant`, `Disabled`; events `OnSelect`, `OnToggle`; OnReady wiring `select` → `OnSelect(e.detail.value)`.
- [ ] 1-Click Publish → validate in a **real browser** (Web Components never work in Service Studio Preview).

## Open findings linked to this work
- (none yet) — menu styling derived from foundation tokens pending detailed Figma menu spec.
