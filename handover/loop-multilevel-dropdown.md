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
 *   selected-record    Current selection as the SAME nested {value,label,child} record the
 *                      change event emits — preselect by binding an onChange record straight
 *                      back. Single-quoted JSON accepted (ODC-style). Resolved to a leaf by
 *                      matching the full value path (root→mid→leaf), which disambiguates leaves
 *                      that share a value across branches. A single-element `children` ARRAY is
 *                      tolerated as an alias for `child` (the items shape — the natural mistake
 *                      when an ODC dev reuses the items Structure for the preselect binding);
 *                      2+ entries warn and take the first. REFLECTED before change fires so ODC
 *                      can read it back; the echo of the same string is a no-op (o===v guard).
 *   placeholder        Field text when nothing is selected (default "Select an option").
 *   label              Optional visible label above the field. When empty the field's
 *                      aria-label falls back to a bound native Label, else the placeholder.
 *   search             Boolean (default true) — "false" hides the search row.
 *   search-placeholder Placeholder of the panel search input (default "Search").
 *   no-results-text    Empty-state row text (default "No results found").
 *   disabled           Boolean — inert field, disabled styling.
 *   required           Boolean — aria-required on the trigger + asterisk on the internal
 *                      label. With a native Label the asterisk comes from OSUI's .mandatory.
 *   invalid            Boolean — error border/background + aria-invalid. Driven by
 *                      OutSystems' own validation (the .not-valid equivalent); the component
 *                      never derives it. The error MESSAGE stays in the Field Wrapper's
 *                      light DOM — aria-describedby cannot cross the shadow boundary.
 *
 * Labelling: the element is form-associated, so the HOST is labelable — a native OutSystems
 * Label with Mandatory=True binds via <label for="{host id}">, clicking it focuses the
 * trigger (delegatesFocus), and its text becomes the trigger's aria-label. Supply EITHER a
 * native Label OR the `label` attribute, never both — `label` wins and hides the other's
 * contribution to the accessible name.
 *
 * Sizing: no size attribute — the field consumes --loop-select-* and the panel row/search
 * metrics derive from --loop-select-h, so the shared .loop-field--xlarge|large|regular|small
 * wrapper ramp scales the whole component (custom properties inherit into shadow DOM).
 *
 * Properties: items (get/set ⇄ attribute) · selectedRecord (get/set ⇄ selected-record —
 *             the nested tree below; get resolves against items, null when unselected).
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
  /* Form-associated so the HOST is a *labelable* element: a native OutSystems Label
     (<label for="…">) can only bind to one, and the trigger button is unreachable inside
     the shadow root. Also gives us setFormValue() participation and the form lifecycle
     callbacks. Validity is NOT set here — display stays OutSystems-driven via `invalid`. */
  static formAssociated = true;

  static get observedAttributes() {
    return ['items', 'selected-record', 'placeholder', 'label', 'search',
            'search-placeholder', 'no-results-text', 'disabled', 'required', 'invalid'];
  }

  constructor() {
    super();
    /* delegatesFocus: a label click calls host.focus(), which must land on the trigger. */
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this._internals = this.attachInternals();
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
    this._internals.setFormValue(this.getAttribute('selected-record') || '');
    this.shadowRoot.addEventListener('click', this._onClick);
    this.shadowRoot.addEventListener('keydown', this._onKeydown);
    this.shadowRoot.addEventListener('input', this._onInput);
    /* An external <label for> may parse AFTER this element upgrades, so internals.labels can
       still be empty here. Re-resolve once the frame settles — but only re-render if the name
       actually changed, so the common (no external label) case costs nothing. */
    if (!this._label) {
      const named = this._externalLabel;
      requestAnimationFrame(() => {
        if (this.isConnected && !this._label && this._externalLabel !== named) this._render();
      });
    }
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
    if (n === 'selected-record') this._internals.setFormValue(v || '');
    if (n === 'disabled' && this._disabled && this._isOpen) this._closePanel(false);
    if (this.isConnected) this._render();
  }

  /* ── form lifecycle (formAssociated) ───────────────────────────────────────── */

  formResetCallback() { this.clear(); }

  /* Fieldset/form disabling is a separate axis from the `disabled` attribute — mirror it
     onto the attribute so the single _disabled getter stays the source of truth. */
  formDisabledCallback(disabled) {
    if (disabled) this.setAttribute('disabled', 'true');
    else this.removeAttribute('disabled');
  }

  formStateRestoreCallback(state) { this.setAttribute('selected-record', state || ''); }

  /* OutSystems binds booleans as If(Flag,"true","false") so hasAttribute() alone is
     insufficient — must treat "false" and "0" as falsy. */
  _boolAttr(name) {
    const v = this.getAttribute(name);
    if (v === null) return false;
    return v !== 'false' && v !== '0';
  }

  get _disabled()      { return this._boolAttr('disabled'); }
  get _required()      { return this._boolAttr('required'); }
  get _invalid()       { return this._boolAttr('invalid'); }
  /* `search` defaults TRUE when absent — same value-aware parsing, inverted default. */
  get _search()        { const v = this.getAttribute('search'); if (v === null) return true; return v !== 'false' && v !== '0'; }
  get _placeholder()   { return this.getAttribute('placeholder') || 'Select an option'; }
  get _label()         { return this.getAttribute('label') || ''; }
  get _searchPlaceholder() { return this.getAttribute('search-placeholder') || 'Search'; }
  get _noResultsText() { return this.getAttribute('no-results-text') || 'No results found'; }

  /* Text of any native <label for> bound to the host (internals.labels), '' when none.
     Used only when the `label` attribute is absent — see the naming precedence in _render(). */
  get _externalLabel() {
    const labels = this._internals.labels;
    if (!labels || !labels.length) return '';
    return Array.from(labels).map((l) => l.textContent.trim()).filter(Boolean).join(' ');
  }

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

  /* The selection is a NESTED record — {value,label,child:{…}} root → leaf, one level per
     nesting, the innermost node (no `child`) being the selected leaf. This is BOTH the
     preselect input (the `selected-record` attribute) AND the change-event detail — one shape,
     both directions. The getter resolves against `items` so labels are canonical and a stale
     or unresolvable record reads back as null (self-healing); null when nothing is selected. */
  get selectedRecord() {
    const n = this._selectedNode();
    return n ? this._nestedFor(n) : null;
  }
  set selectedRecord(rec) {
    if (rec == null || rec === '') { this.setAttribute('selected-record', ''); return; }
    this.setAttribute('selected-record', typeof rec === 'string' ? rec : JSON.stringify(rec));
  }

  /* Parse the `selected-record` attribute into a nested {value,label,child} object (or null).
     Same double-quote-first / single-quote-tolerant strategy as `_parseItems`, since ODC
     Expressions naturally hand-author single-quoted JSON. Warns (never throws) on bad input. */
  _parseRecord(raw) {
    const s = (raw == null ? '' : String(raw)).trim();
    if (!s) return null;
    try { return JSON.parse(s); } catch { /* fall through to quote-tolerant parse */ }
    try { return JSON.parse(this._singleToDoubleQuoted(s)); }
    catch (e) {
      console.warn('[loop-multilevel-dropdown] invalid selected-record JSON:', e.message, s);
      return null;
    }
  }

  /* The next level down from a `selected-record` step. Canonically `.child` (a single object —
     a selection is ONE path, not a tree). Tolerated alias: `.children` holding a single-element
     array, i.e. the same shape as `items`. ODC devs naturally reuse the items Structure for the
     preselect binding, and the mismatch used to fail SILENTLY (path stops at a non-leaf → no
     selection). Same spirit as the single-quoted-JSON tolerance in _parseRecord: accept the
     obvious authoring mistake rather than render nothing. A `children` array with 2+ entries is
     genuinely ambiguous (a selection can't fork), so it warns and takes the first. */
  _stepDown(step) {
    if (step.child != null) return step.child;
    const kids = step.children;
    if (!Array.isArray(kids) || kids.length === 0) return null;
    if (kids.length > 1) {
      console.warn('[loop-multilevel-dropdown] selected-record uses `children` with '
        + kids.length + ' entries; a selection is a single path — using the first. '
        + 'Prefer the canonical `child` object.');
    }
    return kids[0];
  }

  /* Resolve the `selected-record` to the matching LEAF node by walking the record's `.child`
     chain (or the tolerated `.children` alias — see _stepDown) against the tree and matching
     each level's `value` (labels are ignored). The deepest matched node must be a leaf to count
     as selected — a broken or non-leaf path yields null.
     Full-path matching disambiguates leaves that share a value across different branches.
     Memoised per (items src + record string) so `_render`/`_renderList` never re-walk. */
  _selectedNode() {
    const itemsSrc = this.getAttribute('items') || '[]';
    const recSrc = this.getAttribute('selected-record') || '';
    const cacheKey = itemsSrc + '\n' + recSrc;   // \n can't appear unescaped in either JSON string, so the boundary is unambiguous
    if (this._selSrc === cacheKey) return this._selNode;
    this._selSrc = cacheKey;
    this._selNode = null;

    const rec = this._parseRecord(recSrc);
    if (rec && typeof rec === 'object') {
      const childrenOf = (parentKey) =>       // _model() (called here) rebuilds per items string before any lookup
        this._model().filter((n) => n.parentKey === parentKey);
      let level = childrenOf(null);      // level-1 candidates (parentKey === null)
      let node = null;
      let step = rec;
      while (step && typeof step === 'object') {
        const wanted = step.value == null ? '' : String(step.value);
        const hit = level.find((n) => n.value === wanted);
        if (!hit) { node = null; break; }        // path breaks → no selection
        node = hit;
        const next = this._stepDown(step);
        if (next == null) break;                  // innermost record reached
        level = childrenOf(hit.key);
        step = next;
      }
      if (node && node.isLeaf) this._selNode = node;
    }
    return this._selNode;
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
    const n = this._selectedNode();
    return n ? this._ancestry(n).map((x) => x.label).join(' > ') : '';
  }

  open() {
    if (this._disabled || this._isOpen || !this.isConnected) return;
    this._isOpen = true;
    const sel = this._selectedNode();
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
    this.setAttribute('selected-record', '');   // reflect BEFORE the event, like _select()
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

  /* Reflect selected-record FIRST (so ODC reads the new selection inside the handler and its
     echo re-assignment is a no-op via the o===v guard), then fire change, then close. The
     reflected string and the change detail are the SAME nested record — one shape, both ways. */
  _select(node) {
    const rec = this._nestedFor(node);
    this.setAttribute('selected-record', JSON.stringify(rec));
    this.dispatchEvent(new CustomEvent('change', {
      detail: rec, bubbles: true, composed: true,
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
      + (this._invalid ? ' lmdd--invalid' : '')
      + (this._query.trim() ? ' lmdd--has-query' : '');
    /* Naming precedence: own `label` attr (renders a visible label) → a native OutSystems
       Label bound to the host (its text is copied in; NO internal label is rendered, so the
       two must never both be supplied) → the placeholder. */
    const extLabel = label ? '' : this._externalLabel;
    const fieldName = label
      ? 'aria-labelledby="lmdd-label lmdd-value"'
      : `aria-label="${this._esc(extLabel || this._placeholder)}"`;
    const treeName = label
      ? 'aria-labelledby="lmdd-label"'
      : `aria-label="${this._esc(extLabel || this._placeholder)}"`;
    /* aria-required/-invalid ride the trigger — the light-DOM Field Wrapper's asterisk and
       message cannot reach across the shadow boundary. */
    const validityAttrs = (this._required ? ' aria-required="true"' : '')
      + (this._invalid ? ' aria-invalid="true"' : '');
    const labelCls = 'lmdd__label' + (this._required ? ' lmdd__label--required' : '');
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

    /* Read BEFORE the innerHTML swap — it destroys whatever held focus (see the restore below). */
    const hadShadowFocus = !!this.shadowRoot.activeElement;

    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="${rootCls}">
        ${label ? `<span class="${labelCls}" id="lmdd-label">${this._esc(label)}</span>` : ''}
        <button class="lmdd__field" type="button"${disabled ? ' disabled' : ''}
          aria-haspopup="tree" aria-expanded="${this._isOpen}" aria-controls="lmdd-panel"
          ${fieldName}${validityAttrs}>
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
      if (inp) {
        inp.value = this._query;                    // full render preserves an in-flight query
        /* …and its FOCUS. A full render destroys the focused input, so an attribute change
           mid-interaction (ODC flipping `invalid` as validation runs, or re-pushing `items`)
           would strand focus on <body> — leaving the shadowRoot keydown listener unreachable
           and the panel stuck open with Escape and the arrow keys dead. Only re-focus if the
           render actually orphaned the focus, so we never steal it from elsewhere. */
        if (hadShadowFocus && !this.shadowRoot.activeElement) inp.focus();
      }
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

    const selKey = this._selectedNode()?.key;   // KEY match (not value) — disambiguates duplicate leaf values
    const renderGroup = (parentKey) => {
      let html = '';
      for (const n of nodes) {
        if (n.parentKey !== parentKey || !visible.has(n.key)) continue;
        const isExpanded = !n.isLeaf && expandedFor(n.key);
        const isSelected = n.isLeaf && n.key === selKey;
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
  /* Panel row + search heights are one field-height each, so they track --loop-select-h as
     the .loop-field--* wrapper ramp re-points it (56/48/40/32) — without this the panel kept
     40px rows under a 32px Small field. Derived HERE, not in the token file: a var() inside a
     custom property is substituted where it is declared, so a :root derivation would freeze
     at 40px; :host is the first scope that sees the wrapper's value. */
  --loop-mldd-option-h: var(--loop-select-h, 40px);
  --loop-mldd-search-h: var(--loop-select-h, 40px);
}
:host([hidden]) { display: none; }
/* delegatesFocus (needed so a native <label for> click reaches the trigger) also makes the
   host match :focus — suppress its ring so only .lmdd__field's own ring ever draws. */
:host(:focus) { outline: none; }

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
/* Required marker — LEADING asterisk (Figma 19336-9606), mirroring how the native
   .mandatory marker is repositioned in tokens/outsystems-ui-overrides.css so the internal
   label matches the OSUI Label it stands in for. The global rule can't reach in here (shadow
   DOM), so the same flex + order:-1 trick is repeated locally. Only rendered on the internal
   label; with a native Label, OSUI supplies its own. */
.lmdd__label--required {
  display: flex;
  align-items: flex-start;
  gap: var(--loop-mandatory-marker-gap, 4px);
}
.lmdd__label--required::after {
  content: "*";
  order: -1;
  color: var(--color-text-on-light-state-error);
  line-height: inherit;
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
/* Error state — same three tokens as the native Select's .not-valid treatment in
   src/blocks/loop-dropdown.css. Sits AFTER :hover and BEFORE the focus rules: all three are
   equal specificity (0,2,0), so source order alone decides — hover can't wash out the error
   colour, and focusing an invalid field still draws the focus ring over it. Do NOT add a
   :hover variant here; at (0,3,0) it would outrank the focus ring. */
.lmdd--invalid .lmdd__field {
  background-color: var(--color-bg-container-state-error-low);
  border-color: var(--color-outline-on-light-state-error-high);
  color: var(--color-text-on-state-error-emphasis);
}
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
| `selected-record` | Text (JSON) | `""` | Current selection as the **same nested `{value, label, child:{…}}` record** the `change` event emits — preselect by binding an onChange record straight back (one shape, both directions). Single-quoted JSON accepted (ODC-style). Resolved to a leaf by **matching the full value path** (root→mid→leaf), which disambiguates leaves that share a `value` across branches. **Reflected** before `change` fires so ODC can read it back; the echo of the same string is a no-op. Invalid/partial/non-leaf record → no selection (+ a `console.warn` on malformed JSON, never throws). |
| `placeholder` | Text | `"Select an option"` | Field text when nothing is selected. |
| `label` | Text | `""` | Optional visible label above the field (13px Select scale). When empty, the field's `aria-label` falls back to a bound native Label (see **Labelling** below), else the placeholder. |
| `search` | Boolean (value-aware) | `true` | `search="false"` hides the search row — plain tree dropdown. Bind `If(ShowSearch, "true", "false")`. |
| `search-placeholder` | Text | `"Search"` | Placeholder of the panel search input. |
| `no-results-text` | Text | `"No results found"` | Empty-state row when a query matches nothing (also announced to AT). |
| `disabled` | Boolean (value-aware) | `false` | Disabled styling + inert. Bind `If(Disabled, "true", "false")`. |
| `required` | Boolean (value-aware) | `false` | `aria-required` on the trigger + a trailing asterisk on the **internal** label. With a native Label the asterisk comes from OSUI's own `.mandatory`, so there is no double marker. Bind `If(IsRequired, "true", "false")`. |
| `invalid` | Boolean (value-aware) | `false` | Error border/background (the `.not-valid` equivalent) + `aria-invalid`. **Driven by OutSystems' validation — the component never derives it.** Bind `If(Not Form.Valid, "true", "false")` or your own flag. |

## Labelling — native OutSystems Label

The element is **form-associated** (`static formAssociated = true` + `attachInternals()`), so the
**host** is a *labelable* element: a native OutSystems Label binds to it with `for`, exactly like a
Text Field. `delegatesFocus: true` on the shadow root forwards the label click to the trigger button.

```html
<label for="{host id}" class="mandatory">Region</label>
<loop-multilevel-dropdown id="{host id}" required="true" …></loop-multilevel-dropdown>
```

**Accessible-name precedence** — supply EITHER a native Label OR the `label` attribute, never both:

1. `label` attribute set → renders the visible internal label, names the trigger via `aria-labelledby`.
2. No `label`, but a native Label is bound → **no internal label is rendered**; the Label's text becomes the trigger's `aria-label`.
3. Neither → `aria-label` falls back to the placeholder.

In ODC: set the Label widget's **Input Widget** to the Block (or place the Block inside the Field
Wrapper's Input placeholder) and set **Mandatory = True** for the asterisk; pass the same flag to
`required` so `aria-required` reaches the trigger.

**Limitation.** The error *message* stays in the Field Wrapper's light DOM and is **not**
programmatically tied to the trigger (`aria-describedby` inside the shadow root cannot reference a
light-DOM element). Keep the message adjacent and rely on `aria-invalid` + the live region. This is
a known a11y gap with an open follow-up — see the Decision log.

## Sizing

No `size` attribute — the **`.loop-field--xlarge/large/regular/small` wrapper ramp is the single
sizing mechanism**. The field consumes `--loop-select-*`, and the panel row + search heights are
derived from `--loop-select-h` at `:host`, so field, search row and tree rows all scale together
(56/48/40/32). Custom properties inherit into shadow DOM, so this needs no wiring.

> The derivation lives at `:host` in the component CSS, **not** in `tokens/component-multilevel-dropdown.css`:
> a `var()` inside a custom property is substituted where it is *declared*, so a `:root`-level
> derivation would freeze at 40px and ignore the wrapper. `--loop-mldd-chevron-size` stays fixed
> (the ramp's text steps don't map onto the glyph box, and there is no Figma ref to derive one from).

## API — Properties

| Property | Access | Behavior |
| --- | --- | --- |
| `items` | get/set | Mirrors the `items` attribute as a parsed array (defensive parse → `[]`). |
| `selectedRecord` | get/set | Mirrors the `selected-record` attribute. **Get** resolves the record against `items` and returns the nested `{value,label,child}` tree (canonical labels, same shape as the change detail; `null` when unresolved/unselected). **Set** accepts an object or a pre-serialized JSON string. |

## API — Methods (callable from OutSystems / JS)

| Method | Behavior |
| --- | --- |
| `open()` | Opens the panel (no-op when disabled) and focuses the search input. |
| `close()` | Closes the panel and returns focus to the field. |
| `clear()` | Clears the selection and fires `change` with an empty chain (`[]`). |

## API — Events

| Event | detail | Options |
| --- | --- | --- |
| `change` | The **selection tree** — a nested `{value, label, child:{…}}` object, root → leaf, one level per nesting (identical to the `selected-record` shape) | `bubbles: true, composed: true`. Fired ONLY on user selection or `clear()`, never when ODC rewrites the `selected-record` attribute. |

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

Out of scope by decision (see Decision log): multi-select, per-node disabled, node icons, open/close events, an error *message* attribute (the message stays in the Field Wrapper's light DOM).

## Example HTML

```html
<loop-multilevel-dropdown
  label="Region"
  placeholder="Select a country"
  selected-record=""
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
2. Create a Block `MultilevelDropdown` with inputs `Items` (Text — the JSON), `SelectedRecord` (Text — the nested selection JSON), `Placeholder`, `Label`, `ShowSearch` (Boolean), `SearchPlaceholder`, `NoResultsText`, `Disabled` (Boolean), `IsRequired` (Boolean), `IsInvalid` (Boolean) and event `OnChange` (Text payload = the selection record).
3. Place an HTML element `loop-multilevel-dropdown` and bind one attribute per input (ODC requires a Value expression on every attribute). Booleans are **value-aware**: `search = If(ShowSearch, "true", "false")`, `disabled = If(Disabled, "true", "false")`, `required = If(IsRequired, "true", "false")`, `invalid = If(IsInvalid, "true", "false")` — never presence-only.
4. Build the `Items` JSON in a data action or client logic (e.g. `JSONSerialize` over a nested structure, or a small loop over an Aggregate with parent references).
5. Wire the `change` CustomEvent in OnReady/OnDestroy — see the generated Event wiring section below. The wiring passes `JSON.stringify(e.detail)` so `OnChange` receives the **selection tree** as one Text payload — `JSONDeserialize` it into a nested Structure, one level per depth: `Selection { Value, Label, Child: Selection2 }`, `Selection2 { Value, Label, Child: Selection3 }`, `Selection3 { Value, Label }`. Descend `.Child` until it is empty to reach the selected leaf; the outer object is the root ancestor. `clear()` sends `null`.
   **Round-trip / preselect:** `selected-record` takes the **same shape**. To preselect, `JSONSerialize` a `Selection` structure (e.g. the one you stored from a prior `OnChange`) and bind it to `SelectedRecord` — one structure, both directions. The component matches the **full value path** (root→mid→leaf), so duplicate leaf values across branches resolve correctly. On user selection the component reflects `selected-record` before firing `OnChange`, so re-assigning the same string back is a no-op.
   **Careful — `Child`, not `Children`.** The selection is ONE path, so each level nests a single `Child` **object**. Do *not* reuse the `items` Structure (which nests a `Children` **list**) for this binding: that shape used to resolve to no selection, silently. It is now tolerated — a single-element `children` array is read as `child` — but the canonical `Selection` structure is still the shape to bind. A `children` array with 2+ entries is ambiguous: the component warns and takes the first.
6. Sizing: the component consumes `--loop-select-*`, so the shared `.loop-field--xlarge/large/regular/small` wrapper ramp re-scales the field, search row and tree rows automatically (custom properties inherit into shadow DOM). See **Sizing** above.
7. Labelling: give the HTML element an **Id/Name** and point a native Label widget at it (`for`), or use the `Label` input — never both. Set the Label's **Mandatory = True** and pass the same flag to `IsRequired`. See **Labelling** above.

## Accessibility (WCAG 2.2 AA)

- **Pattern:** combobox-with-tree-popup. Trigger button: `aria-haspopup="tree"`, `aria-expanded`, `aria-controls`; accessible name from `label` (`aria-labelledby`), else a bound native Label's text (`aria-label`), else the placeholder; `aria-required` / `aria-invalid` when those attributes are set. Search input: `role="combobox"`, `aria-autocomplete="list"`, `aria-controls` → tree, `aria-activedescendant` → the virtually focused row. Real focus stays in the input while the panel is open; arrows drive the virtual cursor. Rows: `role="treeitem"` with `aria-level` (1–3), `aria-expanded` on parents, `aria-selected` on leaves, children in `role="group"` lists. With `search="false"` the trigger carries `aria-activedescendant` itself.
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

## Troubleshooting — the two silent failures

Both traps below produce **no error, no console output, and no visual clue**. Both were hit for real on `WBG_POC3/NewCase`; check these first before suspecting the Web Component.

**1. "OnChange never fires."** Almost always the wiring is fine and the event name is not. Three things must agree:

1. the name in `$actions.<Event>(…)` in the OnReady JS,
2. the event declared on the Block, and
3. the event handled on the **screen**, at the Block instance.

An ODC block event that the parent screen does not handle is a **silent no-op** — `$actions.OnSelect(…)` still exists and still runs without throwing, it just goes nowhere. So "my listener runs" and "my handler runs" are two different claims; verify the second.

Confirm which events the parent actually handles, from DevTools on the screen:

```js
// lists the events the parent passes down — anything missing here is NOT handled
const e = document.querySelector('loop-multilevel-dropdown');
let f = e[Object.keys(e).find(k => k.startsWith('__reactFiber'))];
while (f && !(f.memoizedProps && f.memoizedProps.events)) f = f.return;
Object.keys(f.memoizedProps.events);   // e.g. ["_handleError", "onSelect$Action"]
```

`onSelect$Action` present ⇒ the screen handles `OnSelect`. If your OnReady JS raises `OnChange`, that is the bug — align the two names.

To confirm the component itself is emitting (it almost certainly is), attach your own listener and pick a leaf:

```js
document.querySelector('loop-multilevel-dropdown')
  .addEventListener('change', ev => console.log('detail', ev.detail));
```

**2. "The preselect doesn't show."** `SelectedRecord` is a **selection**, not a tree: each level nests a single `Child` **object**. Binding the `items` Structure (which nests a `Children` **list**) used to resolve to nothing at all. A single-element `children` array is now tolerated as an alias, so this shape works — but if the field stays on the placeholder, check that the record's `value` at every level actually matches the corresponding `items` value, and that the innermost record is a **leaf** (a path stopping on a node that has children is not a selection).

```js
// null ⇒ the path didn't resolve; '' ⇒ nothing selected
const e = document.querySelector('loop-multilevel-dropdown');
console.log(e.selectedRecord, '|', e.getAttribute('selected-record'));
```

**3. The open panel is cut off.** The panel renders inside the host — an ancestor with `overflow: hidden` (an OSUI `card`, for instance) clips it. See **Known limitation** at the top.

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
     SelectedRecord    : Text (JSON) : ""    // nested {value,label,child} selection record
     Placeholder       : Text        : "Select an option"
     Label             : Text        : ""
     ShowSearch        : Boolean     : True
     SearchPlaceholder : Text        : "Search"
     NoResultsText     : Text        : "No results found"
     Disabled          : Boolean     : False
     IsRequired        : Boolean     : False
     IsInvalid         : Boolean     : False
   and Block events: OnChange.
   Do NOT add a string Id input or set the element's id — OutSystems generates ids at
   runtime (see step 4 for addressing).

2. Place an HTML element <loop-multilevel-dropdown> in the Block. Set one attribute per input via a Value
   expression (ODC requires an expression on every attribute):
     items              = Items
     selected-record    = SelectedRecord
     placeholder        = Placeholder
     label              = Label
     search             = If(ShowSearch, "true", "false")
     search-placeholder = SearchPlaceholder
     no-results-text    = NoResultsText
     disabled           = If(Disabled, "true", "false")
     required           = If(IsRequired, "true", "false")
     invalid            = If(IsInvalid, "true", "false")
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
- **Record-based selection, replacing `selected-value` (breaking, 2026-07-21).** Preselection was a single leaf-value string (`selected-value`); the input side is now the **same nested `{value,label,child}` record** the `change`/`selectedRecord` output already carries. Requester-specified: store an `OnChange` record and bind it straight back to preselect — one shape, both directions. The attribute was renamed `selected-value` → `selected-record` and the `selectedValue` property dropped (not aliased) — a clean break was chosen over carrying two selection APIs. Resolution matches the **full value path** (root→mid→leaf), not just the leaf value, which disambiguates leaves that share a value across branches (the old leaf-value match silently picked the first). A stale/partial/non-leaf record resolves to no selection; `_selectedNode()` is memoised per (items src + record string).
- **Search in the panel** (not in-field) — the closed field must pixel-match the shipped Select; the Tags rebuild's field-side proxy input exists only to work around a VirtualSelect constraint this component doesn't have.
- **Combobox-with-tree-popup ARIA** — `role="tree"` over listbox+`aria-level` because collapse state needs the `aria-expanded` vocabulary; one combobox only (the search input), the trigger stays a plain disclosure button.
- **3-level cap** — deeper nesting is ignored, not an error (documented in the API table).
- ~~**No error-state attribute** — validation display belongs to the Field Wrapper pattern; kept out of this API.~~ **Reversed 2026-07-20.** The Field Wrapper renders the asterisk and message in the *light* DOM, and nothing crossed the shadow boundary — the field itself showed no error styling, and the trigger carried no `aria-required`/`aria-invalid`. `required` + `invalid` are now attributes. Still delegated: the error **message** (see below).
- **`invalid` is an input, never derived** — the component does not decide validity. OutSystems drives it, matching how the native widgets take `.not-valid` from form validation rather than computing it.
- **Form-associated for labelling, but no `setValidity()`** — `formAssociated` is adopted so the host is *labelable* (the only way a native `<label for>` can bind) and for `setFormValue()` participation. Constraint validation is deliberately not wired: ODC forms render `novalidate` and drive display from their own Valid property, so `setValidity()` would add a second, competing source of truth.
- **Error message stays in the light DOM (Field Wrapper keeps ownership)** — scope decision only. ⚠️ An earlier draft justified this by claiming `aria-describedby` "could not be associated with the trigger anyway"; **that is wrong** and has been corrected. Describedby cannot reference a *light-DOM* element from inside the shadow root, but an `error-text` rendered *inside* the shadow root would associate fine — same tree scope, exactly like the existing `aria-controls="lmdd-panel"`. See the open follow-up below.
- **Open follow-up (a11y, medium): `invalid` announces "invalid" with no reason.** The trigger carries `aria-invalid` but the message is unassociated, so screen-reader users hear the name plus "invalid entry" and never why — a regression against the native OSUI Select, which wires describedby to its input. Recommended fix: an `error-text` attribute rendered in-shadow with an internal `aria-describedby`. Raised by `@checker` 2026-07-20, deferred as out of the approved scope, not refuted.
- **No `size` attribute** — the `.loop-field--*` wrapper ramp already scales the component through inherited custom properties; a second mechanism would need keeping in sync. The panel metrics derive from `--loop-select-h` at `:host` (a `:root` derivation would freeze at 40px, since `var()` in a custom property is substituted where declared).
- **Full list re-render per state change** — dropdown-scale data; a delegated listener set on the shadow root survives `innerHTML` swaps. The search input lives in the skeleton (not the list) so typing never destroys it.
- **Panel inside the host, no body-append** — keeps the component self-contained (no scroll/reposition mirroring); the overflow-hidden clipping trade-off is documented above.
