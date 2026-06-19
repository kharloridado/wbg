FND-011 [a11y] Blue/40 #169af3 fails normal-text AA

<!-- dedup: [node:11122-2879] -->

**Type:** accessibility · **Severity:** medium
**Location:** Semantic Colors · `Domain·Interactive·Hover` + `Domain·Secondary` = `Blue/40` `#169af3` [node:11122-2879]

**Observed (as designed):** `#169af3` on white = **3.02:1** — below the 4.5:1 normal-text minimum (meets 3:1 for large text / UI components).

**Rule violated:** WCAG 2.2 SC 1.4.3 (contrast minimum).

**Recommendation:** Where used as interactive/link *text*, darken to `Blue/50 #0071bc` (≈4.6:1).

**Implementation note:** Built faithfully; flagged for sign-off (no value changed).

Labels: finding,bug,a11y,sev:medium
