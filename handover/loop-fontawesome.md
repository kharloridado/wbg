# Handover — Font Awesome 6 Pro (full icon set) in OutSystems ODC

Make the **entire Font Awesome 6 Pro** icon set (~3,300 icons: **solid · regular · light**)
available across the WBG "The Loop" app and usable anywhere as:

```html
<i class="fa-solid fa-user"></i>
```

It is **self-hosted** — no CDN, no Font Awesome kit. The webfonts live in **ODC Resources**
and the `@font-face` `src` points at `/TheLoopTheme/*.woff2`, which ODC rewrites to a
fingerprinted path at compile time — exactly the pattern the brand **Open Sans** faces already
use (`tokens/typography.css`). Source: the designer-provided **Font Awesome Pro 6.7.2**
desktop package (Commercial License — **licensed asset, do not redistribute** outside this
project; self-hosting inside the WBG app is covered).

## When to use / How to use

**What it is.** The complete FA6 Pro glyph set as a self-hosted icon font, plus the CSS that
maps every `.fa-<name>` class to its glyph.

**When to use**
- Any icon need not already covered by the native OutSystems UI **Icon** widget.
- Icons inside custom Blocks, Web Components, Expressions, or rich text.
- **Light** is the style the designer's mockups use for line icons — prefer `fa-light` when
  matching Figma line-icon specs.

**When *not* to use** (reach for instead)
- Icons the OutSystems UI **Icon** widget already exposes — keep using the widget for those so
  native patterns stay consistent. This import is **additive**; it does **not** replace it (see
  "Why we keep only the v6 families" below).

**How to use** — drop an **HTML Element** (tag `i`) or an **Expression** (Unescaped) with the
class string. Style families and the icon name combine:

| Family class | Alias | Font |
|---|---|---|
| `fa-solid` | `fas` | solid — weight 900 |
| `fa-regular` | `far` | regular / outline — weight 400 |
| `fa-light` | `fal` | light / thin outline — weight 300 |

```html
<i class="fa-solid fa-magnifying-glass"></i>   <!-- search -->
<i class="fa-regular fa-heart"></i>            <!-- outline heart -->
<i class="fa-light fa-heart"></i>              <!-- light (thin) heart -->

<!-- sizing + utilities are built in (no inline styles needed) -->
<i class="fa-solid fa-gear fa-2x"></i>         <!-- fa-xs … fa-2xl, fa-lg, fa-fw, fa-spin, fa-beat -->

<!-- colour via the theme's token utilities (hard rule #3 — no hard-coded hex) -->
<i class="fa-solid fa-circle-check text-green-60"></i>
```

Full searchable list: <https://fontawesome.com/v6/search?o=r> — or use the in-app
`<loop-icon-reference>` grid on the Live Style Guide (handover #138), which now includes the
Light style.

## Why this approach
- **Self-hosted, not CDN.** The app already self-hosts Open Sans from ODC Resources; icons
  follow the same path so there is no third-party runtime dependency and no extra origin to
  allow-list. The `/TheLoopTheme/*.woff2` literal is rewritten by ODC — **do not "fix" it**.
- **woff2 only.** The Pro desktop package ships OTFs; the build converts them to woff2
  (`build/convert-fa-otf.mjs`), so only **3 files** travel to Resources. Brands are not
  shipped — no brand-logo icons in the designs, and dropping the face saves a Resource.
- **Why we keep only the v6 families.** FA's web CSS historically also declares legacy
  `@font-face` names — `'Font Awesome 5 Free/Brands'`, `fa-v4compatibility`, and crucially
  **`'FontAwesome'`**, which is the *exact* family the native OutSystems UI Icon widget declares
  (`vendor/outsystems-ui/.../_icon-library-odc.scss`). The build **excludes** those so this
  import can never clobber the native widget — only `'Font Awesome 6 Pro'` (300 + 400 + 900)
  remains.

## Files
| File | OutSystems destination |
|---|---|
| `dist/fontawesome.css` (or `dist/fontawesome.min.css`) | **Its own paste** — paste into the ODC Theme editor *below* OutSystems UI (like `dist/theme.css`) |
| `dist/fontawesome-webfonts/fa-solid-900.woff2` | ODC **Resources** → `Deploy Action = Deploy to Target Directory` |
| `dist/fontawesome-webfonts/fa-regular-400.woff2` | ODC **Resources** → `Deploy Action = Deploy to Target Directory` |
| `dist/fontawesome-webfonts/fa-light-300.woff2` | ODC **Resources** → `Deploy Action = Deploy to Target Directory` |
| `vendor/fontawesome-6/` | Source of truth (FA Pro 6.7.2: converted woff2 + generated CSS) |
| `build/convert-fa-otf.mjs` · `build/gen-fa-pro-css.mjs` · `build/build-fontawesome.mjs` | Build tooling — regenerates `dist/fontawesome.*` |

## Code to paste into ODC

> Unlike a Block/Web-Component handover, the icon CSS is **its own paste** — the same way
> `dist/theme.css` travels — and is **not inlined here** (it is ~4,800 icon rules / ~120 KB
> minified). Open the generated file and paste its full contents; regenerate with
> `npm run build:fontawesome`.

**1 — Upload the 3 webfonts to ODC Resources.** In Service Studio, under your Theme (or a shared
Library): **Resources → Import Resource** each of:
`fa-solid-900.woff2`, `fa-regular-400.woff2`, `fa-light-300.woff2` (from
`dist/fontawesome-webfonts/`). Set each one's **Deploy Action = `Deploy to Target Directory`**.
The CSS references them as `/TheLoopTheme/<file>.woff2`; ODC rewrites that to the fingerprinted
Resources URL at publish time (same mechanism as the Open Sans faces — confirmed working, see
`tokens/typography.css`).
> **Upgrading from the Free build?** `fa-solid-900.woff2` / `fa-regular-400.woff2` keep their
> names — re-import them (the Pro faces replace the Free ones), add the new
> `fa-light-300.woff2`, and **delete `fa-brands-400.woff2`** (brands are no longer shipped).

**2 — Paste the icon CSS.** Open `dist/fontawesome.css` (readable) or `dist/fontawesome.min.css`
(minified) and paste the **entire** file into the **ODC Theme** CSS, *below* the OutSystems UI
block and below `dist/theme.css`, **replacing** the previous Font Awesome paste if present.
(It carries only the 3 v6 `@font-face` rules + the `.fa-*` classes — no tokens, so nothing in
`theme.css` is duplicated.)

**3 — Use an icon** anywhere via an HTML Element (tag `i`) or Unescaped Expression:
`<i class="fa-solid fa-user"></i>`.

## Accessibility (WCAG 2.2 AA)
- **Decorative** icons (next to a text label, or purely ornamental) must be hidden from
  assistive tech: `<i class="fa-solid fa-tag" aria-hidden="true"></i>`.
- **Meaningful** icons (icon-only buttons/links) need an accessible name — put it on the
  interactive control, e.g. an icon-only button with `aria-label="Search"`, not on the `<i>`.
- Don't rely on colour alone to convey state (icon shape + text/label should carry it).
- Icon size scales with `font-size` (`fa-2x`, etc.) — keep icon-only hit targets ≥ 24×24 CSS px
  (ideally 44×44) per the project's touch-target rule.

## Build in ODC with Mentor Studio

> Paste this into **ODC Mentor Studio** to scaffold the OutSystems side of this handover.
> Mentor is a logic/data agent — it does **not** author CSS or import Resources, so do the
> upload + paste steps above first. Reusable template + notes: `handover/MENTOR-STUDIO-PROMPT.md`.

```
Goal: In ODC Studio, create a small reusable "Icon" Block for the WBG "The Loop" design system
that renders a Font Awesome 6 icon, so screens don't hand-type <i> markup.

Context (already done manually — do NOT re-create or edit these):
- dist/theme.css and dist/fontawesome.css are already pasted into the ODC Theme editor, and the
  3 Font Awesome woff2 files are imported as Resources (Deploy to Target Directory). The icon
  font therefore already works app-wide via <i class="fa-solid fa-user"></i>.
- Do NOT write or edit CSS, fonts, or the Theme. Your job is only the Block and its inputs.

Task — create these elements, referencing each by the exact name given:
1. Create a Block named "Icon" with input parameters:
     Style    : IconStyle (Static Entity) : IconStyle.Solid
     Name     : Text                       : "user"      // the fa name without the "fa-" prefix
     Size     : Text                       : ""          // optional FA size class, e.g. "fa-2x"
     ColorClass : Text                     : ""          // optional theme token utility, e.g. "text-blue-60"
     Decorative : Boolean                  : True        // aria-hidden when purely decorative
     AriaLabel  : Text                     : ""          // accessible name when NOT decorative
   Static Entity — create first: IconStyle with a single Text attribute "Value" set as the
   record Identifier (delete the default Id/Label/Order/Is_Active). Records:
     Solid = "fa-solid", Regular = "fa-regular", Light = "fa-light".
2. Place an HTML Element (tag "i") in the Block. Build its class with an expression:
     Style + " fa-" + Name + If(Size <> "", " " + Size, "") + If(ColorClass <> "", " " + ColorClass, "")
   Set aria-hidden = If(Decorative, "true", "false") and, when not decorative, set
   aria-label = AriaLabel and role = "img".
3. No events or Client Actions are needed.

Constraints: never edit the OutSystems UI module; add no CSS or hard-coded hex (colour comes
from the theme token utility classes). After generating, list every element you created by name
and flag anything you could not finish.

Start with step 1 (the Block "Icon" interface + the IconStyle entity) and show it to me before wiring.
```

## Checklist
- [ ] `npm run build:fontawesome` → produces `dist/fontawesome.css`, `dist/fontawesome.min.css`,
      and `dist/fontawesome-webfonts/` (3 woff2).
- [ ] Import the 3 woff2 into ODC **Resources**, `Deploy Action = Deploy to Target Directory`
      (re-import `fa-solid-900` / `fa-regular-400` — now Pro faces — add `fa-light-300.woff2`,
      and remove `fa-brands-400.woff2` if present).
- [ ] Paste `dist/fontawesome.css` (or `.min.css`) into the ODC **Theme** CSS, below OutSystems
      UI and below `dist/theme.css`, replacing the previous Font Awesome paste.
- [ ] Publish, then open in a **real browser** (hard rule #2): confirm `<i class="fa-solid fa-user">`,
      a `fa-regular` and a **`fa-light`** icon all render (not empty boxes), a
      **Pro-only icon** (e.g. `<i class="fa-light fa-acorn">`) renders, and the **native
      OutSystems UI Icon widget still works** (no `'FontAwesome'` clash).
- [ ] Spot-check colour via a token utility (`text-blue-60`) and a size class (`fa-2x`).
- [ ] (Optional) Update the **Icon** Block's `IconStyle` entity with the new `Light = "fa-light"`
      record (or build the Block via the Mentor prompt above).
