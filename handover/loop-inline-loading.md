# Handover — loop-inline-loading (custom CSS block)

The Loop **Inline Loading** — an inline "generating…" indicator: a leading sparkle,
an optional label, and a trailing animated spinner.
Source: user screenshot ("Generating case data") + provided sparkle SVG. **No Figma ref.**

**Approach:** Custom component, no native OutSystems widget equivalent, **no JavaScript**.
A pure-CSS BEM block placed as static markup inside a Container/Block; the motion is pure
CSS `@keyframes` (sparkle twinkle + spinner rotate), disabled under `prefers-reduced-motion`.
Modeled on the OutSystems UI "Loading" pattern — the label and the trailing spinner are each
optional.

> **Convention note (deliberate exception).** House rule is "component icons are FA glyphs,
> never inline SVG." Here the leading **sparkle is kept as inline SVG** so each of its two
> stars can be animated independently — an intentional, signed-off exception for this one
> brand mark. It must carry `fill="currentColor"` (NOT the `#004370` the raw source SVG
> hard-codes) so color stays token-driven. The **trailing spinner** follows the rule: it is
> the FA6 Pro `spinner-third` glyph (`f3f4`), not an SVG.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Inline Loading page.

**What it is.** An inline, in-flow loading/"generating" indicator (CSS block): sparkle +
optional label + optional spinner, sized to sit next to or inside content.

**When to use**
- A short, in-context async operation with a status label ("Generating case data", "Summarizing documents").
- Anywhere a small inline busy state reads better than a full-page or overlay loader.

**When not to use** (reach for instead)
- A whole page/section is loading → a page-level loading/skeleton pattern.
- A button's own in-place busy state → the native OSUI **ButtonLoading** pattern.
- A determinate percentage → a Progress Bar.

**How to use**
- Place a Container with ExtendedClass `loop-inline-loading` (role `status`, aria-live `polite`)
  holding the sparkle SVG, an optional label span, and an optional spinner glyph (see markup below).

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-inline-loading.css` | Included automatically in `dist/theme.css` — paste theme into ODC Theme editor |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-inline-loading.css</code> → Theme CSS (also folded into dist/theme.css)</summary>

```css
/* ============================================
   Component: Inline Loading  ("The Loop" — loop/inline-loading)
   Source: user screenshot ("Generating case data") + provided sparkle SVG.
           No frozen Figma ref exists for this item — manual build.
   Approach: NET-NEW CSS-only BEM block (no native OSUI widget, no Web Component,
             no JS). The developer places static markup in an ODC Block/Container
             and this theme override animates it. Modeled on the OSUI "Loading"
             pattern: a leading sparkle, an optional label, and a trailing spinner.
   Location: Theme CSS (paste below OutSystems UI so it wins on equal specificity).
   Escalation Level: L2/L3 (custom block + token-driven theme override).

   Structure (all three children optional — omit an element to drop that part):
     .loop-inline-loading            flex row: icon + label + spinner
       .loop-inline-loading__icon      leading sparkle wrapper (aria-hidden)
         .loop-inline-loading__sparkle   inline <svg>, viewBox 0 0 18 18
           .loop-inline-loading__star      the two four-pointed stars (--lg / --sm)
       .loop-inline-loading__label     text ("Generating case data")
       .loop-inline-loading__spinner   FA6 Pro 'spinner-third' glyph (f3f4), aria-hidden

   Motion (pure CSS @keyframes, killed under prefers-reduced-motion):
     · the trailing spinner glyph rotates 0 → 360° (~850ms, matching OSUI ButtonLoading);
     · the two sparkle stars twinkle (opacity + scale pulse), staggered so it shimmers.

   State: loading is the DEFAULT (bare .loop-inline-loading — animations run). Add the
     `--done` modifier when the operation FINISHES to freeze all motion (spinner rests as a
     static arc, sparkle at full opacity) without changing the markup. In ODC toggle it via
     ExtendedClass = "loop-inline-loading" + If(IsDone, " loop-inline-loading--done", "").

   Colour: the container sets `color` to the WB blue-70 icon role; the sparkle paths
     (fill:currentColor) and the spinner glyph inherit it. NOTE the sparkle is kept as
     inline SVG artwork (a user-directed exception to the usual FA-glyph-only rule) so
     it can be animated per path; its markup must carry fill="currentColor" (NOT the
     #004370 the source SVG hard-codes) so it stays token-driven.

   Tokens consumed: --color-icon-on-light-primary (blue-70), --font-family-body,
     --font-family-icon, --font-weight-icon-solid, --font-weight-bold, --line-height-base,
     and the namespaced --loop-inline-loading-* below (each with a literal fallback).
   ============================================ */

.loop-inline-loading {
  display: inline-flex;
  align-items: center;
  gap: var(--loop-inline-loading-gap, var(--space-xxsmall, 8px));
  box-sizing: border-box;
  color: var(--color-icon-on-light-primary, #004370);
}

/* ---- Leading sparkle (inline SVG artwork) ---- */
.loop-inline-loading__icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width:  var(--loop-inline-loading-icon-size, 20px);
  height: var(--loop-inline-loading-icon-size, 20px);
}
.loop-inline-loading__sparkle {
  display: block;
  width: 100%;
  height: 100%;
}
/* both stars pulse; each scales about its OWN centre (fill-box), the small one offset
   so the pair shimmers rather than blinking in unison */
.loop-inline-loading__star {
  transform-box: fill-box;
  transform-origin: center;
  animation: loop-inline-loading-twinkle
             var(--loop-inline-loading-twinkle-dur, 1.6s) ease-in-out infinite;
}
.loop-inline-loading__star--sm {
  animation-delay: var(--loop-inline-loading-twinkle-stagger, -0.8s);
}

/* ---- Label ---- */
/* defaults to the body base size (--font-size-300, 16px); override the alias to resize */
.loop-inline-loading__label {
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size:   var(--loop-inline-loading-label-size, var(--font-size-300, 16px));
  font-weight: var(--font-weight-bold, 700);
  line-height: var(--line-height-base, 1.5);
  color:       var(--color-icon-on-light-primary, #004370);
}

/* ---- Trailing spinner (FA6 Pro 'spinner-third' glyph, rotated) ---- */
.loop-inline-loading__spinner {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width:  var(--loop-inline-loading-spinner-size, 18px);
  height: var(--loop-inline-loading-spinner-size, 18px);
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-solid, 900);
  font-size:   var(--loop-inline-loading-spinner-size, 18px);
  font-style:  normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  will-change: transform;
  animation: loop-inline-loading-spin
             var(--loop-inline-loading-spin-dur, 0.85s) linear infinite;
}

@keyframes loop-inline-loading-spin {
  to { transform: rotate(360deg); }
}
@keyframes loop-inline-loading-twinkle {
  0%, 100% { opacity: 0.55; transform: scale(0.85); }
  50%      { opacity: 1;    transform: scale(1); }
}

/* ---- State: finished ---- */
/* --done freezes all motion once the operation completes (spinner static, sparkle at
   full opacity). Same rest state the reduced-motion block below produces. */
.loop-inline-loading--done .loop-inline-loading__spinner,
.loop-inline-loading--done .loop-inline-loading__star {
  animation: none;
}
.loop-inline-loading--done .loop-inline-loading__star { opacity: 1; }

/* Reduced motion — no rotation, no twinkle. The spinner rests as a static partial
   arc and the sparkle sits at full opacity so both stay legible. */
@media (prefers-reduced-motion: reduce) {
  .loop-inline-loading__spinner,
  .loop-inline-loading__star {
    animation: none;
  }
  .loop-inline-loading__star { opacity: 1; }
}
```

</details>

## Usage in OutSystems

Build this structure (Containers + an Expression for the label; the sparkle SVG and spinner
glyph go in Expressions with **Escape Content = No**):

```html
<div class="loop-inline-loading" role="status" aria-live="polite">
  <!-- leading sparkle (decorative) -->
  <span class="loop-inline-loading__icon" aria-hidden="true">
    <svg class="loop-inline-loading__sparkle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none">
      <path class="loop-inline-loading__star loop-inline-loading__star--lg" fill="currentColor" d="M16.1133 7.86157C12.0633 6.74324 11.2211 5.90013 10.1026 1.85089C10.0671 1.72211 9.95015 1.6333 9.81693 1.6333C9.6837 1.6333 9.56676 1.72212 9.53124 1.85089C8.41291 5.90089 7.56981 6.7431 3.52056 7.86157C3.39178 7.89709 3.30371 8.01403 3.30371 8.14726C3.30371 8.28048 3.39253 8.39742 3.52056 8.43294C7.57056 9.55127 8.41277 10.3944 9.53124 14.4436C9.56676 14.5724 9.6837 14.6612 9.81693 14.6612C9.95015 14.6612 10.0671 14.5724 10.1026 14.4436C11.2209 10.3936 12.064 9.55141 16.1133 8.43294C16.2421 8.39742 16.3301 8.28048 16.3301 8.14726C16.3301 8.01403 16.2413 7.89709 16.1133 7.86157Z"/>
      <path class="loop-inline-loading__star loop-inline-loading__star--sm" fill="currentColor" d="M7.08376 13.0426C5.51024 12.6081 5.20827 12.3062 4.77388 10.7327C4.73836 10.6039 4.62142 10.5151 4.4882 10.5151C4.35498 10.5151 4.23803 10.604 4.20251 10.7327C3.76804 12.3063 3.46608 12.6082 1.89263 13.0426C1.76385 13.0781 1.67578 13.1951 1.67578 13.3283C1.67578 13.4615 1.7646 13.5785 1.89263 13.614C3.46616 14.0484 3.76812 14.3504 4.20251 15.9239C4.23803 16.0526 4.35498 16.1414 4.4882 16.1414C4.62142 16.1414 4.73836 16.0526 4.77388 15.9239C5.20835 14.3503 5.51031 14.0484 7.08376 13.614C7.21254 13.5785 7.30061 13.4615 7.30061 13.3283C7.30061 13.1951 7.2118 13.0781 7.08376 13.0426Z"/>
    </svg>
  </span>
  <!-- optional label -->
  <span class="loop-inline-loading__label">Generating case data</span>
  <!-- optional trailing spinner: FA6 Pro spinner-third (f3f4) -->
  <i class="loop-inline-loading__spinner" aria-hidden="true">&#xf3f4;</i>
</div>
```

**State — loading vs finished.** Loading is the default (bare `loop-inline-loading`, animations
run). When the operation finishes, add the `loop-inline-loading--done` modifier to freeze all
motion (spinner rests as a static arc, sparkle at full opacity) — no markup change:
```html
<div class="loop-inline-loading loop-inline-loading--done" role="status" aria-live="polite"> … </div>
```

**Recommended Block structure:**
```
Container (ExtendedClass = "loop-inline-loading" + If(IsDone," loop-inline-loading--done","")
           · role=status · aria-live=polite)
  ├─ Container (loop-inline-loading__icon · aria-hidden=true)
  │     └─ Expression (Escape Content = No) → the sparkle <svg> above
  ├─ If Label <> "" → Expression (loop-inline-loading__label) = Label
  └─ If ShowSpinner → Expression (loop-inline-loading__spinner · aria-hidden=true, Escape Content = No) → "&#xf3f4;"
```
Omit the label element or the spinner element to drop that part. Drive the `IsDone` Boolean
from the same signal that ends your async action.

## API (CSS tokens)
| Token | Default | Description |
|---|---|---|
| `--loop-inline-loading-gap` | `8px` (`--space-xxsmall`) | Gap between sparkle, label and spinner |
| `--loop-inline-loading-icon-size` | `20px` | Sparkle box size |
| `--loop-inline-loading-label-size` | `16px` (`--font-size-300`, body base) | Label text size |
| `--loop-inline-loading-spinner-size` | `18px` | Spinner glyph box + size |
| `--loop-inline-loading-spin-dur` | `0.85s` | Spinner rotation period (matches OSUI ButtonLoading) |
| `--loop-inline-loading-twinkle-dur` | `1.6s` | Sparkle twinkle period |
| `--loop-inline-loading-twinkle-stagger` | `-0.8s` | Delay offsetting the small star from the large one |

Color: sparkle + label + spinner all resolve to `--color-icon-on-light-primary` (blue-70 `#004370`)
via `currentColor` on the container — no per-part color needed.

## Accessibility (WCAG 2.2 AA)
- Container is `role="status"` + `aria-live="polite"` so screen readers announce the label
  (or set `aria-label` when there is no visible label — see the "spinner only" example).
- The sparkle SVG and the spinner glyph are decorative → `aria-hidden="true"`.
- Motion respects `prefers-reduced-motion: reduce` — rotation and twinkle stop; the sparkle
  rests at full opacity and the spinner as a static arc, both still legible.
- No interactive element; nothing to focus. Color is brand blue-70 on light, driven by tokens.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, scaffold a reusable "InlineLoading" Block for the WBG
"The Loop" inline loading indicator (a leading sparkle, an optional label, and a
trailing animated spinner).

Context (already done): loop-inline-loading.css, dist/tokens.css and dist/theme.css are
already pasted into the ODC Theme editor (below OutSystems UI). The look AND the motion are
pure CSS + tokens (CSS @keyframes) — there is nothing for you to style, and you must not
write or edit CSS. This component is NOT a native-widget restyle: it is static HTML markup
you place inside a Container, not a stock OutSystems widget.

Task — build the Block and its structure by name:
1. Create a Block "InlineLoading" with a Text input "Label" (Text, default ""), a Boolean
   input "ShowSpinner" (default True) and a Boolean input "IsDone" (default False).
2. Inside it place a Container whose ExtendedClass expression is
   "loop-inline-loading" + If(IsDone, " loop-inline-loading--done", "") — the --done modifier
   freezes the sparkle twinkle + spinner rotation once the operation finishes — with role
   "status" and aria-live "polite". Give it three children:
   - a Container (ExtendedClass "loop-inline-loading__icon", aria-hidden "true") holding the
     sparkle inline SVG exactly as provided in this handover (fill="currentColor");
   - an Expression (ExtendedClass "loop-inline-loading__label") bound to the Label input,
     wrapped in an If so it renders only when Label is not empty;
   - an Icon/Container (ExtendedClass "loop-inline-loading__spinner", aria-hidden "true")
     carrying the Font Awesome "spinner-third" glyph, wrapped in an If on ShowSpinner.
3. Build any screen/Block logic the screen needs around it.

Constraints: never edit the OutSystems UI module; add no CSS and no hard-coded colors/sizes
(all values come from the pasted theme tokens). After generating, list what you created by
name and flag anything you could not finish.
```

## Checklist
- [ ] Rebuild `dist/theme.css` (`npm run build:theme`) and paste into the ODC Theme editor.
- [ ] In a test screen, add a Container with ExtendedClass `loop-inline-loading` + the child structure above.
- [ ] Confirm the sparkle twinkles and the spinner rotates; test label-omitted and spinner-omitted variants.
- [ ] Toggle OS "reduce motion" → animations stop, content stays legible.
- [ ] 1-Click Publish → validate in a **real browser** (never Service Studio Preview).
