# Handover — `<loop-shadow-reference>` (Live Style Guide: elevation / shadows)

The shadow counterpart to `<loop-color-reference>` and `<loop-typography-reference>`.
One vanilla-JS Web Component that auto-renders the **elevation (drop-shadow) scale** in
the **Live Style Guide** — each step with a live specimen, its resolved value and a
click-to-copy CSS-variable chip, with **no rows built by hand** in Service Studio.

Figma reference: effects page [node:19737-9489].

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Shadow page.

**What it is.** `<loop-shadow-reference>`, which auto-renders the `--shadow-*` elevation
scale in the Live Style Guide, read live from the theme.

**When to use**
- Documenting the elevation system on a Style Guide page.
- Looking up the right shadow token to reference in custom component CSS.

**When not to use** (reach for instead)
- For radius / border-width use `<loop-border-reference>`; for spacing use
  `<loop-spacing-reference>`; color → `<loop-color-reference>`; type → `<loop-typography-reference>`.

**How to use**
- Drop `<loop-shadow-reference>` on a Style Guide page — it reads each token's value live
  from the theme, no rows built by hand.

## Why this approach
The component reads each token's value **live** via `getComputedStyle(:root)` at render
time — it never hard-codes a value, so the specimens can't drift from `dist/theme.css`.

## Files
| File | OutSystems destination |
|---|---|
| `tokens/shadows.css` | Included automatically in `dist/theme.css` — paste theme into the ODC Theme editor |
| `tokens/shadow-utilities.css` | The `.shadow-*` utility classes; ships in `dist/theme.css` (nothing extra to paste) |
| `src/components/loop-shadow-reference.js` | Add to the app's **Resources** (or a Scripts folder), set to load on the Style-Guide screen |

### Utility classes
The theme ships one elevation utility per scale step (attach via **ExtendedClass** — hard rule #7):

| Class | Resolves to |
|---|---|
| `.shadow-none` | `box-shadow: none` (reset) |
| `.shadow-lowest` | `var(--shadow-lowest)` |
| `.shadow-low` | `var(--shadow-low)` |
| `.shadow-regular` | `var(--shadow-regular)` |
| `.shadow-medium` | `var(--shadow-medium)` |
| `.shadow-high` | `var(--shadow-high)` |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-shadow-reference.js</code> → Add to Resources — load on the Style-Guide screen</summary>

```js
/**
 * <loop-shadow-reference> — auto-rendered Live Style Guide reference for the SHADOW
 * (elevation) scale.
 *
 * The shadow counterpart to <loop-color-reference> / <loop-typography-reference>: drop
 * this one file into ODC (Resources) and place a single <loop-shadow-reference> element
 * on a Style-Guide screen. It renders every elevation token with a LIVE specimen, its
 * resolved value and a click-to-copy CSS-variable chip — NO rows built by hand.
 *
 * Source of truth = the theme. The component never hard-codes a value; it reads each
 * token live via getComputedStyle(:root) at render time, so specimens always match
 * dist/theme.css (tokens/shadows.css + the matching .shadow-* utility classes in
 * tokens/shadow-utilities.css). The SHADOWS name list mirrors those files.
 *
 * Attributes:
 *   heading   Optional section heading (default: "Shadows · elevation")
 *   intro     Optional intro line under the heading
 *
 * Behaviour: each CSS-variable chip is a button — click to copy (with a ✓ cue).
 * Accessibility: specimens are decorative (aria-hidden); value + name carry meaning;
 * copy buttons have aria-labels; brand focus ring; honors prefers-reduced-motion.
 * No framework (CLAUDE.md hard rule #6 — vanilla Web Component).
 */
(function () {
  /* Elevation / drop-shadow scale — mirrors tokens/shadows.css (--shadow-<name>). */
  const SHADOWS = [
    { name: "lowest",  label: "Lowest",  use: "Subtle lift — flat cards, hover hint" },
    { name: "low",     label: "Low",     use: "Resting cards, inputs" },
    { name: "regular", label: "Regular", use: "Raised cards, dropdowns" },
    { name: "medium",  label: "Medium",  use: "Popovers, menus" },
    { name: "high",    label: "High",    use: "Modals, dialogs — highest elevation" },
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  function val(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }

  class LoopShadowReference extends HTMLElement {
    static get observedAttributes() { return ["heading", "intro"]; }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._onCopy = this._onCopy.bind(this);
    }

    connectedCallback() { this._render(); }
    attributeChangedCallback(n, o, v) { if (o !== v && this.shadowRoot.childElementCount) this._render(); }

    get _heading() { return this.getAttribute("heading") || "Shadows · elevation"; }
    get _intro() { return this.getAttribute("intro") || ""; }

    _render() {
      const intro = this._intro ? `<p class="lsr__intro">${esc(this._intro)}</p>` : "";
      this.shadowRoot.innerHTML = `
        <style>${this._css()}</style>
        <section class="lsr" part="root">
          <h2 class="lsr__heading">${esc(this._heading)}</h2>
          ${intro}
          <p class="lsr__note">Drop-shadow scale (<code>--shadow-*</code>). Attach the matching <code>.shadow-*</code> utility class via <strong>ExtendedClass</strong>, or reference the variable in custom CSS (<code>box-shadow: var(--shadow-regular)</code>). All steps share one shadow color token (<code>--shadow-color</code>); <code>.shadow-none</code> resets elevation.</p>
          <div class="lsr__grid">${this._cards()}</div>
        </section>`;
      this.shadowRoot.querySelectorAll("button.lsr__copy").forEach((b) =>
        b.addEventListener("click", this._onCopy)
      );
    }

    _cards() {
      return SHADOWS.map((s) => {
        const v = `--shadow-${s.name}`;
        const resolved = val(v) || "—";
        return `
          <figure class="lsr__item">
            <div class="lsr__chip" aria-hidden="true" style="box-shadow:var(${v})"></div>
            <figcaption class="lsr__cap">
              <span class="lsr__cap-name">${esc(s.label)}</span>
              <span class="lsr__cap-use">${esc(s.use)}</span>
              <span class="lsr__mono">${esc(resolved)}</span>
              <span class="lsr__chips">${this._copyBtn(".shadow-" + s.name)}${this._copyBtn(v)}</span>
            </figcaption>
          </figure>`;
      }).join("");
    }

    _copyBtn(text) {
      return `<button type="button" class="lsr__copy" data-copy="${esc(text)}" aria-label="Copy ${esc(text)}"><code>${esc(text)}</code></button>`;
    }

    _onCopy(e) {
      const btn = e.currentTarget;
      const text = btn.getAttribute("data-copy");
      const done = () => { btn.classList.add("is-copied"); setTimeout(() => btn.classList.remove("is-copied"), 1200); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
      } else { fallbackCopy(text, done); }
    }

    _css() {
      return `
:host { display: block;
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  color: var(--color-text-on-light-default, #000d1ab2); }
.lsr__heading { font-size: 24px; font-weight: var(--font-weight-bold, 700);
  margin: 0 0 8px; color: var(--color-text-on-light-headers, #00263e); }
.lsr__intro { margin: 0 0 16px; font-size: 14px; color: var(--color-text-on-light-subdued, #586e84); }
.lsr__note { margin: 0 0 24px; font-size: 13px; color: var(--color-text-on-light-subdued, #586e84); }
.lsr__note code { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: 12px; }
.lsr__mono { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px; color: var(--color-text-on-light-default, #00263e); }
.lsr__cap-name { font-weight: 600; font-size: 13px; color: var(--color-text-on-light-headers, #00263e); }
.lsr__cap-use { font-size: 12px; color: var(--color-text-on-light-subdued, #586e84); }

.lsr__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 24px; }
.lsr__item { margin: 0; padding: 8px; }
.lsr__chip { height: 72px; border-radius: var(--radius-medium, 8px); background: var(--color-white, #fff); }
.lsr__cap { display: flex; flex-direction: column; gap: 3px; margin-top: 18px; }
.lsr__chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }

.lsr__copy { font: inherit; border: 0; background: var(--color-neutral-05, #f5f7f9);
  padding: 3px 8px; border-radius: 4px; cursor: pointer;
  color: var(--color-text-on-light-link-primary-enabled, #004370); }
.lsr__copy code { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: 12px; color: inherit; }
.lsr__copy:hover { background: var(--color-neutral-10, #e7edf3); }
.lsr__copy:focus-visible { outline: 2px solid var(--color-domain-interactive-focused, #0071bc); outline-offset: 1px; }
.lsr__copy.is-copied { color: var(--color-text-on-light-state-success, #234f03); }
.lsr__copy.is-copied::after { content: " ✓"; }
@media (prefers-reduced-motion: reduce) { .lsr__copy { transition: none; } }
`;
    }
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.position = "absolute"; ta.style.left = "-9999px";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); done(); } catch (_) { /* no-op */ }
    document.body.removeChild(ta);
  }

  if (!customElements.get("loop-shadow-reference")) {
    customElements.define("loop-shadow-reference", LoopShadowReference);
  }
})();
```

</details>















## Using `<loop-shadow-reference>` in ODC
1. `npm run build:theme` and paste `dist/theme.css` into the ODC Theme editor (ships the
   `--shadow-*` and `--shadow-color` tokens).
2. Add `loop-shadow-reference.js` to the app **Resources** (Deploy Action: *Deploy to
   Target Directory*) — or load it via a Scripts block on the Style-Guide screen.
3. On the **Live Style Guide** screen, add an **HTML Element** (tag `loop-shadow-reference`):
   ```html
   <loop-shadow-reference
     intro="Elevation scale, generated live from the WBG / The Loop theme.">
   </loop-shadow-reference>
   ```
4. Publish → open in a **real browser** (not Service Studio Preview, hard rule #2).

### Attributes
| Attribute | Default | Description |
|---|---|---|
| `heading` | `Shadows · elevation` | Section heading |
| `intro` | — | Intro line under the heading |

### Consuming elevation
```html
<!-- Attach the utility class via ExtendedClass (preferred for widgets) -->
<div class="my-card shadow-regular">…</div>
```
```css
/* …or reference the token in custom component CSS */
.my-card { box-shadow: var(--shadow-regular); }   /* hard rule #3 — never hard-code */
```

## Keeping in sync
When you add or rename a shadow token in `tokens/shadows.css`:
1. Mirror the name in `tokens/shadow-utilities.css` (one `.shadow-<name>` class).
2. Mirror the name in the `SHADOWS` manifest at the top of
   `src/components/loop-shadow-reference.js`.
3. `npm run build:theme` and re-run `node build/embed-handover-code.mjs` to refresh the
   pasted code below.

## Accessibility (WCAG 2.2 AA)
- Specimens are decorative (`aria-hidden`); the value + token name carry the meaning.
- Copy buttons have `aria-label`s; focus ring uses `--color-domain-interactive-focused`;
  `prefers-reduced-motion` honored.

## Checklist
- [ ] `npm run build:theme` and paste `dist/theme.css` into the ODC Theme editor.
- [ ] Add `loop-shadow-reference.js` to Resources; load it on the Style-Guide screen.
- [ ] Place `<loop-shadow-reference>` via an HTML Element; publish.
- [ ] Validate in a **real browser**: specimens cast, values populate, click-to-copy works.
