# Frozen Figma ref — cmp-note

- **Figma file:** aHtnwyPhI8WRbiGHZ8E5Gb (The Loop — Main Library)
- **Node:** 26642:61530 (Notes page; original canvas 1727×7191). Originally built from a live desktop selection — this node (from design/figma-links.md) is now the durable ref.
- **Pulled:** 2026-07-04 (backfill; variables + screenshot). Deep-pull `get_design_context` on a sublayer if a fine detail is disputed.
- Exact token values: `variables.json`.

## Key values

| Property | Value | Figma variable |
|---|---|---|
| Padding | 16px h / 12px v | `loop/notes/padding h` / `v` |
| Inner spacing | 4px | `loop/notes/spacing` |
| Radius | 4px | `loop/notes/corner radius` |
| Text | Open Sans 400 14/1.25 | `Body/Text/Small/Narrow`, `loop/notes/information/text` |
| Information bg / outline / highlight | #f6fcff / #169af3 / #00538a | `loop/notes/information/*` |
| Important bg / outline / highlight | #fef3d7 / #896001 / #896001 | warning-low tokens + `loop/notes/important/*` |
| Tip bg / outline / highlight | #f1e1ff / #c17cfe / #763ba9 | `loop/notes/tip/*` |
| Success bg / outline / highlight | #f6fef0 / #388004 / #388004 | `loop/notes/success/*` |

Note: the pull also captured `loop/toast/*` (24px icons, 14/21 text, 400px min width) — Toast lives near this page; its own ref node is 17874-6524 (queued item, not yet built).

Artifact: `src/blocks/loop-note.css`.
