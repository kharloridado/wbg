FND-010 [design-token] Green/Yellow non-uniform step naming

<!-- dedup: [node:11122-2143] -->

**Type:** design-token · **Severity:** low
**Location:** Palette / Green + Yellow [node:11122-2143]

**Observed (as designed):** Step naming mixes numeric steps with `$lift-core … base`/`on-dark` raw names (`green-on-dark-07`, `green-base`, `yellow-base`, `yellow-on-dark-base`) — non-uniform vs Blue/Red/Purple's 10–90 scale.

**Rule violated:** Uniform step naming across ramps.

**Recommendation:** Renumber Green/Yellow to a 10–90 scale.

**Implementation note:** Built faithfully with the source names.

Labels: finding,bug,token,sev:low
