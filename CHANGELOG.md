# Changelog

All notable changes to the WBG · **"The Loop"** design system are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the
project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html) in the **0.x**
range — pre-1.0, so token/class renames are expected and are **not** treated as breaking.

Each version below is the value stamped at the top of `dist/theme.css` (the artifact
pasted into the ODC Theme editor) for that release — the theme always self-identifies with
the version of its changelog entry. See [`RELEASING.md`](./RELEASING.md) for how a release
is cut. "Shipped" = merged to `main`; only board-**Approved** items reach an OutSystems
build.

## [Unreleased]

### Fixed
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
