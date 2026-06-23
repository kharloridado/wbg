# Handover — loop-note (custom CSS block)

The Loop **Notes** — inline callout box for contextual notices.
Figma: "Notes" [node 26642-61530].

**Approach:** Custom component, no native OutSystems widget equivalent. Built as a
pure-CSS BEM block (no JS needed). Four types via a modifier class; optional action
link row. Applied via `ExtendedClass` on any Container widget.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Notes page.

**What it is.** An inline callout box for contextual notices (CSS block), with four types and an optional action link.

**When to use**
- Contextual inline guidance tied to nearby content — tips, info, or warnings within a form or section.

**When not to use** (reach for instead)
- A page-level / global message → **System Alert**.
- A transient hover hint → **Tooltip**.
- A floating anchored panel → **Popover**.

**How to use**
- Extended Class `loop-note loop-note--<type>` on a Container; add the optional action link row.

## Files
| File | OutSystems destination |
|---|---|
| `tokens/component-note.css` | Included automatically in `dist/theme.css` — paste theme into ODC Theme editor |
| `src/blocks/loop-note.css` | Included automatically in `dist/theme.css` |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-note.css</code> → Theme CSS (also folded into dist/theme.css)</summary>

```css
/* loop-note.css — WBG / "The Loop" Notes callout block (CSS only, no JS).
 * Figma: "Notes" [node:26642-61530]. Custom component — not a native OS widget.
 * Four types: important (default) | tip | information | success.
 *
 * OutSystems usage: add "loop-note loop-note--<type>" to a Container via ExtendedClass.
 * Place child content directly inside:
 *   - .loop-note__body  (p or span) — note text; wrap the bold type prefix in .loop-note__label
 *   - .loop-note__action (optional) — action link/button row below body
 *
 * Example OutSystems HTML (rendered):
 *   <div class="loop-note loop-note--information">
 *     <p class="loop-note__body">
 *       <span class="loop-note__label">Information: </span>
 *       Body text here.
 *     </p>
 *     <div class="loop-note__action"><a href="#">Learn more</a></div>
 *   </div> */

.loop-note {
  display: flex;
  flex-direction: column;
  gap: var(--loop-note-gap, 4px);
  padding: var(--loop-note-padding-v, 12px) var(--loop-note-padding-h, 16px);
  border: 1px solid;
  border-radius: var(--loop-note-corner-radius, 4px);
  min-width: var(--loop-note-min-w, 150px);
  width: 100%;
  box-sizing: border-box;
}

/* ---- Type: important (default) ---- */
.loop-note,
.loop-note--important {
  background-color: var(--loop-note-important-bg, #fef3d7);
  border-color:     var(--loop-note-important-border, #896001);
}

/* ---- Type: tip ---- */
.loop-note--tip {
  background-color: var(--loop-note-tip-bg, #f1e1ff);
  border-color:     var(--loop-note-tip-border, #c17cfe);
}

/* ---- Type: information ---- */
.loop-note--information {
  background-color: var(--loop-note-information-bg, #f6fcff);
  border-color:     var(--loop-note-information-border, #169af3);
}

/* ---- Type: success ---- */
.loop-note--success {
  background-color: var(--loop-note-success-bg, #f6fef0);
  border-color:     var(--loop-note-success-border, #388004);
}

/* ---- Body text ---- */
.loop-note__body {
  margin: 0;
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:   var(--loop-note-body-size, 14px);
  line-height: var(--loop-note-body-leading, 1.25);
  font-weight: var(--font-weight-regular, 400);
  color:       var(--color-text-on-light-default, rgba(0, 13, 26, 0.7));
}

/* Bold type-name prefix (inline inside .loop-note__body) */
.loop-note__label {
  font-weight: var(--font-weight-bold, 700);
}

.loop-note          .loop-note__label,
.loop-note--important .loop-note__label { color: var(--loop-note-important-label, #896001); }
.loop-note--tip         .loop-note__label { color: var(--loop-note-tip-label, #763ba9); }
.loop-note--information .loop-note__label { color: var(--loop-note-information-label, #00538a); }
.loop-note--success     .loop-note__label { color: var(--loop-note-success-label, #388004); }

/* ---- Optional action row ---- */
.loop-note__action {
  display: flex;
  align-items: center;
  padding-top: var(--loop-note-action-pt, 8px);
}

.loop-note__action a,
.loop-note__action button {
  font-family:     var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:       var(--loop-note-body-size, 14px);
  font-weight:     var(--font-weight-bold, 700);
  line-height:     var(--loop-note-body-leading, 1.25);
  color:           var(--color-text-on-light-link-primary-enabled, #004370);
  text-decoration: none;
  background:      none;
  border:          0;
  padding:         0;
  cursor:          pointer;
  white-space:     nowrap;
}

.loop-note__action a:hover,
.loop-note__action button:hover {
  text-decoration: underline;
}

.loop-note__action a:focus-visible,
.loop-note__action button:focus-visible {
  outline:        2px solid var(--color-domain-interactive-focused, #0071bc);
  outline-offset: 2px;
  border-radius:  2px;
}

@media (prefers-reduced-motion: reduce) {
  .loop-note__action a,
  .loop-note__action button { transition: none; }
}
```

</details>

































## Usage in OutSystems
Add these classes to a **Container** via `ExtendedClass`:

```
loop-note loop-note--information
```

Valid type modifiers: `--important` (default) | `--tip` | `--information` | `--success`

**Recommended child structure:**
```
Container (loop-note loop-note--information)
  └─ Container (loop-note__body)
       └─ Expression or Text "Information: This is the note body text."
            (wrap the type prefix in a span with ExtendedClass "loop-note__label")
  └─ Container (loop-note__action)  ← optional
       └─ Link "Learn more"
```

## API (CSS tokens)
| Token | Default | Description |
|---|---|---|
| `--loop-note-padding-h` | `16px` | Horizontal padding |
| `--loop-note-padding-v` | `12px` | Vertical padding |
| `--loop-note-gap` | `4px` | Gap between body and action row |
| `--loop-note-corner-radius` | `4px` | Border radius |
| `--loop-note-body-size` | `14px` | Body text size |

## Types and colors
| Type | Background | Border | Label |
|---|---|---|---|
| important (default) | `#fef3d7` (yellow-03) | `#896001` (yellow-base) | `#896001` |
| tip | `#f1e1ff` (purple-10) | `#c17cfe` (purple-40) | `#763ba9` (purple-60) |
| information | `#f6fcff` (blue-05) | `#169af3` (blue-40) | `#00538a` (blue-60) |
| success | `#f6fef0` (green-03) | `#388004` (green-60) | `#388004` (green-60) |

## Accessibility (WCAG 2.2 AA)
Action link/button has focus ring in `--color-domain-interactive-focused` (blue-50 `#0071bc`).
No interactive element inside the note itself — purely informational. Screen readers read
the full text content naturally.

## Checklist
- [ ] Rebuild `dist/theme.css` (`npm run build:theme`) and paste into the ODC Theme editor.
- [ ] In a test screen, add a Container with ExtendedClass `loop-note loop-note--information`.
- [ ] Add child content: an Expression with the label span + body text.
- [ ] Test all four types. Test with and without the action row.
- [ ] 1-Click Publish → validate in a **real browser**.
