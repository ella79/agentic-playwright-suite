## What changed

<!-- One or two sentences. What a reviewer needs before reading the diff. -->

## Why

<!-- The reason the change exists. If it fixes a failure, name the root cause, not the symptom. -->

## Checks

- [ ] `npm run typecheck`, `npm run lint`, `npm run stylecheck` pass
- [ ] Affected cases pass without retries
- [ ] Coverage change respects the suite caps, or names the case it replaces
- [ ] New visual baselines were generated in the CI image, not on the host
- [ ] `specs/STATUS.md` updated if coverage changed, and the README's decisions section if a call was made
