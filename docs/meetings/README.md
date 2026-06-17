# Meeting summaries & notes

Raw meeting summaries, client/design review notes, and kickoff decisions live here —
one dated file per meeting: `YYYY-MM-DD-<topic>.md` (e.g. `2026-06-18-kickoff.md`).

These are **reference material**, not part of the active loop context. The loop and the
maker/checker subagents read CLAUDE.md, project-context.md, loop/goal.md, and
design/brand-guidelines.md — they do NOT auto-read this folder. So a decision buried in a
meeting summary will not change the loop's behavior on its own.

## Distill decisions into the files the loop DOES read

After a meeting, push the decision-bearing parts to where they take effect:

| Decision from the meeting | Put it here so the system acts on it |
|---|---|
| Brand owner approved an off-palette color / a failing-contrast pairing | `design/brand-guidelines.md` → **Known signed-off exceptions** (so findings stop re-flagging it as a bug) |
| Scope agreed (which screens / which library tiers) | `loop/goal.md` → Scope + Figma in-scope |
| New brand colors / type / spacing confirmed | `design/brand-guidelines.md` + seed `tokens/*.css` |
| Who signs off on findings / where tickets go | `project-context.md` → brand owner + findings routing |
| A finding's resolution (accept / fix-in-design / waive) | the finding's GitHub bug (disposition) + `findings/findings-register.md` |

Rule of thumb: the summary is the record; the **signed-off exceptions list is what stops
the loop from re-flagging an approved deviation.** If a client OK'd a teal that fails
contrast and it only lives in a meeting note, every loop run will keep filing it as a bug.

## Sensitive client notes
This is a private repo, so committing notes is usually fine. If a summary is
client-sensitive and shouldn't be in Git, keep it in your connected Google Drive instead
and just record the decision (not the raw note) in the files above. Point Claude Code at
the Drive file when you want it read.
