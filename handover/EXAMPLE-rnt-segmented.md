# Handover — rnt-segmented + rnt-button

Generated code ready to add into OutSystems. (Example body for a handover Task.)

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/rnt-button.css` | Theme CSS (or Block CSS) |
| `src/components/rnt-segmented.js` | Script resource (Theme Library), Include = When invoked |
| `src/components/rnt-segmented.css` | Source of the shadow styles (embedded in the .js — edit here, sync into render()) |
| Block: `Segmented` | Patterns Library |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>rnt-segmented.js</code> → Script resource (Theme Library), Include = When invoked</summary>

```js
/**
 * <rnt-segmented>  —  Segmented control (single-select toggle group)
 *
 * An L5 custom Web Component: no OutSystems UI pattern matches a true
 * roving-tabindex segmented control, so it is built from scratch.
 *
 * Attributes:
 *   value     (Text)    currently selected option value
 *   options   (Text)    JSON array of {value,label}, e.g. '[{"value":"d","label":"Day"}]'
 *   size      (Text)    "" | "large"   (maps to the design's Size input parameter)
 *   disabled  (Boolean) presence disables the whole control
 * Properties: value (get/set), options (get/set)
 * Events:
 *   change  -> detail: { value }   fired on user selection (composed, bubbles)
 * Slots: none (options are data-driven)
 *
 * Usage in OutSystems:
 *   <rnt-segmented value="day" options='[{"value":"day","label":"Day"},{"value":"week","label":"Week"}]'></rnt-segmented>
 *
 * Accessibility: WCAG 2.2 AA. role=radiogroup / role=radio, roving tabindex,
 *   Arrow/Home/End keyboard nav, focus ring in the design's own brand color.
 */
class RntSegmented extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'options', 'size', 'disabled'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onKeydown = this._onKeydown.bind(this);
    this._onClick = this._onClick.bind(this);
  }

  connectedCallback() {
    this.render();
    this._attachEventListeners();
  }

  disconnectedCallback() {
    this._removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  /* ---- Public API (callable from OutSystems Client Actions) ---- */
  get value() { return this.getAttribute('value') || ''; }
  set value(v) { this.setAttribute('value', v); }

  get options() {
    try { return JSON.parse(this.getAttribute('options') || '[]'); }
    catch { return []; }
  }
  set options(arr) { this.setAttribute('options', JSON.stringify(arr || [])); }

  /* ---- Internal ---- */
  _select(value, { emit = true } = {}) {
    if (this.hasAttribute('disabled') || value === this.value) return;
    this.value = value; // triggers re-render via attributeChangedCallback
    if (emit) this._emit('change', { value });
  }

  _onClick(e) {
    const btn = e.target.closest('[role="radio"]');
    if (btn) this._select(btn.dataset.value);
  }

  _onKeydown(e) {
    const opts = this.options;
    if (!opts.length) return;
    let idx = opts.findIndex(o => o.value === this.value);
    if (idx < 0) idx = 0;

    let next = null;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown': next = (idx + 1) % opts.length; break;
      case 'ArrowLeft':
      case 'ArrowUp':   next = (idx - 1 + opts.length) % opts.length; break;
      case 'Home':      next = 0; break;
      case 'End':       next = opts.length - 1; break;
      default: return;
    }
    e.preventDefault();
    this._select(opts[next].value);
    const el = this.shadowRoot.querySelector(`[data-value="${opts[next].value}"]`);
    if (el) el.focus();
  }

  _attachEventListeners() {
    this.shadowRoot.addEventListener('click', this._onClick);
    this.shadowRoot.addEventListener('keydown', this._onKeydown);
  }

  _removeEventListeners() {
    this.shadowRoot.removeEventListener('click', this._onClick);
    this.shadowRoot.removeEventListener('keydown', this._onKeydown);
  }

  _emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  render() {
    const opts = this.options;
    const current = this.value;
    const disabled = this.hasAttribute('disabled');

    // Styles are the same source kept in rnt-segmented.css (embedded here so the
    // component ships as a single drop-in .js with no build step).
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          /* Fallback chain: OutSystems Theme token -> sensible default */
          --rnt-seg-bg:        var(--color-neutral-1, #F1F5F9);
          --rnt-seg-fg:        var(--color-neutral-9, #1E293B);
          --rnt-seg-sel-bg:    var(--color-neutral-0, #FFFFFF);
          --rnt-seg-accent:    var(--color-primary, #1A73E8);
          --rnt-seg-radius:    var(--border-radius-soft, 6px);
          --rnt-seg-pad-y:     var(--space-xs, 4px);
          --rnt-seg-pad-x:     var(--space-m, 16px);
          --rnt-seg-font:      var(--font-family-base, system-ui, sans-serif);
        }
        :host([disabled]) { opacity: 0.5; pointer-events: none; }

        .rnt-segmented {
          display: inline-flex;
          gap: var(--space-xs, 4px);
          padding: var(--space-xs, 4px);
          background: var(--rnt-seg-bg);
          border-radius: var(--rnt-seg-radius);
          font-family: var(--rnt-seg-font);
        }

        .rnt-segmented__option {
          min-height: 44px;               /* WCAG 2.2 target size */
          padding: var(--rnt-seg-pad-y) var(--rnt-seg-pad-x);
          border: none;
          border-radius: calc(var(--rnt-seg-radius) - 2px);
          background: transparent;
          color: var(--rnt-seg-fg);
          font: inherit;
          cursor: pointer;
          transition: background-color 120ms ease;
        }
        .rnt-segmented__option--is-selected {
          background: var(--rnt-seg-sel-bg);
          font-weight: var(--font-weight-medium, 600);
          box-shadow: 0 1px 2px rgba(0,0,0,0.12);
        }
        .rnt-segmented__option:focus-visible {
          outline: 2px solid var(--rnt-seg-accent);   /* design's own color */
          outline-offset: 2px;
        }

        /* size="large" — maps to the design's Size input parameter */
        :host([size="large"]) .rnt-segmented__option {
          min-height: 52px;
          padding: var(--space-s, 8px) var(--space-l, 24px);
          font-size: var(--font-size-l, 20px);
        }

        @media (prefers-reduced-motion: reduce) {
          .rnt-segmented__option { transition: none; }
        }
      </style>

      <div class="rnt-segmented" role="radiogroup" aria-disabled="${disabled}">
        ${opts.map(o => {
          const selected = o.value === current;
          return `<button
            type="button"
            class="rnt-segmented__option${selected ? ' rnt-segmented__option--is-selected' : ''}"
            role="radio"
            aria-checked="${selected}"
            data-value="${o.value}"
            tabindex="${selected ? '0' : '-1'}"
          >${o.label}</button>`;
        }).join('')}
      </div>
    `;

    // Ensure at least one option is focusable if nothing is selected yet
    if (!opts.some(o => o.value === current)) {
      const first = this.shadowRoot.querySelector('[role="radio"]');
      if (first) first.tabIndex = 0;
    }
  }
}

// Guard against multiple registrations (OutSystems may load the script more than once)
if (!customElements.get('rnt-segmented')) {
  customElements.define('rnt-segmented', RntSegmented);
}
```

</details>

## Event wiring (OnReady / OnDestroy)

> The component's CustomEvents are wired in the Block's **OnReady** and cleaned up in
> **OnDestroy** — the declarative "Handle Events" path is unreliable for custom elements.
> Give the `<rnt-segmented>` element (or its wrapping Block) a **Name** and pass its
> platform-generated `.Id` to each "Run JavaScript" node as `WidgetId`. Paste these two
> blocks verbatim — they store each handler on `$public` so OnDestroy removes it by
> reference. (If your ODC version doesn't persist `$public` across OnReady/OnDestroy,
> stash the handlers on the element instead — `el._loopHandlers = { … }`.)

| CustomEvent | raises Block event |
|---|---|
| `change` | `OnChange(e.detail.value)` |

**OnReady** — resolve the element, attach listeners, stash for cleanup:

```js
// Block OnReady — "Run JavaScript" node. Input: WidgetId = <ElementName>.Id
var root = document.getElementById($parameters.WidgetId);
var el = (root && root.tagName && root.tagName.toLowerCase() === 'rnt-segmented')
  ? root : (root ? root.querySelector('rnt-segmented') : null);
if (el) {
  $public.el = el;                       // stash for OnDestroy cleanup
  $public.handleChange = function (e) { $actions.OnChange(e.detail.value); };
  el.addEventListener('change', $public.handleChange);
}
```

**OnDestroy** — remove the listeners:

```js
// Block OnDestroy — "Run JavaScript" node. Uses the reference stashed in OnReady.
if ($public.el) {
  $public.el.removeEventListener('change', $public.handleChange);
}
```

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, wire up an OutSystems Block that wraps the already-imported custom
Web Component <rnt-segmented> for the WBG "The Loop" design system.

Context (already done manually — do NOT re-create or edit these):
- dist/theme.css and any block CSS are already pasted into the ODC Theme editor.
- rnt-segmented.js is already imported as a Script resource (Theme Library), Include = When invoked. It defines the custom element <rnt-segmented>.
- Do NOT write CSS, author/modify JavaScript, or edit the Theme. Your job is only the
  Block, its inputs/events, the attribute bindings, the event wiring, and any Client
  Actions that drive it.

Task — reference every element by the exact name given. Take the exact inputs, attribute
bindings, events and any global helper from this handover's "API — Attributes / Methods /
Events" tables (paste the relevant table into the chat so I work from real names):

1. Create a Block named "EXAMPLERntSegmented". Add one input per attribute (use the documented
   default) and one event per CustomEvent. Model enumerable attributes (variant / type /
   size / position / status) as Static Entities — one record per allowed value, with a
   single Text attribute (e.g. "Value") set as the record Identifier (delete the default
   Id/Label/Order/Is_Active) holding the literal the component expects — not free Text;
   keep free-form text as Text and flags as Boolean. Do NOT add a string Id input or set
   the element's id; OutSystems generates ids at runtime (see step 4).
2. Place <rnt-segmented> in the Block. Bind each attribute to its input with a Value expression
   (ODC requires one on every attribute). Static-Entity inputs bind directly (e.g.
   type = Type) since their Value attribute is the identifier; Booleans use
   If(Flag, "true", "false") — not presence.
3. Wire each CustomEvent to its Block event in the Block's OnReady (attach) and OnDestroy
   (remove) — not via the declarative "Handle Events" path, which is unreliable for custom
   elements. Add a "Run JavaScript" node in OnReady that resolves the <rnt-segmented>,
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
- [ ] Paste `rnt-button.css` into Theme CSS; set Button `ExtendedClass = "rnt-button rnt-button--primary"`
- [ ] Import `rnt-segmented.js` as a Script resource
- [ ] Create Block `Segmented`: inputs `Value`, `Options`, `Size`, `Disabled`; event `OnChange`; OnReady listener wiring `change` -> `OnChange(e.detail.value)`
- [ ] 1-Click Publish -> validate in browser at phone/tablet/desktop (never Service Studio Preview for Web Components)

## Open findings linked to this work
- (none) / FND-xxx ...
