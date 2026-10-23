# Test execution image.
#
# The tag must track the @playwright/test version in package.json: the image
# ships browser binaries built for that exact release, and a mismatch changes
# text rendering, which silently invalidates every visual regression baseline.
FROM mcr.microsoft.com/playwright:v1.64.1-noble@sha256:47b510dd9230bf0b9bfc9b20102241e577ea7a99334ab4c3ca19f19770e9b8ea

WORKDIR /workspace

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV CI=true

COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && yarn install --immutable

COPY . .

CMD ["yarn", "test:e2e"]
