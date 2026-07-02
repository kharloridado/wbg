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

### Changed
- **Text Field — bare `.input-*` size classes now step the input/placeholder text** —
  `16 / 14 / 13 / 12px` across `.input-xlarge` / `.input-large` / `.input-regular` /
  `.input-small` (Figma 19336-9729) by setting `--loop-field-text-size`, matching the
  `.loop-field--*` wrapper modifiers so bare and wrapped fields render identically
  (previously only `.input-small` changed the font, to 14px). Padding-block reconciled to
  the wrapper values (regular `11px`, small `8px`); heights stay pinned 56/48/40/32.
  Applies to every `.input-*` consumer (Search, plain Text Field, DatePicker field).
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
