# Handover — loop-alert (custom Web Component)

The Loop **Alert** — light, contextual in-page alert with a 4px left accent border.
Figma: "Alerts" [node 17868-4165].

**Approach:** Custom component, no native OutSystems widget equivalent. Built as a
vanilla JS Web Component (Shadow DOM) wrapped in an OutSystems Block. Four semantic
types; single-line (centered, message ellipsizes) and multi-line (stacked) layouts;
built-in per-type icon (slot-overridable), action link, dismiss button.

> **Not** the dark full-width `loop-system-alert` (status banner with an `offline` type).
> This is the light, contextual alert in the Notes/Alerts family.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Alert page.

**What it is.** A light, in-page contextual alert (Web Component) — tinted background with a
4px left accent border, four types, a built-in per-type icon, and optional action/dismiss.

**When to use**
- Contextual feedback inside a page/section — validation summaries, success/error after an
  action, inline warnings tied to a specific area.

**When not to use** (reach for instead)
- A page- or app-level full-width banner → **System Alert**.
- A static informational callout with no dismiss/action → **Note**.
- A transient hover hint → **Tooltip**.
- Field-level validation → the **Text Field** error state.

**How to use**
- Drop the **Alert** Block; set the type, single/multi-line layout, and optional action/dismiss.
  A type icon shows by default (`hide-icon` to remove, or slot your own). Script Include = Always.

## Files
| File | OutSystems destination |
|---|---|
| `src/components/loop-alert.js` | Script resource (Theme/Library), Include = **Always** |
| `tokens/component-alert.css` | Included automatically in `dist/theme.css` |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-alert.js</code> → Script resource (Theme/Library), Include = Always</summary>

```js
/**
 * <loop-alert> — Contextual inline alert (light, left-accent-border callout).
 *
 * Figma: "Alerts" [node:17868-4165]. Custom Web Component — no native OS widget.
 * Renders a tinted alert with a 4px LEFT accent border (plus 1px top/right/bottom in the
 * same accent color), a type icon, optional title, message, action link/button, and a
 * dismiss (×) button. Four semantic types; single-line and multi-line layouts.
 *
 * NOT to be confused with <loop-system-alert> (the dark, full-width status banner with an
 * "offline" type). This is the light, in-page contextual alert that lives in the Notes/Alerts
 * family. The two components coexist.
 *
 * Layout (per Figma):
 *   single-line — icon + title + message + action in one centered row (message ellipsizes);
 *                 dismiss × pinned far right. ~40px tall.
 *   multi-line  — icon top-left; title / message / action stacked left-aligned in a column;
 *                 dismiss × top-right.
 *
 * Attributes:
 *   type          "error" | "warning" | "information" | "success"  (default: "error")
 *   title         Optional bold title text (14px Bold)
 *   message       Alert body text (14px Regular)
 *   action-label  Optional action link/button label (14px Bold)
 *   action-href   If present, renders action as <a href>; otherwise fires "action" event
 *   dismissible   Boolean — shows × button; fires "dismiss" event + hides host.
 *                 Value-aware: absent or "false"/"0" → off; any other value → on.
 *   multiline     Boolean — stacks title, message and action vertically (icon top-aligned).
 *                 Value-aware: absent or "false"/"0" → off; any other value → on.
 *   hide-icon     Boolean — suppress the built-in type icon (Figma "leftIcon = false").
 *                 Value-aware: absent or "false"/"0" → off; any other value → on.
 *
 * Events (bubbles, composed):
 *   dismiss — fired when dismiss button clicked; detail: { type }
 *   action  — fired when action clicked without action-href; detail: { type }
 *
 * Slots:
 *   icon — overrides the built-in type icon, e.g. <img slot="icon" src="…" alt="">.
 *          When empty, a default type-specific 16×16 icon is shown (error/warning/information/success).
 *
 * Accessibility: role="alert" (live region); dismiss has aria-label; focus rings use
 * currentColor per CLAUDE.md (no silent color substitution).
 *
 * OutSystems: drop loop-alert.js into Resources. In a Block, add an HTML element and bind
 * attributes declaratively from Block inputs — booleans are value-aware, so:
 *   dismissible = If(Dismissible, "true", "false")   multiline = If(Multiline, "true", "false")
 * ODC rewrites the attribute when the input changes; observedAttributes re-renders reactively.
 */
class LoopAlert extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'title', 'message', 'action-label', 'action-href', 'dismissible', 'multiline', 'hide-icon'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onDismiss = this._onDismiss.bind(this);
    this._onAction  = this._onAction.bind(this);
  }

  connectedCallback()  { this._render(); }
  disconnectedCallback() {
    this._dismissBtn?.removeEventListener('click', this._onDismiss);
    this._actionBtn?.removeEventListener('click', this._onAction);
  }
  attributeChangedCallback(n, o, v) { if (o !== v) this._render(); }

  get _type()        { return this.getAttribute('type') || 'error'; }
  get _title()       { return this.getAttribute('title') || ''; }
  get _message()     { return this.getAttribute('message') || ''; }
  get _actionLabel() { return this.getAttribute('action-label') || ''; }
  get _actionHref()  { return this.getAttribute('action-href') || ''; }
  get _dismissible() { return this._boolAttr('dismissible'); }
  get _multiline()   { return this._boolAttr('multiline'); }
  get _hideIcon()    { return this._boolAttr('hide-icon'); }

  // Value-aware boolean: absent or "false"/"0" → off; present with any other value → on.
  // Lets OutSystems drive it declaratively via If(Flag, "true", "false") (ODC always emits
  // a value), while bare `<loop-alert dismissible>` (value "") still reads as on.
  _boolAttr(name) {
    const v = this.getAttribute(name);
    if (v === null) return false;
    return v !== 'false' && v !== '0';
  }

  _onDismiss() {
    this.dispatchEvent(new CustomEvent('dismiss', { bubbles: true, composed: true, detail: { type: this._type } }));
    this.hidden = true;
  }

  _onAction() {
    this.dispatchEvent(new CustomEvent('action', { bubbles: true, composed: true, detail: { type: this._type } }));
  }

  // Built-in type icon (Figma renders one per type). 16×16, stroke/fill currentColor so it
  // inherits the per-type accent color. Overridden by a slotted `slot="icon"` element.
  _defaultIcon(type) {
    const svg = (inner) =>
      `<svg class="loop-alert__icon" viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">${inner}</svg>`;
    switch (type) {
      case 'warning':
        return svg('<path d="M8 2.3 14.4 13.1H1.6L8 2.3Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><line x1="8" y1="6.4" x2="8" y2="9.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="11.3" r="0.8" fill="currentColor"/>');
      case 'information':
        return svg('<circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="5" r="0.85" fill="currentColor"/><line x1="8" y1="7.2" x2="8" y2="11.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>');
      case 'success':
        return svg('<circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><path d="M5 8.2 7 10.2 11 5.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>');
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

    const actionHtml = actionLabel
      ? actionHref
        ? `<a class="loop-alert__action" href="${actionHref}">${actionLabel}</a>`
        : `<button class="loop-alert__action" type="button">${actionLabel}</button>`
      : '';

    const iconHtml = this._hideIcon
      ? ''
      : `<slot name="icon" class="loop-alert__icon-slot" part="icon">${this._defaultIcon(t)}</slot>`;

    const titleHtml   = title   ? `<span class="loop-alert__title">${title}</span>` : '';
    const messageHtml = message ? `<p class="loop-alert__message">${message}</p>`   : '';

    const dismissHtml = dismissible
      ? `<button class="loop-alert__dismiss" type="button" aria-label="Dismiss alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>`
      : '';

    // single-line: __text is display:contents, so title + message become flex items of
    // __content directly (message flex:1 ellipsizes); action is a content-level sibling.
    // multi-line:  __text is a real column holding title / message / action.
    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="loop-alert loop-alert--${t}${multiline ? ' loop-alert--multiline' : ''}" role="alert" part="alert">
        <div class="loop-alert__content" part="content">
          ${iconHtml}
          <div class="loop-alert__text" part="text">
            ${titleHtml}
            ${messageHtml}
            ${multiline ? actionHtml : ''}
          </div>
          ${multiline ? '' : actionHtml}
        </div>
        ${dismissHtml}
      </div>`;

    this._dismissBtn = dismissible ? this.shadowRoot.querySelector('.loop-alert__dismiss') : null;
    this._actionBtn  = (actionLabel && !actionHref) ? this.shadowRoot.querySelector('.loop-alert__action') : null;
    this._dismissBtn?.addEventListener('click', this._onDismiss);
    this._actionBtn?.addEventListener('click', this._onAction);
  }

  _css() {
    return `
:host { display: block; width: 100%; }
:host([hidden]) { display: none; }

.loop-alert {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--loop-alert-gap, 16px);
  min-width: var(--loop-alert-min-width, 230px);
  min-height: var(--loop-alert-min-height, 40px);
  padding: 0 var(--loop-alert-padding-h, 16px);
  border: var(--loop-alert-hairline-width, 1px) solid;
  border-left-width: var(--loop-alert-accent-width, 4px);
  border-radius: var(--loop-alert-corner-radius, 4px);
  color: var(--loop-alert-text, rgba(0, 13, 26, 0.7));
}
.loop-alert--multiline {
  align-items: flex-start;
  gap: var(--loop-alert-gap-multi, 8px);
  min-height: 0;
  padding: var(--loop-alert-padding-v-multi, 8px) var(--loop-alert-padding-h-multi, 12px);
}

/* Per-type background (low) + accent border (all sides; left is thicker via border-left-width) */
.loop-alert--error       { background-color: var(--loop-alert-error-bg, #fdf2f2);       border-color: var(--loop-alert-error-accent, #9d161d); }
.loop-alert--warning     { background-color: var(--loop-alert-warning-bg, #fef3d7);     border-color: var(--loop-alert-warning-accent, #896001); }
.loop-alert--information { background-color: var(--loop-alert-information-bg, #f6fcff); border-color: var(--loop-alert-information-accent, #00538a); }
.loop-alert--success     { background-color: var(--loop-alert-success-bg, #f6fef0);     border-color: var(--loop-alert-success-accent, #388004); }

.loop-alert__content {
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--loop-alert-gap, 16px);
}
.loop-alert--multiline .loop-alert__content { align-items: flex-start; gap: var(--loop-alert-gap-multi, 8px); }

/* slot is transparent to flex so its content (default svg or slotted icon) is the flex item */
.loop-alert__icon-slot { display: contents; }
.loop-alert__icon { flex-shrink: 0; display: block; width: var(--loop-alert-icon-size, 16px); height: var(--loop-alert-icon-size, 16px); }
::slotted([slot="icon"]) {
  flex-shrink: 0;
  width: var(--loop-alert-icon-size, 16px);
  height: var(--loop-alert-icon-size, 16px);
}
.loop-alert--multiline .loop-alert__icon,
.loop-alert--multiline ::slotted([slot="icon"]) { margin-top: 2px; }

/* icon color = per-type accent */
.loop-alert--error       .loop-alert__icon { color: var(--loop-alert-error-accent, #9d161d); }
.loop-alert--warning     .loop-alert__icon { color: var(--loop-alert-warning-accent, #896001); }
.loop-alert--information .loop-alert__icon { color: var(--loop-alert-information-accent, #00538a); }
.loop-alert--success     .loop-alert__icon { color: var(--loop-alert-success-accent, #388004); }

/* single-line: promote title + message into the content flex row; multi-line: real column */
.loop-alert__text { display: contents; }
.loop-alert--multiline .loop-alert__text {
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.loop-alert__title {
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:   var(--loop-alert-title-size, 14px);
  font-weight: var(--font-weight-bold, 700);
  line-height: 1.25;
  white-space: nowrap;
  flex-shrink: 0;
}
.loop-alert__message {
  margin: 0;
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:   var(--loop-alert-body-size, 14px);
  font-weight: var(--font-weight-regular, 400);
  line-height: 1.5;
}
/* single-line: message takes remaining space and ellipsizes; multi-line: full-width, wraps */
.loop-alert:not(.loop-alert--multiline) .loop-alert__message {
  flex: 1 0 0;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.loop-alert--multiline .loop-alert__message { width: 100%; }

.loop-alert__action {
  font-family:     var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:       var(--loop-alert-body-size, 14px);
  font-weight:     var(--font-weight-bold, 700);
  line-height:     1.5;
  color:           var(--loop-alert-action, #004370);
  text-decoration: none;
  background:      none;
  border:          0;
  padding:         0;
  cursor:          pointer;
  white-space:     nowrap;
  flex-shrink:     0;
}
.loop-alert__action:hover { text-decoration: underline; }
.loop-alert--multiline .loop-alert__action { margin-top: var(--loop-alert-action-pt, 12px); align-self: flex-start; }
.loop-alert__action:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; border-radius: 2px; }

.loop-alert__dismiss {
  flex-shrink: 0;
  display:     flex;
  align-items: center;
  justify-content: center;
  width:       var(--loop-alert-icon-size, 16px);
  height:      var(--loop-alert-icon-size, 16px);
  background:  none;
  border:      0;
  padding:     0;
  cursor:      pointer;
  color:       var(--loop-alert-text, rgba(0, 13, 26, 0.7));
}
.loop-alert--multiline .loop-alert__dismiss { align-self: flex-start; margin-top: 2px; }
.loop-alert__dismiss:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; border-radius: 2px; }

@media (prefers-reduced-motion: reduce) {
  .loop-alert__action, .loop-alert__dismiss { transition: none; }
}`;
  }
}

if (!customElements.get('loop-alert')) {
  customElements.define('loop-alert', LoopAlert);
}
```

</details>



## API — Attributes
| Attribute | Values | Description |
|---|---|---|
| `type` | `error` \| `warning` \| `information` \| `success` | Alert variant (default: `error`) |
| `title` | Text | Optional bold title (14px Bold) |
| `message` | Text | Alert body text (14px); single-line ellipsizes, multi-line wraps |
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
| `icon` | Overrides the **built-in** type icon. Each type ships a default 16×16 icon (error / warning / information / success); slot a `<img slot="icon" src="…" alt="">` or inline SVG to replace it, or set `hide-icon` to remove it. The default SVGs **approximate** the Figma glyphs — swap in the exact assets if design supplies them. |

## Example HTML
```html
<!-- Single-line, error, with action + dismiss -->
<loop-alert
  type="error"
  title="Title"
  message="Sample Message"
  action-label="Action"
  dismissible>
</loop-alert>

<!-- Multi-line, information -->
<loop-alert
  type="information"
  title="Title"
  message="Message with more than 2 lines of information."
  action-label="Action"
  action-href="/details"
  dismissible
  multiline>
</loop-alert>
```

## OutSystems Block wiring
1. Create Block `Alert`: inputs `Type`, `Title`, `Message`, `ActionLabel`, `ActionHref`,
   `Dismissible` (Boolean), `Multiline` (Boolean), `HideIcon` (Boolean); events `OnDismiss`, `OnAction`.
2. On the `<loop-alert>` HTML element, add attributes bound to the inputs (ODC requires a Value
   expression on every attribute):
   - `type` → `Type`, `title` → `Title`, `message` → `Message`, `action-label` → `ActionLabel`, `action-href` → `ActionHref`
   - `dismissible` → `If(Dismissible, "true", "false")`
   - `multiline` → `If(Multiline, "true", "false")`
   - (optional) `hide-icon` → `If(HideIcon, "true", "false")`
   The boolean attributes are **value-aware** (`"false"`/`"0"`/absent = off), so the `If(...)`
   expression works directly — no OnReady JavaScript node needed. ODC rewrites the attribute when
   the input changes and the component re-renders reactively (`observedAttributes`).
3. Wire `dismiss` CustomEvent → `OnDismiss`. Wire `action` CustomEvent → `OnAction`.

## Accessibility (WCAG 2.2 AA)
`role="alert"` = live region; screen readers announce on insertion. Dismiss has
`aria-label="Dismiss alert"`. Focus rings use `currentColor` (visible on the tinted
backgrounds). Title/message use `--color-text-on-light-default` (rgba(0,13,26,0.7)) on the
type's `*/low` tint — all four pairings clear the 4.5:1 normal-text minimum.
⚠️ **FND-054 (consistency, low):** Figma shows the Action link in primary `#004370` for every
type/layout **except** the Information multi-line variant, which uses a near-black secondary
link color (`#0c0f12`). Normalized to primary `#004370` for all types/layouts here; logged in
`findings/findings-register.md` for design to confirm the intended Information-multiline color.

## Checklist
- [ ] Import `loop-alert.js` as Script resource, Include = Always.
- [ ] Rebuild `dist/theme.css` and paste into ODC Theme editor (includes `--loop-alert-*` tokens).
- [ ] Create Block `Alert` with inputs and events above.
- [ ] Test all four types; test dismiss; test single-line (message ellipsizes) and multiline; confirm the built-in type icon, test `hide-icon`, and test a slotted custom icon.
- [ ] 1-Click Publish → validate in a **real browser** (Web Components never work in Service Studio Preview).
