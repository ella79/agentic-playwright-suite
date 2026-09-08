# Local development image.
#
# Its reason to exist is visual regression: baselines are platform-specific, so
# a screenshot generated on Windows or macOS will never match the Linux
# baselines CI compares against. Running the visual suite through this image
# gives a developer on any host the same rendering CI uses.
#
# The repository is mounted rather than copied so changes are picked up without
# a rebuild. See docker-compose.yml.
FROM mcr.microsoft.com/playwright:v1.63.0-noble@sha256:eff16c30e6f3f4af0a03fa4b706120d5e9b0891c344a27d64559aff5900a4a27

WORKDIR /workspace

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

CMD ["yarn", "test:vr"]
