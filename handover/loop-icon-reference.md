# Handover — `<loop-icon-reference>` (Live Style Guide searchable icon grid)

A **searchable, click-to-copy icon documentation page** for the Live Style Guide — the icon
counterpart to `<loop-color-reference>` / `<loop-typography-reference>`. Drop **one** element on
a Style-Guide screen and it renders the **entire Font Awesome 6 Pro set** (~3,300 icons across
**solid · regular · light**) as a grid you can search by name or keyword and filter by style.
**Click any icon to copy its name** to paste into your **CustomIcon** block.

Pairs with `handover/loop-fontawesome.md` (the underlying font import). Built like the existing
reference Web Components — no rows built by hand in Service Studio.

## When to use / How to use

**What it is.** A self-contained Web Component that auto-renders the full icon catalogue with a
search box, style filters (All / Solid / Regular / Light with live counts), and copy-on-click
tiles. Each tile shows the glyph, the icon name, and its style.

**When to use**
- Documenting the icon library on a Live Style Guide page.
- Letting developers/designers find an icon and copy the exact token to feed a CustomIcon block.

**How to use** — place `<loop-icon-reference>` on a Style-Guide screen (after its data + script
Resources load). It reads the icon list from the generated `window.LoopIconData` global; no rows
are authored by hand.

### The copied value — match it to your CustomIcon block (`copy-format`)
Each tile copies a value; the `copy-format` attribute picks which, so it lands ready-to-paste:

| `copy-format` | A tile copies | Use when your CustomIcon input wants… |
|---|---|---|
| `class` *(default)* | `fa-solid fa-user` | a full class string (renders straight into `<i class="…">`) |
| `prefixed` | `fa-user` | the name with the `fa-` prefix (style applied separately) |
| `name` | `user` | the bare glyph name |

> Set `copy-format` once to whatever your `CustomIcon` block expects, then every copy is exact.

## Why this approach
- **No hand-built catalogue.** ~3,300 icons × (glyph + name + copy) is impossible to maintain by
  hand in ODC. One element renders it from generated data; the list can't drift from the font.
- **Search that actually finds things.** Filtering uses Font Awesome's own **search keywords**
  (e.g. "trash" surfaces `dumpster` / `recycle` / `trash-can`), not just the literal name.
- **Renders inside shadow DOM without the page's `.fa-*` classes.** Class rules don't pierce
  shadow DOM, so each glyph is drawn from its **unicode** via `content` against the
  document-scoped `@font-face` (which *is* visible in shadow DOM). The only runtime dependency is
  the FA `@font-face` being present — i.e. the `loop-fontawesome` import.

## Files
| File | OutSystems destination |
|---|---|
| `src/components/loop-icon-data.js` | **Generated Resource** (~415 KB) — add to **Resources**, load on the Style-Guide screen **before** the component. Its own paste (like `dist/theme.css`); regenerate, don't hand-edit. |
| `src/components/loop-icon-reference.js` | Add to **Resources** — load on the Style-Guide screen **after** the data file. |
| `vendor/fontawesome-6/icon-manifest.json` | Source of truth for the data (name/label/styles/unicode/terms), derived from FA metadata. |
| `build/gen-icon-data.mjs` | Build tooling — regenerates `loop-icon-data.js` from the manifest (`npm run gen:icon-data`). |

> **Prerequisite:** the Font Awesome font must be loaded app-wide — see `handover/loop-fontawesome.md`
> (paste `dist/fontawesome.css` + upload the 3 woff2). Without it, tiles render as empty boxes.

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-icon-reference.js</code> → Add to Resources — load on the Style-Guide screen, AFTER loop-icon-data.js</summary>

```js
/**
 * <loop-icon-reference> — the Live Style Guide's searchable Font Awesome 6 icon grid.
 *
 * The icon counterpart to <loop-color-reference> / <loop-typography-reference>: drop ONE
 * element on a Style-Guide screen and it renders the ENTIRE Font Awesome 6 Pro set
 * (~3,300 icons across solid / regular / light — brands not shipped) as a searchable grid.
 * Every tile is a click-to-copy button — copy the exact icon name to paste into your
 * CustomIcon block.
 *
 * DATA (three sources, tried in order — all reduce to the same internal rows):
 *   1. `src` attribute — comma-separated IcoMoon selection.json URLs (dist/icomoon/loop-fa-*).
 *      Fetched at runtime; carries the actual SVG PATH per glyph → true inline-SVG rendering,
 *      independent of the woff2 font. This is the preview path (ODC blocks fetch/CORS).
 *   2. window.LoopIcoMoonData — the merged global from gen:icomoon-data.js (also carries paths
 *      → inline SVG). The ODC path: load it as a <script> Resource BEFORE this file.
 *   3. window.LoopIconData — the legacy metadata global from loop-icon-data.js (no paths →
 *      renders from the FA @font-face). The backward-compatible fallback.
 * Every source flattens to one tile per (name × style).
 *
 * RENDERING (shadow DOM): the page's `.fa-*` class rules do NOT pierce shadow DOM. When a tile
 * has path data (sources 1–2) it is drawn as an inline `<svg viewBox="0 0 width 512">` filled
 * with currentColor — no font needed, a faithful preview of the IcoMoon export. Otherwise the
 * glyph is drawn from its unicode via `content: var(--g)` against the document-scoped
 * @font-face (which IS visible inside shadow DOM), so the only runtime dependency in that mode
 * is the FA @font-face being present (the fontawesome.css paste / the woff2 Resources).
 *
 * COPY FORMAT (attribute `copy-format`) — what each tile copies:
 *   "class"    (default) → "fa-solid fa-user"   — paste-ready full class token
 *   "prefixed"           → "fa-user"            — name with the fa- prefix
 *   "name"               → "user"               — bare name
 * Pick the one your CustomIcon block expects.
 *
 * Attributes:
 *   src            Comma-separated IcoMoon selection.json URLs to fetch (optional; enables
 *                  inline-SVG rendering in fetch-capable hosts like the local preview)
 *   heading        Section heading (default: "Icons")
 *   intro          Optional intro line under the heading
 *   copy-format    class | prefixed | name      (default: class)
 *   default-style  all | solid | regular | light  (default: all)
 *   page-size      Tiles rendered before "Show more" (default: 300; 0 = all at once)
 *
 * Accessibility: search is a labelled <input type="search">; the result count + copy actions
 * announce via an aria-live region; each tile is a <button> with an aria-label naming what it
 * copies; glyphs are decorative (aria-hidden); focus rings use the brand focus token;
 * honours prefers-reduced-motion.
 *
 * No framework (CLAUDE.md hard rule #6 — vanilla Web Component).
 */
(function () {
  const STYLE_META = {
    s: { key: "solid", cls: "fa-solid", label: "Solid" },
    r: { key: "regular", cls: "fa-regular", label: "Regular" },
    l: { key: "light", cls: "fa-light", label: "Light" },
  };
  const ORDER = ["s", "r", "l"];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  class LoopIconReference extends HTMLElement {
    static get observedAttributes() { return ["src", "heading", "intro", "copy-format", "default-style", "page-size"]; }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._query = "";
      this._style = null;        // active style filter flag (s/r/l) or null = all
      this._shown = 0;           // how many filtered tiles are currently rendered
      this._filtered = [];
      this._rows = [];           // normalized source rows (any of the 3 data sources)
      this._tiles = [];
      this._onInput = this._onInput.bind(this);
      this._onGridClick = this._onGridClick.bind(this);
      this._onToolbarClick = this._onToolbarClick.bind(this);
    }

    connectedCallback() {
      // Render immediately from whatever global is present (instant, font-capable), then —
      // if a `src` is given — fetch the selection.json and upgrade to inline-SVG rendering.
      this._rows = this._rowsFromGlobals();
      this._tiles = this._buildTiles();
      this._style = this._defaultStyle;
      this._render();
      const src = this.getAttribute("src");
      if (src) this._loadFromSrc(src);
    }
    attributeChangedCallback(n, o, v) {
      if (o === v || !this.shadowRoot.childElementCount) return;
      if (n === "src") { if (v) this._loadFromSrc(v); return; }
      if (n === "default-style") this._style = this._defaultStyle;
      this._render();
    }

    get _heading() { return this.getAttribute("heading") || "Icons"; }
    get _intro() { return this.getAttribute("intro") || ""; }
    get _copyFormat() {
      const f = (this.getAttribute("copy-format") || "class").toLowerCase();
      return ["class", "prefixed", "name"].includes(f) ? f : "class";
    }
    get _defaultStyle() {
      const s = (this.getAttribute("default-style") || "all").toLowerCase();
      return { solid: "s", regular: "r", light: "l" }[s] || null;
    }
    get _pageSize() {
      const p = parseInt(this.getAttribute("page-size"), 10);
      return Number.isNaN(p) ? 300 : Math.max(0, p);
    }

    /* --- data sources (each normalizes to internal rows: { n, label, search, s?/r?/l?:{u,w?,p?} }) --- */

    /* Sync source, preferred order: merged IcoMoon global (paths) → legacy metadata global (font). */
    _rowsFromGlobals() {
      const g = typeof window !== "undefined" ? window : {};
      if (g.LoopIcoMoonData && Array.isArray(g.LoopIcoMoonData.icons)) return this._rowsFromMerged(g.LoopIcoMoonData.icons);
      if (Array.isArray(g.LoopIconData)) return this._rowsFromLegacy(g.LoopIconData);
      return [];
    }

    /* window.LoopIconData rows { n, l, s:"srl", u, t } — metadata only, no paths (font render). */
    _rowsFromLegacy(data) {
      return data.map((row) => {
        const search = (row.n + " " + (row.l || "") + " " + (row.t ? row.t.join(" ") : "")).toLowerCase();
        const r = { n: row.n, label: row.l || row.n, search };
        for (const flag of ORDER) if (row.s.includes(flag)) r[flag] = { u: row.u };
        return r;
      });
    }

    /* window.LoopIcoMoonData.icons { n, tags, s:{c,w,p}, r, l } — carries paths (SVG render). */
    _rowsFromMerged(icons) {
      return icons.map((ic) => {
        const tags = ic.tags || [ic.n];
        const r = { n: ic.n, label: ic.n, search: (ic.n + " " + tags.join(" ")).toLowerCase() };
        for (const flag of ORDER) {
          const st = ic[flag];
          if (st) r[flag] = { u: st.c != null ? st.c.toString(16) : "", w: st.w, p: st.p };
        }
        return r;
      });
    }

    /* Merge N parsed IcoMoon selection.json docs (one per style) into rows, keyed by icon name.
       The style is read from each doc's metadata.name suffix (loop-fa-solid|regular|light). */
    _rowsFromSelection(docs) {
      const styleOf = (doc) => {
        const nm = ((doc.metadata && doc.metadata.name) || "").toLowerCase();
        return nm.includes("solid") ? "s" : nm.includes("regular") ? "r" : nm.includes("light") ? "l" : null;
      };
      const map = new Map();
      for (const doc of docs) {
        const flag = styleOf(doc);
        if (!flag || !Array.isArray(doc.icons)) continue;
        for (const entry of doc.icons) {
          const name = entry.properties && entry.properties.name;
          if (!name) continue;
          let r = map.get(name);
          if (!r) {
            const tags = (entry.icon && entry.icon.tags) || [name];
            r = { n: name, label: name, search: (name + " " + tags.join(" ")).toLowerCase() };
            map.set(name, r);
          }
          const code = entry.properties.code;
          r[flag] = {
            u: code != null ? code.toString(16) : "",
            w: entry.icon && entry.icon.width,
            p: (entry.icon && entry.icon.paths && entry.icon.paths[0]) || "",
          };
        }
      }
      return [...map.values()];
    }

    /* Fetch the selection.json URL(s) and, on success, upgrade to inline-SVG rendering.
       On any failure the existing globals-based render (font fallback) is kept. */
    async _loadFromSrc(src) {
      const urls = src.split(",").map((s) => s.trim()).filter(Boolean);
      if (!urls.length) return;
      try {
        const docs = await Promise.all(
          urls.map((u) => fetch(u).then((res) => { if (!res.ok) throw new Error(String(res.status)); return res.json(); }))
        );
        const rows = this._rowsFromSelection(docs);
        if (!rows.length) return;
        this._rows = rows;
        this._tiles = this._buildTiles();
        this._render(); // preserves this._query / this._style (instance fields)
      } catch (_) {
        /* keep the globals-based render */
      }
    }

    /* Flatten normalized rows into one entry per (name × style). */
    _buildTiles() {
      const tiles = [];
      for (const row of this._rows || []) {
        for (const flag of ORDER) {
          const st = row[flag];
          if (!st) continue;
          tiles.push({ name: row.n, label: row.label || row.n, flag, unicode: st.u, width: st.w, path: st.p, search: row.search });
        }
      }
      return tiles;
    }

    /* The value a tile copies, per copy-format. */
    _copyValue(t) {
      if (this._copyFormat === "name") return t.name;
      if (this._copyFormat === "prefixed") return `fa-${t.name}`;
      return `${STYLE_META[t.flag].cls} fa-${t.name}`;
    }

    _applyFilter() {
      const terms = this._query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      this._filtered = this._tiles.filter((t) => {
        if (this._style && t.flag !== this._style) return false;
        return terms.every((w) => t.search.includes(w));
      });
      this._shown = this._pageSize === 0 ? this._filtered.length : Math.min(this._pageSize, this._filtered.length);
    }

    _render() {
      this._applyFilter();
      const counts = ORDER.reduce((a, f) => ((a[f] = this._tiles.filter((t) => t.flag === f).length), a), {});
      const total = this._tiles.length;

      const filterBtn = (flag, label, n) =>
        `<button type="button" class="lir__filter${this._style === flag ? " is-active" : ""}" data-style="${flag || ""}" aria-pressed="${this._style === flag}">${esc(label)} <span class="lir__filter-n">${n}</span></button>`;

      this.shadowRoot.innerHTML = `
        <style>${this._css()}</style>
        <section class="lir" part="root">
          <h2 class="lir__heading">${esc(this._heading)}</h2>
          ${this._intro ? `<p class="lir__intro">${esc(this._intro)}</p>` : ""}
          <div class="lir__toolbar">
            <label class="lir__search">
              <span class="lir__search-icon" aria-hidden="true"></span>
              <input type="search" class="lir__search-input" placeholder="Search ${total} icons…"
                     aria-label="Search icons by name or keyword" value="${esc(this._query)}" spellcheck="false" autocomplete="off">
            </label>
            <div class="lir__filters" role="group" aria-label="Filter by style">
              ${filterBtn(null, "All", total)}
              ${filterBtn("s", "Solid", counts.s)}
              ${filterBtn("r", "Regular", counts.r)}
              ${filterBtn("l", "Light", counts.l)}
            </div>
          </div>
          <p class="lir__hint">Click an icon to copy its name (<code>${esc(this._sampleCopy())}</code>) for your CustomIcon block.</p>
          <div class="lir__status" role="status" aria-live="polite"></div>
          <div class="lir__grid" role="list"></div>
          <div class="lir__more"></div>
        </section>`;

      this._gridEl = this.shadowRoot.querySelector(".lir__grid");
      this._statusEl = this.shadowRoot.querySelector(".lir__status");
      this._moreEl = this.shadowRoot.querySelector(".lir__more");
      this.shadowRoot.querySelector(".lir__search-input").addEventListener("input", this._onInput);
      this.shadowRoot.querySelector(".lir__filters").addEventListener("click", this._onToolbarClick);
      this._gridEl.addEventListener("click", this._onGridClick);
      this._moreEl.addEventListener("click", () => { this._shown = this._pageSize === 0 ? this._filtered.length : this._shown + this._pageSize; this._paintGrid(); });
      this._paintGrid();
    }

    _sampleCopy() { return this._copyValue({ name: "user", flag: "s" }); }

    _tileHtml(t, i) {
      const val = this._copyValue(t);
      // Path data present (IcoMoon sources) → faithful inline SVG; else the FA @font-face glyph.
      const glyph = t.path
        ? `<svg class="lir__glyph lir__glyph--svg" viewBox="0 0 ${t.width || 512} 512" aria-hidden="true" focusable="false"><path d="${esc(t.path)}"/></svg>`
        : `<i class="lir__glyph ${t.flag}" style="--g:'\\${t.unicode}'" aria-hidden="true"></i>`;
      return `<button type="button" class="lir__tile" role="listitem" data-i="${i}"
        aria-label="Copy ${esc(val)}" title="${esc(val)}">
        ${glyph}
        <span class="lir__name">${esc(t.name)}</span>
        <span class="lir__style">${esc(STYLE_META[t.flag].label)}</span>
      </button>`;
    }

    _paintGrid() {
      const slice = this._filtered.slice(0, this._shown);
      if (!slice.length) {
        this._gridEl.innerHTML = `<p class="lir__empty">No icons match “${esc(this._query)}”.</p>`;
      } else {
        this._gridEl.innerHTML = slice.map((t, i) => this._tileHtml(t, i)).join("");
      }
      const remaining = this._filtered.length - this._shown;
      this._moreEl.innerHTML = remaining > 0
        ? `<button type="button" class="lir__more-btn">Show ${Math.min(this._pageSize || remaining, remaining)} more (${remaining} hidden)</button>`
        : "";
      if (remaining > 0) this._moreEl.querySelector(".lir__more-btn").addEventListener("click", () => {
        this._shown = this._pageSize === 0 ? this._filtered.length : this._shown + this._pageSize; this._paintGrid();
      });
      this._statusEl.textContent = `${this._filtered.length} icon${this._filtered.length === 1 ? "" : "s"}${this._query ? ` for “${this._query}”` : ""}.`;
    }

    _onInput(e) {
      this._query = e.target.value;
      clearTimeout(this._debounce);
      this._debounce = setTimeout(() => { this._applyFilter(); this._paintGrid(); }, 120);
    }

    _onToolbarClick(e) {
      const btn = e.target.closest(".lir__filter");
      if (!btn) return;
      this._style = btn.dataset.style || null;
      this.shadowRoot.querySelectorAll(".lir__filter").forEach((b) => {
        const active = (b.dataset.style || null) === this._style;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      this._applyFilter();
      this._paintGrid();
    }

    _onGridClick(e) {
      const tile = e.target.closest(".lir__tile");
      if (!tile) return;
      const t = this._filtered[+tile.dataset.i];
      if (!t) return;
      const val = this._copyValue(t);
      const done = () => {
        tile.classList.add("is-copied");
        this._statusEl.textContent = `Copied ${val}`;
        clearTimeout(tile._t);
        tile._t = setTimeout(() => tile.classList.remove("is-copied"), 1200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).then(done).catch(() => fallbackCopy(val, done));
      } else {
        fallbackCopy(val, done);
      }
    }

    _css() {
      return `
:host { display: block;
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  color: var(--color-text-on-light-default, #00263e); }

.lir__heading { font-size: 24px; font-weight: var(--font-weight-bold, 700);
  margin: 0 0 8px; color: var(--color-text-on-light-headers, #00263e); }
.lir__intro { margin: 0 0 20px; font-size: 14px; color: var(--color-text-on-light-subdued, #586e84); }

/* --- toolbar --- */
.lir__toolbar { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin: 0 0 12px; }
.lir__search { position: relative; flex: 1 1 280px; display: flex; align-items: center; }
/* Search glass — loop Search field glyph: FA 6 Pro regular weight, neutral-60, 16px box at 16px inset (loop-search.css) */
.lir__search-icon { position: absolute; left: var(--loop-search-icon-inset, 16px); top: 50%; transform: translateY(-50%);
  width: var(--loop-search-icon-size, 16px); height: var(--loop-search-icon-size, 16px);
  display: flex; align-items: center; justify-content: center; pointer-events: none;
  font-family: var(--font-family-icon, 'Font Awesome 6 Pro');
  font-weight: var(--loop-search-icon-weight, 400);
  color: var(--loop-search-icon-color, var(--color-icon-on-light-default, #4b5e71)); }
.lir__search-icon::before { content: '\\f002'; font-size: var(--loop-search-icon-glyph, 14px); line-height: 1; }
/* Search input — loop Text Field identity, Regular size (40px, 8px radius, inset-shadow focus ring) */
.lir__search-input { width: 100%; box-sizing: border-box; height: 40px;
  padding: 11px 16px 11px var(--loop-search-pad-left, 40px);
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-text-size, 13px);
  font-weight: var(--loop-field-text-weight, 400);
  line-height: var(--loop-field-text-leading, 14px);
  letter-spacing: var(--loop-field-text-tracking, 0.5px);
  color: var(--color-text-on-light-default, #00263e);
  background: var(--color-bg-container-on-light-lowest, #fff);
  border: 1px solid var(--color-outline-on-light-default, #00396b3d);
  border-radius: var(--loop-field-radius, 8px); }
.lir__search-input::placeholder { color: var(--color-neutral-alpha-57, #00294d91); opacity: 1; }
.lir__search-input:hover { border-color: var(--color-outline-on-light-emphasis, #00294d6b); }
.lir__search-input:focus, .lir__search-input:focus-visible { outline: none;
  border-color: var(--color-outline-on-light-link-focused, #0071bc);
  box-shadow: inset 0 0 0 1px var(--color-outline-on-light-link-focused, #0071bc); }

/* Style filters — loop Tag pills (blue): default = info-low fill + info-regular border + blue-70 text;
   active = selected Tag (blue-70 fill, white bold label). See loop-tag.css. */
.lir__filters { display: flex; flex-wrap: wrap; gap: var(--space-xxsmall, 8px); }
.lir__filter { display: inline-flex; align-items: center; box-sizing: border-box; cursor: pointer;
  gap: var(--loop-tag-gap, 4px); white-space: nowrap;
  height: var(--loop-tag-h-regular, 32px);
  padding: 0 var(--loop-tag-padding-h, 12px);
  border: 1px solid var(--loop-tag-blue-border, #169af3);
  border-radius: var(--loop-tag-radius, 48px);
  background: var(--loop-tag-blue-bg, #f6fcff);
  color: var(--loop-tag-blue-text, #004370);
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-tag-label-size, 16px);
  line-height: var(--loop-tag-label-leading, 16px);
  letter-spacing: var(--loop-tag-label-tracking, 0.25px);
  font-weight: var(--loop-tag-label-weight, 400);
  transition: filter .12s; }
.lir__filter:hover { filter: brightness(0.97); }
.lir__filter.is-active { background: var(--loop-tag-blue-selected-bg, #004370);
  border-color: var(--loop-tag-blue-selected-bg, #004370);
  color: var(--loop-tag-selected-text, #fff);
  font-weight: var(--loop-tag-label-weight-selected, 700); }
.lir__filter:focus-visible { outline: 2px solid var(--loop-tag-focus, #0071bc); outline-offset: 2px; }
.lir__filter-n { opacity: .7; font-size: .8em; font-weight: 400; }
.lir__filter.is-active .lir__filter-n { opacity: .85; }

.lir__hint { margin: 0 0 8px; font-size: 12px; color: var(--color-text-on-light-subdued, #586e84); }
.lir__hint code { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 12px; color: var(--color-text-on-light-default, #00263e);
  background: var(--color-neutral-05, #f5f7f9); padding: 1px 5px; border-radius: 4px; }

/* visually-hidden live region (announced, not shown) */
.lir__status { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

/* --- grid --- */
.lir__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(108px, 1fr)); gap: 10px; }
.lir__tile { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer;
  padding: 16px 8px 12px; font: inherit; text-align: center;
  background: var(--color-white, #fff);
  border: 1px solid var(--color-neutral-15, #dae3eb);
  border-radius: var(--border-radius-soft, 8px); transition: border-color .12s, box-shadow .12s, transform .12s; }
.lir__tile:hover { border-color: var(--color-blue-40, #1c7cc4);
  box-shadow: var(--shadow-100, 0 1px 4px #00396b1f); }
.lir__tile:focus-visible { outline: 2px solid var(--color-domain-interactive-focused, #0071bc); outline-offset: 2px; }
.lir__tile.is-copied { border-color: var(--color-green-60, #2e7d32); box-shadow: 0 0 0 1px var(--color-green-60, #2e7d32) inset; }

.lir__glyph { font-style: normal; font-variant: normal; line-height: 1;
  font-size: 26px; height: 30px; display: flex; align-items: center; justify-content: center;
  color: var(--color-text-on-light-headers, #00263e);
  font-family: 'Font Awesome 6 Pro'; font-weight: 900;
  -webkit-font-smoothing: antialiased; }
.lir__glyph.r { font-weight: 400; }
.lir__glyph.l { font-weight: 300; }
.lir__glyph::before { content: var(--g); }
/* Inline-SVG glyph (IcoMoon path data) — aspect from the viewBox, height matched to the font box,
   painted in the same header color via currentColor. Font-independent. */
.lir__glyph--svg { width: auto; max-width: 30px; }
.lir__glyph--svg path { fill: currentColor; }

.lir__name { font-size: 12px; line-height: 1.3; color: var(--color-text-on-light-default, #00263e);
  word-break: break-word; max-width: 100%; }
.lir__style { font-size: 10px; letter-spacing: .04em; text-transform: uppercase;
  color: var(--color-text-on-light-subdued, #586e84); }
.lir__tile.is-copied .lir__style::after { content: " ✓ copied"; color: var(--color-green-60, #2e7d32); }

.lir__empty { grid-column: 1 / -1; margin: 24px 0; font-size: 14px;
  color: var(--color-text-on-light-subdued, #586e84); }

.lir__more { margin: 16px 0 0; text-align: center; }
/* Show more — loop Button, Secondary/outlined (2px blue-70 border, transparent fill, 8px radius,
   Open Sans 700 12/24, -0.5 tracking; hover fills blue-40). See loop-button.css. */
.lir__more-btn { display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
  height: var(--loop-btn-h-regular, 40px);
  padding: 0 var(--space-small, 16px);
  border: 2px solid var(--color-outline-on-light-link-enabled, #004370);
  border-radius: var(--radius-medium, 8px);
  background: transparent;
  color: var(--color-text-on-light-link-primary-enabled, #004370);
  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-weight: var(--font-weight-bold, 700);
  font-size: var(--loop-btn-font-regular, 12px);
  line-height: var(--loop-btn-lh, 24px);
  letter-spacing: var(--letter-spacing-button, -0.5px);
  transition: background-color .12s, border-color .12s, color .12s; }
.lir__more-btn:hover { background: var(--color-bg-link-secondary-hover, #169af3);
  border-color: var(--color-bg-link-secondary-hover, #169af3);
  color: var(--color-text-on-light-emphasis, #012740); }
.lir__more-btn:active { background: var(--color-bg-link-secondary-pressed, #a3daff);
  border-color: var(--color-text-on-light-link-primary-enabled, #004370);
  color: var(--color-text-on-light-link-primary-enabled, #004370); }
.lir__more-btn:focus-visible { outline: 2px solid var(--color-outline-on-light-link-enabled, #004370); outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) {
  .lir__tile, .lir__filter, .lir__more-btn { transition: none; }
}
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

  if (!customElements.get("loop-icon-reference")) {
    customElements.define("loop-icon-reference", LoopIconReference);
  }
})();
```

</details>

## The generated data file (`loop-icon-data.js`)
Like `dist/theme.css` / `dist/fontawesome.css`, the data file is **its own Resource paste**, not
inlined in this ticket (~415 KB / 3,323 icons). It defines `window.LoopIconData` — an array of
`{ n:name, l:label, s:styleFlags, u:unicode, t?:searchTerms }`. Load it as a `<script>` Resource
**before** `loop-icon-reference.js`. Regenerate after a Font Awesome bump:
```bash
npm run gen:icon-data   # rewrites src/components/loop-icon-data.js from vendor/fontawesome-6/icon-manifest.json
```

## Using `<loop-icon-reference>` in ODC
1. Ensure the FA font is loaded (handover `loop-fontawesome`).
2. Add **`loop-icon-data.js`** to **Resources** (Deploy Action: *Deploy to Target Directory*),
   loaded on the Style-Guide screen.
3. Add **`loop-icon-reference.js`** to **Resources**, loaded **after** the data file.
4. On the Live Style Guide screen, add an **HTML Element** (tag `loop-icon-reference`):
   ```html
   <loop-icon-reference
     intro="The complete Font Awesome 6 Pro set — search, filter, click to copy."
     copy-format="class">
   </loop-icon-reference>
   ```
5. Publish → open in a **real browser** (hard rule #2).

### Attributes
| Attribute | Default | Description |
|---|---|---|
| `heading` | `Icons` | Section heading |
| `intro` | — | Intro line under the heading |
| `copy-format` | `class` | What a tile copies: `class` / `prefixed` / `name` (see table above) |
| `default-style` | `all` | Initial style filter: `all` / `solid` / `regular` / `light` |
| `page-size` | `300` | Tiles rendered before a "Show more" button (`0` = render all at once) |

### Behaviour
- **Search** matches the name, label and Font Awesome keywords (space-separated terms = AND).
- **Style filters** show live counts (All / Solid / Regular / Light).
- **Click a tile** to copy its value (per `copy-format`) with a transient ✓ cue.

## Accessibility (WCAG 2.2 AA)
- Search is a labelled `<input type="search">`; the result count and each copy announce via an
  `aria-live="polite"` region.
- Each tile is a `<button>` with an `aria-label` naming exactly what it copies; glyphs are
  decorative (`aria-hidden`).
- Focus rings use `--color-domain-interactive-focused`; `prefers-reduced-motion` honoured.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, place the Style-Guide reference element <loop-icon-reference> on the Style Guide
screen for the WBG "The Loop" design system.

Context (already done): loop-icon-reference.js is added under Resources and loads on the Style-Guide
screen; dist/tokens.css + dist/theme.css are in the Theme. It is a self-contained display component.

Task: add the <loop-icon-reference> element to the Style Guide screen where this specimen belongs.
There are no inputs or events to wire. Do NOT write CSS or JavaScript.

Constraints: never edit the OutSystems UI module; add no styles. Report what you placed.
```

## Checklist
- [ ] `npm run gen:icon-data` → `src/components/loop-icon-data.js` is current.
- [ ] FA font loaded in ODC (handover `loop-fontawesome`): theme paste + 3 woff2 Resources.
- [ ] Add `loop-icon-data.js` then `loop-icon-reference.js` to Resources (data **first**), on the
      Style-Guide screen.
- [ ] Place `<loop-icon-reference>`; set `copy-format` to match your CustomIcon block; publish.
- [ ] Validate in a **real browser**: icons render (not empty boxes), search by keyword works
      (try "trash"), style filters change counts, click-to-copy puts the right token on the
      clipboard, keyboard focus rings visible.
