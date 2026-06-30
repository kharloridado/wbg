# Handover — loop-badge-status (custom CSS block)

The Loop **Badge / Status** — a status indicator + label used in lists, dashboards,
data tables, data visualizations and diagrams. Figma: "Badge / Status" [node 18153-7159].

**Approach:** Custom component, no native OutSystems widget equivalent (the native Badge
is a notification-count bubble). Built as a **CSS-only BEM block** (no JavaScript / no Web
Component) — applied as plain markup via `ExtendedClass` on a Container, or as an HTML
element inside a Block. Three **types**, seven **states**, four **sizes**. The label colour
is the same neutral dark for every state — only the dot / icon / pill-border carries the
state hue (per Figma).

- **Types:** **Light** (CSS dot + label) · **Icon** (inline-SVG glyph + label) · **Headline** (`--headline` modifier — dot/icon + label in a bordered, tinted pill)
- **States:** `success` · `informational` · `warning` · `error` · `suggestive` · `not-started` · `in-progress`
- **Sizes:** `small` · `regular` (default) · `large` · `xlarge`

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Badge / Status page.

**What it is.** A status indicator (dot or icon + label) for lists, dashboards, data tables, and diagrams.

**When to use**
- Convey a **state** next to a record — success, informational, warning, error, suggestive, not-started, in-progress.

**When not to use** (reach for instead)
- A plain category label → **Badge / Label**.
- A filter or selection chip → **Tag**.
- A page-level message → **System Alert**.

**How to use**
- Apply via Extended Class. Pick a type (Light dot / Icon glyph / Headline pill), a state, and a size (`small` / `regular` / `large` / `xlarge`).

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-badge-status.css` | Theme CSS (also folded into `dist/theme.css`) |
| `tokens/component-badge-status.css` | Included automatically in `dist/theme.css` (the `--loop-badge-status-*` tokens) |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-badge-status.css</code> → Theme CSS (also folded into dist/theme.css)</summary>

```css
/* loop-badge-status.css — Badge / Status: indicator + label, CSS-only markup component */
/* The label colour is the same neutral dark for every state; only the dot/icon/pill border carries the state hue. */

.loop-badge-status {
  display: inline-flex;
  align-items: center;
  align-self: center;      /* keep natural height if a host flex/grid container stretches its items */
  vertical-align: middle;
  gap: var(--_lbs-gap);
  box-sizing: border-box;
  max-width: 100%;
  /* per-size locals (defaults = Regular) */
  --_lbs-font: var(--loop-badge-status-regular-font, 14px);
  --_lbs-lead: var(--loop-badge-status-regular-leading, 14px);
  --_lbs-icon: var(--loop-badge-status-regular-icon, 16px);
  --_lbs-dot:  var(--loop-badge-status-regular-dot, 10px);
  --_lbs-gap:  var(--loop-badge-status-regular-gap, 4px);
  --_lbs-h:    var(--loop-badge-status-regular-headline-h, 24px);  /* headline pill height */
  --_lbs-pl:   var(--loop-badge-status-regular-pad-left, 8px);     /* headline left padding */
  --_lbs-pr:   var(--loop-badge-status-regular-pad-right, 10px);   /* headline right padding */
  /* indicator hue — overridden per state below */
  --_lbs-indicator: currentColor;
  font-family:    var(--loop-badge-status-label-family, "Open Sans", system-ui, sans-serif);
  font-size:      var(--_lbs-font);
  line-height:    var(--_lbs-lead);
  font-weight:    var(--loop-badge-status-label-weight, 500);
  letter-spacing: var(--loop-badge-status-label-tracking, 0.5px);
  color:          var(--loop-badge-status-label-color, rgba(0, 13, 26, 0.7));
}

/* ---- Sizes ---- */
.loop-badge-status--small {
  --_lbs-font: var(--loop-badge-status-small-font, 12px);   --_lbs-lead: var(--loop-badge-status-small-leading, 14px);
  --_lbs-icon: var(--loop-badge-status-small-icon, 14px);   --_lbs-dot:  var(--loop-badge-status-small-dot, 8px);
  --_lbs-gap:  var(--loop-badge-status-small-gap, 4px);     --_lbs-h:    var(--loop-badge-status-small-headline-h, 22px);
  --_lbs-pl:   var(--loop-badge-status-small-pad-left, 6px); --_lbs-pr:  var(--loop-badge-status-small-pad-right, 8px);
}
.loop-badge-status--regular {
  --_lbs-font: var(--loop-badge-status-regular-font, 14px); --_lbs-lead: var(--loop-badge-status-regular-leading, 14px);
  --_lbs-icon: var(--loop-badge-status-regular-icon, 16px); --_lbs-dot:  var(--loop-badge-status-regular-dot, 10px);
  --_lbs-gap:  var(--loop-badge-status-regular-gap, 4px);   --_lbs-h:    var(--loop-badge-status-regular-headline-h, 24px);
  --_lbs-pl:   var(--loop-badge-status-regular-pad-left, 8px); --_lbs-pr: var(--loop-badge-status-regular-pad-right, 10px);
}
.loop-badge-status--large {
  --_lbs-font: var(--loop-badge-status-large-font, 16px);   --_lbs-lead: var(--loop-badge-status-large-leading, 16px);
  --_lbs-icon: var(--loop-badge-status-large-icon, 18px);   --_lbs-dot:  var(--loop-badge-status-large-dot, 12px);
  --_lbs-gap:  var(--loop-badge-status-large-gap, 4px);     --_lbs-h:    var(--loop-badge-status-large-headline-h, 32px);
  --_lbs-pl:   var(--loop-badge-status-large-pad-left, 10px); --_lbs-pr: var(--loop-badge-status-large-pad-right, 12px);
}
.loop-badge-status--xlarge {
  --_lbs-font: var(--loop-badge-status-xlarge-font, 18px);  --_lbs-lead: var(--loop-badge-status-xlarge-leading, 20px);
  --_lbs-icon: var(--loop-badge-status-xlarge-icon, 20px);  --_lbs-dot:  var(--loop-badge-status-xlarge-dot, 14px);
  --_lbs-gap:  var(--loop-badge-status-xlarge-gap, 6px);    --_lbs-h:    var(--loop-badge-status-xlarge-headline-h, 40px);
  --_lbs-pl:   var(--loop-badge-status-xlarge-pad-left, 12px); --_lbs-pr: var(--loop-badge-status-xlarge-pad-right, 14px);
}

/* ---- Label ---- */
.loop-badge-status__label {
  min-width: 0;
  line-height: var(--_lbs-lead);   /* pin it — don't inherit a host (ODC) line-height */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---- Indicator: dot (Light / Headline types) ---- */
.loop-badge-status__dot {
  flex-shrink: 0;
  width:  var(--_lbs-dot);
  height: var(--_lbs-dot);
  border-radius: 50%;
  background: var(--_lbs-indicator);
}

/* ---- Indicator: icon (Icon type + in-progress) ----
 * The in-progress glyph is rendered STATIC (no rotation) per review on #88. */
.loop-badge-status__icon {
  flex-shrink: 0;
  display: inline-flex;
  width:  var(--_lbs-icon);
  height: var(--_lbs-icon);
  color:  var(--_lbs-indicator);   /* inline SVG paints with currentColor */
}
.loop-badge-status__icon svg { width: 100%; height: 100%; display: block; }

/* ---- Indicator colour per state (the label stays neutral) ---- */
.loop-badge-status--success      { --_lbs-indicator: var(--loop-badge-status-success-indicator, #388004); }
.loop-badge-status--informational { --_lbs-indicator: var(--loop-badge-status-informational-indicator, #004370); }
.loop-badge-status--warning      { --_lbs-indicator: var(--loop-badge-status-warning-indicator, #e19d00); }
.loop-badge-status--error        { --_lbs-indicator: var(--loop-badge-status-error-indicator, #9d161d); }
.loop-badge-status--suggestive   { --_lbs-indicator: var(--loop-badge-status-suggestive-indicator, #763ba9); }
.loop-badge-status--not-started  { --_lbs-indicator: var(--loop-badge-status-not-started-indicator, #8a9db1); }
.loop-badge-status--in-progress  { --_lbs-indicator: var(--loop-badge-status-in-progress-indicator, #004370); }

/* ---- Headline: dot/icon + label inside a bordered, tinted pill ----
 * 1px outline is an inset box-shadow (zero layout) and the height is pinned per size, so the pill height never shifts. */
.loop-badge-status--headline {
  height: var(--_lbs-h);
  padding: 0 var(--_lbs-pr) 0 var(--_lbs-pl);
  border-radius: var(--loop-badge-status-radius, 4px);
}
.loop-badge-status--headline.loop-badge-status--success      { background: var(--loop-badge-status-success-bg, #f6fef0);      box-shadow: inset 0 0 0 1px var(--loop-badge-status-success-border, #388004); }
.loop-badge-status--headline.loop-badge-status--informational { background: var(--loop-badge-status-informational-bg, #f6fcff); box-shadow: inset 0 0 0 1px var(--loop-badge-status-informational-border, #00538a); }
.loop-badge-status--headline.loop-badge-status--warning      { background: var(--loop-badge-status-warning-bg, #fef3d7);      box-shadow: inset 0 0 0 1px var(--loop-badge-status-warning-border, #896001); }
.loop-badge-status--headline.loop-badge-status--error        { background: var(--loop-badge-status-error-bg, #fdf2f2);        box-shadow: inset 0 0 0 1px var(--loop-badge-status-error-border, #9d161d); }
.loop-badge-status--headline.loop-badge-status--suggestive   { background: var(--loop-badge-status-suggestive-bg, #f1e1ff);   box-shadow: inset 0 0 0 1px var(--loop-badge-status-suggestive-border, #763ba9); }
.loop-badge-status--headline.loop-badge-status--not-started  { background: var(--loop-badge-status-not-started-bg, #fff);     box-shadow: inset 0 0 0 1px var(--loop-badge-status-not-started-border, #bdccdb); }
.loop-badge-status--headline.loop-badge-status--in-progress  { background: var(--loop-badge-status-in-progress-bg, #fff);     box-shadow: inset 0 0 0 1px var(--loop-badge-status-in-progress-border, #d4dee8); }
```

</details>

## Class API
| Class | Purpose |
|---|---|
| `loop-badge-status` | Base (required) |
| `loop-badge-status--{state}` | `success` \| `informational` \| `warning` \| `error` \| `suggestive` \| `not-started` \| `in-progress` (required) |
| `loop-badge-status--{size}` | `small` \| `regular` \| `large` \| `xlarge` (optional; omit = regular) |
| `loop-badge-status--headline` | Wraps the indicator + label in a bordered, tinted pill |
| `loop-badge-status__dot` | Indicator element for **Light/Headline** — an empty span; CSS draws the coloured dot |
| `loop-badge-status__icon` | Indicator element for **Icon** type and **in-progress** — wraps an inline SVG (paints with `currentColor`). Rendered static (no rotation). |
| `loop-badge-status__label` | The status text |

> **Size default:** Figma's canonical variant is `xlarge`; the block treats `regular` as the
> unmodified default (these badges live in tables/lists/dashboards). All four sizes are
> faithful — add `loop-badge-status--xlarge` to match the Figma default exactly.

## Example markup
```html
<!-- Light dot — most common (tables, lists) -->
<span class="loop-badge-status loop-badge-status--success">
  <span class="loop-badge-status__dot" aria-hidden="true"></span>
  <span class="loop-badge-status__label">Approved</span>
</span>

<!-- Icon type — paste the state glyph (see "Icon glyphs" below) -->
<span class="loop-badge-status loop-badge-status--error loop-badge-status--large">
  <span class="loop-badge-status__icon" aria-hidden="true">
    <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="currentColor"/><rect x="7.1" y="3.6" width="1.8" height="5.2" rx="0.9" fill="#fff"/><circle cx="8" cy="11.3" r="1" fill="#fff"/></svg>
  </span>
  <span class="loop-badge-status__label">Rejected</span>
</span>

<!-- Headline pill -->
<span class="loop-badge-status loop-badge-status--warning loop-badge-status--headline loop-badge-status--xlarge">
  <span class="loop-badge-status__dot" aria-hidden="true"></span>
  <span class="loop-badge-status__label">Needs review</span>
</span>

<!-- In-progress (static icon — no rotation) -->
<span class="loop-badge-status loop-badge-status--in-progress">
  <span class="loop-badge-status__icon" aria-hidden="true">
    <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.4" stroke="currentColor" stroke-width="1.6" stroke-opacity="0.25"/><path d="M8 1.6a6.4 6.4 0 0 1 6.4 6.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
  </span>
  <span class="loop-badge-status__label">Processing</span>
</span>
```

## Icon glyphs (paste into `loop-badge-status__icon` for the Icon type)
All glyphs use `fill="currentColor"` / `stroke="currentColor"`, so the state modifier colours them automatically.

| State | SVG |
|---|---|
| success | `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="currentColor"/><path d="M4.6 8.4l2.2 2.2 4.6-5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>` |
| informational | `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="currentColor"/><circle cx="8" cy="4.7" r="1" fill="#fff"/><rect x="7.1" y="6.6" width="1.8" height="5.2" rx="0.9" fill="#fff"/></svg>` |
| warning | `<svg viewBox="0 0 16 16" fill="none"><path d="M7.13 1.7a1 1 0 0 1 1.74 0l6.0 10.9a1 1 0 0 1-.87 1.5H1.99a1 1 0 0 1-.87-1.5z" fill="currentColor"/><rect x="7.1" y="5.4" width="1.8" height="4.6" rx="0.9" fill="#fff"/><circle cx="8" cy="11.7" r="1" fill="#fff"/></svg>` |
| error / suggestive | `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="currentColor"/><rect x="7.1" y="3.6" width="1.8" height="5.2" rx="0.9" fill="#fff"/><circle cx="8" cy="11.3" r="1" fill="#fff"/></svg>` |
| not-started | `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/></svg>` |
| in-progress | `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.4" stroke="currentColor" stroke-width="1.6" stroke-opacity="0.25"/><path d="M8 1.6a6.4 6.4 0 0 1 6.4 6.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>` |

## OutSystems wiring
- **Static badge:** drop a Container, set its `Style Classes` (ExtendedClass) to `loop-badge-status loop-badge-status--success`, and nest the dot/icon + label spans (or use an Expression with `EscapeHtml`).
- **Dynamic state/size:** build the class string in an attribute, e.g. `"loop-badge-status loop-badge-status--" + ToLower(StatusEntity.State) + " loop-badge-status--" + Size`. Keep state values aligned to the modifier names.
- No Block, no Script resource, no events — this is presentation-only CSS.

## Accessibility (WCAG 2.2 AA)
- The **visible label carries the status meaning** — colour is never the sole cue (WCAG 1.4.1). Always provide label text.
- The indicator (dot / glyph) is decorative — mark it `aria-hidden="true"`.
- The `in-progress` icon is **static** (no rotation), per review on #88 — no motion to suppress.
- Label text colour is the neutral `Text/On Light/Default` on every (tinted/white) background — high contrast.
- ⚠️ **Pending finding (FND-036):** the Figma label weight token is `500`, but the theme ships Open Sans `400/600/700` only, so `500` renders as `400` (faux). The Figma style name is "SemiBold" (600) — design to confirm whether to ship a 500 face or change the token to 600.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, apply the WBG "The Loop" styling for BadgeStatus to the native
OutSystems UI widget(s) it restyles.

Context (already done): loop-badge-status.css and dist/theme.css are already pasted into the ODC
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
- [ ] Rebuild `dist/theme.css` and paste into ODC Theme editor (includes the `loop-badge-status` block + `--loop-badge-status-*` tokens).
- [ ] Apply `loop-badge-status` classes via ExtendedClass / HTML element; nest dot or icon + label.
- [ ] For the Icon type, paste the matching glyph from the table above.
- [ ] Test all 7 states × 3 types × 4 sizes; confirm the in-progress icon renders **static** (no rotation).
- [ ] 1-Click Publish → validate in a **real browser**.
