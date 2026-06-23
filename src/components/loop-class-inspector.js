/**
 * <loop-class-inspector> — "what classes make this look like that?"
 *
 * A Live Style Guide helper. Point it at any element on the page and it reads the
 * classes LIVE off that element's DOM and renders them as click-to-copy chips, plus a
 * one-click "copy all" of the full class attribute. A developer rebuilding the look in
 * ODC drops the classes onto their own widget's ExtendedClass and gets the same styling.
 *
 * It never hard-codes a class list — it scans the real rendered element, so it can't
 * drift from the components on the page. Because The Loop styling is applied through
 * classes on native OutSystems UI widgets (e.g. .btn.btn-primary, .loop-tag--success),
 * reading those classes IS the recipe to reproduce the component.
 *
 * Picking the target (in priority order):
 *   1. `target` attribute — a CSS selector resolved against the document
 *      (e.g. target="#sample-button" — in ODC, give the widget a Name so it renders
 *      that id, then point the inspector at "#<Name>").
 *   2. `for` attribute — alias for `target` (id OR selector).
 *   3. No target → inspects the FIRST element child slotted into the inspector, so you
 *      can simply wrap the sample: <loop-class-inspector><button class="btn btn-primary">…
 *
 * Attributes:
 *   target / for   CSS selector (or "#id") of the element to inspect.
 *   heading        Optional heading (default: "Classes on this element").
 *   label          Optional human label for what's being inspected (e.g. "Primary button").
 *   deep           Boolean — also list descendant elements that carry classes, each as
 *                  its own copyable group (useful for compound widgets like a card).
 *   ignore         Comma list of class names/prefixes to hide from the recipe. Trailing
 *                  "*" = prefix match (e.g. ignore="OSFillParent,is-*"). Filters noise
 *                  like runtime/layout helpers that aren't part of the look.
 *   no-live        Boolean — disable the MutationObserver. By default the inspector
 *                  re-scans when the target's class attribute changes, so toggling a
 *                  component's state updates the recipe in place.
 *   no-extended-hint  Boolean — hide the "add via ExtendedClass" footer note.
 *
 * Behaviour: every class chip and the "copy all" button copy to the clipboard with a
 * transient ✓ cue. Fully keyboard accessible.
 *
 * Accessibility: copy controls are real <button>s with aria-labels; a polite live region
 * announces "copied"; focus rings use the brand focus token; honors prefers-reduced-motion.
 *
 * No framework (CLAUDE.md hard rule #6 — vanilla Web Component).
 */
(function () {
  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  /* A short, readable selector for a descendant row, e.g. "button.btn.btn-primary"
   * or "span" — enough to tell sibling elements apart in `deep` mode. */
  function describe(el) {
    const tag = el.tagName.toLowerCase();
    const cls = Array.from(el.classList);
    return cls.length ? `${tag}.${cls.join(".")}` : tag;
  }

  class LoopClassInspector extends HTMLElement {
    static get observedAttributes() {
      return ["target", "for", "heading", "label", "deep", "ignore", "no-live", "no-extended-hint"];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._onCopy = this._onCopy.bind(this);
      this._onTargetMutation = this._onTargetMutation.bind(this);
      this._mo = null;        // observes the target's class attribute (live mode)
      this._docMo = null;     // watches for a not-yet-rendered target to appear
    }

    connectedCallback() {
      // Slotted-child mode needs the children parsed; defer one frame so the DOM is ready.
      requestAnimationFrame(() => {
        this._render();
        this._observe();
      });
    }

    disconnectedCallback() {
      this._disconnectObservers();
    }

    attributeChangedCallback(n, o, v) {
      if (o === v || !this.shadowRoot.childElementCount) return;
      this._render();
      this._observe();
    }

    /* ---- target resolution ---- */
    get _selector() {
      return this.getAttribute("target") || this.getAttribute("for") || "";
    }
    get _heading() { return this.getAttribute("heading") || "Classes on this element"; }
    get _label() { return this.getAttribute("label") || ""; }
    get _deep() { return this.hasAttribute("deep"); }
    get _live() { return !this.hasAttribute("no-live"); }
    get _extendedHint() { return !this.hasAttribute("no-extended-hint"); }
    get _ignore() {
      const raw = this.getAttribute("ignore");
      return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
    }

    _target() {
      const sel = this._selector;
      if (sel) {
        try { return document.querySelector(sel); }
        catch (_) { return null; } // invalid selector → treated as "not found"
      }
      // Fallback: first element child slotted into the inspector.
      return this.querySelector(":scope > *");
    }

    _ignored(name) {
      return this._ignore.some((rule) =>
        rule.endsWith("*") ? name.startsWith(rule.slice(0, -1)) : name === rule);
    }

    _classesOf(el) {
      return Array.from(el.classList).filter((c) => !this._ignored(c));
    }

    /* ---- rendering ---- */
    _render() {
      const target = this._target();
      const css = `<style>${this._css()}</style>`;

      if (!target) {
        this.shadowRoot.innerHTML = `${css}
          <section class="lci" part="root">
            <h2 class="lci__heading">${esc(this._heading)}</h2>
            <p class="lci__empty" role="status">
              ${this._selector
                ? `No element matched <code>${esc(this._selector)}</code> on this page yet.`
                : `Nothing to inspect — set a <code>target</code> selector, or place the sample element inside this component.`}
            </p>
          </section>`;
        return;
      }

      const classes = this._classesOf(target);
      const labelLine = this._label
        ? `<p class="lci__label">${esc(this._label)} — <code>${esc(describe(target))}</code></p>`
        : `<p class="lci__label"><code>${esc(describe(target))}</code></p>`;

      const body = classes.length
        ? this._recipeHtml(classes)
        : `<p class="lci__empty" role="status">This element has no classes${this._ignore.length ? " (after the ignore filter)" : ""}.</p>`;

      const deep = this._deep ? this._deepHtml(target) : "";
      const hint = this._extendedHint
        ? `<p class="lci__hint">In ODC, paste these into the widget's <strong>Extended Class/Style Classes</strong> property to reproduce the look &amp; feel.</p>`
        : "";

      this.shadowRoot.innerHTML = `${css}
        <section class="lci" part="root">
          <h2 class="lci__heading">${esc(this._heading)}</h2>
          ${labelLine}
          ${body}
          ${deep}
          ${hint}
          <span class="lci__sr" role="status" aria-live="polite"></span>
        </section>`;

      this.shadowRoot.querySelectorAll("button.lci__copy").forEach((b) =>
        b.addEventListener("click", this._onCopy));
    }

    _recipeHtml(classes) {
      const all = classes.join(" ");
      const chips = classes.map((c) => this._chip(c)).join("");
      return `
        <div class="lci__recipe">
          <div class="lci__chips">${chips}</div>
          ${this._copyAll(all, "Copy all " + classes.length + " classes")}
        </div>`;
    }

    _deepHtml(root) {
      const rows = Array.from(root.querySelectorAll("*"))
        .map((el) => ({ el, classes: this._classesOf(el) }))
        .filter((r) => r.classes.length)
        .map(({ el, classes }) => `
          <div class="lci__deep-row">
            <code class="lci__deep-sel">${esc(el.tagName.toLowerCase())}</code>
            <div class="lci__chips">${classes.map((c) => this._chip(c)).join("")}</div>
            ${this._copyAll(classes.join(" "), "Copy classes for " + describe(el))}
          </div>`)
        .join("");

      if (!rows) return "";
      return `
        <details class="lci__deep" open>
          <summary class="lci__deep-summary">Descendant elements with classes</summary>
          ${rows}
        </details>`;
    }

    _chip(cls) {
      return `<button type="button" class="lci__copy lci__chip" data-copy="${esc(cls)}"
                aria-label="Copy class ${esc(cls)}"><code>${esc(cls)}</code></button>`;
    }

    _copyAll(text, aria) {
      return `<button type="button" class="lci__copy lci__copy-all" data-copy="${esc(text)}"
                aria-label="${esc(aria)}"><span class="lci__copy-all-icon" aria-hidden="true">⧉</span>Copy all</button>`;
    }

    _onCopy(e) {
      const btn = e.currentTarget;
      const text = btn.getAttribute("data-copy");
      const done = () => {
        btn.classList.add("is-copied");
        setTimeout(() => btn.classList.remove("is-copied"), 1200);
        const sr = this.shadowRoot.querySelector(".lci__sr");
        if (sr) { sr.textContent = ""; sr.textContent = `Copied: ${text}`; }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
      } else {
        fallbackCopy(text, done);
      }
    }

    /* ---- live observation ---- */
    _observe() {
      this._disconnectObservers();
      if (!this._live) return;

      const target = this._target();
      if (target) {
        this._mo = new MutationObserver(this._onTargetMutation);
        // Watch the target's own class attribute and (for deep mode) its subtree.
        this._mo.observe(target, {
          attributes: true,
          attributeFilter: ["class"],
          subtree: this._deep,
        });
        return;
      }

      // Target not on the page yet (async render): watch the document until it appears,
      // then re-render and switch to observing the target itself.
      if (this._selector) {
        this._docMo = new MutationObserver(() => {
          if (this._target()) { this._render(); this._observe(); }
        });
        this._docMo.observe(document.body, { childList: true, subtree: true });
      }
    }

    _onTargetMutation() { this._render(); }

    _disconnectObservers() {
      if (this._mo) { this._mo.disconnect(); this._mo = null; }
      if (this._docMo) { this._docMo.disconnect(); this._docMo = null; }
    }

    _css() {
      return `
:host { display: block;
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  color: var(--color-text-on-light-default, #000d1ab2); }

.lci { border: 1px solid var(--color-neutral-15, #dae3eb);
  border-radius: var(--border-radius-soft, 6px);
  background: var(--color-neutral-05, #f5f7f9);
  padding: 16px 18px; }

.lci__heading { font-size: 15px; font-weight: var(--font-weight-bold, 700);
  margin: 0 0 2px; color: var(--color-text-on-light-headers, #00263e); }
.lci__label { margin: 0 0 14px; font-size: 12px;
  color: var(--color-text-on-light-subdued, #586e84); }
.lci__label code, .lci__deep-sel { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px; color: var(--color-text-on-light-default, #00263e); }

.lci__recipe { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.lci__chips { display: flex; flex-wrap: wrap; gap: 6px; }

/* copy chip = one class */
.lci__copy { font: inherit; cursor: pointer; border-radius: 4px;
  transition: background-color .12s ease, color .12s ease, box-shadow .12s ease; }
.lci__copy:focus-visible { outline: 2px solid var(--color-domain-interactive-focused, #0071bc);
  outline-offset: 2px; }
.lci__copy.is-copied { color: var(--color-text-on-light-state-success, #234f03);
  box-shadow: inset 0 0 0 1px var(--color-text-on-light-state-success, #234f03); }

.lci__chip { display: inline-flex; align-items: center; padding: 3px 8px; margin: 0;
  border: 1px solid var(--color-neutral-15, #dae3eb);
  background: var(--color-white, #fff);
  color: var(--color-text-on-light-link-primary-enabled, #004370); }
.lci__chip:hover { border-color: var(--color-blue-50, #0071bc);
  background: var(--color-blue-05, #eff6fb); }
.lci__chip code { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px; color: inherit; }
.lci__chip.is-copied { background: var(--color-green-03, #f0f7e9); }

/* copy-all button */
.lci__copy-all { display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px; border: 0;
  background: var(--color-blue-50, #0071bc); color: var(--color-white, #fff);
  font-size: 12px; font-weight: var(--font-weight-bold, 700); }
.lci__copy-all:hover { background: var(--color-blue-60, #005a96); }
.lci__copy-all-icon { font-size: 13px; line-height: 1; }
.lci__copy-all.is-copied { background: var(--color-text-on-light-state-success, #234f03);
  color: var(--color-white, #fff); box-shadow: none; }

.lci__empty { margin: 0; font-size: 13px; color: var(--color-text-on-light-subdued, #586e84); }
.lci__empty code { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: 12px; }

.lci__hint { margin: 14px 0 0; font-size: 12px; line-height: 1.5;
  color: var(--color-text-on-light-subdued, #586e84); }

/* deep mode */
.lci__deep { margin: 14px 0 0; }
.lci__deep-summary { cursor: pointer; font-size: 12px; font-weight: 600;
  color: var(--color-text-on-light-headers, #00263e); padding: 4px 0; }
.lci__deep-summary:focus-visible { outline: 2px solid var(--color-domain-interactive-focused, #0071bc);
  outline-offset: 2px; border-radius: 4px; }
.lci__deep-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
  padding: 8px 0; border-top: 1px solid var(--color-neutral-10, #e7edf3); }
.lci__deep-sel { flex: 0 0 auto; min-width: 56px; }

.lci__sr { position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) { .lci__copy { transition: none; } }
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

  if (!customElements.get("loop-class-inspector")) {
    customElements.define("loop-class-inspector", LoopClassInspector);
  }
})();
