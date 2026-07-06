# Layout Side — Structural Analysis ("Form page" app shell)

> **Status (2026-06-28):** analysis + **sidebar restyle shipped.** The light-sidebar branding
> is built as a native-widget restyle — `tokens/outsystems-ui-side.css` (+ `--side-menu-size`
> in `tokens/outsystems-ui-overrides.css`), folded into `dist/theme.css`, previewed in
> `preview/index.html` ("Layout Side" specimen), handed over via `handover/loop-layout-side.md`.
> Menu hover/selected states are provisional (FND-057). The breadcrumb header, dark footer and
> in-logo collapse toggle remain net-new follow-ups. This document maps the Figma side-menu
> page onto the OutSystems **Layout Side** pattern and the existing Loop token system, so a
> follow-up task can build it the same way the **Layout Top header** was branded
> (`tokens/outsystems-ui-overrides.css` + `tokens/outsystems-ui-header.css` →
> `dist/theme.css` → `handover/loop-layout-top-header.md`).
>
> **Update (2026-07-04):** the Layout Top header branding referenced above was **removed** by
> user ruling — Layout Top now uses the default OutSystems header (`outsystems-ui-header.css`,
> `--header-color` and `handover/loop-layout-top-header.md` no longer exist). References to it
> below are historical context only.

**Source:** Figma *The Loop — OutSystems Library* · file `NEt0c68hVzZh8DTld9ySKt` · frame
**"Form page"** node `30132:139314`
([open](https://www.figma.com/design/NEt0c68hVzZh8DTld9ySKt/-The-Loop--OutSystems-Library_19062026?node-id=30132-139314&m=dev)).
Reference renders captured to scratchpad: `figma-formpage.png` (full page),
`figma-navpanel.png` (side nav).

**Sidebar treatment:** light background / dark text (confirmed with design owner).

---

## 1. What this frame is

"Form page" (1920×1836) is **not a single screen** — it is the **app shell**: fixed left
**side navigation**, a **content header** (breadcrumb + page title + utility actions), a
**content placeholder** ("Replace me → *Page Content Here*"), and a dark **WBG footer**.
The bank-information form shown inside is **sample content**, not part of the shell. The
reusable artifact is **the chrome + the placeholder the screen content drops into**.

The visible composition lives under `①② Main Surface` (`30132:139323`). The sibling
top-level frames are hidden interaction states, not part of the base layout:

| Frame | Node | Purpose |
|---|---|---|
| `①② Main Surface` | `30132:139323` | **the base layout (visible)** |
| `③ Overlay` | `30132:139320` | mobile/overlay menu state (hidden) |
| `④ Modal` | `30132:139317` | modal-open state (hidden) |
| `⑤ Notification` | `30132:139316` | notification state (hidden) |
| `⑥ System` | `30132:139315` | system state (hidden) |

---

## 2. Page anatomy

Two columns: a 320px side nav and a 1600px content column.

| Region | Figma node | Size | Notes |
|---|---|---|---|
| **Side nav panel** | `Nav/Main-Panel` `20019950:44117` | 320px wide, full height | Light/white, fixed left |
| ↳ Logo + collapse | `Nav/Header` `0:849` | 296×52 | Globe logo + "Nav Label" + collapse `-loop button` |
| ↳ Divider | `Divider` `0:1023` | 296×1 | hairline `#00396b29` |
| ↳ Menu items (scrollable) | `Nav/Menu-Actions` `0:1027` | 296 wide | Dashboard / List / Detail / AI Chat — icon + label + chevron; pill hit-area (radius 32) |
| ↳ Divider bottom | `Divider Bottom` `0:1153` | 296×1 | separates menu from profile |
| ↳ Profile (pinned bottom) | `Nav/Profile-Menu` `0:1155` | 296×48 | Avatar + "John Smith / Senior Director" |
| **Content column** | `① Content` `30132:139325` | x=320, 1600 wide | |
| ↳ **Placeholder** | `Replace me` `30132:139326` → text *"Page Content Here"* | hidden marker | **the screen-content drop zone** (see §4) |
| ↳ Header bar | `Header` `30132:139328` | 1600×96 | Breadcrumb (Home › Dashboard › Requests Overview) + page title "Process" + FAQ + EN US language selector |
| ↳ Sample body | `Process Indicator` / `Form` `30139:38859` | — | demo form in a white card — **not** part of the shell |
| ↳ Footer | `Footer External Web Thin CF` `30139:39737` | 1600×64 | dark WBG bar: WORLD BANK GROUP · IBRD IDA IFC MIGA ICSID · © 2026 |

---

## 3. Mapping to OutSystems Layout Side (native classes)

Verified against the vendored framework (`vendor/outsystems-ui/src/scss/02-layout/`,
pinned `v2.28.1`). The native Layout Side gives us the structure for free; we restyle it.

| Figma region | OutSystems native class / structure | Source SCSS |
|---|---|---|
| Root | `.layout.layout-side` | `_layout.scss` |
| Side nav panel (320px) | `.app-menu-content` — `position: fixed`, `width: var(--side-menu-size)`, `background: neutral-0` (white) | `_menu-layout-side.scss` |
| Logo + collapse | `.header-logo` + `.app-logo` | `_menu-header-logo.scss` |
| Menu items (vertical) | `.app-menu-links` (column; link active state) | `_menu-app-menu-links.scss` |
| Profile (bottom) | `.app-login-info` | `_menu-app-login-info.scss` |
| Content column | `.main` (`margin-left: var(--side-menu-size)` on desktop) → `.content` | `_layout.scss`, `_content.scss` |
| Header bar | `.content-top` **or** Layout-Side `.header` (see finding #4) | `_content.scss` / `_header-layout-side.scss` |
| Footer | footer block at the bottom of `.content` | `_content.scss` |

Native specifics worth noting:
- `.app-menu-content` is already **white** (`get-background-color('neutral-0')`) — the light
  sidebar needs **no background override**, only text/icon/menu-item restyling.
- Menu width is driven by `--side-menu-size`; the design wants **320px** (default differs),
  so the Side override file sets `--side-menu-size: 320px`.
- Mobile/overlay behavior (`.aside-overlay`, `.menu-visible`, `.app-menu-overlay`) is
  provided by the framework — matches the hidden `③ Overlay` state in Figma.

---

## 4. The placeholder ("a placeholder for its elements")

In OutSystems, a **Layout** is a reusable Block / Screen-template whose body contains one or
more **Placeholder** widgets. Every Screen built on the layout injects its widgets into that
placeholder; the surrounding nav / header / footer stay fixed.

The Figma `Replace me → "Page Content Here"` frame (`30132:139326`, kept hidden in the
mockup) **is that contract made visible** — it marks the single content region the screen
fills. Concretely:

```
.layout.layout-side
├── .app-menu-content        ← fixed side nav (chrome)
└── .main > .content
    ├── (header bar)          ← chrome
    ├── <Placeholder name="Content">   ← SCREEN CONTENT GOES HERE  (= "Replace me")
    └── (footer)              ← chrome
```

So "implement this in the platform" = build a **Layout web block** with the side nav +
header + footer chrome and a **`Content` placeholder** in the middle. The sample form is
just one screen rendered into that placeholder.

---

## 5. Token mapping (Figma → existing Loop tokens)

Every Figma value resolves to a token already in the repo — **no hard-coding and no new
`design-token` finding required**. Confirmed against `tokens/colors.css` and
`tokens/semantic-colors.css`.

| Element | Figma value | Loop token |
|---|---|---|
| Sidebar background | `#ffffff` | `--color-white` (native `.app-menu-content` already neutral-0) |
| Sidebar dividers | `#00396b29` | `--color-neutral-alpha-16` = `--color-divider-on-light-default` |
| Logo label text | `#012740` | `--color-blue-90` = `--color-text-on-light-emphasis` |
| Menu-item text | `#252e37` | `--color-neutral-80` (= OS `--color-neutral-9`) |
| Menu-item icon (primary) | `#252e37` | `--color-neutral-80` |
| Icon secondary | `#4b5e71` | `--color-neutral-60` = `--color-icon-on-light-default` |
| Profile text | `#000d1ab2` | `--color-neutral-alpha-70` = `--color-text-on-light-default` |
| Header link / icon | `#004370` | **`--color-primary`** (`--color-blue-70`) = `--color-text-on-light-link-primary-enabled` / `--color-icon-on-light-primary` |
| Header link hover | `#066db1` | `--color-text-on-light-link-hover` |
| Page title "Process" | `#012740`, Open Sans Bold 28 / lh 1.12 | `--color-text-on-light-emphasis` + heading role |
| Menu-item font | Open Sans 16 / lh 24 / ls −0.28 | `--font-family-*` + size/space tokens |
| Pill radius (menu / buttons) | `32` | `--border-radius-*` (xLarge tier) |
| Panel / menu-item width | panel 320 / item 272 | new `--side-menu-size: 320px` |
| Layout spacings | 12 / 16 / 8 / 4 | `--space-*` scale (`regular`/`small`/`xxsmall`/`tiny`) |
| Drop shadow | `0 4px 12px #00396b29` | `--shadow-regular` |

---

## 6. Native restyle vs. net-new

| Element | Classification | Notes |
|---|---|---|
| Side nav container, fixed positioning, width | **Native restyle** | `.layout-side .app-menu-content` — set `--side-menu-size: 320px`, keep white bg |
| Menu links (vertical, icon + label + chevron) | **Native restyle** | `.app-menu-links` — pill hit-area (radius 32), neutral-80 text, active/hover state |
| Logo + label | **Native restyle** | `.header-logo` / `.app-logo` |
| Profile block (avatar + name + role) | **Native restyle** (likely) | `.app-login-info` — confirm whether a richer profile menu is needed (could become a small block) |
| Collapse / expand toggle (in logo row) | **Net-new behavior** | The `-loop button` toggle drives `.menu-visible`; framework supports collapse, but the in-logo toggle placement is custom |
| Breadcrumb + utility header (FAQ, language selector) | **Net-new** | Not a stock Layout Side header — candidate composite block (breadcrumb + lang switcher) |
| Dark WBG footer (IBRD/IDA/IFC/MIGA/ICSID) | **Net-new** | Brand footer block; dark surface (`--color-secondary` / WB dark blue) |

---

## 7. Findings to raise later (flag, don't fix)

1. **Light sidebar vs. branded dark Layout Top.** `tokens/outsystems-ui-header.css`
   deliberately scopes its dark branding to `.header` and excludes `.layout-side`
   (`.layout:not(.layout-side) …`). This design wants a **light** sidebar, so Layout Side
   gets its **own** override file — the header treatment must **not** be extended to it.
2. **Custom affordances beyond native Layout Side:** in-logo collapse toggle, pill-shaped
   menu hit-areas, breadcrumb + language-selector header, dark WBG footer. Decide
   native-restyle vs. net-new block per §6 before building.
3. **Active / hover state of menu items** (pill fill vs. left border) — capture exact
   values from the design's component states before implementing; the metadata pull did not
   include an active menu item.
4. **Header bar placement** — confirm whether the breadcrumb/title/lang header is the
   OutSystems **Layout Side header** (`.header` in a side layout) or content-level
   `.content-top`. This affects where the breadcrumb + language selector are wired.

---

## 8. Future implementation outline (NOT done in this task)

Mirror the Layout Top deliverable shape:

1. **`tokens/outsystems-ui-side.css`** — class-level overrides scoped to `.layout-side`
   (menu-item text/icon colors, pill radius, dividers, profile text) + `--side-menu-size:
   320px`. Add to `tokens/index.css` (after `outsystems-ui-header.css`) and to the `META`
   map in `build/build-theme.mjs`.
2. **`src/blocks/loop-layout-side.css`** *(optional)* — only if spacing/structure needs
   tuning the tokens can't express; add to `src/blocks/index.css`.
3. **`preview/index.html`** — a Layout Side specimen section (sibling to the existing Layout
   Top section), so it renders against the real OSUI base + theme.
4. **`handover/loop-layout-side.md`** — handover ticket (theme paste + the breadcrumb/footer
   net-new pieces); register the net-new blocks (footer, breadcrumb/lang header) as their own
   build items.
5. Run `npm run build:theme`, validate in a **real browser** (not Service Studio preview).

> Before opening any new finding/handover issue, check `findings/findings-register.md` and
> the GitHub Project board for an existing one (avoid duplicates).
