FND-004 [design-token] Border-radius naming/value mismatch

<!-- dedup: [node:19737-9489] [node:10995-7259] -->

**Type:** design-token · **Severity:** medium
**Location:** Effects page [node:19737-9489] + Type page [node:10995-7259]

**Observed (as designed):** `lift/border radius/radius-4` = 16px (name implies 4), `lift/border radius/base` = 4px, `Border Radius/Medium` = 8px, `Border Radius/Large` = 16px.

**Rule violated:** Consistent, non-misleading token names.

**Recommendation:** Rename `radius-4` → `radius-large`/`-16`; align the `lift` and primitive radius names.

**Implementation note:** Built as base 4 / medium 8 / large 16.

Labels: finding,bug,token,sev:medium
