FND-012 [a11y] Brand focus ring (Blue/50) replaces OutSystems high-contrast yellow

<!-- dedup: outsystems-ui-overrides:focus-outer -->

**Type:** accessibility/brand · **Severity:** medium
**Location:** tokens/outsystems-ui-overrides.css · `--color-focus-outer` (OutSystems UI v2.28.1 `$osui-colors-focus 'outer'`)

**Observed (as designed):** OutSystems UI ships a high-contrast yellow focus ring (`--color-focus-outer: #ffd337`) deliberately chosen to stay visible on any surface, including the blue primary brand color. The Loop library specifies the interactive *focused* role as `Blue/50 #0071bc` (`--color-domain-interactive-focused`, `--color-outline-on-light-link-focused`). To inherit the brand faithfully, the override retints `--color-focus-outer` to `var(--color-blue-50)`.

**Risk:** A blue focus ring on a blue primary button/surface has near-zero contrast against its own background, so the focus indicator may fail to be perceivable there. OutSystems' inner ring (`--color-focus-inner`, dark neutral) provides partial delineation but does not fully compensate.

**Rule:** WCAG 2.2 SC 2.4.11 (Focus Appearance) / SC 2.4.7 (Focus Visible) — the indicator must have ≥3:1 contrast against adjacent colors.

**Recommendation:** Either (a) keep Blue/50 on light surfaces but retain a high-contrast outer ring on brand/dark surfaces, or (b) define a dedicated brand focus-ring token in The Loop with a guaranteed-contrast value, or (c) sign off on the visual trade-off. Until design responds, the override stays faithful to The Loop (Blue/50); `--color-focus-inner` is left at the framework default.

**Implementation note:** No framework source edited (override layer only); no Loop primitive value changed.

Labels: finding,bug,a11y,sev:medium
