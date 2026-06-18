#!/usr/bin/env node
/* build-theme.mjs — assembles dist/theme.css from tokens/*.css.
 *
 * Sectioning follows the OutSystems UI convention (see ODC.OutSystemsUI.scss):
 * a `/*!` header, a numbered "Section Index", and `/*! ===…=== *\/` banners per
 * section. `!` marks the comments as important so they survive minification.
 * (Decided 2026-06-17: match OutSystems UI's simple style — NOT inuitcss
 * `#SECTION` banners or dot-leader contents.)
 *
 * Comment-PRESERVING by design: lightningcss strips every comment, which leaves
 * the pasted ODC theme an unreadable wall of variables. This build keeps the
 * source provenance/finding notes AND adds the navigable index.
 *
 * SINGLE :root — every token file declares its own `:root { … }`; concatenating
 * them verbatim would emit many `:root` blocks. Instead we lift each file's
 * declarations into ONE consolidated `:root { … }` (section banners kept as inner
 * comments). Files with no `:root` (e.g. the color utility CLASSES) are emitted
 * after the consolidated block, each under its own banner.
 *
 * Usage:  node build/build-theme.mjs [--watch]
 * Order of sections follows the @import order in tokens/index.css. */
import { readFileSync, writeFileSync, mkdirSync, watch } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tokensDir = join(root, "tokens");
const blocksDir = join(root, "src", "blocks");
const outFile = join(root, "dist", "theme.css");

/* Per-file section metadata. `group` clusters files in the Section Index (one
 * group = one top-level number); `name` is the sub-entry when a group has >1
 * file. Single-file groups show just the group name. */
const META = {
  "colors.css":          { group: "Colors",        name: "Primitives" },
  "semantic-colors.css": { group: "Colors",        name: "Semantic (light)" },
  "color-utilities.css": { group: "Colors",        name: "Utilities" },
  "spacing.css":         { group: "Spacing",       name: "Scale" },
  "typography.css":      { group: "Typography",    name: "Type" },
  "radius.css":          { group: "Radius",        name: "Border Radius" },
  "shadows.css":         { group: "Shadows",       name: "Elevation" },
  "outsystems-ui-overrides.css": { group: "OutSystems UI", name: "Brand Overrides" },
  "component-field.css":        { group: "Components",       name: "Text Field" },
  "component-toggle.css":       { group: "Components",       name: "Toggle" },
  "component-note.css":         { group: "Components",       name: "Notes" },
  "component-popover.css":      { group: "Components",       name: "Popover" },
  "component-system-alert.css": { group: "Components",       name: "System Alert" },
  "component-tooltip.css":      { group: "Components",       name: "Tooltip" },
  /* Widget override sections (src/blocks/) */
  "loop-button.css":        { group: "Widget Overrides", name: "Button" },
  "loop-button-text.css":   { group: "Widget Overrides", name: "Button Text" },
  "loop-button-group.css":  { group: "Widget Overrides", name: "Button Group" },
  "loop-checkbox.css":      { group: "Widget Overrides", name: "Checkbox" },
  "loop-radio-button.css":  { group: "Widget Overrides", name: "Radio Button" },
  "loop-text-field.css":    { group: "Widget Overrides", name: "Text Field" },
  "loop-switch.css":        { group: "Widget Overrides", name: "Toggle / Switch" },
  "loop-tooltip.css":       { group: "Widget Overrides", name: "Tooltip" },
  /* Custom component BEM blocks (src/blocks/) */
  "loop-note.css":          { group: "Custom Components", name: "Notes" },
};

const RULE = "=".repeat(78); // section-banner rule width (OutSystems UI style)

/* External `@import url(...)` (e.g. Google Fonts) must sit at the very top of the
 * stylesheet — CSS ignores @import after any other rule. Token files declare them
 * inline (next to the related tokens); the build lifts them out and hoists them
 * above the head banner. Matches http(s) imports only — local `@import "./x"` is
 * resolved by importOrder(), not hoisted. */
const HOIST_IMPORT_RE = /^[ \t]*@import\s+url\(["']?https?:\/\/[^)]+\);[ \t]*\n?/gim;

function extractHoistedImports(body) {
  const imports = [];
  const stripped = body.replace(HOIST_IMPORT_RE, (m) => {
    imports.push(m.trim());
    return "";
  });
  return { stripped, imports };
}

function importOrder() {
  const index = readFileSync(join(tokensDir, "index.css"), "utf8");
  const files = [];
  const re = /@import\s+["']\.\/([^"']+)["']/g;
  let m;
  while ((m = re.exec(index))) files.push(m[1]);
  return files;
}

function blocksOrder() {
  const index = readFileSync(join(blocksDir, "index.css"), "utf8");
  const files = [];
  const re = /@import\s+["']\.\/([^"']+)["']/g;
  let m;
  while ((m = re.exec(index))) files.push(m[1]);
  return files;
}

function banner(title) {
  return `/*! ${RULE}\n${title}\n${RULE} */`;
}

/* Group files by their META.group, preserving first-seen order. Returns the
 * ordered group list + a group→files map, used for the N / N.M numbering. */
function groupFiles(files) {
  const order = [];
  const map = new Map();
  for (const file of files) {
    const group = META[file]?.group ?? "Misc";
    if (!map.has(group)) {
      map.set(group, []);
      order.push(group);
    }
    map.get(group).push(file);
  }
  return { order, map };
}

/* `N` for a single-file group, `N.M` for a file inside a multi-file group. */
function sectionNumber({ order, map }, file) {
  const group = META[file]?.group ?? "Misc";
  const n = order.indexOf(group) + 1;
  const list = map.get(group);
  return list.length === 1 ? `${n}` : `${n}.${list.indexOf(file) + 1}`;
}

/* Banner title: the group name for single-file groups, else the file's name. */
function sectionTitle(groups, file) {
  const group = META[file]?.group ?? "Misc";
  const list = groups.map.get(group);
  return list.length === 1 ? group : (META[file]?.name ?? file);
}

function buildIndex({ order, map }) {
  const lines = ["/*!", "Section Index:"];
  order.forEach((group, i) => {
    const n = i + 1;
    const list = map.get(group);
    lines.push(`${n}. ${group}`);
    if (list.length > 1) {
      list.forEach((file, j) => lines.push(`    ${n}.${j + 1}. ${META[file]?.name ?? file}`));
    }
  });
  lines.push("*/");
  return lines.join("\n");
}

/* Split a file body into its leading `:root { … }` declaration block and anything
 * outside it. Each token file is a single :root spanning ~the whole file, so the
 * inner = between the first `{` after `:root` and the file's last `}`; the preamble
 * (the provenance/header comment) is kept and re-emitted inside the merged block.
 * Files with no `:root` return inner:null and are emitted as standalone sections. */
function splitRoot(body) {
  const i = body.indexOf(":root");
  if (i === -1) return { preamble: "", inner: null };
  const open = body.indexOf("{", i);
  const close = body.lastIndexOf("}");
  return {
    preamble: body.slice(0, i).trimEnd(),
    inner: body.slice(open + 1, close).replace(/^\n+/, "").trimEnd(),
  };
}

function build() {
  const tokenFiles = importOrder();
  const blockFiles = blocksOrder();
  const files = [...tokenFiles, ...blockFiles];
  const groups = groupFiles(files);
  const stamp = new Date().toISOString().slice(0, 10);
  const head = [
    "/*!",
    'WBG · "The Loop" Design System — Theme',
    "Generated from tokens/*.css — do not edit directly. Rebuild: npm run build:theme.",
    `Paste the contents below into the ODC Theme editor.   (built ${stamp})`,
    "*/",
    "",
    buildIndex(groups),
  ].join("\n");

  const rootSections = []; // declarations lifted into the single consolidated :root
  const tailSections = []; // files with no :root (e.g. utility classes, block overrides)
  const hoisted = [];      // external @import url() lines, lifted to the top
  for (const file of files) {
    const title = `${sectionNumber(groups, file)}. ${sectionTitle(groups, file)}`;
    const dir = blockFiles.includes(file) ? blocksDir : tokensDir;
    const raw = readFileSync(join(dir, file), "utf8").trimEnd();
    const { stripped, imports } = extractHoistedImports(raw);
    hoisted.push(...imports);
    const body = stripped.trimEnd();
    const { preamble, inner } = splitRoot(body);
    if (inner === null) {
      tailSections.push(`${banner(title)}\n\n${body}`);
    } else {
      const parts = [banner(title)];
      if (preamble) parts.push(preamble);
      parts.push(inner);
      rootSections.push(parts.join("\n\n"));
    }
  }
  const rootBlock = `:root {\n${rootSections.join("\n\n\n")}\n}`;

  // Dedupe hoisted imports (first occurrence wins) and place them above everything.
  const importBlock = [...new Set(hoisted)].join("\n");
  const docHead = importBlock ? `${importBlock}\n\n\n${head}` : head;

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, [docHead, rootBlock, ...tailSections].join("\n\n\n") + "\n");
  console.log(
    `build:theme → dist/theme.css (${hoisted.length ? "1 @import, " : ""}1 :root, ${rootSections.length} token sections, ${tailSections.length} class sections)`
  );
}

build();

if (process.argv.includes("--watch")) {
  console.log("watching tokens/ and src/blocks/ …");
  let timer;
  const rebuild = () => { clearTimeout(timer); timer = setTimeout(build, 50); };
  watch(tokensDir, rebuild);
  watch(blocksDir, rebuild);
}
