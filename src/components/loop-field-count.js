/**
 * loop-field-count.js — live character-count enhancement for the Loop Field Wrapper.
 *
 * Figma: "Text Field" FieldLabel word-count badge [node 19336-10226 / 15695:5731].
 * NOT a Web Component — it progressively enhances the NATIVE OutSystems input restyled by
 * loop-text-field.css, matching the "restyle native widgets, don't build a parallel system"
 * rule. The Field Wrapper Block renders the badge markup; this script keeps it in sync with
 * what the user types. With JS off, the badge simply shows its server-rendered static text.
 *
 * Markup it looks for (rendered by the Block when ShowCharCount = True):
 *   <div class="loop-field" data-loop-field-count>
 *     <div class="loop-field__label-row">
 *       … <span class="loop-field__count">0/100</span>
 *     </div>
 *     <input class="form-control" data-input maxlength="100">
 *   </div>
 *
 * The denominator (max) is read from the input's `maxlength`, else `data-maxlength` on the
 * field, else the "/NN" already in the badge text. The numerator is the current value length.
 *
 * Public API (for ODC to call after a dynamic render):
 *   window.LoopFieldCount.refresh(root?)  — (re)wire every field under `root` (default document)
 */
(function () {
  "use strict";

  var FIELD = ".loop-field[data-loop-field-count]";
  var COUNT = ".loop-field__count";
  var WIRED = "__loopFieldCountWired";

  function readMax(field, input) {
    var ml = input.getAttribute("maxlength");
    if (ml && Number(ml) > 0) return Number(ml);
    var dm = field.getAttribute("data-maxlength");
    if (dm && Number(dm) > 0) return Number(dm);
    var badge = field.querySelector(COUNT);
    if (badge) {
      var m = /\/\s*(\d+)/.exec(badge.textContent || "");
      if (m) return Number(m[1]);
    }
    return null;
  }

  function update(field, input, badge, max) {
    var len = (input.value || "").length;
    badge.textContent = max != null ? len + "/" + max : String(len);
  }

  function wire(field) {
    if (field[WIRED]) return;
    var input = field.querySelector("input, textarea");
    var badge = field.querySelector(COUNT);
    if (!input || !badge) return;          // nothing to count yet — leave the static badge
    field[WIRED] = true;
    var max = readMax(field, input);
    var handler = function () { update(field, input, badge, max); };
    input.addEventListener("input", handler);
    handler();                              // seed from the initial value
  }

  /** (Re)wire every char-count field under `root`. Safe to call repeatedly. */
  function refresh(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var fields = scope.querySelectorAll(FIELD);
    for (var i = 0; i < fields.length; i++) wire(fields[i]);
  }

  // Re-scan as ODC renders Blocks into the DOM after load.
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

  window.LoopFieldCount = { refresh: refresh };
})();
