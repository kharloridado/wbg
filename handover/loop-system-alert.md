# Handover — loop-system-alert (custom Web Component)

The Loop **System Alert** — full-width notification banner for page-level messages.
Figma: "System Alerts" [node 17873-7603].

**Approach:** Custom component, no native OutSystems widget equivalent. Built as a
vanilla JS Web Component (Shadow DOM) wrapped in an OutSystems Block. Four types;
single-line (centered) and multi-line layouts; built-in per-type icon (slot-overridable),
action link, dismiss button.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the System Alert page.

**What it is.** A full-width, page-level notification banner (Web Component), with four types, a built-in per-type icon, and optional action/dismiss.

**When to use**
- Page- or app-level messages that span the width — system status, success/error after an action, global warnings.

**When not to use** (reach for instead)
- An inline contextual note → **Note**.
- A transient hover hint → **Tooltip**.
- Field-level validation → the **Text Field** error state.

**How to use**
- Drop the **SystemAlert** Block; set the type, single/multi-line layout, and optional action/dismiss. A type icon shows by default (`hide-icon` to remove, or slot your own). Script Include = Always.

## Files
| File | OutSystems destination |
|---|---|
| `src/components/loop-system-alert.js` | Script resource (Theme/Library), Include = **Always** (banner is rendered on page load) |
| `src/components/loop-system-alert.css` | CSS reference only — styles are embedded in the `.js` Shadow DOM |
| `tokens/component-system-alert.css` | Included automatically in `dist/theme.css` |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-system-alert.js</code> → Script resource (Theme/Library), Include = Always</summary>

```js
/**
 * <loop-system-alert> — Full-width system notification banner.
 *
 * Figma: "System Alerts" [node:17873-7603]. Custom Web Component — no native OS widget.
 * Renders a full-width alert banner with a type icon, title, body text, action
 * link/button, and dismiss (×) button. Four semantic types; single-line and multi-line.
 *
 * Layout (per Figma):
 *   single-line — icon + title + message + action are a horizontally CENTERED group;
 *                 dismiss × pinned far right.
 *   multi-line  — icon top-left; title / message / action stacked left-aligned in a column;
 *                 dismiss × top-right.
 *
 * Attributes:
 *   type          "error" | "warning" | "informative" | "offline"  (default: "error")
 *   title         Optional bold title text (16px Bold)
 *   message       Alert body text (14px Regular)
 *   action-label  Optional action link/button label (14px Bold underline)
 *   action-href   If present, renders action as <a href>; otherwise fires "action" event
 *   dismissible   Boolean — shows × button; fires "dismiss" event + hides host
 *   multiline     Boolean — stacks title, message and action vertically (icon top-aligned)
 *   hide-icon     Boolean — hides the icon slot entirely
 *
 * Events (bubbles, composed):
 *   dismiss — fired when dismiss button clicked; detail: { type }
 *   action  — fired when action clicked without action-href; detail: { type }
 *
 * Slots:
 *   icon — overrides the built-in type icon, e.g. <img slot="icon" src="…" alt="">.
 *          When empty, a default type-specific 16×16 icon is shown (error/warning/info/offline).
 *
 * Accessibility: role="alert" (live region); dismiss has aria-label; Escape key does
 * nothing (the banner is page-level, not a modal); focus ring uses currentColor per
 * CLAUDE.md (no silent color substitution).
 *
 * OutSystems: drop loop-system-alert.js into Resources. In a Block, add an HTML element and
 * bind attributes declaratively from Block inputs — booleans are value-aware, so:
 *   dismissible = If(Dismissible, "true", "false")   multiline = If(Multiline, "true", "false")
 * ODC rewrites the attribute when the input changes; observedAttributes re-renders reactively.
 */
class LoopSystemAlert extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'title', 'message', 'action-label', 'action-href', 'dismissible', 'multiline', 'hide-icon'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onClick = this._onClick.bind(this);
  }

  connectedCallback() {
    this._render();
    this.shadowRoot.addEventListener('click', this._onClick);
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this._onClick);
  }

  attributeChangedCallback(n, o, v) {
    if (o === v) return;
    if (this.isConnected) this._render();
  }

  /* OutSystems binds booleans as If(Flag,"true","false") so hasAttribute() alone is
     insufficient — must treat "false" and "0" as falsy. */
  _boolAttr(name) {
    const v = this.getAttribute(name);
    if (v === null) return false;
    return v !== 'false' && v !== '0';
  }

  get _type()        { return this.getAttribute('type') || 'error'; }
  get _title()       { return this.getAttribute('title') || ''; }
  get _message()     { return this.getAttribute('message') || ''; }
  get _actionLabel() { return this.getAttribute('action-label') || ''; }
  get _actionHref()  { return this.getAttribute('action-href') || ''; }
  get _dismissible() { return this._boolAttr('dismissible'); }
  get _multiline()   { return this._boolAttr('multiline'); }
  get _hideIcon()    { return this._boolAttr('hide-icon'); }

  /* Single delegated listener on shadowRoot — survives innerHTML replacements in _render(). */
  _onClick(e) {
    if (e.target.closest('.lsa__dismiss')) {
      this.dispatchEvent(new CustomEvent('dismiss', { bubbles: true, composed: true, detail: { type: this._type } }));
      this.hidden = true;
      return;
    }
    const actionBtn = e.target.closest('.lsa__action');
    if (actionBtn && !this._actionHref) {
      this.dispatchEvent(new CustomEvent('action', { bubbles: true, composed: true, detail: { type: this._type } }));
    }
  }

  // Built-in type icon (Figma renders one per type). 16×16, stroke/fill currentColor so it
  // inherits the per-type icon color. Overridden by a slotted `slot="icon"` element.
  _defaultIcon(type) {
    const svg = (inner) =>
      `<svg class="lsa__icon" viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">${inner}</svg>`;
    switch (type) {
      case 'warning':
        return svg('<path d="M8 2.3 14.4 13.1H1.6L8 2.3Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><line x1="8" y1="6.4" x2="8" y2="9.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="11.3" r="0.8" fill="currentColor"/>');
      case 'informative':
        return svg('<circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="5" r="0.85" fill="currentColor"/><line x1="8" y1="7.2" x2="8" y2="11.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>');
      case 'offline':
        return svg('<path d="M2.6 6.3C5.6 3.6 10.4 3.6 13.4 6.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M4.9 8.7C6.7 7.1 9.3 7.1 11.1 8.7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="11.6" r="1" fill="currentColor"/>');
      case 'error':
      default:
        return svg('<circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><line x1="8" y1="4.5" x2="8" y2="8.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="11" r="0.85" fill="currentColor"/>');
    }
  }

  _render() {
    const t            = this._type;
    const multiline    = this._multiline;
    const title        = this._title;
    const message      = this._message;
    const actionLabel  = this._actionLabel;
    const actionHref   = this._actionHref;
    const dismissible  = this._dismissible;
    const hideIcon     = this._hideIcon;

    const actionHtml = actionLabel
      ? actionHref
        ? `<a class="lsa__action" href="${actionHref}">${actionLabel}</a>`
        : `<button class="lsa__action" type="button">${actionLabel}</button>`
      : '';

    const iconHtml = this._hideIcon
      ? ''
      : `<slot name="icon" class="lsa__icon-slot" part="icon">${this._defaultIcon(t)}</slot>`;

    const titleHtml   = title   ? `<span class="lsa__title">${title}</span>` : '';
    const messageHtml = message ? `<p class="lsa__message">${message}</p>`   : '';

    const dismissHtml = dismissible
      ? `<button class="lsa__dismiss" type="button" aria-label="Dismiss alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>`
      : '';

    const iconSlot = hideIcon ? '' : `<slot name="icon" class="lsa__icon-slot"></slot>`;

    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="lsa lsa--${t}${multiline ? ' lsa--multiline' : ''}" role="alert" part="alert">
        <div class="lsa__content" part="content">
          ${iconSlot}
          <div class="lsa__text" part="text">
            ${titleHtml}
            ${messageHtml}
            ${multiline ? actionHtml : ''}
          </div>
          ${multiline ? '' : actionHtml}
        </div>
        ${dismissHtml}
      </div>`;
  }

  _css() {
    return `
:host { display: block; width: 100%; }
:host([hidden]) { display: none; }

.lsa {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--loop-sysalert-gap, 8px);
  padding: var(--loop-sysalert-padding-v, 8px) var(--loop-sysalert-padding-h, 12px);
  min-width: var(--loop-sysalert-min-width, 280px);
}
.lsa--multiline {
  align-items: flex-start;
  min-width: var(--loop-sysalert-min-width-multiline, 230px);
}

.lsa--error       { background-color: var(--loop-sysalert-error-bg, #9d161d); }
.lsa--warning     { background-color: var(--loop-sysalert-warning-bg, #e19d00); }
.lsa--informative { background-color: var(--loop-sysalert-informative-bg, #004370); }
.lsa--offline     { background-color: var(--loop-sysalert-offline-bg, #8a9db1); }

/* single-line: icon + text + action centered as a group; multi-line: left-aligned row */
.lsa__content {
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--loop-sysalert-gap, 8px);
}
.lsa--multiline .lsa__content { align-items: flex-start; justify-content: flex-start; }

/* slot is transparent to flex so its content (default svg or slotted icon) is the flex item */
.lsa__icon-slot { display: contents; }
.lsa__icon { flex-shrink: 0; display: block; width: var(--loop-sysalert-icon-size, 16px); height: var(--loop-sysalert-icon-size, 16px); }
::slotted([slot="icon"]) {
  flex-shrink: 0;
  width: var(--loop-sysalert-icon-size, 16px);
  height: var(--loop-sysalert-icon-size, 16px);
}
.lsa--multiline .lsa__icon,
.lsa--multiline ::slotted([slot="icon"]) { margin-top: 2px; }

/* single-line: title+message inline (shrink, so the group can center) */
.lsa__text {
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: var(--space-tiny, 4px);
  flex-wrap: wrap;
}
.lsa--multiline .lsa__text {
  flex: 1 0 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}

.lsa__title {
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:   var(--loop-sysalert-title-size, 16px);
  font-weight: var(--font-weight-bold, 700);
  line-height: 1.5;
  white-space: nowrap;
  flex-shrink: 0;
}
.lsa__message {
  margin: 0;
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:   var(--loop-sysalert-body-size, 14px);
  font-weight: var(--font-weight-regular, 400);
  line-height: 1.25;
}

/* Per-element colors mirror Figma's distinct title / message / action / icon roles per type. */
.lsa--error       .lsa__icon,
.lsa--error       .lsa__dismiss { color: var(--loop-sysalert-error-icon, rgba(255, 255, 255, 0.75)); }
.lsa--warning     .lsa__icon,
.lsa--warning     .lsa__dismiss { color: var(--loop-sysalert-warning-icon, #473201); }
.lsa--informative .lsa__icon,
.lsa--informative .lsa__dismiss { color: var(--loop-sysalert-informative-icon, rgba(255, 255, 255, 0.75)); }
.lsa--offline     .lsa__icon,
.lsa--offline     .lsa__dismiss { color: var(--loop-sysalert-offline-icon, rgba(255, 255, 255, 0.75)); }

.lsa--error       .lsa__title { color: var(--loop-sysalert-error-title, rgba(255, 255, 255, 0.75)); }
.lsa--warning     .lsa__title { color: var(--loop-sysalert-warning-title, #473201); }
.lsa--informative .lsa__title { color: var(--loop-sysalert-informative-title, rgba(255, 255, 255, 0.75)); }
.lsa--offline     .lsa__title { color: var(--loop-sysalert-offline-title, rgba(255, 255, 255, 0.75)); }

.lsa--error       .lsa__message { color: var(--loop-sysalert-error-message, rgba(255, 255, 255, 0.75)); }
.lsa--warning     .lsa__message { color: var(--loop-sysalert-warning-message, #473201); }
.lsa--informative .lsa__message { color: var(--loop-sysalert-informative-message, #f6fcff); }
.lsa--offline     .lsa__message { color: var(--loop-sysalert-offline-message, rgba(255, 255, 255, 0.9)); }

.lsa__action {
  font-family:     var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:       var(--loop-sysalert-body-size, 14px);
  font-weight:     var(--font-weight-bold, 700);
  line-height:     1.25;
  text-decoration: underline;
  background:      none;
  border:          0;
  padding:         0;
  cursor:          pointer;
  white-space:     nowrap;
  flex-shrink:     0;
}
.lsa--multiline .lsa__action { height: var(--loop-sysalert-action-height, 42px); min-height: var(--loop-sysalert-action-height, 42px); margin-top: 0; display: flex; align-items: center; }

.lsa--error       .lsa__action { color: var(--loop-sysalert-error-action, #f5f7f9); }
.lsa--warning     .lsa__action { color: var(--loop-sysalert-warning-action, #473201); }
.lsa--informative .lsa__action { color: var(--loop-sysalert-informative-action, rgba(255, 255, 255, 0.9)); }
.lsa--offline     .lsa__action { color: var(--loop-sysalert-offline-action, rgba(255, 255, 255, 0.9)); }
.lsa__action:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; border-radius: 2px; }

.lsa__dismiss {
  flex-shrink: 0;
  display:     flex;
  align-items: center;
  justify-content: center;
  width:       var(--loop-sysalert-icon-size, 16px);
  height:      var(--loop-sysalert-icon-size, 16px);
  background:  none;
  border:      0;
  padding:     0;
  cursor:      pointer;
}
.lsa--multiline .lsa__dismiss { align-self: flex-start; margin-top: 2px; }
.lsa__dismiss:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; border-radius: 2px; }

@media (prefers-reduced-motion: reduce) {
  .lsa, .lsa__action, .lsa__dismiss { transition: none; }
}`;
  }
}

if (!customElements.get('loop-system-alert')) {
  customElements.define('loop-system-alert', LoopSystemAlert);
}
```

</details>

## API — Attributes
| Attribute | Values | Description |
|---|---|---|
| `type` | `error` \| `warning` \| `informative` \| `offline` | Alert variant (default: `error`) |
| `title` | Text | Optional bold title (16px Bold) |
| `message` | Text | Alert body text (14px) |
| `action-label` | Text | Optional action link/button label |
| `action-href` | URL | If set, action renders as `<a>`; if omitted, fires `action` event |
| `dismissible` | Boolean — `false`/`0`/absent = off | Shows × dismiss button |
| `multiline` | Boolean — `false`/`0`/absent = off | Stacks title + message + action vertically (icon top-aligned) |
| `hide-icon` | Boolean — `false`/`0`/absent = off | Suppresses the built-in type icon (Figma "leftIcon = false") |

## API — Events
| Event | Detail | Description |
|---|---|---|
| `dismiss` | `{ type }` | Fired when dismiss button clicked; component auto-hides |
| `action` | `{ type }` | Fired when action clicked without `action-href` |

## API — Slots
| Slot | Description |
|---|---|
| `icon` | Overrides the **built-in** type icon. Each type ships a default 16×16 icon (error / warning / info / offline); slot a `<img slot="icon" src="…" alt="">` or inline SVG to replace it, or set `hide-icon` to remove it. The default SVGs **approximate** the Figma glyphs — swap in the exact assets if design supplies them. |

## Example HTML
```html
<!-- Single-line, error, with action -->
<loop-system-alert
  type="error"
  title="Connection failed"
  message="Could not connect to the server."
  action-label="Retry"
  dismissible>
  <img slot="icon" src="icon-error.svg" alt="">
</loop-system-alert>

<!-- Multi-line, informative -->
<loop-system-alert
  type="informative"
  title="New update available"
  message="A new version of the application is available. Please save your work before updating."
  action-label="Update now"
  action-href="/update"
  multiline>
</loop-system-alert>
```

## OutSystems Block wiring
1. Create Block `SystemAlert`: inputs `Type`, `Title`, `Message`, `ActionLabel`, `ActionHref`, `Dismissible` (Boolean), `Multiline` (Boolean); events `OnDismiss`, `OnAction`.
2. On the `<loop-system-alert>` HTML element, add attributes bound to the inputs (ODC requires a Value expression on every attribute):
   - `type` → `Type`, `title` → `Title`, `message` → `Message`, `action-label` → `ActionLabel`, `action-href` → `ActionHref`
   - `dismissible` → `If(Dismissible, "true", "false")`
   - `multiline` → `If(Multiline, "true", "false")`
   - (optional) `hide-icon` → `If(HideIcon, "true", "false")` to suppress the built-in type icon
   The boolean attributes are **value-aware** (`"false"`/`"0"`/absent = off), so the `If(...)` expression works directly — no OnReady JavaScript node needed. ODC rewrites the attribute when the input changes and the component re-renders reactively (`observedAttributes`).
3. Wire `dismiss` CustomEvent → `OnDismiss`. Wire `action` CustomEvent → `OnAction`.

## Accessibility (WCAG 2.2 AA)
`role="alert"` = live region; screen readers announce on insertion. Dismiss has
`aria-label="Dismiss alert"`. Focus ring uses `currentColor` (visible on all four backgrounds).
⚠️ **Filed as FND-042 (a11y/contrast, high):** white text on the `offline` background (`#8a9db1`,
neutral-40) fails WCAG 2.2 SC 1.4.3 — title/icon/dismiss use white-75 (`--color-gray-alpha-white-75`
`#ffffffbf` ≈ **2.23:1**) and message/action use white-90 (`--color-gray-alpha-white-90`
`#ffffffe5` ≈ **2.6:1**), both below the 4.5:1 normal-text minimum and the 3:1 floor. Built
**as designed** (brand colors not re-shaded); disclosed only, per the fidelity-first rule.
⚠️ **FND-048 (consistency, low):** Figma assigns different message/action shades per layout for the
same type; normalized here to the single-line values. Both in `findings/findings-register.md`.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, wire up an OutSystems Block that wraps the already-imported custom
Web Component <loop-system-alert> for the WBG "The Loop" design system.

Context (already done manually — do NOT re-create or edit these):
- dist/theme.css and any block CSS are already pasted into the ODC Theme editor.
- loop-system-alert.js is already imported as a Script resource (Theme/Library), Include = Always. It defines the custom element <loop-system-alert>.
- Do NOT write CSS, author/modify JavaScript, or edit the Theme. Your job is only the
  Block, its inputs/events, the attribute bindings, the event wiring, and any Client
  Actions that drive it.

Task — reference every element by the exact name given. Take the exact inputs, attribute
bindings, events and any global helper from this handover's "API — Attributes / Methods /
Events" tables (paste the relevant table into the chat so I work from real names):

1. Create a Block named "SystemAlert". Add one input per attribute (use the documented
   default) and one event per CustomEvent. Model enumerable attributes (variant / type /
   size / position / status) as Static Entities — one record per allowed value, with a
   single Text attribute (e.g. "Value") set as the record Identifier (delete the default
   Id/Label/Order/Is_Active) holding the literal the component expects — not free Text;
   keep free-form text as Text and flags as Boolean. Do NOT add a string Id input or set
   the element's id; OutSystems generates ids at runtime (see step 4).
2. Place <loop-system-alert> in the Block. Bind each attribute to its input with a Value expression
   (ODC requires one on every attribute). Static-Entity inputs bind directly (e.g.
   type = Type) since their Value attribute is the identifier; Booleans use
   If(Flag, "true", "false") — not presence.
3. Wire each CustomEvent to its Block event via a "Run JavaScript" handler that
   addEventListener's the event on the <loop-system-alert> element and raises the Block event.
4. If the component exposes a global helper (see its API section), give the element/Block
   a Name and pass its platform-generated runtime .Id, e.g.
   window.LoopX.show($parameters.WidgetId) where the WidgetId input = <WidgetName>.Id.

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values (styling
comes from var(--token) in the Theme). After generating, list every element you created by
name and flag anything you could not finish.

Work iteratively: create the Block interface in step 1 and show it to me before wiring.
```

## Checklist
- [ ] Import `loop-system-alert.js` as Script resource, Include = Always.
- [ ] Rebuild `dist/theme.css` and paste into ODC Theme editor (includes `--loop-sysalert-*` tokens).
- [ ] Create Block `SystemAlert` with inputs and events above.
- [ ] Test all four types; test dismiss; test single-line (content centered) and multiline; confirm the built-in type icon, test `hide-icon`, and test a slotted custom icon.
- [ ] 1-Click Publish → validate in a **real browser** (Web Components never work in Service Studio Preview).
