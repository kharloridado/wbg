# Handover — Layout Side sidebar (branded app shell)

Brand the OutSystems UI **Layout Side** so the left menu reads as The Loop chrome:
**light (white) sidebar with dark text, a 320px panel, menu items as 32px pills, a
brand-emphasis logo label, and a profile block at the foot.** Restyles the native
`.app-menu-content` + `.app-menu-links` (+ `.header-logo` / `.app-login-info`) — no custom
block, no JS. Source design: Figma *The Loop — OutSystems Library*, frame **"Form page"**
node `30132:139314`. Full structural analysis: `docs/layout-side-structure.md`.

**Approach:** native-widget restyle (no parallel `loop-` system). Two theme-layer files:
- `tokens/outsystems-ui-overrides.css` sets `--side-menu-size: 320px` (the panel width OS UI
  resolves on `.app-menu-content`).
- `tokens/outsystems-ui-side.css` carries the class-level bits a token can't express: the
  white panel edge + brand shadow, the pill menu items (radius, sizing, SemiBold 16/24
  neutral-9 text), the hover/selected pill states, the logo label and profile type, and the
  on-light focus ring. All scoped under `.layout-side`, so the Layout **Top** header
  (default OutSystems — no override) is unaffected.

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
- Layout **Top** headers are **not** branded — they keep the default OutSystems header.

**How to use**
- Already folded into `dist/theme.css` — use the standard **Layout Side** template; drop your
  screen content into the layout's **Content placeholder** (the chrome stays fixed).

## Files
| File | OutSystems destination |
|---|---|
| `tokens/outsystems-ui-overrides.css` | Included automatically in `dist/theme.css` — paste theme into ODC Theme editor |
| `tokens/outsystems-ui-side.css` | Included automatically in `dist/theme.css` |

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

/* Hover / selected — PROVISIONAL (resting state is all the frame ships; FND-057). */
.layout-side .app-menu-links a:hover {
  background-color: var(--color-neutral-2); color: var(--color-neutral-9); text-decoration: none;
}
.layout-side .app-menu-links a.active,
.layout-side .app-menu-links a.active:hover {
  background-color: var(--color-primary-selected); border-left: 0; color: var(--color-primary);
}

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
language selector), the dark WBG footer (IBRD · IDA · IFC · MIGA · ICSID · ©), and the
in-logo collapse/expand toggle.

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
> `30139:39737`); the breadcrumb widget, the language selector behaviour, and the in-logo
> collapse toggle remain net-new items.

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
> slot), the **language-selector** behaviour, and the **in-logo collapse/expand toggle**.

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

## OutSystems install checklist
- [ ] Confirm the app/screen uses the **Layout Side** layout (this branding targets the side
      menu; Layout Top is branded separately and is unaffected).
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
- **In-logo collapse/expand toggle** (the framework supports collapse; the in-logo placement
  is custom).

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
- Focus ring is the on-light Blue/50 outline on a **light** surface, so it is clearly
  perceivable here (FND-012 covers the brand ring replacing the OutSystems default).
