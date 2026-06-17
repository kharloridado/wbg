FND-002 [design-token] Ambiguous canonical brand font

<!-- dedup: [node:10995-7259] [node:11122-2143] -->

**Type:** design-token
**Severity:** high
**Location:** The Loop — Main Library · Type page [node:10995-7259] + Colors [node:11122-2143]

**Observed (as designed):**
The library defines type in **six** font families: Inter, Open Sans, Poppins, Manrope, Andes, IBM Plex Sans.
Even within the canonical `lift` system the body font conflicts:
- `lift/global/font-family/body` = **Inter**
- `lift/global/font family` = **Open Sans**
- `font-family/heading` / `font-family/label` = **Poppins**
- primitive `Global/Font Family` (Heading/* + Body/* styles) = **Open Sans**

**Rule violated:** A brand needs one canonical body font and one canonical heading font; conflicting aliases for the same role are token drift.

**Recommendation (for design / brand owner):**
Confirm the canonical body and heading fonts and collapse the conflicting aliases. If Inter (body) + Poppins (heading) is correct, deprecate the Open Sans `lift/global/font family` alias and the Open Sans primitive type styles.

**Implementation note:**
Build is faithful to the most specific `lift` core tokens: `--font-family-body: Inter`, `--font-family-heading/-label: Poppins`. No silent substitution — the conflict is flagged here for sign-off.

Labels: finding,bug,design-token,sev:high  ·  Issue type: Bug
