# Home Visual Regression Test Plan

Shared conventions: [`README.md`](README.md). Seed: `specs/seed.spec.ts`.

## Metadata

| Field       | Value                                 |
| ----------- | ------------------------------------- |
| Page URL    | `/`                                   |
| Page Title  | `Automation Exercise`                 |
| Spec File   | `vr-tests/home.vr.spec.ts`            |
| Page Object | `utils/pageObjects/home/homePage.ts`  |
| Baselines   | `vr-tests/home.vr.spec.ts-snapshots/` |

## Scope

The landing page broken into the sections a reader would scroll through: the hero, the two
sidebars, one featured card, the recommended grid, the newsletter widget and the footer bar. Split
this way because the page itself is taller than one viewport, and a single full-page capture would
violate the size rule; splitting by section is also what keeps each baseline reviewable at a glance.
The add-to-cart notification modal is captured here rather than repeated on every page that can
trigger it, since its markup does not change with the page it opens from.

## Cases

| ID    | Name                            | Screenshot                       | State captured                                                      |
| ----- | ------------------------------- | -------------------------------- | ------------------------------------------------------------------- |
| VR-01 | Hero section                    | `home-hero`                      | Heading, subheading, description and the two hero buttons           |
| VR-02 | Category sidebar                | `home-category-sidebar`          | The "Category" title with Women / Men / Kids, collapsed             |
| VR-03 | Category sidebar, expanded      | `home-category-sidebar-expanded` | The title with "Women" open, showing its subcategory links          |
| VR-04 | Brands sidebar                  | `home-brands-sidebar`            | The full brand list with counts                                     |
| VR-05 | Featured product card           | `home-product-card`              | One card at rest: image, price, name, Add to Cart, View Product     |
| VR-06 | Recommended items section       | `home-recommended-items`         | The three-card recommended row                                      |
| VR-07 | Subscription widget             | `home-subscription`              | Heading, email field and submit control, unsubscribed state         |
| VR-08 | Subscription widget, subscribed | `home-subscription-success`      | The widget with the "You have been successfully subscribed!" banner |
| VR-09 | Footer bar                      | `home-footer`                    | The copyright line                                                  |
| VR-10 | Add-to-cart confirmation modal  | `home-add-to-cart-modal`         | The "Added!" modal open over the page                               |

## Notes

- VR-01 scopes to `#slider-carousel` itself, not the active slide (`.item.active`): the slide's own
  two floated columns have no clearfix, so its own box collapses to zero height, the same Bootstrap
  bug documented on VR-21 in `product-detail-vr-test-plan.md`. The carousel wrapper has a real height
  in the site's CSS and shows only the active slide, since the other two are `display: none`. Its own
  auto-rotation is also stopped before the capture: `.carousel("pause")` forces any in-progress
  transition to finish through a synthetic event rather than waiting for it, which can leave the
  slide invisible for good, so the spec clears the plugin's own interval handle directly instead.
  Verified live.
- VR-02 captures a clip spanning the "Category" heading and the accordion below it, not either one's
  own element box: the heading is the accordion's sibling, not its parent, unlike Brands below, whose
  own `<h2>` genuinely is a child of `.brands_products`.
- VR-03 recomputes that same clip after expanding "Women": the accordion's own height grows to fit
  the opened panel, so the clip taken for VR-02 would cut the subcategory links off.
- VR-05 scopes to a single card rather than the grid: the grid is 13,347px tall and both unreviewable
  and unstable under load, per the project's own size rule.
- VR-08 captures a clip spanning the success banner and the widget, not either one's own element box:
  `#success-subscribe` is a sibling of `.single-widget` inside a shared `.row`, initially hidden and
  positioned above the widget once shown, not inside it. Verified live.
- VR-10 uses a raised threshold; see the spec for the inline reason.

## Out of Scope

- The hero's rotating background: not stable across runs.
- The full featured-items and recommended-items grids: represented by one card each, per the size
  rule.
- The header's signed-in/guest states: a menu content difference, not a rendering difference — the
  functional suite's `home-test-plan.md` TC-02 already proves it.
