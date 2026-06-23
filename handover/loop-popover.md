# Handover — loop-popover (custom Web Component)

The Loop **Popover** — floating contextual panel anchored to a trigger element.
Figma: "Popover" [node 26345-2762].

**Approach:** Custom component, no native OutSystems widget equivalent. Built as a
vanilla JS Web Component (Shadow DOM) wrapped in an OutSystems Block. Four pointer
positions plus none; optional title header with dismiss button; default width 320px.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Popover page.

**What it is.** A floating contextual panel anchored to a trigger (Web Component), with a pointer position and optional title/dismiss.

**When to use**
- Reveal extra content or actions **on demand**, anchored to a control — info panels, small forms, secondary content.

**When not to use** (reach for instead)
- A short text hint → **Tooltip**.
- A menu of actions → **Button Dropdown**.
- A page-level banner → **System Alert**.
- A persistent inline notice → **Note**.

**How to use**
- Drop the **Popover** Block; set the pointer position, optional title/dismiss, default 320px width. Script Include = When invoked.

## Files
| File | OutSystems destination |
|---|---|
| `src/components/loop-popover.js` | Script resource (Theme/Library), Include = **When invoked** |
| `src/components/loop-popover.css` | CSS reference only — styles are embedded in the `.js` Shadow DOM |
| `tokens/component-popover.css` | Included automatically in `dist/theme.css` |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-popover.js</code> → Script resource (Theme/Library), Include = When invoked</summary>

```js
/**
 * <loop-popover> — Floating contextual information panel with optional pointer.
 *
 * Figma: "Popover" [node:26345-2762]. Custom Web Component — no native OS widget.
 * Displays supplementary content in a floating white card. Four pointer positions
 * (top/bottom/left/right) plus none; optional title header with dismiss button.
 *
 * Attributes:
 *   pointer     "top" | "bottom" | "left" | "right" | "none"  (default: "bottom")
 *   title       Optional title text (14px Bold, separator below)
 *   has-dismiss Boolean — show × close button in header
 *   open        Boolean — visible; omit to hide
 *
 * Events (bubbles, composed):
 *   close — fired when dismiss button clicked or Escape pressed; detail: {}
 *
 * Slots:
 *   (default) — body content; styled at 12px Regular. The OutSystems Block places
 *               its Expression/Text widgets here.
 *
 * Accessibility: role="dialog" aria-modal="false"; title linked via aria-labelledby;
 * dismiss has aria-label; Escape key closes; focus ring uses brand blue (--loop-popover-focus).
 *
 * Pointer triangle is an inline SVG (18×8px, upward-pointing base shape) rotated per
 * position. Fill inherits --loop-popover-bg so it blends with the popover body.
 *
 * OutSystems: drop loop-popover.js into Resources. In a Block, wrap a trigger and this
 * element in a positioned Container. Toggle the "open" attribute to show/hide:
 *   document.querySelector('loop-popover').toggleAttribute('open');
 */
class LoopPopover extends HTMLElement {
  static get observedAttributes() {
    return ['pointer', 'title', 'has-dismiss', 'open'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onDismiss = this._onDismiss.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
  }

  connectedCallback() {
    this._render();
    document.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._onKeydown);
  }

  attributeChangedCallback(n, o, v) { if (o !== v) this._render(); }

  get _pointer()    { return this.getAttribute('pointer') || 'bottom'; }
  get _title()      { return this.getAttribute('title') || ''; }
  get _hasDismiss() { return this.hasAttribute('has-dismiss'); }
  get _isOpen()     { return this.hasAttribute('open'); }

  _onDismiss() {
    this.removeAttribute('open');
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true, detail: {} }));
  }

  _onKeydown(e) {
    if (e.key === 'Escape' && this._isOpen) this._onDismiss();
  }

  /* Pointer SVG: upward-pointing triangle (18×8), rotated per position.
   * The pointer is a filled triangle that matches the popover background. */
  _pointerSvg(position) {
    const deg = { top: 0, bottom: 180, left: 270, right: 90 }[position] ?? 180;
    return `<svg class="lpo__pointer-svg" viewBox="0 0 18 8" width="18" height="8"
      aria-hidden="true" style="transform:rotate(${deg}deg);display:block">
      <path d="M0,8 L9,0 L18,8 Z"/>
    </svg>`;
  }

  _render() {
    const pointer    = this._pointer;
    const title      = this._title;
    const hasDismiss = this._hasDismiss;
    const hasHeader  = title || hasDismiss;
    const hasPointer = pointer !== 'none';
    const titleId    = `lpo-title-${this.id || Math.random().toString(36).slice(2, 7)}`;

    const headerHtml = hasHeader ? `
      <div class="lpo__header" part="header">
        ${title ? `<p class="lpo__title" id="${titleId}" part="title">${title}</p>` : ''}
        ${hasDismiss ? `<button class="lpo__dismiss" type="button" aria-label="Close popover" part="dismiss">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>` : ''}
      </div>` : '';

    const bodyHtml = `
      <div class="lpo__body" part="body">
        ${headerHtml}
        <div class="lpo__slot-wrap" part="content"><slot></slot></div>
      </div>`;

    const pointerHtml = hasPointer
      ? `<div class="lpo__pointer-wrap lpo__pointer-wrap--${pointer}">${this._pointerSvg(pointer)}</div>`
      : '';

    /* For top/left pointer: pointer renders first (before body) via CSS order:-1.
     * For bottom/right: pointer renders after body (default DOM order). */
    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="lpo lpo--${pointer}"
           role="dialog"
           aria-modal="false"
           ${title ? `aria-labelledby="${titleId}"` : ''}
           part="popover">
        ${bodyHtml}
        ${pointerHtml}
      </div>`;

    if (hasDismiss) {
      this.shadowRoot.querySelector('.lpo__dismiss')?.addEventListener('click', this._onDismiss);
    }
  }

  _css() {
    return `
:host { display: inline-block; position: relative; }
:host(:not([open])) { display: none; }

.lpo {
  display: inline-flex;
  align-items: flex-start;
  width: var(--loop-popover-width, 320px);
}
.lpo--top, .lpo--bottom, .lpo--none { flex-direction: column; }
.lpo--left, .lpo--right             { flex-direction: row; }

.lpo__body {
  flex:          1 0 0;
  background:    var(--loop-popover-bg, #ffffff);
  border-radius: var(--loop-popover-radius, 4px);
  box-shadow:    var(--loop-popover-shadow, 0px 2px 3px rgba(0, 0, 0, 0.12));
  padding:       var(--loop-popover-padding-v, 16px) var(--loop-popover-padding-h, 16px);
  display:       flex;
  flex-direction: column;
  min-width:     0;
}

.lpo__header {
  display:         flex;
  align-items:     flex-start;
  justify-content: space-between;
  gap:             var(--space-xxsmall, 8px);
  padding-bottom:  var(--loop-popover-header-pb, 12px);
  border-bottom:   1px solid var(--loop-popover-divider-color, rgba(0, 57, 107, 0.16));
  margin-bottom:   var(--loop-popover-header-pb, 12px);
  width:           100%;
}

.lpo__title {
  flex:           1 0 0;
  margin:         0;
  font-family:    var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:      var(--loop-popover-title-size, 14px);
  font-weight:    var(--loop-popover-title-weight, 700);
  line-height:    var(--loop-popover-title-leading, 20px);
  letter-spacing: var(--loop-popover-title-tracking, 0.25px);
  color:          var(--loop-popover-title-color, rgba(0, 13, 26, 0.7));
}

.lpo__dismiss {
  flex-shrink: 0;
  display:     flex;
  align-items: flex-start;
  background:  none;
  border:      0;
  padding:     0;
  cursor:      pointer;
  color:       var(--loop-popover-dismiss-color, rgba(0, 13, 26, 0.7));
}
.lpo__dismiss:focus-visible {
  outline:        2px solid var(--loop-popover-focus, #0071bc);
  outline-offset: 2px;
  border-radius:  2px;
}

.lpo__slot-wrap { width: 100%; }
::slotted(*) {
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:   var(--loop-popover-body-size, 12px);
  font-weight: var(--loop-popover-body-weight, 400);
  line-height: var(--loop-popover-body-leading, 18px);
  color:       var(--loop-popover-body-color, rgba(0, 13, 26, 0.7));
  margin:      0;
}

.lpo__pointer-wrap {
  display:     flex;
  flex-shrink: 0;
  fill:        var(--loop-popover-bg, #ffffff);
  color:       var(--loop-popover-bg, #ffffff);
}

/* pointer: top — rendered before body, offset from left */
.lpo--top .lpo__pointer-wrap {
  align-self:   flex-start;
  padding-left: 24px;
  order:        -1;
}
/* pointer: bottom — rendered after body (default), offset from left */
.lpo--bottom .lpo__pointer-wrap {
  align-self:   flex-start;
  padding-left: 24px;
}
/* pointer: left — rendered before body, vertically centred */
.lpo--left .lpo__pointer-wrap {
  align-self: center;
  order:      -1;
}
/* pointer: right — rendered after body, vertically centred */
.lpo--right .lpo__pointer-wrap { align-self: center; }

@media (prefers-reduced-motion: reduce) { .lpo { transition: none; } }`;
  }
}

if (!customElements.get('loop-popover')) {
  customElements.define('loop-popover', LoopPopover);
}
```

</details>

























## API — Attributes
| Attribute | Values | Description |
|---|---|---|
| `pointer` | `top` \| `bottom` \| `left` \| `right` \| `none` | Pointer triangle position (default: `bottom`) |
| `title` | Text | Optional header title (14px Bold, with separator below) |
| `has-dismiss` | Boolean | Shows × close button in header |
| `open` | Boolean | Visible; omit/remove attribute to hide |

## API — Events
| Event | Detail | Description |
|---|---|---|
| `close` | `{}` | Fired when dismiss button clicked or Escape pressed |

## API — Slots
| Slot | Description |
|---|---|
| (default) | Body content — place Text/Expression/HTML widgets here (12px Regular) |

## Pointer positions explained
The pointer triangle (18×8px) visually connects the popover to the trigger:
- `pointer="top"` → triangle at top, popover placed **below** the trigger
- `pointer="bottom"` → triangle at bottom, popover placed **above** the trigger (default)
- `pointer="left"` → triangle at left, popover placed to the **right** of trigger
- `pointer="right"` → triangle at right, popover placed to the **left** of trigger
- `pointer="none"` → no triangle (tooltip-style floating panel)

## Example HTML
```html
<!-- Trigger button -->
<button id="info-trigger"
  onclick="document.getElementById('my-popover').toggleAttribute('open')"
  aria-controls="my-popover"
  aria-expanded="false">
  More info
</button>

<!-- Popover -->
<loop-popover id="my-popover" pointer="top" title="About this field" has-dismiss open>
  <p>This value determines the project priority level for reporting purposes.</p>
</loop-popover>
```

## CSS customisation
Override width on the host:
```css
#my-popover { --loop-popover-width: 280px; }
```

## OutSystems Block wiring
1. Create Block `Popover`: inputs `Pointer`, `Title`, `HasDismiss`, `Open`; event `OnClose`.
2. In OnReady, set attributes from inputs via JavaScript node.
3. Wire `close` CustomEvent → `OnClose`.
4. Use an OutSystems Placeholder for the default slot (body content).
5. Trigger show/hide by toggling the `open` attribute from the trigger's OnClick JavaScript node.

## Accessibility (WCAG 2.2 AA)
`role="dialog"` + `aria-modal="false"`; title linked via `aria-labelledby`; dismiss has
`aria-label="Close popover"`; Escape key fires `close` and removes `open` attribute;
focus ring uses `--loop-popover-focus` (brand blue `#0071bc`).
⚠️ Popover positioning relative to trigger is the Block author's responsibility —
the component renders in document flow. Use absolute/fixed positioning on the wrapping
Container to align with the trigger.

## Checklist
- [ ] Import `loop-popover.js` as Script resource, Include = When invoked.
- [ ] Rebuild `dist/theme.css` and paste into ODC Theme editor (includes `--loop-popover-*` tokens).
- [ ] Create Block `Popover` with inputs, event, and Placeholder for body above.
- [ ] Test all five pointer positions; test with/without title; test dismiss and Escape.
- [ ] Position the popover relative to the trigger using OutSystems layout tools.
- [ ] 1-Click Publish → validate in a **real browser** (Web Components never work in Service Studio Preview).
