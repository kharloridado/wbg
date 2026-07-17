/* ============================================
   Component: <loop-ag-grid-pagination>  ("The Loop" numbered pager for AGGrid_Lib)
   Figma: -The Loop- Main Library · "-loop pagination" [node:27044-57397]
          · ref loop/refs/cmp-ag-grid-pagination/
          · base component variants (labeled / jump / go-to / sizes): node 23714:3726
   Why: AG Grid Community's native paging panel is arrows + "x to y of z" — its DOM
        cannot render the design's numbered page chips. This LIGHT-DOM Web Component
        renders the `.loop-pagination` BEM structure (styled entirely by
        src/blocks/loop-pagination.css — block styles + light-DOM glue) below the grid
        and drives it through the AG Grid pagination API. It exposes every option of
        the base Loop pagination component (built for the native OutSystems
        Pagination widget), not just the AG-frame default.
   Light DOM on purpose: the block CSS and the app's icon font must reach the markup
        (shadow DOM would wall off both — see shadow-dom-gotchas).
   Usage (ODC Block wrapper):
        <loop-ag-grid-pagination grid-api="AgGridAPI" page-sizes="10,20,50,100">
        </loop-ag-grid-pagination>
        Grid options: pagination=true, suppressPaginationPanel=true. Page-size
        switching also needs every offered size accepted by the grid — set
        paginationPageSizeSelector to the same list (or false) or AG logs #94/#95.
   Attributes (defaults reproduce the AG Grid footer frame 27044-57397 exactly):
        grid-api    global name (or dot-path) of the AG Grid API the lib exposes.
                    Default "AgGridAPI". setApi(api) is the programmatic alternative.
        page-sizes  comma-separated items-per-page options. Default "20,50,100".
        size        "large" (default, 48px — the AG footer scale) | "regular" (40px)
                    | "small" (32px). Maps to the .loop-pagination--* size modifier.
        nav         "pages" (default) numbered chips + ellipsis windowing
                    | "jump"  First/Prev + page input + "of N pages" + Next/Last
                    | "goto"  compact standalone `Go to [select] page` (suits modest
                      page counts — every page is an <option>; prefer "jump" for
                      very large totals).
        button-labels        boolean, default false. true = labeled First/Prev/
                    Next/Last buttons (base component's labeled variant); false =
                    icon-only (--simple). Applies to nav="pages" and nav="jump".
        show-items-per-page  boolean, default true. Right-rail items-per-page select.
        show-summary         boolean, default true. Right-rail "Showing X-Y of Z".
        divider              boolean, default false. Hairline between the two
                    right-rail sections when both are visible.
        Booleans are VALUE-aware (ODC binds If(Flag,"true","false")): absent → the
        default; "false"/"0" → off; anything else (incl. "") → on.
   Events (bubbles, composed — for the ODC wrapper's handlers):
        loop-pagination-changed  detail: { page (1-based), pageSize, total }
   Escalation Level: L5 (custom build — vanilla JS Web Component, no framework)
============================================ */
(function () {
  'use strict';

  var ICONS = {
    first: 'fa fa-solid fa-angle-left',
    prev:  'fa fa-solid fa-angle-left',
    next:  'fa fa-solid fa-angle-right',
    last:  'fa fa-solid fa-angle-right',
    down:  'fa fa-solid fa-angle-down'
  };

  /* Visible text of the labeled variant (base component, node 23714:3726). */
  var LABELS = { first: 'First', prev: 'Prev', next: 'Next', last: 'Last' };

  function resolveGlobal(path) {
    var obj = window;
    var parts = (path || '').split('.');
    for (var i = 0; i < parts.length; i++) {
      if (!obj || !parts[i]) { return null; }
      obj = obj[parts[i]];
    }
    return obj && typeof obj.paginationGoToPage === 'function' ? obj : null;
  }

  /* Windowed page list, matching the Figma layout (1 2 3 … 48):
     always first + last, current ±1, '…' for gaps. Returns numbers + '…'. */
  function pageWindow(current, total) {
    if (total <= 7) {
      return Array.from({ length: total }, function (_, i) { return i + 1; });
    }
    var pages = [1];
    var lo = Math.max(2, current - 1);
    var hi = Math.min(total - 1, current + 1);
    if (current <= 3) { lo = 2; hi = 3; }                 /* 1 2 3 … N   */
    if (current >= total - 2) { lo = total - 2; hi = total - 1; }
    if (lo > 2) { pages.push('…'); }
    for (var p = lo; p <= hi; p++) { pages.push(p); }
    if (hi < total - 1) { pages.push('…'); }
    pages.push(total);
    return pages;
  }

  class LoopAgGridPagination extends HTMLElement {
    constructor() {
      super();
      this._api = null;
      this._pollTimer = null;
      this._onPaginationChanged = this._handlePaginationChanged.bind(this);
      /* Delegated on the host — they survive every innerHTML re-render, so the
         conditional sections (jump input, goto select, right rail) never need
         per-render rebinding. */
      this.addEventListener('click', this._handleClick.bind(this));
      this.addEventListener('change', this._handleChange.bind(this));
      this.addEventListener('keydown', this._handleKeydown.bind(this));
    }

    static get observedAttributes() {
      return ['grid-api', 'page-sizes', 'size', 'nav', 'button-labels',
              'show-items-per-page', 'show-summary', 'divider'];
    }

    attributeChangedCallback(name) {
      if (!this.isConnected) { return; }
      /* Only a grid-api change needs the (re)poll; the rest are display options. */
      if (name === 'grid-api') { this._connectApi(); }
      else if (this._api) { this._render(); }
    }

    connectedCallback() { this._connectApi(); }

    disconnectedCallback() {
      clearInterval(this._pollTimer);
      if (this._api && this._api.removeEventListener) {
        this._api.removeEventListener('paginationChanged', this._onPaginationChanged);
      }
      this._api = null;
    }

    /* Programmatic wiring for wrappers that hold the api in scope. */
    setApi(api) {
      if (!api || typeof api.paginationGoToPage !== 'function') { return; }
      this._attach(api);
    }

    get _pageSizes() {
      return (this.getAttribute('page-sizes') || '20,50,100')
        .split(',')
        .map(function (s) { return parseInt(s.trim(), 10); })
        .filter(function (n) { return n > 0; });
    }

    /* Value-aware boolean: ODC binds attrs with a forced value (If(Flag,"true","false")),
       so presence-based hasAttribute() would read a bound "false" as true. See
       web-component-boolean-attrs-odc. */
    _boolAttr(name, dflt) {
      var v = this.getAttribute(name);
      if (v === null) { return dflt; }
      return v !== 'false' && v !== '0';
    }

    /* "large" is the AG-footer default (frozen ref 27044-57397); "regular" is the
       base component's unmodified 40px scale; "small" the 32px dashboards scale. */
    get _sizeClass() {
      var v = this.getAttribute('size');
      if (v === 'small')   { return ' loop-pagination--small'; }
      if (v === 'regular') { return ''; }
      return ' loop-pagination--large';
    }

    get _nav()          { return this.getAttribute('nav') || 'pages'; }
    get _labeled()      { return this._boolAttr('button-labels', false); }
    get _showSizes()    { return this._boolAttr('show-items-per-page', true); }
    get _showSummary()  { return this._boolAttr('show-summary', true); }
    get _divider()      { return this._boolAttr('divider', false); }

    /* Grids init async in ODC — poll briefly for the global. */
    _connectApi() {
      clearInterval(this._pollTimer);
      var name = this.getAttribute('grid-api') || 'AgGridAPI';
      var self = this;
      var tries = 0;
      var attempt = function () {
        var api = resolveGlobal(name);
        if (api) { clearInterval(self._pollTimer); self._attach(api); }
        else if (++tries > 50) { clearInterval(self._pollTimer); }
      };
      attempt();
      if (!this._api) { this._pollTimer = setInterval(attempt, 200); }
    }

    _attach(api) {
      if (this._api === api) { this._render(); return; }
      if (this._api && this._api.removeEventListener) {
        this._api.removeEventListener('paginationChanged', this._onPaginationChanged);
      }
      this._api = api;
      if (api.addEventListener) {
        api.addEventListener('paginationChanged', this._onPaginationChanged);
      }
      this._render();
    }

    /* AG Grid's own paginationChanged fires for grid-driven changes too (e.g. a
       filter reducing the row count), not just clicks/size-select made through
       this component — re-render AND re-emit so loop-pagination-changed reflects
       those the same way, matching the documented event contract. */
    _handlePaginationChanged() {
      this._render();
      this._emit();
    }

    _emit() {
      var api = this._api;
      this.dispatchEvent(new CustomEvent('loop-pagination-changed', {
        bubbles: true,
        composed: true,
        detail: {
          page: api.paginationGetCurrentPage() + 1,
          pageSize: api.paginationGetPageSize(),
          total: api.paginationGetTotalPages()
        }
      }));
    }

    /* AG Grid's pagination API calls below dispatch its native 'paginationChanged'
       event synchronously, which _handlePaginationChanged already re-renders +
       re-emits on — no separate this._emit() here, or every user click would
       fire loop-pagination-changed twice. */
    _handleClick(ev) {
      var btn = ev.target.closest('[data-nav],[data-page]');
      if (!btn || !this._api || btn.hasAttribute('disabled')) { return; }
      var api = this._api;
      if (btn.dataset.page) {
        api.paginationGoToPage(parseInt(btn.dataset.page, 10) - 1);
      } else if (btn.dataset.nav === 'first') { api.paginationGoToFirstPage(); }
      else if (btn.dataset.nav === 'prev')  { api.paginationGoToPreviousPage(); }
      else if (btn.dataset.nav === 'next')  { api.paginationGoToNextPage(); }
      else if (btn.dataset.nav === 'last')  { api.paginationGoToLastPage(); }
    }

    _handleChange(ev) {
      if (!this._api) { return; }
      var t = ev.target;
      if (t.hasAttribute('data-size')) {
        this._api.setGridOption('paginationPageSize', parseInt(t.value, 10));
      } else if (t.hasAttribute('data-goto')) {
        this._api.paginationGoToPage(parseInt(t.value, 10) - 1);
      } else if (t.hasAttribute('data-jump')) {
        this._jumpTo(t.value);
      }
    }

    _handleKeydown(ev) {
      if (ev.key === 'Enter' && ev.target.hasAttribute('data-jump')) {
        this._jumpTo(ev.target.value);
      }
    }

    /* Jump input: clamp to 1..total. Same-page (or invalid) entries won't make AG
       fire paginationChanged, so re-render explicitly to normalize the display. */
    _jumpTo(raw) {
      var api = this._api;
      var total = Math.max(api.paginationGetTotalPages(), 1);
      var current = api.paginationGetCurrentPage() + 1;
      var n = parseInt(raw, 10);
      if (isNaN(n)) { this._render(); return; }
      n = Math.min(Math.max(n, 1), total);
      if (n === current) { this._render(); return; }
      api.paginationGoToPage(n - 1);
    }

    _navBtn(kind, ariaLabel, disabled, edge) {
      var labeled = this._labeled;
      var iconFirst = kind === 'first' || kind === 'prev';
      var btnClass = 'loop-pagination__btn ' + (labeled
        ? (iconFirst ? 'loop-pagination__btn--icon-first' : 'loop-pagination__btn--icon-last')
        : 'loop-pagination__btn--icon-only');
      var icon = '<span class="loop-pagination__icon' +
        (edge ? ' loop-pagination__icon--' + edge : '') + '">' +
        '<i class="' + ICONS[kind] + '" aria-hidden="true"></i></span>';
      var label = labeled
        ? '<span class="loop-pagination__btn-label">' + LABELS[kind] + '</span>'
        : '';
      return '<button type="button" class="' + btnClass +
        (disabled ? ' loop-pagination__btn--disabled' : '') +
        '" data-nav="' + kind + '" aria-label="' + ariaLabel + '"' +
        (disabled ? ' disabled' : '') + '>' +
        (iconFirst ? icon + label : label + icon) + '</button>';
    }

    /* ---- Left-side nav renderers (one per `nav` option) ---- */

    _renderPagesNav(page, total) {
      var pages = pageWindow(page, total).map(function (p) {
        if (p === '…') { return '<span class="loop-pagination__ellipsis" aria-hidden="true">...</span>'; }
        var active = p === page;
        return '<button type="button" class="loop-pagination__page' +
          (active ? ' loop-pagination__page--active" aria-current="page' : '') +
          '" data-page="' + p + '" aria-label="Page ' + p + '">' + p + '</button>';
      }).join('');
      /* --simple = the icon-only pages layout; the labeled layout is the plain nav. */
      return '<div class="loop-pagination__nav' +
          (this._labeled ? '' : ' loop-pagination__nav--simple') + '">' +
        this._navBtn('first', 'First page', page <= 1, 'edge-first') +
        this._navBtn('prev', 'Previous page', page <= 1) +
        pages +
        this._navBtn('next', 'Next page', page >= total) +
        this._navBtn('last', 'Last page', page >= total, 'edge-last') +
        '</div>';
    }

    _renderJumpNav(page, total) {
      return '<div class="loop-pagination__nav loop-pagination__nav--jump">' +
        this._navBtn('first', 'First page', page <= 1, 'edge-first') +
        this._navBtn('prev', 'Previous page', page <= 1) +
        '<div class="loop-pagination__goto">' +
          '<input type="text" inputmode="numeric" class="loop-pagination__input ' +
            'loop-pagination__input--jump" value="' + page + '" data-jump ' +
            'aria-label="Page number">' +
          '<span class="loop-pagination__label">of ' + total + ' pages</span>' +
        '</div>' +
        this._navBtn('next', 'Next page', page >= total) +
        this._navBtn('last', 'Last page', page >= total, 'edge-last') +
        '</div>';
    }

    _renderGotoNav(page, total) {
      var options = '';
      for (var p = 1; p <= total; p++) {
        options += '<option value="' + p + '"' + (p === page ? ' selected' : '') + '>' + p + '</option>';
      }
      return '<div class="loop-pagination__goto">' +
        '<span class="loop-pagination__label">Go to</span>' +
        '<span class="loop-pagination__select">' +
          '<select class="loop-pagination__input" data-goto aria-label="Go to page">' + options + '</select>' +
          '<span class="loop-pagination__select-chevron"><i class="' + ICONS.down + '" aria-hidden="true"></i></span>' +
        '</span>' +
        '<span class="loop-pagination__label">page</span>' +
        '</div>';
    }

    /* ---- Right-side controls rail (items-per-page · divider · summary) ---- */
    _renderControls(size, from, to, rows) {
      var showSizes = this._showSizes;
      var showSummary = this._showSummary;
      if (!showSizes && !showSummary) { return ''; }

      var parts = [];
      if (showSizes) {
        var sizes = this._pageSizes;
        if (sizes.indexOf(size) === -1) { sizes = sizes.concat([size]).sort(function (a, b) { return a - b; }); }
        var options = sizes.map(function (s) {
          return '<option value="' + s + '"' + (s === size ? ' selected' : '') + '>' + s + '</option>';
        }).join('');
        parts.push('<div class="loop-pagination__items-per-page">' +
          '<span class="loop-pagination__label">items per page</span>' +
          '<span class="loop-pagination__select">' +
            '<select class="loop-pagination__input" data-size aria-label="Items per page">' + options + '</select>' +
            '<span class="loop-pagination__select-chevron"><i class="' + ICONS.down + '" aria-hidden="true"></i></span>' +
          '</span>' +
          '</div>');
      }
      if (showSizes && showSummary && this._divider) {
        parts.push('<span class="loop-pagination__divider" aria-hidden="true"></span>');
      }
      if (showSummary) {
        parts.push('<span class="loop-pagination__showing">Showing ' +
          '<span class="loop-pagination__showing-count">' + from + '-' + to + '</span> of ' +
          '<span class="loop-pagination__showing-count">' + rows + '</span>' +
          '</span>');
      }
      return '<div class="loop-pagination__controls">' + parts.join('') + '</div>';
    }

    _render() {
      var api = this._api;
      if (!api) { return; }
      var page = api.paginationGetCurrentPage() + 1;     /* AG is 0-based */
      var total = Math.max(api.paginationGetTotalPages(), 1);
      var size = api.paginationGetPageSize();
      var rows = api.paginationGetRowCount();
      var from = rows === 0 ? 0 : (page - 1) * size + 1;
      var to = Math.min(page * size, rows);

      var nav = this._nav === 'jump' ? this._renderJumpNav(page, total)
              : this._nav === 'goto' ? this._renderGotoNav(page, total)
              : this._renderPagesNav(page, total);

      this.innerHTML =
        '<nav class="loop-pagination' + this._sizeClass + '" aria-label="Pagination">' +
          nav +
          this._renderControls(size, from, to, rows) +
        '</nav>';
    }
  }

  if (!customElements.get('loop-ag-grid-pagination')) {
    customElements.define('loop-ag-grid-pagination', LoopAgGridPagination);
  }
})();
