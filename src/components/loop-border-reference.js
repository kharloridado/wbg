/**
 * <loop-border-reference> — auto-rendered Live Style Guide reference for BORDERS:
 * both the SIZE (stroke width) scale and the RADIUS (corner rounding) scale.
 *
 * The border counterpart to <loop-color-reference> / <loop-typography-reference>: drop
 * this one file into ODC (Resources) and place a single <loop-border-reference> element
 * on a Style-Guide screen. It renders every border-size and radius token with a LIVE
 * specimen, its resolved value and a click-to-copy CSS-variable chip — NO rows by hand.
 *
 * Source of truth = the theme. The component never hard-codes a value; it reads each
 * token live via getComputedStyle(:root) at render time, so specimens always match
 * dist/theme.css (tokens/border.css = --border-size-*, tokens/radius.css = --radius-*).
 * The SIZES and RADII name lists mirror those files.
 *
 * Each row also documents the UTILITY CLASS to drop on an element (via ExtendedClass),
 * not just the token, with its own click-to-copy chip:
 *   - border size   → native OutSystems UI `.border-size-<name>` (resolves to --border-size-*)
 *   - border radius → Loop `.border-radius-<name>` (tokens/radius-utilities.css → --radius-*)
 *
 * Attributes:
 *   heading   Optional section heading (default: "Borders · size & radius")
 *   intro     Optional intro line under the heading
 *   filter    Optional comma list of section keys: size,radius
 *
 * Behaviour: each CSS-variable chip is a button — click to copy (with a ✓ cue).
 * Accessibility: real <table>s with scope'd headers + <caption>; specimens decorative
 * (aria-hidden); copy buttons have aria-labels; brand focus ring; reduced-motion honored.
 * No framework (CLAUDE.md hard rule #6 — vanilla Web Component).
 */
(function () {
  /* Border-size (stroke width) scale — mirrors tokens/border.css (--border-size-<name>). */
  const SIZES = [
    { name: "none", label: "None", use: "No stroke" },
    { name: "s",    label: "S",    use: "Hairline — default control / divider border" },
    { name: "m",    label: "M",    use: "Emphasis — selected / focused control edge" },
    { name: "l",    label: "L",    use: "Heaviest — high-contrast focus outline" },
  ];

  /* Border-radius (corner) scale — mirrors tokens/radius.css (--radius-<name>). */
  const RADII = [
    { name: "xs",     label: "XS",     use: "Joined inner corners (button group)" },
    { name: "base",   label: "Base",   use: "Default control radius" },
    { name: "medium", label: "Medium", use: "Cards, larger surfaces" },
    { name: "large",  label: "Large",  use: "Large containers, modals" },
    { name: "pill",   label: "Pill",   use: "Fully-rounded pill (buttons, tags)" },
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  function val(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }

  class LoopBorderReference extends HTMLElement {
    static get observedAttributes() { return ["heading", "intro", "filter"]; }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._onCopy = this._onCopy.bind(this);
    }

    connectedCallback() { this._render(); }
    attributeChangedCallback(n, o, v) { if (o !== v && this.shadowRoot.childElementCount) this._render(); }

    get _heading() { return this.getAttribute("heading") || "Borders"; }
    get _intro() { return this.getAttribute("intro") || ""; }
    get _filter() {
      const f = this.getAttribute("filter");
      return f ? f.split(",").map((s) => s.trim()).filter(Boolean) : null;
    }
    _show(key) { const f = this._filter; return !f || f.includes(key); }

    _render() {
      const intro = this._intro ? `<p class="lbr__intro">${esc(this._intro)}</p>` : "";
      const parts = [];
      if (this._show("size")) parts.push(this._sizeHtml());
      if (this._show("radius")) parts.push(this._radiusHtml());
      this.shadowRoot.innerHTML = `
        <style>${this._css()}</style>
        <section class="lbr" part="root">
          <h2 class="lbr__heading">${esc(this._heading)}</h2>
          ${intro}
          ${parts.join("")}
        </section>`;
      this.shadowRoot.querySelectorAll("button.lbr__copy").forEach((b) =>
        b.addEventListener("click", this._onCopy)
      );
    }

    _copyBtn(text) {
      return `<button type="button" class="lbr__copy" data-copy="${esc(text)}" aria-label="Copy ${esc(text)}"><code>${esc(text)}</code></button>`;
    }

    /* ---- border size (stroke width) ---- */
    _sizeHtml() {
      const rows = SIZES.map((s) => {
        const v = `--border-size-${s.name}`;
        const cls = `.border-size-${s.name}`;
        const resolved = val(v) || "—";
        return `
          <tr>
            <th scope="row" class="lbr__cell">
              <span class="lbr__size-chip" aria-hidden="true" style="border-bottom-width:var(${v})"></span>
              <span class="lbr__cap-name">${esc(s.label)}</span>
            </th>
            <td>${this._copyBtn(cls)}</td>
            <td class="lbr__mono">${esc(resolved)}</td>
            <td class="lbr__use">${esc(s.use)}</td>
            <td>${this._copyBtn(v)}</td>
          </tr>`;
      }).join("");
      return `
        <div class="lbr__group">
          <h3 class="lbr__group-title">Border size · stroke width</h3>
          <p class="lbr__group-note">Stroke-width scale (<code>--border-size-*</code>). Drop the native OutSystems UI <code>.border-size-&lt;name&gt;</code> class via <strong>ExtendedClass</strong> (sets all four edges, <code>solid currentColor</code>; per-edge variants <code>.border-top/right/bottom/left-{s,m,l}</code>), or reference the variable in custom CSS (<code>border: var(--border-size-s) solid …</code>). Names match OutSystems UI so the framework's own <code>var(--border-size-*)</code> references resolve to The Loop theme.</p>
          <div class="lbr__table-wrap"><table class="lbr__table">
            <caption class="lbr__caption">Border-size tokens, utility classes, values and CSS variables</caption>
            <thead><tr><th scope="col">Size</th><th scope="col">Class</th><th scope="col">Value</th><th scope="col">Use</th><th scope="col">CSS Variable</th></tr></thead>
            <tbody>${rows}</tbody>
          </table></div>
        </div>`;
    }

    /* ---- border radius ---- */
    _radiusHtml() {
      const rows = RADII.map((r) => {
        const v = `--radius-${r.name}`;
        const cls = `.border-radius-${r.name}`;
        const resolved = val(v) || "—";
        return `
          <tr>
            <th scope="row" class="lbr__cell">
              <span class="lbr__radius-chip" aria-hidden="true" style="border-radius:var(${v})"></span>
              <span class="lbr__cap-name">${esc(r.label)}</span>
            </th>
            <td>${this._copyBtn(cls)}</td>
            <td class="lbr__mono">${esc(resolved)}</td>
            <td class="lbr__use">${esc(r.use)}</td>
            <td>${this._copyBtn(v)}</td>
          </tr>`;
      }).join("");
      return `
        <div class="lbr__group">
          <h3 class="lbr__group-title">Border radius · corners</h3>
          <p class="lbr__group-note">Corner-radius scale (<code>--radius-*</code>). Drop the Loop <code>.border-radius-&lt;name&gt;</code> class via <strong>ExtendedClass</strong> (tokens/radius-utilities.css — extends the OutSystems UI <code>.border-radius-*</code> family, which only ships <code>soft</code>/<code>rounded</code>/<code>circle</code>; <code>.border-radius-base</code> is the Loop alias of OS UI's <code>.border-radius-soft</code>), or reference the variable in custom CSS (<code>border-radius: var(--radius-medium)</code>).</p>
          <div class="lbr__table-wrap"><table class="lbr__table">
            <caption class="lbr__caption">Border-radius tokens, utility classes, values and CSS variables</caption>
            <thead><tr><th scope="col">Radius</th><th scope="col">Class</th><th scope="col">Value</th><th scope="col">Use</th><th scope="col">CSS Variable</th></tr></thead>
            <tbody>${rows}</tbody>
          </table></div>
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
.lbr__heading { font-size: 24px; font-weight: var(--font-weight-bold, 700);
  margin: 0 0 8px; color: var(--color-text-on-light-headers, #00263e); }
.lbr__intro { margin: 0 0 24px; font-size: 14px; color: var(--color-text-on-light-subdued, #586e84); }
.lbr__group { margin: 0 0 40px; }
.lbr__group-title { font-size: 16px; font-weight: var(--font-weight-bold, 700);
  margin: 0 0 4px; color: var(--color-text-on-light-headers, #00263e); }
.lbr__group-note { margin: 0 0 16px; font-size: 13px; color: var(--color-text-on-light-subdued, #586e84); }
.lbr__group-note code { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: 12px; }
.lbr__caption { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

.lbr__mono { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px; color: var(--color-text-on-light-default, #00263e); white-space: nowrap; }
.lbr__cap-name { font-weight: 600; font-size: 13px; color: var(--color-text-on-light-headers, #00263e); }
.lbr__use { font-size: 12px; color: var(--color-text-on-light-subdued, #586e84); }

.lbr__table-wrap { overflow-x: auto; }
.lbr__table { width: 100%; border-collapse: collapse; font-size: 13px; }
.lbr__table thead th { text-align: left; font-weight: 600; font-size: 12px;
  color: var(--color-text-on-light-subdued, #586e84);
  padding: 8px 12px; border-bottom: 1px solid var(--color-neutral-15, #dae3eb); white-space: nowrap; }
.lbr__table tbody td, .lbr__table tbody th { padding: 10px 12px;
  border-bottom: 1px solid var(--color-neutral-10, #e7edf3); vertical-align: middle; text-align: left; white-space: nowrap; }
.lbr__cell { display: flex; align-items: center; gap: 12px; white-space: nowrap; }

.lbr__radius-chip { width: 40px; height: 40px; flex: 0 0 auto;
  background: var(--color-blue-10, #e1ecf4);
  box-shadow: inset 0 0 0 2px var(--color-blue-50, #0071bc); }
/* size specimen: a 40px swatch whose BOTTOM edge thickness = the token */
.lbr__size-chip { display: block; width: 40px; height: 40px; flex: 0 0 auto;
  background: var(--color-blue-10, #e1ecf4); border-radius: var(--radius-xs, 2px);
  border-bottom-style: solid; border-bottom-color: var(--color-blue-50, #0071bc); }

.lbr__copy { font: inherit; border: 0; background: var(--color-neutral-05, #f5f7f9);
  padding: 3px 8px; border-radius: 4px; cursor: pointer;
  color: var(--color-text-on-light-link-primary-enabled, #004370); }
.lbr__copy code { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: 12px; color: inherit; }
.lbr__copy:hover { background: var(--color-neutral-10, #e7edf3); }
.lbr__copy:focus-visible { outline: 2px solid var(--color-domain-interactive-focused, #0071bc); outline-offset: 1px; }
.lbr__copy.is-copied { color: var(--color-text-on-light-state-success, #234f03); }
.lbr__copy.is-copied::after { content: " ✓"; }
@media (prefers-reduced-motion: reduce) { .lbr__copy { transition: none; } }
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

  if (!customElements.get("loop-border-reference")) {
    customElements.define("loop-border-reference", LoopBorderReference);
  }
})();
