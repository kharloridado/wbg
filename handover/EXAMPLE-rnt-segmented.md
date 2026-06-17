# Handover — rnt-segmented + rnt-button

Generated code ready to add into OutSystems. (Example body for a handover Task.)

## Files
| File | OutSystems destination |
|---|---|
| `src/blocks/rnt-button.css` | Theme CSS (or Block CSS) |
| `src/components/rnt-segmented.js` | Script resource (Theme Library), Include = When invoked |
| `src/components/rnt-segmented.css` | Source of the shadow styles (embedded in the .js — edit here, sync into render()) |
| Block: `Segmented` | Patterns Library |

## Checklist
- [ ] Paste `rnt-button.css` into Theme CSS; set Button `ExtendedClass = "rnt-button rnt-button--primary"`
- [ ] Import `rnt-segmented.js` as a Script resource
- [ ] Create Block `Segmented`: inputs `Value`, `Options`, `Size`, `Disabled`; event `OnChange`; OnReady listener wiring `change` -> `OnChange(e.detail.value)`
- [ ] 1-Click Publish -> validate in browser at phone/tablet/desktop (never Service Studio Preview for Web Components)

## Open findings linked to this work
- (none) / FND-xxx ...
