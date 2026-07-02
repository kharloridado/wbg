# Handover — Field Wrapper (loop-field Block: FieldLabel + Input + Helper)

The Loop **Field Wrapper** — a reusable OutSystems **Block** that lays out a form field:
a **FieldLabel row** (required `*` + label + `(optional)` + character-count badge), the
**Input**, and **Helper text**. It wraps the *native* OutSystems Input (restyled by
`loop-text-field.css`) — it does **not** introduce a custom input element.
Figma: `-The Loop- Main Library` · "Text Field" [node 19336-9606] · FieldLabel [node 19336-10226].

**Approach.** A thin BEM wrapper (`loop-field`) applied via Extended Class on the field
Container, plus a FieldLabel-row built from the Block's parameters and a tiny
progressive-enhancement script (`loop-field-count.js`) that live-updates the count badge.
The Input itself stays the standard OutSystems **Input** widget; native form **validation**
drives the Error state. This supersedes the bare `loop-text-field` restyle for new fields —
the CSS is shared (`src/blocks/loop-text-field.css`), so paste it once.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Field Wrapper page.

**What it is.** The Loop form field — a label row (required/optional/char-count), a native
restyled Input, and helper text, wrapped in one Block with a Size and Layout parameter.

**When to use**
- Collect single-line (or textarea) text/numbers with a label, optional helper text, a
  character limit, and validation/error state — and you want the label row (asterisk /
  `(optional)` / count) standardised across the app.

**When not to use** (reach for instead)
- Choose from preset options → **Dropdown / Select**.
- An on/off choice → **Switch** or **Checkbox**.
- A plain field with no label-row chrome → the bare `loop-field` restyle (`loop-text-field.md`).

**How to use**
- Drop the **FieldWrapper** Block; set `Size`, `Layout`, `IsRequired` / `IsOptional`,
  `ShowCharCount` + `MaxLength`. Put the native **Input** in the `Input` placeholder, the
  label in `Label`, and helper text in `Helper`. Native validation drives Error.

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/loop-text-field.css` | Theme CSS (paste **below** OutSystems UI; shared with Text Field — paste once) |
| `src/components/loop-field-count.js` | Script resource (Theme/Library), Include = Always — only when `ShowCharCount` is used |
| `tokens/component-field.css` → `dist/theme.css` | Theme CSS (adds the `--loop-field-*` tokens incl. the new label-row/count tokens) |

## Code to paste into ODC

> Copy the code below straight into ODC. The canonical source is the repo path in the summary — these blocks are generated from it (`node build/embed-handover-code.mjs`), so re-run after editing the source to keep the ticket in sync.

<details>
<summary><code>loop-text-field.css</code> → Theme CSS — paste below OutSystems UI (shared with Text Field — paste once)</summary>

```css
/* loop-text-field.css — Text Field: native Input/textarea restyle + .loop-field label wrapper */

/* ---- Field box — The Loop identity (Default / Filled / Focused share this) ---- */
.form-control[data-input],
.form-control[data-textarea] {
  height: auto;
  padding: var(--loop-field-padding-block, 18px) var(--loop-field-padding-inline, 16px);
  gap: var(--loop-field-gap, 8px);

  background-color: var(--color-bg-container-on-light-lowest);
  border: 1px solid var(--color-outline-on-light-default);
  border-radius: var(--loop-field-radius, 8px);
  color: var(--color-text-on-light-default);

  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-text-size, 16px);
  font-weight: var(--loop-field-text-weight, 400);
  line-height: var(--loop-field-text-leading, 16px);
  letter-spacing: var(--loop-field-text-tracking, 0.5px);
}

/* Textarea inherits the shared --loop-field-radius (8px soft-rounded default); no override needed. */

/* Regular (default) — overrides the shared rule's 18px (xLarge) padding-block to make a 40px single-line input. */
.form-control[data-input] {
  height: 40px;                  /* pinned height; border-box keeps it deterministic */
  padding-block: 11px;
}

/* Placeholder colour */
.form-control[data-input]::placeholder,
.form-control[data-textarea]::placeholder {
  color: var(--color-neutral-alpha-57);
  opacity: 1;                                                     /* Firefox dims placeholders by default */
}

/* Hover — subtle border darken */
.form-control[data-input]:hover,
.form-control[data-textarea]:hover {
  border-color: var(--color-outline-on-light-emphasis);
}

/* Focused — drawn as a 1px border + 1px inset box-shadow (not a 2px border) so border-width
   and padding stay constant, never nudging the text or clobbering the Search icon's padding-left. */
.form-control[data-input]:focus,
.form-control[data-input]:focus-visible,
.form-control[data-textarea]:focus,
.form-control[data-textarea]:focus-visible {
  outline: none;
  border-color: var(--color-outline-on-light-link-focused);
  box-shadow: inset 0 0 0 1px var(--color-outline-on-light-link-focused);
}

/* ---- Error — native .not-valid (set by OutSystems form validation) ---- */
.form-control[data-input].not-valid,
.form-control[data-textarea].not-valid {
  background-color: var(--color-bg-container-state-error-low);
  border-color: var(--color-outline-on-light-state-error-high);
  color: var(--color-text-on-state-error-emphasis);
}
.form-control[data-input].not-valid::placeholder,
.form-control[data-textarea].not-valid::placeholder {
  color: var(--color-text-on-state-error-emphasis);
}

/* ---- Warning — added modifier .is-warning (no native input warning state) ---- */
.form-control[data-input].is-warning,
.form-control[data-textarea].is-warning {
  background-color: var(--color-domain-state-warning-low);
  border-color: var(--color-outline-on-light-state-warning-high);
  color: var(--color-text-on-state-warning-emphasis);
}
.form-control[data-input].is-warning::placeholder,
.form-control[data-textarea].is-warning::placeholder {
  color: var(--color-text-on-state-warning-emphasis);
}

/* ---- Disabled — native [disabled] / aria-disabled; rendered borderless via the disable fill ---- */
.form-control[data-input][disabled],
.form-control[data-input][aria-disabled="true"],
.form-control[data-textarea][disabled],
.form-control[data-textarea][aria-disabled="true"] {
  background-color: var(--color-domain-state-disable-low);
  border-color: var(--color-domain-state-disable-low);
  color: var(--color-text-on-light-state-disabled);
}

/* ---- Read-Only — added modifier .is-read-only (borderless plain text) ---- */
.form-control[data-input].is-read-only,
.form-control[data-textarea].is-read-only {
  background-color: transparent;
  border-color: transparent;
  padding-inline: 0px;
}

/* ---- Sizes — native .input-large / .input-small + added .input-xlarge / .input-regular.
   Text/placeholder steps 16 / 14 / 13 / 12 (Figma 19336-9729) via --loop-field-text-size,
   mirroring the .loop-field--* wrapper modifiers so bare and wrapped fields render identically. ---- */
.form-control[data-input].input-xlarge {
  --loop-field-text-size: 16px;
  height: 56px;
  padding-block: var(--loop-field-padding-block, 18px);
}
.form-control[data-input].input-large {
  --loop-field-text-size: 14px;
  height: 48px;
  padding-block: 14px;
}
.form-control[data-input].input-regular {
  --loop-field-text-size: 13px;
  height: 40px;
  padding-block: 11px;
}
.form-control[data-input].input-small {
  --loop-field-text-size: 12px;
  height: 32px;
  padding-block: 8px;
}
/* No per-size focus padding compensation: the focus ring is an inset box-shadow, so padding stays constant. */

/* ============================================================
   Field wrapper — Label + Input + Helper layout (BEM, applied via Extended Class)
   ============================================================ */
.loop-field {
  display: flex;
  flex-direction: column;
  gap: var(--loop-field-label-gap, 6px);
}

/* Horizontal label — label sits inline, left of the input */
.loop-field--horizontal {
  flex-direction: row;
  align-items: center;
  gap: var(--space-small, 16px);
}

/* Rounded (pill) variant — opt-in per instance. Overrides the 8px soft-rounded default with the
   32px pill for the Text Input, Text Area, and Dropdown/Select inside this wrapper. The custom
   props cascade to the field box, native dropdown-display, and VirtualSelect wrapper alike. */
.loop-field--rounded {
  --loop-field-radius: var(--radius-pill);   /* 32px */
  --loop-select-radius: var(--radius-pill);  /* 32px */
}

/* Field Wrapper size — one modifier on the wrapper scales the WHOLE field: the label row and
   the input/placeholder text both step 16 / 14 / 13 / 12 across xLarge / Large / Regular /
   Small (Figma 19336-9729), plus the pinned input height. It works by setting the same custom
   props the label rule (--loop-field-label-*) and the field-box rule (--loop-field-text-*)
   already read, so the label scales "including the label" without extra markup. The bare
   .input-* size classes stay for standalone inputs (Search, plain Text Field). */
.loop-field--xlarge  { --loop-field-label-size: 16px; --loop-field-label-tracking: 0px;    --loop-field-text-size: 16px; }
.loop-field--large   { --loop-field-label-size: 14px; --loop-field-label-tracking: 0px;    --loop-field-text-size: 14px; }
.loop-field--regular { --loop-field-label-size: 13px; --loop-field-label-tracking: 0.25px; --loop-field-text-size: 13px; }
.loop-field--small   { --loop-field-label-size: 12px; --loop-field-label-tracking: 0.5px;  --loop-field-text-size: 12px; }
.loop-field--xlarge  .form-control[data-input] { height: 56px; padding-block: var(--loop-field-padding-block, 18px); }
.loop-field--large   .form-control[data-input] { height: 48px; padding-block: 14px; }
.loop-field--regular .form-control[data-input] { height: 40px; padding-block: 11px; }
.loop-field--small   .form-control[data-input] { height: 32px; padding-block: 8px; }

/* Styles the native label ([data-label]); the plain `label` selector is the fallback when the widget renders without it. */
.loop-field [data-label],
.loop-field label {
  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-label-size, 16px);
  font-weight: var(--loop-field-label-weight, 600);
  line-height: var(--loop-field-label-leading, 16px);
  letter-spacing: var(--loop-field-label-tracking, 0px);
  color: var(--color-text-on-light-default);
}
/* Required marker — hooks OutSystems' native .mandatory class, not a custom modifier. */
.loop-field [data-label].mandatory::after,
.loop-field label.mandatory::after {
  content: " *";
  color: var(--color-text-on-light-state-error);
  margin-left: var(--space-xtiny, 2px);
}

/* ============================================================
   FieldLabel row — leading required asterisk + label + (optional) + word-count badge.
   The Field Wrapper Block renders this row above (or, in horizontal layout, beside) the
   input. It composes the existing label typography rule above; the row chrome (asterisk /
   optional / count) is driven by the Block's IsRequired / IsOptional / ShowCharCount params.
   Figma node 19336-10226 (FieldLabel 15695:5723).
   ============================================================ */
.loop-field__label-row {
  display: flex;
  align-items: center;
  gap: var(--loop-field-label-row-gap, 4px);
}

/* Inside the FieldLabel row the leading .loop-field__required carries the required marker,
   so suppress the legacy trailing .mandatory::after — the native Label can still be Mandatory
   (for the accessibility hook) without rendering a second asterisk. */
.loop-field__label-row [data-label].mandatory::after,
.loop-field__label-row label.mandatory::after {
  content: none;
}

/* Leading required asterisk — Figma places it BEFORE the label (vs the legacy
   .mandatory::after trailing " *"). Solid red, top-aligned to the cap height. */
.loop-field__required {
  align-self: flex-start;
  color: var(--color-text-on-light-state-error);
  font-family: var(--font-family-label, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-label-size, 16px);
  line-height: var(--loop-field-label-leading, 16px);
}

/* "(optional)" tag — sits after the label, subdued 12px regular */
.loop-field__optional {
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-optional-size, 12px);
  font-weight: var(--font-weight-regular, 400);
  line-height: 1;
  letter-spacing: 0.5px;
  color: var(--color-text-on-light-subdued);
}

/* Word-count badge — pinned to the right end of the row; "NN/max", live-updated by
   loop-field-count.js (degrades to its static text when JS is off). */
.loop-field__count {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--loop-field-count-padding, 2px 4px);
  background-color: var(--loop-field-count-bg);
  border-radius: var(--loop-field-count-radius, 2px);
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-count-size, 12px);
  font-weight: var(--font-weight-regular, 400);
  line-height: 1;
  letter-spacing: 0.5px;
  color: var(--color-text-on-light-subdued);
  font-variant-numeric: tabular-nums;
}

/* Helper text — 12px, icon + message; colour follows the field state */
.loop-field__helper {
  display: flex;
  align-items: center;
  gap: var(--loop-field-helper-gap, 4px);
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-helper-size, 12px);
  line-height: 1;
  letter-spacing: 0.5px;
  color: var(--color-text-on-light-subdued);
}
.loop-field__helper--error    { color: var(--color-text-on-light-state-error); }
.loop-field__helper--warning  { color: var(--color-text-on-light-state-warning); }
.loop-field__helper--success  { color: var(--color-text-on-light-state-success); }
.loop-field__helper--disabled { color: var(--color-text-on-light-state-disabled); }

/* ---- Native validation message — restyle the platform's <span class="validation-message">
   to match the helper--error treatment (typography + colour only; native positioning untouched). ---- */
span.validation-message {
  font-family: var(--font-family-base, "Open Sans", system-ui, sans-serif);
  font-size: var(--loop-field-helper-size, 12px);
  line-height: 1;
  letter-spacing: 0.5px;
  color: var(--color-text-on-light-state-error);     /* Red/70, not the brighter Red/50 default */
}

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .form-control[data-input],
  .form-control[data-textarea] { transition: none; }
}
```

</details>
<details>
<summary><code>loop-field-count.js</code> → Script resource (Theme/Library), Include = Always — only needed when ShowCharCount is used</summary>

```js
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
```

</details>

## Block interface

**Placeholders:** `Label`, `Input`, `Helper`.

| Input | Type | Default | Effect |
|---|---|---|---|
| `Size` | FieldSize (Static Entity) | `Regular` | Wrapper modifier scaling label **and** input together: `.loop-field--xlarge` 56px/label 16 · `--large` 48/14 · `--regular` 40/13 · `--small` 32/12 |
| `Layout` | FieldLayout (Static Entity) | `Vertical` | `loop-field` (stacked) vs `loop-field loop-field--horizontal` (label beside input) |
| `State` | FieldState (Static Entity) | `Default` | see State mapping below |
| `LabelText` | Text | `""` | FieldLabel text |
| `IsRequired` | Boolean | `False` | leading `.loop-field__required` `*` + native Label `Mandatory` |
| `IsOptional` | Boolean | `False` | trailing `.loop-field__optional` `(optional)` tag |
| `ShowCharCount` | Boolean | `False` | `.loop-field__count` badge + `data-loop-field-count` hook |
| `MaxLength` | Integer | `0` | Input max length + count denominator (`NN/max`) |
| `Rounded` | Boolean | `False` | `loop-field--rounded` (32px pill) on the field box |

> `IsRequired` and `IsOptional` are mutually exclusive — a field is one or the other.

## State mapping (Figma "State" → OutSystems)
| The Loop | How |
|---|---|
| **Default / Filled / Focused** | native — base `.form-control[data-input]` (Focused = `:focus`) |
| **Error** | native — `.not-valid` (set automatically by OutSystems form validation) |
| **Warning** | added modifier — Extended Class `is-warning` on the Input |
| **Disabled** | native — Input widget *Enabled = False* (`[disabled]`) |
| **Read Only** | added modifier — Extended Class `is-read-only` on the Input |

## Size mapping (Figma "Size" → wrapper modifier)
One `.loop-field--*` modifier on the wrapper scales the label row **and** the input/placeholder
text together (Figma 19336-9729: label & field text both step 16/14/13/12). The bare `.input-*`
classes still exist for standalone inputs (Search, plain Text Field), but the Block uses the
wrapper modifier so a single `Size` drives the whole field.

| The Loop | Wrapper modifier | Input height | Label / text |
|---|---|---|---|
| **xLarge** | `.loop-field--xlarge` | 56px | 16px |
| **Large** | `.loop-field--large` | 48px | 14px |
| **Regular** (**default**) | `.loop-field--regular` | 40px | 13px |
| **Small** | `.loop-field--small` | 32px | 12px |

## Param → markup map
```
.loop-field  loop-field--<size>  [ --horizontal ][ --rounded ][ data-loop-field-count ]
  .loop-field__label-row
     [IsRequired]   <span class="loop-field__required">*</span>
     <Label placeholder>                      (native Label, Mandatory = IsRequired)
     [IsOptional]   <span class="loop-field__optional">(optional)</span>
     [ShowCharCount]<span class="loop-field__count">0/MaxLength</span>
  <Input placeholder>                          (native Input, class = State; Size is on the wrapper)
  [Helper]         <span class="loop-field__helper [--state]"><Helper placeholder></span>
```

## What's new vs the bare Text Field restyle
- **FieldLabel row** (`loop-field__label-row`) — leading red asterisk (`loop-field__required`,
  Figma places it *before* the label, vs the legacy trailing `.mandatory::after` — see FND-061),
  the `(optional)` tag (`loop-field__optional`), and the word-count badge (`loop-field__count`,
  bg `--color-bg-container-on-light-regular` #e7edf3, 2px radius).
- **Live character count** — `loop-field-count.js` reads the Input's `maxlength` and updates
  `NN/max` on input; degrades to static text with JS off.
- Packaged as a **Block** with `Size` / `Layout` / required / optional / count parameters.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover
> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —
> it does **not** author the CSS or the Web Component, so do the paste/import steps in the
> checklist first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, build an OutSystems Block "FieldWrapper" that lays out The Loop WBG
Field Wrapper (FieldLabel row + Input + Helper) around NATIVE OutSystems widgets, styled
purely by the already-pasted CSS + tokens via Extended Class.

Context (already done manually — do NOT re-create or edit these):
- dist/theme.css and loop-text-field.css are already pasted into the ODC Theme editor
  (below OutSystems UI). The look is pure CSS + var(--token) — do NOT write or edit CSS.
- loop-field-count.js is already imported as a Script resource (Include = Always); it
  defines the global helper window.LoopFieldCount and live-updates the character-count badge.

Task — create these elements, referencing each by the exact name given:

1. Create a Block named "FieldWrapper" with placeholders:
     Label  — the FieldLabel text (a native Label widget bound to LabelText, or an Expression)
     Input  — the native OutSystems Input / Text Area widget
     Helper — the helper text (leave empty to omit)
   input parameters:
     Size          : FieldSize (Static Entity)   : FieldSize.Regular
     Layout        : FieldLayout (Static Entity) : FieldLayout.Vertical
     State         : FieldState (Static Entity)  : FieldState.Default
     LabelText     : Text                        : ""
     IsRequired    : Boolean                     : False
     IsOptional    : Boolean                     : False
     ShowCharCount : Boolean                     : False
     MaxLength     : Integer                     : 0
     Rounded       : Boolean                     : False
   and Block events: OnChange.

   Static Entities — create these first. Give each a SINGLE Text attribute "Value" set as
   the record Identifier (delete the default Id/Label/Order/Is_Active). Each value IS the
   literal CSS class the markup expects, so inputs bind straight to it (no .Value suffix):
   - FieldSize: XLarge = "loop-field--xlarge", Large = "loop-field--large", Regular = "loop-field--regular", Small = "loop-field--small"
   - FieldLayout: Vertical = "loop-field", Horizontal = "loop-field loop-field--horizontal"
   - FieldState: Default = "default", Focused = "focused", Error = "not-valid", Warning = "is-warning", Disabled = "disabled", ReadOnly = "is-read-only"

2. Build the Block markup as nested Containers (set Extended Class via the Value expression
   — ODC requires an expression on every Extended Class):
   a. Root Container — ExtendedClass =
        Layout + " " + Size + If(Rounded, " loop-field--rounded", "")
      (the FieldLayout value carries "loop-field"; Size adds "loop-field--<size>", which
      scales the label row AND the input/placeholder text together). When ShowCharCount,
      also add the attribute data-loop-field-count = "" so the count script wires this field.
   b. Label-row Container (ExtendedClass = "loop-field__label-row") holding, in order:
        - If(IsRequired): an Expression <span class="loop-field__required" aria-hidden="true">*</span>
        - the Label placeholder (drop a Label widget bound to LabelText; set its Mandatory
          property = IsRequired for the native accessibility hook).
        - If(IsOptional): an Expression <span class="loop-field__optional">(optional)</span>
        - If(ShowCharCount): an Expression
            <span class="loop-field__count">0/<MaxLength></span>
   c. The Input placeholder — the consumer drops a native Input / Text Area here. Its
      ExtendedClass = State only (the wrapper Size already sets the height + text size;
      State adds is-warning / is-read-only where applicable, Error is native .not-valid).
      Bind the Input's Max Length = MaxLength.
   d. The Helper placeholder, wrapped in <span class="loop-field__helper"> (add the state
      modifier --error / --warning / --success / --disabled to match State).

3. State mapping note — Error is driven by native form Validation (.not-valid), Focused is
   native :focus, Disabled is the Input widget's Enabled = False. Only Warning (is-warning)
   and Read-Only (is-read-only) are added classes. Wire OnChange from the Input.

4. The count badge updates itself: window.LoopFieldCount auto-wires on render via a MutationObserver.
   If a field is added after first paint, call window.LoopFieldCount.refresh() in the screen's
   On Render via a "Run JavaScript" node — no id needed.

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values (styling
comes from var(--token) in the Theme). After generating, list every element you created by
name and flag any step you could not finish so I can do it manually.

Start with step 1 (the Block "FieldWrapper" interface + Static Entities) and show it to me
before building the markup.
```

## Checklist
- [ ] Rebuild + paste latest `dist/theme.css` into the ODC Theme editor (carries the new `--loop-field-*` label-row/count tokens).
- [ ] Paste `loop-text-field.css` into Theme CSS, **below** OutSystems UI (skip if already pasted for the Text Field).
- [ ] Import `loop-field-count.js` as a Script resource (Include = Always) — only when `ShowCharCount` is used.
- [ ] (Mentor) Create the **FieldWrapper** Block (placeholders + inputs + Static Entities).
- [ ] Use the native **Input** widget in the `Input` placeholder; bind a variable + a **Validation** for Error.
- [ ] 1-Click Publish → validate in a **real browser** at phone/tablet/desktop (never Service Studio Preview).

## Open findings linked to this work
- **FND-061** (consistency, low) — required asterisk placement: the FieldLabel row puts `*`
  *before* the label (Figma), while the legacy `.mandatory::after` trails it; both ship.
- Inherits the Text Field findings (register-only): **FND-018** (off-grid padding/gap),
  **FND-019** (resting border ≈ 1.45:1, SC 1.4.11), **FND-020** (placeholder subdued delta),
  **FND-021** (size system documented 3 vs 4 ways).
