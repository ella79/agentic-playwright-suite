# Test execution image.
#
# The tag must track the @playwright/test version in package.json: the image
# ships browser binaries built for that exact release, and a mismatch changes
# text rendering, which silently invalidates every visual regression baseline.
FROM mcr.microsoft.com/playwright:v1.65.0-noble@sha256:6e3fb709361521eb27161606e6da6d2674e5e89fa16516cb37d6fdd91372273d

WORKDIR /workspace

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV CI=true

COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && yarn install --immutable

COPY . .

CMD ["yarn", "test:e2e"]
