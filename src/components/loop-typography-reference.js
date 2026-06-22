/**
 * <loop-typography-reference> — auto-rendered Live Style Guide typography reference.
 *
 * The typography counterpart to <loop-color-reference>: drop this one file into ODC
 * (Resources) and place a single <loop-typography-reference> element on a Style-Guide screen.
 * It renders the whole type system — named type styles (Heading/Body roles), the
 * font-size scale, weights, line-heights and letter-spacing — with NO rows built by
 * hand in Service Studio.
 *
 * Source of truth = the WBG / "The Loop" Figma type page (node 10995-7259), font
 * Open Sans (FND-002 sign-off). The font-size / weight / line-height / tracking values
 * are read LIVE from the theme (getComputedStyle(:root)) so the samples always match
 * dist/theme.css; the named-role composition (which size+weight+lh+tracking make up
 * "Heading H1 Large", etc.) is the Figma spec, embedded below.
 *
 * Off-scale note: Body/Medium tracking (-0.25px) and Body/Tiny tracking (0.25px) are
 * not on the documented letter-spacing scale (same family as the FND-013/022 findings),
 * so they render as literals and are tagged "off-scale" — flagged, built faithfully.
 *
 * Attributes:
 *   heading   Optional section heading (default: "Typography")
 *   intro     Optional intro line under the heading
 *   filter    Optional comma list of section keys: styles,elements,scale,weights,leading,tracking
 *
 * Behaviour: each class / variable chip is a button — click to copy (with a ✓ cue).
 *
 * Accessibility: section landmarks + headings; sample text marked aria-hidden where it
 * is illustrative only (the spec text carries the meaning); copy buttons have
 * aria-labels; focus ring uses the brand focus token; honors prefers-reduced-motion.
 *
 * No framework (CLAUDE.md hard rule #6 — vanilla Web Component).
 */
(function () {
  /* Named type styles — the Figma roles (node 10995-7259), Open Sans.
   * size/weight/lh reference scale tokens; `ls` is a token name, or {px} for an
   * off-scale literal, or null for the type's default. `caps` = uppercase All-Caps.
   * `sample` is the role-specific display text shown in the preview row. */
  const SAMPLE = "The quick brown fox jumps over the lazy dog";

  const STYLES = {
    heading: {
      title: "Heading styles",
      note: "Open Sans Bold. Headings use the 1.12 (heading) line-height. Note: H1 Base and H2 Large share 48px; H2 Small and H3 Base share 32px — differentiated by semantic level and position in layout, not by visual size.",
      roles: [
        { label: "H1 · Large",  size: "1200", weight: "bold", lh: "heading", ls: "heading",
          sample: "Transforming Lives",          cls: "loop-heading-h1-large" },
        { label: "H1 · Base",   size: "1100", weight: "bold", lh: "heading", ls: null,
          sample: "Annual Report 2025",          cls: "loop-heading-h1-base"  },
        { label: "H1 · Small",  size: "900",  weight: "bold", lh: "heading", ls: null,
          sample: "Country Portfolio Summary",   cls: "loop-heading-h1-small" },
        { label: "H1 · Tiny",   size: "700",  weight: "bold", lh: "heading", ls: null,
          sample: "Project Overview",            cls: "loop-heading-h1-tiny"  },
        { label: "H2 · Large",  size: "1100", weight: "bold", lh: "heading", ls: null,
          sample: "Strategic Priorities",        cls: "loop-heading-h2-large" },
        { label: "H2 · Small",  size: "800",  weight: "bold", lh: "heading", ls: null,
          sample: "Regional Analysis",           cls: "loop-heading-h2-small" },
        { label: "H3 · Base",   size: "800",  weight: "bold", lh: "heading", ls: null,
          sample: "Key Findings",                cls: "loop-heading-h3-base"  },
      ],
    },
    body: {
      title: "Body styles",
      note: "Open Sans Regular. Body uses the 1.5 (base) line-height. Labels use Bold (700).",
      roles: [
        { label: "Body · Large",           size: "600", weight: "regular", lh: "base", ls: "tight",
          cls: "loop-body-large",
          sample: "The World Bank Group is a unique global partnership of five institutions working for sustainable solutions that reduce poverty and build shared prosperity in developing countries." },
        { label: "Body · Medium",          size: "500", weight: "regular", lh: "base", ls: { px: "-0.25px", off: true },
          cls: "loop-body-medium",
          sample: "This section summarises portfolio performance for the current fiscal year, covering active projects across all six operational regions." },
        { label: "Body · Base",            size: "300", weight: "regular", lh: "base", ls: "none",
          cls: "loop-body-base",
          sample: "Projects are evaluated against four pillars of sustainable development: economic growth, social inclusion, environmental sustainability, and effective governance." },
        { label: "Body · Small",           size: "200", weight: "regular", lh: "base", ls: "none",
          cls: "loop-body-small",
          sample: "For more information on project eligibility criteria, please refer to the operational guidelines section of this document." },
        { label: "Body · Tiny",            size: "100", weight: "regular", lh: "base", ls: { px: "0.25px", off: true },
          cls: "loop-body-tiny",
          sample: "Source: World Bank Group Annual Report 2025. All figures are in USD millions unless otherwise stated." },
        { label: "Body · Tiny · All Caps", size: "100", weight: "regular", lh: "narrow", ls: "caps", caps: true,
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
    { name: "semibold", label: "Semibold" },
    { name: "bold", label: "Bold" },
  ];

  const LEADING = [
    { name: "heading", label: "Heading", use: "Headings" },
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
      if (this._show("styles")) parts.push(this._stylesHtml(STYLES.heading), this._stylesHtml(STYLES.body));
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

    /* ---- named type styles ---- */
    _stylesHtml(group) {
      const rows = group.roles.map((r) => {
        const sizeVar = `--font-size-${r.size}`;
        const weightVar = `--font-weight-${r.weight}`;
        const lhVar = `--line-height-${r.lh}`;
        const px = val(sizeVar) || "";
        const wt = val(weightVar) || "";
        let lsLabel = "default", lsCopy = "";
        if (typeof r.ls === "string") {
          lsLabel = (val(`--letter-spacing-${r.ls}`) || "") + ` (${r.ls})`;
          lsCopy = `--letter-spacing-${r.ls}`;
        } else if (r.ls && r.ls.px) {
          lsLabel = `${r.ls.px}${r.ls.off ? " · off-scale" : ""}`;
        }
        const spec = `${px} · weight ${wt} · lh ${val(lhVar)} · tracking ${lsLabel}`;
        const offTag = (r.ls && r.ls.off) ? ` <span class="ltr__tag">off-scale</span>` : "";
        return `
          <div class="ltr__role">
            <div class="ltr__role-head">
              <span class="ltr__role-name">${esc(r.label)}</span>
              <span class="ltr__role-spec">${esc(spec)}${offTag}</span>
            </div>
            <p class="ltr__sample ${esc(r.cls)}" aria-hidden="true">${esc(r.sample)}</p>
            <div class="ltr__role-tokens">
              ${this._copyBtn("." + r.cls)} ${this._copyBtn(sizeVar)} ${this._copyBtn(weightVar)} ${this._copyBtn(lhVar)}${lsCopy ? " " + this._copyBtn(lsCopy) : ""}
            </div>
          </div>`;
      }).join("");
      return `
        <div class="ltr__group">
          <h3 class="ltr__group-title">${esc(group.title)}</h3>
          <p class="ltr__group-note">${esc(group.note)}</p>
          ${rows}
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
            <span class="ltr__role-spec">60px · Bold · lh 1.12 · tracking −3px · class overrides element default</span>
          </div>
          <h1 class="loop-heading-h1-large">Transforming Lives</h1>
          <div class="ltr__role-tokens">${this._copyBtn(".loop-heading-h1-large")}</div>
        </div>`;
      return `
        <div class="ltr__group">
          <h3 class="ltr__group-title">Native element defaults (h1–h3)</h3>
          <p class="ltr__group-note">OutSystems Heading widget renders these elements. No ExtendedClass needed for the default role — apply a <code>.loop-heading-*</code> class to override. h4–h6 have no Loop spec.</p>
          ${row("h1", "h1 element", "H1 · Base default · 48px · Bold · lh 1.12", "loop-heading-h1-base", "Annual Report 2025")}
          ${row("h2", "h2 element", "H2 · Small default · 32px · Bold · lh 1.12", "loop-heading-h2-small", "Regional Analysis")}
          ${row("h3", "h3 element", "H3 · Base default · 32px · Bold · lh 1.12", "loop-heading-h3-base", "Key Findings")}
          ${demoRow}
        </div>`;
    }

    /* ---- font-size scale ---- */
    _scaleHtml() {
      const row = (name) => {
        const v = `--font-size-${name}`;
        const px = val(v) || "—";
        return `
          <tr>
            <th scope="row" class="ltr__scale-sample" aria-hidden="true" style="font-size:var(${v})">Ag</th>
            <td class="ltr__mono">${esc(px)}</td>
            <td>${this._copyBtn("." + "font-size-" + name)}</td>
            <td>${this._copyBtn(v)}</td>
          </tr>`;
      };
      const aliasRows = SCALE_ALIASES.map(row).join("");
      return `
        <div class="ltr__group">
          <h3 class="ltr__group-title">Font-size scale</h3>
          <p class="ltr__group-note">The <code>Font-size/NNN</code> ramp from Figma. Apply <code>.font-size-NNN</code> via ExtendedClass or reference the variable.</p>
          <table class="ltr__table">
            <caption class="ltr__caption">Font sizes, utility classes and CSS variables</caption>
            <thead><tr><th scope="col">Sample</th><th scope="col">Size</th><th scope="col">Class</th><th scope="col">CSS Variable</th></tr></thead>
            <tbody>${SCALE.map(row).join("")}</tbody>
          </table>
          <p class="ltr__group-note" style="margin-top:16px">Semantic size aliases (lift body roles):</p>
          <table class="ltr__table">
            <caption class="ltr__caption">Semantic font-size aliases</caption>
            <thead><tr><th scope="col">Sample</th><th scope="col">Size</th><th scope="col">Class</th><th scope="col">CSS Variable</th></tr></thead>
            <tbody>${aliasRows}</tbody>
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
          <p class="ltr__group-note">Open Sans 400 / 600 / 700. Headings &amp; labels use Bold (700); body uses Regular (400).</p>
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

/* named roles */
.ltr__role { padding: 16px 0; border-top: 1px solid var(--color-neutral-solid-10, #e7edf3); }
.ltr__role-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 14px; margin-bottom: 8px; }
.ltr__role-name { font-weight: 600; font-size: 13px; color: var(--color-text-on-light-headers, #00263e); }
.ltr__role-spec { font-size: 12px; color: var(--color-text-on-light-subdued, #586e84);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; }
.ltr__sample { margin: 0 0 10px; color: var(--color-text-on-light-headers, #00263e); }
.ltr__role-tokens { display: flex; flex-wrap: wrap; gap: 6px; }
.ltr__tag { display: inline-block; font-family: var(--font-family-body, sans-serif);
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
  padding: 1px 6px; border-radius: 999px; vertical-align: middle;
  color: var(--color-text-on-light-state-warning, #473201);
  background: var(--color-yellow-03, #fef3d7); }

/* tables (scale / weights / tracking) */
.ltr__table { width: 100%; border-collapse: collapse; font-size: 13px; }
.ltr__table thead th { text-align: left; font-weight: 600; font-size: 12px;
  color: var(--color-text-on-light-subdued, #586e84);
  padding: 8px 12px; border-bottom: 1px solid var(--color-neutral-15, #dae3eb); }
.ltr__table tbody td, .ltr__table tbody th { padding: 10px 12px;
  border-bottom: 1px solid var(--color-neutral-solid-10, #e7edf3); vertical-align: middle; text-align: left; }
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
.ltr__copy:hover { background: var(--color-neutral-solid-10, #e7edf3); }
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
 * CSS custom properties inherit through Shadow DOM so var() resolves from :root. */
.loop-heading-h1-large { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-1200); font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); letter-spacing: var(--letter-spacing-heading); }
.loop-heading-h1-base  { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-1100); font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); }
.loop-heading-h1-small { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-900);  font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); }
.loop-heading-h1-tiny  { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-700);  font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); }
.loop-heading-h2-large { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-1100); font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); }
.loop-heading-h2-small { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-800);  font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); }
.loop-heading-h3-base  { font-family: var(--font-family-heading,'Open Sans',system-ui,sans-serif); font-size: var(--font-size-800);  font-weight: var(--font-weight-bold); line-height: var(--line-height-heading); }

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
