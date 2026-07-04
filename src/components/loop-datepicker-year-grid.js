/* loop-datepicker-year-grid.js — custom Flatpickr plugin: scrollable year-grid view
 * ("Open Change Year", Figma node 20277:9997 / year view 20249:4627).
 *
 * Flatpickr v4 (the ODC DatePicker provider) ships only a numeric year stepper. This
 * plugin ADDS the Figma year grid without replacing the native widget: it injects a
 * caret next to the "Month Year" header label; clicking it swaps the day grid for a
 * scrollable 4-column grid of years (styled by loop-datepicker.css → .loop-dp-yeargrid).
 * Picking a year jumps the calendar to that year and returns to the day view.
 *
 * Usage (vanilla / preview):   flatpickr(el, { plugins: [loopDatePickerYearGrid()] })
 * Optional config: { minYear, maxYear } — defaults to currentYear ± 100.
 *
 * No framework (vanilla JS, hard rule #6). Exposed as a global factory so OutSystems can
 * reference it from the DatePicker's advanced Flatpickr config.
 */
(function (global) {
  "use strict";

  function loopDatePickerYearGrid(pluginConfig) {
    var cfg = pluginConfig || {};

    return function (fp) {
      var toggle = null;
      var grid = null;

      function monthWrap() {
        return fp.calendarContainer.querySelector(".flatpickr-current-month");
      }

      function buildToggle() {
        toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "loop-dp-yeartoggle";
        toggle.setAttribute("aria-label", "Choose year");
        toggle.setAttribute("aria-expanded", "false");
        // FA 6 Pro caret-down (solid) — glyph is drawn by loop-datepicker.css
        // (.loop-dp-yeartoggle__glyph: font-family/weight/content sizing)
        toggle.innerHTML =
          '<span class="loop-dp-yeartoggle__glyph" aria-hidden="true"></span>';
        toggle.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          isOpen() ? close() : open();
        });
        var wrap = monthWrap();
        if (wrap) wrap.appendChild(toggle);
      }

      function buildGrid() {
        grid = document.createElement("div");
        grid.className = "loop-dp-yeargrid";
        grid.setAttribute("role", "listbox");
        grid.setAttribute("aria-label", "Year");
        grid.addEventListener("click", function (e) {
          var cell = e.target.closest(".loop-dp-yeargrid__year");
          if (!cell) return;
          var year = parseInt(cell.dataset.year, 10);
          fp.jumpToDate(new Date(year, fp.currentMonth, 1), false);
          close();
        });
        // Escape closes the year view and returns focus to the caret
        grid.addEventListener("keydown", function (e) {
          if (e.key === "Escape" || e.key === "Esc") {
            e.preventDefault();
            e.stopPropagation();
            close();
            if (toggle) toggle.focus();
          }
        });
        fp.calendarContainer.appendChild(grid);
      }

      function renderGrid() {
        var cy = fp.currentYear;
        var from = typeof cfg.minYear === "number" ? cfg.minYear : cy - 100;
        var to = typeof cfg.maxYear === "number" ? cfg.maxYear : cy + 100;
        var html = "";
        for (var y = from; y <= to; y++) {
          var sel = y === cy ? " loop-dp-yeargrid__year--selected" : "";
          var aria = y === cy ? ' aria-selected="true"' : "";
          html +=
            '<button type="button" role="option" class="loop-dp-yeargrid__year' +
            sel +
            '" data-year="' +
            y +
            '"' +
            aria +
            ">" +
            y +
            "</button>";
        }
        grid.innerHTML = html;
      }

      function isOpen() {
        return fp.calendarContainer.classList.contains("loop-dp--yearview");
      }

      function open() {
        renderGrid();
        fp.calendarContainer.classList.add("loop-dp--yearview");
        if (toggle) toggle.setAttribute("aria-expanded", "true");
        var sel = grid.querySelector(".loop-dp-yeargrid__year--selected");
        if (sel) sel.scrollIntoView({ block: "center" });
      }

      function close() {
        fp.calendarContainer.classList.remove("loop-dp--yearview");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      }

      return {
        onReady: function () {
          buildToggle();
          buildGrid();
        },
        // keep the grid's highlighted year in sync if the view changes while open
        onYearChange: function () {
          if (isOpen()) renderGrid();
        },
        onDestroy: function () {
          if (toggle && toggle.parentNode) toggle.parentNode.removeChild(toggle);
          if (grid && grid.parentNode) grid.parentNode.removeChild(grid);
          toggle = grid = null;
        },
      };
    };
  }

  global.loopDatePickerYearGrid = loopDatePickerYearGrid;
})(typeof window !== "undefined" ? window : this);
