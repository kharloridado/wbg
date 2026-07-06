# Handover — Layout Side sidebar (branded app shell)

Brand the OutSystems UI **Layout Side** so the left menu reads as The Loop chrome:
**light (white) sidebar with dark text, a 320px panel, menu items as 32px pills, a
brand-emphasis logo label, and a profile block at the foot.** Restyles the native
`.app-menu-content` + `.app-menu-links` (+ `.header-logo` / `.app-login-info`) — no custom
block, no JS. Source design: Figma *The Loop — OutSystems Library*, frame **"Form page"**
node `30132:139314`. Full structural analysis: `docs/layout-side-structure.md`.

**Approach:** native-widget restyle (no parallel `loop-` system). Three theme-layer files:
- `tokens/outsystems-ui-overrides.css` sets `--side-menu-size: 320px` (the panel width OS UI
  resolves on `.app-menu-content`).
- `tokens/outsystems-ui-side.css` carries the class-level bits a token can't express: the
  white panel edge + brand shadow, the pill menu items (radius, sizing, SemiBold 16/24
  neutral-9 text), the hover/pressed/selected pill states, the logo label and profile type,
  the on-light focus ring, **and the native `.osui-submenu` (expandable menu group) restyle**
  (see below). All scoped under `.layout-side`, so the Layout **Top** header
  (`outsystems-ui-header.css`) is unaffected — and vice-versa.

**Submenu (expandable menu group).** When a side-menu entry has children, author it with the
OutSystems UI **Submenu** pattern. It's restyled to match the flat links: the parent row is
the **same 32px pill** (leading Icon + label) with a trailing **disclosure chevron** that
points **right when closed** and **down when open**; the children (L2) render as an **indented
plain-text (Regular 16/24) list**. Behaviour (open/close, keyboard, ARIA) is the stock OSUI
pattern — nothing to wire. States (confirmed by Figma frame `23980:12219` "Nav/Menu-Actions"):
hover Blue/20, pressed Blue/30, selected 5% neutral pill + a Blue/40 left indicator bar; L2
children hover on neutral-2. This frame also **resolves FND-057** (the earlier provisional
side-nav hover/selected states are now the confirmed spec). Structure inside `.app-menu-links`:
`.osui-submenu` › `.osui-submenu__header` (`.osui-submenu__header__item` › `a` with the Icon +
label, and `.osui-submenu__header__icon` chevron) › `.osui-submenu__items` › child `a`s.
- `tokens/outsystems-ui-side-responsive.css` adds the **responsive nav toggle** (hamburger):
  desktop docks the panel with an in-header **collapse/expand toggle**; tablet/phone collapse
  it to a white top bar whose `sidebar`-glyph toggle slides the 320px panel in as an
  **off-canvas drawer** over a **blue scrim**. Source: Figma "Templates" nodes `26740:27385`
  (Desktop) / `27212:26063` (Tablet) / `27212:26064` (Mobile). It **restyles OSUI's own
  `.desktop`/`.tablet`/`.phone` + `.menu-visible` machinery** — the native `.menu-icon` is
  already runtime-wired to toggle the drawer, so **no custom JS** ships; the desktop collapse
  shrinks the panel to a **84px icon-only rail** (via an `.aside-collapsed` modifier), not a
  hidden panel — the content reflows to meet the rail.

**Both files are already folded into `dist/theme.css`.** There is **nothing to hand-place per
block** — the whole sidebar branding ships in the theme paste.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Layout Side sidebar.

**What it is.** Branded app chrome — the OutSystems Layout Side left menu rendered as The
Loop (white panel, dark text, 320px, pill menu items, brand logo + profile).

**When to use**
- Any app built on the OutSystems **Layout Side**. The branding applies automatically once
  the theme is pasted — there is nothing to hand-place per block. Author the menu with the
  standard menu-link structure: a leading **Icon**, the label, and an optional trailing
  chevron (`Icon` widget) per item.

**When not to use** (reach for instead)
- This is page chrome, not a content component — for a contained surface use a **Card**.
- Layout **Top** headers are branded separately (`loop-layout-top-header.md`, dark header).

**How to use**
- Already folded into `dist/theme.css` — use the standard **Layout Side** template; drop your
  screen content into the layout's **Content placeholder** (the chrome stays fixed).

## Files
| File | OutSystems destination |
|---|---|
| `tokens/outsystems-ui-overrides.css` | Included automatically in `dist/theme.css` — paste theme into ODC Theme editor |
| `tokens/outsystems-ui-side.css` | Included automatically in `dist/theme.css` |
| `tokens/outsystems-ui-side-responsive.css` | Included automatically in `dist/theme.css` (responsive nav toggle) |

## Code to paste into ODC

> This handover is **theme-only**. Re-paste `dist/theme.css` into the ODC **Theme editor**
> (below OutSystems UI). The two source files below already live inside that theme — shown
> here for review, **do not paste them separately.**

<details>
<summary><code>tokens/outsystems-ui-overrides.css</code> (excerpt) → already in dist/theme.css</summary>

```css
/* Layout Side menu panel width → 320px ("Form page" design, Figma 30132:139314). */
:root {
  --side-menu-size: 320px;
}
```

</details>

<details>
<summary><code>tokens/outsystems-ui-side.css</code> → already in dist/theme.css</summary>

```css
/* Panel: white surface + dimmed right edge + brand regular shadow; 12px inline padding. */
.layout-side .app-menu-content {
  border-right: var(--border-size-s) solid var(--color-outline-on-light-dimmed);
  box-shadow: var(--shadow-regular);
  padding-inline: var(--space-xsmall);
}

/* Logo row: brand-emphasis label, Open Sans Bold 18 / blue-90 (#012740). */
.layout-side .header-logo,
.layout-side .app-logo { color: var(--color-text-on-light-emphasis); }
.layout-side .header-logo .application-name,
.layout-side .app-logo {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-400);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-narrow);
}

/* Menu items: 32px pills, Open Sans SemiBold 16/24, neutral-9 (#252e37) text + icon. */
.layout-side .app-menu-links { gap: var(--space-tiny); }
.layout-side .app-menu-links a {
  align-items: center; border: 0; border-radius: var(--radius-pill);
  color: var(--color-neutral-9); display: flex; gap: var(--space-xxsmall);
  letter-spacing: var(--letter-spacing-tight); line-height: var(--line-height-base);
  min-height: var(--space-xlarge); padding: var(--space-xxsmall) var(--space-small);
  font-family: var(--font-family-body); font-size: var(--font-size-300);
  font-weight: var(--font-weight-semibold);
}
.layout-side .app-menu-links a > .indicator,
.layout-side .app-menu-links a > .menu-item-indicator { margin-left: auto; }

/* Hover / pressed / selected — CONFIRMED by frame 23980:12219 (resolves FND-057):
   hover Blue/20, pressed Blue/30, selected 5% neutral pill + Blue/40 indicator bar. */
.layout-side .app-menu-links a:hover {
  background-color: var(--color-blue-20); color: var(--color-neutral-9); text-decoration: none;
}
.layout-side .app-menu-links a:active { background-color: var(--color-blue-30); }
.layout-side .app-menu-links a.active,
.layout-side .app-menu-links a.active:hover {
  position: relative; background-color: var(--color-neutral-alpha-04);
  border-left: 0; color: var(--color-neutral-9);
}
.layout-side .app-menu-links a.active::before {           /* 4×18 Blue/40 indicator bar (zero-layout) */
  content: ""; position: absolute; left: var(--space-tiny); top: 50%; transform: translateY(-50%);
  width: var(--space-tiny); height: 18px; border-radius: var(--radius-base);
  background-color: var(--color-blue-40);
}

/* Submenu (native .osui-submenu) — parent row = same pill + disclosure chevron
   (right closed / down open); L2 children = indented plain-text (Regular) list.
   Full rules in tokens/outsystems-ui-side.css; states mirror the links above,
   L2 hover on neutral-2. See the "Submenu" note in the Approach section. */
.layout-side .app-menu-links .osui-submenu .osui-submenu__header {
  align-items: center; border: 0; border-radius: var(--radius-pill); display: flex;
  gap: var(--space-xxsmall); min-height: var(--space-xlarge);
  padding: var(--space-xxsmall) var(--space-small);
}
.layout-side .app-menu-links .osui-submenu .osui-submenu__header__icon { margin-inline-start: auto; transform: rotate(-90deg); }
.layout-side .app-menu-links .osui-submenu--is-open .osui-submenu__header__icon { transform: rotate(0deg); }
.layout-side .app-menu-links .osui-submenu .osui-submenu__items { display: none; flex-direction: column; }
.layout-side .app-menu-links .osui-submenu--is-open > .osui-submenu__items { display: flex; }

/* Profile block: name (Bold 16) + role (Regular 12), on-light text. */
.layout-side .app-login-info { color: var(--color-text-on-light-default); }
.layout-side .app-login-info .user-info__name {
  font-size: var(--font-size-300); font-weight: var(--font-weight-bold); line-height: var(--line-height-base);
}
.layout-side .app-login-info .user-info__role {
  font-size: var(--font-size-100); font-weight: var(--font-weight-regular); line-height: var(--line-height-narrow);
}

/* Focus ring — The Loop 2px on-light outline (light sidebar → Blue/50 is conformant here). */
.layout-side .app-menu-links a:focus-visible,
.has-accessible-features .layout-side .app-menu-links a:focus {
  outline: 2px solid var(--color-outline-on-light-link-focused, var(--color-blue-50));
  outline-offset: 2px; background-color: transparent; box-shadow: none;
}
```

</details>

<details>
<summary><code>tokens/outsystems-ui-side-responsive.css</code> → already in dist/theme.css (responsive nav toggle)</summary>

```css
/* Responsive nav toggle — restyles OSUI's native .desktop/.tablet/.phone + .menu-visible
 * machinery (no custom JS: the native .menu-icon is runtime-wired to toggle the drawer).
 * Desktop docks the panel with an in-header collapse toggle; tablet/phone show a white top
 * bar whose `sidebar`-glyph toggle slides the 320px panel in over a blue scrim. */

/* Top-bar height composed from tokens (52px Nav/Header row + block padding → 76px tablet). */
.layout-side { --loop-side-topbar-h: calc(var(--space-xlarge) + 2 * var(--space-xtiny) + 2 * var(--space-xsmall)); }

/* Scrim → blue "Blocker Overlay" (#00396b3d), scoped so modals/popovers keep the black default. */
.layout-side .app-menu-overlay { background-color: var(--color-bg-overlay-on-light-medium); }

/* Toggle pill (native .menu-icon on tablet/phone + .loop-nav-toggle on the desktop header). */
.layout-side .menu-icon,
.layout-side .loop-nav-toggle {
  align-items: center; justify-content: center; flex-direction: row;
  width: var(--space-medium); height: var(--space-medium); min-width: var(--space-medium);
  margin: 0; padding: 0; border: none; border-radius: var(--radius-pill);
  background-color: transparent; color: var(--color-icon-on-light-default); cursor: pointer;
}
.layout-side .menu-icon .menu-icon-line { display: none; }  /* hide native 3 bars */
.layout-side .menu-icon::before,
.layout-side .loop-nav-toggle::before {
  content: ""; width: var(--space-small); height: var(--space-small);
  background-color: currentColor;
  -webkit-mask: var(--loop-side-toggle-icon) center / contain no-repeat;
          mask: var(--loop-side-toggle-icon) center / contain no-repeat;
}
/* `sidebar` glyph — a rounded panel with a divided, filled left column (masked inline SVG). */
.layout-side { --loop-side-toggle-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23000' stroke-width='1.6'%3E%3Crect x='2.5' y='3.5' width='15' height='13' rx='2.5'/%3E%3Cline x1='8' y1='3.5' x2='8' y2='16.5'/%3E%3C/svg%3E"); }
.layout-side .menu-icon:hover,
.layout-side .loop-nav-toggle:hover { background-color: var(--color-neutral-2); }
.layout-side .menu-icon:focus-visible,
.layout-side .loop-nav-toggle:focus-visible,
.has-accessible-features .layout-side .menu-icon:focus,
.has-accessible-features .layout-side .loop-nav-toggle:focus {
  outline: 2px solid var(--color-outline-on-light-link-focused, var(--color-blue-50));
  outline-offset: 2px; box-shadow: none;
}

/* DESKTOP — the in-header toggle collapses the docked panel to an 84px ICON RAIL
   (.aside-collapsed), not hidden: shrinking --side-menu-size reflows the panel + content; icons
   centre, text hides. The `.is-swapped` modifier (Figma "is Swaped") picks the rail header glyph:
   default = the LOGO (and it is the click target); .is-swapped = the sidebar TOGGLE icon. */
.layout-side { --side-menu-collapsed: 84px; } /* Figma "panel width compact" */
.desktop .layout-side .loop-nav-toggle { display: flex; flex: 0 0 auto; }
.desktop .layout-side .menu-icon { display: none; }
.desktop .layout-side .app-menu-content { transition: width 220ms ease, max-width 220ms ease; }
.desktop .layout-side .main { transition: margin-left 220ms ease; }
/* Expanded header: line the logo mark + avatar up with the menu-item icons (neutralise OSUI's
   24px header padding + max-width:120px label cap) and pin the toggle flush-right. */
.desktop .layout-side:not(.aside-collapsed) .header-logo,
.desktop .layout-side:not(.aside-collapsed) .app-login-info { padding-inline: var(--space-small); }
.desktop .layout-side:not(.aside-collapsed) .header-logo .application-name,
.desktop .layout-side:not(.aside-collapsed) .header-logo .app-logo { max-width: none; }
.desktop .layout-side:not(.aside-collapsed) .header-logo .loop-nav-toggle { margin-left: auto; }
.desktop .layout-side.aside-collapsed { --side-menu-size: var(--side-menu-collapsed); }
.desktop .layout-side.aside-collapsed .header-logo { justify-content: center; }
.desktop .layout-side.aside-collapsed .header-logo .application-name,
.desktop .layout-side.aside-collapsed .header-logo .app-logo { display: none; }
.desktop .layout-side.aside-collapsed:not(.is-swapped) .loop-nav-toggle { display: none; }
.desktop .layout-side.aside-collapsed:not(.is-swapped) .header-logo { cursor: pointer; } /* logo = expand trigger */
.desktop .layout-side.aside-collapsed.is-swapped .header-logo img { display: none; }
.desktop .layout-side.aside-collapsed.is-swapped .loop-nav-toggle { margin: 0 auto; }
.desktop .layout-side.aside-collapsed .app-menu-links a {
  width: var(--space-xlarge); margin-inline: auto; justify-content: center; gap: 0; padding-inline: 0;
}
.desktop .layout-side.aside-collapsed .app-menu-links a > .indicator,
.desktop .layout-side.aside-collapsed .app-menu-links a > .menu-item-indicator,
.desktop .layout-side.aside-collapsed .app-menu-links a > .menu-item-caption,
.desktop .layout-side.aside-collapsed .app-menu-links a > span:not(.icon) { display: none; }
.desktop .layout-side.aside-collapsed .app-login-info { justify-content: center; }
.desktop .layout-side.aside-collapsed .app-login-info .user-info { display: none; }

/* TABLET / PHONE — white top bar (toggle + logo); drawer + scrim below the bar. */
.tablet .layout-side .loop-nav-toggle,
.phone  .layout-side .loop-nav-toggle { display: none; }
.tablet .layout-side .header,
.phone  .layout-side .header {
  display: flex; align-items: center; gap: var(--space-tiny);
  min-height: var(--loop-side-topbar-h); padding: var(--space-xsmall) var(--space-xxsmall);
  background-color: var(--color-white); box-shadow: var(--shadow-low);
  color: var(--color-text-on-light-emphasis);
}
.phone .layout-side { --loop-side-topbar-h: calc(var(--space-xlarge) + 2 * var(--space-xtiny) + 2 * var(--space-xxsmall)); } /* 68px */
.phone .layout-side .header { padding-block: var(--space-xxsmall); }
.tablet .layout-side .header .header-logo,
.phone  .layout-side .header .header-logo {
  display: flex; align-items: center; gap: var(--space-xxsmall); flex: 1 1 auto; min-width: 0; border-bottom: 0;
}
.tablet .layout-side .header .header-logo img,
.phone  .layout-side .header .header-logo img { width: var(--space-medium); height: var(--space-medium); flex: 0 0 auto; object-fit: contain; }
.tablet .layout-side .header .app-logo, .tablet .layout-side .header .application-name,
.phone  .layout-side .header .app-logo, .phone  .layout-side .header .application-name {
  font-family: var(--font-family-heading); font-size: var(--font-size-400);
  font-weight: var(--font-weight-bold); line-height: var(--line-height-narrow);
  color: var(--color-text-on-light-emphasis);
}
/* Drawer's own logo suppressed on tablet/phone (the bar has it); drawer + scrim below the bar. */
.tablet .layout-side .app-menu-content .header-logo,
.phone  .layout-side .app-menu-content .header-logo { display: none; }
.tablet .layout-side .app-menu-content, .phone .layout-side .app-menu-content,
.tablet .layout-side .app-menu-overlay, .phone .layout-side .app-menu-overlay {
  top: var(--loop-side-topbar-h); height: calc(100% - var(--loop-side-topbar-h));
}
```

</details>

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover.
> This is a **native-widget restyle**, so there is **no Block and no CSS** to build — Mentor's
> job is only to put the screen on the right Layout and author the menu/profile structure.
> Mentor does **not** author the Theme CSS, so do the `dist/theme.css` paste in the checklist
> first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, set up the screen(s) so the WBG "The Loop" Layout Side sidebar branding
renders. This is a native-widget restyle — the look is 100% Theme CSS + tokens, so there is
NO Block to build and NO CSS for you to write.

Context (already done manually — do NOT re-create or edit these):
- dist/theme.css (incl. tokens/outsystems-ui-overrides.css and tokens/outsystems-ui-side.css)
  is already pasted into the ODC Theme editor, below OutSystems UI. The 320px white panel,
  pill menu items, logo label, profile type, and focus ring all come from that paste.
- Do NOT write or edit CSS, do NOT author JavaScript, do NOT edit the Theme or the
  OutSystems UI module.

Task — referencing every element by name:
1. Make sure the App/Screen uses the OutSystems "Layout Side" layout (left menu panel). Do
   NOT switch a Layout Top screen to this — the top-header branding is a separate handover.
2. Author each menu entry in the layout's menu placeholder with a leading Icon, the label
   text, and (optionally) a trailing chevron Icon for groups. The framework adds the "active"
   class to the current item — do not hand-set it.
3. Populate the foot profile area using the layout's login-info block (user name in the
   user-info__name slot, role in user-info__role) and the logo label in the header-logo slot.
4. Build whatever screen/navigation logic the menu needs (OnClick → Navigate, etc.).

Net-new pieces NOT covered by this theme-only restyle — build them as their own items, do
not expect them from the Layout Side template: the breadcrumb + utility header (FAQ link,
language selector) and the dark WBG footer (IBRD · IDA · IFC · MIGA · ICSID · ©). (The
responsive nav toggle / in-header collapse IS covered — see the responsive Mentor prompt.)

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded colors/sizes — all
styling already comes from var(--token) in the pasted Theme. After generating, list what you
created/changed by name and flag anything you could not finish so I can do it manually.

Note (do not act on in code): the side-menu hover/active state is provisional (FND-057);
confirm the state spec with design before relying on it.
```

## Build the Layout Side block (containers + classes)

The restyle CSS keys on the OutSystems Layout-Side class names (`.layout-side`,
`.app-menu-content`, `.app-menu-links`, `.app-login-info`, …). The **stock Layout Side**
template emits those for free — but this design also needs custom chrome (pill nav, breadcrumb
header, dark footer, in-logo collapse) the stock layout doesn't give you. So the real platform
deliverable is a **reusable Layout web block** whose Containers carry those exact classes and
that exposes a **Content** placeholder. Set every class via each widget's **Style Classes**
property (the ExtendedClass-equivalent) — never by editing the OutSystems UI module.

**Container → class tree** (verified against `preview/index.html` + `docs/layout-side-structure.md`):

```
Container "LayoutSideRoot"   Style Classes: layout layout-side
└─ Container "SideNav"        Tag: aside   Style Classes: app-menu-content
   ├─ Container "LogoRow"     Style Classes: header-logo
   │  ├─ Image/Icon  (globe logo)
   │  └─ Expression "Nav Label"        Style Classes: app-logo application-name
   ├─ Container "MenuLinks"   Tag: nav    Style Classes: app-menu-links
   │  └─ one Link per item (Dashboard / List / Detail / AI Chat):
   │       Link                          Style Classes: active   ← current item only
   │       ├─ Icon  (leading)
   │       ├─ Expression  (label)
   │       └─ Icon  (trailing chevron)  Style Classes: indicator
   └─ Container "Profile"     Style Classes: app-login-info
      ├─ Image  (avatar)
      └─ Container "UserInfo" Style Classes: user-info
         ├─ Expression  (name)          Style Classes: user-info__name
         └─ Expression  (role)          Style Classes: user-info__role
Container "Main"             Style Classes: main
└─ Container "Content"       Style Classes: content
   ├─ Container "ContentHeader"          Style Classes: loop-content__header
   │  ├─ Container "HeaderTop"           Style Classes: loop-content__header-top
   │  │  ├─ Container "Breadcrumbs"      Style Classes: loop-content__breadcrumbs
   │  │  │     └─ Placeholder "Breadcrumbs"   (Breadcrumb widget; optional)
   │  │  └─ Container "Actions"          Style Classes: loop-content__actions
   │  │        └─ Placeholder "Actions"  (Loop tertiary text-buttons: FAQ, language; optional)
   │  └─ Container "Title"               Style Classes: loop-content__title
   │        └─ Placeholder "Title"       (page title; optional)
   ├─ Container "Body"                   Style Classes: loop-content__body
   │     └─ Placeholder "MainContent"    ← required; screen content drops here
   └─ Container "Footer"                 Style Classes: loop-content__footer   ← STATIC WBG chrome (baked, not a placeholder):
         ├─ Container                    Style Classes: loop-content__footer-institutions
         │    ├─ Expression "WORLD BANK GROUP"   Style Classes: loop-content__footer-brand
         │    │     (or the white WBG logo Image → Style Classes: loop-content__footer-logo)
         │    ├─ Container                Style Classes: loop-content__footer-divider
         │    └─ Expressions  IBRD · IDA · IFC · MIGA · ICSID
         └─ Expression "© 2026 The World Bank Group, All Rights Reserved"
                                          Style Classes: loop-content__footer-copyright
```

> **A bare OutSystems Placeholder renders as an unclassed `<div>`** — so the fix the design
> needs is to **wrap each placeholder in a Container that carries the `loop-content__*` class**;
> the theme styles those wrappers (header bar, breadcrumb, title, actions, footer). Still
> scaffold the standard slots — `Breadcrumbs`, `Title`, `Actions`, `MainContent`, plus the
> footer — per the OutSystems accelerator convention; `MainContent` is required, the rest are
> optional. Empty optional regions collapse automatically: the theme hides `.placeholder-empty`
> (and `:empty` breadcrumb/actions wrappers) inside `.layout-side .content`, so no ghost gaps.
> The **footer is static brand chrome** (same on every screen) — build it as real content, not a
> placeholder, so it is never empty. The header bar + footer are now **fully styled by the
> theme** (`tokens/outsystems-ui-side.css`, Figma "Form page" Header `30132:139328` + Footer
> `30139:39737`); the breadcrumb widget and the language selector behaviour remain net-new
> items. The in-header collapse toggle + responsive drawer are now **delivered**
> (`tokens/outsystems-ui-side-responsive.css`).

> The trailing chevron's `indicator` class is what the CSS hooks to right-align it
> (`.app-menu-links a > .indicator { margin-left:auto }`). The `active` class on the current
> Link drives the brand-tint pill — let the OutSystems menu/active-link mechanism set it where
> possible, otherwise bind it. The HTML reference for this exact tree is the **Layout Side**
> specimen in `preview/index.html` (`.layout.layout-side` block).

### Mentor Studio prompt — build the block

```
Goal: In ODC Studio, build a reusable Layout web block named "LoopLayoutSide" for the WBG
"The Loop" design system. It is the branded Layout-Side app shell: a fixed left side-nav +
a Content placeholder for screen content. The look is 100% Theme CSS + tokens (already pasted)
— your job is the container/class STRUCTURE and the placeholder, NOT any styling.

Context (already done manually — do NOT re-create or edit these):
- dist/theme.css (incl. tokens/outsystems-ui-overrides.css + tokens/outsystems-ui-side.css)
  is already pasted into the ODC Theme editor, below OutSystems UI. The 320px white panel,
  pill menu items, logo label, profile type and focus ring all come from that paste, which
  keys on the OutSystems Layout-Side class names below.
- Do NOT write or edit CSS, do NOT author JavaScript, do NOT edit the OutSystems UI module.

Task — create a Web Block "LoopLayoutSide". Build this widget tree, setting each widget's
Style Classes property to EXACTLY the class string given (this is how the branding attaches):

1. Container "LayoutSideRoot"  → Style Classes: "layout layout-side"
2. Inside it, Container "SideNav" (HTML Tag = aside) → Style Classes: "app-menu-content"
   2a. Container "LogoRow" → "header-logo": an Image/Icon (logo) + an Expression
       "Nav Label" with Style Classes "app-logo application-name".
   2b. Container "MenuLinks" (HTML Tag = nav) → "app-menu-links". Inside, one Link per menu
       item; each Link contains a leading Icon, an Expression label, and a trailing chevron
       Icon whose Style Classes = "indicator". The current item's Link gets Style Classes
       "active" (let the active-screen menu mechanism set it if you wire navigation; else
       bind it to an IsActive input).
   2c. Container "Profile" → "app-login-info": an Image (avatar) + a Container "UserInfo"
       with Style Classes "user-info" containing two Expressions — name (Style Classes
       "user-info__name") and role (Style Classes "user-info__role").
3. Sibling to SideNav, Container "Main" → "main", containing Container "Content" → "content".
   A bare Placeholder renders as an UNCLASSED div, so WRAP each placeholder in a Container that
   carries the styling class (this is what the design asked for). Build inside "content":
   3a. Container "ContentHeader" → "loop-content__header":
       - Container "HeaderTop" → "loop-content__header-top" containing:
         · Container "Breadcrumbs" → "loop-content__breadcrumbs" wrapping a Placeholder
           "Breadcrumbs" (a Breadcrumb widget goes here).
         · Container "Actions" → "loop-content__actions" wrapping a Placeholder "Actions"
           (the FAQ + language controls are Loop TERTIARY text-buttons — existing component).
       - Container "Title" → "loop-content__title" wrapping a Placeholder "Title".
   3b. Container "Body" → "loop-content__body" wrapping the REQUIRED Placeholder "MainContent"
       (screen content drops here).
   3c. Container "Footer" → "loop-content__footer" — STATIC brand chrome, NOT a placeholder
       (it is identical on every screen, so bake it in). Inside:
         · Container → "loop-content__footer-institutions": an Expression "WORLD BANK GROUP"
           → "loop-content__footer-brand" (or the white WBG logo Image → "loop-content__footer-logo"),
           a Container → "loop-content__footer-divider", then Expressions IBRD IDA IFC MIGA ICSID.
         · Expression "© 2026 The World Bank Group, All Rights Reserved" → "loop-content__footer-copyright".
   Do NOT add "placeholder-empty" yourself — OutSystems adds it at runtime; the theme already
   hides empty optional regions inside .layout-side .content.
4. Give the block input parameters so screens can fill it without editing the block:
   NavLabel : Text, UserName : Text, UserRole : Text, PageTitle : Text (bind PageTitle to the
   Title expression). Leave the menu Links editable in the block for now (or expose them later
   as a List).

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded colors/sizes — all
styling already comes from var(--token) in the pasted Theme, hooked onto the class names above.
Use the EXACT class strings — a typo means the branding won't attach. After generating, list
every widget you created by name and the Style Classes you set on each, and flag anything you
could not finish so I can do it manually.

Start by creating the "LoopLayoutSide" block with the LayoutSideRoot → SideNav → (LogoRow,
MenuLinks, Profile) + Main → Content + Placeholder tree, and show it to me before we bind inputs.
```

> The header bar + dark WBG footer are now **styled by the theme** (`loop-content__*` classes).
> Still net-new inside them: the **Breadcrumb widget** (drop into the `loop-content__breadcrumbs`
> slot) and the **language-selector** behaviour. (The in-header collapse toggle is **delivered**
> via `tokens/outsystems-ui-side-responsive.css` — see the responsive Mentor prompt.)

### Mentor Studio prompt — UPDATE an existing block to the chrome

Use this when the block already exists (bare placeholders in `.content`) and you only need to
add the content-chrome classes + footer — not rebuild it.

```
Goal: In ODC Studio, update the existing Layout-Side block (the Web Block holding the
"content" Container with the screen placeholders) for the WBG "The Loop" design system, so its
content area matches the design. Today the placeholders (Breadcrumbs, Header, Title, Actions,
MainContent, Footer) sit directly in "content" as UNCLASSED divs, so the header bar and footer
are unstyled and the footer looks empty. Wrap each placeholder in a Container that carries the
styling class, and replace the empty Footer placeholder with the static WBG footer.

Context (already done manually — do NOT re-create or edit these):
- dist/theme.css is already pasted in the ODC Theme editor and defines the loop-content__*
  classes (header bar, breadcrumb, title, actions, footer). The styling exists — it only needs
  the class hooks present on Containers.
- Do NOT write or edit CSS, do NOT author JavaScript, do NOT edit the Theme or OutSystems UI.

Task — keep every existing Placeholder (do not delete its contents), referencing each by name.
Inside the "content" Container, restructure as follows (set each Container's Style Classes to
EXACTLY the quoted string):

1. Add a Container "ContentHeader" (Style Classes "loop-content__header") at the top of
   "content". Inside it:
   1a. Container "HeaderTop" (Style Classes "loop-content__header-top") containing:
       - Container "BreadcrumbsWrap" (Style Classes "loop-content__breadcrumbs") — MOVE the
         existing Placeholder "Breadcrumbs" inside it.
       - Container "ActionsWrap" (Style Classes "loop-content__actions") — MOVE the existing
         Placeholder "Actions" inside it (its FAQ + language controls are Loop tertiary
         text-buttons; leave them as-is).
   1b. Container "TitleWrap" (Style Classes "loop-content__title") — MOVE the existing
       Placeholder "Title" inside it.
   You can now DELETE the unused "Header" placeholder (the header bar is the wrapper itself).
2. Add a Container "BodyWrap" (Style Classes "loop-content__body") below the header — MOVE the
   existing required Placeholder "MainContent" inside it.
3. Replace the empty Placeholder "Footer" with a Container "Footer" (Style Classes
   "loop-content__footer") holding STATIC content (it is identical on every screen):
   - Container "FooterInstitutions" (Style Classes "loop-content__footer-institutions"):
     · Expression "WORLD BANK GROUP" (Style Classes "loop-content__footer-brand")  — or the
       white WBG logo Image with Style Classes "loop-content__footer-logo"
     · Container "FooterDivider" (Style Classes "loop-content__footer-divider")  — empty
     · Expressions: IBRD, IDA, IFC, MIGA, ICSID
   - Expression "© 2026 The World Bank Group, All Rights Reserved"
     (Style Classes "loop-content__footer-copyright")
   Then delete the old "Footer" placeholder.
4. Do NOT add a "placeholder-empty" class yourself — OutSystems adds it at runtime and the
   theme already hides empty optional regions inside .layout-side .content.

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded colors/sizes — all
styling comes from var(--token) in the pasted Theme via the EXACT class strings above (a typo
means the styling won't attach). After updating, list every Container you added by name with
the Style Classes you set, confirm which placeholders you moved, and flag anything you could
not finish so I can do it manually.

Do step 1 first (the header bar wrapping Breadcrumbs/Title/Actions) and show it to me before
the footer.
```

### Mentor Studio prompt — configure the responsive nav toggle

Use this to turn on the responsive collapse behaviour (tablet/phone hamburger → off-canvas
drawer; desktop collapse/expand). The look is 100% the theme paste — Mentor only sets the
Layout's menu mode and places/binds the toggle affordances.

```
Goal: In ODC Studio, configure the WBG "The Loop" Layout-Side screen/block so the side nav is
RESPONSIVE: docked on desktop with an in-header collapse toggle, and an off-canvas drawer with
a hamburger + top bar on tablet/phone. This is a native-widget restyle — the entire look
(top bar, sidebar-glyph toggle, blue scrim, drawer slide) is already in the pasted Theme
(tokens/outsystems-ui-side-responsive.css). You write NO CSS and NO JavaScript.

Context (already done manually — do NOT re-create or edit these):
- dist/theme.css (incl. tokens/outsystems-ui-side-responsive.css) is already pasted into the
  ODC Theme editor, below OutSystems UI. It restyles OSUI's native responsive machinery:
  the .desktop/.tablet/.phone device classes (OSUI sets these at runtime) plus .menu-visible /
  aside-overlay, and a Loop `.aside-collapsed` modifier for the desktop icon rail. The blue scrim,
  the top bar, the `sidebar` toggle glyph, the drawer slide and the 84px rail all come from that paste.
- Do NOT write or edit CSS, do NOT author JavaScript, do NOT edit the Theme or OutSystems UI.

Task — referencing every element by name:
1. On the Layout Side layout, enable OFF-CANVAS overlay on tablet/phone (aside-overlay) via the
   OutSystems Layout/Menu settings. On desktop the panel stays docked and COLLAPSES TO AN ICON
   RAIL (not a hidden/aside-expandable panel) — this is driven by an `.aside-collapsed` class the
   toggle adds (step 3), so do NOT enable aside-expandable on desktop.
2. TABLET/PHONE hamburger — use the layout's NATIVE menu toggle (the OutSystems ".menu-icon" /
   MenuVisibility affordance in the header). The theme restyles it into The Loop `sidebar`-glyph
   pill automatically, and OSUI's runtime already toggles the drawer open/closed on click —
   there is NOTHING to wire. Make sure the top bar (the layout header on small screens) also
   shows the globe logo + "Nav Label" next to the toggle.
3. DESKTOP collapse (icon rail) — add a Button in the side-nav header row (inside the header-logo
   Container, after the "Nav Label" expression). Set its Style Classes to EXACTLY "loop-nav-toggle"
   (this is how the theme styles it into the `sidebar` pill). Give it no icon/caption of its own
   (the glyph comes from CSS). Wire its OnClick to a Client Action that toggles a boolean screen/
   block variable, and bind that variable so it adds/removes the class **`aside-collapsed`** on the
   `.layout` Container (via its Style Classes / a conditional class). When `.aside-collapsed` is
   present the theme shrinks the panel to the 84px icon rail (icons only) and reflows the content;
   removing it restores the 320px panel. The menu-item captions must be Expressions (they render as
   `<span>`) so the theme can hide them in the rail.
4. COLLAPSED-RAIL SWAP (Figma "is Swaped") — add a Boolean input on the block (e.g. "SwapRailHeader",
   default False) and bind it so it conditionally adds the class **`is-swapped`** to the same
   `.layout` Container. When collapsed: default (False) shows the LOGO at the rail top (and the logo
   is the click target to expand — wire its OnClick to the same expand action), while `is-swapped`
   (True) shows the `sidebar` TOGGLE icon instead. Both expand on click; the theme handles the
   visuals — you only toggle the class.
5. Do NOT hard-set the device classes (.desktop/.tablet/.phone) or .menu-visible yourself —
   OSUI's runtime manages them. Do NOT set any width/height/color — the theme owns all of it.

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded colors/sizes. After
generating, list what you configured/placed by name (esp. the "loop-nav-toggle" button and the
Layout menu-mode settings) and flag anything you could not finish so I can do it manually.

Validate in a REAL browser at desktop / tablet / phone widths: desktop docks the 320px panel and
the header toggle collapses it to a 84px icon rail (icons only, content reflows); tablet/phone
show the white top bar whose toggle slides the drawer in over the blue scrim (scrim-click / Esc
close it).
```

## OutSystems install checklist
- [ ] Confirm the app/screen uses the **Layout Side** layout (this branding targets the side
      menu; Layout Top is branded separately and is unaffected).
- [ ] Enable off-canvas overlay (tablet/phone) and place the desktop collapse button with Style
      Classes **`loop-nav-toggle`**, wiring it to toggle **`.aside-collapsed`** on the `.layout`
      (see the responsive Mentor prompt). The tablet/phone hamburger is the native `.menu-icon`
      (no wiring). Optionally add the **`is-swapped`** modifier (Figma "is Swaped") to switch the
      collapsed rail header between the logo (default) and the toggle icon. Validate in a **real
      browser** at desktop / tablet / phone widths: desktop collapses to an **84px icon rail**
      (icons only, content reflows; logo or toggle at top per the swap); tablet/phone slide the
      drawer in over the **blue** scrim; scrim-click and `Esc` close the drawer.
- [ ] Rebuild `dist/theme.css` (`npm run build:theme`) and paste it into the ODC **Theme
      editor**, below OutSystems UI.
- [ ] Author each menu entry with a leading **Icon**, the label, and (optionally) a trailing
      chevron Icon; the profile block at the foot uses the layout's login-info area.
- [ ] 1-Click Publish → validate in a **real browser** (not Service Studio preview alone):
  - Panel is **white**, 320px wide, with a dimmed right edge + soft shadow.
  - Menu items render as **pill** hit-areas; resting text/icon = dark `neutral-9` (#252e37).
  - **Active** item shows the brand-tint pill (blue-10) with primary (#004370) text/icon.
  - Logo label is **Bold blue-90**; the profile name is Bold, the role Regular.
  - Tab through the menu — the focus ring is The Loop on-light Blue/50 outline.
  - **Content header bar**: breadcrumb (`Dashboard` blue link, current crumb subdued, `|`
    separators, leading home icon) over the **Process** title (Bold 28 / blue-90); FAQ +
    language actions right-aligned.
  - **Footer**: dark `#1a1a1a` bar pinned to the foot — `WORLD BANK GROUP | IBRD IDA IFC MIGA
    ICSID` at the left, `© 2026 …` at the right, all white.
  - Unfilled optional regions (breadcrumb/actions on a screen that omits them) **collapse** —
    no empty boxes.

## Net-new follow-ups (not yet built)
The header bar + WBG footer chrome are now styled by the theme. Remaining pieces from the
"Form page" shell to build as their own items:
- **Breadcrumb widget** — the content for the `loop-content__breadcrumbs` slot (OutSystems
  Breadcrumb or a Loop breadcrumb), incl. the leading home icon.
- **Language selector** — the `EN US ▾` control's menu behaviour (the button styling is the
  existing Loop tertiary text-button).

**Delivered** ✅ **Responsive nav toggle / in-header collapse** — shipped in
`tokens/outsystems-ui-side-responsive.css` (desktop collapse to an 84px icon rail via
`.loop-nav-toggle` + `.aside-collapsed`, with the `.is-swapped` logo/toggle rail-header option;
tablet/phone off-canvas drawer + blue scrim via the native `.menu-icon`
restyle). See the "responsive nav toggle" `<details>` above and its Mentor prompt.

## Related findings
**FND-058** (register-only, low — `design-token`) — the WBG footer surface `#1a1a1a` has **no
primitive token** in the ramp (nearest brand dark is `--color-secondary` #002244, a different
hue). Built faithfully via an orphan semantic token `--color-bg-footer-external: #1a1a1a`
(declared like the other "no primitive" orphans in `semantic-colors.css`). Also: the desktop
grid margin `72px` (Figma "Grid/Margin/12 Col") has no token — the header/footer inline padding
uses `--space-xlarge` (48px) to keep both edges aligned. Confirm both with design.

**FND-057** (register-only, low) — the design frame ships the side-menu item in its **resting**
state only; the **hover/active/selected** treatment is unspecified. Built provisionally with
existing Loop role tokens (neutral-2 hover pill; blue-10 selected pill + primary text) — no
invented brand colours. Confirm or replace the state spec with design.

## Accessibility (WCAG 2.2 AA)
- Dark text on the white panel: menu items `neutral-9` (#252e37) ≈ 12:1; logo blue-90 ≈ 13:1 —
  both pass AA comfortably.
- Active state is conveyed by the pill **fill + text-colour shift**, not colour alone.
- Menu items are ≥ 48px tall — clears the SC 2.5.8 (AA) 24px target minimum.
- Focus ring is the on-light Blue/50 outline on a **light** surface, so (unlike the dark
  Layout Top header, FND-012) it is perceivable here.
