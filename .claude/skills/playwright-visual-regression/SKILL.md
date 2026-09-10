---
name: playwright-visual-regression
description: Create and maintain visual regression tests, what to screenshot, how to stabilize state first, threshold selection, masking third-party noise, and baseline management. Use when adding VR coverage or diagnosing a flaky screenshot.
paths:
  - vr-tests/**
  - specs/vr-test-plans/**
---

# Visual Regression Skill

## Outcome

Screenshots that fail when the product's appearance changes and at no other time. A VR suite that
cries wolf gets ignored, which is worse than having none.

## Repository Conventions

| Path                                    | Purpose                                               |
| --------------------------------------- | ----------------------------------------------------- |
| `vr-tests/`                             | VR spec files, one per feature area                   |
| `vr-tests/<name>.vr.spec.ts-snapshots/` | Baseline PNGs, created by Playwright next to the spec |
| `specs/vr-test-plans/`                  | VR test plans                                         |

| Item       | Pattern              | Example                     |
| ---------- | -------------------- | --------------------------- |
| Spec file  | `<area>.vr.spec.ts`  | `cart.vr.spec.ts`           |
| Screenshot | `<area>-<state>.png` | `cart-with-single-item.png` |

Playwright appends the platform suffix (`-chromium-linux.png`) itself. Baselines are generated on
Linux to match CI. A baseline captured on Windows or macOS will not match and must not be
committed.

## Plan shape

`specs/vr-test-plans/` follows [references/vr-plan-template.md](references/vr-plan-template.md).

## Before adding a capture

Four questions, and a no to any of them means the case does not exist. Answer the first and the
third by **taking one throwaway capture and looking at it**, never by reasoning about what the
browser probably does: native validation bubbles, for instance, do appear in a Playwright screenshot
and do persist, which is the opposite of what most people assume.

1. Is this state **visually distinct** from one already captured, or does it merely repeat it?
2. Does the region **fit the viewport**, or does it need anchoring to a heading?
3. What **varies per run** in it, so it can be masked instead of tolerated by a threshold?
4. Does it carry any **third-party slot**, in which case it is not capturable here at all?

## Config that a capture depends on

| Setting                     | Value                                             |
| --------------------------- | ------------------------------------------------- |
| Default `maxDiffPixelRatio` | `0.01`, set globally in `expect.toHaveScreenshot` |
| `animations`                | `disabled`, also global                           |
| Viewport                    | 1920x1080                                         |
| Project                     | `visual-regression`, Chromium only                |
| Baselines                   | `vr-tests/<area>.vr.spec.ts-snapshots/`, Linux    |

## Spec Structure

```typescript
// spec: specs/vr-test-plans/cart-vr-test-plan.md
// seed: specs/seed.spec.ts
import { expect, test } from "../utils/fixtures/testFixtures";

test.describe("Visual regression - cart", () => {
  test.beforeEach(async ({ cartPage }) => {
    await cartPage.gotoCartPage();
  });

  test("VR-10: empty cart state", async ({ cartPage }) => {
    await expect(cartPage.emptyCartMessage).toBeVisible();

    await expect(cartPage.cartItemsSection).toHaveScreenshot("cart-empty.png");
  });
});
```

Headers, fixtures and the rest of the coding standard are in
`.claude/skills/playwright-pageobject-testing/SKILL.md`. What follows here is only what is specific
to a screenshot.

## What To Screenshot

**Do:** the states a component actually renders differently. The list the field agrees on is default,
empty, error, success, and signed-in against signed-out, plus an open modal and a form's layout. An
error state qualifies even though it carries text: what breaks there is the banner's colour, its
placement and the reflow it causes, and no assertion notices any of that.

**Do not:** every data permutation, a change of wording in the same rendered state, hover states
(cursor position varies), or anything containing a third-party ad slot.

The test is whether the **rendering** differs, not whether the **text** does. A filtered listing that
draws the same grid with different products is one state; a listing that turns into an empty result
block is another.

## The VR / E2E Boundary

| Question              | Where it belongs |
| --------------------- | ---------------- |
| Does it look right?   | VR test          |
| Does it work?         | Functional E2E   |
| Is the label correct? | Functional E2E   |

A VR test contains the minimum interaction needed to reach the state, then one screenshot. If a VR
test has five assertions, it is a functional test wearing a costume.

## State Preparation

Screenshots are only meaningful once the UI has settled:

```typescript
await productsPage.gotoProductsPage();
await expect(productsPage.productGrid).toBeVisible();
await productsPage.productGrid.scrollIntoViewIfNeeded();
await expect(productsPage.firstProductCard).toBeVisible();

await expect(productsPage.firstProductCard).toHaveScreenshot(
  "products-card-default.png",
);
```

1. Navigate.
2. Wait for the target to be **visible**: never screenshot on hope.
3. Scroll into view if the element lazy-loads.
4. Reach the target state through the page object.
5. Capture.

`animations: "disabled"` is set globally in `playwright.config.ts`.

## Element vs Page Screenshots

Prefer element-level captures. They isolate the component from page chrome and, critically in this
application, from ad iframes that inject at unpredictable offsets.

```typescript
// Preferred, scoped to the component
await expect(cartPage.cartTable).toHaveScreenshot("cart-with-single-item.png");

// Only when the visual genuinely spans the viewport (modal over the page)
await expect(page).toHaveScreenshot("checkout-guard-modal.png", {
  maxDiffPixelRatio: 0.03,
});
```

## Thresholds

| Content                        | `maxDiffPixelRatio` | Why                                 |
| ------------------------------ | ------------------- | ----------------------------------- |
| Static layout, no images       | `0.01` (default)    | Any change is meaningful            |
| Layout with text               | `0.01`–`0.03`       | Font rendering varies slightly      |
| Product images, gradients      | `0.05`–`0.08`       | Image decoding and compression vary |
| Full-page with dynamic regions | `0.03`              | Surrounding content adds noise      |

Start at the default. Raise only after a test has actually proven flaky, and document why inline:

```typescript
await expect(productCard).toHaveScreenshot("products-card-default.png", {
  maxDiffPixelRatio: 0.06, // VR: product imagery is served with varying compression
});
```

## Masking Third-Party Noise

This application serves Google ad iframes and a consent banner. Mask anything that is not ours:

```typescript
await expect(page).toHaveScreenshot("home-hero.png", {
  mask: [page.locator("iframe"), page.locator("ins")],
});
```

Dismissing the consent banner is handled by `BaseAppPage` on every navigation, so VR specs should
never see it. If one appears in a diff, the bug is in the base page object, not the VR test.

## Baseline Management

```bash
yarn test:vr            # run against committed baselines
yarn docker:vr          # run in the Linux image CI uses
yarn docker:vr:update   # regenerate with rendering identical to CI
yarn test:vr:report     # open the last report, with the diffs
```

Baselines are Chromium on Linux. A set written on the host is gitignored, so regeneration goes
through Docker locally, or through the `Update VR baselines` workflow, which takes a mandatory
reason, commits it with the baselines, and uploads the regenerated set for review.

- Baselines are committed. They are the reference the suite is judged against.
- Update them only when the visual change is intentional **and verified**: look at the diff image in
  the HTML report before regenerating.
- After regenerating, review `git diff --stat`. Only the files you expected should have changed. A
  surprise baseline change is a finding.
- Delete orphaned baselines when a test is renamed or removed.

## Size Rule

No baseline may be taller than the viewport. A capture a reviewer cannot scan in one screen is not a
regression check. A diff in it gets approved without being read, which is worse than no test.

The application's `.features_items` grid is 13,347 pixels tall and demonstrates both failure modes:
the baseline is unreviewable, and the capture expires on the stability check under parallel load
because product photography is still streaming in. When a region is genuinely larger than the
viewport, anchor its heading with `scrollToTop` and capture the viewport instead, or scope the
capture to the repeating component.

## Page objects are shared

Both suites use the same page objects, and that is the point: a capture often needs an element no
functional case ever had a reason to address, most often a wrapper that gives the shot its frame.
**Add it to the shared page object like any other locator.** A locator used by one visual case and no
functional case is normal and correct.

What is forbidden is a parallel structure: a VR-only page object class beside the real one, a
locator written inline in a `.vr.spec.ts`, or a second name for an element the page object already
exposes. The class is shared; which suite happens to use a given member is not a property of it.

## Vendor documentation

- [Visual comparisons](https://playwright.dev/docs/test-snapshots)
- [`toHaveScreenshot` on a page](https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-screenshot-2)
- [`toHaveScreenshot` on a locator](https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-screenshot-2)
- [`snapshotPathTemplate`](https://playwright.dev/docs/api/class-testconfig#test-config-snapshot-path-template)

## Anti-Patterns

- Screenshotting without a preceding visibility assertion
- Raising a threshold above `0.08` to silence a diff instead of investigating it
- Committing a baseline generated on a developer machine rather than the CI platform
- Full-page screenshots of a component that fits in a box
- Updating baselines as a reflex when CI goes red
