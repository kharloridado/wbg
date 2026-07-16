# [handover] Split Button — add in OutSystems

Implements the **Button Dropdown** (split button) from *-The Loop- Main Library* as a
**BEM wrapper around two native OutSystems UI Button widgets**, replacing the previous
`loop-button-dropdown` Web Component approach.

**Issue:** [#92](https://github.com/kharloridado/wbg/issues/92)  
**Figma node:** `15597-3469`  
**Escalation level:** L1 (native widget restyle, BEM wrapper)  
**Supersedes:** `loop-button-dropdown.js` (Web Component — still exists for backwards compat)

---

## When to use

Use a split button when a primary action has a companion toggle (expand / caret). The
component is two standard OutSystems UI `Button` widgets inside a `Container` — no Web
Component, no custom element.

### Widget setup

| Widget    | ExtendedClass               | Role           |
|-----------|-----------------------------|----------------|
| Container | `loop-split-btn`            | wrapper        |
| Left Btn  | `loop-split-btn__action`    | primary action |
| Right Btn | `loop-split-btn__toggle`    | caret / expand |

### Variant matrix

Set the **Style** input on each `Button` widget:

| Left style  | Right style  | Visual result                  |
|-------------|--------------|--------------------------------|
| Primary     | Primary      | filled both halves             |
| Primary     | (default)    | filled left, outlined right    |
| (default)   | (default)    | outlined both halves           |
| Ghost       | Ghost        | ghost (text-only) both halves  |

---

## Files

| Artefact             | Type      | Location in ODC               |
|----------------------|-----------|-------------------------------|
| `loop-split-btn.css` | Theme CSS | paste below OutSystems UI     |

---

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-split-btn.css</code> → Theme CSS — paste below OutSystems UI</summary>

```css
/* ============================================
   Component: Split Button  ("The Loop" — loop/split-btn)
   Figma: -The Loop- Main Library · "Button Dropdown" [node:15597-3469]
   Approach: BEM WRAPPER around two native OutSystems UI Button widgets.
   Location: Theme CSS (paste below OutSystems UI so it wins on specificity).
   Escalation Level: L1 (native widget restyle, BEM wrapper)

   Usage in OutSystems:
     Container   ExtendedClass = "loop-split-btn"
     Left Btn    ExtendedClass = "loop-split-btn__action"
     Right Btn   ExtendedClass = "loop-split-btn__toggle"

   Variant matrix (set Button "Style" on each widget):
     Left = Primary, Right = Primary    → filled both sides
     Left = Primary, Right = (default)  → filled left + outlined right
     Left = (default), Right = (default) → outlined both sides
     Left = Ghost,   Right = Ghost      → text-fill both sides

   Tokens consumed: --radius-pill, --loop-split-btn-toggle-w
   ============================================ */

.loop-split-btn {
  display: inline-flex;
  align-items: stretch;
}

/* ---- Action button (left half): pill outer-left corners, flush inner-right ---- */
.loop-split-btn .loop-split-btn__action {
  border-start-start-radius: var(--radius-pill, 32px);
  border-end-start-radius:   var(--radius-pill, 32px);
  border-start-end-radius:   0;
  border-end-end-radius:     0;
  border-inline-end-width:   0;   /* collapse shared edge; toggle's left border is the separator */
}

/* ---- Toggle button (right half): flush inner-left, pill outer-right ---- */
.loop-split-btn .loop-split-btn__toggle {
  border-start-start-radius: 0;
  border-end-start-radius:   0;
  border-start-end-radius:   var(--radius-pill, 32px);
  border-end-end-radius:     var(--radius-pill, 32px);
  min-width:       var(--loop-split-btn-toggle-w, 44px);
  padding-inline:  0;
  display:         inline-flex;
  align-items:     center;
  justify-content: center;
}

/* ---- Primary + Primary: thin translucent separator across the collapsed shared edge ---- */
.loop-split-btn .loop-split-btn__action.btn-primary {
  border-inline-end: 1px solid rgba(255, 255, 255, 0.25);
}

/* ---- Focus: raise focused half above sibling so the full ring shows unclipped ---- */
.loop-split-btn .loop-split-btn__action:focus-visible,
.loop-split-btn .loop-split-btn__toggle:focus-visible {
  position: relative;
  z-index:  1;
}

/* ---- Reduced motion (WCAG 2.2 SC 2.3.3) ---- */
@media (prefers-reduced-motion: reduce) {
  .loop-split-btn .loop-split-btn__action,
  .loop-split-btn .loop-split-btn__toggle { transition: none; }
}
```

</details>

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for SplitBtn to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-split-btn.css, dist/tokens.css and dist/theme.css are already pasted into the ODC
Theme editor (below OutSystems UI). The look is pure CSS + tokens — there is nothing for
you to style, and you must not write or edit CSS.

Task — this component RESTYLES a native OutSystems widget, so the work is using the right
widget, not generating styles. Referencing elements by name:
1. Use the native OutSystems widget this maps to (see this handover's "When to use" /
   "Variant mapping" section), not a custom element.
2. Apply each variant via the Extended Class property only (e.g. ExtendedClass =
   "<documented-modifier>") — never mutate OutSystems UI internals.
3. Build any screen/Block logic the screen needs around it.

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values. After
generating, list what you created by name and flag anything you could not finish.
```

## Checklist

### Theme editor
- [ ] Run `npm run build:theme` to regenerate `dist/theme.css`
- [ ] Paste `dist/theme.css` into the ODC Theme editor (replaces the previous theme paste)
- [ ] Paste `loop-split-btn.css` into the Theme CSS **below** the OutSystems UI section

### OutSystems Studio
- [ ] Add a `Container` → set `ExtendedClass = "loop-split-btn"`
- [ ] Inside, place the **action** `Button`:
  - `ExtendedClass = "loop-split-btn__action"`
  - Style = Primary (or as per design)
  - Label = action label text
  - `OnClick` → primary action handler
- [ ] Inside, place the **toggle** `Button`:
  - `ExtendedClass = "loop-split-btn__toggle"`
  - Style = Primary (must match action for filled variant; (default) for mixed)
  - Label = `▾` or chevron icon
  - `OnClick` → toggle popup / popover

### QA
- [ ] Both halves sit flush; no visible gap or double border at the shared edge
- [ ] Primary+Primary: thin white separator visible at the shared edge
- [ ] Focus ring fully visible on each half (not clipped by the other)
- [ ] Keyboard: Tab focuses each half independently; Space/Enter activates
- [ ] `@media (prefers-reduced-motion: reduce)` suppresses transitions
- [ ] RTL: pill corners swap correctly (logical properties used throughout)
