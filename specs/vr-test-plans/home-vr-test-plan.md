# Home Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Spec file: `vr-tests/home.vr.spec.ts`. Seed: `specs/seed.spec.ts`.

## Scope

The landing page carries the two pieces of chrome every other page reuses, plus the featured grid.
Header and footer are captured here rather than repeated per page: they are one component, and
twenty baselines of the same header would be twenty things to review for one change. Both header
states belong here for the same reason. The signed-in header is produced by authentication, but it
is rendered on this page and it is the same component, so filing it by what produces its state
would split one component across two baseline directories.

## Cases

| ID    | Screenshot              | State captured                                           |
| ----- | ----------------------- | -------------------------------------------------------- |
| VR-01 | `home-header-anonymous` | Site header with no session                              |
| VR-02 | `home-features-items`   | Featured products grid, viewport-anchored                |
| VR-03 | `home-subscription`     | Footer newsletter block                                  |
| VR-17 | `home-header-signed-in` | Site header showing Logout, Delete Account, and the name |

## Notes

**VR-02 does not capture its element.** `.features_items` holds the whole catalog and measures
13,347 pixels. The case anchors the section heading to the top of the viewport with `scrollToTop`
and captures the viewport, which covers the grid layout and card design in an image a reviewer can
actually judge. It also waits for the product images to decode first: they stream in after load, so
the region keeps reflowing and the capture would otherwise expire on the stability check under
parallel load.

**VR-01 and VR-17 are the pair that proves the header changes by session.** They sit adjacent so a
reviewer reads one diff against the other in one file, and a change to the header regenerates one
baseline directory rather than two.

**VR-17 needs a registered account**, so it requests `uniqueAccount`. The fixture is set up before
the describe's `beforeEach`, so the session exists by the time the page is opened. The account name
appears in the header and the fixture generates it per run, so the capture masks it; the name's
width varies only within the fixed-format string the generator produces.

**Threshold.** VR-02 uses `0.05` for the photography. VR-01, VR-03 and VR-17 stay at the default.

## Out of Scope

- The hero carousel: it advances on a timer, so any capture of it is a race against its own state.
- The recommended-items carousel below the grid, for the same reason.

## ID Numbering

VR-17 keeps its original ID after moving here from the authentication plan. IDs are identities, not
positions: renumbering it would cascade through every other plan and spec in the suite.
