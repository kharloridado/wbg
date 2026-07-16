# Handover — DatePicker (restyle the Flatpickr calendar balloon)

The Loop **DatePicker** styling, ready to add into OutSystems.
ODC provider: **Flatpickr v4.6.13** (the library OutSystems' DatePicker wraps).

**Approach:** No custom calendar widget. This **restyles the native OutSystems UI
DatePicker** — same pattern as the Dropdown / Text Field. OutSystems appends the
calendar to `<body>` as `.flatpickr-calendar.osui-datepicker-calendar`, keeping
Flatpickr's stock inner DOM (`.flatpickr-months` / `.flatpickr-weekdays` /
`.flatpickr-days` / `.flatpickr-day`); this layer is The Loop brand styling that wins
over both the Flatpickr base stylesheet and OutSystems' own `_flatpickr` theme. The
field that opens the picker is the native Text Field / Select, already styled
elsewhere — this file owns only the **balloon**.

**Design source.** Figma "The Loop / Main Library" — node **17897:9088** (`-loop date picker`):
calendar symbol 17897:7225 (300×304), year view 20249:4627, day-cell variants 17897:7144 (36×36).
White card, `--radius-medium` corners, `--shadow-low`, subdued outline, `#f5f7f9` row hover,
brand-blue (`#004370`, Blue/70) selection, 2px Blue/50 keyboard ring (FND-012). The header puts
the **"Month Year ⌄" label on the left and the prev/next chevrons grouped on the right**, and the
caret opens a scrollable **4-column year grid** ("Open Change Year"). Metrics live in
`tokens/component-datepicker.css`.

**Year grid = a custom Flatpickr plugin.** Flatpickr v4 (the ODC provider) ships only a numeric
year *stepper*, so the Figma year-grid view is added by `loop-datepicker-year-grid.js` — a vanilla-JS
Flatpickr plugin (no framework). It does NOT replace the native widget; it injects the caret + grid
and uses `jumpToDate` to navigate. Register it via `loopDatePickerYearGrid()` in the DatePicker's
advanced Flatpickr config, and pair it with `monthSelectorType: "static"` so the month renders as a
content-sized label (Figma "October 2024") rather than a widest-option `<select>`.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the DatePicker page.

**What it is.** The Loop calendar balloon — the native OutSystems DatePicker (Flatpickr) restyled.

**When to use**
- Pick a single calendar date, or a start–end **range**, from a month grid.

**When not to use** (reach for instead)
- Free-text / masked date entry only → **Text Field**.
- Pick a month or time → **MonthPicker** / **TimePicker** (same Flatpickr family; this CSS already covers their shared header/day chrome).

**How to use**
- Use the stock **DatePicker** block (Single or Range) — the styling applies automatically.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-datepicker.css` | Theme CSS (paste **below** OutSystems UI so it wins) |
| `tokens/component-datepicker.css` → `dist/theme.css` | Theme CSS (adds the `--loop-datepicker-*` tokens) |
| `src/components/loop-datepicker-year-grid.js` | Script resource (Theme/Library), Include = Always — register via `loopDatePickerYearGrid()` in the DatePicker's advanced Flatpickr config |

> Canonical CSS lives in `src/blocks/loop-datepicker.css`; it is embedded into this ticket by
> `node build/embed-handover-code.mjs` — re-run after editing the source to keep them in sync.

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-datepicker.css</code> → Theme CSS — paste below OutSystems UI (Flatpickr provider CSS is runtime-injected)</summary>

```css
/* loop-datepicker.css — DatePicker calendar balloon: Flatpickr provider (.flatpickr-calendar) restyle */

/* =====================================================================
   1) Balloon container
   ===================================================================== */
.flatpickr-calendar {
  width: var(--loop-datepicker-width);
  background-color: var(--loop-datepicker-bg);
  /* Figma card is shadow-only — no stroke (the low-lift drop shadow defines the edge). */
  border: 0;
  border-radius: var(--loop-datepicker-radius);
  box-shadow: var(--loop-datepicker-shadow);
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
}

/* small gap between the field and the open balloon */
.flatpickr-calendar.arrowTop  { margin-top: var(--space-tiny, 4px); }
.flatpickr-calendar.arrowBottom { margin-top: calc(-1 * var(--space-tiny, 4px)); }

/* caret-less card — match the Select pop-up list (no pointer balloon) */
.flatpickr-calendar.arrowTop::before,
.flatpickr-calendar.arrowTop::after,
.flatpickr-calendar.arrowBottom::before,
.flatpickr-calendar.arrowBottom::after {
  display: none;
}

/* =====================================================================
   2) Header — Figma layout: "Month Year ⌄" left, prev/next grouped right.
      Flatpickr default is prev(abs-left) / month(center) / next(abs-right);
      we make .flatpickr-months a flex row and float the nav to the end.
   ===================================================================== */
.flatpickr-calendar .flatpickr-months {
  display: flex;
  align-items: center;
  height: auto;
  padding: var(--loop-datepicker-pad-top) var(--loop-datepicker-pad-inline) 0;
}
/* month/year label takes the left, growing to push the nav right */
.flatpickr-calendar .flatpickr-month {
  order: 1;
  flex: 1 1 auto;
  height: auto;
  color: var(--loop-datepicker-header-color);
}
/* prev/next become a static, right-aligned pair (no longer absolute corners) */
.flatpickr-calendar .flatpickr-prev-month { order: 2; }
.flatpickr-calendar .flatpickr-next-month { order: 3; }

.flatpickr-calendar .flatpickr-current-month {
  position: static;
  left: auto;
  width: auto;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--space-tiny, 4px);
  color: var(--loop-datepicker-header-color);
  font-size: var(--loop-datepicker-header-size);
  font-weight: var(--loop-datepicker-header-weight);
}
/* enforce Figma order "Month Year ⌄" — OSUI sets order:2 on the month select, which the
   flex header would otherwise render year-first. Covers both monthSelectorType modes:
   'static' (.cur-month text label, content-sized — matches Figma) and 'dropdown' (select). */
.flatpickr-calendar .flatpickr-current-month .cur-month,
.flatpickr-calendar .flatpickr-current-month .flatpickr-monthDropdown-months { order: 0; }
.flatpickr-calendar .flatpickr-current-month .numInputWrapper { order: 1; }
.flatpickr-calendar .flatpickr-current-month .loop-dp-yeartoggle { order: 2; }

.flatpickr-calendar .flatpickr-current-month .cur-month,
.flatpickr-calendar .flatpickr-current-month .flatpickr-monthDropdown-months,
.flatpickr-calendar .flatpickr-current-month input.cur-year {
  margin: 0;
  color: var(--loop-datepicker-header-color);
  font-size: var(--loop-datepicker-header-size);
  font-weight: var(--loop-datepicker-header-weight);
  border-radius: var(--radius-base, 4px);
}
/* drop the month select's native arrow — the single year caret is the only affordance (Figma) */
.flatpickr-calendar .flatpickr-current-month .flatpickr-monthDropdown-months {
  appearance: none;
  -webkit-appearance: none;
  background-image: none;
  padding-inline: 0;
}
.flatpickr-calendar .flatpickr-current-month .flatpickr-monthDropdown-months:hover {
  background-color: var(--loop-datepicker-nav-hover-bg);
  border-radius: var(--radius-base, 4px);
}
/* hide Flatpickr's numeric year spinner arrows — the caret opens the year grid instead,
   and reclaim their width so the 4-digit year never clips */
.flatpickr-calendar .numInputWrapper span.arrowUp,
.flatpickr-calendar .numInputWrapper span.arrowDown { display: none; }
.flatpickr-calendar .flatpickr-current-month .numInputWrapper { width: auto; }
.flatpickr-calendar .flatpickr-current-month input.cur-year { width: 4.5ch; padding: 0; }
/* also drop the browser's NATIVE number-input spinner (a stray filled ▾ next to the caret) */
.flatpickr-calendar .flatpickr-current-month input.cur-year {
  -moz-appearance: textfield;
  appearance: textfield;
}
.flatpickr-calendar .flatpickr-current-month input.cur-year::-webkit-outer-spin-button,
.flatpickr-calendar .flatpickr-current-month input.cur-year::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

/* month/year caret — opens the scrollable year grid (plugin-driven) */
.flatpickr-calendar .loop-dp-yeartoggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--loop-datepicker-caret-size);
  height: var(--loop-datepicker-caret-size);
  margin-inline-start: var(--space-tiny, 4px);
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--loop-datepicker-caret-color);
  cursor: pointer;
  border-radius: var(--radius-base, 4px);
}
/* FA chevron-down — the thin caret the Figma header draws beside the month/year label.
   The glyph is painted ONLY by ::before; the span itself is font-size:0 so any stray text
   node the runtime injects into it (a legacy caret-down \f0d7 shows up here) stays invisible
   and never doubles up with the chevron. */
.flatpickr-calendar .loop-dp-yeartoggle__glyph {
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-solid, 900);
  font-size: 0;
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
}
.flatpickr-calendar .loop-dp-yeartoggle__glyph::before {
  content: "\f078";                                  /* fa-chevron-down */
  font-size: var(--loop-datepicker-caret-glyph, 14px);
  line-height: 1;
}
.flatpickr-calendar .loop-dp-yeartoggle:hover { background-color: var(--loop-datepicker-nav-hover-bg); }
/* caret flips when the year grid is open */
.flatpickr-calendar.loop-dp--yearview .loop-dp-yeartoggle__glyph { transform: rotate(180deg); }

/* prev / next — circular neutral hover, brand-neutral chevrons, grouped right */
.flatpickr-calendar .flatpickr-prev-month,
.flatpickr-calendar .flatpickr-next-month {
  position: static;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--loop-datepicker-nav-size);
  height: var(--loop-datepicker-nav-size);
  padding: 0;
  border-radius: var(--radius-pill, 32px);
}
.flatpickr-calendar .flatpickr-prev-month:hover,
.flatpickr-calendar .flatpickr-next-month:hover {
  background-color: var(--loop-datepicker-nav-hover-bg);
}
/* Chevron: OSUI hides Flatpickr's <svg> and draws a legacy-'FontAwesome' glyph in ::before.
   We draw FA 6 Pro chevrons instead (self-hosted face; the legacy family is never declared)
   — selector carries .flatpickr-months to outrank OSUI's ::before rule. */
.flatpickr-calendar .flatpickr-months .flatpickr-prev-month svg,
.flatpickr-calendar .flatpickr-months .flatpickr-next-month svg { display: none; }
.flatpickr-calendar .flatpickr-months .flatpickr-prev-month::before,
.flatpickr-calendar .flatpickr-months .flatpickr-next-month::before {
  display: block;
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-solid, 900);
  font-size: var(--loop-datepicker-nav-glyph, 12px);
  font-style: normal;
  line-height: 1;
  color: var(--loop-datepicker-nav-icon);
  -webkit-font-smoothing: antialiased;
}
.flatpickr-calendar .flatpickr-months .flatpickr-prev-month::before { content: "\f053"; }  /* fa-chevron-left */
.flatpickr-calendar .flatpickr-months .flatpickr-next-month::before { content: "\f054"; }  /* fa-chevron-right */

/* =====================================================================
   3) Weekday header row
   ===================================================================== */
/* weekday row sits inside .flatpickr-innerContainer (which now owns the 24px gutter),
   so no own horizontal padding — that keeps the weekday heads flush over the day columns */
.flatpickr-calendar .flatpickr-weekdays {
  padding: 0;
}
.flatpickr-calendar .flatpickr-weekdaycontainer { width: 100%; }
/* align weekday heads over the day columns (same 36px tracks, space-between) */
.flatpickr-calendar .flatpickr-weekdaycontainer { justify-content: space-between; }
.flatpickr-calendar span.flatpickr-weekday {
  flex: 0 0 var(--loop-datepicker-day-size);
  max-width: var(--loop-datepicker-day-size);
  height: var(--loop-datepicker-day-size);          /* 36px cell — matches the Figma weekday track */
  line-height: var(--loop-datepicker-day-size);
  color: var(--loop-datepicker-weekday-color);
  font-size: var(--loop-datepicker-weekday-size);
  font-weight: var(--loop-datepicker-weekday-weight);
}

/* =====================================================================
   4) Day grid
   ===================================================================== */
.flatpickr-calendar .flatpickr-innerContainer {
  padding: var(--loop-datepicker-pad-top) var(--loop-datepicker-pad-inline) var(--loop-datepicker-pad-bottom);
}
.flatpickr-calendar .flatpickr-rContainer,
.flatpickr-calendar .flatpickr-days,
.flatpickr-calendar .dayContainer {
  width: 100%;
  max-width: 100%;
  min-width: 100%;
}
/* even 7-column distribution so each 36px marker reads as a circle */
.flatpickr-calendar .dayContainer { justify-content: space-between; }

.flatpickr-calendar .flatpickr-day {
  flex: 0 0 var(--loop-datepicker-day-size);
  width: var(--loop-datepicker-day-size);
  max-width: var(--loop-datepicker-day-size);
  height: var(--loop-datepicker-day-size);
  line-height: calc(var(--loop-datepicker-day-size) - 4px);   /* centre inside the 2px ring */
  margin: 0;                                /* flush 36px rows — Figma has no inter-row gap */
  border: 2px solid transparent;           /* reserve the 2px so "today"/selected never shift the grid */
  border-radius: var(--loop-datepicker-day-radius);
  color: var(--loop-datepicker-day-color);
  font-size: var(--loop-datepicker-day-size-text);
  font-weight: var(--font-weight-regular, 400);
}

/* out-of-month days */
.flatpickr-calendar .flatpickr-day.prevMonthDay,
.flatpickr-calendar .flatpickr-day.nextMonthDay {
  color: var(--loop-datepicker-day-muted);
}

/* hover / keyboard-focus surface */
.flatpickr-calendar .flatpickr-day:hover,
.flatpickr-calendar .flatpickr-day.prevMonthDay:hover,
.flatpickr-calendar .flatpickr-day.nextMonthDay:hover {
  background-color: var(--loop-datepicker-day-hover-bg);
  border-color: var(--loop-datepicker-day-hover-bg);
  color: var(--loop-datepicker-day-color);
}

/* today — brand-blue ring */
.flatpickr-calendar .flatpickr-day.today {
  border-color: var(--loop-datepicker-today-border);
}
.flatpickr-calendar .flatpickr-day.today:hover,
.flatpickr-calendar .flatpickr-day.today:focus {
  background-color: var(--loop-datepicker-day-hover-bg);
  border-color: var(--loop-datepicker-today-border);
  color: var(--loop-datepicker-day-color);
}

/* selected — brand-blue fill, white glyph (beats today + hover + range) */
.flatpickr-calendar .flatpickr-day.selected,
.flatpickr-calendar .flatpickr-day.selected:hover,
.flatpickr-calendar .flatpickr-day.selected:focus,
.flatpickr-calendar .flatpickr-day.selected.today,
.flatpickr-calendar .flatpickr-day.startRange,
.flatpickr-calendar .flatpickr-day.startRange:hover,
.flatpickr-calendar .flatpickr-day.endRange,
.flatpickr-calendar .flatpickr-day.endRange:hover {
  background-color: var(--loop-datepicker-selected-bg);
  border-color: var(--loop-datepicker-selected-bg);
  color: var(--loop-datepicker-selected-text);
  font-weight: var(--font-weight-semibold, 600);   /* Figma: selected date label is SemiBold */
}

/* in-range fill between endpoints */

/* disabled days */
.flatpickr-calendar .flatpickr-day.flatpickr-disabled,
.flatpickr-calendar .flatpickr-day.flatpickr-disabled:hover {
  color: var(--loop-datepicker-day-disabled);
  background-color: transparent;
  border-color: transparent;
}

/* =====================================================================
   5) Accessibility — brand keyboard ring, scoped to the OSUI calendar
   ===================================================================== */
.flatpickr-calendar .flatpickr-day:focus-visible {
  outline: none;
  border-color: var(--loop-datepicker-focus-ring);
  box-shadow: 0 0 0 2px var(--loop-datepicker-focus-ring);
}
.flatpickr-calendar .flatpickr-prev-month:focus-visible,
.flatpickr-calendar .flatpickr-next-month:focus-visible,
.flatpickr-calendar .flatpickr-monthDropdown-months:focus-visible,
.flatpickr-calendar .loop-dp-yeartoggle:focus-visible,
.flatpickr-calendar .numInputWrapper input:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--loop-datepicker-focus-ring);
}

/* =====================================================================
   6) Year grid view ("Open Change Year") — injected by the custom plugin
      (src/components/loop-datepicker-year-grid.js). When .loop-dp--yearview is
      on the calendar, the day grid is hidden and the scrollable year grid shows.
   ===================================================================== */
.flatpickr-calendar .loop-dp-yeargrid { display: none; }

.flatpickr-calendar.loop-dp--yearview .flatpickr-weekdays,
.flatpickr-calendar.loop-dp--yearview .flatpickr-innerContainer { display: none; }

.flatpickr-calendar.loop-dp--yearview .loop-dp-yeargrid {
  display: grid;
  grid-template-columns: repeat(var(--loop-datepicker-year-cols), 1fr);
  gap: var(--loop-datepicker-year-gap);
  max-height: var(--loop-datepicker-year-view-max);
  overflow-y: auto;
  padding: var(--loop-datepicker-pad-top) var(--loop-datepicker-pad-inline) var(--loop-datepicker-pad-bottom);
}

.flatpickr-calendar .loop-dp-yeargrid__year {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--loop-datepicker-year-cell-h);
  border: 1px solid transparent;          /* reserve 1px so the selected ring never shifts the grid */
  border-radius: var(--loop-datepicker-year-radius);
  background: transparent;
  color: var(--loop-datepicker-year-color);
  font-size: var(--loop-datepicker-day-size-text);
  font-weight: var(--font-weight-regular, 400);
  cursor: pointer;
}
.flatpickr-calendar .loop-dp-yeargrid__year:hover {
  background-color: var(--loop-datepicker-year-hover-bg);
  border-color: var(--loop-datepicker-year-hover-bg);
}
/* selected year — navy fill + white SemiBold, matching the selected day (Figma states 17897:7144) */
.flatpickr-calendar .loop-dp-yeargrid__year--selected,
.flatpickr-calendar .loop-dp-yeargrid__year--selected:hover {
  background-color: var(--loop-datepicker-selected-bg);
  border-color: var(--loop-datepicker-selected-bg);
  color: var(--loop-datepicker-selected-text);
  font-weight: var(--font-weight-semibold, 600);
}
.flatpickr-calendar .loop-dp-yeargrid__year:focus-visible {
  outline: none;
  border-color: var(--loop-datepicker-focus-ring);
  box-shadow: 0 0 0 2px var(--loop-datepicker-focus-ring);
}

/* ---- Reduced motion (WCAG 2.2 SC 2.3.3) ---- */
@media (prefers-reduced-motion: reduce) {
  .flatpickr-calendar,
  .flatpickr-calendar .flatpickr-day { transition: none; animation: none; }
}
```

</details>
<details>
<summary><code>loop-datepicker-year-grid.js</code> → Script resource (Theme/Library), Include = Always — register via loopDatePickerYearGrid() in the DatePicker's advanced Flatpickr config</summary>

```js
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
```

</details>

## State mapping (calendar element → The Loop)
| Element | How |
|---|---|
| **Balloon card** | `.flatpickr-calendar` — white, 8px radius, `--shadow-low`, subdued border, 300px wide; balloon pointer hidden to match the Select pop-up list |
| **Header** | `.flatpickr-current-month` — "Month Year ⌄" label on the LEFT (month is a `static` text label); `.loop-dp-yeartoggle` caret opens the year grid |
| **Header nav** | `.flatpickr-prev/next-month` — 32px circular neutral hover, **grouped on the right**; chevron self-drawn via `::before` (FontAwesome-independent) |
| **Weekday row** | `span.flatpickr-weekday` — 12px subdued column heads, aligned to the day columns |
| **Day (in month)** | `.flatpickr-day` — 36px circle; default text; hover = `#f5f7f9` |
| **Day (other month)** | `.prevMonthDay` / `.nextMonthDay` — subdued text |
| **Today** | `.flatpickr-day.today` — Blue/70 (`#004370`) ring (Figma-confirmed, FND-045 resolved) |
| **Selected** | `.flatpickr-day.selected` — Blue/70 fill, white glyph |
| **Range** | `.startRange` / `.endRange` Blue/70 endpoints, `.inRange` `#f5f7f9` fill |
| **Disabled** | `.flatpickr-disabled` — disabled text, no fill |
| **Year grid** | `.loop-dp-yeargrid` (plugin) — scrollable 4-col grid; `__year--selected` = Blue/70 ring |
| **Keyboard focus** | 2px Blue/50 ring on days, nav + year cells (brand ring, FND-012) |

## What the override changes vs the Flatpickr / OutSystems baseline
- Balloon becomes a **white card** (300px, 8px radius, low shadow, subdued border) with no pointer.
- **Header** is re-laid-out to Figma: "Month Year ⌄" label LEFT, prev/next chevrons GROUPED RIGHT (OSUI's default is prev-left / month-center / next-right; done via flex `order` + static positioning). The chevron is self-drawn (`::before` border) so it renders without OSUI's FontAwesome glyph; the month is a `static` content-sized label, not a widest-option `<select>`.
- **Day marker** is a 36px `--radius-pill` circle; selected = Blue/70 fill + white, today = Blue/70 ring, hover = `#f5f7f9`.
- **Year grid** ("Open Change Year") is added by the custom plugin — a scrollable 4-col grid the v4 provider has no native equivalent for.
- Weekday heads + day text move to The Loop type tokens; in-range fill = `#f5f7f9`.
- **2px Blue/50** keyboard-focus ring on days, nav controls and year cells.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for Datepicker to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-datepicker.css, dist/tokens.css and dist/theme.css are already pasted into the ODC
Theme editor (below OutSystems UI). The look is pure CSS + tokens — there is nothing for
you to style, and you must not write or edit CSS.

Task — this component RESTYLES a native OutSystems widget, so the work is using the right
widget, not generating styles. Referencing elements by name:
1. Use the native OutSystems widget this maps to (see this handover's "When to use" /
   "Variant mapping" section), not a custom element.
2. Apply each variant via the Extended Class property only (e.g. ExtendedClass =
   "<documented-modifier>") — never mutate OutSystems UI internals.
3. Build any screen/Block logic the screen needs around it.

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values. After
generating, list what you created by name and flag anything you could not finish.
```

## Checklist
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new `--loop-datepicker-*` tokens).
- [ ] Paste `loop-datepicker.css` into Theme CSS, **below** OutSystems UI.
- [ ] Import `loop-datepicker-year-grid.js` as a Script resource (Include = Always).
- [ ] Drop a stock **DatePicker** block (Single or Range). In its advanced Flatpickr config set `monthSelectorType: "static"` and add `plugins: [loopDatePickerYearGrid()]` (optionally `{ minYear, maxYear }`).
- [ ] 1-Click Publish → validate in a **real browser** (never Service Studio Preview). The calendar is body-appended at runtime — confirm the `.flatpickr-*` overrides land on the published balloon, including range + today + disabled days, the header layout ("Month Year ⌄" left, nav right), and that the caret opens the scrollable year grid.

## Open findings linked to this work (register-only — low, no GitHub Bug auto-filed)
- **FND-044** (design-token, low) — **RESOLVED**: the day marker is a `--radius-pill` circle, confirmed by the Figma day-cell variants (17897:7144). No longer a divergence.
- **FND-045** (a11y/design-token, low) — **RESOLVED**: "today" is a Blue/70 (`#004370`) ring exactly as the Figma "Today=Yes" day variants draw it. No longer a divergence.
- **FND-012** (a11y/brand, medium, cross-ref) — Blue/50 brand focus ring replaces the provider/OutSystems default ring.
- **FND-032** (design-token, low, shared) — the balloon/list border reuses `--color-outline-on-light-subdued` (the Select pop-up list mapping).
