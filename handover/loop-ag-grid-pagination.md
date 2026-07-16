# Handover — loop-ag-grid-pagination (custom Web Component)

The Loop **AG Grid pagination** — a numbered pager (page chips, first/prev/next/last, an
items-per-page control, and a "Showing X-Y of Z" summary) that drives AG Grid Community v33's
pagination API directly, since AG's own native paging panel (arrows + "x to y of z") cannot
render the design's numbered-chip look. Figma: "-loop pagination" [node 27044-57397], the
footer inside the AG Grid frame — frozen ref `loop/refs/cmp-ag-grid-pagination/`.

**Approach:** Custom component — light-DOM (not Shadow DOM) vanilla JS Web Component, tag
`<loop-ag-grid-pagination>`, wrapped in an OutSystems Block. Light DOM on purpose: the app's
Theme CSS and self-hosted icon font need to reach the generated markup, which a Shadow DOM
boundary would wall off. It renders the shared `.loop-pagination` BEM block (the same
component built earlier for node 23714-3726) at its **large** (48px / 16px) size, and reads/
drives the grid purely through the AG Grid JS pagination API — no server round-trip.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the AG Grid Pagination page.

**What it is.** A numbered pagination bar sized for the AG Grid footer (48px controls, 16px
type), addressable by pointing it at the grid's exposed API object.

**When to use**
- Below any `AGGrid_Lib` grid instance where the Figma numbered-pager look is required
  instead of AG's native arrows + "x to y of z" paging panel.

**When not to use** (reach for instead)
- A plain native **Table** (no AG Grid) → the base `.loop-pagination` / `.loop-pagination--small`
  component directly on the OutSystems Pagination widget — no Web Component needed.
- Any grid that keeps AG's native paging panel visible — don't place both; hide AG's panel
  with `suppressPaginationPanel: true` (see wiring below).

**How to use**
- Place one `<loop-ag-grid-pagination>` element below the grid's `AGGrid_Lib` block, on the
  same screen. Set `grid-api` to the global (or dot-path) name the grid exposes its AG Grid
  API as, and `page-sizes` to the items-per-page options to offer.
- The component polls briefly for the API global at connect (grids in ODC initialize async),
  attaches once found, and re-renders on every AG `paginationChanged` event — so it always
  reflects the grid's real current page/size/row-count.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-pagination.css` | Theme CSS — paste below OutSystems UI (shared pagination block styles; adds the `.loop-pagination--large` 48px size used here) |
| `src/components/loop-ag-grid-pagination.js` | Script resource (Theme/Library), Include = **Always** |
| `src/components/loop-ag-grid-pagination.css` | Theme CSS — paste below OutSystems UI (component glue styles — native `<select>` chrome + the first/last edge-bar glyphs) |

> Canonical source lives in the three files above; they are embedded into this ticket by
> `node build/embed-handover-code.mjs` — re-run after editing a source file to keep them in sync.

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-pagination.css</code> → Theme CSS — paste below OutSystems UI (shared pagination block styles)</summary>

```css
/* loop-pagination.css -- Pagination component (BEM block: .loop-pagination).
 * Implements the Figma -loop pagination design (node 23714:3726).
 * Applied via ExtendedClass on the OutSystems Pagination widget. */

/* ---- Outer wrapper: left nav + right controls ---- */
.loop-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xxsmall);
  font-family: var(--font-family-body);
}

/* ---- Small size (Figma 23714-3840 "Small", node 26629:59237) ----
   Used in AG-grid dashboard apps. Re-declares the size custom properties;
   every rule below reads them via var(), so the whole block scales down
   (mirrors Figma's Component-Sizes mode axis). 13px / 10px have no primitive
   token — same raw-px convention as .loop-field--small in loop-text-field.css. */
.loop-pagination--small {
  --loop-pagination-btn-height:      var(--space-medium);  /* 40 -> 32 */
  --loop-pagination-font-size:       13px;                 /* 14 -> 13 (no token) */
  --loop-pagination-pages-font-size: 13px;                 /* 14 -> 13 (no token) */
  --loop-pagination-gap-labeled:     var(--space-tiny);    /* 8 -> 4 */
  --loop-pagination-gap-items:       var(--space-tiny);    /* 8 -> 4 */
  --loop-pagination-gap-right:       var(--space-xsmall);  /* 14 -> 12 */
  --loop-pagination-padding-icon:    var(--space-tiny);    /* 6 -> 4 */
  --loop-pagination-padding-label:   10px;                 /* 12 -> 10 (no token) */
}

/* ---- Large size (Figma 27044-57397 — the AG Grid footer pager) ----
   48px controls / 16px type, ref loop/refs/cmp-ag-grid-pagination/. Same
   re-declare-the-custom-props pattern as --small. NOTE: the Figma "Small"
   description says it's the AG-grid size, but the AG Grid frame itself
   instantiates THIS 48px scale — the frame wins (see the ref's spec.md). */
.loop-pagination--large {
  --loop-pagination-btn-height:      var(--space-xlarge);   /* 40 -> 48 */
  --loop-pagination-font-size:       var(--font-size-300);  /* 14 -> 16 */
  --loop-pagination-pages-font-size: var(--font-size-300);  /* 14 -> 16 */
  --loop-pagination-gap-items:       var(--space-xsmall);   /* 8 -> 12 */
  --loop-pagination-gap-right:       var(--space-small);    /* 14 -> 16 */
}
/* Input h-padding grows with the scale (Figma h-padding-left-side = 12) */
.loop-pagination--large .loop-pagination__input {
  padding: 0 var(--space-xsmall);
}

/* ---- Left-side nav strip ---- */
.loop-pagination__nav {
  display: flex;
  flex: 1 0 0;
  align-items: center;
  gap: var(--loop-pagination-gap-labeled);
  min-width: 0;
}
.loop-pagination__nav--simple {
  gap: var(--loop-pagination-gap-simple);
}
.loop-pagination__nav--jump {
  justify-content: center;
}

/* ---- Prev/Next/First/Last control buttons ---- */
.loop-pagination__btn {
  display: inline-flex;
  align-items: center;
  height: var(--loop-pagination-btn-height);
  padding: 0;
  border: 0;
  border-radius: var(--radius-pill);
  background: transparent;
  cursor: pointer;
  color: var(--color-text-on-light-link-primary-enabled);
  text-decoration: none;
  white-space: nowrap;
}
/* Hover = filled bright-blue pill (Figma 23714-1496: Background/Container/On
   Light/Link/Primary/Hover = blue-40 #169af3). Blue/70 text on that fill is
   only 3.4:1 (fails AA) — same precedent as the Button hover fix (FND-014):
   use the on-light-emphasis (Blue/90) tone instead, which passes at 5.75:1.
   The label and icon both inherit color, so setting it here flips both. */
.loop-pagination__btn:hover:not(.loop-pagination__btn--disabled) {
  background-color: var(--color-bg-link-primary-hover);
  color: var(--color-text-on-light-emphasis);
}
/* icon-first: |< First, < Prev -- icon padding left, label padding right */
.loop-pagination__btn--icon-first {
  padding-left: var(--loop-pagination-padding-icon);
  padding-right: var(--loop-pagination-padding-label);
}
/* icon-last: Next >, Last >| -- label padding left, icon padding right */
.loop-pagination__btn--icon-last {
  padding-left: var(--loop-pagination-padding-label);
  padding-right: var(--loop-pagination-padding-icon);
}
/* icon-only: simple variant, 40x40 centred */
.loop-pagination__btn--icon-only {
  width: var(--loop-pagination-btn-height);
  justify-content: center;
}
.loop-pagination__btn--disabled,
.loop-pagination__btn[disabled] {
  color: var(--color-text-on-light-state-disabled);
  cursor: not-allowed;
  pointer-events: none;
}

/* ---- Icon slot (28x22 container, 20x20 icon) ---- */
.loop-pagination__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 28px;
  height: 22px;
  padding: 2px;
  color: inherit;
}
.loop-pagination__icon .icon,
.loop-pagination__icon .loop-icon,
.loop-pagination__icon svg {
  width: 20px;
  height: 20px;
  color: inherit;
}
.loop-pagination__btn--disabled .loop-pagination__icon {
  color: var(--color-icon-on-light-alpha-disable);
}

/* ---- Button text label ---- */
.loop-pagination__btn-label {
  font-size: var(--loop-pagination-font-size);
  font-weight: var(--font-weight-semibold);
  color: inherit;
}

/* ---- Page number chips ---- */
.loop-pagination__page {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: var(--loop-pagination-btn-height);
  height: var(--loop-pagination-btn-height);
  border: 0;
  border-radius: var(--loop-pagination-page-radius);
  background: transparent;
  cursor: pointer;
  font-size: var(--loop-pagination-font-size);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-on-light-link-primary-enabled);
  text-decoration: none;
}
.loop-pagination__page:hover {
  background-color: var(--color-bg-link-primary-hover);
  color: var(--color-text-on-light-emphasis);
}
/* Active/selected page: pill border. Numeral drops to Regular — a local
   override on the shared SemiBold page-number style, verified in the AG-grid
   pagination ref (Figma 27044-57397). */
.loop-pagination__page--active {
  border: 2px solid var(--color-outline-on-light-link-enabled);
  border-radius: var(--radius-pill);
  font-weight: var(--font-weight-regular);
}

/* ---- Ellipsis between page ranges ---- */
.loop-pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: var(--loop-pagination-btn-height);
  height: var(--loop-pagination-btn-height);
  pointer-events: none;
  font-size: var(--loop-pagination-font-size);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-on-light-link-primary-enabled);
}

/* ---- Right-side controls rail ---- */
.loop-pagination__controls {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--loop-pagination-gap-right);
}

/* ---- Items-per-page row ---- */
.loop-pagination__items-per-page {
  display: flex;
  align-items: center;
  gap: var(--loop-pagination-gap-items);
}

/* ---- Go-to-page row ---- */
.loop-pagination__goto {
  display: flex;
  align-items: center;
  gap: var(--loop-pagination-gap-items);
}

/* ---- Input / select (items per page, go-to) — shared base ---- */
.loop-pagination__input {
  display: flex;
  align-items: center;
  height: var(--loop-pagination-btn-height);
  max-width: 85px;                 /* compact fixed cap */
  padding: 0 var(--space-xxsmall);
  border: var(--border-size-s) solid var(--color-outline-on-light-subdued);
  border-radius: var(--loop-pagination-input-radius);
  background-color: var(--color-bg-container-on-light-low);
  font-family: var(--font-family-body);
  font-size: var(--loop-pagination-font-size);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-on-light-default);
  text-align: center;              /* centre the value */
}
.loop-pagination__input:focus {
  outline: 2px solid var(--color-outline-on-light-link-focused, var(--color-blue-50));
  outline-offset: 2px;
}

/* ---- Items-per-page dropdown (native OSUI Dropdown = .dropdown-container) ----
   The visible box is the .dropdown-display (a <select> OR a <div>), styled by
   loop-dropdown.css at specificity (0,3,1). The rules below match that and load
   later, so they win — targeting .dropdown-display keeps them robust regardless
   of where the ExtendedClass lands. */

/* One chevron only: keep OSUI's container chevron (repositioned), and drop
   loop-dropdown's display chevron so the <div> display form never doubles up.
   Mirrors loop-dropdown's .dropdown-container.dropdown selector + this scope so
   it out-specifies (0,4,2 > 0,3,2). */
.loop-pagination__items-per-page .dropdown-container::after {
  right: 11px;
}
.loop-pagination__items-per-page .dropdown-container.dropdown > div.dropdown-display::after,
.loop-pagination__items-per-page .dropdown-container.dropdown > select.dropdown-display::after {
  content: none;
}

/* Grey treatment + pagination type scale + chevron clearance, on both display
   forms. Grey matches the go-to input (dropdown otherwise inherits white bg +
   default border from loop-dropdown.css). */
.loop-pagination__items-per-page .dropdown-container.dropdown > div.dropdown-display,
.loop-pagination__items-per-page .dropdown-container.dropdown > select.dropdown-display {
  max-width: 85px;
  padding-right: var(--space-medium);   /* 32px — clears the chevron */
  padding-left: var(--space-small);     /* 16px */
  background-color: var(--color-bg-container-on-light-low);
  border-color: var(--color-outline-on-light-subdued);
  color: var(--color-text-on-light-default);
  font-size: var(--loop-pagination-font-size);   /* 14px */
  font-weight: var(--font-weight-semibold);      /* 600 */
  text-align: center;
}

/* ---- Helper text (items per page, go-to, of X pages) ---- */
.loop-pagination__label {
  font-size: var(--loop-pagination-pages-font-size);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-on-light-default);
  white-space: nowrap;
}

/* ---- Showing X-Y of Z (right-rail summary) ---- */
.loop-pagination__showing {
  font-size: var(--loop-pagination-pages-font-size);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-on-light-default);
  white-space: nowrap;
}
/* Numeric ranges (1-20) and total (500): Bold, 14px per Figma (23714-1496) —
   reads var(--loop-pagination-pages-font-size) so it scales with --small/--large
   like the sibling .loop-pagination__label (was hardcoded to 14px, so it stayed
   14px instead of 16px under --large — see loop/refs/cmp-ag-grid-pagination). */
.loop-pagination__showing-count {
  font-size: var(--loop-pagination-pages-font-size);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-on-light-default);
}

/* ---- Vertical hairline divider between right-rail sections ---- */
.loop-pagination__divider {
  flex: 0 0 auto;
  width: var(--border-size-s);
  height: var(--space-regular);
  background-color: var(--color-outline-on-light-subdued);
}

/* ---- Focus rings ---- */
.loop-pagination__btn:focus-visible,
.loop-pagination__page:focus-visible,
.has-accessible-features .loop-pagination__btn:focus,
.has-accessible-features .loop-pagination__page:focus {
  outline: 2px solid var(--color-outline-on-light-link-focused, var(--color-blue-50));
  outline-offset: 2px;
}

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .loop-pagination__btn,
  .loop-pagination__page,
  .loop-pagination__input {
    transition: none;
  }
}
```

</details>
<details>
<summary><code>loop-ag-grid-pagination.js</code> → Script resource (Theme/Library), Include = Always</summary>

```js
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
      this._onPaginationChanged = this._handlePaginationChanged.bind(this);
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

    _handleSizeChange(ev) {
      if (!this._api) { return; }
      this._api.setGridOption('paginationPageSize', parseInt(ev.target.value, 10));
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
```

</details>
<details>
<summary><code>loop-ag-grid-pagination.css</code> → Theme CSS — paste below OutSystems UI (component glue styles)</summary>

```css
/* ============================================
   Component: <loop-ag-grid-pagination> — glue styles only
   Figma: "-loop pagination" [node:27044-57397] · ref loop/refs/cmp-ag-grid-pagination/
   The look lives in src/blocks/loop-pagination.css (.loop-pagination--large);
   this file adds only what the generated light-DOM markup needs beyond the block:
   the native <select> chrome and the custom first/last edge-bar glyphs.
============================================ */

loop-ag-grid-pagination {
  display: block;
}

/* ---- Items-per-page: native select wearing .loop-pagination__input ---- */
.loop-pagination__select {
  position: relative;
  display: inline-flex;
}
.loop-pagination__select .loop-pagination__input {
  appearance: none;
  -webkit-appearance: none;
  padding-right: var(--space-medium);   /* 32px — clears the chevron */
  cursor: pointer;
}
.loop-pagination__select-chevron {
  position: absolute;
  right: var(--space-tiny);
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 22px;
  color: var(--color-text-on-light-default);
}

/* ---- First/Last custom glyphs (Figma "angle-left first" / "angle-right last"):
   a 2px edge bar composed with the angle icon — no new font glyph needed. ---- */
.loop-pagination__icon--edge-first,
.loop-pagination__icon--edge-last {
  gap: 1px;
}
.loop-pagination__icon--edge-first::before,
.loop-pagination__icon--edge-last::after {
  content: "";
  flex: 0 0 auto;
  width: 2px;
  height: 13px;
  border-radius: 1px;
  background: currentColor;
}
```

</details>

## API — Attributes
| Attribute | Values | Description |
|---|---|---|
| `grid-api` | global name or dot-path (default `"AgGridAPI"`) | Where to find the AG Grid API object the `AGGrid_Lib` instance exposes. Re-checked on attribute change; also settable programmatically via `setApi(api)`. |
| `page-sizes` | comma-separated integers (default `"20,50,100"`) | Items-per-page options offered in the select. The grid's **current** page size is always included even if it isn't in this list. |

## API — Events
| Event | Detail | Description |
|---|---|---|
| `loop-pagination-changed` | `{ page, pageSize, total }` (`page` 1-based, `total` = total page count) | Bubbles + composed. Fired after any user-driven navigation or page-size change **and** whenever AG Grid's own `paginationChanged` event fires (so it also reflects grid-driven changes, e.g. a filter reducing the row count). |

## Example HTML
```html
<!-- Below the AGGrid_Lib block on the same screen -->
<div id="AGGridDemo"><!-- AGGrid_Lib block renders the grid + exposes its API here --></div>

<loop-ag-grid-pagination
  grid-api="AgGridAPI"
  page-sizes="20,50,100">
</loop-ag-grid-pagination>
```

## OutSystems Block wiring
1. On the `AGGrid_Lib` grid, set grid options:
   - `pagination: true`
   - `suppressPaginationPanel: true` (hides AG's native arrows + "x to y of z" footer so it
     isn't shown alongside the numbered pager)
   - `paginationPageSizeSelector` — set it to **the same list** passed to this component's
     `page-sizes` attribute (or set it to `false`). AG Grid validates page-size changes against
     this option; if the offered sizes don't match, it logs errors **#94/#95** and page-size
     switching silently fails.
2. Make sure the grid's AG Grid API object is reachable at the name/path passed in `grid-api`
   (default `AgGridAPI`) — however `AGGrid_Lib` is configured to expose it (a global variable,
   or a dot-path on a namespace object).
3. Place `<loop-ag-grid-pagination>` in the Block, below the grid, with `grid-api` and
   `page-sizes` bound to Block inputs (Text) via Value expressions.
4. Handle `loop-pagination-changed` if the app needs to react to page/size changes outside the
   grid itself (e.g. updating an external "results" summary) — wire it the same way as any
   other custom-element CustomEvent: a "Run JavaScript" node in the Block's **OnReady** that
   `addEventListener`s it and raises a Block event, removed in **OnDestroy**. This mirrors the
   OnReady/OnDestroy pattern used by `loop-toast` / `loop-modal` — see those handovers for the
   verbatim code shape.

## Event wiring (OnReady / OnDestroy)

> The component's CustomEvents are wired in the Block's **OnReady** and cleaned up in
> **OnDestroy** — the declarative "Handle Events" path is unreliable for custom elements.
> Give the `<loop-ag-grid-pagination>` element (or its wrapping Block) a **Name** and pass its
> platform-generated `.Id` to each "Run JavaScript" node as `WidgetId`. Paste these two
> blocks verbatim — they store each handler on `$public` so OnDestroy removes it by
> reference. (If your ODC version doesn't persist `$public` across OnReady/OnDestroy,
> stash the handlers on the element instead — `el._loopHandlers = { … }`.)

| CustomEvent | raises Block event |
|---|---|
| `loop-pagination-changed` | `OnPageChanged(JSON.stringify(e.detail))` |

**OnReady** — resolve the element, attach listeners, stash for cleanup:

```js
// Block OnReady — "Run JavaScript" node. Input: WidgetId = <ElementName>.Id
var root = document.getElementById($parameters.WidgetId);
var el = (root && root.tagName && root.tagName.toLowerCase() === 'loop-ag-grid-pagination')
  ? root : (root ? root.querySelector('loop-ag-grid-pagination') : null);
if (el) {
  $public.el = el;                       // stash for OnDestroy cleanup
  $public.handleLoopPaginationChanged = function (e) { $actions.OnPageChanged(JSON.stringify(e.detail)); };
  el.addEventListener('loop-pagination-changed', $public.handleLoopPaginationChanged);
}
```

**OnDestroy** — remove the listeners:

```js
// Block OnDestroy — "Run JavaScript" node. Uses the reference stashed in OnReady.
if ($public.el) {
  $public.el.removeEventListener('loop-pagination-changed', $public.handleLoopPaginationChanged);
}
```

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, wire up an OutSystems Block that wraps the already-imported custom
Web Component <loop-ag-grid-pagination> for the WBG "The Loop" design system.

Context (already done manually — do NOT re-create or edit these):
- dist/tokens.css, dist/theme.css and any block CSS are already pasted into the ODC Theme editor.
- loop-ag-grid-pagination.js is already imported as a Script resource (Theme/Library), Include = Always. It defines the custom element <loop-ag-grid-pagination>.
- Do NOT write CSS, author/modify JavaScript, or edit the Theme. Your job is only the
  Block, its inputs/events, the attribute bindings, the event wiring, and any Client
  Actions that drive it.

Task — reference every element by the exact name given. Take the exact inputs, attribute
bindings, events and any global helper from this handover's "API — Attributes / Methods /
Events" tables (paste the relevant table into the chat so I work from real names):

1. Create a Block named "AgGridPagination". Add one input per attribute (use the documented
   default) and one event per CustomEvent. Model enumerable attributes (variant / type /
   size / position / status) as Static Entities — one record per allowed value, with a
   single Text attribute (e.g. "Value") set as the record Identifier (delete the default
   Id/Label/Order/Is_Active) holding the literal the component expects — not free Text;
   keep free-form text as Text and flags as Boolean. Do NOT add a string Id input or set
   the element's id; OutSystems generates ids at runtime (see step 4).
2. Place <loop-ag-grid-pagination> in the Block. Bind each attribute to its input with a Value expression
   (ODC requires one on every attribute). Static-Entity inputs bind directly (e.g.
   type = Type) since their Value attribute is the identifier; Booleans use
   If(Flag, "true", "false") — not presence.
3. Wire each CustomEvent to its Block event in the Block's OnReady (attach) and OnDestroy
   (remove) — not via the declarative "Handle Events" path, which is unreliable for custom
   elements. Add a "Run JavaScript" node in OnReady that resolves the <loop-ag-grid-pagination>,
   addEventListener's each event (storing each handler on $public), and raises the Block
   event; add a second in OnDestroy that removeEventListener's them. Paste the verbatim
   OnReady + OnDestroy code from this handover's "## Event wiring (OnReady / OnDestroy)" section.
4. If the component exposes a global helper (see its API section), give the element/Block
   a Name and pass its platform-generated runtime .Id, e.g.
   window.LoopX.show($parameters.WidgetId) where the WidgetId input = <WidgetName>.Id.

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values (styling
comes from var(--token) in the Theme). After generating, list every element you created by
name and flag anything you could not finish.

Work iteratively: create the Block interface in step 1 and show it to me before wiring.
```

## Checklist
- [ ] Rebuild `dist/theme.css` and paste into the ODC Theme editor.
- [ ] Paste `loop-pagination.css` and `loop-ag-grid-pagination.css` into Theme CSS, **below** OutSystems UI.
- [ ] Import `loop-ag-grid-pagination.js` as a Script resource, Include = **Always**.
- [ ] **The app must load Open Sans via the theme `@font-face`** — the live AG Grid demo does not load the Loop theme/font by default, so without it the pager (and grid) fall back to the CSS `var(--token, literal)` fallback fonts instead of the Figma-specified Open Sans.
- [ ] On the grid: `pagination = true`, `suppressPaginationPanel = true`, `paginationPageSizeSelector` mirrors this component's `page-sizes` list (or `false`) — else AG logs errors #94/#95.
- [ ] Place `<loop-ag-grid-pagination>` below the grid with `grid-api` pointed at the grid's real API name.
- [ ] Test: page navigation (first/prev/next/last + direct page chips), items-per-page change, and that `loop-pagination-changed` fires with the correct `{page, pageSize, total}`.
- [ ] 1-Click Publish → validate in a **real browser** (Web Components never work in Service Studio Preview) — confirm the grid and pager stay in sync when either drives a page change.
