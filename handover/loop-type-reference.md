# Handover — Typography utilities + `<loop-typography-reference>` (Live Style Guide)

The typography counterpart to the color reference. Two deliverables:

1. **Typography utility classes** — `.font-size-<name>` / `.font-weight-<name>` for the
   type scale + weights, in the OutSystems UI mould. Generated from
   `tokens/typography.css`, folded into the theme automatically.
2. **`<loop-typography-reference>`** — a vanilla-JS Web Component that auto-renders the whole
   type system in the **Live Style Guide** (named Heading/Body styles, font-size scale,
   weights, line-heights, letter-spacing), with **no rows built by hand**.

Source of truth: WBG / "The Loop" Figma type page (**node 10995-7259**), font **Open Sans**
(FND-002 sign-off). Size/weight/line-height/tracking values are read **live from the
theme**, so the samples can't drift from `dist/theme.css`.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Typography page.

**What it is.** Typography utility classes plus `<loop-typography-reference>`, which auto-renders the whole type system in the Live Style Guide.

**When to use**
- Documenting the type system on a Live Style Guide page.
- Applying type: named role classes (`.loop-heading-*` / `.loop-body-*`) for content, or `.font-size-*` / `.font-weight-*` utilities for one-off tuning.

**When not to use** (reach for instead)
- Prefer the **named role classes** over raw `.font-size-*` utilities for body/heading content, so type stays semantic.

**How to use**
- Drop `<loop-typography-reference>` on a Style Guide page — it reads sizes/weights live from the theme, no rows built by hand.

## Files
| File | OutSystems destination |
|---|---|
| `tokens/typography-utilities.css` | Included automatically in `dist/theme.css` — paste theme into ODC Theme editor |
| `src/components/loop-typography-reference.js` | Add to the app's **Resources**; load on the Style-Guide screen |
| `build/gen-type-utilities.mjs` | Build tooling — regenerates the CSS from `typography.css` |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-typography-reference.js</code> → Add to Resources — load on the Style-Guide screen</summary>

```js
/**
 * <loop-typography-reference> — auto-rendered Live Style Guide typography reference.
 *
 * The typography counterpart to <loop-color-reference>: drop this one file into ODC
 * (Resources) and place a single <loop-typography-reference> element on a Style-Guide screen.
 * It documents the type system the way the Figma "Type Documentation" frame does — each named
 * style as a row of NAME/SIZE · PROPERTIES · EXAMPLE, grouped into Heading Styles, Labels and
 * Body — then the raw scale, weights, line-heights and letter-spacing reference tables. NO rows
 * are built by hand in Service Studio.
 *
 * Source of truth = the WBG / "The Loop" Figma type page (node 10995-7259), font Open Sans
 * (FND-002). Headings + Labels are Open Sans Bold (700) — the Figma `Heading/Font Weight` and
 * `Body/Label/Font Weight` variables (FND-036/040 self-host the 500 face for Badge styles only).
 * The font-size / weight / line-height / tracking values are read LIVE from the theme
 * (getComputedStyle(:root)) so the desktop samples always match dist/theme.css; the named-role
 * composition + the responsive (Desktop/Tablet/Phone) ladder is the spec, embedded below.
 *
 * Responsive: OutSystems UI sets `body.phone` / `body.tablet` at runtime; typography.css
 * redefines the display scale steps under those classes, so headings + labels shrink per
 * form factor. The PROPERTIES column lists the Desktop · Tablet · Phone sizes; the EXAMPLE
 * renders at the current viewport's size. Breakpoint→step assignment is FND-059.
 *
 * Off-scale note: Body/Medium tracking (-0.25px) and Body/Tiny tracking (0.25px) are not on the
 * documented letter-spacing scale (same family as FND-013/022), so they render as literals and
 * are tagged "off-scale".
 *
 * Attributes:
 *   heading   Optional section heading (default: "Typography")
 *   intro     Optional intro line under the heading
 *   filter    Optional comma list of section keys: styles,elements,scale,weights,leading,tracking
 *
 * Behaviour: each class / variable chip is a button — click to copy (with a ✓ cue).
 *
 * Accessibility: section landmarks + headings; sample text marked aria-hidden where it is
 * illustrative only (the spec carries the meaning); copy buttons have aria-labels; focus ring
 * uses the brand focus token; honors prefers-reduced-motion.
 *
 * No framework (CLAUDE.md hard rule #6 — vanilla Web Component).
 */
(function () {
  const SAMPLE = "The quick brown fox jumps over the lazy dog";

  /* Responsive display-scale ladder — mirrors the body.tablet / body.phone overrides in
   * typography.css. Keyed by Font-size/NNN step. Body steps (≤600) are NOT responsive. */
  const RESP = {
    "700":     { d: 28, t: 28, p: 24 },
    "800":     { d: 32, t: 28, p: 24 },
    "900":     { d: 36, t: 32, p: 28 },
    "1000":    { d: 40, t: 36, p: 32 },
    "1100":    { d: 48, t: 40, p: 36 },
    "1200":    { d: 60, t: 48, p: 40 },
    "huge-72": { d: 72, t: 60, p: 48 },
  };

  /* Named type styles — the Figma roles (node 10995-7259), Open Sans.
   * size/weight/lh reference scale tokens; `ls` is a token name, or {px} for an off-scale
   * literal, or null for the type's default. `caps` = uppercase All-Caps. `group` is the
   * Figma path shown in the NAME/SIZE column. */
  const STYLES = {
    heading: {
      title: "Heading Styles",
      group: "Headings",
      note: "Open Sans Bold (700) · line-height 1.12. Display headings — sizes step down on tablet & phone (responsive).",
      levels: [
        { level: "H1", roles: [
          { label: "Large", size: "1200", weight: "bold", lh: "heading", ls: "heading",
            sample: "Transforming Lives",        cls: "loop-heading-h1-large" },
          { label: "Base",  size: "1100", weight: "bold", lh: "heading", ls: null,
            sample: "Annual Report 2025",        cls: "loop-heading-h1-base"  },
          { label: "Small", size: "900",  weight: "bold", lh: "heading", ls: null,
            sample: "Country Portfolio Summary", cls: "loop-heading-h1-small" },
          { label: "Tiny",  size: "700",  weight: "bold", lh: "heading", ls: null,
            sample: "Project Overview",          cls: "loop-heading-h1-tiny"  },
        ] },
        { level: "H2", roles: [
          { label: "Large", size: "1100", weight: "bold", lh: "heading", ls: null,
            sample: "Strategic Priorities",      cls: "loop-heading-h2-large" },
          { label: "Small", size: "800",  weight: "bold", lh: "heading", ls: null,
            sample: "Regional Analysis",         cls: "loop-heading-h2-small" },
        ] },
        { level: "H3", roles: [
          { label: "Base",  size: "800",  weight: "bold", lh: "heading", ls: null,
            sample: "Key Findings",              cls: "loop-heading-h3-base"  },
        ] },
      ],
    },
    label: {
      title: "Labels",
      group: "Labels",
      note: "Open Sans Bold (700) · tracking -1.5px. Use for labels in cards, tables, columns, etc. (Figma Heading/Label). Responsive sizes.",
      roles: [
        { label: "Medium", size: "1100", weight: "bold", lh: "solid", ls: "label",
          sample: SAMPLE, cls: "loop-label-medium" },
        { label: "Base",   size: "1000", weight: "bold", lh: "label", ls: "label",
          sample: SAMPLE, cls: "loop-label-base"   },
        { label: "Small",  size: "900",  weight: "bold", lh: "label", ls: "label",
          sample: SAMPLE, cls: "loop-label-small"  },
        { label: "Tiny",   size: "700",  weight: "bold", lh: "label", ls: "label",
          sample: SAMPLE, cls: "loop-label-tiny"   },
      ],
    },
    body: {
      title: "Body Styles",
      group: "Body",
      note: "Open Sans Regular (400) · line-height 1.5 (base). Body copy stays a fixed size across form factors.",
      roles: [
        { label: "Large",           size: "600", weight: "regular", lh: "base", ls: "tight",
          cls: "loop-body-large",
          sample: "The World Bank Group is a unique global partnership of five institutions working for sustainable solutions that reduce poverty and build shared prosperity in developing countries." },
        { label: "Medium",          size: "500", weight: "regular", lh: "base", ls: { px: "-0.25px", off: true },
          cls: "loop-body-medium",
          sample: "This section summarises portfolio performance for the current fiscal year, covering active projects across all six operational regions." },
        { label: "Base",            size: "300", weight: "regular", lh: "base", ls: "none",
          cls: "loop-body-base",
          sample: "Projects are evaluated against four pillars of sustainable development: economic growth, social inclusion, environmental sustainability, and effective governance." },
        { label: "Small",           size: "200", weight: "regular", lh: "base", ls: "none",
          cls: "loop-body-small",
          sample: "For more information on project eligibility criteria, please refer to the operational guidelines section of this document." },
        { label: "Tiny",            size: "100", weight: "regular", lh: "base", ls: { px: "0.25px", off: true },
          cls: "loop-body-tiny",
          sample: "Source: World Bank Group Annual Report 2025. All figures are in USD millions unless otherwise stated." },
        { label: "Tiny · All Caps", size: "100", weight: "regular", lh: "narrow", ls: "caps", caps: true,
          cls: "loop-body-tiny-caps",
          sample: "World Bank Group · Annual Report · Fiscal Year 2025" },
      ],
    },
  };

  /* Font-size ramp + the lift semantic size aliases. */
  const SCALE = ["100", "200", "300", "400", "500", "600", "700", "800", "900", "1000", "1100", "1200", "huge-72"];
  const SCALE_ALIASES = ["body-tiny", "body-small", "body-base", "label-large"];

  const WEIGHTS = [
    { name: "regular", label: "Regular" },
    { name: "medium", label: "Medium" },
    { name: "semibold", label: "Semibold" },
    { name: "bold", label: "Bold" },
  ];

  const LEADING = [
    { name: "solid", label: "Solid", use: "Label / Medium (100%)" },
    { name: "heading", label: "Heading", use: "Headings (112%)" },
    { name: "label", label: "Label", use: "Labels (115%)" },
    { name: "narrow", label: "Narrow", use: "Dense UI / all-caps" },
    { name: "base", label: "Base", use: "Body copy" },
    { name: "list", label: "List", use: "Lists / spacious" },
  ];

  const TRACKING = [
    { name: "heading", label: "Heading" },
    { name: "label", label: "Label" },
    { name: "tight", label: "Tight" },
    { name: "button", label: "Button" },
    { name: "none", label: "None" },
    { name: "caps", label: "All-caps" },
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  function val(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }
  function pct(ratio) {
    const n = parseFloat(ratio);
    return Number.isFinite(n) ? Math.round(n * 100) + "%" : ratio;
  }

  class LoopTypographyReference extends HTMLElement {
    static get observedAttributes() { return ["heading", "intro", "filter"]; }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._onCopy = this._onCopy.bind(this);
    }

    connectedCallback() { this._render(); }
    attributeChangedCallback(n, o, v) { if (o !== v && this.shadowRoot.childElementCount) this._render(); }

    get _heading() { return this.getAttribute("heading") || "Typography"; }
    get _intro() { return this.getAttribute("intro") || ""; }
    get _filter() {
      const f = this.getAttribute("filter");
      return f ? f.split(",").map((s) => s.trim()).filter(Boolean) : null;
    }
    _show(key) { const f = this._filter; return !f || f.includes(key); }

    _render() {
      const intro = this._intro ? `<p class="ltr__intro">${esc(this._intro)}</p>` : "";
      const parts = [];
      if (this._show("styles")) {
        parts.push(this._legendHtml());
        parts.push(this._stylesHtml(STYLES.heading), this._stylesHtml(STYLES.label), this._stylesHtml(STYLES.body));
      }
      if (this._show("elements")) parts.push(this._nativeHtml());
      if (this._show("scale")) parts.push(this._scaleHtml());
      if (this._show("weights")) parts.push(this._weightsHtml());
      if (this._show("leading")) parts.push(this._leadingHtml());
      if (this._show("tracking")) parts.push(this._trackingHtml());

      this.shadowRoot.innerHTML = `
        <style>${this._css()}</style>
        <section class="ltr" part="root">
          <h2 class="ltr__heading">${esc(this._heading)}</h2>
          ${intro}
          ${parts.join("")}
        </section>`;

      this.shadowRoot.querySelectorAll("button.ltr__copy").forEach((b) =>
        b.addEventListener("click", this._onCopy)
      );
    }

    _copyBtn(text) {
      return `<button type="button" class="ltr__copy" data-copy="${esc(text)}" aria-label="Copy ${esc(text)}"><code>${esc(text)}</code></button>`;
    }

    /* Responsive legend — explains the Desktop · Tablet · Phone sizing the rows show. */
    _legendHtml() {
      return `
        <p class="ltr__legend">
          <span class="ltr__legend-dot" aria-hidden="true"></span>
          Headings &amp; Labels are <strong>responsive</strong>: sizes shown as
          <code>Desktop · Tablet · Phone</code> step down with OutSystems'
          <code>body.phone</code> / <code>body.tablet</code> classes. Body copy is fixed.
        </p>`;
    }

    /* ---- PROPERTIES cell — Figma-style spec list (Font / Weight / Size / Line height / Letter) ---- */
    _propsHtml(r) {
      const sizeVar = `--font-size-${r.size}`;
      const weightVar = `--font-weight-${r.weight}`;
      const lhVar = `--line-height-${r.lh}`;
      const wt = val(weightVar) || "";
      const wtName = r.weight.charAt(0).toUpperCase() + r.weight.slice(1);

      // Size — responsive triple if the step is in the display ladder, else a single value.
      const resp = RESP[r.size];
      const sizeLine = resp
        ? `<span class="ltr__resp">Desktop <b>${resp.d}</b> · Tablet <b>${resp.t}</b> · Phone <b>${resp.p}</b>px</span>`
        : `${val(sizeVar) || "—"}`;

      // Letter spacing.
      let lsLabel = "0px (default)", lsCopy = "";
      if (typeof r.ls === "string") {
        lsLabel = (val(`--letter-spacing-${r.ls}`) || "") + ` (${r.ls})`;
        lsCopy = `--letter-spacing-${r.ls}`;
      } else if (r.ls && r.ls.px) {
        lsLabel = `${r.ls.px}${r.ls.off ? ' <span class="ltr__tag">off-scale</span>' : ""}`;
      }

      const dl = `
        <dl class="ltr__props">
          <dt>Font</dt><dd>Open Sans</dd>
          <dt>Weight</dt><dd>${esc(wtName)} (${esc(wt)})</dd>
          <dt>Size</dt><dd>${sizeLine}</dd>
          <dt>Line height</dt><dd>${esc(pct(val(lhVar)))} (${esc(val(lhVar))})</dd>
          <dt>Letter space</dt><dd>${lsLabel}</dd>
        </dl>`;
      const chips = `
        <div class="ltr__role-tokens">
          ${this._copyBtn("." + r.cls)} ${this._copyBtn(sizeVar)} ${this._copyBtn(weightVar)} ${this._copyBtn(lhVar)}${lsCopy ? " " + this._copyBtn(lsCopy) : ""}
        </div>`;
      return dl + chips;
    }

    /* ---- a single documentation row: NAME/SIZE · PROPERTIES · EXAMPLE ---- */
    _docRow(group, styleName, r) {
      const name = `
        <div class="ltr__doc-name">
          <span class="ltr__doc-path">${esc(group)} /${styleName ? " " + esc(styleName) + " /" : ""}</span>
          <span class="ltr__doc-size-name">${esc(r.label)}</span>
        </div>`;
      return `
        <div class="ltr__doc-row">
          ${name}
          <div class="ltr__doc-props">${this._propsHtml(r)}</div>
          <div class="ltr__doc-example">
            <p class="ltr__sample ${esc(r.cls)}" aria-hidden="true">${esc(r.sample)}</p>
          </div>
        </div>`;
    }

    /* ---- named type styles group (Heading Styles / Labels / Body) ---- */
    _stylesHtml(group) {
      const header = `
        <div class="ltr__doc-row ltr__doc-head" aria-hidden="true">
          <div class="ltr__col-h">Name / Size</div>
          <div class="ltr__col-h">Properties</div>
          <div class="ltr__col-h">Example</div>
        </div>`;
      const body = group.levels
        ? group.levels.map((lvl) =>
            lvl.roles.map((r) => this._docRow(`${group.group} / ${lvl.level}`, "", r)).join("")
          ).join("")
        : group.roles.map((r) => this._docRow(group.group, "", r)).join("");
      return `
        <div class="ltr__group">
          <h3 class="ltr__group-title">${esc(group.title)}</h3>
          <p class="ltr__group-note">${esc(group.note)}</p>
          <div class="ltr__doc">${header}${body}</div>
        </div>`;
    }

    /* ---- native heading element defaults ---- */
    _nativeHtml() {
      const row = (tag, label, spec, cls, sample) => `
        <div class="ltr__role">
          <div class="ltr__role-head">
            <span class="ltr__role-name">${esc(label)}</span>
            <span class="ltr__role-spec">${esc(spec)}</span>
          </div>
          <${tag} class="${esc(cls)}">${esc(sample)}</${tag}>
          <div class="ltr__role-tokens">${this._copyBtn("." + cls)}</div>
        </div>`;
      const demoRow = `
        <div class="ltr__role">
          <div class="ltr__role-head">
            <span class="ltr__role-name">h1 + .loop-heading-h1-large</span>
            <span class="ltr__role-spec">Desktop 60px · Bold · lh 1.12 · tracking −3px · class overrides element default</span>
          </div>
          <h1 class="loop-heading-h1-large">Transforming Lives</h1>
          <div class="ltr__role-tokens">${this._copyBtn(".loop-heading-h1-large")}</div>
        </div>`;
      return `
        <div class="ltr__group">
          <h3 class="ltr__group-title">Native element defaults (h1–h3)</h3>
          <p class="ltr__group-note">OutSystems Heading widget renders these elements. No ExtendedClass needed for the default role — apply a <code>.loop-heading-*</code> class to override. h4–h6 have no Loop spec. Sizes are responsive (Desktop values shown).</p>
          ${row("h1", "h1 element", "H1 · Base default · Desktop 48px · Bold · lh 1.12", "loop-heading-h1-base", "Annual Report 2025")}
          ${row("h2", "h2 element", "H2 · Small default · Desktop 32px · Bold · lh 1.12", "loop-heading-h2-small", "Regional Analysis")}
          ${row("h3", "h3 element", "H3 · Base default · Desktop 32px · Bold · lh 1.12", "loop-heading-h3-base", "Key Findings")}
          ${demoRow}
        </div>`;
    }

    /* ---- font-size scale ---- */
    _scaleHtml() {
      const row = (name) => {
        const v = `--font-size-${name}`;
        const px = val(v) || "—";
        const resp = RESP[name];
        const respCell = resp ? `${resp.t}px / ${resp.p}px` : "—";
        return `
          <tr>
            <th scope="row" class="ltr__scale-sample" aria-hidden="true" style="font-size:var(${v})">Ag</th>
            <td class="ltr__mono">${esc(px)}</td>
            <td class="ltr__mono">${esc(respCell)}</td>
            <td>${this._copyBtn("." + "font-size-" + name)}</td>
            <td>${this._copyBtn(v)}</td>
          </tr>`;
      };
      const aliasRow = (name) => {
        const v = `--font-size-${name}`;
        return `
          <tr>
            <th scope="row" class="ltr__scale-sample" aria-hidden="true" style="font-size:var(${v})">Ag</th>
            <td class="ltr__mono">${esc(val(v) || "—")}</td>
            <td class="ltr__mono">—</td>
            <td>${this._copyBtn("." + "font-size-" + name)}</td>
            <td>${this._copyBtn(v)}</td>
          </tr>`;
      };
      return `
        <div class="ltr__group">
          <h3 class="ltr__group-title">Font-size scale</h3>
          <p class="ltr__group-note">The <code>Font-size/NNN</code> ramp from Figma. Apply <code>.font-size-NNN</code> via ExtendedClass or reference the variable. The <em>Tablet / Phone</em> column shows the responsive value for the display steps (700–1200).</p>
          <table class="ltr__table">
            <caption class="ltr__caption">Font sizes, responsive values, utility classes and CSS variables</caption>
            <thead><tr><th scope="col">Sample</th><th scope="col">Desktop</th><th scope="col">Tablet / Phone</th><th scope="col">Class</th><th scope="col">CSS Variable</th></tr></thead>
            <tbody>${SCALE.map(row).join("")}</tbody>
          </table>
          <p class="ltr__group-note" style="margin-top:16px">Semantic size aliases (lift body roles):</p>
          <table class="ltr__table">
            <caption class="ltr__caption">Semantic font-size aliases</caption>
            <thead><tr><th scope="col">Sample</th><th scope="col">Desktop</th><th scope="col">Tablet / Phone</th><th scope="col">Class</th><th scope="col">CSS Variable</th></tr></thead>
            <tbody>${SCALE_ALIASES.map(aliasRow).join("")}</tbody>
          </table>
        </div>`;
    }

    /* ---- weights ---- */
    _weightsHtml() {
      const rows = WEIGHTS.map((w) => {
        const v = `--font-weight-${w.name}`;
        const n = val(v) || "";
        return `
          <tr>
            <th scope="row" class="ltr__wt-sample" aria-hidden="true" style="font-weight:var(${v})">${esc(SAMPLE)}</th>
            <td class="ltr__mono">${esc(w.label)} ${esc(n)}</td>
            <td>${this._copyBtn(".font-weight-" + w.name)}</td>
            <td>${this._copyBtn(v)}</td>
          </tr>`;
      }).join("");
      return `
        <div class="ltr__group">
          <h3 class="ltr__group-title">Font weights</h3>
          <p class="ltr__group-note">Open Sans 400 / 500 / 600 / 700 (all self-hosted). Headings &amp; labels use Bold (700); body uses Regular (400); Medium (500) backs the Badge label styles.</p>
          <table class="ltr__table">
            <caption class="ltr__caption">Font weights, utility classes and CSS variables</caption>
            <thead><tr><th scope="col">Sample</th><th scope="col">Weight</th><th scope="col">Class</th><th scope="col">CSS Variable</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    }

    /* ---- line heights ---- */
    _leadingHtml() {
      const cards = LEADING.map((l) => {
        const v = `--line-height-${l.name}`;
        return `
          <figure class="ltr__leading">
            <p class="ltr__leading-sample" aria-hidden="true" style="line-height:var(${v})">${esc(SAMPLE)} — ${esc(SAMPLE)} — ${esc(SAMPLE)}</p>
            <figcaption><strong>${esc(l.label)}</strong> · ${esc(val(v))} · ${esc(l.use)} ${this._copyBtn(v)}</figcaption>
          </figure>`;
      }).join("");
      return `<div class="ltr__group"><h3 class="ltr__group-title">Line heights</h3>${cards}</div>`;
    }

    /* ---- letter spacing ---- */
    _trackingHtml() {
      const rows = TRACKING.map((t) => {
        const v = `--letter-spacing-${t.name}`;
        return `
          <tr>
            <th scope="row" class="ltr__track-sample" aria-hidden="true" style="letter-spacing:var(${v})">${esc(SAMPLE)}</th>
            <td class="ltr__mono">${esc(t.label)} · ${esc(val(v))}</td>
            <td>${this._copyBtn(v)}</td>
          </tr>`;
      }).join("");
      return `
        <div class="ltr__group">
          <h3 class="ltr__group-title">Letter spacing (tracking)</h3>
          <table class="ltr__table">
            <caption class="ltr__caption">Letter-spacing tokens</caption>
            <thead><tr><th scope="col">Sample</th><th scope="col">Tracking</th><th scope="col">CSS Variable</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
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

.ltr__heading { font-size: 24px; font-weight: var(--font-weight-bold, 700);
  margin: 0 0 8px; color: var(--color-text-on-light-headers, #00263e); }
.ltr__intro { margin: 0 0 24px; font-size: 14px; color: var(--color-text-on-light-subdued, #586e84); }

.ltr__group { margin: 0 0 36px; }
.ltr__group-title { font-size: 16px; font-weight: var(--font-weight-bold, 700);
  margin: 0 0 4px; color: var(--color-text-on-light-headers, #00263e); }
.ltr__group-note { margin: 0 0 16px; font-size: 13px; color: var(--color-text-on-light-subdued, #586e84); }
.ltr__group-note code { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: 12px; }
.ltr__caption { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

/* responsive legend */
.ltr__legend { display: flex; align-items: flex-start; gap: 8px; margin: 0 0 24px; padding: 10px 14px;
  border-radius: var(--border-radius-soft, 6px); background: var(--color-primary-selected, #e5f0f9);
  font-size: 13px; line-height: 1.5; color: var(--color-text-on-light-default, #00263e); }
.ltr__legend code { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: 12px; }
.ltr__legend-dot { flex: 0 0 auto; width: 8px; height: 8px; margin-top: 6px; border-radius: 50%;
  background: var(--color-primary, #004370); }

/* documentation table — Name/Size · Properties · Example */
.ltr__doc { border-top: 1px solid var(--color-neutral-15, #dae3eb); }
.ltr__doc-row { display: grid; grid-template-columns: minmax(140px, 1fr) minmax(200px, 1.3fr) minmax(220px, 2fr);
  gap: 16px 20px; padding: 18px 0; border-bottom: 1px solid var(--color-neutral-10, #e7edf3);
  align-items: start; }
.ltr__doc-head { padding: 8px 0; border-bottom: 1px solid var(--color-neutral-15, #dae3eb); }
.ltr__col-h { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--color-text-on-light-subdued, #586e84); }
.ltr__doc-name { display: flex; flex-direction: column; gap: 2px; }
.ltr__doc-path { font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em;
  color: var(--color-text-on-light-subdued, #586e84); }
.ltr__doc-size-name { font-size: 18px; font-weight: 700; color: var(--color-text-on-light-headers, #00263e); }
.ltr__props { margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; font-size: 12px; }
.ltr__props dt { color: var(--color-text-on-light-subdued, #586e84); }
.ltr__props dd { margin: 0; color: var(--color-text-on-light-default, #00263e);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; }
.ltr__resp b { font-weight: 700; color: var(--color-text-on-light-headers, #00263e); }
.ltr__doc-example { min-width: 0; }
.ltr__doc-example .ltr__sample { margin: 0; overflow-wrap: anywhere; }
.ltr__sample { color: var(--color-text-on-light-headers, #00263e); }
.ltr__role-tokens { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.ltr__tag { display: inline-block; font-family: var(--font-family-body, sans-serif);
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
  padding: 1px 6px; border-radius: 999px; vertical-align: middle;
  color: var(--color-text-on-light-state-warning, #473201);
  background: var(--color-yellow-03, #fef3d7); }

@media (max-width: 700px) {
  .ltr__doc-row { grid-template-columns: 1fr; gap: 8px; }
  .ltr__doc-head { display: none; }
}

/* named roles (native-element group still uses the simple stacked layout) */
.ltr__role { padding: 16px 0; border-top: 1px solid var(--color-neutral-10, #e7edf3); }
.ltr__role-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 14px; margin-bottom: 8px; }
.ltr__role-name { font-weight: 600; font-size: 13px; color: var(--color-text-on-light-headers, #00263e); }
.ltr__role-spec { font-size: 12px; color: var(--color-text-on-light-subdued, #586e84);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; }

/* tables (scale / weights / tracking) */
.ltr__table { width: 100%; border-collapse: collapse; font-size: 13px; }
.ltr__table thead th { text-align: left; font-weight: 600; font-size: 12px;
  color: var(--color-text-on-light-subdued, #586e84);
  padding: 8px 12px; border-bottom: 1px solid var(--color-neutral-15, #dae3eb); }
.ltr__table tbody td, .ltr__table tbody th { padding: 10px 12px;
  border-bottom: 1px solid var(--color-neutral-10, #e7edf3); vertical-align: middle; text-align: left; }
.ltr__scale-sample, .ltr__wt-sample, .ltr__track-sample {
  font-weight: 400; color: var(--color-text-on-light-headers, #00263e);
  font-family: var(--font-family-heading, "Open Sans", system-ui, sans-serif); white-space: nowrap; }
.ltr__scale-sample { font-weight: 700; }
.ltr__mono { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px; color: var(--color-text-on-light-default, #00263e); white-space: nowrap; }

/* line-height cards */
.ltr__leading { margin: 0 0 16px; padding: 12px 16px; border-radius: var(--border-radius-soft, 6px);
  background: var(--color-neutral-05, #f5f7f9); }
.ltr__leading-sample { margin: 0 0 6px; font-size: 16px; color: var(--color-text-on-light-headers, #00263e); }
.ltr__leading figcaption { font-size: 12px; color: var(--color-text-on-light-subdued, #586e84); }

/* copy chips */
.ltr__copy { font: inherit; border: 0; background: var(--color-neutral-05, #f5f7f9);
  padding: 3px 8px; border-radius: 4px; cursor: pointer;
  color: var(--color-text-on-light-link-primary-enabled, #004370); }
.ltr__copy code { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: 12px; color: inherit; }
.ltr__copy:hover { background: var(--color-neutral-10, #e7edf3); }
.ltr__copy:focus-visible { outline: 2px solid var(--color-domain-interactive-focused, #0071bc); outline-offset: 1px; }
.ltr__copy.is-copied { color: var(--color-text-on-light-state-success, #234f03); }
.ltr__copy.is-copied::after { content: " ✓"; }

/* Native element defaults — mirrors loop-headings.css for shadow DOM context.
 * Class selectors (.ltr__heading, .ltr__group-title, .loop-heading-*) have higher
 * specificity (0,1,0) than these element rules (0,0,1) so they always win. */
h1 { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-1100); font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); color: var(--color-text-on-light-headers, #00263e); margin: 0; }
h2 { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-800);  font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); color: var(--color-text-on-light-headers, #00263e); margin: 0; }
h3 { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-800);  font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); color: var(--color-text-on-light-headers, #00263e); margin: 0; }

/* Role classes — mirrors tokens/typography-roles.css, redeclared in shadow scope.
 * CSS custom properties inherit through Shadow DOM so var() resolves from :root (and from
 * body.tablet / body.phone, which set the responsive scale on the host's ancestor). */
.loop-heading-h1-large { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-1200); font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); letter-spacing: var(--letter-spacing-heading); }
.loop-heading-h1-base  { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-1100); font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); }
.loop-heading-h1-small { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-900);  font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); }
.loop-heading-h1-tiny  { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-700);  font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); }
.loop-heading-h2-large { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-1100); font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); }
.loop-heading-h2-small { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-800);  font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); }
.loop-heading-h3-base  { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-800);  font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); }

.loop-label-medium { font-family: var(--font-family-label,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-1100); font-weight: var(--font-weight-bold); line-height: var(--line-height-solid); letter-spacing: var(--letter-spacing-label); }
.loop-label-base   { font-family: var(--font-family-label,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-1000); font-weight: var(--font-weight-bold); line-height: var(--line-height-label); letter-spacing: var(--letter-spacing-label); }
.loop-label-small  { font-family: var(--font-family-label,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-900);  font-weight: var(--font-weight-bold); line-height: var(--line-height-label); letter-spacing: var(--letter-spacing-label); }
.loop-label-tiny   { font-family: var(--font-family-label,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-700);  font-weight: var(--font-weight-bold); line-height: var(--line-height-label); letter-spacing: var(--letter-spacing-label); }

.loop-body-large     { font-family: var(--font-family-body,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-600); font-weight: var(--font-weight-regular); line-height: var(--line-height-base); letter-spacing: var(--letter-spacing-tight); }
.loop-body-medium    { font-family: var(--font-family-body,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-500); font-weight: var(--font-weight-regular); line-height: var(--line-height-base); letter-spacing: -0.25px; }
.loop-body-base      { font-family: var(--font-family-body,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-300); font-weight: var(--font-weight-regular); line-height: var(--line-height-base); letter-spacing: var(--letter-spacing-none); }
.loop-body-small     { font-family: var(--font-family-body,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-200); font-weight: var(--font-weight-regular); line-height: var(--line-height-base); letter-spacing: var(--letter-spacing-none); }
.loop-body-tiny      { font-family: var(--font-family-body,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-100); font-weight: var(--font-weight-regular); line-height: var(--line-height-base); letter-spacing: 0.25px; }
.loop-body-tiny-caps { font-family: var(--font-family-body,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-100); font-weight: var(--font-weight-regular); line-height: var(--line-height-narrow); letter-spacing: var(--letter-spacing-caps); text-transform: uppercase; }

@media (prefers-reduced-motion: reduce) { .ltr__copy { transition: none; } }
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

  if (!customElements.get("loop-typography-reference")) {
    customElements.define("loop-typography-reference", LoopTypographyReference);
  }
})();
```

</details>

## The utility classes
For every `--font-size-<name>` and `--font-weight-<name>` token:
```css
.font-size-<name>   { font-size:   var(--font-size-<name>) !important; }
.font-weight-<name> { font-weight: var(--font-weight-<name>) !important; }
```
e.g. `.font-size-800` (32px), `.font-size-1200` (60px), `.font-weight-bold`. Apply via
**ExtendedClass** (hard rule #7); values resolve through `var(--token)` (hard rule #3).

> Scope is the raw **scale + weights**. The **named type styles** (Heading H1 Large, Body
> Large, …) compose size+weight+line-height+tracking; they're documented live by the
> component but not minted as classes, because two of their tracking values are off the
> token scale (see below).

### Regenerating
After editing `tokens/typography.css`:
```bash
npm run gen:type-utilities    # rewrites tokens/typography-utilities.css
npm run build:theme           # folds it into dist/theme.css
```

## Named type styles (the Figma roles, Open Sans)
Rendered by the component; here for reference.

**Headings — Bold (700), line-height 1.12.** Grouped by level to mirror the Figma
`Heading/H{n}/{variant}` structure; each level carries only the size variants Figma
defines (H1 → 4, H2 → 2, H3 → 1 — no H5/H6, no fabricated variants). H1 Base / H2 Large
share 48px; H2 Small / H3 Base share 32px — same visual size, different semantic level.

| Level | Variant | Size | Class | Token |
|---|---|---|---|---|
| **H1** | Large | 60px (tracking −3px) | `.loop-heading-h1-large` | `--font-size-1200` |
| **H1** | Base | 48px | `.loop-heading-h1-base` | `--font-size-1100` |
| **H1** | Small | 36px | `.loop-heading-h1-small` | `--font-size-900` |
| **H1** | Tiny | 28px | `.loop-heading-h1-tiny` | `--font-size-700` |
| **H2** | Large | 48px | `.loop-heading-h2-large` | `--font-size-1100` |
| **H2** | Small | 32px | `.loop-heading-h2-small` | `--font-size-800` |
| **H3** | Base | 32px | `.loop-heading-h3-base` | `--font-size-800` |

**Body — Regular (400), line-height 1.5 (labels Bold 700):**
| Role | Size | Tracking |
|---|---|---|
| Body · Large | 24px | −0.35px (`--letter-spacing-tight`) |
| Body · Medium | 20px | −0.25px **(off-scale)** |
| Body · Base | 16px | 0 |
| Body · Small | 14px | 0 |
| Body · Tiny | 12px | 0.25px **(off-scale)** |
| Body · Tiny · All Caps | 12px, uppercase, lh 1.25 | 1px (`--letter-spacing-caps`) |

> **Off-scale tracking** (Body Medium −0.25px, Body Tiny 0.25px) is not on the documented
> letter-spacing scale (same family as FND-013/022). Built faithfully as literals and
> tagged "off-scale" in the reference — flag to design before tokenising.

## Using `<loop-typography-reference>` in ODC
1. Add `loop-typography-reference.js` to **Resources** (Deploy to Target Directory) — or load
   via a Scripts block on the Style-Guide screen.
2. On the **Live Style Guide** screen, add an **HTML Element** (tag `loop-typography-reference`):
   ```html
   <loop-typography-reference
     intro="Type system generated live from the WBG / The Loop theme.">
   </loop-typography-reference>
   ```
3. Publish → open in a **real browser** (hard rule #2).

### Attributes
| Attribute | Default | Description |
|---|---|---|
| `heading` | `Typography` | Section heading |
| `intro` | — | Intro line under the heading |
| `filter` | (all) | Comma list of sections: `styles`, `scale`, `weights`, `leading`, `tracking` |

Each class / variable chip is **click-to-copy** (✓ cue).

## Accessibility (WCAG 2.2 AA)
- Section headings + real `<table>`s with `scope`'d headers + visually-hidden captions.
- Illustrative samples are `aria-hidden`; the spec text + tokens carry the meaning.
- Copy buttons have `aria-label`s; focus ring uses `--color-domain-interactive-focused`;
  `prefers-reduced-motion` honored.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, place the Style-Guide reference element <loop-typography-reference> on the Style Guide
screen for the WBG "The Loop" design system.

Context (already done): loop-typography-reference.js is added under Resources and loads on the Style-Guide
screen; dist/tokens.css + dist/theme.css are in the Theme. It is a self-contained display component.

Task: add the <loop-typography-reference> element to the Style Guide screen where this specimen belongs.
There are no inputs or events to wire. Do NOT write CSS or JavaScript.

Constraints: never edit the OutSystems UI module; add no styles. Report what you placed.
```

## Checklist
- [ ] `npm run build:theme`; paste `dist/theme.css` into the ODC Theme editor.
- [ ] Add `loop-typography-reference.js` to Resources; load it on the Style-Guide screen.
- [ ] Place `<loop-typography-reference>`; publish.
- [ ] Validate in a **real browser**: samples render at the right size/weight, scale &
      weight values populate, click-to-copy works, focus rings visible.
- [ ] Spot-check a couple of utilities on a Container via ExtendedClass
      (`font-size-800 font-weight-bold`).
