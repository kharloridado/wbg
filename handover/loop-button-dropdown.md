# Handover — loop-button-dropdown (custom Web Component)

The Loop **Button Dropdown** — a split button: two half-pill buttons joined edge-to-edge,
each with its own independent action.
Figma: "Button Dropdown" [node 15597-3469].

**Re-validated 2026-06-29 (kharloridado review):** The Figma design is a SPLIT BUTTON,
not a single button + dropdown menu. Left half fires `action`; right half (chevron icon)
fires `toggle`. The host page wires each event to its own handler.

**Approach:** Vanilla JS Web Component (CLAUDE.md hard rule #6 — no Lit/Stencil/React),
wrapped in an OutSystems Block.

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
        /* FA chevron-down (solid) — 11px em box ≈ the 9px-wide, 1.8px-stroke chevron the
           Figma toggle draws inside its 18px icon box */
        .lbd__icon {
          width: 18px; height: 18px; flex: 0 0 auto;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-family-icon, "Font Awesome 6 Pro");
          font-weight: var(--font-weight-icon-solid, 900);
          font-size: var(--lbd-icon-glyph, 11px);
          font-style: normal;
          line-height: 1;
          -webkit-font-smoothing: antialiased;
        }

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
        <span class="lbd__icon" aria-hidden="true">&#xf078;</span>
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

## Event wiring (OnReady / OnDestroy)

> The component's CustomEvents are wired in the Block's **OnReady** and cleaned up in
> **OnDestroy** — the declarative "Handle Events" path is unreliable for custom elements.
> Give the `<loop-button-dropdown>` element (or its wrapping Block) a **Name** and pass its
> platform-generated `.Id` to each "Run JavaScript" node as `WidgetId`. Paste these two
> blocks verbatim — they store each handler on `$public` so OnDestroy removes it by
> reference. (If your ODC version doesn't persist `$public` across OnReady/OnDestroy,
> stash the handlers on the element instead — `el._loopHandlers = { … }`.)

| CustomEvent | raises Block event |
|---|---|
| `action` | `OnAction()` |
| `toggle` | `OnToggle()` |

**OnReady** — resolve the element, attach listeners, stash for cleanup:

```js
// Block OnReady — "Run JavaScript" node. Input: WidgetId = <ElementName>.Id
var root = document.getElementById($parameters.WidgetId);
var el = (root && root.tagName && root.tagName.toLowerCase() === 'loop-button-dropdown')
  ? root : (root ? root.querySelector('loop-button-dropdown') : null);
if (el) {
  $public.el = el;                       // stash for OnDestroy cleanup
  $public.handleAction = function (e) { $actions.OnAction(); };
  $public.handleToggle = function (e) { $actions.OnToggle(); };
  el.addEventListener('action', $public.handleAction);
  el.addEventListener('toggle', $public.handleToggle);
}
```

**OnDestroy** — remove the listeners:

```js
// Block OnDestroy — "Run JavaScript" node. Uses the reference stashed in OnReady.
if ($public.el) {
  $public.el.removeEventListener('action', $public.handleAction);
  $public.el.removeEventListener('toggle', $public.handleToggle);
}
```

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, wire up an OutSystems Block that wraps the already-imported custom
Web Component <loop-button-dropdown> for the WBG "The Loop" design system.

Context (already done manually — do NOT re-create or edit these):
- dist/tokens.css, dist/theme.css and any block CSS are already pasted into the ODC Theme editor.
- loop-button-dropdown.js is already imported as a Script resource (Theme/Library), Include = When invoked. It defines the custom element <loop-button-dropdown>.
- Do NOT write CSS, author/modify JavaScript, or edit the Theme. Your job is only the
  Block, its inputs/events, the attribute bindings, the event wiring, and any Client
  Actions that drive it.

Task — reference every element by the exact name given. Take the exact inputs, attribute
bindings, events and any global helper from this handover's "API — Attributes / Methods /
Events" tables (paste the relevant table into the chat so I work from real names):

1. Create a Block named "ButtonDropdown". Add one input per attribute (use the documented
   default) and one event per CustomEvent. Model enumerable attributes (variant / type /
   size / position / status) as Static Entities — one record per allowed value, with a
   single Text attribute (e.g. "Value") set as the record Identifier (delete the default
   Id/Label/Order/Is_Active) holding the literal the component expects — not free Text;
   keep free-form text as Text and flags as Boolean. Do NOT add a string Id input or set
   the element's id; OutSystems generates ids at runtime (see step 4).
2. Place <loop-button-dropdown> in the Block. Bind each attribute to its input with a Value expression
   (ODC requires one on every attribute). Static-Entity inputs bind directly (e.g.
   type = Type) since their Value attribute is the identifier; Booleans use
   If(Flag, "true", "false") — not presence.
3. Wire each CustomEvent to its Block event in the Block's OnReady (attach) and OnDestroy
   (remove) — not via the declarative "Handle Events" path, which is unreliable for custom
   elements. Add a "Run JavaScript" node in OnReady that resolves the <loop-button-dropdown>,
   addEventListener's each event (storing each handler on $public), and raises the Block
   event; add a second in OnDestroy that removeEventListener's them. Paste the verbatim
   OnReady + OnDestroy code from this handover's "## Event wiring (OnReady / OnDestroy)" section.
4. If the component exposes a global helper (see its API section), give the element/Block
   a Name and pass its platform-generated runtime .Id, e.g.
   window.LoopX.show($parameters.WidgetId) where the WidgetId input = <WidgetName>.Id.

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values (styling
comes from var(--token) in the Theme). After generating, list every element you created by
name and flag anything you could not finish.

Work iteratively: create the Block interface in step 1 and show it to me before wiring.
```

## Checklist
- [ ] Import `loop-button-dropdown.js` as a Script resource (Include = When invoked).
- [ ] Create Block `ButtonDropdown` with inputs and events as above.
- [ ] Wire the `action`/`toggle` CustomEvents in the Block's **OnReady** and remove them in **OnDestroy** — paste the code from the **Event wiring (OnReady / OnDestroy)** section.
- [ ] Wire `OnAction` to the page's primary action handler.
- [ ] Wire `OnToggle` to the page's secondary action handler (e.g., open a context panel).
- [ ] 1-Click Publish → validate in browser.

## Decision log
- **2026-06-29** — Re-validated from Figma [node 15597-3469] per @kharloridado review. Previous
  implementation was a single button + dropdown menu; Figma shows a split button (two independent
  half-pill buttons). Redesigned as split button with `action` + `toggle` events.

## Open findings linked to this work
- (none) — all four Figma type variants implemented faithfully.
