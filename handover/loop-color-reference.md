# Handover — Primitive color utilities + `<loop-color-reference>` (Live Style Guide)

Two deliverables that work together:

1. **Primitive color utility classes** — `.background-<name>` / `.text-<name>` for every
   primitive color token (the ramps), in the OutSystems UI mould. Generated from
   `tokens/colors.css`, folded into the theme automatically.
2. **`<loop-color-reference>`** — a vanilla-JS Web Component that auto-renders the whole
   color reference page (swatch + Hex + Background Class + Text Class + CSS Variable,
   grouped by ramp) in the **Live Style Guide**, with **no rows built by hand** in
   Service Studio. This is the "fast import".

Figma reference: Live Style Guide "Color values, variables and classes" view.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Color page.

**What it is.** Primitive color utility classes plus `<loop-color-reference>`, which auto-renders the full color reference in the Live Style Guide.

**When to use**
- Documenting the color system on a Live Style Guide page.
- Applying a primitive color directly with `.background-<name>` / `.text-<name>`.

**When not to use** (reach for instead)
- For component theming, prefer **semantic role tokens** over raw primitive utilities so colors stay re-themeable.

**How to use**
- Drop `<loop-color-reference>` on a Style Guide page — it reads each token's value live from the theme, no rows built by hand.

## Why this approach
Building ~129 color rows × (swatch + 4 cells) by hand in ODC is hours of fragile work.
Instead: paste the theme (classes ship automatically) + drop one JS file + place one
element. The component reads each token's value **live from the theme** at render time —
it never hard-codes a hex, so the table can't drift from `dist/theme.css`.

## Files
| File | OutSystems destination |
|---|---|
| `tokens/color-utilities-primitives.css` | Included automatically in `dist/theme.css` — paste theme into ODC Theme editor |
| `src/components/loop-color-reference.js` | Add to the app's **Resources** (or a Scripts folder), set to load on the Style-Guide screen |
| `build/gen-color-utilities.mjs` | Build tooling — regenerates the CSS from `colors.css` |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-color-reference.js</code> → Add to Resources — load on the Style-Guide screen</summary>

```js
/**
 * <loop-color-reference> — auto-rendered Live Style Guide color reference.
 *
 * The "fast import": drop this one file into ODC (Resources) and place a single
 * <loop-color-reference> element on a Style-Guide screen. It renders the entire
 * primitive-color reference — swatch + Hex + Background Class + Text Class + CSS
 * Variable, grouped by ramp — with NO hand-building of rows in Service Studio.
 *
 * Single source of truth = the theme. The component never hard-codes a hex; it reads
 * each token's live value via getComputedStyle(:root) at render time, so the table
 * always matches dist/theme.css. The token NAME list below mirrors tokens/colors.css
 * (and the generated .background-/.text- utilities in
 * tokens/color-utilities-primitives.css). When you add a primitive to colors.css,
 * rerun `npm run gen:color-utilities` for the classes and add the name here.
 *
 * Attributes:
 *   heading    Optional section heading (default: "Color values, variables and classes")
 *   intro      Optional intro line under the heading
 *   no-swatch-grid   Boolean — hide the at-a-glance ramp grid, show only the tables
 *   filter     Optional comma list of group keys to show (e.g. "blue,red,green")
 *
 * Behaviour: each class / variable cell is a button — click to copy to clipboard
 * (with a transient "Copied" cue). Fully keyboard accessible.
 *
 * Accessibility: real <table> with scope'd headers + <caption>; swatch is decorative
 * (aria-hidden) — the hex/name carry the meaning; copy buttons have aria-labels;
 * focus rings use the brand focus token; honors prefers-reduced-motion.
 *
 * No framework (CLAUDE.md hard rule #6 — vanilla Web Component).
 */
(function () {
  /* Group key → { title, names[] }. Order + grouping mirror tokens/colors.css.
   * `names` are the token suffixes after `--color-`. */
  const GROUPS = [
    { key: "brand", title: "Brand & generic", names: [
      "white", "black", "wb-brand-dark-blue",
    ] },
    { key: "blue", title: "Blue — WB primary hue", names: [
      "blue-05", "blue-10", "blue-20", "blue-30", "blue-40", "blue-50",
      "blue-60", "blue-70", "blue-80", "blue-90", "blue-100", "blue-120",
    ] },
    { key: "neutral", title: "Neutral (solid)", names: [
      "neutral-05", "neutral-10", "neutral-15", "neutral-20", "neutral-30",
      "neutral-40", "neutral-50", "neutral-60", "neutral-70", "neutral-80",
      "neutral-90", "neutral-95",
    ] },
    { key: "neutral-alpha", title: "Neutral (alpha)", names: [
      "neutral-alpha-02", "neutral-alpha-04", "neutral-alpha-08", "neutral-alpha-16",
      "neutral-alpha-24", "neutral-alpha-42", "neutral-alpha-57", "neutral-alpha-65",
      "neutral-alpha-70", "neutral-alpha-95",
    ] },
    { key: "gray-alpha", title: "Gray (alpha)", names: [
      "gray-alpha-black-08", "gray-alpha-black-16", "gray-alpha-black-24",
      "gray-alpha-black-48", "gray-alpha-black-60", "gray-alpha-white-16",
      "gray-alpha-white-24", "gray-alpha-white-48", "gray-alpha-white-60",
      "gray-alpha-white-75", "gray-alpha-white-90",
    ] },
    { key: "red", title: "Red", names: [
      "red-10", "red-20", "red-30", "red-40", "red-50", "red-60", "red-70", "red-80", "red-90",
    ] },
    { key: "green", title: "Green", names: [
      "green-03", "green-30", "green-on-dark-07", "green-on-dark-base",
      "green-60", "green-70", "green-base", "green-07",
    ] },
    { key: "yellow", title: "Yellow", names: [
      "yellow-10", "yellow-03", "yellow-on-dark-base", "yellow-on-dark-07",
      "yellow-50", "yellow-60", "yellow-05", "yellow-base", "yellow-90",
    ] },
    { key: "purple", title: "Purple", names: [
      "purple-10", "purple-20", "purple-30", "purple-40", "purple-50",
      "purple-60", "purple-70", "purple-80", "purple-90",
    ] },
    { key: "accent-orange", title: "Accent · Orange", names: ramp("accent-orange") },
    { key: "accent-pale-green", title: "Accent · Pale Green", names: ramp("accent-pale-green") },
    { key: "accent-teal", title: "Accent · Teal", names: ramp("accent-teal") },
    { key: "accent-indigo", title: "Accent · Indigo", names: ramp("accent-indigo") },
    { key: "accent-magenta", title: "Accent · Magenta", names: ramp("accent-magenta") },
  ];

  /* The accent ramps all share the same 10…90 steps. */
  function ramp(prefix) {
    return [10, 20, 30, 40, 50, 60, 70, 80, 90].map((n) => `${prefix}-${n}`);
  }

  /* "accent-orange-50" → "Accent Orange 50"; "wb-brand-dark-blue" → "WB Brand Dark Blue". */
  function label(name) {
    return name
      .split("-")
      .map((w) => (w === "wb" ? "WB" : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(" ");
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  class LoopColorReference extends HTMLElement {
    static get observedAttributes() { return ["heading", "intro", "no-swatch-grid", "filter"]; }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._onCopy = this._onCopy.bind(this);
    }

    connectedCallback() { this._render(); }
    attributeChangedCallback(n, o, v) { if (o !== v && this.shadowRoot.childElementCount) this._render(); }

    get _heading() { return this.getAttribute("heading") || "Color values, variables and classes"; }
    get _intro()   { return this.getAttribute("intro") || ""; }
    get _grid()    { return !this.hasAttribute("no-swatch-grid"); }
    get _filter()  {
      const f = this.getAttribute("filter");
      return f ? f.split(",").map((s) => s.trim()).filter(Boolean) : null;
    }

    /* Live token value (authored hex/rgba string), read from :root. */
    _value(name) {
      return getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();
    }

    _groups() {
      const f = this._filter;
      return f ? GROUPS.filter((g) => f.includes(g.key)) : GROUPS;
    }

    _render() {
      const groups = this._groups();
      const grid = this._grid ? this._gridHtml(groups) : "";
      const tables = groups.map((g) => this._tableHtml(g)).join("");
      const intro = this._intro ? `<p class="lcr__intro">${esc(this._intro)}</p>` : "";

      this.shadowRoot.innerHTML = `
        <style>${this._css()}</style>
        <section class="lcr" part="root">
          <h2 class="lcr__heading">${esc(this._heading)}</h2>
          ${intro}
          ${grid}
          ${tables}
        </section>`;

      this.shadowRoot.querySelectorAll("button.lcr__copy").forEach((b) =>
        b.addEventListener("click", this._onCopy)
      );
    }

    _gridHtml(groups) {
      const cells = groups
        .map((g) => {
          const chips = g.names
            .map((name) => {
              const v = this._value(name);
              return `<span class="lcr__chip" style="background:${esc(v)}" title="--color-${esc(name)}: ${esc(v)}"></span>`;
            })
            .join("");
          return `<figure class="lcr__ramp"><div class="lcr__ramp-chips">${chips}</div><figcaption>${esc(g.title)}</figcaption></figure>`;
        })
        .join("");
      return `<div class="lcr__grid" aria-hidden="true">${cells}</div>`;
    }

    _tableHtml(g) {
      const rows = g.names
        .map((name) => {
          const v = this._value(name) || "—";
          const bg = `background-${name}`;
          const tx = `text-${name}`;
          const cssVar = `--color-${name}`;
          return `
            <tr>
              <th scope="row" class="lcr__name">
                <span class="lcr__swatch" style="background:${esc(v)}" aria-hidden="true"></span>
                <span>${esc(label(name))}</span>
              </th>
              <td class="lcr__hex"><code>${esc(v)}</code></td>
              <td>${this._copyBtn("." + bg)}</td>
              <td>${this._copyBtn("." + tx)}</td>
              <td>${this._copyBtn(cssVar)}</td>
            </tr>`;
        })
        .join("");

      return `
        <div class="lcr__group">
          <h3 class="lcr__group-title">${esc(g.title)}</h3>
          <table class="lcr__table">
            <caption class="lcr__caption">${esc(g.title)} color tokens, values, utility classes and CSS variables</caption>
            <thead>
              <tr>
                <th scope="col">Color</th>
                <th scope="col">Hex</th>
                <th scope="col">Background Class</th>
                <th scope="col">Text Class</th>
                <th scope="col">CSS Variable</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    }

    _copyBtn(text) {
      return `<button type="button" class="lcr__copy" data-copy="${esc(text)}" aria-label="Copy ${esc(text)}"><code>${esc(text)}</code></button>`;
    }

    _onCopy(e) {
      const btn = e.currentTarget;
      const text = btn.getAttribute("data-copy");
      const done = () => {
        btn.classList.add("is-copied");
        setTimeout(() => btn.classList.remove("is-copied"), 1200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
      } else {
        fallbackCopy(text, done);
      }
    }

    _css() {
      return `
:host { display: block;
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  color: var(--color-text-on-light-default, #000d1ab2); }

.lcr__heading { font-size: 24px; font-weight: var(--font-weight-bold, 700);
  margin: 0 0 8px; color: var(--color-text-on-light-headers, #00263e); }
.lcr__intro { margin: 0 0 24px; font-size: 14px; color: var(--color-text-on-light-subdued, #586e84); }

/* --- at-a-glance ramp grid --- */
.lcr__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px; margin: 0 0 32px; }
.lcr__ramp { margin: 0; }
.lcr__ramp-chips { display: flex; height: 28px; border-radius: var(--border-radius-soft, 6px);
  overflow: hidden; box-shadow: inset 0 0 0 1px var(--color-neutral-alpha-16, #00396b29); }
.lcr__chip { flex: 1 1 auto; min-width: 0; }
.lcr__ramp figcaption { margin-top: 6px; font-size: 12px; font-weight: 600;
  color: var(--color-text-on-light-subdued, #586e84); }

/* --- per-ramp tables --- */
.lcr__group { margin: 0 0 28px; }
.lcr__group-title { font-size: 16px; font-weight: var(--font-weight-bold, 700);
  margin: 0 0 8px; color: var(--color-text-on-light-headers, #00263e); }
.lcr__caption { position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap; }

.lcr__table { width: 100%; border-collapse: collapse; font-size: 13px; }
.lcr__table thead th { text-align: left; font-weight: 600; font-size: 12px;
  color: var(--color-text-on-light-subdued, #586e84);
  padding: 10px 12px; border-bottom: 1px solid var(--color-neutral-15, #dae3eb); }
.lcr__table tbody td, .lcr__table tbody th { padding: 8px 12px;
  border-bottom: 1px solid var(--color-neutral-10, #e7edf3); vertical-align: middle; }

.lcr__name { display: flex; align-items: center; gap: 10px; font-weight: 600;
  font-size: 13px; color: var(--color-text-on-light-default, #00263e); white-space: nowrap; }
.lcr__swatch { width: 28px; height: 28px; flex: 0 0 auto;
  border-radius: var(--border-radius-soft, 6px);
  box-shadow: inset 0 0 0 1px var(--color-neutral-alpha-16, #00396b29); }
.lcr__hex code { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px; color: var(--color-text-on-light-default, #00263e); }

.lcr__copy { font: inherit; border: 0; background: none; padding: 2px 4px; margin: -2px -4px;
  border-radius: 4px; cursor: pointer; text-align: left; color: var(--color-text-on-light-link-primary-enabled, #004370); }
.lcr__copy code { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px; color: inherit; }
.lcr__copy:hover { background: var(--color-neutral-05, #f5f7f9); }
.lcr__copy:focus-visible { outline: 2px solid var(--color-domain-interactive-focused, #0071bc);
  outline-offset: 1px; }
.lcr__copy.is-copied { color: var(--color-text-on-light-state-success, #234f03); }
.lcr__copy.is-copied::after { content: " ✓ copied"; font-size: 11px; }

@media (prefers-reduced-motion: reduce) { .lcr__copy { transition: none; } }
`;
    }
  }

  /* execCommand fallback for non-secure contexts / older ODC runtimes. */
  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (_) { /* no-op */ }
    document.body.removeChild(ta);
  }

  if (!customElements.get("loop-color-reference")) {
    customElements.define("loop-color-reference", LoopColorReference);
  }
})();
```

</details>

































## The utility classes
For every `--color-<name>` primitive, the generator emits:
```css
.background-<name> { background-color: var(--color-<name>) !important; }
.text-<name>       { color: var(--color-<name>) !important; }
```
e.g. `.background-blue-50`, `.text-red-70`, `.background-accent-magenta-90`,
`.text-neutral-alpha-02`. Apply via **ExtendedClass** on any element (hard rule #7).
Values resolve through `var(--token)` (hard rule #3) so a design re-map flows through
automatically. `!important` matches the existing `color-utilities.css` convention
(opt-in single-declaration overrides that must beat OS UI's own color classes).

> These are the raw **primitives**. Brand/semantic **role** helpers
> (`.background-primary`, `.text-error`, `.loop-text-default`, …) live in
> `tokens/color-utilities.css` — unchanged.

### Regenerating
After editing primitives in `tokens/colors.css`:
```bash
npm run gen:color-utilities   # rewrites tokens/color-utilities-primitives.css
npm run build:theme           # folds it into dist/theme.css
```
Then also add the new token name to the `GROUPS` manifest in
`src/components/loop-color-reference.js` so the Style Guide lists it.

## Using `<loop-color-reference>` in ODC
1. Add `loop-color-reference.js` to the app **Resources** (Deploy Action: *Deploy to
   Target Directory*) — or load it via a Scripts block on the Style-Guide screen.
2. On the **Live Style Guide** screen, add an **HTML Element** (tag `loop-color-reference`):
   ```html
   <loop-color-reference
     intro="Primitive color reference, generated live from the WBG / The Loop theme.">
   </loop-color-reference>
   ```
3. Publish → open in a **real browser** (not Service Studio Preview, hard rule #2).

### Attributes
| Attribute | Default | Description |
|---|---|---|
| `heading` | `Color values, variables and classes` | Section heading |
| `intro` | — | Intro line under the heading |
| `no-swatch-grid` | (off) | Hide the at-a-glance ramp grid; show only the tables |
| `filter` | (all) | Comma list of group keys to show, e.g. `blue,red,green` |

Group keys: `brand`, `blue`, `neutral`, `neutral-alpha`, `gray-alpha`, `red`, `green`,
`yellow`, `purple`, `accent-orange`, `accent-pale-green`, `accent-teal`,
`accent-indigo`, `accent-magenta`.

### Behaviour
- Each class / variable cell is a **button → click to copy** (with a transient ✓ cue).
- Swatch colors and hex values are read live via `getComputedStyle(:root)`.

## Accessibility (WCAG 2.2 AA)
- Real `<table>` with `scope`'d headers + visually-hidden `<caption>` per ramp.
- Swatches are decorative (`aria-hidden`); the hex + name carry the meaning.
- Copy buttons have `aria-label`s; focus ring uses
  `--color-domain-interactive-focused`; `prefers-reduced-motion` honored.

## Checklist
- [ ] `npm run build:theme` and paste `dist/theme.css` into the ODC Theme editor.
- [ ] Add `loop-color-reference.js` to Resources; load it on the Style-Guide screen.
- [ ] Place `<loop-color-reference>` via an HTML Element; publish.
- [ ] Validate in a **real browser**: swatches match the palette, hex values populate,
      click-to-copy works, keyboard focus rings visible.
- [ ] Spot-check a few utilities on a Container via ExtendedClass
      (`background-blue-50`, `text-red-70`).
