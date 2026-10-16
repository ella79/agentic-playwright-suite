# Test execution image.
#
# The tag must track the @playwright/test version in package.json: the image
# ships browser binaries built for that exact release, and a mismatch changes
# text rendering, which silently invalidates every visual regression baseline.
FROM mcr.microsoft.com/playwright:v1.64.1-noble@sha256:7852dc5a7d72f5fe458a597d690f6c42fbc8e9e26ddfa95f8e6ef552558d9bbf

WORKDIR /workspace

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV CI=true

COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && yarn install --immutable

COPY . .

CMD ["yarn", "test:e2e"]
