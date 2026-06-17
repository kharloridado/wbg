FND-006 [design-token] Orphan semantic tokens with no primitive

<!-- dedup: [node:11122-2879] -->

**Type:** design-token · **Severity:** low
**Location:** Semantic Colors [node:11122-2879]

**Observed (as designed):** Roles with hardcoded values not traceable to a primitive: `Text/On Light/Subdued` `#000d1a91`, `Text/On Blue` `#004099`, `Text/On Light/Link/Hover` `#066db1` (light); `Divider/On Dark/Default` `#00538a99` (dark, deferred).

**Rule violated:** Semantic tokens should reference a primitive.

**Recommendation:** Add matching primitives or retarget these roles.

**Implementation note:** Built faithfully as literals; the other ~166 roles reference primitives via var().

Labels: finding,bug,token,sev:low
