# Handover — loop-button-dropdown (custom Web Component)

The Loop **Button Dropdown** — a split button: two half-pill buttons joined edge-to-edge,
each with its own independent action.
Figma: "Button Dropdown" [node 15597-3469].

**Re-validated 2026-06-29 (kharloridado review):** The Figma design is a SPLIT BUTTON,
not a single button + dropdown menu. Left half fires `action`; right half (chevron icon)
fires `toggle`. The host page wires each event to its own handler.

**Approach:** Vanilla JS Web Component (CLAUDE.md hard rule #6 — no Lit/Stencil/React),
wrapped in an OutSystems Block.

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
 * <loop-button-dropdown>  —  Split button: two half-pill buttons sharing a pill outline.
 *
 * Re-validated 2026-06-29 against Figma [node:15597-3469] (kharloridado review).
 * Architecture: NOT a single button + dropdown menu. The Figma design is a SPLIT BUTTON —
 * two independent buttons joined at the edges. Left fires "action"; right fires "toggle".
 * The host container wires them to whatever behaviour the page needs.
 *
 * Figma: "Button Dropdown" [node:15597-3469].
 *
 * Attributes:
 *   label           (Text)    left button label (default "Button")
 *   type            (Text)    "primary" | "primary-secondary" | "secondary" | "ghost"
 *                             (default "primary") — maps to the Figma "type" prop
 *   disabled        (Boolean) disables both buttons
 *   action-disabled (Boolean) disables only the left (action) button
 *   toggle-disabled (Boolean) disables only the right (chevron) button
 *   toggle-label    (Text)    accessible label for the right button (default "Open options")
 *
 * Events (both bubble + composed):
 *   action  — left button clicked
 *   toggle  — right button (chevron) clicked
 *
 * Usage in OutSystems:
 *   <loop-button-dropdown label="Actions" type="primary-secondary">
 *   </loop-button-dropdown>
 *   // Wire: element.addEventListener('action', () => doMainAction())
 *   //        element.addEventListener('toggle', () => openSidePanel())
 *
 * Accessibility: WCAG 2.2 AA.
 *   Two independent focusable buttons. Right button gets aria-label from toggle-label
 *   attribute. Brand-blue focus ring. Reduced-motion guard.
 */
class LoopButtonDropdown extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'type', 'disabled', 'action-disabled', 'toggle-disabled', 'toggle-label'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onClick = this._onClick.bind(this);
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.addEventListener('click', this._onClick);
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this._onClick);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this.render();
  }

  _onClick(e) {
    const actionBtn = e.target.closest('.lbd__action');
    if (actionBtn && !actionBtn.disabled) {
      this.dispatchEvent(new CustomEvent('action', { bubbles: true, composed: true }));
      return;
    }
    const toggleBtn = e.target.closest('.lbd__toggle');
    if (toggleBtn && !toggleBtn.disabled) {
      this.dispatchEvent(new CustomEvent('toggle', { bubbles: true, composed: true }));
    }
  }

  render() {
    const label       = this.getAttribute('label') || 'Button';
    const type        = this.getAttribute('type') || 'primary';
    const toggleLabel = this.getAttribute('toggle-label') || 'Open options';
    const disabled    = this.hasAttribute('disabled');
    const actionDis   = disabled || this.hasAttribute('action-disabled');
    const toggleDis   = disabled || this.hasAttribute('toggle-disabled');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          align-items: stretch;
          gap: 1px;

          --lbd-radius:        var(--radius-pill, 32px);
          --lbd-gap:           var(--space-button-gap, 6px);
          --lbd-font:          var(--font-family-label, "Open Sans", system-ui, sans-serif);
          --lbd-weight:        var(--font-weight-bold, 700);
          --lbd-size:          var(--font-size-300, 16px);
          --lbd-lh:            var(--font-size-400, 24px);
          --lbd-tracking:      var(--letter-spacing-button, -0.5px);
          --lbd-pad-v:         var(--loop-btn-h-regular, 16px);
          --lbd-pad-h:         var(--space-medium, 32px);
          --lbd-icon-pad-v:    17px;
          --lbd-icon-pad-h:    19px;
          --lbd-primary-bg:    var(--color-bg-link-primary-enabled, #004370);
          --lbd-primary-fg:    var(--color-text-on-dark-link-primary-enabled, rgba(255,255,255,0.9));
          --lbd-primary-hover: var(--color-bg-link-primary-hover, #003358);
          --lbd-primary-dis:   var(--color-bg-link-primary-disabled, #8a9db1);
          --lbd-outline:       var(--color-outline-on-light-link-enabled, #004370);
          --lbd-link-fg:       var(--color-text-on-light-link-primary-enabled, #004370);
          --lbd-sec-hover:     var(--color-bg-link-secondary-hover, rgba(22,154,243,0.08));
          --lbd-ghost-hover:   var(--color-bg-link-tertiary-hover, rgba(0,67,112,0.06));
          --lbd-focus:         var(--color-outline-on-light-link-enabled, #004370);
        }
        :host([type="secondary"]) { gap: 0; }

        .lbd__action, .lbd__toggle {
          display: inline-flex; align-items: center; justify-content: center;
          margin: 0; border-style: solid; border-width: 1px; border-color: transparent;
          cursor: pointer;
          font-family: var(--lbd-font); font-weight: var(--lbd-weight);
          font-size: var(--lbd-size); line-height: var(--lbd-lh);
          letter-spacing: var(--lbd-tracking);
          transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
        }
        .lbd__action:focus-visible, .lbd__toggle:focus-visible {
          outline: 2px solid var(--lbd-focus);
          outline-offset: 2px;
          position: relative; z-index: 1;
        }
        @media (prefers-reduced-motion: reduce) {
          .lbd__action, .lbd__toggle { transition: none; }
        }

        .lbd__action {
          gap: var(--lbd-gap);
          padding: var(--lbd-pad-v) var(--lbd-pad-h);
          border-radius: var(--lbd-radius) 0 0 var(--lbd-radius);
        }
        .lbd__toggle {
          padding: var(--lbd-icon-pad-v) var(--lbd-icon-pad-h);
          border-radius: 0 var(--lbd-radius) var(--lbd-radius) 0;
        }
        .lbd__icon { width: 18px; height: 18px; flex: 0 0 auto; }

        /* Primary+Primary (default) */
        .lbd__action, .lbd__toggle {
          background-color: var(--lbd-primary-bg); color: var(--lbd-primary-fg);
        }
        .lbd__action:hover:not(:disabled), .lbd__toggle:hover:not(:disabled) {
          background-color: var(--lbd-primary-hover);
        }
        .lbd__action:disabled, .lbd__toggle:disabled {
          background-color: var(--lbd-primary-dis); cursor: default;
        }

        /* Primary+Secondary overrides on toggle */
        .lbd__toggle--secondary {
          background-color: transparent; color: var(--lbd-link-fg);
          border-width: 2px; border-color: var(--lbd-outline);
        }
        .lbd__toggle--secondary:hover:not(:disabled) {
          background-color: var(--lbd-sec-hover);
        }
        .lbd__toggle--secondary:disabled { opacity: 0.5; cursor: default; }

        /* Secondary+Secondary */
        .lbd__action--secondary, .lbd__toggle--secondary-full {
          background-color: transparent; color: var(--lbd-link-fg);
          border-width: 2px; border-color: var(--lbd-outline);
        }
        .lbd__action--secondary {
          margin-right: -1px; z-index: 0;
        }
        .lbd__action--secondary:hover:not(:disabled) {
          background-color: var(--lbd-sec-hover); z-index: 1;
        }
        .lbd__action--secondary:disabled, .lbd__toggle--secondary-full:disabled {
          opacity: 0.5; cursor: default;
        }
        .lbd__toggle--secondary-full {
          background-color: transparent; color: var(--lbd-link-fg);
          border-width: 2px; border-color: var(--lbd-outline);
        }
        .lbd__toggle--secondary-full:hover:not(:disabled) {
          background-color: var(--lbd-sec-hover);
        }

        /* Ghost */
        .lbd__action--ghost, .lbd__toggle--ghost {
          background-color: transparent; color: var(--lbd-link-fg);
          border-color: transparent;
        }
        .lbd__action--ghost:hover:not(:disabled), .lbd__toggle--ghost:hover:not(:disabled) {
          background-color: var(--lbd-ghost-hover);
        }
        .lbd__action--ghost:disabled, .lbd__toggle--ghost:disabled {
          opacity: 0.5; cursor: default;
        }
      </style>

      <button type="button"
              class="lbd__action${type === 'secondary' ? ' lbd__action--secondary' : type === 'ghost' ? ' lbd__action--ghost' : ''}"
              ${actionDis ? 'disabled' : ''}>${label}</button>
      <button type="button"
              class="lbd__toggle${type === 'primary-secondary' ? ' lbd__toggle--secondary' : type === 'secondary' ? ' lbd__toggle--secondary-full' : type === 'ghost' ? ' lbd__toggle--ghost' : ''}"
              aria-label="${toggleLabel}"
              ${toggleDis ? 'disabled' : ''}>
        <svg class="lbd__icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;
  }
}

if (!customElements.get('loop-button-dropdown')) {
  customElements.define('loop-button-dropdown', LoopButtonDropdown);
}
```

</details>

## API

| Attribute | Type | Default | Description |
|---|---|---|---|
| `label` | Text | `"Button"` | Left button text |
| `type` | Text | `"primary"` | `"primary"` \| `"primary-secondary"` \| `"secondary"` \| `"ghost"` |
| `disabled` | Boolean | — | Disables both buttons |
| `action-disabled` | Boolean | — | Disables left button only |
| `toggle-disabled` | Boolean | — | Disables right button only |
| `toggle-label` | Text | `"Open options"` | Accessible label for the right (icon) button |

**Events:** `action` (left clicked); `toggle` (right/chevron clicked). Both bubble + composed.

## Accessibility (WCAG 2.2 AA)
Two independent focusable tab stops. Right button has an explicit `aria-label`. Brand-blue
focus ring (`outline: 2px solid`, `outline-offset: 2px`). Reduced-motion guard on transitions.

## OutSystems Block wiring
- Block inputs: `Label` (Text), `Type` (Text), `Disabled` (Boolean), `ActionDisabled` (Boolean), `ToggleDisabled` (Boolean), `ToggleLabel` (Text)
- Block events: `OnAction`, `OnToggle`
- OnReady: wire `action` → `OnAction()` and `toggle` → `OnToggle()` via JS event listeners.
- 1-Click Publish → validate in a **real browser** (Web Components never work in Service Studio Preview).

## Checklist
- [ ] Import `loop-button-dropdown.js` as a Script resource (Include = When invoked).
- [ ] Create Block `ButtonDropdown` with inputs and events as above.
- [ ] Wire `OnAction` to the page's primary action handler.
- [ ] Wire `OnToggle` to the page's secondary action handler (e.g., open a context panel).
- [ ] 1-Click Publish → validate in browser.

## Decision log
- **2026-06-29** — Re-validated from Figma [node 15597-3469] per @kharloridado review. Previous
  implementation was a single button + dropdown menu; Figma shows a split button (two independent
  half-pill buttons). Redesigned as split button with `action` + `toggle` events.

## Open findings linked to this work
- (none) — all four Figma type variants implemented faithfully.
