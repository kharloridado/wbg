# Handover — loop-note (custom CSS block)

The Loop **Notes** — inline callout box for contextual notices.
Figma: "Notes" [node 26642-61530].

**Approach:** Custom component, no native OutSystems widget equivalent. Built as a
pure-CSS BEM block (no JS needed). Four types via a modifier class; optional action
link row. Applied via `ExtendedClass` on any Container widget.

## Files
| File | OutSystems destination |
|---|---|
| `tokens/component-note.css` | Included automatically in `dist/theme.css` — paste theme into ODC Theme editor |
| `src/blocks/loop-note.css` | Included automatically in `dist/theme.css` |

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
