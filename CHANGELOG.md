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

_Nothing yet — work merged to `main` since v0.6.0 lands here until the next release is cut._

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
