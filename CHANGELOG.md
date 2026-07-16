# Changelog

All notable changes to the WBG · **"The Loop"** design system are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the
project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html) in the **0.x**
range — pre-1.0, so token/class renames are expected and are **not** treated as breaking.

Each version below is the value stamped at the top of `dist/tokens.css` + `dist/theme.css`
(the two artifacts pasted into the ODC Theme editor) for that release — the theme always self-identifies with
the version of its changelog entry. See [`RELEASING.md`](./RELEASING.md) for how a release
is cut. "Shipped" = merged to `main`; only board-**Approved** items reach an OutSystems
build.

## [Unreleased]

### Added
- **AG Grid — row-number index column** (Figma "AG Grid" `columnNumbers`, node 25983-72091).
  Turns on AG Grid's built-in `rowNumbers` (Community, v33.1+) in
  `loop-ag-grid-enterprise.grid-options.js` — a left-pinned index column that auto-renumbers on
  sort/filter/scroll. Under the existing §1 theme params it already lands on the Figma index look
  (60px, Low `#f5f7f9` fill, right-aligned `#000d1ab2`, pinned 1px right divider); `loop-ag-grid.css`
  §10 only drops the numbers from AG's header-bold 700 to regular **400** + `tabular-nums` to match.
  ⚠ `rowNumbers` is **initial-only** — it must be merged into the grid options before `createGrid`
  (the GridOptions input); a later `AgGridAPI.setGridOption` is silently ignored. Handover updated
  (`handover/loop-ag-grid.md`). Verified live against the deployed grid 2026-07-16.
- **Dropdown Tags — Field Wrapper size ramp** (Figma 18830-17324 "How To Use — Sizes", frozen
  into `loop/refs/cmp-dropdown-tags/` as the Sizes section + `figma-sizes.png`). The same
  `.loop-field--{xlarge,large,regular,small}` wrapper modifier that sizes every other control
  now scales the whole tags field: field 64/56/44/32, chips 40/40/32/24 (Large shrinks only the
  field — chips first step down at Regular), text 16/14/13/12, icons 20/20/16/12, and the icon
  gutter tracks along (72/72/60/48). The unmodified default **is** the xLarge scale (the
  component's Figma default — unlike the Text Field's Regular). Border radius stays the shared
  8px `--loop-field-radius` at every size, so the `.loop-field--rounded` pill variant already
  applies. Also fixes a latent clamp: OSUI pins `min-height: 40px` on the tags toggle at 0,3,0,
  which silently floored the field — invisible until Small's 32px needed to go under it.
  All in `loop-dropdown-tags.css` §9; nothing on the provider or the fit script changes
  (the "+N" is measured, so it recomputes per size on its own).
- **Dropdown Tags — checkmark balloon + search in the field** (Figma 18830-18200, frozen into
  `loop/refs/cmp-dropdown-tags/` as the Open-state section). The option list drops its checkboxes
  — selected rows read as a `#e7edf3` fill with a right-aligned 16px FA check — on white 14px rows
  at a 37px rhythm (`optionHeight` provider option), 8px radius, `0 2px 3px` shadow (token gap →
  FND-073). Type-to-filter moves **out of the balloon and into the field**: `loop-dropdown-tags.js`
  (renamed from `loop-dropdown-tags-fit.js`) injects a combobox proxy input after the chips and
  reassigns the provider's `$searchInput` to it — killing VirtualSelect's focus-stealing guards —
  with Arrow/Enter/Escape handled at the proxy, `aria-activedescendant` mirrored, the "+N" pill
  relocated after the typing slot, and the balloon's search row (plus Select-All) hidden behind a
  script-stamped marker class so the stock search survives if the script is absent. Balloon CSS is
  scoped to the provider's mirrored wrapper classes because ODC appends the balloon to `<body>`
  without the OSUI root class. New `--loop-select-option-*` tokens.
- **Dropdown Tags — one-line tag row with a width-aware "+N" pill** (Figma 18830-17333,
  overflow state 18830-16426, frozen as `loop/refs/cmp-dropdown-tags/`). Back in scope after
  the 2026-07-07 de-scope, and **rebuilt from scratch** rather than restored from `149022f`.
  New `src/blocks/loop-dropdown-tags.css` (VirtualSelect Tags restyle: 8px field, 16px text,
  neutral 48px chips with the cross back *beside* the label, FA 6 Pro icons, and the row
  forced to `nowrap` + `overflow: hidden`) and `src/components/loop-dropdown-tags-fit.js`
  (measures the rendered row and drives the provider's `noOfDisplayValues` so the "+N" count
  reflects what actually fits at the current width — the provider option alone is a fixed
  count and cannot express "one line"). New `--loop-multiselect-*` / `--loop-select-tag-*`
  tokens. The field never grows to a second row even with the script absent.
- **Field Wrapper size + state cascade** (Figma 19336-9726 / 19336-17818 / 17191-8819 /
  25862-14729, frozen as `loop/refs/cmp-field-sizing/`): one `.loop-field--{xlarge,large,
  regular,small}` on the wrapper now scales **every control inside** — input/textarea text
  + leading (16/16 · 14/16 · 13/14 · 12/12), Search glass (20/20/16/12 at 44/44/40/32
  pad-left), Checkbox (28/24/20/16 box + label + 20/20/16/14 group column gap) and
  Toggle (56×32/48×26/40×20/32×16) — with an explicit per-control size class
  (`.input-*`, `.loop-checkbox-*`, `.loop-toggle-*`) still winning inside a
  differently-sized wrapper. New wrapper **state** modifiers `.loop-field--error/
  --warning/--disabled/--read-only` recolor control + label row + helper in one class
  (mirroring `.not-valid`/`.is-warning`/`[disabled]`/`.is-read-only`).
- **Toggle ON-thumb check glyph** (FND-026 update): the checked thumb now renders the FA 6
  Pro solid check, glyph box = thumb − 2×padding (16/14/12/8); colour inferred as
  `Domain/Interactive/Enabled Primary` pending the unpublished token.

### Fixed
- **Toggle geometry re-aligned to the Main Library (2) Sizes ref** (25862-14729): per-size
  thumb/padding are now 24/4 · 20/3 · 16/2 · 12/2 (the old build extrapolated 24/18/12/8
  at a constant 4px padding from the single-size ref); toggle label + row min-height now
  step with the size (16/18 · 14/16 · 13/15 · 12/14, row 40/40/32/32) and the family
  default is **Regular** (was xLarge label metrics on a Regular track).
- **Search glass icon per size** (17191-8819): Regular is 16px (was 20px) and Small 12px
  (was 16px), insets 16/16/16/12 — bare `.input-*` classes and the wrapper cascade share
  one prop set (the `--loop-search-*-small` token pair is superseded).
- **Small field inline padding** is 12px per Figma 19336-9755 (was 16px) — applies to
  `.input-small` and `.loop-field--small`, and keeps the Small search pad-left math
  (12 + 12 + 8 = 32) exact.
- **Checkbox Regular label tracking** corrected to 0 (was 0.25px — that's the Small step
  per 19336-17818); horizontal group column gap now steps 20/20/16/14 (was a flat 20px).
- **Search Field label→input gap** built at the ref's 4px (family default is 6px) — logged
  as **FND-069** (consistency, register-only).
- **System Alert — per-element text/icon colors rebuilt faithful to Figma node 17873-7408**,
  reversing the FND-048 "normalize to single-line" disposition (per-layout faithful, the
  FND-062 Alert precedent): multi-line error message/action → white-90, multi-line
  informative action → pure white, multi-line offline message → white-75 (new
  `--loop-sysalert-*-multi` tokens in `tokens/component-system-alert.css` + `.lsa--multiline`
  overrides in `loop-system-alert.js`/`.css`); left/dismiss icons on the dark types
  (error/informative/offline) → pure white (`Icon/On Dark/Emphasis`); System Alert icons now
  render **Solid** (was Regular). The **warning title** is now the sticker's white-75 —
  ≈1.9:1 on the amber bg, **filed as FND-067** (GitHub Bug
  [#141](https://github.com/kharloridado/wbg/issues/141), awaiting designer) per the
  fidelity-first rule. The stale `--loop-sysalert-*-text` rules in the light-DOM mirror
  `loop-system-alert.css` were resynced to the shadow CSS in the same pass.
- **Button — label, icon and gap now scale with the size modifier** (they were frozen at
  16px label / unscaled icons for every size except a 14px Small). Deep-pull of Figma node
  15597-847 ("Main Library (2)") showed the `loop/button/*` variables are **mode-based per
  size**: label 16/14/12/11px (line height 24; 20 on Small), Font Awesome icon glyph
  18/16/14/12px, icon↔label gap 6px (4px on Small) for xLarge/Large/Regular/Small. New
  per-size tokens in `tokens/component-button.css` (`--loop-btn-font-*`, `--loop-btn-lh*`,
  `--loop-btn-icon-*`, `--loop-btn-gap-small`); `.btn` size modifiers re-point size-scoped
  custom props so label and icon scale together, and `.btn [class*="fa-"]` sizes native
  Icon-widget glyphs. Inline padding stays at the user-approved 16px (PR #124) — the
  per-size Figma paddings (32/28/20/14) are recorded in `loop/refs/cmp-button/spec.md`
  but deliberately not applied. Frozen ref updated with the per-size mode table.
  Same pass: **spacing between adjacent buttons is now 8px** (`.btn + .btn` margin via new
  `--loop-btn-adjacent-gap` → `--space-xxsmall`; user-specified) replacing the OSUI 16px
  `--space-m` default, incl. the phone stacked-buttons layout.

### Changed
- **Theme is now data-URI-free — the two `data:image/svg+xml` glyphs replaced** (2026-07-16).
  OutSystems raised an **offline-behavior warning** on the theme's two inline-SVG `url()`s
  (a url() the platform can't resolve to a module resource). The side-nav toggle's masked
  `sidebar` vector now ships as an **ODC Theme resource** — the exact Figma SVG lives at
  `src/assets/loop-icon-sidebar.svg` (new dir: authored files destined for Theme Resources),
  is uploaded to the Theme as `loop-icon-sidebar.svg`, and the mask token points at the
  literal `url("/TheLoopTheme/loop-icon-sidebar.svg")` that ODC rewrites to the fingerprinted
  resource URL at compile time, exactly like the `@font-face` woff2 srcs. (An FA `fa-sidebar`
  font glyph was tried in between but looked visibly different from the Figma asset — filled
  left column vs the export's pure outline — so it was reverted same-day per dev direction.)
  The preview server now mirrors the ODC rewrite (`/TheLoopTheme/<file>` → `src/assets/`,
  falling back to `dist/fontawesome-webfonts/` — so the theme's own font urls resolve locally
  too). The Search clear `×` cannot be a font glyph (`::-webkit-search-cancel-
  button` is a native pseudo-element that doesn't render `content`), so its FA-xmark-path
  mask became **two crossed `linear-gradient` mask layers** — pure CSS, no `url()` — with the
  full mask value travelling in `--loop-search-clear-icon` (position/size included, so the
  62.5% X scales with the 16/14px glyph box). Native show-on-filled/clear behavior unchanged;
  both verified in the live preview. The × glyph delta is disclosed as **FND-075** (register-only,
  low; the toggle half resolved by the resource revert). (`tokens/outsystems-ui-side-responsive.css`,
  `tokens/component-search.css`, `src/blocks/loop-search.css`, `build/preview-server.mjs`,
  handovers `loop-layout-side.md` + `loop-search.md`.)
- **Theme split into two ODC pastes + per-build token change report** (2026-07-16). The
  assembler now emits **`dist/tokens.css`** — the design tokens ONLY (single consolidated
  `:root` + device-scoped redefinitions like the `body.phone` type steps) — and
  **`dist/theme.css`** — everything else (`@font-face`, base rules, utilities, widget/
  component overrides; no tokens). Both carry the version-stamped `/*!` head + their own
  Section Index; `--ship` strips notes from both. Token edits now only require re-pasting
  `dist/tokens.css`. Verified structurally identical (rule-for-rule) to the pre-split
  single-file build. **Every build now diffs the assembled token set** against the new
  committed baseline `tokens/tokens.lock.json` and reports added/modified/removed tokens
  classified **branding / foundation / component**, newest-first in the new
  `tokens/TOKEN-CHANGELOG.md` (both files generated — never hand-edited).
  `check:live-theme` compares the live ODC bundle against the two pastes concatenated;
  the preview loads both in paste order (`build/build-theme.mjs`,
  `build/check-live-theme.mjs`, `preview/index.html`, handover boilerplate via
  `build/embed-handover-code.mjs`).
- **Card now overrides the native `.card` directly** (reverses the 2026-07-04 opt-in
  re-scope, per user ruling): the Loop card look — white, 8px radius, no border,
  `--shadow-medium` (0 8px 20px), 24px padding — is now the **default for every native
  OutSystems UI Card widget**, no Extended Class required. The two treatments are renamed to
  BEM-consistent opt-out modifiers: `.loop-card--no-shadow` → `.card--no-shadow` (Modern /
  external web, flat) and `.loop-card--flush` → `.card--flush` (no padding); the dev
  placeholder element is `.card__placeholder`. Design values and the FND-003/FND-065 shadow-
  colour ruling are unchanged (`src/blocks/loop-card.css`, `tokens/component-card.css`,
  `handover/loop-card.md`, preview, `loop/refs/cmp-card/`).
- **Icons — all component icons now render as Font Awesome 6 Pro glyphs, no more inline
  SVGs** — every shipped icon is a unicode glyph against the self-hosted
  `'Font Awesome 6 Pro'` face (new `--font-family-icon` / `--font-weight-icon-solid|regular|light`
  tokens in `tokens/typography.css`; glyphs render inside shadow DOM because the document
  `@font-face` pierces it — `.fa-*` classes don't). Converted: **loop-alert** (solid
  triangle-exclamation / circle-info / circle-exclamation + regular xmark; success uses the
  circle-info "i" glyph — that's what the Figma sticker draws for both success layouts,
  node 17868-4020 — logged as FND-066),
  **loop-system-alert** (solid set + wifi for offline), **loop-toast** (regular set, incl.
  phone-breakpoint glyph sizes), **loop-modal** (regular circle-info + xmark),
  **loop-button-dropdown** (solid chevron-down), **loop-file-uploader** (regular
  file-arrow-up / arrow-up, light circle-info, regular xmark), **DatePicker**
  (solid chevron-left/right nav — replacing the border-drawn chevrons — and the year-grid
  caret-down via `.loop-dp-yeartoggle__glyph`), **Search** (regular magnifying-glass glyph
  replaces the data-URI mask; token split into `--loop-search-icon-char|weight|glyph`),
  **Dropdown search** (same, `--loop-select-search-icon-char|weight|glyph`), and
  **loop-badge-status** Icon type (solid state glyphs; not-started/in-progress use the
  regular face — preview instances converted). One documented exception: the Search
  clear (×) sits on `::-webkit-search-cancel-button`, a native pseudo-element that can't
  render font glyphs — it stays a mask but the shape is now the genuine FA 6 Pro xmark
  path from `metadata/icons.json`. Shadow-CSS mirrors (`loop-system-alert.css`,
  `loop-toast.css`, `loop-button-dropdown.css`) kept in sync; handovers re-embedded.
- **Icons — Font Awesome 6 upgraded Free → Pro 6.7.2, Light style added, Brands dropped** —
  the designer-provided Pro desktop package (OTFs + metadata; no webfonts/CSS ship in it)
  replaces the Free build: `build/convert-fa-otf.mjs` (new, `wawoff2`) converts the Pro OTFs →
  the 3 vendored woff2 (solid 900 · regular 400 · **light 300, new**), and
  `build/gen-fa-pro-css.mjs` (new) generates `vendor/fontawesome-6/css/all.css` from
  `css/core-template.css` + `metadata/icons.json` (gitignored). Family renamed
  `'Font Awesome 6 Free'` → `'Font Awesome 6 Pro'`; `.fal`/`.fa-light` rules added; **brands
  removed** (no brand-logo icons in the designs — `fa-brands-400.woff2`, the
  `'Font Awesome 6 Brands'` face and all `.fab`/`.fa-brands` rules are gone); legacy
  `'FontAwesome'`/v5 faces still excluded (OSUI Icon-widget guard). Icon set: **3,323 names ×
  3 styles = 9,969 tiles**; `<loop-icon-reference>` gains a Light filter + 300-weight glyphs,
  drops the Brands filter, and `loop-icon-data.js` regenerates (~415 KB). ODC takes **3** woff2
  Resources (`fa-light-300.woff2` new; solid/regular names unchanged, faces replaced; delete the
  old `fa-brands-400.woff2`) and a re-paste of `dist/fontawesome.css`. Pro is a licensed asset —
  private repo/app hosting only, do not redistribute (handovers #137/#138 updated).
- **Text Field — bare `.input-*` size classes now step the input/placeholder text** —
  `16 / 14 / 13 / 12px` across `.input-xlarge` / `.input-large` / `.input-regular` /
  `.input-small` (Figma 19336-9729) by setting `--loop-field-text-size`, matching the
  `.loop-field--*` wrapper modifiers so bare and wrapped fields render identically
  (previously only `.input-small` changed the font, to 14px). Padding-block reconciled to
  the wrapper values (regular `11px`, small `8px`); heights stay pinned 56/48/40/32.
  Applies to every `.input-*` consumer (Search, plain Text Field, DatePicker field).
- **Text Field — Regular (13px) is now the default text size, no modifier needed** — the
  `--loop-field-text-size` token defaults to `13px` (was 16px/`--font-size-300`), so an
  unsized input/textarea renders the full Regular spec (40px + 13px text/placeholder) instead
  of Regular height with xLarge text — per the Regular-as-family-default direction (FND-021).
  Explicit sizes are unaffected; the label token stays 16px (the Upload label consumes it).
- **Modal `<loop-modal>` — all boolean attributes value-aware** — `open`, `no-icon`, `no-close`,
  `no-backdrop-close` and `static` now treat `="false"` the same as absent, so each binds
  directly to an ODC Boolean Block input via `If(Flag, "true", "false")` (e.g. `NoIcon` →
  `no-icon`) — no OnReady JS attribute wiring needed. Previously only `no-icon` was value-aware
  and `no-close`/`static` would mis-fire when bound `"false"`. Handover Block-wiring section
  updated to direct attribute bindings; verified in-browser (icon/close toggle, `open="false"`
  stays hidden with no scroll lock, `static="false"` keeps ESC dismiss).
- **Alert `<loop-alert>` — per-type state colors** (Figma node 17868-3944, 2026-07-02 update) —
  title/message/icon are now state-colored per type instead of the shared dark text: titles use
  the `Text/On State/*/Emphasis` roles (error `#861319` · warning `#473201` · info `#004370` ·
  success `#234f03`), messages the per-type state text roles, and icons the `Icon/On Light/State/*`
  roles — decoupled from the border accents (warning icon yellow-50 `#e19d00`, info icon blue-70
  `#004370`). Dismiss × is now neutral-60 (`--loop-alert-dismiss`). Type icons switched to the
  updated FILLED glyphs (solid shape + white knockout). The warning message keeps Figma's
  per-layout split (single `#896001` / multi `#473201`) — FND-062. The design update also
  resolves FND-054 (Information multi-line Action is now the primary link color).

### Added
- **Icons — Font Awesome 6 (full set)** — the entire FA6 Free icon library (~2,000 icons:
  solid · regular · brands) is now available app-wide, self-hosted like the brand Open Sans
  faces. New: vendored source `vendor/fontawesome-6/` (FA 6.7.2), build `build-fontawesome.mjs`
  (`npm run build:fontawesome`) → `dist/fontawesome.css` / `.min.css` + `dist/fontawesome-webfonts/`,
  a preview Icons section, and `handover/loop-fontawesome.md`. The build drops the legacy
  `'FontAwesome'` / v4 / v5 `@font-face` names so it never clobbers the native OutSystems UI
  Icon widget — only the three v6 families ship. Use `<i class="fa-solid fa-user"></i>`.
- **Icons — searchable reference `<loop-icon-reference>`** — Live Style Guide doc for the full
  FA6 set, like `<loop-typography-reference>`: a searchable, style-filterable grid where every
  icon is a click-to-copy tile carrying the name to paste into the CustomIcon block
  (`copy-format` = `class` / `prefixed` / `name`). New: `vendor/fontawesome-6/icon-manifest.json`,
  generator `build/gen-icon-data.mjs` (`npm run gen:icon-data`) → `src/components/loop-icon-data.js`
  (1,895 icons), component `src/components/loop-icon-reference.js`, preview section, and
  `handover/loop-icon-reference.md`. Glyphs render from unicode inside shadow DOM (no dependence
  on the page `.fa-*` classes — only the document `@font-face`).

## [0.6.0] — 2026-06-30

Refinement pass — reviewer-driven fixes from the board's review lane (PRs #116–#123).

### Added
- **Search** — `.input-small` size variant with a proportional glass icon (#101).

### Fixed
- **Button** — inline padding `16px`, border-width `2px`, added `btn-radius-sm` (#90).
- **Button Text** — states re-validated against Figma node `15597-4652` (#93).
- **Button Dropdown** — redesigned as a split button per Figma node `15597-3469`.
- **Checkbox** — disabled indeterminate dash geometry re-asserted (#92).
- **Checkbox** — disabled-checked check geometry re-asserted (#94).
- **Radio Button** — accessible-mode hover ring suppressed on disabled; group spacing tightened (#100).
- **System Alert** — delegated click handler, value-aware boolean attributes, hide-icon support.
- **System Alert** — multiline action: `42px` height, `margin-top` removed (#107).
- **Badge Status** — in-progress glyph renders static (no rotation) per review #88.

### Changed
- **Handover** — embedded code blocks re-synced with the recently merged PRs.

## [0.5.0] — 2026-06-29

Layout Side chrome and the typographic role system, plus three new components.

### Added
- **Layout Side** — content chrome: header bar + dark WBG footer.
- **Typography roles** — composite role classes (`loop-heading-*` / `loop-body-*`).
- **Toast**, **File Uploader**, and **Tabs** components (with regenerated handovers).

### Fixed
- **Layout Side** — native breadcrumb separators no longer hidden.
- **Layout Side** — profile pinned; `64px` footer; page gradient; sidebar dividers.
- **Layout Side** — profile (User Info) layout: avatar left, name over role.
- **Layout Side** — content body inset (MainContent previously had no padding).
- **Layout Side** — stop selecting on `.placeholder-empty` (an OSUI runtime utility, not a styling hook).

## [0.4.0] — 2026-06-24

Header branding and the first wave of composite/form components.

### Added
- **Layout Top** — branded the OutSystems Layout Top header.
- **Card** — The Loop Card family (#48).
- **Badge**, **DatePicker**, **Modal** — with Style-Guide reference tooling.
- **Tabs**, **Search**, **Popover** — tokens + block CSS.
- **Alert** — The Loop inline-alert Web Component.

## [0.3.0] — 2026-06-18

Composite components, the utility-class generators, and the typography tier — the
remainder of the inaugural design-system sprint.

### Added
- **Notes** (CSS block), **System Alert**, and **Popover** (Web Components).
- **Utility generators** — color and type utility classes; **Tag** block; Live Style Guide reference components.
- **Dropdown / Select** — restyle over the native Dropdown pattern + VirtualSelect.
- **Typography tier** — type utilities and handover docs.

## [0.2.0] — 2026-06-17

The Loop primitive restyles and the first custom Web Component.

### Added
- **Component token layers** — field and toggle tokens; foundation reconciliation.
- **Primitive restyles** + **Toggle** + **Button Dropdown** Web Component.
- **Live Style Guide**, handover docs, and the findings register.

## [0.1.0] — 2026-06-17

Foundations — design tokens and the build pipeline that produces the ODC theme.

### Added
- **Design tokens** — Phase 0 extraction of The Loop palette (primitives + semantic light/dark), spacing, and typography.
- **Brand font** — Open Sans (resolves FND-002).
- **Theme pipeline** — comment-preserving assembler (`build:theme` → `dist/theme.css` with a Table of Contents + section banners) and a local preview server.
- **OutSystems UI v2.28.1** vendored as the base layer, inheriting The Loop branding.
- **Findings workflow** — FND-001 / 003–011 filed as GitHub Bugs (#12–#21).

[Unreleased]: https://github.com/kharloridado/wbg/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/kharloridado/wbg/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/kharloridado/wbg/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/kharloridado/wbg/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/kharloridado/wbg/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/kharloridado/wbg/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/kharloridado/wbg/releases/tag/v0.1.0
