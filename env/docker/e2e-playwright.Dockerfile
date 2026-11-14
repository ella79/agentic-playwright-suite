# Test execution image.
#
# The tag must track the @playwright/test version in package.json: the image
# ships browser binaries built for that exact release, and a mismatch changes
# text rendering, which silently invalidates every visual regression baseline.
FROM mcr.microsoft.com/playwright:v1.65.1-noble@sha256:1507cbfc550a63a6b7396791ca4f00df17beb56342d2447b3f106c306f525579

WORKDIR /workspace

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV CI=true

COPY package.json yarn.lock .yarnrc.yml ./
# Node.js 25 and later no longer ship Corepack, and the image runs Node.js 26
# from Playwright 1.65 on, so it is installed from npm before Yarn can be enabled.
# The image already has Yarn 1 installed globally through npm; it is removed
# first, because Corepack's own yarn shim cannot be installed over it.
RUN npm uninstall -g yarn \
 && npm install -g corepack@0.36.0 \
 && corepack enable \
 && yarn install --immutable

COPY . .

CMD ["yarn", "test:e2e"]
