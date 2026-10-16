# Local development image.
#
# Its reason to exist is visual regression: baselines are platform-specific, so
# a screenshot generated on Windows or macOS will never match the Linux
# baselines CI compares against. Running the visual suite through this image
# gives a developer on any host the same rendering CI uses.
#
# The repository is mounted rather than copied so changes are picked up without
# a rebuild. See docker-compose.yml.
FROM mcr.microsoft.com/playwright:v1.64.1-noble@sha256:7852dc5a7d72f5fe458a597d690f6c42fbc8e9e26ddfa95f8e6ef552558d9bbf

WORKDIR /workspace

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && yarn install --immutable

CMD ["yarn", "test:vr"]
