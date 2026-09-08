# Test execution image.
#
# The tag must track the @playwright/test version in package.json: the image
# ships browser binaries built for that exact release, and a mismatch changes
# text rendering, which silently invalidates every visual regression baseline.
FROM mcr.microsoft.com/playwright:v1.63.0-noble

WORKDIR /workspace

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV CI=true

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

CMD ["yarn", "test:e2e"]
