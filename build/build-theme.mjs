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

/* The release version stamped at the top of dist/theme.css comes from package.json
 * — its single source of truth. Bumping a release = editing package.json "version"
 * (see RELEASING.md), then rebuilding so the pasted ODC theme self-identifies and
 * matches the CHANGELOG.md entry. */
const version = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;

/* Per-file section metadata. `group` clusters files in the Section Index (one
 * group = one top-level number); `name` is the sub-entry when a group has >1
 * file. Single-file groups show just the group name. */
const META = {
  "colors.css":          { group: "Colors",        name: "Primitives" },
  "semantic-colors.css": { group: "Colors",        name: "Semantic (light)" },
  "semantic-colors-dark.css": { group: "Colors",    name: "Semantic (dark / on-dark)" },
  "color-utilities.css": { group: "Colors",        name: "Utilities (roles)" },
  "color-utilities-primitives.css": { group: "Colors", name: "Utilities (primitives)" },
  "spacing.css":         { group: "Spacing",       name: "Scale" },
  "spacing-utilities.css": { group: "Spacing",     name: "Utilities (directional margin/padding)" },
  "typography.css":      { group: "Typography",    name: "Type" },
  "typography-utilities.css": { group: "Typography", name: "Utilities" },
  "typography-roles.css":     { group: "Typography", name: "Roles" },
  "radius.css":          { group: "Border",        name: "Radius" },
  "radius-utilities.css": { group: "Border",       name: "Radius utilities" },
  "border.css":          { group: "Border",        name: "Size (stroke width)" },
  "shadows.css":         { group: "Shadows",       name: "Elevation" },
  "shadow-utilities.css": { group: "Shadows",      name: "Utilities" },
  "outsystems-ui-overrides.css": { group: "OutSystems UI", name: "Brand Overrides" },
  "outsystems-ui-header.css":    { group: "OutSystems UI", name: "Layout Top — Header / Menu" },
  "outsystems-ui-side.css":      { group: "OutSystems UI", name: "Layout Side — Sidebar / Menu" },
  "outsystems-ui-side-responsive.css": { group: "OutSystems UI", name: "Layout Side — Responsive Nav Toggle" },
  "outsystems-ui-alert.css":     { group: "OutSystems UI", name: "Alert (→ Notes look)" },
  "outsystems-ui-feedback-message.css": { group: "OutSystems UI", name: "Feedback Message (→ Alerts look)" },
  "component-button.css":       { group: "Components",       name: "Button (heights)" },
  "component-field.css":        { group: "Components",       name: "Text Field" },
  "component-search.css":       { group: "Components",       name: "Search" },
  "component-datepicker.css":   { group: "Components",       name: "DatePicker" },
  "component-toggle.css":       { group: "Components",       name: "Toggle" },
  "component-note.css":         { group: "Components",       name: "Notes" },
  "component-popover.css":      { group: "Components",       name: "Popover" },
  "component-system-alert.css": { group: "Components",       name: "System Alert" },
  "component-alert.css":        { group: "Components",       name: "Alert" },
  "component-tooltip.css":      { group: "Components",       name: "Tooltip" },
  "component-tag.css":          { group: "Components",       name: "Tag" },
  "component-tabs.css":         { group: "Components",       name: "Tabs" },
  /* Widget override sections (src/blocks/) */
  "loop-headings.css":      { group: "Widget Overrides", name: "Headings (h1–h3)" },
  "loop-button.css":        { group: "Widget Overrides", name: "Button" },
  "loop-button-text.css":   { group: "Widget Overrides", name: "Button Text" },
  "loop-button-group.css":  { group: "Widget Overrides", name: "Button Group" },
  "loop-checkbox.css":      { group: "Widget Overrides", name: "Checkbox" },
  "loop-radio-button.css":  { group: "Widget Overrides", name: "Radio Button" },
  "loop-text-field.css":    { group: "Widget Overrides", name: "Text Field" },
  "loop-search.css":        { group: "Widget Overrides", name: "Search" },
  "loop-dropdown.css":      { group: "Widget Overrides", name: "Dropdown / Select" },
  "loop-datepicker.css":    { group: "Widget Overrides", name: "DatePicker" },
  "loop-switch.css":        { group: "Widget Overrides", name: "Toggle / Switch" },
  "loop-tooltip.css":       { group: "Widget Overrides", name: "Tooltip" },
  "loop-popover.css":       { group: "Widget Overrides", name: "Popover" },
  "loop-tabs.css":          { group: "Widget Overrides", name: "Tabs" },
  /* Custom component BEM blocks (src/blocks/) */
  "loop-note.css":          { group: "Custom Components", name: "Notes" },
  "loop-tag.css":           { group: "Custom Components", name: "Tag" },
  "loop-badge.css":         { group: "Custom Components", name: "Badge / Label (+ native Tag)" },
  "loop-badge-status.css":  { group: "Custom Components", name: "Badge Status" },
  "loop-pagination.css":    { group: "Custom Components", name: "Pagination" },
  "loop-card.css":          { group: "Widget Overrides", name: "Card" },
  "component-card.css":     { group: "Components",       name: "Card" },
  "component-modal.css":    { group: "Components",       name: "Modal" },
  "component-badge-status.css": { group: "Components",   name: "Badge Status" },
  "component-badge-label.css":  { group: "Components",   name: "Badge / Label" },
  "component-toast.css":        { group: "Components",   name: "Toast" },
  "component-upload.css":       { group: "Components",   name: "File Uploader" },
  "component-pagination.css":  { group: "Components",   name: "Pagination" },
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

/* Index of the first `{` that is NOT inside a `/* … *\/` comment, or -1. Used to
 * tell a real rule (e.g. an @font-face block) from prose in a file's preamble. */
function firstRuleBrace(s) {
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "/" && s[i + 1] === "*") {
      const end = s.indexOf("*/", i + 2);
      if (end === -1) break;
      i = end + 1; // skip the comment (loop's i++ lands past the `/`)
      continue;
    }
    if (s[i] === "{") return i;
  }
  return -1;
}

/* Index of the brace that CLOSES the `:root {` opened at `open` (the position of
 * its `{`), found by brace-counting and skipping `/* … *\/` comments. Returns -1
 * if unbalanced. Must NOT assume it's the file's last `}` — a file may carry
 * trailing top-level rules after its :root (e.g. typography.css's `html, body` +
 * `body.phone` responsive blocks). See the 2026-06-30 responsive-scope fix. */
function matchingBrace(s, open) {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === "/" && s[i + 1] === "*") {
      const end = s.indexOf("*/", i + 2);
      if (end === -1) return -1;
      i = end + 1;
      continue;
    }
    if (s[i] === "{") depth++;
    else if (s[i] === "}" && --depth === 0) return i;
  }
  return -1;
}

/* Split a file body into its leading `:root { … }` declaration block and anything
 * outside it. The inner = between the first `{` after `:root` and that block's OWN
 * matching `}` (not the file's last `}`); the preamble (the provenance/header
 * comment) is kept and re-emitted inside the merged block.
 * Files with no `:root` return inner:null and are emitted as standalone sections.
 *
 * `hoist`: real CSS that sits BEFORE the `:root` (e.g. typography.css's @font-face
 * rules). It must stay at TOP LEVEL — nesting an at-rule like @font-face inside the
 * consolidated :root is invalid CSS and silently breaks every token below it. When
 * the preamble contains a rule (a brace outside comments) we hoist the whole
 * pre-:root chunk out rather than folding it inside. See the 2026-06-25 font-face fix.
 *
 * `trailing`: real CSS that sits AFTER the `:root` close (e.g. typography.css's
 * `html, body` base rule + `body.tablet`/`body.phone` responsive overrides). Like
 * `hoist`, it must stay TOP LEVEL — folding it into the consolidated :root nests the
 * downstream component tokens inside `body.phone`, so they only apply on phones.
 * See the 2026-06-30 responsive-scope fix. */
function splitRoot(body) {
  // Match `:root {` as an actual SELECTOR (optional whitespace before the brace),
  // not the bare word ":root" — a class-only override file may mention ":root" in
  // its prose comments (e.g. "which only retints the :root --color-* vars"), and a
  // naive indexOf(":root") would mis-slice it into the consolidated :root block,
  // leaving it unclosed and breaking every token. See the 2026-06-22 alert restyle.
  const m = /:root\s*\{/.exec(body);
  if (!m) return { preamble: "", hoist: "", inner: null, trailing: "" };
  const open = m.index + m[0].length - 1; // position of the matched `{`
  const matched = matchingBrace(body, open);
  const close = matched === -1 ? body.lastIndexOf("}") : matched;
  const before = body.slice(0, m.index).trimEnd();
  const hasRule = firstRuleBrace(before) !== -1;
  return {
    preamble: hasRule ? "" : before,
    hoist: hasRule ? before : "",
    inner: body.slice(open + 1, close).replace(/^\n+/, "").trimEnd(),
    trailing: body.slice(close + 1).trim(),
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
    `Version ${version} · built ${stamp}   (see CHANGELOG.md)`,
    "Generated from tokens/*.css — do not edit directly. Rebuild: npm run build:theme.",
    "Paste the contents below into the ODC Theme editor.",
    "*/",
    "",
    buildIndex(groups),
  ].join("\n");

  const preRootSections = []; // top-level rules that must precede :root (e.g. @font-face)
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
    const { preamble, hoist, inner, trailing } = splitRoot(body);
    // Pre-:root rules (e.g. @font-face) carry their own explanatory comment; emit
    // them at top level so they are valid CSS, not buried inside the merged :root.
    if (hoist) preRootSections.push(`${banner(title)}\n\n${hoist}`);
    if (inner === null) {
      tailSections.push(`${banner(title)}\n\n${body}`);
    } else {
      const parts = [banner(title)];
      if (preamble) parts.push(preamble);
      parts.push(inner);
      rootSections.push(parts.join("\n\n"));
    }
    // Post-:root rules (e.g. typography.css's `html, body` + `body.phone` responsive
    // blocks) must also stay top level — folding them into the merged :root nests
    // every later component token inside `body.phone`. Emit after the consolidated root.
    if (trailing) tailSections.push(`${banner(title)}\n\n${trailing}`);
  }
  const rootBlock = `:root {\n${rootSections.join("\n\n\n")}\n}`;

  // Dedupe hoisted imports (first occurrence wins) and place them above everything.
  const importBlock = [...new Set(hoisted)].join("\n");
  const docHead = importBlock ? `${importBlock}\n\n\n${head}` : head;

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, [docHead, ...preRootSections, rootBlock, ...tailSections].join("\n\n\n") + "\n");
  console.log(
    `build:theme → dist/theme.css (${hoisted.length ? "1 @import, " : ""}${preRootSections.length ? `${preRootSections.length} pre-root, ` : ""}1 :root, ${rootSections.length} token sections, ${tailSections.length} class sections)`
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
