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
