# Home Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Spec file: `vr-tests/home.vr.spec.ts`. Seed: `specs/seed.spec.ts`.

## Scope

The landing page carries the two pieces of chrome every other page reuses, plus the featured grid.
Header and footer are captured here rather than repeated per page: they are one component, and
twenty baselines of the same header would be twenty things to review for one change.

## Cases

| ID    | Screenshot              | State captured                            |
| ----- | ----------------------- | ----------------------------------------- |
| VR-01 | `home-header-anonymous` | Site header with no session               |
| VR-02 | `home-features-items`   | Featured products grid, viewport-anchored |
| VR-03 | `home-subscription`     | Footer newsletter block                   |

## Notes

**VR-02 does not capture its element.** `.features_items` holds the whole catalog and measures
13,347 pixels. The case anchors the section heading to the top of the viewport with `scrollToTop`
and captures the viewport, which covers the grid layout and card design in an image a reviewer can
actually judge. It also waits for the product images to decode first: they stream in after load, so
the region keeps reflowing and the capture would otherwise expire on the stability check under
parallel load.

**Threshold.** VR-02 uses `0.05` for the photography. VR-01 and VR-03 stay at the default.

## Out of Scope

- The hero carousel: it advances on a timer, so any capture of it is a race against its own state.
- The recommended-items carousel below the grid, for the same reason.
