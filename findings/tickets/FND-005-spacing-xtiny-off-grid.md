FND-005 [design-token] Spacing/xtiny = 2px breaks the 4pt grid

<!-- dedup: [node:10994-5086] -->

**Type:** design-token
**Severity:** low
**Location:** The Loop — Main Library · Spacing System [node:10994-5086]

**Observed (as designed):**
`Spacing/xtiny` = **2px**, which is off the project's 4pt base spacing grid.

**Rule violated:** Project spacing base = 4pt.

**Recommendation (for design / brand owner):**
Confirm 2px is intentional (e.g. a hairline) or drop/round it to keep the scale on a 4pt grid.

**Implementation note:**
Built faithfully as `--space-xtiny: 2px` (tokens/spacing.css). No change pending a decision.

Labels: finding,bug,token,sev:low  ·  Issue type: Bug
