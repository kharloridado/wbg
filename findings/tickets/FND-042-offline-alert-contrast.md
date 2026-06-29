FND-042 [a11y] Offline System Alert — text contrast fails AA

<!-- dedup: [system-alert:offline] -->

**Type:** a11y/contrast · **Severity:** high
**Location:** System Alert — `offline` type. Text over `--loop-sysalert-offline-bg` `#8a9db1` (color-neutral-40 / Domain·Interactive·Disable): title/icon/dismiss = white-75 `#ffffffbf`, message/action = white-90 `#ffffffe5`.

**Observed (as designed):** White-75 over `#8a9db1` ≈ **2.22:1** and white-90 ≈ **2.55:1** — both below the 4.5:1 normal-text minimum and the 3:1 large-text/non-text floor. Affects title, message, action, icon and dismiss glyphs on the offline alert.

**Rule violated:** WCAG 2.2 SC 1.4.3 (text contrast).

**Recommendation (any one reaches AA):**
- Darken the offline bg → `neutral-60 #4b5e71`, keep white text: white-75 **4.62:1**, white-90 **5.80:1** (minimum darkening that passes both).
- Darken the offline bg → `neutral-70 #3d4c5c`, keep white text: white-75 **5.79:1**, white-90 **7.51:1** (more margin).
- Keep the grey bg, switch text to a dark role (`blue-90 #012740`): **5.52:1** (inverts text polarity vs the other alert types).

**Implementation note:** Built faithfully — `#8a9db1`, white-75 and white-90 left unaltered; disclosed only (CLAUDE.md hard rule #4, no silent substitution). Stakeholder elected NOT to change code (2026-06-24); raised to designer for a ruling.

Labels: finding,bug,a11y,sev:high
