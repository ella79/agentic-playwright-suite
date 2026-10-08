# Local development image.
#
# Its reason to exist is visual regression: baselines are platform-specific, so
# a screenshot generated on Windows or macOS will never match the Linux
# baselines CI compares against. Running the visual suite through this image
# gives a developer on any host the same rendering CI uses.
#
# The repository is mounted rather than copied so changes are picked up without
# a rebuild. See docker-compose.yml.
FROM mcr.microsoft.com/playwright:v1.64.0-noble@sha256:06a9939e57531807f8d5fd76ce44b53165ffb7d7501d87ab10e285c20b1e971f

WORKDIR /workspace

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && yarn install --immutable

CMD ["yarn", "test:vr"]
