To: kharlo.ridado@outsystems.com
Subject: The Loop design system — 21 questions before we lock the tokens (each links straight to the right Figma frame)

Hi,

We've finished extracting the foundation tokens (color, type, spacing, radius, shadow) from **The Loop — Main Library** into the OutSystems theme, and we've paused before building any components. Pausing here is deliberate: a token decided wrong now would cascade into every button, field, and checkbox later.

While extracting, we logged **21 points that need a design/brand call**. We built everything exactly as drawn in Figma — nothing was "fixed" silently — so these are genuinely your decisions, not bugs we've already changed.

**How to use this email:** every item below has a link that opens the exact frame in Figma — you don't need to hunt for a node ID, just click. I've grouped the questions by page, so you can open one page and answer everything on it in one pass. For each item I just need a short reply: *keep as-is* or *change to X*.

If you only have ten minutes, the **7 starred (★) items** are the ones that block the most or affect accessibility — please answer those first.

---

## ★ Start here (highest impact)

1. **★ Foreign font/token systems are mixed into the WBG library** (Typography page). Several non-"lift" systems are sitting inside the brand library — Open Sans, Manrope, Andes, IBM Plex Sans, plus a few stray colors/shadows. Should these be **removed or moved out** of the WBG library (we won't ship them in the theme), or are some meant to stay?
   🔗 https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?node-id=10995-7259

2. **★ Indigo ramp looks inverted** (Palette page). `Indigo/40` is *darker* than `Indigo/50`, but a ramp should get darker as the number goes up. Should we **swap 40 and 50**, or re-step the Indigo ramp?
   🔗 https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?node-id=11122-2143

3. **★ Light blue used as link/button text is hard to read** (Semantic Colors). `Blue/40` on white is about 3.0:1 — below the 4.5:1 we need for normal text. Where it's used as interactive/link **text**, can we use the darker `Blue/50` instead? (Same blue is fine for large text / borders.)
   🔗 https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?node-id=11122-2879

4. **★ Button hover makes its own label hard to read** (Button). On hover, the fill darkens to a mid-blue but the label stays dark blue — about 2.9:1. Should the label flip to **white on the hover fill**, or should the hover fill be lighter?
   🔗 https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?node-id=15597-766

5. **★ Unchecked checkbox border is nearly invisible** (Checkbox). The resting box outline is about 1.45:1 against white — below the 3:1 a control boundary needs. Can we **darken the resting border** (e.g. to the "Emphasis" outline)?
   🔗 https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?node-id=19336-17679

6. **★ Empty text-field border is nearly invisible** (Text Field). Same issue as the checkbox — the resting input border is ~1.45:1. Darken the resting border to the same fix?
   🔗 https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?node-id=19336-9606

7. **★ Focus ring may disappear on blue surfaces.** Inheriting The Loop branding retints the keyboard focus ring from a high-contrast yellow to `Blue/50`. On a blue/dark surface, a blue ring on blue can be hard to see. Keep `Blue/50` on light backgrounds but use a **high-contrast ring on brand/dark surfaces**, or sign off the trade-off?
   🔗 https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?node-id=11122-2879

---

## Everything else, grouped by Figma page

### Effects — shadows & radius
🔗 https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?node-id=19737-9489
- **Shadow color disagrees with itself.** The default shadow is one color on the Effects page and a different color on the Colors page. **Which one is correct?** (We used the Effects-page value for now.)
- **Radius name is misleading.** `radius-4` is actually **16px**, not 4. Can we rename it (e.g. `radius-large`) so the names match the values? Today we have base 4 / medium 8 / large 16.

### Semantic Colors
🔗 https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?node-id=11122-2879
- **4 semantic colors don't point to a base palette color** (they're typed in directly). Should we **add matching base colors**, or retarget those roles?
- **"informational" is lowercase** while every sibling (Positive/Negative/Warning…) is Title Case. Rename to **Informational**?
- **The same role is spelled several ways** across groups — e.g. *info / Information / Informational / Info*, and *Suggestion / Suggestional / Suggest*. Can we settle on **one spelling each** (we suggest `informational` and `suggestion`)?

### Palette — primitive colors
🔗 https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?node-id=11122-2143
- **Green and Yellow steps are named differently** from Blue/Red/Purple (which use 10–90). Green/Yellow mix in names like `base` and `on-dark`. Renumber them to the **same 10–90 scale**?

### Button
🔗 https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?node-id=15597-766
- **The button label's letter-spacing (−0.5) isn't on the documented scale** (which is −0.35 / −1.5). Add −0.5 to the scale, or confirm it's intentional?

### Button — text style
🔗 https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?node-id=15597-4652
- **The keyboard-focus orange has no matching base color** in the orange ramp. Add a base color for it, or point it at an existing one?

### Checkbox
🔗 https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?node-id=19336-17679
- **"Required" looks identical to "Error" (red) before anyone touches the field.** A resting required box reads as a validation error. Can "Required" get its **own look** (e.g. a marker on the label) distinct from error-red?

### Text Field
🔗 https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?node-id=19336-9606
- **The disabled field border uses a dark-mode-only color** with no light-mode equivalent. Add a light disabled-border color, or keep the field borderless when disabled? (Borderless for now.)
- **"Subdued" has two different values** — the placeholder text uses one, the semantic "subdued" token uses another. Reconcile to **one value**?
- **The size system is ambiguous:** the notes say 3 sizes (Large/Normal/Small) but the showcase shows 4 (xLarge/Large/Regular/Small), and the default sample is xLarge. **Which set is canonical, and which is the default?**

### Radio Button
🔗 https://www.figma.com/design/aHtnwyPhI8WRbiGHZ8E5Gb/-The-Loop--Main-Library?node-id=19336-18637
- **Two label values aren't on the documented scales:** the Regular label's 13/15 size/line-height (the type scale is 12/14/16/18) and the Small label's 0.25 letter-spacing. Align to scale, or confirm they're intentional?
- **"Required" uses error-red here too** (same as the checkbox) — a resting required group reads as an error, and "required" is shown by color alone. Give it a **distinct treatment**?

---

Each of these is tracked as a ticket on our side (FND-001, FND-003–FND-004, FND-006–FND-023; the starred items are also GitHub issues — #12, #19, #21, #23). A one-word answer per item — *keep* or *change to X* — is all we need to unblock component build.

Thanks!
