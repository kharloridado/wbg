# loop/refs — Frozen Figma spec snapshots

One folder per work item (`state.json` item id). The **orchestrator** saves these via Figma MCP before the maker runs; the **maker builds to them** and the **checker judges against them** — subagents have no Figma MCP access, so this folder is the spec of record. No ref = the item goes `needs-human`, never built (see `.claude/commands/design-loop.md`).

Contents per item:

- `spec.md` — provenance (file key, node id, pull date) + key-values table; for actively-reviewed items also the `get_design_context` reference code (see `cmp-dropdown-select` for the full-treatment example).
- `variables.json` — verbatim `get_variable_defs` for the node (under a `variables` key, with `_meta` provenance).
- `figma.png` — `get_screenshot` render of the node (also used by the orchestrator's visual check vs the preview render).

Conventions learned in the 2026-07-04 backfill:

- **Whole documentation pages are usually too large for one `get_design_context` pull** — it returns sparse metadata. Snapshot the page screenshot + variables, then deep-pull the component-set sublayer (the `State=…` symbols frame) for the value-bearing code. Record the sublayer node id in `spec.md`.
- **Foundation token items** (`tok-*`) don't get a variables re-dump: the Phase-0 extraction (`loop/extraction/raw-variables.json`, keyed by source node) is their frozen variable data; the ref folder holds the screenshot + a pointer.
- Variable dumps include **foreign-system leakage** (`lift/*`, `-elevate*`, Inter/IBM Plex/Roboto/Poppins families) — that's FND-001, already filed. The `loop/*` + WBG semantic-role sets are the spec; don't re-flag the leakage per component.
- Screenshot URLs from `get_screenshot` are short-lived — `curl` them to `figma.png` immediately.

Items without a durable node id (built from a live desktop selection, no link recorded): `cmp-segmented` — status `needs-ref-id`; supply its node id in `design/figma-links.md` and snapshot lazily on next re-review. (`cmp-tag`'s node id 17313:5502 was recovered from FND-028/029/030 and snapshotted.)
