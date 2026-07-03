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
  "loop-button-dropdown.md": [["src/components/loop-button-dropdown.js", "js", "Script resource (Theme/Library), Include = When invoked"]],
  "loop-split-btn.md":       [["src/blocks/loop-split-btn.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-popover.md":         [["src/blocks/loop-popover.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-tabs.md":            [["src/blocks/loop-tabs.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-modal.md":           [["src/components/loop-modal.js",   "js", "Script resource (Theme/Library), Include = When invoked"]],
  "loop-system-alert.md":    [["src/components/loop-system-alert.js", "js", "Script resource (Theme/Library), Include = Always"]],
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
      customEvents: [["change", "OnChange"], ["remove", "OnRemove"], ["browse", "OnBrowse"]],
      methods: ["open", "addFiles", "setProgress", "removeFile", "clear"],
    },
  },
  "loop-alert.md":           [["src/components/loop-alert.js", "js", "Script resource (Theme/Library), Include = Always"]],
  "loop-badge-status.md":    [["src/blocks/loop-badge-status.css", "css", "Theme CSS (also folded into dist/theme.css)"]],
  "loop-color-reference.md": [["src/components/loop-color-reference.js", "js", "Add to Resources — load on the Style-Guide screen"]],
  "loop-type-reference.md":  [["src/components/loop-typography-reference.js", "js", "Add to Resources — load on the Style-Guide screen"]],
  "loop-shadow-reference.md":  [["src/components/loop-shadow-reference.js", "js", "Add to Resources — load on the Style-Guide screen"]],
  "loop-border-reference.md":  [["src/components/loop-border-reference.js", "js", "Add to Resources — load on the Style-Guide screen"]],
  "loop-spacing-reference.md": [["src/components/loop-spacing-reference.js", "js", "Add to Resources — load on the Style-Guide screen"]],
  "loop-class-inspector.md": [["src/components/loop-class-inspector.js", "js", "Add to Resources — load on the Style-Guide screen"]],
  "EXAMPLE-rnt-segmented.md":[["src/components/rnt-segmented.js", "js", "Script resource (Theme Library), Include = When invoked"]],
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
    `3. Wire CustomEvents to Block events: ${ce}. Implement with a "Run JavaScript" that`,
    `   addEventListener's each event on the <${tag}> element and raises the Block event.`,
    ...helperStep,
    ``,
    `Constraints: never edit the OutSystems UI module; add no CSS or hard-coded values (styling`,
    `comes from var(--token) in the Theme). After generating, list every element you created by`,
    `name and flag any step you could not finish so I can do it manually.`,
    ``,
    `Start with step 1 (the Block "${m.block}" interface) and show it to me before wiring.`,
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
    `3. Wire each CustomEvent to its Block event via a "Run JavaScript" handler that`,
    `   addEventListener's the event on the <${tag}> element and raises the Block event.`,
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

  // 2) "## Build in ODC with Mentor Studio" — just before "## Checklist" (else at EOF)
  text = upsert(text, MENTOR_MARKER, mentorSection(md, entry), (lines) => {
    const ci = lines.findIndex((l) => /^##\s+Checklist\b/.test(l));
    return ci === -1 ? lines.length : ci;
  });

  if (text !== original) { writeFileSync(path, text); console.log(`updated: ${md}`); changed++; }
  else console.log(`unchanged: ${md}`);
}
console.log(`\n${changed} handover file(s) updated.`);
