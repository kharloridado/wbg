FND-067 [a11y] Warning System Alert — title contrast fails AA

<!-- dedup: [system-alert:warning-title] -->

**Type:** a11y/contrast · **Severity:** high
**Location:** System Alert — `warning` type, **title** (both single- and multi-line layouts). Figma node 17873:7408; title fill `rgba(255,255,255,0.75)` (white-75) over `--loop-sysalert-warning-bg` `#e19d00` (`Background/Container/On Light/State/Warning/Regular`).

**Observed (as designed):** The warning title is the only light element on the amber banner — white-75 composited on `#e19d00` ≈ **1.90:1**, below the 4.5:1 normal-text minimum and the 3:1 floor. The title is 16px/Bold, which does not qualify as WCAG "large text" (≥18.66px bold), so 4.5:1 applies. The sticker's own sibling elements (message, action, icon) use dark `#473201` ≈ **5.2:1** (passes AA) — the title reads nearly invisible next to them (confirmed in the rendered sticker, not just dev-mode fills).

**Rule violated:** WCAG 2.2 SC 1.4.3 (text contrast).

**Recommendation:** Set the warning title to the same dark warning text role as the message/action/icon — `Text/On Light/State/Warning` `#473201` (≈ **5.2:1**, passes AA and matches every other element on the banner). The white-75 title looks like a leftover from the dark-background alert types (error/informative/offline), where white-75 is the shared title role.

**Implementation note:** Built faithfully — `--loop-sysalert-warning-title: var(--color-gray-alpha-white-75)` per the sticker (2026-07-04, stakeholder-confirmed fidelity-first); disclosed only (CLAUDE.md hard rule #4, no silent substitution). Until this ruling, the shipped warning alert title is effectively unreadable. Related: FND-048 (per-layout colour variance on the same sticker, register-only).

Labels: finding,bug,a11y,sev:high
