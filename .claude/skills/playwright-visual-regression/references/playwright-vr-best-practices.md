# Playwright Visual Regression Best-Practice Map

Source material for the visual standard. Each rule names where it comes from and what it means in
this repository. Where this repository departs from a recommendation, that is stated rather than
hidden.

## Official Documentation Anchors

- Visual comparisons:
  - https://playwright.dev/docs/test-snapshots
- `toHaveScreenshot()` API:
  - https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-screenshot-2
  - https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-have-screenshot-2
- Snapshot path configuration:
  - https://playwright.dev/docs/api/class-testconfig#test-config-snapshot-path-template
- Animation control:
  - https://playwright.dev/docs/api/class-page#page-emulate-media (for `prefers-reduced-motion`)

## Practical Rules For This Repository

1. **Capture with `expect(locator).toHaveScreenshot()` directly.** There is no snapshot wrapper here.
   A sibling repository routes every capture through a `vrSnapshot()` runtime with a declared
   strategy per case; this one does not, deliberately. With twenty captures the indirection costs
   more than it buys, and Playwright's own assertion already carries the retry, the threshold and the
   path template.
2. **One case, one screenshot.** A `test()` reaches one state and captures it once. Two captures in
   one case means one of them has no name of its own in the report, and a failure cannot say which
   state broke.
3. **Prefer element-level captures over full-page.** Full-page is for a modal read against the page
   behind it. This application injects ad iframes at unpredictable offsets, so a full-page capture
   buys noise that a scoped one does not.
4. **Prepare the state before capturing**, in this order: navigate, assert the target is visible,
   `scrollIntoViewIfNeeded()` if it lazy-loads, reach the state through the page object, capture.
   Never screenshot on hope.
5. **Start at `maxDiffPixelRatio: 0.01`**, the project default set in `playwright.config.ts`. Raise
   only after a case has actually proven flaky, with an inline `// VR: <reason>` comment. `0.01` as a
   default and `0.05` for image-bearing components are both widely recommended; the ceiling of `0.08`
   is this repository's own, not a published number. The reason for having one at all is published:
   the ratio is relative to image size, so a permissive value on a large capture allows a great deal
   of drift to pass unseen.
6. **Mask what varies per run** — timestamps, avatars, generated data, third-party frames — rather
   than widening the threshold. A threshold hides every difference in the shot; a mask hides one
   region and leaves the rest strict.
7. **`animations: "disabled"`** is set globally in `playwright.config.ts`, so a case does not repeat
   it.
8. **Screenshot names are kebab-case and prefixed with the feature**: `contact-success.png`,
   `cart-empty.png`. Playwright appends the project and platform itself, producing
   `contact-success-vr-linux.png`.
9. **Reuse the page objects in `utils/pageObjects/`.** Never a VR-only page object class, never an
   inline locator in a `.vr.spec.ts`. A locator that only a capture needs still belongs in the shared
   class, like any other.
10. **Keep VR cases about appearance.** Behavioural assertions belong in `tests/`. A VR case with
    five assertions is a functional test wearing a costume.
11. **One VR spec per feature in `vr-tests/`, one plan per feature in `specs/vr-test-plans/`**, both
    on the same stem as the functional pair.
12. **The functional pass comes first.** A feature's visual coverage is written against the page
    object its functional cases already built and proved.

## Repository Validation Commands

- One spec, before the suite:
  - `yarn playwright test --project=vr vr-tests/<feature>.vr.spec.ts`
- Full visual suite:
  - `yarn test:vr`
- Headed, for watching what the case does:
  - `yarn test:vr:headed`
- Playwright UI mode:
  - `yarn test:vr:ui`
- Regenerate baselines in the image CI uses:
  - `yarn docker:vr:update`
- Open the last report, with the diffs:
  - `yarn test:vr:report`

Baselines are Chromium on Linux. A set written on this host is gitignored, because Playwright puts
the platform in the filename and a Windows run produces `-vr-win32.png`, which is a different
rendering platform. To add one missing baseline without rewriting the others, run the Linux image
with `--update-snapshots=missing`; `yarn docker:vr:update` rewrites all of them, which buries one
intended change under the rest.

## Definition Of Done

- The new or changed case passes locally with `yarn test:vr`, on the first attempt.
- Every capture has a committed Linux baseline. A visual case without one compares nothing.
- The baseline was looked at by a human before it was committed. A baseline nobody reviewed is a
  screenshot, not a reference.
- Baselines sit beside their spec, in `<spec>.vr.spec.ts-snapshots/`.
- Screenshot names follow `<feature>-<state>.png`.
- Any threshold above `0.01` carries an inline reason.
- State preparation is present before every capture.
- The spec carries its `// spec:` and `// seed:` headers.
- Orphaned baselines are deleted when a case is renamed or retired.
- `specs/STATUS.md` counts the case, and counts it as implemented only once its baseline exists.
