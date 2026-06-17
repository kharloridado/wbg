FND-003 [design-token] Shadow color drift

<!-- dedup: [node:19737-9489] [node:11122-2143] -->

**Type:** design-token · **Severity:** medium
**Location:** Effects page [node:19737-9489] vs Colors page [node:11122-2143]

**Observed (as designed):** `lift/effects/shadow/default` resolves to `#21262d29` on the effects page but `#000d1a29` on the colors page.

**Rule violated:** A token must resolve to a single value (per mode).

**Recommendation:** Reconcile to one shadow color.

**Implementation note:** Built faithfully with the effects-page value `#21262d29` (dedicated source); the mismatch is flagged, not silently merged.

Labels: finding,bug,token,sev:medium
