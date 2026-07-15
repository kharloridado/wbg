/* ============================================
   Component: <loop-ag-grid-pagination>  ("The Loop" numbered pager for AGGrid_Lib)
   Figma: -The Loop- Main Library · "-loop pagination" [node:27044-57397]
          · ref loop/refs/cmp-ag-grid-pagination/
   Why: AG Grid Community's native paging panel is arrows + "x to y of z" — its DOM
        cannot render the design's numbered page chips. This LIGHT-DOM Web Component
        renders the `.loop-pagination.loop-pagination--large` BEM structure (styled by
        src/blocks/loop-pagination.css + loop-ag-grid-pagination.css) below the grid
        and drives it through the AG Grid pagination API.
   Light DOM on purpose: the block CSS and the app's icon font must reach the markup
        (shadow DOM would wall off both — see shadow-dom-gotchas).
   Usage (ODC Block wrapper):
        <loop-ag-grid-pagination grid-api="AgGridAPI" page-sizes="10,20,50,100">
        </loop-ag-grid-pagination>
        Grid options: pagination=true, suppressPaginationPanel=true. Page-size
        switching also needs every offered size accepted by the grid — set
        paginationPageSizeSelector to the same list (or false) or AG logs #94/#95.
   Attributes:
        grid-api    global name (or dot-path) of the AG Grid API the lib exposes.
                    Default "AgGridAPI". setApi(api) is the programmatic alternative.
        page-sizes  comma-separated items-per-page options. Default "20,50,100".
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
      this._onPaginationChanged = this._render.bind(this);
      this._onClick = this._handleClick.bind(this);
      this._onSizeChange = this._handleSizeChange.bind(this);
    }

    static get observedAttributes() { return ['grid-api', 'page-sizes']; }

    attributeChangedCallback() {
      if (this.isConnected) { this._connectApi(); }
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
      this._emit();
    }

    _handleSizeChange(ev) {
      if (!this._api) { return; }
      this._api.setGridOption('paginationPageSize', parseInt(ev.target.value, 10));
      this._emit();
    }

    _navBtn(kind, label, disabled, edge) {
      return '<button type="button" class="loop-pagination__btn loop-pagination__btn--icon-only' +
        (disabled ? ' loop-pagination__btn--disabled' : '') +
        '" data-nav="' + kind + '" aria-label="' + label + '"' +
        (disabled ? ' disabled' : '') + '>' +
        '<span class="loop-pagination__icon' + (edge ? ' loop-pagination__icon--' + edge : '') + '">' +
        '<i class="' + ICONS[kind] + '" aria-hidden="true"></i></span></button>';
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
      var sizes = this._pageSizes;
      if (sizes.indexOf(size) === -1) { sizes = sizes.concat([size]).sort(function (a, b) { return a - b; }); }

      var pages = pageWindow(page, total).map(function (p) {
        if (p === '…') { return '<span class="loop-pagination__ellipsis" aria-hidden="true">...</span>'; }
        var active = p === page;
        return '<button type="button" class="loop-pagination__page' +
          (active ? ' loop-pagination__page--active" aria-current="page' : '') +
          '" data-page="' + p + '" aria-label="Page ' + p + '">' + p + '</button>';
      }).join('');

      var options = sizes.map(function (s) {
        return '<option value="' + s + '"' + (s === size ? ' selected' : '') + '>' + s + '</option>';
      }).join('');

      this.innerHTML =
        '<nav class="loop-pagination loop-pagination--large" aria-label="Pagination">' +
          '<div class="loop-pagination__nav loop-pagination__nav--simple">' +
            this._navBtn('first', 'First page', page <= 1, 'edge-first') +
            this._navBtn('prev', 'Previous page', page <= 1) +
            pages +
            this._navBtn('next', 'Next page', page >= total) +
            this._navBtn('last', 'Last page', page >= total, 'edge-last') +
          '</div>' +
          '<div class="loop-pagination__controls">' +
            '<div class="loop-pagination__items-per-page">' +
              '<span class="loop-pagination__label">items per page</span>' +
              '<span class="loop-pagination__select">' +
                '<select class="loop-pagination__input" aria-label="Items per page">' + options + '</select>' +
                '<span class="loop-pagination__select-chevron"><i class="' + ICONS.down + '" aria-hidden="true"></i></span>' +
              '</span>' +
            '</div>' +
            '<span class="loop-pagination__showing">Showing ' +
              '<span class="loop-pagination__showing-count">' + from + '-' + to + '</span> of ' +
              '<span class="loop-pagination__showing-count">' + rows + '</span>' +
            '</span>' +
          '</div>' +
        '</nav>';

      this.querySelector('.loop-pagination__nav').addEventListener('click', this._onClick);
      this.querySelector('select').addEventListener('change', this._onSizeChange);
    }
  }

  if (!customElements.get('loop-ag-grid-pagination')) {
    customElements.define('loop-ag-grid-pagination', LoopAgGridPagination);
  }
})();
