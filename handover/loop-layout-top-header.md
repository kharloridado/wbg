# Handover — Layout Top header (branded chrome)

Brand the OutSystems UI **Layout Top** so the top header reads as The Loop chrome:
**primary-color header background, white text/links, and a white bottom border under the
active menu item.** Restyles the native `.header` + `.app-menu-links` — no custom block, no JS.

**Approach:** native-widget restyle (no parallel `loop-` system). Two theme-layer files:
- `tokens/outsystems-ui-overrides.css` sets `--header-color: var(--color-primary)` — drives the
  header background via OutSystems' `get-app-settings-background-color('header', --header-color)`.
- `tokens/outsystems-ui-header.css` carries the class-level bits a token can't express: white
  link/text color (overriding framework `neutral-9` default and `primary` hover/active) and the
  white active underline. All scoped under `.header`, so a Layout Side sidebar is unaffected.

**Both files are already folded into `dist/theme.css`.** There is **nothing to hand-place per
block** — the whole change ships in the theme paste.

## When to use / How to use

> **Live Style Guide doc** — short usage spec for the Layout Top header page.

**What it is.** Branded app chrome — the OutSystems Layout Top header rendered as The Loop (primary-color background, white text/links, white active underline).

**When to use**
- Any app built on the OutSystems **Layout Top**. The branding applies automatically once the theme is pasted — there is nothing to hand-place per block.

**When not to use** (reach for instead)
- This is page chrome, not a content component — for a contained surface use a **Card**, for a message use a **System Alert**.
- Layout **Side** sidebars are intentionally unaffected by this scope.

**How to use**
- Already folded into `dist/theme.css` — just use the standard **Layout Top** template.

## Files
| File | OutSystems destination |
|---|---|
| `tokens/outsystems-ui-overrides.css` | Included automatically in `dist/theme.css` — paste theme into ODC Theme editor |
| `tokens/outsystems-ui-header.css` | Included automatically in `dist/theme.css` |

## Code to paste into ODC

> This handover is **theme-only**. Re-paste `dist/theme.css` into the ODC **Theme editor**
> (below OutSystems UI). The two source files below already live inside that theme — shown here
> for review, **do not paste them separately.**

<details>
<summary><code>tokens/outsystems-ui-overrides.css</code> (excerpt) → already in dist/theme.css</summary>

```css
/* Layout Top header/chrome → The Loop primary (was OutSystems default #ffffff). */
:root {
  --header-color: var(--color-primary);
}
```

</details>

<details>
<summary><code>tokens/outsystems-ui-header.css</code> → already in dist/theme.css</summary>

```css
/* Generic header text + application name / headings → white. */
.header { color: var(--color-white); }
.header .application-name,
.header h1, .header h2, .header h3 { color: var(--color-white); }

/* Hamburger lines + mobile back affordance, visible on the primary header. */
.header .menu-icon-line { background-color: var(--color-white); }
.header .menu-back { color: var(--color-white); }

/* Menu links: white in every state on the blue header. */
.header .app-menu-links a,
.header .app-menu-links a:hover,
.header .app-menu-links a.active { color: var(--color-white); }

/* Active item underline → white (Layout Top only). */
.layout:not(.layout-side) .header .app-menu-links a.active {
  border-bottom-color: var(--color-white);
}

/* Submenu groups (.osui-submenu) on the header bar → white text + white
 * active/hover bottom border; the floating white panel keeps its dark links. */
.header .osui-submenu__header__item,
.header .osui-submenu__header__item a,
.header .osui-submenu__header__item a:hover,
.header .osui-submenu:hover .osui-submenu__header__item,
.header .osui-submenu.active .osui-submenu__header__item,
.header .osui-submenu.active .osui-submenu__header__item a,
.header .osui-submenu.active--is-open .osui-submenu__header__item,
.header .osui-submenu.active .osui-submenu__header:hover .osui-submenu__header__item {
  color: var(--color-white);
}
.header .osui-submenu.active .osui-submenu__header,
.header .osui-submenu__header:hover { border-bottom-color: var(--color-white); }

/* Keep the floating dropdown panel legible (dark on its white popup). */
.header .osui-submenu__items a { color: var(--color-neutral-8); }
.header .osui-submenu__items a.active { color: var(--color-primary); }
```

</details>

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover.
> This is a **native-widget restyle**, so there is **no Block and no CSS** to build — Mentor's
> job is only to put the screen on the right Layout and author the top-menu structure. Mentor
> does **not** author the Theme CSS, so do the `dist/theme.css` paste in the checklist first.
> Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, set up the screen(s) so the WBG "The Loop" Layout Top header branding
renders. This is a native-widget restyle — the look is 100% Theme CSS + tokens, so there is
NO Block to build and NO CSS for you to write.

Context (already done manually — do NOT re-create or edit these):
- dist/theme.css (incl. tokens/outsystems-ui-overrides.css and tokens/outsystems-ui-header.css)
  is already pasted into the ODC Theme editor, below OutSystems UI. The primary-color header
  background, white text/links, and white active underline all come from that paste.
- Do NOT write or edit CSS, do NOT author JavaScript, do NOT edit the Theme or the
  OutSystems UI module.

Task — referencing every element by name:
1. Make sure the App/Screen uses the OutSystems "Layout Top" layout (the menu sits in the top
   header). Do NOT switch a Layout Side screen to this — the side branding is a separate handover.
2. Author the top menu in the layout's menu placeholder using the standard menu-link structure
   (one Link per item). The framework adds the "active" class to the current item — do not
   hand-set it.
3. For dropdown menu groups, use the OutSystems Submenu pattern (.osui-submenu) so the header
   tab and the open panel both pick up the branded styles.
4. Build whatever screen/navigation logic the menu needs (OnClick → Navigate, etc.).

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded colors/sizes — all
styling already comes from var(--token) in the pasted Theme. After generating, list what you
created/changed by name and flag anything you could not finish so I can do it manually.

Note (do not act on in code): the menu-link focus ring is low-contrast on the blue header —
tracked as finding FND-012; leave the ring color as-is pending design sign-off.
```

## OutSystems install checklist
- [ ] Confirm the app/screen uses the **Layout Top** layout (this branding targets the top header;
      Layout Side is intentionally left untouched).
- [ ] Rebuild `dist/theme.css` (`npm run build:theme`) and paste it into the ODC **Theme editor**,
      below OutSystems UI.
- [ ] 1-Click Publish → validate in a **real browser** (not Service Studio preview alone):
  - Header background = primary blue.
  - All menu links + header text render **white** (default, hover, and active).
  - The **application name** renders white.
  - The **active** menu item shows a **white** bottom border.
  - For dropdown menu groups (Submenu): the **header tab** is white with a white
    active/hover border, while the **open panel** stays a white popup with dark links.
- [ ] Keyboard: Tab through the menu — note the focus ring (see finding below).

## Related finding (awaiting design)
**FND-012** (issue [#23](https://github.com/kharloridado/wbg/issues/23)) — the brand focus ring is
Blue/50; on the now-blue header the menu-link focus ring is low-contrast (WCAG 2.4.7/2.4.11).
Built faithfully (ring kept Blue/50); a white focus ring on the Layout Top header is the proposed
fix pending design sign-off. Do not change the ring color in code until then.

## Accessibility (WCAG 2.2 AA)
- White text on the primary header (`--color-primary` = blue-70 `#004370`) ≈ 9:1 — passes AA.
- Active state is conveyed by the white underline **and** position, not color alone.
- Focus ring concern tracked in FND-012 (flag-don't-fix).
