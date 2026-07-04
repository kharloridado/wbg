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
 * Figma: "Alerts" [node:17868-3944]. Custom Web Component — no native OS widget.
 * Renders a tinted alert with a 4px LEFT accent border (plus 1px top/right/bottom in the
 * same accent color), a type icon, optional title, message, action link/button, and a
 * dismiss (×) button. Four semantic types; single-line and multi-line layouts.
 *
 * Colors (per the 2026-07-02 Figma update): title/message/icon are STATE-COLORED per type
 * (--loop-alert-<type>-title/-message/-icon), not a shared dark text; the warning message
 * intentionally differs by layout (single-line #896001 vs multi-line #473201 — FND-062,
 * faithful per-layout); the dismiss × is neutral-60 (--loop-alert-dismiss); the action is
 * the primary link color for every type/layout. Icons are FILLED glyphs (solid shape in the
 * per-type icon color with white knockout marks), matching the updated Figma assets.
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
 * Type classes: the rendered root carries OutSystems UI's native alert type vocabulary —
 * `<div class="loop-alert alert alert-<type>">` where <type> is OSUI's modifier suffix
 * (error / warning / info / success; "information" maps to `alert-info`). The component
 * speaks the same type classes as the stock OSUI Alert (vendor _alert.scss) rather than a
 * parallel `loop-alert--<type>` set; `loop-alert` + `loop-alert__*` remain the structural hooks.
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
  // Normalize whatever's bound to `type` to ONE canonical semantic type used for both the
  // icon and the OSUI class. Tolerant on purpose: trims/lowercases, accepts the `info` alias,
  // AND strips a leading `alert-` so binding the OSUI class form (`alert-info`, `alert-success`)
  // resolves too — otherwise an unrecognized value silently fell back to `error` (the reported
  // ODC bug: passing `alert-info` always rendered as error).
  get _semanticType() {
    const raw = this._type.trim().toLowerCase().replace(/^alert-/, '');
    return { error: 'error', warning: 'warning', information: 'information', info: 'information', success: 'success' }[raw] || 'error';
  }
  // Map the semantic type onto OutSystems UI's NATIVE alert modifier suffix so the host adopts
  // the stock `.alert` / `.alert-<type>` class vocabulary (vendor _alert.scss). Only `information`
  // differs (OSUI uses `info`); the rest are 1:1.
  get _osuiType()    { return this._semanticType === 'information' ? 'info' : this._semanticType; }
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

  // Built-in type icon (Figma renders one per type). Font Awesome 6 Pro SOLID glyph —
  // filled shape in currentColor (driven by the per-type --loop-alert-<type>-icon token)
  // with knockout marks, matching the Figma 17868-3944 assets: triangle-exclamation /
  // circle-info / circle-exclamation. Success reuses the circle-info "i" glyph — that is
  // what the Figma set draws for BOTH success layouts (17868-4020), not a check
  // (see the consistency finding in findings/findings-register.md). Rendered from the
  // unicode codepoint against the document-level @font-face (visible inside shadow DOM,
  // unlike .fa-* classes). Overridden by a slotted `slot="icon"` element.
  _defaultIcon(type) {
    const glyph = {
      warning:     '&#xf071;',  /* fa-triangle-exclamation */
      information: '&#xf05a;',  /* fa-circle-info */
      success:     '&#xf05a;',  /* fa-circle-info — per Figma 17868-4020, not circle-check */
      error:       '&#xf06a;',  /* fa-circle-exclamation */
    }[type] || '&#xf06a;';
    return `<span class="loop-alert__icon" aria-hidden="true">${glyph}</span>`;
  }

  _render() {
    const t            = this._semanticType;
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
          <span class="loop-alert__dismiss-glyph" aria-hidden="true">&#xf00d;</span>
        </button>`
      : '';

    // single-line: __text is display:contents, so title + message become flex items of
    // __content directly (message flex:1 ellipsizes); action is a content-level sibling.
    // multi-line:  __text is a real column holding title / message / action.
    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="loop-alert alert alert-${this._osuiType}${multiline ? ' loop-alert--multiline' : ''}" role="alert" part="alert">
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
}
.loop-alert--multiline {
  align-items: flex-start;
  gap: var(--loop-alert-gap-multi, 8px);
  min-height: 0;
  padding: var(--loop-alert-padding-v-multi, 8px) var(--loop-alert-padding-h-multi, 12px);
}

/* Per-type background (low) + accent border (all sides; left is thicker via border-left-width).
 * Keyed on OutSystems UI's native alert type modifiers (.alert-error/-warning/-info/-success)
 * so the component speaks the same type vocabulary as the stock OSUI Alert. */
.alert-error   { background-color: var(--loop-alert-error-bg, #fdf2f2);       border-color: var(--loop-alert-error-accent, #9d161d); }
.alert-warning { background-color: var(--loop-alert-warning-bg, #fef3d7);     border-color: var(--loop-alert-warning-accent, #896001); }
.alert-info    { background-color: var(--loop-alert-information-bg, #f6fcff); border-color: var(--loop-alert-information-accent, #00538a); }
.alert-success { background-color: var(--loop-alert-success-bg, #f6fef0);     border-color: var(--loop-alert-success-accent, #388004); }

.loop-alert__content {
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--loop-alert-gap, 16px);
}
.loop-alert--multiline .loop-alert__content { align-items: flex-start; gap: var(--loop-alert-gap-multi, 8px); }

/* slot is transparent to flex so its content (default glyph or slotted icon) is the flex item */
.loop-alert__icon-slot { display: contents; }
/* FA 6 Pro solid glyph — the filled circle/triangle spans the full em box, so
   font-size = icon-size reproduces the 16px Figma icon */
.loop-alert__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--loop-alert-icon-size, 16px);
  height: var(--loop-alert-icon-size, 16px);
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-solid, 900);
  font-size: var(--loop-alert-icon-size, 16px);
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
}
::slotted([slot="icon"]) {
  flex-shrink: 0;
  width: var(--loop-alert-icon-size, 16px);
  height: var(--loop-alert-icon-size, 16px);
}
.loop-alert--multiline .loop-alert__icon,
.loop-alert--multiline ::slotted([slot="icon"]) { margin-top: 2px; }

/* icon color = per-type icon role — decoupled from the border accent (warning icon is
 * yellow-50 on a yellow-base border; info icon is blue-70 on a blue-60 border) */
.alert-error   .loop-alert__icon { color: var(--loop-alert-error-icon, #9d161d); }
.alert-warning .loop-alert__icon { color: var(--loop-alert-warning-icon, #e19d00); }
.alert-info    .loop-alert__icon { color: var(--loop-alert-information-icon, #004370); }
.alert-success .loop-alert__icon { color: var(--loop-alert-success-icon, #388004); }

/* title (emphasis) + message = per-type state text roles */
.alert-error   .loop-alert__title { color: var(--loop-alert-error-title, #861319); }
.alert-warning .loop-alert__title { color: var(--loop-alert-warning-title, #473201); }
.alert-info    .loop-alert__title { color: var(--loop-alert-information-title, #004370); }
.alert-success .loop-alert__title { color: var(--loop-alert-success-title, #234f03); }

.alert-error   .loop-alert__message { color: var(--loop-alert-error-message, #9d161d); }
.alert-warning .loop-alert__message { color: var(--loop-alert-warning-message, #896001); }
.alert-info    .loop-alert__message { color: var(--loop-alert-information-message, #00538a); }
.alert-success .loop-alert__message { color: var(--loop-alert-success-message, #388004); }
/* Figma splits the warning message shade by layout (single #896001 / multi #473201) — FND-062 */
.alert-warning.loop-alert--multiline .loop-alert__message { color: var(--loop-alert-warning-message-multi, #473201); }

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
  color:       var(--loop-alert-dismiss, #4b5e71);
}
/* FA xmark (regular) — 14px em box renders the ~10px × the Figma 16px dismiss box draws */
.loop-alert__dismiss-glyph {
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-regular, 400);
  font-size: var(--loop-alert-dismiss-glyph, 14px);
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
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
| `icon` | Overrides the **built-in** type icon. Each type ships a default 16×16 icon (error / warning / information / success); slot a `<img slot="icon" src="…" alt="">` or inline SVG to replace it, or set `hide-icon` to remove it. The defaults are **Font Awesome 6 Pro solid glyphs** rendered from unicode against the self-hosted icon font: triangle-exclamation (warning) / circle-info (information **and** success — the Figma Alerts set draws the "i" glyph for success, node 17868-4020) / circle-exclamation (error). |

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

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, wire up an OutSystems Block that wraps the already-imported custom
Web Component <loop-alert> for the WBG "The Loop" design system.

Context (already done manually — do NOT re-create or edit these):
- dist/theme.css and any block CSS are already pasted into the ODC Theme editor.
- loop-alert.js is already imported as a Script resource (Theme/Library), Include = Always. It defines the custom element <loop-alert>.
- Do NOT write CSS, author/modify JavaScript, or edit the Theme. Your job is only the
  Block, its inputs/events, the attribute bindings, the event wiring, and any Client
  Actions that drive it.

Task — reference every element by the exact name given. Take the exact inputs, attribute
bindings, events and any global helper from this handover's "API — Attributes / Methods /
Events" tables (paste the relevant table into the chat so I work from real names):

1. Create a Block named "Alert". Add one input per attribute (use the documented
   default) and one event per CustomEvent. Model enumerable attributes (variant / type /
   size / position / status) as Static Entities — one record per allowed value, with a
   single Text attribute (e.g. "Value") set as the record Identifier (delete the default
   Id/Label/Order/Is_Active) holding the literal the component expects — not free Text;
   keep free-form text as Text and flags as Boolean. Do NOT add a string Id input or set
   the element's id; OutSystems generates ids at runtime (see step 4).
2. Place <loop-alert> in the Block. Bind each attribute to its input with a Value expression
   (ODC requires one on every attribute). Static-Entity inputs bind directly (e.g.
   type = Type) since their Value attribute is the identifier; Booleans use
   If(Flag, "true", "false") — not presence.
3. Wire each CustomEvent to its Block event via a "Run JavaScript" handler that
   addEventListener's the event on the <loop-alert> element and raises the Block event.
4. If the component exposes a global helper (see its API section), give the element/Block
   a Name and pass its platform-generated runtime .Id, e.g.
   window.LoopX.show($parameters.WidgetId) where the WidgetId input = <WidgetName>.Id.

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values (styling
comes from var(--token) in the Theme). After generating, list every element you created by
name and flag anything you could not finish.

Work iteratively: create the Block interface in step 1 and show it to me before wiring.
```

## Checklist
- [ ] Import `loop-alert.js` as Script resource, Include = Always.
- [ ] Rebuild `dist/theme.css` and paste into ODC Theme editor (includes `--loop-alert-*` tokens).
- [ ] Create Block `Alert` with inputs and events above.
- [ ] Test all four types; test dismiss; test single-line (message ellipsizes) and multiline; confirm the built-in type icon, test `hide-icon`, and test a slotted custom icon.
- [ ] 1-Click Publish → validate in a **real browser** (Web Components never work in Service Studio Preview).
