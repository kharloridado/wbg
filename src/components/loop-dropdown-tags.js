/**
 * loop-dropdown-tags.js — the Dropdown Tags behaviour layer. Two jobs:
 *
 *   1. FIT   — hold the tag row to ONE line, collapsing whatever doesn't fit into the
 *              "+N" overflow pill (Figma 18830-16426).
 *   2. SEARCH — put the type-to-filter INPUT in the field itself, combobox-style, instead
 *              of the provider's search row inside the balloon (Figma 18830-18200 shows
 *              no search row in the balloon at all).
 *
 * Figma ref: loop/refs/cmp-dropdown-tags. NOT a Web Component — it progressively enhances
 * the NATIVE OutSystems Dropdown Tags widget restyled by loop-dropdown-tags.css, matching
 * the "restyle native widgets, don't build a parallel system" rule.
 *
 * WHY FIT EXISTS
 * The VirtualSelect provider renders a "+N" pill only past its `noOfDisplayValues` option —
 * a FIXED COUNT. The design's rule is a FIT rule ("one line"), so N depends on the field's
 * width and the labels' lengths. No provider option and no OutSystems API expresses that,
 * so we measure the rendered row and drive `noOfDisplayValues` ourselves: render every chip,
 * shrink one at a time until the row stops overflowing (each step is one synchronous
 * re-render; the loop self-corrects for the pill's own width because the pill IS rendered
 * as soon as n < total). Floor: one chip always renders — an over-long lone label ellipsises
 * at its 200px max-width instead of collapsing the field to a bare pill.
 *
 * WHY SEARCH EXISTS
 * OutSystems hard-forces the provider's `search: true`, and the provider can only build its
 * search input inside the balloon — no option relocates it. So we inject a PROXY input after
 * the tag row and make the provider adopt it:
 *
 *   vs.$searchInput = proxy;      ← the keystone
 *
 * Every focus guard in the provider compares `document.activeElement` against `$searchInput`
 * (typing, hover, virtual-scroll re-render, open-focus). One reassignment makes all of them
 * treat the field's input as the search input: no focus stealing while typing, the caret
 * lands in the field when the balloon opens (`focusElementOnOpen`), and `setSearchValue`
 * state stays coherent. The balloon's own search row (which also hosts Select-All — the
 * design shows neither) is hidden by CSS, gated on the `loop-tags--inline-search` marker
 * this script stamps — so with the script absent the stock balloon search stays functional.
 *
 * The proxy carries the provider's own `toggle-button-child` class (clicks on it don't
 * toggle the balloon) and handles its own keys with stopPropagation — the provider
 * preventDefault()s EVERY keydown that reaches the toggle button, which would kill typing.
 *
 * PROVIDER INTERNALS — the one liberty this file takes.
 * `el.virtualSelect`, `noOfDisplayValues`, `setValueText()`, `$searchInput`, and the
 * instance methods called on the proxy's behalf (`openDropbox`, `closeDropbox`,
 * `setSearchValue`, `onDownArrowPress`/`onUpArrowPress`/`onEnterPress`) are provider
 * internals, not a public OutSystems API. There is no supported hook for width-aware
 * overflow or field-side search, so this is the seam. It is confined to this file and
 * degrades safely: with the script absent the CSS alone keeps the field to one clipped
 * line and the stock balloon search renders. Re-check this file if VirtualSelect is ever
 * bumped past 1.1.x.
 * (`setValueText()` does NOT dispatch `change` — only `setValue()` does — so driving it
 * cannot re-enter our own change handler.)
 *
 * Markup it builds (inside the Block's ExtendedClass hook):
 *   <div class="osui-dropdown-tags vscomp-ele">            ← carries .virtualSelect
 *     <div class="vscomp-wrapper show-value-as-tags loop-tags--inline-search">
 *       <div class="vscomp-toggle-button">
 *         <div class="vscomp-value">…chips…</div>
 *         <input class="loop-tags-search toggle-button-child">   ← injected proxy
 *         <span class="vscomp-value-tag more-value-count">+3</span> ← relocated by fit()
 *
 * SURVIVING A REDRAW.
 * OutSystems rebuilds the provider in place whenever a redraw-triggering input changes —
 * the bound datasource (`OptionsList`) is one of them — destroying the inner DOM (proxy
 * included) inside the same root element. Wiring therefore REBINDS to whatever nodes are
 * live rather than latching once; the proxy is re-injected and `$searchInput` re-pointed
 * on every rebind. See `wire()`.
 *
 * Public API (for ODC to call after a dynamic render):
 *   window.LoopDropdownTags.refresh(root?)  — (re)wire every Dropdown Tags under `root`
 *   (window.LoopDropdownTagsFit remains as an alias for pre-rename callers.)
 */
(function () {
  "use strict";

  var HOOK = ".osui-dropdown-tags";
  var WRAPPER = ".vscomp-wrapper";
  var VALUE = ".vscomp-value";
  var TOGGLE = ".vscomp-toggle-button";
  var PILL = ".more-value-count";
  var PROXY = ".loop-tags-search";
  var MARKER = "loop-tags--inline-search";
  var STATE = "__loopDropdownTags";
  var MAX_STEPS = 200;   // runaway guard; a real field never has this many tags

  /** The element VirtualSelect parked itself on — the hook root itself, or a descendant. */
  function instanceEl(root) {
    if (root.virtualSelect) return root;
    var kids = root.querySelectorAll("*");
    for (var i = 0; i < kids.length; i++) {
      if (kids[i].virtualSelect) return kids[i];
    }
    return null;
  }

  /** Shrink the rendered chip count until the row fits on one line, then relabel the pill. */
  function fit(st) {
    // Re-read both the instance and the row every time: a redraw (see `wire`) replaces them.
    var el = st.el;
    var vs = el.virtualSelect;
    if (!vs || !vs.showValueAsTags) return;

    var valueEl = el.querySelector(VALUE);
    var toggleEl = el.querySelector(TOGGLE);
    if (!valueEl || !toggleEl) return;

    // With the inline-search proxy in the row, the visual order must be
    // [chips][typed text / slack][+N][icons] — so the pill moves out of .vscomp-value to sit
    // AFTER the proxy, still pinned right (the proxy's flex:1 pushes it there). This runs on
    // EVERY re-render inside the measure loop, not once at the end, so the measurement sees
    // the true final layout — measuring with the pill still in the row would double-reserve
    // its width (once in the row, once outside) and collapse one chip too many.
    // Also drops the STALE relocated pill each time: setValueText() rebuilds the pill inside
    // .vscomp-value but never touches the copy previously moved out.
    // Safe: the provider re-collects $valueTags inside .vscomp-value only, and
    // setValueTagAttr skips nodes without data-index (the pill has none). The pill
    // deliberately does NOT get `toggle-button-child`, so clicking it opens the list.
    function relocatePill() {
      var strays = toggleEl.querySelectorAll(":scope > " + PILL);
      for (var s = 0; s < strays.length; s++) strays[s].remove();
      var pill = valueEl.querySelector(PILL);
      if (pill && st.proxy && st.proxy.parentElement === toggleEl) {
        toggleEl.insertBefore(pill, st.proxy.nextSibling);
      }
      return pill || null;
    }

    // Keep the proxy's disabled state in step with the widget (redraws can flip it), and
    // re-assert the wrapper demotion — the provider's enable() re-promotes it to tabindex 0,
    // which would restore a second, role-less tab stop until the next open.
    if (st.proxy) {
      st.proxy.disabled = !!vs.$ele.disabled;
      if (st.wrapper && st.wrapper.getAttribute("tabindex") !== "-1") {
        st.wrapper.setAttribute("tabindex", "-1");
      }
    }

    var total = (vs.selectedValues || []).length;
    if (total === 0) return;                    // placeholder — nothing to collapse

    // Never measure a row that has no layout — a field inside a collapsed accordion, an
    // inactive Tabs pane, or a `display: none` ancestor reports clientWidth 0, and fitting
    // against zero would collapse every chip into "+N" for no reason. The ResizeObserver
    // refits the moment the field is actually given a width.
    if (valueEl.clientWidth === 0) {
      if (st.mo) st.mo.takeRecords();
      return;
    }

    var n = total;
    vs.noOfDisplayValues = n;
    vs.setValueText();
    var pill = relocatePill();

    var steps = 0;
    // +1 absorbs sub-pixel rounding in the layout engine.
    while (valueEl.scrollWidth > valueEl.clientWidth + 1 && n > 1 && steps++ < MAX_STEPS) {
      n -= 1;
      vs.noOfDisplayValues = n;
      vs.setValueText();
      pill = relocatePill();
    }

    var hidden = total - n;

    if (hidden > 0 && pill) {
      // The provider renders "+ 3 more..." — its template hard-codes the space, so even
      // moreText:"" yields "+ 3 ". Figma's pill is the compact "+3".
      pill.textContent = "+" + hidden;
      pill.setAttribute("aria-label", hidden + " more selected");
    }

    // Every setValueText() above rewrote the row — and the relocation just now mutated it
    // again — and the row is what the MutationObserver watches. Drop those records before
    // its microtask can deliver them, or it would refit in response to its own refit,
    // forever. MUST stay the last statement.
    if (st.mo) st.mo.takeRecords();
  }

  // Coalesce on a TIMER, not requestAnimationFrame. rAF does not fire at all while the tab is
  // hidden (backgrounded, or restored from bfcache), so an rAF-scheduled fit would simply never
  // run and the field would paint with every chip on one clipped line. Timers still fire when
  // hidden. We don't need rAF's paint alignment anyway — reading scrollWidth forces layout on
  // demand.
  function schedule(st) {
    if (st.busy) return;
    st.busy = true;
    window.setTimeout(function () {
      st.busy = false;
      fit(st);
    }, 0);
  }

  /** Build the field-side search proxy and make the provider adopt it. */
  function injectSearch(st, vs, wrapper, valueEl) {
    var toggleEl = wrapper.querySelector(TOGGLE);
    if (!toggleEl) return;

    var proxy = toggleEl.querySelector(PROXY);
    if (!proxy) {
      proxy = document.createElement("input");
      proxy.type = "text";
      // `toggle-button-child` is the provider's own opt-out: clicks on it inside the toggle
      // button do not toggle the balloon (verified in onToggleButtonPress).
      proxy.className = "loop-tags-search toggle-button-child";
      proxy.autocomplete = "off";
      toggleEl.insertBefore(proxy, valueEl.nextSibling);
    }
    st.proxy = proxy;

    // ---- The keystone: the provider adopts the proxy as its search input. ----
    // Every provider focus guard compares against $searchInput; from here on typing, hover,
    // virtual-scroll and open-focus all treat the field input as the search box.
    vs.$searchInput = proxy;

    proxy.placeholder = (!vs.selectedValues || vs.selectedValues.length === 0)
      ? (vs.placeholder || "")
      : "";
    proxy.disabled = !!vs.$ele.disabled;

    // ARIA: ONE combobox, ONE tab stop — the proxy. The provider marks the WRAPPER as the
    // combobox; demote it, and mirror aria-activedescendant (which the provider keeps
    // writing on the wrapper for every nav/filter path) onto the proxy.
    proxy.setAttribute("role", "combobox");
    proxy.setAttribute("aria-autocomplete", "list");
    proxy.setAttribute("aria-expanded", vs.isOpened() ? "true" : "false");
    proxy.setAttribute("aria-controls", "vscomp-dropbox-container-" + vs.uniqueId);
    var lbl = wrapper.getAttribute("aria-label");
    var lblBy = wrapper.getAttribute("aria-labelledby");
    if (lbl) proxy.setAttribute("aria-label", lbl);
    if (lblBy) proxy.setAttribute("aria-labelledby", lblBy);
    wrapper.setAttribute("tabindex", "-1");
    wrapper.removeAttribute("role");

    if (st.ado) st.ado.disconnect();
    if (window.MutationObserver) {
      st.ado = new MutationObserver(function () {
        var ad = wrapper.getAttribute("aria-activedescendant");
        if (ad) proxy.setAttribute("aria-activedescendant", ad);
        else proxy.removeAttribute("aria-activedescendant");
      });
      st.ado.observe(wrapper, { attributes: true, attributeFilter: ["aria-activedescendant"] });
    }

    // The marker gates all inline-search CSS (hide the balloon's search row, lay the proxy
    // out). Stamped on BOTH wrappers — in ODC the balloon is appended to <body> as a
    // .vscomp-dropbox-wrapper that mirrors the wrapper classes, and the hide-search rule
    // must reach it there. Script absent ⇒ no marker ⇒ stock search remains usable.
    var all = vs.$allWrappers || [wrapper];
    for (var i = 0; i < all.length; i++) {
      if (all[i]) all[i].classList.add(MARKER);
    }

    // ---- Proxy events. Listeners live on nodes that die with the redraw, so binding here
    //      (bind() runs per redraw) cannot double-register. ----
    // Open on CLICK / typing / arrows — deliberately NOT on focus. Tab-focus shouldn't pop
    // the balloon (combobox convention), and a focus-open would loop: afterClose redirects
    // focus back to the proxy, which would instantly reopen what the user just closed.
    proxy.addEventListener("click", function () {
      if (!proxy.disabled && !vs.isOpened()) vs.openDropbox();
    });
    proxy.addEventListener("input", function () {
      if (!vs.isOpened()) vs.openDropbox();
      // silent=true mirrors the provider's own onSearch (we ARE the input; no write-back).
      vs.setSearchValue(proxy.value, true);
    });
    proxy.addEventListener("keydown", function (e) {
      // Shield the provider's blanket keydown-preventDefault on the toggle button (it would
      // cancel character insertion) and its wrapper-level onKeyDown (double handling).
      e.stopPropagation();
      // IME composition: committing CJK text or navigating the candidate window emits
      // Enter/Arrow keydowns with isComposing (keyCode 229) — those belong to the IME, not
      // the list. (Stock is immune by accident: its dispatch is keyCode-based.)
      if (e.isComposing || e.keyCode === 229) return;
      switch (e.key) {
        case "ArrowDown": vs.onDownArrowPress(e); break;   // preventDefault + open-or-focus inside
        case "ArrowUp":   vs.onUpArrowPress(e);   break;
        case "Enter":     vs.onEnterPress(e);     break;   // preventDefault kills form submit too
        case "Tab":
          // Stock closes on Tab via the balloon's sentinel rows — which the focus never
          // reaches now that it lives in the field. Close here (no preventDefault: focus
          // moves on normally) or the balloon would stay floating over the page.
          if (vs.isOpened()) {
            vs.shouldFocusWrapperOnClose = false;
            vs.closeDropbox();
          }
          break;
        case "Escape":
          // The provider's own Escape path needs focus inside the balloon wrapper — it can
          // never fire from the field, so close from here and keep the caret in the field.
          // shouldFocusWrapperOnClose=false is the provider's OWN escape-close idiom: without
          // it, afterHidePopper yanks focus from the proxy onto the (tabindex -1) wrapper.
          vs.shouldFocusWrapperOnClose = false;
          vs.closeDropbox();
          proxy.focus();
          break;
        // everything else: native editing in the proxy
      }
    });

    // Picking options must not move the caret out of the proxy: mousedown → focus is the
    // browser default we cancel; the provider's click handler still selects. Multiple mode
    // never closes on select, so the user can type → click → keep typing. Scoped to option
    // rows so the scrollbar still drags.
    if (vs.$dropboxContainer && !vs.$dropboxContainer.__loopTagsMousedown) {
      vs.$dropboxContainer.__loopTagsMousedown = true;
      vs.$dropboxContainer.addEventListener("mousedown", function (e) {
        if (e.target && e.target.closest && e.target.closest(".vscomp-option")) e.preventDefault();
      });
    }

    // afterOpen / afterClose are dispatched NON-bubbling on the instance element — listen
    // there, not on the root. Unlike the inner DOM, $ele SURVIVES a provider destroy()
    // (its innerHTML is emptied, the node stays), so guard against re-registering on every
    // redraw rebind. The handlers read the live state from `st`, so surviving one bind is
    // enough.
    if (!vs.$ele.__loopTagsLifecycle) {
      vs.$ele.__loopTagsLifecycle = true;

      // Both handlers DERIVE aria-expanded from live state instead of asserting their own
      // event's meaning: afterOpen is dispatched from the popper's show transition while
      // afterClose dispatches straight from closeDropbox, so a fast open→close can deliver
      // them out of order — a late afterOpen would stamp a stale "true" onto a closed field.
      function syncExpanded() {
        var p = st.proxy;
        var cvs = st.el.virtualSelect;
        if (!p || !cvs) return;
        p.setAttribute("aria-expanded", cvs.isOpened() ? "true" : "false");
      }

      vs.$ele.addEventListener("afterOpen", function () {
        syncExpanded();
        // the provider re-promotes the wrappers to tabindex 0 on every open — re-demote
        st.wrapper.setAttribute("tabindex", "-1");
      });

      vs.$ele.addEventListener("afterClose", function () {
        var p = st.proxy;
        var cvs = st.el.virtualSelect;
        if (!p || !cvs) return;
        syncExpanded();
        p.removeAttribute("aria-activedescendant");
        // Reset the query so reopening shows the full list. Guarded in the provider
        // (only acts when the value actually changed), so this never loops.
        p.value = "";
        cvs.setSearchValue("", true);
        // Mouse-path close (chevron / outside click): afterHidePopper focuses the wrapper —
        // now role-less and tabindex -1, so a screen reader announces nothing there. Hand
        // the focus back to the combobox input instead.
        if (document.activeElement === st.wrapper) p.focus();
      });

      // The placeholder lives on the proxy only while nothing is selected (the CSS hides the
      // provider's own placeholder text under the marker).
      vs.$ele.addEventListener("change", function () {
        var p = st.proxy;
        var cvs = st.el.virtualSelect;
        if (!p || !cvs) return;
        p.placeholder = (!cvs.selectedValues || cvs.selectedValues.length === 0)
          ? (cvs.placeholder || "")
          : "";
      });
    }
  }

  /** Point the observers + proxy at the nodes that are live RIGHT NOW, dropping any earlier set. */
  function bind(st, el, wrapper, valueEl) {
    if (st.mo) st.mo.disconnect();
    if (st.ro) st.ro.disconnect();
    if (st.ado) { st.ado.disconnect(); st.ado = null; }

    st.el = el;
    st.wrapper = wrapper;
    st.valueEl = valueEl;
    st.lastWidth = -1;

    var vs = el.virtualSelect;
    if (vs) injectSearch(st, vs, wrapper, valueEl);

    // The row's content changing is the ONE trigger we cannot do without. The provider applies
    // the starting selection AFTER it builds the DOM — and OutSystems initialises it with
    // `silentInitialValueSet: true`, so no `change` event is dispatched for it. Without this
    // observer the first paint would keep every chip and never collapse. `fit` calls
    // takeRecords() so our own re-renders don't come back around.
    if (window.MutationObserver) {
      st.mo = new MutationObserver(function () { schedule(st); });
      st.mo.observe(valueEl, { childList: true });
    }

    if (window.ResizeObserver) {
      // Our own re-render changes the row, which can nudge the wrapper's box and re-fire the
      // observer. Only refit when the WIDTH actually moved — that is the only input `fit`
      // reads — so the observer cannot chase its own tail.
      st.ro = new ResizeObserver(function (entries) {
        var w = entries[0] && entries[0].contentRect ? Math.round(entries[0].contentRect.width) : -1;
        if (w === st.lastWidth) return;
        st.lastWidth = w;
        schedule(st);
      });
      st.ro.observe(wrapper);
    }
  }

  function wire(root) {
    var el = instanceEl(root);
    if (!el) return;                            // provider hasn't initialised yet — the
    var wrapper = el.querySelector(WRAPPER);    // document observer will bring us back
    var valueEl = el.querySelector(VALUE);
    if (!wrapper || !valueEl) return;

    var st = root[STATE];

    // Already bound to these exact nodes — nothing to do. This is the common case: our own
    // setValueText() rewrites the row's CHILDREN, which trips the document observer, but leaves
    // .vscomp-value itself in place.
    if (st && st.valueEl === valueEl && st.wrapper === wrapper) return;

    if (!st) {
      st = root[STATE] = {
        el: el, wrapper: null, valueEl: null, proxy: null,
        mo: null, ro: null, ado: null, busy: false, lastWidth: -1,
      };
      // Bound ONCE, to the hook root — which survives a redraw (below), unlike the inner nodes.
      // Fires on select / deselect / clear-all.
      root.addEventListener("change", function () { schedule(st); });
    }

    // REBIND, don't skip. OutSystems tears the provider down and rebuilds it in place whenever a
    // redraw-triggering input changes — and `OptionsList`, the bound datasource, is one of them
    // (AbstractVirtualSelect.changeProperty → redraw → AbstractProviderPattern._handleRedraw →
    // provider.destroy() + re-create). So an ordinary aggregate refresh replaces .vscomp-wrapper
    // and .vscomp-value with NEW nodes inside the SAME root — taking the proxy and the marker
    // classes with them. A one-shot "already wired" latch would leave the observers watching
    // detached nodes, the search dead, and the field rendering every chip clipped with no "+N".
    bind(st, el, wrapper, valueEl);
    schedule(st);                               // seed from whatever is already selected
  }

  /** (Re)wire every Dropdown Tags under `root`. Safe to call repeatedly. */
  function refresh(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var hooks = scope.querySelectorAll(HOOK);
    for (var i = 0; i < hooks.length; i++) wire(hooks[i]);
  }

  // Re-scan as ODC renders Blocks — and as the provider builds its DOM — after load.
  function observe() {
    if (!window.MutationObserver) return;
    var mo = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes && mutations[i].addedNodes.length) { refresh(document); break; }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  function init() { refresh(document); observe(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.LoopDropdownTags = { refresh: refresh };
  window.LoopDropdownTagsFit = window.LoopDropdownTags;   // pre-rename alias
})();
