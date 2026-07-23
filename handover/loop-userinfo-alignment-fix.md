# Handover — UserInfo profile foot alignment fix (theme-only)

Two layout corrections to the **`Loop_Common.UserInfo`** block (avatar + name/role
lockup) as it renders in the **Layout Side** panel foot. Part of the existing
`loop-layout-side` sidebar branding — no new block, no JS, **no token changes**.

**What was wrong (seen on `WBG_POC3/MyCases_HRAgent`):**
1. **Role centred, not left-aligned.** Our overrides flipped `.user-info` to a
   column but never reset the native OSUI `align-items: center`, so the shorter
   role line ("HR Agent") floated centred under the name instead of lining up left.
2. **Logout icon floating mid-row.** The `.fa-sign-in` icon is a direct flex child
   of `.app-login-info` and sat right after the name/role column rather than at the
   panel edge.

**Fix:** `align-items: flex-start` on `.user-info` (in both the global block rule
and the higher-specificity `.layout-side` rule), and `margin-left: auto` on the
logout icon to pin it to the far-right edge of the full-width panel foot.

**Both files are already folded into `dist/theme.css`.** There is **nothing to
hand-place per block** — the fix ships in the theme paste. Tokens are unchanged, so
`dist/tokens.css` does **not** need re-pasting.

## Files in this handover

- `tokens/outsystems-ui-overrides.css` → Theme CSS (assembled into `dist/theme.css`)
- `tokens/outsystems-ui-side.css` → Theme CSS (assembled into `dist/theme.css`)

## Code to paste into ODC

The change ships by re-pasting the whole **`dist/theme.css`** into the ODC Theme
editor (it already contains these rules). The exact delta, for review:

<details>
<summary><code>tokens/outsystems-ui-overrides.css</code> → in <code>dist/theme.css</code>, UserInfo block section</summary>

```css
/* Anchored by the block's own `.user-info` BEM class, NOT the ODC `data-block`
 * attribute — the `data-block` value carries the module + block name and would
 * silently break this styling if the block/module is ever renamed. */
.user-info {
    display: flex;
    flex-direction: column;
    /* Reset the native OSUI `align-items: center` — with our column direction it
     * centred each line, so the shorter role line floated centred under the name
     * instead of left-aligning with it. Anchor the lockup to the start edge. */
    align-items: flex-start;
    min-width: 0;
}
```

</details>

<details>
<summary><code>tokens/outsystems-ui-side.css</code> → in <code>dist/theme.css</code>, Layout Side profile foot section</summary>

```css
.layout-side .app-login-info .user-info {
  display: flex;
  flex-direction: column;
  /* Reset native OSUI `align-items: center` so the role left-aligns under the
   * name rather than floating centred (this selector out-specifies the block
   * override, so it must carry the reset too). */
  align-items: flex-start;
  min-width: 0;
}

/* Logout icon: a direct child of `.app-login-info`, natively left sitting right
 * after the name/role column mid-row. In the full-width panel foot, push it to
 * the far-right edge (margin auto absorbs the free space); the row's align-items
 * keeps it vertically centred against the whole lockup. */
.layout-side .app-login-info > .icon {
  margin-left: auto;
}
```

</details>

## OutSystems install checklist

- [ ] Pull `chore/tokens-lock-mldd-heights` and run `npm run build:theme` (or use the committed `dist/theme.css`)
- [ ] Re-paste `dist/theme.css` into the ODC Theme editor (replaces the existing paste)
- [ ] `dist/tokens.css` — **no change**, skip
- [ ] 1-Click Publish
- [ ] Validate in a real browser on a Layout Side page: role left-aligns under the name; logout icon sits at the far-right edge, vertically centred

## Related branch / PR

- Branch: `chore/tokens-lock-mldd-heights`
- Commit: `62f1ba8` — fix(sidebar): left-align role and pin logout icon to the right in UserInfo
