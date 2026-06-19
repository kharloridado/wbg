FND-007 [design-token] Domain/States "informational" casing clash

<!-- dedup: [node:11122-2879] -->

**Type:** design-token · **Severity:** low
**Location:** Semantic Colors [node:11122-2879]

**Observed (as designed):** `Domain/States/informational/*` is lowercase while every sibling state group (`Positive`/`Negative`/`Warning`/`Suggestion`/`Disable`) is title-case.

**Rule violated:** Consistent token casing.

**Recommendation:** Rename to `Informational`.

**Implementation note:** Built as `--color-domain-state-info-*`.

Labels: finding,bug,token,sev:low
