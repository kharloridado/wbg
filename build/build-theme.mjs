#!/usr/bin/env node
/* build-theme.mjs — assembles dist/tokens.css + dist/theme.css from tokens/*.css.
 *
 * TWO OUTPUTS (the 2026-07-16 token split — two ODC pastes):
 *   dist/tokens.css — design tokens ONLY: the single consolidated `:root` plus
 *     token-only scoped redefinitions (e.g. typography.css's `body.tablet` /
 *     `body.phone` responsive type steps). Paste #1 — the tokens theme.
 *   dist/theme.css  — everything else: hoisted external @imports, pre-root rules
 *     (@font-face), base/style rules, utility classes, widget/component overrides.
 *     Paste #2 — the style theme. Carries NO :root token declarations.
 * The split is cascade-safe in either paste order: scoped redefinitions like
 * `body.tablet { --font-size-1200: … }` beat `:root` by specificity, and the OSUI
 * `:root` retints still win over the framework because ODC loads theme CSS after
 * OutSystems UI.
 *
 * TOKEN CHANGE REPORT (every build): the assembled token set is diffed against the
 * committed baseline `tokens/tokens.lock.json`; added/modified/removed tokens are
 * printed classified as [branding] / [foundation] / [component] and recorded in
 * `tokens/TOKEN-CHANGELOG.md` (newest first). The lock is then rewritten. Both
 * files are tracked (dist/ is gitignored), so git history carries every token
 * change. First run seeds the baseline without listing every token as "added".
 *
 * Sectioning follows the OutSystems UI convention (see ODC.OutSystemsUI.scss):
 * a `/*!` header, a numbered "Section Index", and `/*! ===…=== *\/` banners per
 * section — in BOTH outputs, each with its own index. `!` marks the comments as
 * important so they survive minification. (Decided 2026-06-17: match OutSystems
 * UI's simple style — NOT inuitcss `#SECTION` banners or dot-leader contents.)
 *
 * Comment-PRESERVING by design: lightningcss strips every comment, which leaves
 * the pasted ODC theme an unreadable wall of variables. This build keeps the
 * source provenance/finding notes AND adds the navigable index.
 *
 * `--ship` (customer deliverable): strips the ordinary `/* … *\/` provenance and
 * finding notes from BOTH outputs but KEEPS the `/*!` important comments — the
 * head, the Section Index, and the per-section banners. The pasted ODC theme
 * stays navigable (TOC + sectioning) without the internal working notes.
 *
 * SINGLE :root — every token file declares its own `:root { … }`; concatenating
 * them verbatim would emit many `:root` blocks. Instead we lift each file's
 * declarations into ONE consolidated `:root { … }` in dist/tokens.css (section
 * banners kept as inner comments). Files with no `:root` (e.g. the color utility
 * CLASSES) are emitted into dist/theme.css, each under its own banner.
 *
 * Usage:  node build/build-theme.mjs [--watch] [--ship]
 * Order of sections follows the @import order in tokens/index.css. */
import { readFileSync, writeFileSync, mkdirSync, existsSync, watch } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tokensDir = join(root, "tokens");
const blocksDir = join(root, "src", "blocks");
const outFile = join(root, "dist", "theme.css");
const tokensOutFile = join(root, "dist", "tokens.css");
const lockFile = join(tokensDir, "tokens.lock.json");
const changelogFile = join(tokensDir, "TOKEN-CHANGELOG.md");

/* The release version stamped at the top of both dist files comes from package.json
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
  "loop-inline-loading.css": { group: "Custom Components", name: "Inline Loading" },
  "loop-card.css":          { group: "Widget Overrides", name: "Card" },
  "component-card.css":     { group: "Components",       name: "Card" },
  "component-modal.css":    { group: "Components",       name: "Modal" },
  "component-badge-status.css": { group: "Components",   name: "Badge Status" },
  "component-badge-label.css":  { group: "Components",   name: "Badge / Label" },
  "component-toast.css":        { group: "Components",   name: "Toast" },
  "component-upload.css":       { group: "Components",   name: "File Uploader" },
  "component-pagination.css":  { group: "Components",   name: "Pagination" },
  "component-table.css":       { group: "Components",   name: "Table (AG Grid look)" },
  "component-multilevel-dropdown.css": { group: "Components", name: "Multilevel Dropdown" },
  "loop-table.css":            { group: "Widget Overrides", name: "Table (AG Grid look)" },
};

/* Token classification for the change report: which maintenance bucket a token
 * belongs to, decided by its SOURCE file. `branding` = brand palette + semantic
 * roles + the OSUI brand retints; `foundation` = the non-color foundations
 * (spacing/type/radius/border/shadows); everything else (component-*.css and any
 * src/blocks :root vars) = `component`. */
const FOUNDATION_FILES = new Set(["spacing.css", "typography.css", "radius.css", "border.css", "shadows.css"]);
const BRANDING_FILES = new Set(["colors.css", "semantic-colors.css", "semantic-colors-dark.css"]);
function tokenKind(file) {
  if (BRANDING_FILES.has(file) || /^outsystems-ui-/.test(file)) return "branding";
  if (FOUNDATION_FILES.has(file)) return "foundation";
  return "component";
}

const RULE = "=".repeat(78); // section-banner rule width (OutSystems UI style)

/* External `@import url(...)` (e.g. Google Fonts) must sit at the very top of the
 * stylesheet — CSS ignores @import after any other rule. Token files declare them
 * inline (next to the related tokens); the build lifts them out and hoists them
 * above dist/theme.css's head banner (they load resources, they are not tokens).
 * Matches http(s) imports only — local `@import "./x"` is resolved by
 * importOrder(), not hoisted. */
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

/* `--ship` post-process: drop every ordinary `/* … *\/` note, KEEP the `/*!`
 * important comments (head, Section Index, section banners), then tidy the blank
 * lines and trailing whitespace those notes leave behind.
 *
 * A comment-aware scanner, NOT a regex: a `/*!` comment's own BODY may contain the
 * literal `/*` (e.g. the head's "tokens/*.css"), and since CSS comments don't nest,
 * a comment runs from `/*` to the NEXT `*\/`. Scanning for `*\/` from the opener —
 * never re-scanning the body for `/*` — keeps such comments whole; a regex that
 * hunts for `/*` mid-body would slice the keep-comment apart. */
function stripNotes(css) {
  let out = "";
  for (let i = 0; i < css.length; ) {
    if (css[i] === "/" && css[i + 1] === "*") {
      const keep = css[i + 2] === "!";
      const end = css.indexOf("*/", i + 2);
      const stop = end === -1 ? css.length : end + 2;
      if (keep) out += css.slice(i, stop);
      i = stop; // ordinary comment: skip it entirely
    } else {
      out += css[i++];
    }
  }
  return out
    .replace(/[ \t]+$/gm, "") // trim trailing whitespace
    .replace(/\n{3,}/g, "\n\n") // collapse blank-line runs to one
    .replace(/^\n+/, ""); // no leading blank lines
}

/* Group files by their META.group, preserving first-seen order. Returns the
 * ordered group list + a group→files map, used for the N / N.M numbering.
 * Computed PER OUTPUT DOCUMENT (a file like typography.css contributes token
 * sections to dist/tokens.css AND its @font-face/base rules to dist/theme.css,
 * numbered independently in each). */
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

/* Index of the brace that CLOSES the block opened at `open` (the position of
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

/* Extract `--name: value` declarations from a declaration block (comments
 * stripped, whitespace collapsed). Values here never contain a `;` (no data
 * URLs in tokens), so splitting on `;` is safe. */
function extractDecls(block) {
  const decls = [];
  for (const part of block.replace(/\/\*[\s\S]*?\*\//g, "").split(";")) {
    const m = /^\s*(--[\w-]+)\s*:\s*([\s\S]+?)\s*$/.exec(part);
    if (m) decls.push({ name: m[1], value: m[2].replace(/\s+/g, " ") });
  }
  return decls;
}

/* Partition a file's trailing chunk (top-level rules after its :root) into
 * TOKEN rules — every declaration is a custom property, e.g. the `body.tablet`/
 * `body.phone` responsive type steps — and STYLE rules (everything else, e.g.
 * the `html, body` base type rule). Token rules ship in dist/tokens.css (they
 * ARE token definitions, just device-scoped); style rules ship in dist/theme.css.
 * Comments preceding a rule travel with that rule. Rules with nested braces
 * (none today) are treated as style. */
function partitionTrailing(trailing) {
  const tokenParts = [];
  const styleParts = [];
  const tokenRules = []; // [{selector, body}] for the change report
  if (!trailing) return { token: "", style: "", tokenRules };
  let i = 0;
  let pending = ""; // comment block(s) preceding the next rule
  while (i < trailing.length) {
    if (/\s/.test(trailing[i])) { i++; continue; }
    if (trailing[i] === "/" && trailing[i + 1] === "*") {
      const end = trailing.indexOf("*/", i + 2);
      const stop = end === -1 ? trailing.length : end + 2;
      pending += (pending ? "\n" : "") + trailing.slice(i, stop);
      i = stop;
      continue;
    }
    const rel = firstRuleBrace(trailing.slice(i));
    if (rel === -1) { // stray non-rule text — keep it on the style side verbatim
      styleParts.push((pending ? pending + "\n" : "") + trailing.slice(i).trim());
      pending = "";
      break;
    }
    const open = i + rel;
    const close = matchingBrace(trailing, open);
    const stop = close === -1 ? trailing.length : close + 1;
    const rule = trailing.slice(i, stop);
    const body = trailing.slice(open + 1, close === -1 ? trailing.length : close);
    const bare = body.replace(/\/\*[\s\S]*?\*\//g, "");
    const isToken =
      !bare.includes("{") &&
      bare.split(";").every((d) => { const t = d.trim(); return !t || t.startsWith("--"); });
    if (isToken) {
      tokenParts.push((pending ? pending + "\n" : "") + rule);
      tokenRules.push({ selector: trailing.slice(i, open).trim().replace(/\s+/g, " "), body });
    } else {
      styleParts.push((pending ? pending + "\n" : "") + rule);
    }
    pending = "";
    i = stop;
  }
  if (pending) styleParts.push(pending); // orphan trailing comment
  return { token: tokenParts.join("\n\n"), style: styleParts.join("\n\n"), tokenRules };
}

/* ---- Token change report (branding / foundation / component) ------------- */

/* Diff the assembled token set against tokens/tokens.lock.json, print the
 * classified changes, record them in tokens/TOKEN-CHANGELOG.md (newest first),
 * and rewrite the lock. `tokens` = { "<scope> <name>": { value, file, kind } },
 * scope being `:root` or a device class like `body.phone`. Last declaration
 * wins for duplicate scope+name (matches the cascade of the assembled sheet). */
function reportTokenChanges(tokens) {
  const KINDS = ["branding", "foundation", "component"];
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";
  const sortedLock = () => {
    const out = {};
    for (const k of Object.keys(tokens).sort()) out[k] = tokens[k];
    return JSON.stringify({ version, tokens: out }, null, 2) + "\n";
  };

  if (!existsSync(lockFile)) {
    // First run: seed the baseline; do NOT list every token as "added".
    writeFileSync(lockFile, sortedLock());
    const counts = KINDS.map(
      (k) => `${Object.values(tokens).filter((t) => t.kind === k).length} ${k}`
    ).join(" · ");
    const entry = `## ${stamp} — v${version} — baseline\n\nBaseline created: ${Object.keys(tokens).length} tokens (${counts}).\n`;
    writeChangelogEntry(entry);
    console.log(`Token baseline created: ${Object.keys(tokens).length} tokens (${counts}) → tokens/tokens.lock.json`);
    return { added: 0, modified: 0, removed: 0 };
  }

  const prev = JSON.parse(readFileSync(lockFile, "utf8")).tokens ?? {};
  const changes = []; // {sign, kind, line}
  for (const key of Object.keys(tokens).sort()) {
    const cur = tokens[key];
    const old = prev[key];
    const label = key.startsWith(":root ") ? key.slice(6) : key;
    if (!old) {
      changes.push({ sign: "+", kind: cur.kind, line: `\`${label}\`: \`${cur.value}\` _(${cur.file})_` });
    } else if (old.value !== cur.value) {
      changes.push({ sign: "~", kind: cur.kind, line: `\`${label}\`: \`${old.value}\` → \`${cur.value}\` _(${cur.file})_` });
    } else if (old.file !== cur.file) {
      changes.push({ sign: "~", kind: cur.kind, line: `\`${label}\`: moved ${old.file} → ${cur.file}` });
    }
  }
  for (const key of Object.keys(prev).sort()) {
    if (!tokens[key]) {
      const label = key.startsWith(":root ") ? key.slice(6) : key;
      changes.push({ sign: "−", kind: prev[key].kind, line: `\`${label}\` (was \`${prev[key].value}\`, ${prev[key].file})` });
    }
  }

  const tally = { added: 0, modified: 0, removed: 0 };
  for (const c of changes) tally[c.sign === "+" ? "added" : c.sign === "~" ? "modified" : "removed"]++;

  if (!changes.length) {
    console.log("Token changes since last build: none");
    return tally;
  }

  console.log("Token changes since last build:");
  for (const kind of KINDS) {
    for (const c of changes.filter((x) => x.kind === kind)) {
      const plain = c.line.replace(/[`_]/g, "").replace(/\((?=[\w-]+\.css\)$)/, "(");
      console.log(`  [${kind.padEnd(10)}] ${c.sign} ${plain}`);
    }
  }

  const entryLines = [`## ${stamp} — v${version}`, ""];
  for (const kind of KINDS) {
    const list = changes.filter((x) => x.kind === kind);
    if (!list.length) continue;
    for (const c of list) entryLines.push(`- **[${kind}]** ${c.sign} ${c.line}`);
  }
  writeChangelogEntry(entryLines.join("\n") + "\n");
  writeFileSync(lockFile, sortedLock());
  console.log(
    `→ tokens/TOKEN-CHANGELOG.md updated (${tally.added} added, ${tally.modified} modified, ${tally.removed} removed); tokens/tokens.lock.json rewritten`
  );
  return tally;
}

const CHANGELOG_HEADER = `# Token Changelog

Auto-generated by \`npm run build:theme\` — every build diffs the assembled design
tokens against the \`tokens/tokens.lock.json\` baseline and records added (+),
modified (~) and removed (−) tokens here, newest first, classified
**branding** / **foundation** / **component**. Do not edit by hand.
`;

/* Prepend a new entry directly under the header (newest first). */
function writeChangelogEntry(entry) {
  let existing = existsSync(changelogFile) ? readFileSync(changelogFile, "utf8") : CHANGELOG_HEADER;
  const at = existing.indexOf("\n## ");
  const head = at === -1 ? existing.replace(/\n*$/, "\n") : existing.slice(0, at + 1);
  const rest = at === -1 ? "" : existing.slice(at + 1);
  writeFileSync(changelogFile, `${head}\n${entry.replace(/\n*$/, "\n")}${rest ? "\n" + rest : ""}`);
}

/* --------------------------------------------------------------------------- */

function build() {
  const tokenFiles = importOrder();
  const blockFiles = blocksOrder();
  const files = [...tokenFiles, ...blockFiles];
  const stamp = new Date().toISOString().slice(0, 10);

  /* First pass: read + split every file, deciding which output(s) it feeds. */
  const parts = [];
  const hoisted = []; // external @import url() lines → top of dist/theme.css
  for (const file of files) {
    const dir = blockFiles.includes(file) ? blocksDir : tokensDir;
    const raw = readFileSync(join(dir, file), "utf8").trimEnd();
    const { stripped, imports } = extractHoistedImports(raw);
    hoisted.push(...imports);
    const body = stripped.trimEnd();
    const { preamble, hoist, inner, trailing } = splitRoot(body);
    const { token: tokenTrailing, style: styleTrailing, tokenRules } = partitionTrailing(trailing);
    parts.push({ file, body, preamble, hoist, inner, tokenTrailing, styleTrailing, tokenRules });
  }

  /* Which files contribute sections to which document (Section Index numbering
   * is computed per document). */
  const tokenDocFiles = parts.filter((p) => p.inner !== null || p.tokenTrailing).map((p) => p.file);
  const themeDocFiles = parts
    .filter((p) => p.hoist || p.inner === null || p.styleTrailing)
    .map((p) => p.file);
  const tokenGroups = groupFiles(tokenDocFiles);
  const themeGroups = groupFiles(themeDocFiles);
  const titleIn = (groups, file) => `${sectionNumber(groups, file)}. ${sectionTitle(groups, file)}`;

  /* Second pass: assemble both documents + collect the token set for the report. */
  const rootSections = [];       // tokens.css — declarations lifted into the single :root
  const tokenTailSections = [];  // tokens.css — device-scoped token redefinitions
  const preRootSections = [];    // theme.css — top-level rules hoisted from before a :root (@font-face)
  const tailSections = [];       // theme.css — class files + trailing style rules
  const tokens = {};             // "<scope> <name>" → { value, file, kind } (last wins, like the cascade)
  for (const p of parts) {
    const kind = tokenKind(p.file);
    if (p.hoist) preRootSections.push(`${banner(titleIn(themeGroups, p.file))}\n\n${p.hoist}`);
    if (p.inner === null) {
      tailSections.push(`${banner(titleIn(themeGroups, p.file))}\n\n${p.body}`);
    } else {
      const sect = [banner(titleIn(tokenGroups, p.file))];
      if (p.preamble) sect.push(p.preamble);
      sect.push(p.inner);
      rootSections.push(sect.join("\n\n"));
      for (const d of extractDecls(p.inner)) tokens[`:root ${d.name}`] = { value: d.value, file: p.file, kind };
    }
    if (p.tokenTrailing) {
      tokenTailSections.push(`${banner(titleIn(tokenGroups, p.file))}\n\n${p.tokenTrailing}`);
      for (const r of p.tokenRules)
        for (const d of extractDecls(r.body)) tokens[`${r.selector} ${d.name}`] = { value: d.value, file: p.file, kind };
    }
    if (p.styleTrailing) tailSections.push(`${banner(titleIn(themeGroups, p.file))}\n\n${p.styleTrailing}`);
  }
  const rootBlock = `:root {\n${rootSections.join("\n\n\n")}\n}`;

  const tokensHead = [
    "/*!",
    'WBG · "The Loop" Design System — Design Tokens',
    `Version ${version} · built ${stamp}   (see CHANGELOG.md + tokens/TOKEN-CHANGELOG.md)`,
    "Generated from tokens/*.css — do not edit directly. Rebuild: npm run build:theme.",
    "Design tokens ONLY (single :root + device-scoped redefinitions). Paste #1 of 2",
    "into the ODC Theme editor — the classes/overrides live in dist/theme.css (paste both).",
    "*/",
    "",
    buildIndex(tokenGroups),
  ].join("\n");

  const themeHead = [
    "/*!",
    'WBG · "The Loop" Design System — Theme (classes & overrides)',
    `Version ${version} · built ${stamp}   (see CHANGELOG.md)`,
    "Generated from tokens/*.css + src/blocks/*.css — do not edit directly. Rebuild: npm run build:theme.",
    "Carries NO design tokens — those live in dist/tokens.css. Paste #2 of 2 into",
    "the ODC Theme editor (paste both).",
    "*/",
    "",
    buildIndex(themeGroups),
  ].join("\n");

  // Dedupe hoisted imports (first occurrence wins) and place them above everything.
  const importBlock = [...new Set(hoisted)].join("\n");
  const themeDocHead = importBlock ? `${importBlock}\n\n\n${themeHead}` : themeHead;

  const ship = process.argv.includes("--ship");
  let tokensOut = [tokensHead, rootBlock, ...tokenTailSections].join("\n\n\n") + "\n";
  let themeOut = [themeDocHead, ...preRootSections, ...tailSections].join("\n\n\n") + "\n";
  if (ship) {
    tokensOut = stripNotes(tokensOut);
    themeOut = stripNotes(themeOut);
  }

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(tokensOutFile, tokensOut);
  writeFileSync(outFile, themeOut);
  console.log(
    `build:theme${ship ? ":ship" : ""} → dist/tokens.css (1 :root, ${Object.keys(tokens).length} tokens, ${rootSections.length}+${tokenTailSections.length} sections) + dist/theme.css (${hoisted.length ? "1 @import, " : ""}${preRootSections.length} pre-root, ${tailSections.length} class sections${ship ? "; notes stripped, TOC + banners kept" : ""})`
  );
  reportTokenChanges(tokens);
}

build();

if (process.argv.includes("--watch")) {
  console.log("watching tokens/ and src/blocks/ …");
  let timer;
  const rebuild = () => { clearTimeout(timer); timer = setTimeout(build, 50); };
  watch(tokensDir, rebuild);
  watch(blocksDir, rebuild);
}
