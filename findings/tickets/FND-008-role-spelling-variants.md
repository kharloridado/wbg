FND-008 [consistency] Cross-group role spelling variants

<!-- dedup: [node:11122-2879] -->

**Type:** consistency · **Severity:** low
**Location:** Semantic Colors [node:11122-2879]

**Observed (as designed):** One role spelled many ways across groups — "info" = `informational`(Domain)/`Information`(Background)/`Informational`(Outline,Icon)/`Info`(Text); "suggestion" = `Suggestion`(Domain,Background)/`Suggestional`(Outline,Icon)/`Suggest`(Text).

**Rule violated:** One canonical name per role across all groups.

**Recommendation:** Standardise on `informational` and `suggestion` everywhere.

**Implementation note:** Built with normalised `-info-` / `-suggest(ion)-` token names.

Labels: finding,bug,consistency,sev:low
