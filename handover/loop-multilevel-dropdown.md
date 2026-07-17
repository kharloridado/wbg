# Handover — Multilevel Dropdown (custom Web Component)

**Component:** `<loop-multilevel-dropdown>` — searchable single-select dropdown over a 3-level `{value, label, children[]}` tree
**Figma:** none — user-spec'd build (no library frame exists). Visuals derive from the single-Select restyle by consuming the same `--loop-select-*` tokens, so the closed field pixel-matches the shipped Select.
**Approach:** vanilla JS Web Component per CLAUDE.md rule #6 — an L5 custom build. No native OSUI widget renders hierarchy: the Dropdown's VirtualSelect provider supports only flat single-level option groups (group headers, not selectable, no nesting).

## When to use / How to use

> **Live Style Guide doc**

**What it is.** A select-style field that opens a tree/accordion panel: level-1/2 nodes with children are expandable group headers, leaves (any level) are the selectable records. A pinned search row filters across all three levels — matching text is bolded, ancestors stay visible as context, and branches with matches auto-expand. Picking a leaf closes the panel, shows the **full ancestor path in the field** (e.g. `Asia > South East Asia > Philippines`; long paths ellipsise with the full path in the tooltip), and fires a `change` event whose detail is the **selection as a nested tree** — `{value, label, child:{…}}` root → leaf, one level per nesting (the innermost record, with no `child`, is the selected leaf).

**When to use.** Choosing ONE record from a categorised hierarchy (region → sub-region → country; department → team → member) where flat option lists get too long to scan and the category path carries meaning.

**When not to use.**
- Flat lists — use the native Dropdown (restyled by `loop-dropdown.css`).
- Multi-select — use the native Dropdown Tags (`loop-dropdown-tags`).
- More than 3 levels — out of scope; levels deeper than 3 are ignored by design.

**How to use.** Serialize the hierarchy to JSON and bind it to `items`; listen to `OnChange` for the selected record. Booleans bind value-aware: `If(Flag, "true", "false")`.

**JSON quoting.** Both valid double-quoted JSON and **single-quoted** JSON are accepted — e.g. `[{'value':'af','label':'Africa','children':[...]}]`. Single quotes are the convenient form for inline ODC Expressions, whose string literals are already delimited by double quotes. A raw apostrophe inside a single-quoted value is ambiguous and must be escaped (`'C\'ôte d\'Ivoire'`) or that value written with double quotes. Genuinely invalid JSON renders an empty list and logs a `console.warn` (never throws).

**Known limitation.** The panel renders inside the host element (no body-append), so an ancestor container with `overflow: hidden` clips the open panel. Avoid overflow-hidden wrappers around the Block, or place the field where the panel has room to drop.

## Files

| File | OutSystems destination |
| --- | --- |
| `src/components/loop-multilevel-dropdown.js` | Script resource (Theme/Library), Include = Always |
| `src/components/loop-multilevel-dropdown.css` | Nothing to import — canonical source of the shadow styles (edit here, mirror into `_css()`) |
| `tokens/component-multilevel-dropdown.css` | Travels inside `dist/theme.css` (its own paste) — not duplicated here |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-multilevel-dropdown.js</code> → Script resource (Theme/Library), Include = Always</summary>

```js
/**
 * <loop-multilevel-dropdown> — Searchable single-select dropdown over a 3-level tree.
 *
 * No Figma ref — user-spec'd L5 custom Web Component (no native OSUI widget renders
 * hierarchy; VirtualSelect option groups are flat). Visuals derive from the single-Select
 * restyle by consuming the same --loop-select-* tokens, so the closed field pixel-matches
 * src/blocks/loop-dropdown.css. Tree/accordion panel with a pinned search row; parents are
 * expandable group headers only — LEAVES are the selectable records.
 *
 * Attributes (all observed / reactive):
 *   items              JSON tree, up to 3 levels: [{ "value": "af", "label": "Africa",
 *                      "children": [ … ] }, …]. A node with a non-empty children[] is a
 *                      non-selectable group header; levels deeper than 3 are ignored.
 *                      Single-quoted JSON is accepted too (convenient in ODC Expressions;
 *                      escape inner apostrophes as \'). Invalid JSON renders an empty list
 *                      and logs a console.warn (never throws).
 *   selected-value     Current selection. REFLECTED by the component (before the change
 *                      event fires) so OutSystems can read it back; the ODC echo of the
 *                      same value is a no-op via the o===v guard.
 *   placeholder        Field text when nothing is selected (default "Select an option").
 *   label              Optional visible label above the field. When empty the field's
 *                      aria-label falls back to the placeholder.
 *   search             Boolean (default true) — "false" hides the search row.
 *   search-placeholder Placeholder of the panel search input (default "Search").
 *   no-results-text    Empty-state row text (default "No results found").
 *   disabled           Boolean — inert field, disabled styling.
 *
 * Properties: items (get/set ⇄ attribute) · selectedValue (get/set) ·
 *             selectedRecord (get-only → the change-detail tree below; null unselected).
 * Methods:    open() · close() · clear().
 *
 * After selection the closed field shows the full ancestor path, e.g.
 * "Asia > South East Asia > Philippines" (long paths ellipsise; full path in title).
 *
 * Events (bubbles, composed):
 *   change — fired ONLY on user selection or clear(), never on attribute echo.
 *            detail IS the selection as a NESTED {value,label,child} tree root → leaf,
 *            one level per nesting — a level-3 pick nests three deep:
 *              { value:"asi", label:"Asia",
 *                child:{ value:"sea", label:"South East Asia",
 *                  child:{ value:"ph", label:"Philippines" } } }
 *            The innermost record (no `child` key) is the selected leaf. clear() fires null.
 *
 * Search: case-insensitive substring on label across all levels. A node stays visible if
 * it matches, any DESCENDANT matches (ancestors kept as context), or any ANCESTOR matches
 * (a matching parent reveals its subtree). While a query is active all visible parents
 * render expanded (derived); the user's manual expansion set is untouched and restored
 * when the query clears.
 *
 * ARIA: combobox-with-tree-popup — trigger button (aria-haspopup="tree", aria-expanded),
 * search input role="combobox" with aria-activedescendant driving a virtual cursor over
 * role="treeitem" rows (aria-level 1–3, aria-expanded on parents, aria-selected on leaves).
 * Real focus stays in the input while the panel is open; arrows move the virtual cursor.
 *
 * OutSystems: drop loop-multilevel-dropdown.js into Resources (Include = Always). In a
 * Block, add an HTML element and bind attributes from Block inputs — booleans are
 * value-aware: search = If(ShowSearch, "true", "false"), disabled = If(Disabled, "true",
 * "false"). Wire the change event in OnReady/OnDestroy (see the handover's Event wiring).
 */
class LoopMultilevelDropdown extends HTMLElement {
  static get observedAttributes() {
    return ['items', 'selected-value', 'placeholder', 'label', 'search',
            'search-placeholder', 'no-results-text', 'disabled'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._isOpen = false;
    this._expanded = new Set();  // keys of manually expanded parents (untouched by search)
    this._query = '';
    this._activeKey = null;      // virtual-cursor node key
    this._flat = [];             // rendered rows in document order (rebuilt by _renderList)
    this._onClick = this._onClick.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onDocPointerDown = this._onDocPointerDown.bind(this);
  }

  connectedCallback() {
    this._render();
    this.shadowRoot.addEventListener('click', this._onClick);
    this.shadowRoot.addEventListener('keydown', this._onKeydown);
    this.shadowRoot.addEventListener('input', this._onInput);
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this._onClick);
    this.shadowRoot.removeEventListener('keydown', this._onKeydown);
    this.shadowRoot.removeEventListener('input', this._onInput);
    document.removeEventListener('pointerdown', this._onDocPointerDown, true);
  }

  attributeChangedCallback(n, o, v) {
    if (o === v) return;
    if (n === 'items') {         // new data invalidates expansion / query / cursor
      this._expanded = new Set();
      this._query = '';
      this._activeKey = null;
    }
    if (n === 'disabled' && this._disabled && this._isOpen) this._closePanel(false);
    if (this.isConnected) this._render();
  }

  /* OutSystems binds booleans as If(Flag,"true","false") so hasAttribute() alone is
     insufficient — must treat "false" and "0" as falsy. */
  _boolAttr(name) {
    const v = this.getAttribute(name);
    if (v === null) return false;
    return v !== 'false' && v !== '0';
  }

  get _disabled()      { return this._boolAttr('disabled'); }
  /* `search` defaults TRUE when absent — same value-aware parsing, inverted default. */
  get _search()        { const v = this.getAttribute('search'); if (v === null) return true; return v !== 'false' && v !== '0'; }
  get _placeholder()   { return this.getAttribute('placeholder') || 'Select an option'; }
  get _label()         { return this.getAttribute('label') || ''; }
  get _searchPlaceholder() { return this.getAttribute('search-placeholder') || 'Search'; }
  get _noResultsText() { return this.getAttribute('no-results-text') || 'No results found'; }

  /* Parse the `items` attribute. Strict JSON first; falls back to single-quoted JSON —
     ODC Expressions delimit strings with double quotes, so hand-authored inline JSON
     there naturally uses single quotes. Warns (never throws) on genuinely invalid input,
     returning []. */
  _parseItems(raw) {
    const s = raw || '[]';
    try { return JSON.parse(s); } catch { /* fall through to quote-tolerant parse */ }
    try { return JSON.parse(this._singleToDoubleQuoted(s)); }
    catch (e) {
      console.warn('[loop-multilevel-dropdown] invalid items JSON:', e.message, s);
      return [];
    }
  }

  /* Convert a single-quoted JSON-ish string to valid JSON. Char scanner (NOT a naive
     replace, which corrupts labels like "Côte d'Ivoire"): treats ' as the string
     delimiter, escapes any literal " inside, and honors \' as an escaped apostrophe.
     A raw apostrophe inside a value is ambiguous and must be written as \' by the author. */
  _singleToDoubleQuoted(s) {
    let out = '', inStr = false;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (inStr) {
        if (c === '\\' && s[i + 1] === "'") { out += "'"; i++; }   // \' -> literal apostrophe
        else if (c === '\\') { out += c + (s[i + 1] ?? ''); i++; } // keep other escapes
        else if (c === "'") { out += '"'; inStr = false; }         // close string
        else if (c === '"') { out += '\\"'; }                      // escape inner double quote
        else { out += c; }
      } else {
        if (c === "'") { out += '"'; inStr = true; }               // open string
        else { out += c; }
      }
    }
    return out;
  }

  get items() {
    const v = this._parseItems(this.getAttribute('items'));
    return Array.isArray(v) ? v : [];
  }
  set items(arr) { this.setAttribute('items', JSON.stringify(arr || [])); }

  get selectedValue() { return this.getAttribute('selected-value') || ''; }
  set selectedValue(v) { this.setAttribute('selected-value', v == null ? '' : String(v)); }

  /* The selection as a NESTED tree — {value,label,child:{…}} root → leaf, one level per
     nesting, the leaf being the innermost node with no `child` — null when nothing is
     selected. This IS the change-event detail. */
  get selectedRecord() {
    const v = this.selectedValue;
    if (!v) return null;
    const n = this._model().find((x) => x.isLeaf && x.value === v);
    return n ? this._nestedFor(n) : null;
  }

  /* Ancestor chain root → node as internal nodes. */
  _ancestry(node) {
    const byKey = this._byKey();
    const chain = [node];
    let p = node.parentKey;
    while (p) { const pn = byKey.get(p); chain.unshift(pn); p = pn.parentKey; }
    return chain;
  }

  /* The ancestor chain as a NESTED {value,label,child} tree root → leaf. The leaf is the
     innermost record and carries no `child` key. */
  _nestedFor(node) {
    const chain = this._ancestry(node);
    let obj = null;
    for (let i = chain.length - 1; i >= 0; i--) {
      const rec = { value: chain[i].value, label: chain[i].label };
      if (obj) rec.child = obj;
      obj = rec;
    }
    return obj;
  }

  /* "Africa > West Africa > Ghana" for the closed-field display, '' when unselected. */
  _selPath() {
    const v = this.selectedValue;
    if (!v) return '';
    const n = this._model().find((x) => x.isLeaf && x.value === v);
    return n ? this._ancestry(n).map((x) => x.label).join(' > ') : '';
  }

  open() {
    if (this._disabled || this._isOpen || !this.isConnected) return;
    this._isOpen = true;
    const sel = this.selectedValue
      ? this._model().find((n) => n.isLeaf && n.value === this.selectedValue) : null;
    if (sel) {                   // cursor on the selection, its branch expanded
      let p = sel.parentKey;
      while (p) { this._expanded.add(p); p = this._byKey().get(p).parentKey; }
      this._activeKey = sel.key;
    }
    this._render();
    document.addEventListener('pointerdown', this._onDocPointerDown, true);
    const owner = this._search
      ? this.shadowRoot.querySelector('.lmdd__search-input')
      : this.shadowRoot.querySelector('.lmdd__field');
    if (owner) owner.focus();
  }

  close() { this._closePanel(true); }

  clear() {
    this.setAttribute('selected-value', '');   // reflect BEFORE the event, like _select()
    this.dispatchEvent(new CustomEvent('change', {
      detail: null, bubbles: true, composed: true,
    }));
  }

  /* ── data model ────────────────────────────────────────────────────────────── */

  /* Flat, document-order node list parsed from `items`, memoised per attribute string.
     Keys are index-based ("k0", "k1", …) — stable for a given items value; an items
     change resets all keyed state anyway (attributeChangedCallback). */
  _model() {
    const src = this.getAttribute('items') || '[]';
    if (this._modelSrc === src) return this._modelNodes;
    const out = [];
    const map = new Map();
    const parsed = this._parseItems(src);
    const walk = (arr, level, parentKey) => {
      if (!Array.isArray(arr)) return;
      for (const raw of arr) {
        if (!raw || typeof raw !== 'object') continue;
        const kids = level < 3 && Array.isArray(raw.children)
          ? raw.children.filter((c) => c && typeof c === 'object') : [];
        const node = {
          key: 'k' + out.length,
          value: raw.value == null ? '' : String(raw.value),
          label: raw.label == null ? '' : String(raw.label),
          level,
          parentKey,
          isLeaf: kids.length === 0,
        };
        out.push(node);
        map.set(node.key, node);
        if (kids.length) walk(kids, level + 1, node.key);
      }
    };
    walk(parsed, 1, null);
    this._modelSrc = src;
    this._modelNodes = out;
    this._modelMap = map;
    return out;
  }

  _byKey() { this._model(); return this._modelMap; }

  /* Visibility + effective expansion for the current query. Returns { visible, expandedFor }:
     no query — visible under expanded ancestors, expansion = the manual set;
     query    — self/ancestor/descendant match rule, every visible parent renders expanded. */
  _viewState() {
    const nodes = this._model();
    const byKey = this._byKey();
    const q = this._query.trim().toLowerCase();
    if (!q) {
      return {
        visible: new Set(nodes.map((n) => n.key)),  // rendering recurses only into expanded parents
        expandedFor: (key) => this._expanded.has(key),
        recurseExpandedOnly: true,
      };
    }
    const match = new Set();
    for (const n of nodes) if (n.label.toLowerCase().includes(q)) match.add(n.key);
    const visible = new Set();
    for (const n of nodes) {
      if (match.has(n.key)) {
        visible.add(n.key);
        let p = n.parentKey;                        // ancestors stay as context
        while (p) { visible.add(p); p = byKey.get(p).parentKey; }
      } else {
        let p = n.parentKey;                        // a matching ancestor reveals its subtree
        while (p) {
          if (match.has(p)) { visible.add(n.key); break; }
          p = byKey.get(p).parentKey;
        }
      }
    }
    return { visible, expandedFor: () => true, recurseExpandedOnly: false };
  }

  /* ── events ────────────────────────────────────────────────────────────────── */

  /* Single delegated listeners on shadowRoot — survive innerHTML replacements. */
  _onClick(e) {
    if (this._disabled || !e.target || !e.target.closest) return;
    if (e.target.closest('.lmdd__search-clear')) {
      const inp = this.shadowRoot.querySelector('.lmdd__search-input');
      if (inp) { inp.value = ''; inp.focus(); }
      this._setQuery('');
      return;
    }
    if (e.target.closest('.lmdd__field')) {
      if (this._isOpen) this._closePanel(true); else this.open();
      return;
    }
    const row = e.target.closest('.lmdd__row');
    if (row) {
      const n = this._byKey().get(row.dataset.key);
      if (!n) return;
      if (n.isLeaf) { this._select(n); return; }
      if (!this._query.trim()) {                    // chevrons are inert while filtering
        if (this._expanded.has(n.key)) this._expanded.delete(n.key);
        else this._expanded.add(n.key);
        this._activeKey = n.key;
        this._renderList();
      }
      if (this._search) {
        const inp = this.shadowRoot.querySelector('.lmdd__search-input');
        if (inp) inp.focus();
      }
    }
  }

  _onInput(e) {
    if (!e.target || !e.target.closest) return;
    if (e.target.closest('.lmdd__search-input')) this._setQuery(e.target.value);
  }

  _onKeydown(e) {
    if (this._disabled || !e.target || !e.target.closest) return;
    if (!this._isOpen) {
      if (!e.target.closest('.lmdd__field')) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.open();
        return;
      }
      if (this._search && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();                         // printable char opens + seeds the search
        this.open();
        const inp = this.shadowRoot.querySelector('.lmdd__search-input');
        if (inp) inp.value = e.key;
        this._setQuery(e.key);
      }
      return;
    }
    switch (e.key) {
      case 'Escape':     e.preventDefault(); this._closePanel(true); return;
      case 'Tab':        this._closePanel(true); return;  // no preventDefault — Tab then leaves the field
      case 'ArrowDown':  e.preventDefault(); this._move(1); return;
      case 'ArrowUp':    e.preventDefault(); this._move(-1); return;
      case 'Home':       e.preventDefault(); this._moveTo(0); return;
      case 'End':        e.preventDefault(); this._moveTo(this._flat.length - 1); return;
      case 'ArrowRight': e.preventDefault(); this._expandOrChild(); return;
      case 'ArrowLeft':  e.preventDefault(); this._collapseOrParent(); return;
      case 'Enter':      e.preventDefault(); this._activate(); return;
      case ' ':          if (!this._search) { e.preventDefault(); this._activate(); } return;
      default:
    }
  }

  /* Outside pointerdown closes without refocusing (capture phase; composedPath pierces
     the shadow boundary). Added on open, removed on close AND in disconnectedCallback. */
  _onDocPointerDown(e) {
    if (!e.composedPath().includes(this)) this._closePanel(false);
  }

  /* ── interaction helpers ───────────────────────────────────────────────────── */

  _setQuery(q) {
    this._query = q;
    this._activeKey = null;                         // cursor resets to the first visible row
    this._renderList();
  }

  _move(dir) {
    if (!this._flat.length) return;
    const i = this._flat.findIndex((n) => n.key === this._activeKey);
    const next = Math.min(this._flat.length - 1, Math.max(0, (i === -1 ? 0 : i + dir)));
    this._activeKey = this._flat[next].key;
    this._renderList();
  }

  _moveTo(index) {
    if (!this._flat.length) return;
    const clamped = Math.min(this._flat.length - 1, Math.max(0, index));
    this._activeKey = this._flat[clamped].key;
    this._renderList();
  }

  _expandOrChild() {
    const n = this._byKey().get(this._activeKey);
    if (!n || n.isLeaf) return;
    if (!this._query.trim() && !this._expanded.has(n.key)) {
      this._expanded.add(n.key);
      this._renderList();
      return;
    }
    const i = this._flat.findIndex((f) => f.key === n.key);
    const next = this._flat[i + 1];
    if (next && next.parentKey === n.key) { this._activeKey = next.key; this._renderList(); }
  }

  _collapseOrParent() {
    const n = this._byKey().get(this._activeKey);
    if (!n) return;
    if (!n.isLeaf && !this._query.trim() && this._expanded.has(n.key)) {
      this._expanded.delete(n.key);
      this._renderList();
      return;
    }
    if (n.parentKey) { this._activeKey = n.parentKey; this._renderList(); }
  }

  _activate() {
    const n = this._byKey().get(this._activeKey);
    if (!n) return;
    if (n.isLeaf) { this._select(n); return; }
    if (!this._query.trim()) {                      // Enter toggles a parent (inert while filtering)
      if (this._expanded.has(n.key)) this._expanded.delete(n.key);
      else this._expanded.add(n.key);
      this._renderList();
    }
  }

  /* Reflect selected-value FIRST (so ODC reads the new value inside the handler and its
     echo re-assignment is a no-op), then fire change, then close. */
  _select(node) {
    this.setAttribute('selected-value', node.value);
    this.dispatchEvent(new CustomEvent('change', {
      detail: this._nestedFor(node), bubbles: true, composed: true,
    }));
    this._closePanel(true);
  }

  _closePanel(refocusField) {
    if (!this._isOpen) return;
    this._isOpen = false;
    this._query = '';
    this._activeKey = null;
    document.removeEventListener('pointerdown', this._onDocPointerDown, true);
    this._render();
    if (refocusField) {
      const f = this.shadowRoot.querySelector('.lmdd__field');
      if (f) f.focus();
    }
  }

  /* ── rendering ─────────────────────────────────────────────────────────────── */

  _esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  /* Escaped label with the matched substring bolded (weight only, no colour change). */
  _labelHtml(label) {
    const q = this._query.trim();
    if (!q) return this._esc(label);
    const i = label.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return this._esc(label);
    return this._esc(label.slice(0, i))
      + '<strong class="lmdd__hl">' + this._esc(label.slice(i, i + q.length)) + '</strong>'
      + this._esc(label.slice(i + q.length));
  }

  /* Full skeleton — attribute changes / open / close land here. The list body is delegated
     to _renderList() so query/cursor updates never replace the search input mid-typing. */
  _render() {
    const disabled = this._disabled;
    const label = this._label;
    const selPath = this._selPath();
    const rootCls = 'lmdd'
      + (this._isOpen ? ' lmdd--open' : '')
      + (disabled ? ' lmdd--disabled' : '')
      + (this._query.trim() ? ' lmdd--has-query' : '');
    const fieldName = label
      ? 'aria-labelledby="lmdd-label lmdd-value"'
      : `aria-label="${this._esc(this._placeholder)}"`;
    const treeName = label
      ? 'aria-labelledby="lmdd-label"'
      : `aria-label="${this._esc(this._placeholder)}"`;
    const searchRow = this._search ? `
        <div class="lmdd__search">
          <span class="lmdd__search-icon" aria-hidden="true">&#xf002;</span>
          <input class="lmdd__search-input" type="text" role="combobox"
            aria-autocomplete="list" aria-expanded="true" aria-controls="lmdd-tree"
            placeholder="${this._esc(this._searchPlaceholder)}"
            aria-label="${this._esc(this._searchPlaceholder)}">
          <button class="lmdd__search-clear" type="button" aria-label="Clear search">
            <span class="lmdd__search-clear-glyph" aria-hidden="true">&#xf00d;</span>
          </button>
        </div>` : '';

    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="${rootCls}">
        ${label ? `<span class="lmdd__label" id="lmdd-label">${this._esc(label)}</span>` : ''}
        <button class="lmdd__field" type="button"${disabled ? ' disabled' : ''}
          aria-haspopup="tree" aria-expanded="${this._isOpen}" aria-controls="lmdd-panel"
          ${fieldName}>
          <span class="lmdd__value${selPath ? '' : ' lmdd__value--placeholder'}" id="lmdd-value"${selPath ? ` title="${this._esc(selPath)}"` : ''}>${this._esc(selPath || this._placeholder)}</span>
          <span class="lmdd__chevron" aria-hidden="true">&#xf078;</span>
        </button>
        <div class="lmdd__panel" id="lmdd-panel">
          ${searchRow}
          <ul class="lmdd__tree" id="lmdd-tree" role="tree" ${treeName}></ul>
          <div class="lmdd__empty" hidden></div>
          <span class="lmdd__status" aria-live="polite"></span>
        </div>
      </div>`;
    this._renderList();
    if (this._isOpen && this._search) {
      const inp = this.shadowRoot.querySelector('.lmdd__search-input');
      if (inp) inp.value = this._query;             // full render preserves an in-flight query
    }
  }

  /* Rebuild only the tree + empty row + live region + aria-activedescendant. */
  _renderList() {
    const root = this.shadowRoot.querySelector('.lmdd');
    if (!root) return;
    const nodes = this._model();
    const { visible, expandedFor, recurseExpandedOnly } = this._viewState();
    const q = this._query.trim();
    root.classList.toggle('lmdd--has-query', !!q);

    /* rendered rows in document order = visible nodes whose ancestors are all expanded */
    const flat = [];
    const collect = (parentKey) => {
      for (const n of nodes) {
        if (n.parentKey !== parentKey || !visible.has(n.key)) continue;
        flat.push(n);
        if (!n.isLeaf && (!recurseExpandedOnly || expandedFor(n.key))) collect(n.key);
      }
    };
    collect(null);
    this._flat = flat;
    if (this._activeKey === null || !flat.some((n) => n.key === this._activeKey)) {
      this._activeKey = flat.length ? flat[0].key : null;
    }

    const selVal = this.selectedValue;
    const renderGroup = (parentKey) => {
      let html = '';
      for (const n of nodes) {
        if (n.parentKey !== parentKey || !visible.has(n.key)) continue;
        const isExpanded = !n.isLeaf && expandedFor(n.key);
        const isSelected = n.isLeaf && selVal !== '' && n.value === selVal;
        const isActive = n.key === this._activeKey;
        const cls = ['lmdd__row', 'lmdd__row--l' + n.level];
        if (isExpanded) cls.push('lmdd__row--expanded');
        if (isSelected) cls.push('lmdd__row--selected');
        if (isActive) cls.push('lmdd__row--active');
        const expander = n.isLeaf
          ? '<span class="lmdd__expander lmdd__expander--spacer" aria-hidden="true">&#xf054;</span>'
          : '<span class="lmdd__expander" aria-hidden="true">&#xf054;</span>';
        const check = isSelected
          ? '<span class="lmdd__check" aria-hidden="true">&#xf00c;</span>' : '';
        const childHtml = (!n.isLeaf && isExpanded)
          ? `<ul class="lmdd__group" role="group">${renderGroup(n.key)}</ul>` : '';
        const stateAttr = n.isLeaf
          ? ` aria-selected="${isSelected}"` : ` aria-expanded="${isExpanded}"`;
        html += `<li class="lmdd__item" id="lmdd-opt-${n.key}" role="treeitem" aria-level="${n.level}"${stateAttr}>`
          + `<div class="${cls.join(' ')}" data-key="${n.key}">${expander}`
          + `<span class="lmdd__text">${this._labelHtml(n.label)}</span>${check}</div>`
          + childHtml + '</li>';
      }
      return html;
    };

    const tree = root.querySelector('.lmdd__tree');
    const empty = root.querySelector('.lmdd__empty');
    const status = root.querySelector('.lmdd__status');
    tree.innerHTML = renderGroup(null);
    if (q && flat.length === 0) {
      empty.hidden = false;
      empty.textContent = this._noResultsText;
      status.textContent = this._noResultsText;
    } else {
      empty.hidden = true;
      empty.textContent = '';
      /* announce MATCHES, not visible rows — ancestors kept as context would inflate the count */
      const matches = q ? flat.filter((n) => n.label.toLowerCase().includes(q.toLowerCase())).length : 0;
      status.textContent = q ? `${matches} result${matches === 1 ? '' : 's'}` : '';
    }

    /* virtual cursor: aria-activedescendant lives on the focus owner (input, or the
       trigger when search="false") and points at the active treeitem's id */
    const owner = this._search
      ? root.querySelector('.lmdd__search-input') : root.querySelector('.lmdd__field');
    if (owner) {
      if (this._isOpen && this._activeKey) {
        owner.setAttribute('aria-activedescendant', 'lmdd-opt-' + this._activeKey);
      } else {
        owner.removeAttribute('aria-activedescendant');
      }
    }
    if (this._isOpen && this._activeKey) {
      const activeEl = root.querySelector('#lmdd-opt-' + this._activeKey + ' > .lmdd__row');
      if (activeEl && activeEl.scrollIntoView) activeEl.scrollIntoView({ block: 'nearest' });
    }
  }

  /* Canonical source: src/components/loop-multilevel-dropdown.css — edit there, mirror here. */
  _css() {
    return `
/* loop-multilevel-dropdown.css — canonical source of the <loop-multilevel-dropdown> shadow styles.
   Edit HERE, then mirror the full text into _css() in loop-multilevel-dropdown.js — the component
   ships as a single drop-in .js and this file is never loaded at runtime (loop-system-alert twin
   pattern). Geometry matches the single-Select restyle (src/blocks/loop-dropdown.css) by consuming
   the same --loop-select-* tokens; tree-specific knobs are --loop-mldd-* from
   tokens/component-multilevel-dropdown.css. Custom properties inherit into shadow DOM, so the
   .loop-field--* size ramp (which re-points --loop-select-*) scales this component too. */

:host {
  display: block;
  position: relative;
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
}
:host([hidden]) { display: none; }

/* ---- Optional label above the field (Select scale: 13px, not the 16px .loop-field label) ---- */
.lmdd__label {
  display: block;
  margin-bottom: var(--loop-field-label-gap, 6px);
  color: var(--color-text-on-light-default);
  font-size: var(--loop-select-label-size, 13px);
  font-weight: var(--font-weight-semibold, 600);
  line-height: var(--loop-select-label-leading, 16px);
  letter-spacing: var(--loop-select-label-tracking, 0.25px);
}

/* ---- Field box (closed trigger) — pixel parity with the single-Select restyle ---- */
.lmdd__field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--loop-select-gap, 8px);
  width: 100%;
  height: var(--loop-select-h, 40px); /* pinned — the focus ring below never resizes it */
  padding: var(--loop-select-padding-block, 11px) var(--loop-select-padding-inline, 16px);
  background-color: var(--color-bg-container-on-light-lowest, #ffffff);
  border: 1px solid var(--color-outline-on-light-default);
  border-radius: var(--loop-select-radius, 8px);
  color: var(--color-text-on-light-default);
  font-family: inherit;
  font-size: var(--loop-select-text-size, 13px);
  font-weight: var(--font-weight-regular, 400);
  line-height: var(--loop-select-text-leading, 14px);
  letter-spacing: var(--loop-select-text-tracking, 0.5px);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.lmdd__field:hover { border-color: var(--color-outline-on-light-emphasis); }
/* 2px ring with ZERO layout shift: keep the 1px border and add a 1px inset shadow inside it
   (border-no-height-shift — no padding compensation, a border never changes the box size). */
.lmdd__field:focus-visible,
.lmdd--open .lmdd__field {
  outline: none;
  border-color: var(--color-outline-on-light-link-focused);
  box-shadow: inset 0 0 0 1px var(--color-outline-on-light-link-focused);
}
.lmdd--disabled .lmdd__field,
.lmdd--disabled .lmdd__field:hover {
  background-color: var(--color-domain-state-disable-low);
  border-color: var(--color-domain-state-disable-low);
  color: var(--color-text-on-light-state-disabled);
  cursor: not-allowed;
  box-shadow: none;
}
.lmdd--disabled .lmdd__chevron { color: var(--color-icon-on-light-state-disabled); }

.lmdd__value {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lmdd__value--placeholder { color: var(--color-text-on-light-subdued); }

/* FA 6 Pro glyphs render from unicode codepoints against the document @font-face
   (visible inside shadow DOM, unlike .fa-* classes — never the legacy 'FontAwesome' family). */
.lmdd__chevron,
.lmdd__expander,
.lmdd__check,
.lmdd__search-icon,
.lmdd__search-clear-glyph {
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-solid, 900);
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
}
.lmdd__chevron {
  flex-shrink: 0;
  color: var(--color-icon-on-light-default, #4b5e71);
  font-size: var(--loop-mldd-chevron-size, 12px);
  transition: transform 0.15s ease;
}
.lmdd--open .lmdd__chevron { transform: rotate(180deg); }

/* ---- Panel (renders inside the host — an overflow:hidden ancestor clips it; see handover) ---- */
.lmdd__panel {
  position: absolute;
  inset-inline: 0;
  top: calc(100% + var(--space-tiny, 4px));
  z-index: var(--loop-mldd-panel-z, 100);
  display: none;
  background-color: var(--color-bg-container-on-light-lowest, #ffffff);
  border: 1px solid var(--color-outline-on-light-subdued);
  border-radius: var(--loop-select-list-radius, 8px);
  box-shadow: var(--loop-select-list-shadow, 0 2px 8px rgba(33, 38, 45, 0.16));
  overflow: hidden; /* clip rows + scrollbar to the radius */
}
.lmdd--open .lmdd__panel { display: block; }

/* ---- Search row (pinned above the tree) ---- */
.lmdd__search {
  display: flex;
  align-items: center;
  gap: var(--loop-select-gap, 8px);
  height: var(--loop-mldd-search-h, 40px);
  padding-inline: var(--loop-select-padding-inline, 16px);
  border-bottom: 1px solid var(--color-outline-on-light-subdued);
}
.lmdd__search-icon {
  flex-shrink: 0;
  color: var(--color-icon-on-light-default, #4b5e71);
  font-size: var(--loop-mldd-chevron-size, 12px);
}
.lmdd__search-input {
  flex: 1 1 auto;
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  outline: none;
  color: var(--color-text-on-light-default);
  font-family: inherit;
  font-size: var(--loop-select-option-text-size, 14px);
  letter-spacing: var(--loop-select-text-tracking, 0.5px);
}
.lmdd__search-input::placeholder { color: var(--color-neutral-alpha-57, rgba(0, 13, 26, 0.57)); }
.lmdd__search-clear {
  flex-shrink: 0;
  display: none;
  align-items: center;
  justify-content: center;
  width: var(--loop-select-option-check-size, 16px);
  height: var(--loop-select-option-check-size, 16px);
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-icon-on-light-default, #4b5e71);
  cursor: pointer;
}
.lmdd--has-query .lmdd__search-clear { display: inline-flex; }
.lmdd__search-clear:focus-visible {
  outline: 2px solid var(--color-outline-on-light-link-focused);
  outline-offset: 2px;
  border-radius: var(--radius-xs, 2px);
}
.lmdd__search-clear-glyph { font-size: var(--loop-select-tag-cross-size, 14px); }

/* ---- Tree ---- */
.lmdd__tree {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: var(--loop-mldd-panel-max-h, 320px);
  overflow-y: auto;
}
.lmdd__group,
.lmdd__item {
  margin: 0;
  padding: 0;
  list-style: none;
}
.lmdd__row {
  display: flex;
  align-items: center;
  gap: var(--loop-select-option-check-gap, 8px);
  min-height: var(--loop-mldd-option-h, 40px);
  padding: var(--space-xxsmall, 8px) var(--loop-select-padding-inline, 16px);
  color: var(--color-text-on-light-default);
  font-size: var(--loop-select-option-text-size, 14px);
  line-height: 1.5;
  cursor: pointer;
}
/* indentation: one --loop-mldd-indent step per level below the first */
.lmdd__row--l2 { padding-left: calc(var(--loop-select-padding-inline, 16px) + var(--loop-mldd-indent, 16px)); }
.lmdd__row--l3 { padding-left: calc(var(--loop-select-padding-inline, 16px) + 2 * var(--loop-mldd-indent, 16px)); }

.lmdd__row:hover,
.lmdd__row--active { background-color: var(--color-bg-container-on-light-low, #f5f7f9); }
/* selected wins over hover/active fill (Tags-balloon precedent) */
.lmdd__row--selected,
.lmdd__row--selected:hover { background-color: var(--loop-select-option-selected-bg, #e7edf3); }
/* the keyboard virtual cursor also draws a visible ring (fill alone can't be its only cue) */
.lmdd__row--active {
  outline: 2px solid var(--color-outline-on-light-link-focused);
  outline-offset: -2px;
}

.lmdd__expander {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--loop-select-option-check-size, 16px);
  color: var(--color-icon-on-light-default, #4b5e71);
  font-size: var(--loop-mldd-chevron-size, 12px);
  transition: transform 0.15s ease;
}
.lmdd__row--expanded > .lmdd__expander { transform: rotate(90deg); }
/* leaves have no expander — an invisible spacer keeps leaf labels aligned with sibling parents */
.lmdd__expander--spacer { visibility: hidden; }

.lmdd__text {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lmdd__hl { font-weight: var(--font-weight-semibold, 600); }

.lmdd__check {
  flex-shrink: 0;
  margin-left: auto;
  color: var(--color-icon-on-light-default, #4b5e71);
  font-size: var(--loop-select-option-check-size, 16px);
}

/* ---- Empty state (no search matches) ---- */
.lmdd__empty {
  display: flex;
  align-items: center;
  min-height: var(--loop-mldd-option-h, 40px);
  padding: var(--space-xxsmall, 8px) var(--loop-select-padding-inline, 16px);
  color: var(--color-text-on-light-subdued);
  font-size: var(--loop-select-option-text-size, 14px);
}
.lmdd__empty[hidden] { display: none; }

/* ---- Visually-hidden live region announcing result counts ---- */
.lmdd__status {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .lmdd__field,
  .lmdd__chevron,
  .lmdd__expander { transition: none; }
}`;
  }
}

if (!customElements.get('loop-multilevel-dropdown')) {
  customElements.define('loop-multilevel-dropdown', LoopMultilevelDropdown);
}
```

</details>

## API — Attributes

All attributes are observed — changing them from ODC re-renders reactively.

| Attribute | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | Text (JSON) | `[]` | Up to 3 levels of `{ "value", "label", "children": [] }`. A node with a non-empty `children[]` is a non-selectable group header; nodes without children are selectable leaves at any level. Levels deeper than 3 are ignored. Single-quoted JSON is accepted (convenient in ODC Expressions; escape inner apostrophes as `\'`). Invalid JSON renders an empty list + a `console.warn` (never throws). |
| `selected-value` | Text | `""` | Current selection. **Reflected** by the component (before `change` fires) so ODC can read it back; assigning the same value back is a no-op. |
| `placeholder` | Text | `"Select an option"` | Field text when nothing is selected. |
| `label` | Text | `""` | Optional visible label above the field (13px Select scale). When empty, the field's `aria-label` falls back to the placeholder. |
| `search` | Boolean (value-aware) | `true` | `search="false"` hides the search row — plain tree dropdown. Bind `If(ShowSearch, "true", "false")`. |
| `search-placeholder` | Text | `"Search"` | Placeholder of the panel search input. |
| `no-results-text` | Text | `"No results found"` | Empty-state row when a query matches nothing (also announced to AT). |
| `disabled` | Boolean (value-aware) | `false` | Disabled styling + inert. Bind `If(Disabled, "true", "false")`. |

## API — Properties

| Property | Access | Behavior |
| --- | --- | --- |
| `items` | get/set | Mirrors the `items` attribute as a parsed array (defensive parse → `[]`). |
| `selectedValue` | get/set | Mirrors the `selected-value` attribute. |
| `selectedRecord` | get | The selection as a nested `{value,label,child}` tree (same as the change detail); `null` when nothing is selected. |

## API — Methods (callable from OutSystems / JS)

| Method | Behavior |
| --- | --- |
| `open()` | Opens the panel (no-op when disabled) and focuses the search input. |
| `close()` | Closes the panel and returns focus to the field. |
| `clear()` | Clears the selection and fires `change` with an empty chain (`[]`). |

## API — Events

| Event | detail | Options |
| --- | --- | --- |
| `change` | The **selection tree** — a nested `{value, label, child:{…}}` object, root → leaf, one level per nesting | `bubbles: true, composed: true`. Fired ONLY on user selection or `clear()`, never when ODC rewrites the `selected-value` attribute. |

`e.detail` IS the nested tree — nothing else. A level-3 pick nests three deep (the innermost record, with no `child`, is the selected leaf); a level-1 leaf is a single object with no `child`; `clear()` fires `null`:

```json
{
  "value": "asi", "label": "Asia",
  "child": {
    "value": "sea", "label": "South East Asia",
    "child": {
      "value": "ph", "label": "Philippines"
    }
  }
}
```

Out of scope by decision (see Decision log): multi-select, per-node disabled, node icons, open/close events, error-state attribute.

## Example HTML

```html
<loop-multilevel-dropdown
  label="Region"
  placeholder="Select a country"
  selected-value=""
  search="true"
  items='[
    { "value": "afr", "label": "Africa", "children": [
      { "value": "waf", "label": "West Africa", "children": [
        { "value": "ng", "label": "Nigeria" },
        { "value": "gh", "label": "Ghana" } ] } ] },
    { "value": "asi", "label": "Asia", "children": [
      { "value": "sea", "label": "South East Asia", "children": [
        { "value": "ph", "label": "Philippines" } ] } ] }
  ]'>
</loop-multilevel-dropdown>
```

## OutSystems Block wiring

1. Import `loop-multilevel-dropdown.js` as a Script resource (Theme/Library), **Include = Always**.
2. Create a Block `MultilevelDropdown` with inputs `Items` (Text — the JSON), `SelectedValue`, `Placeholder`, `Label`, `ShowSearch` (Boolean), `SearchPlaceholder`, `NoResultsText`, `Disabled` (Boolean) and event `OnChange` (Text payload = the selected value).
3. Place an HTML element `loop-multilevel-dropdown` and bind one attribute per input (ODC requires a Value expression on every attribute). Booleans are **value-aware**: `search = If(ShowSearch, "true", "false")`, `disabled = If(Disabled, "true", "false")` — never presence-only.
4. Build the `Items` JSON in a data action or client logic (e.g. `JSONSerialize` over a nested structure, or a small loop over an Aggregate with parent references).
5. Wire the `change` CustomEvent in OnReady/OnDestroy — see the generated Event wiring section below. The wiring passes `JSON.stringify(e.detail)` so `OnChange` receives the **selection tree** as one Text payload — `JSONDeserialize` it into a nested Structure, one level per depth: `Selection { Value, Label, Child: Selection2 }`, `Selection2 { Value, Label, Child: Selection3 }`, `Selection3 { Value, Label }`. Descend `.Child` until it is empty to reach the selected leaf; the outer object is the root ancestor. `clear()` sends `null`.
6. Sizing: the component consumes `--loop-select-*`, so the shared `.loop-field--xlarge/large/regular/small` wrapper ramp re-scales it automatically (custom properties inherit into shadow DOM).

## Accessibility (WCAG 2.2 AA)

- **Pattern:** combobox-with-tree-popup. Trigger button: `aria-haspopup="tree"`, `aria-expanded`, `aria-controls`; accessible name from `label` (`aria-labelledby`) or `aria-label` = placeholder. Search input: `role="combobox"`, `aria-autocomplete="list"`, `aria-controls` → tree, `aria-activedescendant` → the virtually focused row. Real focus stays in the input while the panel is open; arrows drive the virtual cursor. Rows: `role="treeitem"` with `aria-level` (1–3), `aria-expanded` on parents, `aria-selected` on leaves, children in `role="group"` lists. With `search="false"` the trigger carries `aria-activedescendant` itself.
- **Keyboard:** Enter/Space/↓/↑ open (cursor lands on the selection, its branch expanded); printable characters open + seed the search; ↓/↑ move over visible rows; → expand / first child; ← collapse / parent; Home/End; Enter selects a leaf or toggles a parent; Esc closes without change; Tab closes and moves on; click-outside closes.
- **Visible focus:** field ring = border-color swap + 1px inset box-shadow in `--color-outline-on-light-link-focused` (2px ring effect, zero layout shift); virtual cursor row = fill + 2px inset outline (never color alone).
- **Live region:** a visually-hidden `aria-live="polite"` element announces "N results" / the no-results text while filtering.
- **Reduced motion:** chevron rotations and field transitions are zeroed under `prefers-reduced-motion: reduce`.
- No findings raised: the component introduces no design-specified colors beyond the existing Select tokens.

## Event wiring (OnReady / OnDestroy)

> The component's CustomEvents are wired in the Block's **OnReady** and cleaned up in
> **OnDestroy** — the declarative "Handle Events" path is unreliable for custom elements.
> Give the `<loop-multilevel-dropdown>` element (or its wrapping Block) a **Name** and pass its
> platform-generated `.Id` to each "Run JavaScript" node as `WidgetId`. Paste these two
> blocks verbatim — they store each handler on `$public` so OnDestroy removes it by
> reference. (If your ODC version doesn't persist `$public` across OnReady/OnDestroy,
> stash the handlers on the element instead — `el._loopHandlers = { … }`.)

| CustomEvent | raises Block event |
|---|---|
| `change` | `OnChange(JSON.stringify(e.detail))` |

**OnReady** — resolve the element, attach listeners, stash for cleanup:

```js
// Block OnReady — "Run JavaScript" node. Input: WidgetId = <ElementName>.Id
var root = document.getElementById($parameters.WidgetId);
var el = (root && root.tagName && root.tagName.toLowerCase() === 'loop-multilevel-dropdown')
  ? root : (root ? root.querySelector('loop-multilevel-dropdown') : null);
if (el) {
  $public.el = el;                       // stash for OnDestroy cleanup
  $public.handleChange = function (e) { $actions.OnChange(JSON.stringify(e.detail)); };
  el.addEventListener('change', $public.handleChange);
}
```

**OnDestroy** — remove the listeners:

```js
// Block OnDestroy — "Run JavaScript" node. Uses the reference stashed in OnReady.
if ($public.el) {
  $public.el.removeEventListener('change', $public.handleChange);
}
```

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, wire up an OutSystems Block that wraps the already-imported custom
Web Component <loop-multilevel-dropdown> for the WBG "The Loop" design system.

Context (already done manually — do NOT re-create or edit these):
- dist/tokens.css (brand + component tokens) and dist/theme.css are already pasted into the ODC Theme editor.
- loop-multilevel-dropdown.js is already imported as a Script resource (Theme/Library), Include = Always. It
  defines the custom element <loop-multilevel-dropdown>.
- Do NOT write CSS, author or modify JavaScript, or edit the Theme. Your job is only the
  Block, its inputs/events, the attribute bindings, the event wiring
  the component needs.

Task — create these elements, referencing each by the exact name given:

1. Create a Block named "MultilevelDropdown" with input parameters:
     Items             : Text (JSON) : "[]"   // up to 3 levels of {value,label,children[]}
     SelectedValue     : Text        : ""
     Placeholder       : Text        : "Select an option"
     Label             : Text        : ""
     ShowSearch        : Boolean     : True
     SearchPlaceholder : Text        : "Search"
     NoResultsText     : Text        : "No results found"
     Disabled          : Boolean     : False
   and Block events: OnChange.
   Do NOT add a string Id input or set the element's id — OutSystems generates ids at
   runtime (see step 4 for addressing).

2. Place an HTML element <loop-multilevel-dropdown> in the Block. Set one attribute per input via a Value
   expression (ODC requires an expression on every attribute):
     items              = Items
     selected-value     = SelectedValue
     placeholder        = Placeholder
     label              = Label
     search             = If(ShowSearch, "true", "false")
     search-placeholder = SearchPlaceholder
     no-results-text    = NoResultsText
     disabled           = If(Disabled, "true", "false")
   Static-Entity inputs bind directly (e.g. type = Type) — the Value attribute is the
   record Identifier. Use If(flag,"true","false") for every Boolean (values, not presence).

3. Wire CustomEvents to Block events: the "change" CustomEvent triggers OnChange. Do NOT use the declarative "Handle Events"
   path (unreliable for custom elements). Instead add a "Run JavaScript" node in the Block's
   OnReady that resolves the <loop-multilevel-dropdown>, addEventListener's each event (storing each handler on
   $public so it can be removed), and raises the matching Block event; add a second
   "Run JavaScript" node in OnDestroy that removeEventListener's them. The exact OnReady +
   OnDestroy code is in this handover's "## Event wiring (OnReady / OnDestroy)" section —
   paste it verbatim (you are placing provided JS, not authoring it).

4. This component exposes no global helper — drive it entirely through the Block inputs
   and events above; there is no id to pass.

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values (styling
comes from var(--token) in the Theme). After generating, list every element you created by
name and flag any step you could not finish so I can do it manually.

Start with step 1 (the Block "MultilevelDropdown" interface) and show it to me before wiring.
```

## Checklist

- [ ] Paste `dist/theme.css` into the ODC Theme (carries `--loop-mldd-*` + the reused `--loop-select-*` tokens).
- [ ] Import `loop-multilevel-dropdown.js` as a Script resource, Include = Always.
- [ ] Create the `MultilevelDropdown` Block (inputs + `OnChange`) and bind attributes with value-aware booleans.
- [ ] Wire `change` in OnReady / OnDestroy per the generated section below.
- [ ] Publish and test in a real browser (never Service Studio Preview — Web Components don't render there): open/expand 3 levels, search across levels, leaf-only selection, keyboard pass, `OnChange` payload.
- [ ] Check the Block isn't inside an `overflow: hidden` container (panel clipping — see Known limitation).

## Decision log

- **No Figma ref** — user-spec'd component; geometry and colors are borrowed 1:1 from the shipped single-Select restyle (`--loop-select-*`) for consistency. Per project rules this is a logged decision, not a finding (conventions are three-state; nothing `confirmed` was violated).
- **Tree/accordion panel** (vs cascading flyouts / drill-down) — chosen by the requester; works on touch, keeps search results in context, simplest ARIA.
- **Leaf-only selection** — nodes with children are group headers; `change` payload is always an unambiguous record.
- **Closed field shows the full ancestor path** (`Asia > South East Asia > Philippines`) — requester-specified 2026-07-15. The same hierarchy travels on the `change` detail as a nested `{value,label,child}` tree (and on the `selectedRecord` property).
- **Search in the panel** (not in-field) — the closed field must pixel-match the shipped Select; the Tags rebuild's field-side proxy input exists only to work around a VirtualSelect constraint this component doesn't have.
- **Combobox-with-tree-popup ARIA** — `role="tree"` over listbox+`aria-level` because collapse state needs the `aria-expanded` vocabulary; one combobox only (the search input), the trigger stays a plain disclosure button.
- **3-level cap** — deeper nesting is ignored, not an error (documented in the API table).
- **No error-state attribute** — validation display belongs to the Field Wrapper pattern; kept out of this API.
- **Full list re-render per state change** — dropdown-scale data; a delegated listener set on the shadow root survives `innerHTML` swaps. The search input lives in the skeleton (not the list) so typing never destroys it.
- **Panel inside the host, no body-append** — keeps the component self-contained (no scroll/reposition mirroring); the overflow-hidden clipping trade-off is documented above.
