#!/usr/bin/env node
/* embed-handover-code.mjs — keep each handover ticket self-contained.
 *
 * Handover tickets are filed as GitHub Tasks (body = handover/<artifact>.md) so the
 * developer can add the code into ODC. Two generated sections are kept in sync from
 * source by this script (idempotent — re-run after editing a source file):
 *
 *   "## Code to paste into ODC"          — verbatim file contents in a collapsed <details>
 *                                          (project rule: the ticket CONTAINS the JS/CSS,
 *                                          it doesn't just point at a repo path).
 *   "## Build in ODC with Mentor Studio" — a ready-to-paste prompt for ODC Mentor Studio
 *                                          that scaffolds the OutSystems side (Block,
 *                                          attribute bindings, event wiring, Client
 *                                          Actions). See handover/MENTOR-STUDIO-PROMPT.md.
 *
 * A MAP entry is either `[[file, lang, dest], …]` (files only) or
 * `{ files: [[…]], mentor: { … } }` to override the auto-derived Mentor prompt with a
 * fully-filled one. When `mentor` is absent the prompt is derived from the artifact kind
 * (Web Component / native-widget restyle / Style-Guide reference).
 *
 * Usage: node build/embed-handover-code.mjs */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const handoverDir = join(root, "handover");
const MARKER = "## Code to paste into ODC";
const WIRING_MARKER = "## Event wiring (OnReady / OnDestroy)";
const MENTOR_MARKER = "## Build in ODC with Mentor Studio";

/* md file → the artifact(s) a developer hand-places into ODC, plus an optional `mentor`
 * spec for a fully-filled Mentor Studio prompt. Tokens travel via dist/theme.css (already
 * its own paste) so they are not duplicated here. */
const MAP = {
  "loop-button.md":          [["src/blocks/loop-button.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-button-group.md":    [["src/blocks/loop-button-group.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-button-text.md":     [["src/blocks/loop-button-text.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-checkbox.md":        [["src/blocks/loop-checkbox.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-radio-button.md":    [["src/blocks/loop-radio-button.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-switch.md":          [["src/blocks/loop-switch.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-text-field.md":      [["src/blocks/loop-text-field.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-field-wrapper.md": {
    files: [
      ["src/blocks/loop-text-field.css", "css", "Theme CSS — paste below OutSystems UI (shared with Text Field — paste once)"],
      ["src/components/loop-field-count.js", "js", "Script resource (Theme/Library), Include = Always — only needed when ShowCharCount is used"],
    ],
    mentor: {
      kind: "block",
      block: "FieldWrapper",
      helper: "window.LoopFieldCount",
      placeholders: [
        ["Label", "the FieldLabel text (a native Label widget bound to LabelText, or an Expression)"],
        ["Input", "the native OutSystems Input / Text Area widget"],
        ["Helper", "the helper text (leave empty to omit)"],
      ],
      inputs: [
        ["Size", "FieldSize (Static Entity)", "FieldSize.Regular"],
        ["Layout", "FieldLayout (Static Entity)", "FieldLayout.Vertical"],
        ["State", "FieldState (Static Entity)", "FieldState.Default"],
        ["LabelText", "Text", '""'],
        ["IsRequired", "Boolean", "False"],
        ["IsOptional", "Boolean", "False"],
        ["ShowCharCount", "Boolean", "False"],
        ["MaxLength", "Integer", "0"],
        ["Rounded", "Boolean", "False"],
      ],
      staticEntities: [
        { name: "FieldSize", attr: "Value", records: [
          ["XLarge", "loop-field--xlarge"], ["Large", "loop-field--large"],
          ["Regular", "loop-field--regular"], ["Small", "loop-field--small"]] },
        { name: "FieldLayout", attr: "Value", records: [
          ["Vertical", "loop-field"], ["Horizontal", "loop-field loop-field--horizontal"]] },
        { name: "FieldState", attr: "Value", records: [
          ["Default", "default"], ["Focused", "focused"], ["Error", "not-valid"],
          ["Warning", "is-warning"], ["Disabled", "disabled"], ["ReadOnly", "is-read-only"]] },
      ],
      events: ["OnChange"],
    },
  },
  "loop-search.md":          [["src/blocks/loop-search.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-dropdown.md":        [["src/blocks/loop-dropdown.css", "css", "Theme CSS — paste below OutSystems UI (provider CSS is runtime-injected)"]],
  "loop-datepicker.md":      {
    files: [
      ["src/blocks/loop-datepicker.css", "css", "Theme CSS — paste below OutSystems UI (Flatpickr provider CSS is runtime-injected)"],
      ["src/components/loop-datepicker-year-grid.js", "js", "Script resource (Theme/Library), Include = Always — register via loopDatePickerYearGrid() in the DatePicker's advanced Flatpickr config"],
    ],
    mentor: { kind: "restyle" },
  },
  "loop-tooltip.md":         [["src/blocks/loop-tooltip.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-note.md":            [["src/blocks/loop-note.css", "css", "Theme CSS (also folded into dist/theme.css)"]],
  "loop-tag.md":             [["src/blocks/loop-tag.css", "css", "Theme CSS (also folded into dist/theme.css)"]],
  "loop-badge.md":           [["src/blocks/loop-badge.css", "css", "Theme CSS (also folded into dist/theme.css)"]],
  "loop-card.md":            [["src/blocks/loop-card.css", "css", "Theme CSS (also folded into dist/theme.css)"]],
  "loop-button-dropdown.md": {
    files: [["src/components/loop-button-dropdown.js", "js", "Script resource (Theme/Library), Include = When invoked"]],
    wiring: {
      tag: "loop-button-dropdown",
      customEvents: [["action", "OnAction"], ["toggle", "OnToggle"]],
    },
  },
  "loop-split-btn.md":       [["src/blocks/loop-split-btn.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-popover.md":         [["src/blocks/loop-popover.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-tabs.md":            [["src/blocks/loop-tabs.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-table.md":           [["src/blocks/loop-table.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-modal.md": {
    files: [["src/components/loop-modal.js", "js", "Script resource (Theme/Library), Include = When invoked"]],
    wiring: {
      tag: "loop-modal",
      customEvents: [["open", "OnOpen"], ["close", "OnClose", "e.detail.reason"]],
    },
  },
  "loop-system-alert.md": {
    files: [["src/components/loop-system-alert.js", "js", "Script resource (Theme/Library), Include = Always"]],
    wiring: {
      tag: "loop-system-alert",
      customEvents: [["dismiss", "OnDismiss", "e.detail.type"], ["action", "OnAction", "e.detail.type"]],
    },
  },
  "loop-toast.md": {
    files: [["src/components/loop-toast.js", "js", "Script resource (Theme/Library), Include = Always"]],
    mentor: {
      kind: "web-component",
      block: "Toast",
      tag: "loop-toast",
      helper: "window.LoopToast",
      include: "Include = Always",
      inputs: [
        ["Type", "ToastType (Static Entity)", "ToastType.Default"],
        ["Position", "ToastPosition (Static Entity)", "ToastPosition.Bottom"],
        ["Title", "Text", '""'],
        ["Message", "Text", '""'],
        ["ButtonLabel", "Text", '""'],
        ["ButtonHref", "Text", '""'],
        ["Dismissible", "Boolean", "True"],
        ["Duration", "Integer", "5000"],
      ],
      staticEntities: [
        { name: "ToastType", attr: "Value", records: [
          ["Default", "default"], ["Success", "success"], ["Warning", "warning"],
          ["Error", "error"], ["Information", "information"]] },
        { name: "ToastPosition", attr: "Value", records: [
          ["Bottom", "bottom"], ["Top", "top"], ["BottomLeft", "bottom-left"],
          ["BottomRight", "bottom-right"], ["TopLeft", "top-left"], ["TopRight", "top-right"]] },
      ],
      events: ["OnAction", "OnDismiss"],
      attrs: [
        ["type", "Type"], ["position", "Position"], ["title", "Title"],
        ["message", "Message"], ["button-label", "ButtonLabel"], ["button-href", "ButtonHref"],
        ["dismissible", 'If(Dismissible, "true", "false")'], ["duration", "Duration"],
      ],
      customEvents: [["action", "OnAction"], ["dismiss", "OnDismiss"]],
      methods: ["show", "hide", "toggle"],
    },
  },
  "loop-upload.md": {
    files: [["src/components/loop-file-uploader.js", "js", "Script resource (Theme/Library), Include = Always"]],
    mentor: {
      kind: "web-component",
      block: "FileUploader",
      tag: "loop-file-uploader",
      include: "Include = Always",
      inputs: [
        ["Variant", "UploaderVariant (Static Entity)", "UploaderVariant.Dropzone"],
        ["Size", "UploaderSize (Static Entity)", "UploaderSize.XLarge"],
        ["State", "UploaderState (Static Entity)", "UploaderState.Enabled"],
        ["Label", "Text", '"Upload label"'],
        ["Placeholder", "Text", '"Select a file"   // input variant'],
        ["ButtonLabel", "Text", '"Upload Files"    // button variant'],
        ["Hint", "Text", '"Formats supported: JPG, PDF (Max 10 MB)"'],
        ["StatusText", "Text", '""'],
        ["Accept", "Text", '".jpg,.pdf"'],
        ["Multiple", "Boolean", "False"],
        ["Disabled", "Boolean", "False"],
      ],
      staticEntities: [
        { name: "UploaderVariant", attr: "Value", records: [
          ["Dropzone", "dropzone"], ["Input", "input"], ["Button", "button"]] },
        { name: "UploaderSize", attr: "Value", records: [
          ["XLarge", "xlarge"], ["Large", "large"], ["Regular", "regular"], ["Small", "small"]] },
        { name: "UploaderState", attr: "Value", records: [
          ["Enabled", "enabled"], ["Disabled", "disabled"], ["Success", "success"],
          ["Warning", "warning"], ["Error", "error"]] },
      ],
      events: ["OnChange", "OnRemove", "OnBrowse"],
      attrs: [
        ["variant", "Variant"], ["size", "Size"], ["state", "State"], ["label", "Label"],
        ["placeholder", "Placeholder"], ["button-label", "ButtonLabel"], ["hint", "Hint"],
        ["status-text", "StatusText"], ["accept", "Accept"],
        ["multiple", 'If(Multiple, "true", "false")'], ["disabled", 'If(Disabled, "true", "false")'],
      ],
      customEvents: [
        ["change", "OnChange", "JSON.stringify(e.detail.files)"],
        ["remove", "OnRemove", "e.detail.name"],
        ["browse", "OnBrowse"],
      ],
      methods: ["open", "addFiles", "setProgress", "removeFile", "clear"],
    },
  },
  "loop-alert.md": {
    files: [["src/components/loop-alert.js", "js", "Script resource (Theme/Library), Include = Always"]],
    wiring: {
      tag: "loop-alert",
      customEvents: [["dismiss", "OnDismiss", "e.detail.type"], ["action", "OnAction", "e.detail.type"]],
    },
  },
  "loop-badge-status.md":    [["src/blocks/loop-badge-status.css", "css", "Theme CSS (also folded into dist/theme.css)"]],
  "loop-color-reference.md": [["src/components/loop-color-reference.js", "js", "Add to Resources — load on the Style-Guide screen"]],
  "loop-type-reference.md":  [["src/components/loop-typography-reference.js", "js", "Add to Resources — load on the Style-Guide screen"]],
  "loop-shadow-reference.md":  [["src/components/loop-shadow-reference.js", "js", "Add to Resources — load on the Style-Guide screen"]],
  "loop-border-reference.md":  [["src/components/loop-border-reference.js", "js", "Add to Resources — load on the Style-Guide screen"]],
  "loop-spacing-reference.md": [["src/components/loop-spacing-reference.js", "js", "Add to Resources — load on the Style-Guide screen"]],
  "loop-class-inspector.md": [["src/components/loop-class-inspector.js", "js", "Add to Resources — load on the Style-Guide screen"]],
  /* Icon reference: embed only the component logic — the generated loop-icon-data.js (~205 KB)
     is its OWN Resource paste (like dist/theme.css), documented in the ticket, not inlined. */
  "loop-icon-reference.md": [["src/components/loop-icon-reference.js", "js", "Add to Resources — load on the Style-Guide screen, AFTER loop-icon-data.js"]],
  "EXAMPLE-rnt-segmented.md": {
    files: [["src/components/rnt-segmented.js", "js", "Script resource (Theme Library), Include = When invoked"]],
    wiring: {
      tag: "rnt-segmented",
      customEvents: [["change", "OnChange", "e.detail.value"]],
    },
  },
};

/* ── "## Code to paste into ODC" ─────────────────────────────────────────────── */
function section(artifacts) {
  const blocks = artifacts.map(([rel, lang, dest]) => {
    let code;
    try { code = readFileSync(join(root, rel), "utf8").replace(/\s+$/, ""); }
    catch { throw new Error(`missing source: ${rel}`); }
    const file = basename(rel);
    return [
      `<details>`,
      `<summary><code>${file}</code> → ${dest}</summary>`,
      ``,
      "```" + lang,
      code,
      "```",
      ``,
      `</details>`,
    ].join("\n");
  });
  return [
    MARKER,
    ``,
    `> Copy the code below straight into ODC. The canonical source is the repo path in the` +
      ` summary — these blocks are generated from it (\`node build/embed-handover-code.mjs\`),` +
      ` so re-run after editing the source to keep the ticket in sync.`,
    ``,
    ...blocks,
  ].join("\n");
}

/* ── "## Event wiring (OnReady / OnDestroy)" ─────────────────────────────────── */
/* Resolve { tag, customEvents } for a component that dispatches CustomEvents. Source is the
 * full `mentor` spec (when it carries tag + customEvents) or a lightweight `wiring` field;
 * null for components that emit nothing (references, restyles) so no section is generated. */
function wiringOf(entry) {
  const m = entry.mentor;
  if (m && m.tag && m.customEvents) return { tag: m.tag, customEvents: m.customEvents };
  if (entry.wiring && entry.wiring.tag && entry.wiring.customEvents) return entry.wiring;
  return null;
}

// "close" → "handleClose"; dash-joined events camel-case ("action-done" → "handleActionDone").
function handlerName(event) {
  return "handle" + event.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}

/* The two "Run JavaScript" bodies: OnReady attaches (storing each handler on $public so it can
 * be removed by reference) and OnDestroy removes. The resolver mirrors the shipped
 * window.LoopToast resolve() — the id may point at the element itself OR the wrapping
 * Block/Container. customEvents entries are [event, BlockEvent, detailArg?]. */
function eventWiring(tag, customEvents) {
  // pad the quoted event token so the handler column lines up
  const qW = Math.max(...customEvents.map(([ev]) => ev.length + 2));
  const q = (ev) => `'${ev}'`.padEnd(qW);

  const onReady = [
    `// Block OnReady — "Run JavaScript" node. Input: WidgetId = <ElementName>.Id`,
    `var root = document.getElementById($parameters.WidgetId);`,
    `var el = (root && root.tagName && root.tagName.toLowerCase() === '${tag}')`,
    `  ? root : (root ? root.querySelector('${tag}') : null);`,
    `if (el) {`,
    `  $public.el = el;                       // stash for OnDestroy cleanup`,
    ...customEvents.map(([ev, blockEv, detail]) =>
      `  $public.${handlerName(ev)} = function (e) { $actions.${blockEv}(${detail || ""}); };`),
    ...customEvents.map(([ev]) =>
      `  el.addEventListener(${q(ev)}, $public.${handlerName(ev)});`),
    `}`,
  ].join("\n");

  const onDestroy = [
    `// Block OnDestroy — "Run JavaScript" node. Uses the reference stashed in OnReady.`,
    `if ($public.el) {`,
    ...customEvents.map(([ev]) =>
      `  $public.el.removeEventListener(${q(ev)}, $public.${handlerName(ev)});`),
    `}`,
  ].join("\n");

  return { onReady, onDestroy };
}

function wiringSection(entry) {
  const w = wiringOf(entry);
  if (!w) return null;
  const { onReady, onDestroy } = eventWiring(w.tag, w.customEvents);
  const rows = w.customEvents.map(([ev, blockEv, detail]) =>
    `| \`${ev}\` | \`${blockEv}(${detail || ""})\` |`);
  return [
    WIRING_MARKER,
    ``,
    `> The component's CustomEvents are wired in the Block's **OnReady** and cleaned up in`,
    `> **OnDestroy** — the declarative "Handle Events" path is unreliable for custom elements.`,
    `> Give the \`<${w.tag}>\` element (or its wrapping Block) a **Name** and pass its`,
    `> platform-generated \`.Id\` to each "Run JavaScript" node as \`WidgetId\`. Paste these two`,
    `> blocks verbatim — they store each handler on \`$public\` so OnDestroy removes it by`,
    `> reference. (If your ODC version doesn't persist \`$public\` across OnReady/OnDestroy,`,
    `> stash the handlers on the element instead — \`el._loopHandlers = { … }\`.)`,
    ``,
    `| CustomEvent | raises Block event |`,
    `|---|---|`,
    ...rows,
    ``,
    `**OnReady** — resolve the element, attach listeners, stash for cleanup:`,
    ``,
    "```js",
    onReady,
    "```",
    ``,
    `**OnDestroy** — remove the listeners:`,
    ``,
    "```js",
    onDestroy,
    "```",
  ].join("\n");
}

/* ── "## Build in ODC with Mentor Studio" ────────────────────────────────────── */
// "loop-button-dropdown.md" → "ButtonDropdown"
function pascal(md) {
  return basename(md, ".md").replace(/^loop-/, "")
    .split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}

// Fully-filled Web Component prompt from a `mentor` spec.
function wcFilled(m) {
  const tag = m.tag;
  // pad input name/type columns to the widest entry so the list stays aligned
  const nameW = Math.max(...m.inputs.map(([n]) => n.length));
  const typeW = Math.max(...m.inputs.map(([, t]) => t.length));
  const inputs = m.inputs.map(([n, t, d]) => `     ${n.padEnd(nameW)} : ${t.padEnd(typeW)} : ${d}`).join("\n");
  const attrW = Math.max(...m.attrs.map(([a]) => a.length));
  const attrs = m.attrs.map(([a, e]) => `     ${a.padEnd(attrW)} = ${e}`).join("\n");
  const ce = m.customEvents.map(([c, ev]) => `the "${c}" CustomEvent triggers ${ev}`).join(", and ");

  // Static-Entity note (Type/Position/etc. are enumerations, not free Text).
  const seLines = (m.staticEntities || []).map((e) => {
    const recs = e.records.map(([r, v]) => `${r} = "${v}"`).join(", ");
    return `   - ${e.name}: ${recs}`;
  });
  const seBlock = seLines.length ? [
    `   Static Entities — create these first. Give each a SINGLE Text attribute "${(m.staticEntities[0] || {}).attr || "Value"}"`,
    `   set as the record Identifier, and delete the default Id/Label/Order/Is_Active attributes.`,
    `   Each record's value IS the literal the Web Component expects, so the input binds straight`,
    `   to the attribute (no .Value suffix). Model the matching inputs as the entity, NOT free Text:`,
    ...seLines,
  ] : [];

  // Step 4 — address by the platform-generated widget .Id, only if a global helper exists.
  const helperStep = m.helper ? [
    ``,
    `4. OutSystems generates element ids at runtime, so you address a specific instance by its`,
    `   widget's platform id — NOT a hand-typed string. Give the <${tag}> element (or its`,
    `   Block) a Name, then create client action(s) with a "Run JavaScript" node that take a`,
    `   WidgetId Text input set to <thatWidgetName>.Id and call the helper:`,
    ...m.methods.map((meth) => {
      const name = meth.charAt(0).toUpperCase() + meth.slice(1) + m.block;
      return `     - "${name}": ${m.helper}.${meth}($parameters.WidgetId);`;
    }),
    `   The helper resolves the <${tag}> from that id (it accepts the element id or a`,
    `   wrapping Block/Container id).`,
  ] : [
    ``,
    `4. This component exposes no global helper — drive it entirely through the Block inputs`,
    `   and events above; there is no id to pass.`,
  ];

  return [
    `Goal: In ODC Studio, wire up an OutSystems Block that wraps the already-imported custom`,
    `Web Component <${tag}> for the WBG "The Loop" design system.`,
    ``,
    `Context (already done manually — do NOT re-create or edit these):`,
    `- dist/theme.css (brand + component tokens) is already pasted into the ODC Theme editor.`,
    `- ${tag}.js is already imported as a Script resource (Theme/Library), ${m.include}. It`,
    `  defines the custom element <${tag}>${m.helper ? ` and the global helper ${m.helper}` : ``}.`,
    `- Do NOT write CSS, author or modify JavaScript, or edit the Theme. Your job is only the`,
    `  Block, its inputs/events, the attribute bindings, the event wiring${m.helper ? `, and the Client` : ``}`,
    m.helper ? `  Actions that drive the component.` : `  the component needs.`,
    ``,
    `Task — create these elements, referencing each by the exact name given:`,
    ``,
    `1. Create a Block named "${m.block}" with input parameters:`,
    inputs,
    `   and Block events: ${m.events.join(", ")}.`,
    ...seBlock,
    `   Do NOT add a string Id input or set the element's id — OutSystems generates ids at`,
    `   runtime (see step 4 for addressing).`,
    ``,
    `2. Place an HTML element <${tag}> in the Block. Set one attribute per input via a Value`,
    `   expression (ODC requires an expression on every attribute):`,
    attrs,
    `   Static-Entity inputs bind directly (e.g. type = Type) — the Value attribute is the`,
    `   record Identifier. Use If(flag,"true","false") for every Boolean (values, not presence).`,
    ``,
    `3. Wire CustomEvents to Block events: ${ce}. Do NOT use the declarative "Handle Events"`,
    `   path (unreliable for custom elements). Instead add a "Run JavaScript" node in the Block's`,
    `   OnReady that resolves the <${tag}>, addEventListener's each event (storing each handler on`,
    `   $public so it can be removed), and raises the matching Block event; add a second`,
    `   "Run JavaScript" node in OnDestroy that removeEventListener's them. The exact OnReady +`,
    `   OnDestroy code is in this handover's "## Event wiring (OnReady / OnDestroy)" section —`,
    `   paste it verbatim (you are placing provided JS, not authoring it).`,
    ...helperStep,
    ``,
    `Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values (styling`,
    `comes from var(--token) in the Theme). After generating, list every element you created by`,
    `name and flag any step you could not finish so I can do it manually.`,
    ``,
    `Start with step 1 (the Block "${m.block}" interface) and show it to me before wiring.`,
  ].join("\n");
}

// Fully-filled prompt for a restyle-based Block with placeholders (e.g. the Field Wrapper):
// the Block wraps NATIVE widgets dropped into placeholders, styled via Extended Class — there
// is no single custom element to bind attributes on, so this differs from wcFilled.
function blockFilled(m) {
  const nameW = Math.max(...m.inputs.map(([n]) => n.length));
  const typeW = Math.max(...m.inputs.map(([, t]) => t.length));
  const inputs = m.inputs.map(([n, t, d]) => `     ${n.padEnd(nameW)} : ${t.padEnd(typeW)} : ${d}`).join("\n");
  const phW = Math.max(...m.placeholders.map(([n]) => n.length));
  const phs = m.placeholders.map(([n, d]) => `     ${n.padEnd(phW)} — ${d}`).join("\n");
  const seLines = (m.staticEntities || []).map((e) => {
    const recs = e.records.map(([r, v]) => `${r} = "${v}"`).join(", ");
    return `   - ${e.name}: ${recs}`;
  });

  return [
    `Goal: In ODC Studio, build an OutSystems Block "${m.block}" that lays out The Loop WBG`,
    `Field Wrapper (FieldLabel row + Input + Helper) around NATIVE OutSystems widgets, styled`,
    `purely by the already-pasted CSS + tokens via Extended Class.`,
    ``,
    `Context (already done manually — do NOT re-create or edit these):`,
    `- dist/theme.css and loop-text-field.css are already pasted into the ODC Theme editor`,
    `  (below OutSystems UI). The look is pure CSS + var(--token) — do NOT write or edit CSS.`,
    `- loop-field-count.js is already imported as a Script resource (Include = Always); it`,
    `  defines the global helper ${m.helper} and live-updates the character-count badge.`,
    ``,
    `Task — create these elements, referencing each by the exact name given:`,
    ``,
    `1. Create a Block named "${m.block}" with placeholders:`,
    phs,
    `   input parameters:`,
    inputs,
    `   and Block events: ${m.events.join(", ")}.`,
    ``,
    `   Static Entities — create these first. Give each a SINGLE Text attribute "Value" set as`,
    `   the record Identifier (delete the default Id/Label/Order/Is_Active). Each value IS the`,
    `   literal CSS class the markup expects, so inputs bind straight to it (no .Value suffix):`,
    ...seLines,
    ``,
    `2. Build the Block markup as nested Containers (set Extended Class via the Value expression`,
    `   — ODC requires an expression on every Extended Class):`,
    `   a. Root Container — ExtendedClass =`,
    `        Layout + " " + Size + If(Rounded, " loop-field--rounded", "")`,
    `      (the FieldLayout value carries "loop-field"; Size adds "loop-field--<size>", which`,
    `      scales the label row AND the input/placeholder text together). When ShowCharCount,`,
    `      also add the attribute data-loop-field-count = "" so the count script wires this field.`,
    `   b. Label-row Container (ExtendedClass = "loop-field__label-row") holding, in order:`,
    `        - If(IsRequired): an Expression <span class="loop-field__required" aria-hidden="true">*</span>`,
    `        - the Label placeholder (drop a Label widget bound to LabelText; set its Mandatory`,
    `          property = IsRequired for the native accessibility hook).`,
    `        - If(IsOptional): an Expression <span class="loop-field__optional">(optional)</span>`,
    `        - If(ShowCharCount): an Expression`,
    `            <span class="loop-field__count">0/<MaxLength></span>`,
    `   c. The Input placeholder — the consumer drops a native Input / Text Area here. Its`,
    `      ExtendedClass = State only (the wrapper Size already sets the height + text size;`,
    `      State adds is-warning / is-read-only where applicable, Error is native .not-valid).`,
    `      Bind the Input's Max Length = MaxLength.`,
    `   d. The Helper placeholder, wrapped in <span class="loop-field__helper"> (add the state`,
    `      modifier --error / --warning / --success / --disabled to match State).`,
    ``,
    `3. State mapping note — Error is driven by native form Validation (.not-valid), Focused is`,
    `   native :focus, Disabled is the Input widget's Enabled = False. Only Warning (is-warning)`,
    `   and Read-Only (is-read-only) are added classes. Wire OnChange from the Input.`,
    ``,
    `4. The count badge updates itself: ${m.helper} auto-wires on render via a MutationObserver.`,
    `   If a field is added after first paint, call ${m.helper}.refresh() in the screen's`,
    `   On Render via a "Run JavaScript" node — no id needed.`,
    ``,
    `Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values (styling`,
    `comes from var(--token) in the Theme). After generating, list every element you created by`,
    `name and flag any step you could not finish so I can do it manually.`,
    ``,
    `Start with step 1 (the Block "${m.block}" interface + Static Entities) and show it to me`,
    `before building the markup.`,
  ].join("\n");
}

// Generic Web Component prompt (no `mentor` spec): point Mentor at this handover's API tables.
function wcGeneric(block, tag, jsFile, dest) {
  return [
    `Goal: In ODC Studio, wire up an OutSystems Block that wraps the already-imported custom`,
    `Web Component <${tag}> for the WBG "The Loop" design system.`,
    ``,
    `Context (already done manually — do NOT re-create or edit these):`,
    `- dist/theme.css and any block CSS are already pasted into the ODC Theme editor.`,
    `- ${jsFile} is already imported as a ${dest}. It defines the custom element <${tag}>.`,
    `- Do NOT write CSS, author/modify JavaScript, or edit the Theme. Your job is only the`,
    `  Block, its inputs/events, the attribute bindings, the event wiring, and any Client`,
    `  Actions that drive it.`,
    ``,
    `Task — reference every element by the exact name given. Take the exact inputs, attribute`,
    `bindings, events and any global helper from this handover's "API — Attributes / Methods /`,
    `Events" tables (paste the relevant table into the chat so I work from real names):`,
    ``,
    `1. Create a Block named "${block}". Add one input per attribute (use the documented`,
    `   default) and one event per CustomEvent. Model enumerable attributes (variant / type /`,
    `   size / position / status) as Static Entities — one record per allowed value, with a`,
    `   single Text attribute (e.g. "Value") set as the record Identifier (delete the default`,
    `   Id/Label/Order/Is_Active) holding the literal the component expects — not free Text;`,
    `   keep free-form text as Text and flags as Boolean. Do NOT add a string Id input or set`,
    `   the element's id; OutSystems generates ids at runtime (see step 4).`,
    `2. Place <${tag}> in the Block. Bind each attribute to its input with a Value expression`,
    `   (ODC requires one on every attribute). Static-Entity inputs bind directly (e.g.`,
    `   type = Type) since their Value attribute is the identifier; Booleans use`,
    `   If(Flag, "true", "false") — not presence.`,
    `3. Wire each CustomEvent to its Block event in the Block's OnReady (attach) and OnDestroy`,
    `   (remove) — not via the declarative "Handle Events" path, which is unreliable for custom`,
    `   elements. Add a "Run JavaScript" node in OnReady that resolves the <${tag}>,`,
    `   addEventListener's each event (storing each handler on $public), and raises the Block`,
    `   event; add a second in OnDestroy that removeEventListener's them. Paste the verbatim`,
    `   OnReady + OnDestroy code from this handover's "## Event wiring (OnReady / OnDestroy)" section.`,
    `4. If the component exposes a global helper (see its API section), give the element/Block`,
    `   a Name and pass its platform-generated runtime .Id, e.g.`,
    `   window.LoopX.show($parameters.WidgetId) where the WidgetId input = <WidgetName>.Id.`,
    ``,
    `Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values (styling`,
    `comes from var(--token) in the Theme). After generating, list every element you created by`,
    `name and flag anything you could not finish.`,
    ``,
    `Work iteratively: create the Block interface in step 1 and show it to me before wiring.`,
  ].join("\n");
}

// Native-widget restyle prompt: most work is using the right widget + Extended Class.
function restyleGeneric(block, cssFile) {
  return [
    `Goal: In ODC Studio, apply the WBG "The Loop" styling for ${block} to the native`,
    `OutSystems UI widget(s) it restyles.`,
    ``,
    `Context (already done): ${cssFile} and dist/theme.css are already pasted into the ODC`,
    `Theme editor (below OutSystems UI). The look is pure CSS + tokens — there is nothing for`,
    `you to style, and you must not write or edit CSS.`,
    ``,
    `Task — this component RESTYLES a native OutSystems widget, so the work is using the right`,
    `widget, not generating styles. Referencing elements by name:`,
    `1. Use the native OutSystems widget this maps to (see this handover's "When to use" /`,
    `   "Variant mapping" section), not a custom element.`,
    `2. Apply each variant via the Extended Class property only (e.g. ExtendedClass =`,
    `   "<documented-modifier>") — never mutate OutSystems UI internals.`,
    `3. Build any screen/Block logic the screen needs around it.`,
    ``,
    `Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values. After`,
    `generating, list what you created by name and flag anything you could not finish.`,
  ].join("\n");
}

// Style-Guide reference element: just place it on the Style Guide screen.
function refGeneric(block, tag, jsFile) {
  return [
    `Goal: In ODC Studio, place the Style-Guide reference element <${tag}> on the Style Guide`,
    `screen for the WBG "The Loop" design system.`,
    ``,
    `Context (already done): ${jsFile} is added under Resources and loads on the Style-Guide`,
    `screen; dist/theme.css is in the Theme. It is a self-contained display component.`,
    ``,
    `Task: add the <${tag}> element to the Style Guide screen where this specimen belongs.`,
    `There are no inputs or events to wire. Do NOT write CSS or JavaScript.`,
    ``,
    `Constraints: never edit the OutSystems UI module; add no styles. Report what you placed.`,
  ].join("\n");
}

function mentorPrompt(md, entry) {
  const m = entry.mentor;
  if (m && m.kind === "web-component") return wcFilled(m);
  if (m && m.kind === "block") return blockFilled(m);

  const arts = entry.files;
  const jsArt = arts.find((a) => a[1] === "js");
  const cssArt = arts.find((a) => a[1] === "css");
  const destStr = arts.map((a) => a[2]).join(" ");
  const kind = (m && m.kind) ||
    (jsArt ? (/Script resource/i.test(destStr) ? "web-component" : "reference") : "restyle");
  const block = pascal(md);

  if (kind === "web-component") {
    const tag = basename(jsArt[0], ".js");
    return wcGeneric(block, tag, basename(jsArt[0]), jsArt[2]);
  }
  if (kind === "reference") {
    const tag = (m && m.tag) || basename(jsArt[0], ".js");
    return refGeneric(block, tag, basename(jsArt[0]));
  }
  return restyleGeneric(block, basename(cssArt[0]));
}

function mentorSection(md, entry) {
  return [
    MENTOR_MARKER,
    ``,
    `> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover`,
    `> (Block, attribute bindings, event wiring, Client Actions). Mentor is a logic/data agent —`,
    `> it does **not** author the CSS or the Web Component, so do the paste/import steps in the`,
    `> checklist first. Reusable template + notes: \`handover/MENTOR-STUDIO-PROMPT.md\`.`,
    ``,
    "```",
    mentorPrompt(md, entry),
    "```",
  ].join("\n");
}

/* ── shared upsert: refresh a marked section in place, or insert it at a chosen anchor ── */
function upsert(text, marker, blockText, insertIdxFn) {
  const lines = text.split("\n");
  const block = blockText.split("\n");

  const markerIdx = lines.findIndex((l) => l.trimEnd() === marker);
  if (markerIdx !== -1) {
    // refresh in place: replace from the marker up to the next "## " heading, dropping the
    // blank lines that separated the old section from it (we re-add exactly one).
    let endIdx = lines.findIndex((l, i) => i > markerIdx && /^##\s+/.test(l));
    if (endIdx === -1) endIdx = lines.length;
    const before = lines.slice(0, markerIdx);
    const after = lines.slice(endIdx);
    return [...before, ...block, ...(after.length ? ["", ...after] : [])].join("\n");
  }

  let idx = insertIdxFn(lines);
  if (idx < 0) return text; // anchor missing → leave unchanged
  if (idx > lines.length) idx = lines.length;
  return [...lines.slice(0, idx), ...block, "", ...lines.slice(idx)].join("\n");
}

/* ── drive ────────────────────────────────────────────────────────────────────── */
let changed = 0;
for (const [md, raw] of Object.entries(MAP)) {
  const entry = Array.isArray(raw) ? { files: raw } : raw;
  const path = join(handoverDir, md);
  let text;
  try { text = readFileSync(path, "utf8"); } catch { console.warn(`skip (missing): ${md}`); continue; }
  const original = text;

  // 1) "## Code to paste into ODC" — after the "## Files" table
  let codeBlock;
  try { codeBlock = section(entry.files); }
  catch (e) { console.warn(`skip (${e.message}): ${md}`); continue; }
  text = upsert(text, MARKER, codeBlock, (lines) => {
    const filesIdx = lines.findIndex((l) => /^##\s+Files\b/.test(l));
    if (filesIdx === -1) return -1;
    const nextIdx = lines.findIndex((l, i) => i > filesIdx && /^##\s+/.test(l));
    return nextIdx === -1 ? lines.length : nextIdx;
  });

  // 2) "## Event wiring (OnReady / OnDestroy)" — just before the Mentor section (only for
  //    components that dispatch CustomEvents)
  const wiring = wiringSection(entry);
  if (wiring) {
    text = upsert(text, WIRING_MARKER, wiring, (lines) => {
      const mi = lines.findIndex((l) => l.trimEnd() === MENTOR_MARKER);
      if (mi !== -1) return mi;
      const ci = lines.findIndex((l) => /^##\s+Checklist\b/.test(l));
      return ci === -1 ? lines.length : ci;
    });
  }

  // 3) "## Build in ODC with Mentor Studio" — just before "## Checklist" (else at EOF)
  text = upsert(text, MENTOR_MARKER, mentorSection(md, entry), (lines) => {
    const ci = lines.findIndex((l) => /^##\s+Checklist\b/.test(l));
    return ci === -1 ? lines.length : ci;
  });

  if (text !== original) { writeFileSync(path, text); console.log(`updated: ${md}`); changed++; }
  else console.log(`unchanged: ${md}`);
}
console.log(`\n${changed} handover file(s) updated.`);
