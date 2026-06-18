# Handover — loop-tag (custom CSS block)

The Loop **Tag** — compact pill label for categories, filters, and selections.
Figma: "Tag" [node 17313-5502].

**Approach:** Custom component. The native OutSystems UI `.tag` is too thin (centered
colored box, 3 sizes, color modifiers only — no icon/dismiss/selected/disabled). Built
as a pure-CSS BEM block (no JS) — colors/sizes/states via modifier classes; dismiss and
toggle/selection wired in OutSystems logic. Applied via `ExtendedClass` on a Container.

**Scope (this build):** 4 colors · 4 sizes · leading icon slot · dismissible · states
default/hover/focus/disabled/selected.
**Out of scope (follow-up):** avatar · initials · flag slots · on-dark theme ·
toggle/interactive selection wiring · numbers/counter.

## Files
| File | OutSystems destination |
|---|---|
| `tokens/component-tag.css` | Included automatically in `dist/theme.css` — paste theme into ODC Theme editor |
| `src/blocks/loop-tag.css` | Included automatically in `dist/theme.css` |

## Usage in OutSystems
Add these classes to a **Container** via `ExtendedClass`:

```
loop-tag loop-tag--blue loop-tag--regular
```

- **Color:** `--blue` (default) | `--purple` | `--green` | `--yellow`
- **Size:** `--small` (24px) | `--regular` (32px, default) | `--large` (40px) | `--xlarge` (48px)
- **State:** `--selected` (bold label + filled bg) · `--disabled` · `--interactive` (hover/pointer for selectable tags)
- **Dismiss:** add `--dismissible` and include the dismiss button child

**Child structure:**
```
Container (loop-tag loop-tag--blue loop-tag--regular loop-tag--dismissible)
  └─ Icon (loop-tag__icon)            ← optional leading icon, aria-hidden
  └─ Expression/Text (loop-tag__label)  ← the label text
  └─ Button (loop-tag__dismiss)        ← optional; aria-label "Remove …"; wire OnClick to remove the tag
```
Example rendered markup:
```html
<span class="loop-tag loop-tag--blue loop-tag--regular loop-tag--dismissible">
  <i class="loop-tag__icon" aria-hidden="true"><!-- icon glyph --></i>
  <span class="loop-tag__label">Filter: Active</span>
  <button type="button" class="loop-tag__dismiss" aria-label="Remove Active filter">×</button>
</span>
```

## API (key CSS tokens)
| Token | Default | Description |
|---|---|---|
| `--loop-tag-radius` | `48px` | Pill radius (FND-028: ≠ `--radius-pill` 32px) |
| `--loop-tag-padding-h` | `12px` | Horizontal padding |
| `--loop-tag-padding-v` | `8px` | Vertical padding (small uses `6.5px`, FND-029) |
| `--loop-tag-gap` | `4px` | Gap between slot and label |
| `--loop-tag-icon-size` / `--loop-tag-dismiss-size` | `14px` | Leading icon / dismiss glyph |
| `--loop-tag-label-size` | `16px` | Label text size (constant across sizes) |
| `--loop-tag-h-{small,regular,large,xlarge}` | `24/32/40/48px` | Min-height per size |

## Colors
| Color | Background | Border | Text | Selected bg |
|---|---|---|---|---|
| blue (default) | `#f6fcff` (blue-05) | `#169af3` (blue-40) | `#004370` (blue-70) | `#004370` (blue-70) |
| purple | `#f1e1ff` (purple-10) | `#c17cfe` (purple-40) | `#763ba9` (purple-60) | `#410179` (purple-80) |
| green | `#f6fef0` (green-03) | `#388004` (green-60) | `#388004` (green-60) | `#234f03` (green-70) |
| yellow | `#fef3d7` (yellow-03) | `#896001` (yellow-base) | `#896001` (yellow-base) | yellow-90 |

Selected text = white (FND-030 — on-dark text token deferred). Disabled = `#e7edf3` bg /
`#d4dee8` border / `#00294d6b` text.

## Accessibility (WCAG 2.2 AA)
- `loop-tag__dismiss` is a real `<button>` with `aria-label`; focus ring in
  `--color-domain-interactive-focused` (blue-50 `#0071bc`).
- `--interactive` tags get a `:focus-visible` ring; wire keyboard activation in OutSystems.
- Leading icon is decorative (`aria-hidden`); the label carries the meaning.
- `prefers-reduced-motion` honored.
- Selected state uses **bold weight + fill**, not color alone.

## Related findings (register-only, awaiting design)
FND-028 (radius 48 vs pill 32) · FND-029 (size/vpadding metrics not fully tokenised) ·
FND-030 (selected-state colors inferred). See `findings/findings-register.md`.

## Checklist
- [ ] Rebuild `dist/theme.css` (`npm run build:theme`) and paste into the ODC Theme editor.
- [ ] In a test screen, add a Container with ExtendedClass `loop-tag loop-tag--blue loop-tag--regular`.
- [ ] Add child `loop-tag__label` (+ optional `loop-tag__icon`).
- [ ] For dismissible tags, add the `loop-tag__dismiss` button and wire its OnClick to remove the tag.
- [ ] Test all 4 colors × 4 sizes, selected, disabled, and dismissible.
- [ ] 1-Click Publish → validate in a **real browser** (focus ring, keyboard).
