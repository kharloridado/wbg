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

**Design source.** No bespoke Figma "DatePicker" node was published, so the balloon is
built to The Loop's already-shipped popup language — it reads as a sibling of the
**Select pop-up list** (`loop-dropdown.css`): white card, `--radius-medium` corners,
`--shadow-low`, subdued outline, `#f5f7f9` row hover, brand-blue (Blue/70) selection,
2px Blue/50 keyboard ring (FND-012). Metrics live in `tokens/component-datepicker.css`.

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

> Canonical CSS lives in `src/blocks/loop-datepicker.css`; it is embedded into this ticket by
> `node build/embed-handover-code.mjs` — re-run after editing the source to keep them in sync.

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-datepicker.css</code> → Theme CSS — paste below OutSystems UI (Flatpickr provider CSS is runtime-injected)</summary>

```css
/* ============================================
   Component: DatePicker — calendar balloon  ("The Loop")
   Restyle of the native OutSystems UI DatePicker. The ODC provider is **Flatpickr**
   (vendor/outsystems-ui · Providers/OSUI/Datepicker/Flatpickr). OutSystems appends
   the calendar to <body> as `.flatpickr-calendar.osui-datepicker-calendar`, keeping
   Flatpickr's stock inner DOM (.flatpickr-months / -weekdays / -days / .flatpickr-day),
   then layers its OWN `_flatpickr.scss` theme on top. This file is The Loop brand
   layer that wins over BOTH the Flatpickr base stylesheet AND that OutSystems theme.

   Approach: RESTYLE the provider DOM — no parallel calendar widget. The field that
   opens the picker is the native Text Field / Select, already styled elsewhere; this
   file owns only the pop-up balloon.

   Location: Theme CSS (loaded after OutSystems UI + the provider CSS, so it wins on
   equal specificity by source order — same cascade contract as loop-dropdown.css).
   Escalation Level: L2 (provider DOM + token-driven theme override).

   Design source: no bespoke Figma "DatePicker" node was published, so the balloon is
   built to The Loop's already-shipped popup language — it reads as a sibling of the
   Select pop-up list (loop-dropdown.css §1): white card, --radius-medium corners,
   --shadow-low, subdued outline, #f5f7f9 row hover, brand-blue (blue-70) selection,
   blue-50 keyboard ring (FND-012). Metrics live in tokens/component-datepicker.css.

   Fidelity notes (built faithfully; raised, NOT silently changed):
     - day cell marker = --radius-pill (32px stadium/circle); no picker-specific radius
       token is published, so it inherits the Select pill family            → FND-044
     - "today" ring = --color-outline-on-light-link-enabled (blue-70): the neutral
       outline family OutSystems uses for today sits below the 3:1 non-text floor
       (FND-019 family), so the only resting marker that clears 3:1 is the brand ring → FND-045
     - the Flatpickr/OSUI caret ("balloon" pointer) is hidden to match the caret-less
       Select pop-up list — a deliberate alignment, not an arbitrary removal.
   ============================================ */

/* =====================================================================
   1) Balloon container
   ===================================================================== */
.flatpickr-calendar {
  width: var(--loop-datepicker-width);
  background-color: var(--loop-datepicker-bg);
  border: 1px solid var(--loop-datepicker-border);
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
   2) Header — month dropdown + year stepper + prev/next nav
   ===================================================================== */
.flatpickr-calendar .flatpickr-months {
  align-items: center;
  padding: var(--loop-datepicker-pad-block) var(--loop-datepicker-pad-inline) 0;
}

.flatpickr-calendar .flatpickr-current-month {
  color: var(--loop-datepicker-header-color);
  font-size: var(--loop-datepicker-header-size);
  font-weight: var(--loop-datepicker-header-weight);
}
.flatpickr-calendar .flatpickr-current-month .flatpickr-monthDropdown-months,
.flatpickr-calendar .flatpickr-current-month input.cur-year {
  color: var(--loop-datepicker-header-color);
  font-size: var(--loop-datepicker-header-size);
  font-weight: var(--loop-datepicker-header-weight);
  border-radius: var(--radius-base, 4px);
}
.flatpickr-calendar .flatpickr-current-month .flatpickr-monthDropdown-months:hover,
.flatpickr-calendar .flatpickr-current-month .numInputWrapper:hover {
  background-color: var(--loop-datepicker-nav-hover-bg);
  border-radius: var(--radius-base, 4px);
}

/* prev / next — circular neutral hover, brand-neutral chevrons */
.flatpickr-calendar .flatpickr-prev-month,
.flatpickr-calendar .flatpickr-next-month {
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
.flatpickr-calendar .flatpickr-prev-month svg,
.flatpickr-calendar .flatpickr-next-month svg {
  width: 12px;
  height: 12px;
  fill: var(--loop-datepicker-nav-icon);
}
.flatpickr-calendar .flatpickr-prev-month svg path,
.flatpickr-calendar .flatpickr-next-month svg path {
  fill: var(--loop-datepicker-nav-icon);
}

/* =====================================================================
   3) Weekday header row
   ===================================================================== */
.flatpickr-calendar .flatpickr-weekdays {
  padding: var(--space-xxsmall, 8px) var(--loop-datepicker-pad-inline) 0;
}
.flatpickr-calendar span.flatpickr-weekday {
  color: var(--loop-datepicker-weekday-color);
  font-size: var(--loop-datepicker-weekday-size);
  font-weight: var(--loop-datepicker-weekday-weight);
}

/* =====================================================================
   4) Day grid
   ===================================================================== */
.flatpickr-calendar .flatpickr-innerContainer {
  padding: var(--space-tiny, 4px) var(--loop-datepicker-pad-inline) var(--loop-datepicker-pad-block);
}
.flatpickr-calendar .flatpickr-rContainer,
.flatpickr-calendar .flatpickr-days,
.flatpickr-calendar .dayContainer {
  width: 100%;
  max-width: 100%;
  min-width: 100%;
}

.flatpickr-calendar .flatpickr-day {
  height: var(--loop-datepicker-day-size);
  line-height: calc(var(--loop-datepicker-day-size) - 2px);
  max-width: none;
  border: 1px solid transparent;           /* reserve the 1px so "today"/selected never shift the grid */
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

/* today — brand-blue ring (FND-045) */
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
}

/* in-range fill between endpoints */
.flatpickr-calendar .flatpickr-day.inRange,
.flatpickr-calendar .flatpickr-day.inRange:hover {
  background-color: var(--loop-datepicker-range-bg);
  border-color: var(--loop-datepicker-range-bg);
  color: var(--loop-datepicker-day-color);
  box-shadow: -5px 0 0 var(--loop-datepicker-range-bg), 5px 0 0 var(--loop-datepicker-range-bg);
}

/* disabled days */
.flatpickr-calendar .flatpickr-day.flatpickr-disabled,
.flatpickr-calendar .flatpickr-day.flatpickr-disabled:hover {
  color: var(--loop-datepicker-day-disabled);
  background-color: transparent;
  border-color: transparent;
}

/* =====================================================================
   5) Accessibility — brand keyboard ring (applied automatically; flag-don't-fix
      keeps the COLOUR a design token, FND-012). Scoped to the OSUI calendar so the
      ring matches the Select / Text Field rather than the provider default.
   ===================================================================== */
.flatpickr-calendar .flatpickr-day:focus-visible {
  outline: none;
  border-color: var(--loop-datepicker-focus-ring);
  box-shadow: 0 0 0 2px var(--loop-datepicker-focus-ring);
}
.flatpickr-calendar .flatpickr-prev-month:focus-visible,
.flatpickr-calendar .flatpickr-next-month:focus-visible,
.flatpickr-calendar .flatpickr-monthDropdown-months:focus-visible,
.flatpickr-calendar .numInputWrapper input:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--loop-datepicker-focus-ring);
}

/* ---- Reduced motion (WCAG 2.2 SC 2.3.3) ---- */
@media (prefers-reduced-motion: reduce) {
  .flatpickr-calendar,
  .flatpickr-calendar .flatpickr-day { transition: none; animation: none; }
}
```

</details>























## State mapping (calendar element → The Loop)
| Element | How |
|---|---|
| **Balloon card** | `.flatpickr-calendar` — white, 8px radius, `--shadow-low`, subdued border; caret hidden to match the Select pop-up list |
| **Header nav** | `.flatpickr-prev/next-month` — 32px circular neutral hover; month dropdown + year stepper in header type |
| **Weekday row** | `span.flatpickr-weekday` — 12px subdued column heads |
| **Day (in month)** | `.flatpickr-day` — default text; hover = `#f5f7f9` rounded marker |
| **Day (other month)** | `.prevMonthDay` / `.nextMonthDay` — subdued text |
| **Today** | `.flatpickr-day.today` — Blue/70 ring (FND-045) |
| **Selected** | `.flatpickr-day.selected` — Blue/70 fill, white glyph |
| **Range** | `.startRange` / `.endRange` Blue/70 endpoints, `.inRange` `#f5f7f9` fill |
| **Disabled** | `.flatpickr-disabled` — disabled text, no fill |
| **Keyboard focus** | 2px Blue/50 ring on days + nav (brand ring, FND-012) |

## What the override changes vs the Flatpickr / OutSystems baseline
- Balloon becomes a **caret-less white card** (8px radius, low shadow, subdued border) — matches the Select pop-up list.
- **Day marker** is a `--radius-pill` (32px) circle/stadium; selected = Blue/70 fill + white, today = Blue/70 ring, hover = `#f5f7f9`.
- Header **prev/next** become 32px circular buttons with neutral hover and brand-neutral chevrons.
- Weekday heads + day text move to The Loop type tokens; in-range fill = `#f5f7f9`.
- **2px Blue/50** keyboard-focus ring on days and nav controls.

## Checklist
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new `--loop-datepicker-*` tokens).
- [ ] Paste `loop-datepicker.css` into Theme CSS, **below** OutSystems UI.
- [ ] Drop a stock **DatePicker** block (Single or Range) — styling applies to the runtime `.flatpickr-calendar`.
- [ ] 1-Click Publish → validate in a **real browser** (never Service Studio Preview). The calendar is body-appended at runtime — confirm the `.flatpickr-*` overrides land on the published balloon, including range + today + disabled days.

## Open findings linked to this work (register-only — low, no GitHub Bug auto-filed)
- **FND-044** (design-token, low) — the day marker uses `--radius-pill` (32px) as no picker-specific radius token is published; it inherits the Select pill family.
- **FND-045** (a11y/design-token, low) — "today" is marked with a Blue/70 ring because the neutral outline family OutSystems uses falls below the 3:1 non-text floor (FND-019 family); the brand ring is the only resting marker that clears 3:1.
- **FND-012** (a11y/brand, medium, cross-ref) — Blue/50 brand focus ring replaces the provider/OutSystems default ring.
- **FND-032** (design-token, low, shared) — the balloon/list border reuses `--color-outline-on-light-subdued` (the Select pop-up list mapping).
