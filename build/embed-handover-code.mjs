#!/usr/bin/env node
/* embed-handover-code.mjs — one-shot retrofit.
 *
 * Handover tickets are filed as GitHub Tasks (body = handover/<artifact>.md) so the
 * developer can add the code into ODC. Project rule: the ticket must CONTAIN the JS/CSS
 * to copy, not just point at a repo path. This inserts a "## Code to paste into ODC"
 * section (verbatim file contents in a collapsed <details>) right after the "## Files"
 * table of each handover. Idempotent: skips a file that already has the section.
 *
 * Usage: node build/embed-handover-code.mjs */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const handoverDir = join(root, "handover");
const MARKER = "## Code to paste into ODC";

/* md file → the artifact(s) a developer hand-places into ODC. Tokens travel via
 * dist/theme.css (already its own paste) so they are not duplicated here. */
const MAP = {
  "loop-button.md":          [["src/blocks/loop-button.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-button-group.md":    [["src/blocks/loop-button-group.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-button-text.md":     [["src/blocks/loop-button-text.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-checkbox.md":        [["src/blocks/loop-checkbox.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-radio-button.md":    [["src/blocks/loop-radio-button.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-switch.md":          [["src/blocks/loop-switch.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-text-field.md":      [["src/blocks/loop-text-field.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-tooltip.md":         [["src/blocks/loop-tooltip.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-note.md":            [["src/blocks/loop-note.css", "css", "Theme CSS (also folded into dist/theme.css)"]],
  "loop-tag.md":             [["src/blocks/loop-tag.css", "css", "Theme CSS (also folded into dist/theme.css)"]],
  "loop-tabs.md":            [["src/blocks/loop-tabs.css", "css", "Theme CSS — paste below OutSystems UI"]],
  "loop-button-dropdown.md": [["src/components/loop-button-dropdown.js", "js", "Script resource (Theme/Library), Include = When invoked"]],
  "loop-popover.md":         [["src/components/loop-popover.js", "js", "Script resource (Theme/Library), Include = When invoked"]],
  "loop-system-alert.md":    [["src/components/loop-system-alert.js", "js", "Script resource (Theme/Library), Include = Always"]],
  "loop-color-reference.md": [["src/components/loop-color-reference.js", "js", "Add to Resources — load on the Style-Guide screen"]],
  "loop-type-reference.md":  [["src/components/loop-type-reference.js", "js", "Add to Resources — load on the Style-Guide screen"]],
  "EXAMPLE-rnt-segmented.md":[["src/components/rnt-segmented.js", "js", "Script resource (Theme Library), Include = When invoked"]],
};

function section(artifacts) {
  const blocks = artifacts.map(([rel, lang, dest]) => {
    const code = readFileSync(join(root, rel), "utf8").replace(/\s+$/, "");
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

let changed = 0;
for (const [md, artifacts] of Object.entries(MAP)) {
  const path = join(handoverDir, md);
  let text;
  try { text = readFileSync(path, "utf8"); } catch { console.warn(`skip (missing): ${md}`); continue; }
  if (text.includes(MARKER)) { console.log(`skip (already has section): ${md}`); continue; }

  const lines = text.split("\n");
  const filesIdx = lines.findIndex((l) => /^##\s+Files\b/.test(l));
  if (filesIdx === -1) { console.warn(`skip (no "## Files"): ${md}`); continue; }
  // insert before the next "## " heading after the Files table
  let nextIdx = lines.findIndex((l, i) => i > filesIdx && /^##\s+/.test(l));
  if (nextIdx === -1) nextIdx = lines.length;

  const block = section(artifacts).split("\n");
  const out = [...lines.slice(0, nextIdx), ...block, "", ...lines.slice(nextIdx)];
  writeFileSync(path, out.join("\n"));
  console.log(`updated: ${md}`);
  changed++;
}
console.log(`\n${changed} handover file(s) updated.`);
