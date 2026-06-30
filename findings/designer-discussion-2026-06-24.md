# Designer Discussion — The Loop / WBG Design-Conformance Findings
**Prepared:** 2026-06-24 · **For:** design / brand owner · **From:** front-end (Kharlo)

## How to read this
Every item below was **built faithfully to the Figma mockup** — nothing in code was
silently changed. These are conflicts between the design as published and our
accessibility / token rules that need a design decision. Pick an option per item; we'll
apply the code change (or keep the faithful build + sign-off) accordingly.

Contrast figures are measured (WCAG 2.2): **4.5:1** = normal text minimum, **3:1** =
large text / non-text (borders, icons, UI boundaries).

---

## A. Decisions needed now

### A1 — Offline System Alert: text too low-contrast  `FND-042` · **HIGH** · GitHub #74
**Where:** System Alert, `offline` type — white text on the muted grey fill `#8a9db1`
(neutral-40, the "disabled/muted" role).
**Problem:** white-75 text = **2.22:1**, white-90 = **2.55:1**. Both fail the 4.5:1
normal-text minimum (and the 3:1 floor). Affects title, message, action, icon, dismiss.

| Option | Result | Notes |
|---|---|---|
| **① Darken bg → neutral-60 `#4b5e71`**, keep white text | white-75 **4.62**, white-90 **5.80** | *Recommended.* Smallest change that passes; keeps the white-on-grey offline look, just deeper grey. |
| ② Darken bg → neutral-70 `#3d4c5c`, keep white text | **5.79 / 7.51** | Darker, more solid banner; more margin. |
| ③ Keep grey bg, flip text → blue-90 `#012740` | **5.52** | Preserves the light muted-grey, but inverts text polarity vs the other alert types. |
| ④ Sign off as-is | fails | Accept the trade-off; faithful to Figma, no change. |

**Decision:** ☐ ① ☐ ② ☐ ③ ☐ ④ ___________

---

### A2 — Resting border on Checkbox & Text Field too faint  `FND-016` + `FND-019` · medium
**Where:** the resting (unchecked / un-focused) boundary of the Checkbox box and the
Text Field input — both use `--color-outline-on-light-default` = neutral-alpha-24
`#00396b3d`.
**Problem:** that boundary over white = **1.57:1**, below the 3:1 non-text minimum, so the
control edge is hard to perceive at rest. *One ruling fixes both controls* (shared token).

> ⚠️ Correction to our earlier note: the previously-suggested `Outline/On Light/Emphasis`
> (neutral-alpha-42) only reaches **2.53:1 and still fails** — don't use it.

| Option | Result | Notes |
|---|---|---|
| **① blue-70 @ 70% `#004370b3`** | **4.55** | *Recommended.* Subtle brand-blue edge with safe margin. |
| ② neutral-50 `#586e84` (solid) | **5.28** | Clear neutral-grey edge, strongest definition, existing token. |
| ③ blue-70 @ 55% `#0043708c` | **3.07** | Closest to the current faint look, but only just clears 3:1. |
| ④ Sign off as-is | fails | Keep faithful; accept the faint resting edge. |

**Decision:** ☐ ① ☐ ② ☐ ③ ☐ ④ ___________

---

## B. Closed — for awareness only (no action needed)

- **`FND-011`** Blue/40 `#169af3` text contrast (3.02:1) — **closed, not reproduced.**
  Audit confirmed Blue/40 is never used as interactive/link *text* in the build (only
  background fills with dark labels, an underline *decoration* where the label stays
  Blue/70, and borders/icons ≥3:1). No design decision required. *If* you intend a future
  design to use Blue/40 as small link text, ping us — that would re-open it.

---

## C. Figma-hygiene follow-ups (code is correct; the cleanup lives in Figma)

These were resolved with **no code change** but leave a small inconsistency in the Figma
library worth tidying so design and code stay in sync.

- **`FND-036` / `FND-040` — Badge label weight name mismatch.** The Badge Status and
  Badge Label styles are *named* "SemiBold" but carry `font-weight: 500` (= Medium). We
  honoured the value: we now self-host an **Open Sans 500 (Medium)** face, so the badges
  render true Medium. **Ask:** either rename the Figma style "SemiBold" → **"Medium"** to
  match the 500 value, or change the token to **600** if SemiBold was actually intended.
- **`FND-003` — Shadow colour drift.** Confirmed canonical = effects-page `#21262d29`;
  the **colors page still shows `#000d1a29`** — please reconcile it in Figma.

---

## D. Already accepted by brand owner (logged, closed)
For completeness — these were reviewed and accepted as-is (no code, no further action):
FND-001, 002, 004, 006, 007, 008, 009, 010, 012. See `findings/findings-register.md`
for the full rationale on each.

---

*Full detail + measured values for every finding: `findings/findings-register.md`.
GitHub finding issues: label `finding` on `kharloridado/wbg`.*
