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
 *                      Invalid JSON renders an empty list (never throws).
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
 *             selectedRecords (get-only → the change-detail array below; [] unselected).
 * Methods:    open() · close() · clear().
 *
 * After selection the closed field shows the full ancestor path, e.g.
 * "Asia > South East Asia > Philippines" (long paths ellipsise; full path in title).
 *
 * Events (bubbles, composed):
 *   change — fired ONLY on user selection or clear(), never on attribute echo.
 *            detail IS the selection chain: an array of {value,label} records
 *            root → leaf, one per level — a level-3 pick returns three records:
 *              [ {value:"asi",label:"Asia"},
 *                {value:"sea",label:"South East Asia"},
 *                {value:"ph",label:"Philippines"} ]
 *            The last entry is always the selected leaf. clear() fires [].
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

  get items() {
    try {
      const v = JSON.parse(this.getAttribute('items') || '[]');
      return Array.isArray(v) ? v : [];
    } catch { return []; }
  }
  set items(arr) { this.setAttribute('items', JSON.stringify(arr || [])); }

  get selectedValue() { return this.getAttribute('selected-value') || ''; }
  set selectedValue(v) { this.setAttribute('selected-value', v == null ? '' : String(v)); }

  /* The selection chain root → leaf, one {value,label} record per level — [] when nothing
     is selected. This IS the change-event detail. */
  get selectedRecords() {
    const v = this.selectedValue;
    if (!v) return [];
    const n = this._model().find((x) => x.isLeaf && x.value === v);
    return n ? this._chainFor(n) : [];
  }

  /* Ancestor chain root → node as internal nodes. */
  _ancestry(node) {
    const byKey = this._byKey();
    const chain = [node];
    let p = node.parentKey;
    while (p) { const pn = byKey.get(p); chain.unshift(pn); p = pn.parentKey; }
    return chain;
  }

  /* Ancestor chain root → node as clean {value,label} records. */
  _chainFor(node) {
    return this._ancestry(node).map((n) => ({ value: n.value, label: n.label }));
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
      detail: [], bubbles: true, composed: true,
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
    let parsed;
    try { parsed = JSON.parse(src); } catch { parsed = []; }
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
      detail: this._chainFor(node), bubbles: true, composed: true,
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
