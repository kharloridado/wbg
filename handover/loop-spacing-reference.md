# Handover — `<loop-spacing-reference>` (Live Style Guide: spacing + directional utilities)

The spacing counterpart to `<loop-color-reference>` and `<loop-typography-reference>`.
One vanilla-JS Web Component that auto-renders the **spacing scale** plus its
**directional margin / padding utility classes** in the **Live Style Guide** — each step
with a live bar specimen, its resolved value, the minted `.margin-*` / `.padding-*`
classes and a click-to-copy CSS-variable chip, plus a directional-variant legend, with
**no rows built by hand** in Service Studio.

Figma reference: Spacing System [node:10994-5086].

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Spacing page.

**What it is.** `<loop-spacing-reference>`, which auto-renders the `--space-*` scale and
its directional utilities in the Live Style Guide, read live from the theme.

**When to use**
- Documenting the spacing system + directional utilities on a Style Guide page.
- Looking up the right spacing token / utility class for padding, margin or gap.

**When not to use** (reach for instead)
- For shadows use `<loop-shadow-reference>`; for radius / border-width use
  `<loop-border-reference>`; color → `<loop-color-reference>`; type → `<loop-typography-reference>`.

**How to use**
- Drop `<loop-spacing-reference>` on a Style Guide page — it reads each token's value live
  from the theme, no rows built by hand.

## Directional spacing utilities (OutSystems UI mould)

The spacing scale mints directional **margin / padding** utility classes the same way
OutSystems UI ships them (`vendor/.../_space-margin.scss`, `_space-padding.scss`) — only
the size keys are The Loop's descriptive scale (`tiny` … `xhuge`) instead of OS UI's
`xs/s/base/m/l/xl/xxl` (whose px values already match The Loop). Take a base class and add
a direction suffix:

| Pattern | Example | Effect |
|---|---|---|
| `.margin-<name>` / `.padding-<name>` | `.padding-regular` | All four sides |
| `.{margin\|padding}-{top\|right\|bottom\|left}-<name>` | `.margin-top-small` | One side |
| `.{margin\|padding}-x-<name>` | `.padding-x-large` | Inline — left + right (RTL-aware) |
| `.{margin\|padding}-y-<name>` | `.margin-y-medium` | Block — top + bottom |
| `.margin-auto` | `.margin-auto` | Centre horizontally (`margin: 0 auto`) |

Scale names: `none`, `xtiny`, `tiny`, `xxsmall`, `xsmall`, `small`, `regular`, `medium`,
`large`, `xlarge`, `xxlarge`, `huge`, `xhuge`. Attach via **ExtendedClass** (hard rule #7);
values resolve through `var(--space-<name>)` (hard rule #3). No `!important` — matches OS
UI's own space utilities. Numeric aliases (`--space-100/200/500`), component gaps and
`--grid-gutter` are intentionally NOT minted as classes. The classes (13 steps → 183
classes) are generated into `tokens/spacing-utilities.css` and folded into
`dist/theme.css`, so there is **nothing extra to paste** — they arrive with the theme.

```css
/* Regenerate after editing tokens/spacing.css: */
npm run gen:spacing-utilities && npm run build:theme
```

## Files
| File | OutSystems destination |
|---|---|
| `tokens/spacing.css` | Included automatically in `dist/theme.css` — paste theme into the ODC Theme editor |
| `tokens/spacing-utilities.css` (generated) | Directional margin/padding utilities — folded into `dist/theme.css` (same paste) |
| `src/components/loop-spacing-reference.js` | Add to the app's **Resources** (or a Scripts folder), set to load on the Style-Guide screen |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-spacing-reference.js</code> → Add to Resources — load on the Style-Guide screen</summary>

```js
/**
 * <loop-spacing-reference> — auto-rendered Live Style Guide reference for the SPACING
 * scale and its directional margin / padding utility classes.
 *
 * The spacing counterpart to <loop-color-reference> / <loop-typography-reference>: drop
 * this one file into ODC (Resources) and place a single <loop-spacing-reference> element
 * on a Style-Guide screen. It renders every spacing token with a LIVE bar specimen, its
 * resolved value, the minted .margin-* / .padding-* utility classes and a click-to-copy
 * CSS-variable chip — plus a directional-variant legend — NO rows built by hand.
 *
 * Source of truth = the theme. The component never hard-codes a value; it reads each
 * token live via getComputedStyle(:root) at render time, so specimens always match
 * dist/theme.css (tokens/spacing.css + the generated tokens/spacing-utilities.css). The
 * SPACING manifest mirrors spacing.css (full variable name, since the layout gutter is
 * --grid-gutter rather than --space-*).
 *
 * Attributes:
 *   heading   Optional section heading (default: "Spacing")
 *   intro     Optional intro line under the heading
 *
 * Behaviour: each class / CSS-variable chip is a button — click to copy (with a ✓ cue).
 * Accessibility: real <table>s with scope'd headers + <caption>; bar/box specimens are
 * decorative (aria-hidden); copy buttons have aria-labels; brand focus ring;
 * prefers-reduced-motion honored. No framework (CLAUDE.md hard rule #6).
 */
(function () {
  /* Spacing scale — mirrors tokens/spacing.css. Each row carries the FULL variable name
   * because most are --space-* but the layout gutter is --grid-gutter. `util:true` marks
   * the groups that mint directional margin / padding utilities. */
  const SPACING = [
    { key: "scale", title: "Spacing scale", util: true, note: "The descriptive scale extracted from Figma (Spacing System, node 10994-5086). Each step mints directional margin / padding utilities (OutSystems UI mould) — copy the base class, then add a direction suffix (see legend below). Or reference the variable in custom CSS.", rows: [
      ["--space-none",    "None"],
      ["--space-xtiny",   "X-Tiny"],
      ["--space-tiny",    "Tiny"],
      ["--space-xxsmall", "XX-Small"],
      ["--space-xsmall",  "X-Small"],
      ["--space-small",   "Small"],
      ["--space-regular", "Regular"],
      ["--space-medium",  "Medium"],
      ["--space-large",   "Large"],
      ["--space-xlarge",  "X-Large"],
      ["--space-xxlarge", "XX-Large"],
      ["--space-huge",    "Huge"],
      ["--space-xhuge",   "X-Huge"],
    ] },
    { key: "aliases", title: "Numeric aliases", note: "lift token('space.N') aliases seen across components — equivalents of scale steps.", rows: [
      ["--space-100", "Space 100"],
      ["--space-200", "Space 200"],
      ["--space-500", "Space 500"],
    ] },
    { key: "component", title: "Component spacing", note: "Component-specific gaps captured from Figma component specs.", rows: [
      ["--space-button-gap",            "Button gap"],
      ["--space-checkbox-gap",          "Checkbox / radio gap"],
      ["--space-checkbox-group-row",    "Checkbox group · row"],
      ["--space-checkbox-group-column", "Checkbox group · column"],
    ] },
    { key: "layout", title: "Layout", note: "Page-level layout rhythm.", rows: [
      ["--grid-gutter", "Grid gutter"],
    ] },
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  function val(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }

  class LoopSpacingReference extends HTMLElement {
    static get observedAttributes() { return ["heading", "intro"]; }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._onCopy = this._onCopy.bind(this);
    }

    connectedCallback() { this._render(); }
    attributeChangedCallback(n, o, v) { if (o !== v && this.shadowRoot.childElementCount) this._render(); }

    get _heading() { return this.getAttribute("heading") || "Spacing"; }
    get _intro() { return this.getAttribute("intro") || ""; }

    _render() {
      const intro = this._intro ? `<p class="lspr__intro">${esc(this._intro)}</p>` : "";
      this.shadowRoot.innerHTML = `
        <style>${this._css()}</style>
        <section class="lspr" part="root">
          <h2 class="lspr__heading">${esc(this._heading)}</h2>
          ${intro}
          <p class="lspr__note">Spacing scale (<code>--space-*</code>) plus the layout gutter. Each scale step mints directional <code>.margin-*</code> / <code>.padding-*</code> utilities in the OutSystems UI mould — attach via <strong>ExtendedClass</strong>. The bar shows each value at true width.</p>
          ${this._groups()}
          ${this._directionalHtml()}
        </section>`;
      this.shadowRoot.querySelectorAll("button.lspr__copy").forEach((b) =>
        b.addEventListener("click", this._onCopy)
      );
    }

    _copyBtn(text) {
      return `<button type="button" class="lspr__copy" data-copy="${esc(text)}" aria-label="Copy ${esc(text)}"><code>${esc(text)}</code></button>`;
    }

    _groups() {
      return SPACING.map((g) => {
        const rows = g.rows.map(([v, label]) => {
          const resolved = val(v) || "—";
          /* Directional utilities are minted only for the descriptive scale (g.util). */
          const name = v.replace(/^--space-/, "");
          const utilCells = g.util
            ? `<td>${this._copyBtn(".margin-" + name)}</td><td>${this._copyBtn(".padding-" + name)}</td>`
            : `<td class="lspr__na">—</td><td class="lspr__na">—</td>`;
          return `
            <tr>
              <th scope="row" class="lspr__name">${esc(label)}</th>
              <td class="lspr__mono">${esc(resolved)}</td>
              <td class="lspr__bar-cell"><span class="lspr__bar" aria-hidden="true" style="inline-size:var(${v})"></span></td>
              ${utilCells}
              <td>${this._copyBtn(v)}</td>
            </tr>`;
        }).join("");
        return `
          <h3 class="lspr__group-title">${esc(g.title)}</h3>
          <p class="lspr__group-note">${esc(g.note)}</p>
          <div class="lspr__table-wrap"><table class="lspr__table">
            <caption class="lspr__caption">${esc(g.title)} tokens, values, utility classes and CSS variables</caption>
            <thead><tr><th scope="col">Token</th><th scope="col">Value</th><th scope="col">Scale</th><th scope="col">Margin class</th><th scope="col">Padding class</th><th scope="col">CSS Variable</th></tr></thead>
            <tbody>${rows}</tbody>
          </table></div>`;
      }).join("");
    }

    _directionalHtml() {
      const ex = (cls, desc) => `<tr><td>${this._copyBtn(cls)}</td><td class="lspr__use">${esc(desc)}</td></tr>`;
      return `
        <h3 class="lspr__group-title">Directional variants</h3>
        <p class="lspr__group-note">Take any base class (e.g. <code>.padding-regular</code>) and add a direction suffix. Same naming as OutSystems UI — only the size keys are The Loop's descriptive scale. Substitute any scale name (<code>tiny</code> … <code>xhuge</code>) for <code>regular</code>.</p>
        <div class="lspr__table-wrap"><table class="lspr__table">
          <caption class="lspr__caption">Directional margin / padding suffixes</caption>
          <thead><tr><th scope="col">Class</th><th scope="col">Effect</th></tr></thead>
          <tbody>
            ${ex(".padding-regular", "All four sides")}
            ${ex(".padding-top-regular", "Top only (also -right / -bottom / -left)")}
            ${ex(".padding-x-regular", "Inline — left + right (RTL-aware)")}
            ${ex(".padding-y-regular", "Block — top + bottom")}
            ${ex(".margin-regular", "Margin works identically: all / side / x / y")}
            ${ex(".margin-auto", "Center horizontally (margin: 0 auto)")}
          </tbody>
        </table></div>
        <div class="lspr__demo" aria-hidden="true">
          <div class="lspr__demo-box" style="padding:var(--space-regular)"><span class="lspr__demo-inner">padding: regular (24px) — all sides</span></div>
          <div class="lspr__demo-box" style="padding-block:var(--space-tiny);padding-inline:var(--space-large)"><span class="lspr__demo-inner">padding-y: tiny · padding-x: large</span></div>
        </div>`;
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
.lspr__heading { font-size: 24px; font-weight: var(--font-weight-bold, 700);
  margin: 0 0 8px; color: var(--color-text-on-light-headers, #00263e); }
.lspr__intro { margin: 0 0 16px; font-size: 14px; color: var(--color-text-on-light-subdued, #586e84); }
.lspr__note { margin: 0 0 24px; font-size: 13px; color: var(--color-text-on-light-subdued, #586e84); }
.lspr__note code, .lspr__group-note code { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: 12px; }
.lspr__group-title { font-size: 16px; font-weight: var(--font-weight-bold, 700);
  margin: 24px 0 4px; color: var(--color-text-on-light-headers, #00263e); }
.lspr__group-note { margin: 0 0 12px; font-size: 13px; color: var(--color-text-on-light-subdued, #586e84); }
.lspr__caption { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

.lspr__mono { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px; color: var(--color-text-on-light-default, #00263e); white-space: nowrap; }
.lspr__use { font-size: 12px; color: var(--color-text-on-light-subdued, #586e84); }

.lspr__table-wrap { overflow-x: auto; }
.lspr__table { width: 100%; border-collapse: collapse; font-size: 13px; }
.lspr__table thead th { text-align: left; font-weight: 600; font-size: 12px;
  color: var(--color-text-on-light-subdued, #586e84);
  padding: 8px 12px; border-bottom: 1px solid var(--color-neutral-15, #dae3eb); white-space: nowrap; }
.lspr__table tbody td, .lspr__table tbody th { padding: 10px 12px;
  border-bottom: 1px solid var(--color-neutral-10, #e7edf3); vertical-align: middle; text-align: left; white-space: nowrap; }
.lspr__name { font-weight: 600; font-size: 13px;
  color: var(--color-text-on-light-headers, #00263e); white-space: nowrap; }
.lspr__bar-cell { width: 100%; }
.lspr__bar { display: inline-block; block-size: 16px; min-inline-size: 1px;
  border-radius: var(--radius-xs, 2px); background: var(--color-blue-50, #0071bc); vertical-align: middle; }
.lspr__na { color: var(--color-text-on-light-subdued, #586e84); }

.lspr__demo { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 16px; }
.lspr__demo-box { background: var(--color-blue-10, #e1ecf4); border-radius: var(--radius-base, 4px); }
.lspr__demo-inner { display: block; background: var(--color-white, #fff); border-radius: var(--radius-xs, 2px);
  padding: 6px 10px; font-size: 12px; color: var(--color-text-on-light-default, #00263e);
  box-shadow: inset 0 0 0 1px var(--color-neutral-alpha-16, #00396b29); }

.lspr__copy { font: inherit; border: 0; background: var(--color-neutral-05, #f5f7f9);
  padding: 3px 8px; border-radius: 4px; cursor: pointer;
  color: var(--color-text-on-light-link-primary-enabled, #004370); }
.lspr__copy code { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: 12px; color: inherit; }
.lspr__copy:hover { background: var(--color-neutral-10, #e7edf3); }
.lspr__copy:focus-visible { outline: 2px solid var(--color-domain-interactive-focused, #0071bc); outline-offset: 1px; }
.lspr__copy.is-copied { color: var(--color-text-on-light-state-success, #234f03); }
.lspr__copy.is-copied::after { content: " ✓"; }
@media (prefers-reduced-motion: reduce) { .lspr__copy { transition: none; } }
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

  if (!customElements.get("loop-spacing-reference")) {
    customElements.define("loop-spacing-reference", LoopSpacingReference);
  }
})();
```

</details>

## Using `<loop-spacing-reference>` in ODC
1. `npm run build:theme` and paste `dist/theme.css` into the ODC Theme editor (ships the
   `--space-*` tokens + the directional utility classes).
2. Add `loop-spacing-reference.js` to the app **Resources** (Deploy Action: *Deploy to
   Target Directory*) — or load it via a Scripts block on the Style-Guide screen.
3. On the **Live Style Guide** screen, add an **HTML Element** (tag `loop-spacing-reference`):
   ```html
   <loop-spacing-reference
     intro="Spacing scale + directional utilities, generated live from the WBG / The Loop theme.">
   </loop-spacing-reference>
   ```
4. Publish → open in a **real browser** (not Service Studio Preview, hard rule #2).

### Attributes
| Attribute | Default | Description |
|---|---|---|
| `heading` | `Spacing` | Section heading |
| `intro` | — | Intro line under the heading |

### Behaviour
- Each class / CSS-variable chip is a **button → click to copy** (with a transient ✓ cue).
- Bars and the directional demo are rendered live from the tokens.

## Keeping in sync
When you add or rename a spacing token in `tokens/spacing.css`, mirror the name in the
`SPACING` manifest at the top of `src/components/loop-spacing-reference.js`, then
regenerate the utilities and refold the theme:
```bash
npm run gen:spacing-utilities   # rewrites tokens/spacing-utilities.css
npm run build:theme             # folds it into dist/theme.css
```
Then re-run `node build/embed-handover-code.mjs` to refresh the pasted code below.

## Accessibility (WCAG 2.2 AA)
- Real `<table>`s with `scope`'d headers + visually-hidden `<caption>` per group.
- Bars and the directional demo are decorative (`aria-hidden`); value + token name carry
  the meaning.
- Copy buttons have `aria-label`s; focus ring uses `--color-domain-interactive-focused`;
  `prefers-reduced-motion` honored.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, place the Style-Guide reference element <loop-spacing-reference> on the Style Guide
screen for the WBG "The Loop" design system.

Context (already done): loop-spacing-reference.js is added under Resources and loads on the Style-Guide
screen; dist/theme.css is in the Theme. It is a self-contained display component.

Task: add the <loop-spacing-reference> element to the Style Guide screen where this specimen belongs.
There are no inputs or events to wire. Do NOT write CSS or JavaScript.

Constraints: never edit the OutSystems UI module; add no styles. Report what you placed.
```

## Checklist
- [ ] `npm run gen:spacing-utilities` + `npm run build:theme`; paste `dist/theme.css`.
- [ ] Add `loop-spacing-reference.js` to Resources; load it on the Style-Guide screen.
- [ ] Place `<loop-spacing-reference>` via an HTML Element; publish.
- [ ] Validate in a **real browser**: bars match values, class chips copy, directional
      demo insets correctly, keyboard focus rings visible.
- [ ] Spot-check a utility on a Container via ExtendedClass (`padding-x-regular`).
