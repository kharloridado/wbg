FND-009 [brand] Accent/Indigo ramp inversion

<!-- dedup: [node:11122-2143] -->

**Type:** brand · **Severity:** medium
**Location:** Palette / Accent·Indigo [node:11122-2143]

**Observed (as designed):** `Indigo/40` `#9fa9f7` is darker than `Indigo/50` `#a8b2ff` — step 50 should be ≥ step 40 in darkness.

**Rule violated:** Ramps must be monotonic light→dark.

**Recommendation:** Swap the 40/50 values or re-step the Indigo ramp.

**Implementation note:** Built faithfully as published.

Labels: finding,bug,brand,sev:medium
