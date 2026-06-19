FND-001 [consistency] Foreign token systems leaked into the WBG library

<!-- dedup: [node:10995-7259] -->

**Type:** consistency
**Severity:** high
**Location:** The Loop — Main Library · Type/role page · [node:10995-7259]

**Observed (as designed):**
The WBG/`lift` token collection is polluted with tokens from several unrelated design systems:
- `_ITSES/*` — Open Sans (e.g. H1/Large 80px, H2/Base 40px, Titles/Base 21px)
- `_GDS/*` — Manrope (H/H2 48px, Paragraph/Medium 18px)
- `Headings Desktop/*` — Andes (DisplayMedium 32px, Heading 24px)
- `DS L2.0 Styles/*` — IBM Plex Sans (Heading/H3 24px)
- strays: `Primary Blue/06` `#0071BC`, `WB Brand/White`, `Drop Shadow/02-Cards`, `Label/L`, `Label/S`, `Text/Link` `#0071BC`, `Generic/White`, `Frequently Used/*`

**Rule violated:** Single source of truth — a brand library must not carry foreign/legacy token systems.

**Recommendation (for design / brand owner):**
Remove or relocate the non-`lift` systems out of the WBG library, or explicitly namespace them as out-of-scope/deprecated. They create naming collisions and make "which token is canonical" ambiguous (see FND-002).

**Implementation note:**
Build is faithful — these foreign tokens were **deliberately excluded** from `tokens/*.css` and `dist/theme.css`. Only the canonical `lift` + primitive ramps were imported. No code change pending a brand decision.

Labels: finding,bug,consistency,sev:high  ·  Issue type: Bug
