# Designer Call — Decisions Needed

> WBG / The Loop design system. Items below are implemented **faithfully to Figma** today; code does not change until design rules. Generated 2026-06-24.

---

## 🔴 Decisions that block AA accessibility (need a ruling)

### 1. Resting border too faint on form controls — **FND-016 + FND-019** (one decision)
**Affects:** unchecked Checkbox border + resting Text Field input border (same token `--color-outline-on-light-default`).

- Today: `neutral-alpha-24 #00396b3d` → **1.45:1** over white. Floor is **3:1** (WCAG 2.2 SC 1.4.11, non-text contrast).
- ⚠️ The "obvious" fix (`Outline/On Light/Emphasis` = `neutral-alpha-42`) only reaches **2.53:1 — still fails.** Don't pick that.
- **Pick one passing value (applies to both controls):**

| Option | Value | Ratio | Feel |
|---|---|---|---|
| **A** | `neutral-50 #586e84` | 5.28:1 | Neutral grey, standard form border — safest |
| **B** | `blue-70 @70% #004370b3` | 4.55:1 | Brand-tinted blue, clean pass |
| **C** | `blue-70 @55% #0043708c` | 3.07:1 | Subtle, borderline pass |
| **D** | keep `#00396b3d` | 1.45:1 | Accept the fail (won't-fix) |

**→ Decision: ______**

---

### 2. Offline System Alert text unreadable — **FND-042** (HIGH, filed as Bug [#74](https://github.com/kharloridado/wbg/issues/74))
**Affects:** title, message, action, icon, dismiss on the `offline` alert.

- Today: white text on `#8a9db1` (neutral-40) → white-75 **2.23:1**, white-90 **2.6:1**. Floor is **4.5:1** (SC 1.4.3).
- Currently **signed off as-is** (stakeholder), raised for your confirmation.
- **Options:**
  - **Darken background:** neutral-60 `#4b5e71` (white-75 → 4.62, white-90 → 5.80) or neutral-70 `#3d4c5c` (5.79 / 7.51) — keeps white text.
  - **Dark text:** blue-90 `#012740` on `#8a9db1` → 5.52.
  - **Accept as-is** — document the trade-off.

**→ Decision: ______**

---

## 🟡 FYI / quick confirmations (low priority — batch sign-off)

These are built faithfully and logged for record. Worth a yes/no if there's time; not blocking.

- **Font style-name mismatches** — Badge Status (FND-036) & Badge Label (FND-040): Figma style named "SemiBold" but value is `500`. Already fixed in code (self-hosted Open Sans 500 Medium). **Ask:** rename the Figma styles → "Medium".
- **"Required" reads as an error** — Checkbox (FND-017) & Radio (FND-023): resting Required state renders in error-red, identical to validation error. **Ask:** give Required its own resting treatment (e.g. label marker)?
- **Off-scale component values** — gap `6px`, vpadding `18/14/11px`, tracking `-0.5px`, etc. (FND-013/018/022/031). **Ask:** confirm these are intentional or add to the documented scale.
- **Default size ambiguity** — Text Field / Checkbox / Button document 3 vs 4 sizes; default shipped as Regular to align the family (FND-021/038/043). **Ask:** confirm Regular as the family default.
- **Flat shadows** — Card (FND-034) & Modal (FND-046) ship with no elevation ("Modern / external web" intent). **Ask:** confirm flat is intended.
- **"Subdued" has two values** — `#00294d91` (placeholder) vs `#000d1a91` (semantic role) (FND-020/006). **Ask:** reconcile to one.
- **Foreign `lift` token / missing primitives** — Select list border `#dae1e8`, badge hues (indigo/teal/magenta), search icon, popover/tooltip shadows (FND-032/039/049/027/052). **Ask:** add to the WBG foundation ramp or confirm as component literals.

---

### Reference
Full detail + ratios for every item: `findings/findings-register.md`. Bug tracker: GitHub issues labeled `finding`.
