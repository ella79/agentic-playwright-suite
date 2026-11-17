# Local development image.
#
# Its reason to exist is visual regression: baselines are platform-specific, so
# a screenshot generated on Windows or macOS will never match the Linux
# baselines CI compares against. Running the visual suite through this image
# gives a developer on any host the same rendering CI uses.
#
# The repository is mounted rather than copied so changes are picked up without
# a rebuild. See docker-compose.yml.
FROM mcr.microsoft.com/playwright:v1.65.1-noble@sha256:1507cbfc550a63a6b7396791ca4f00df17beb56342d2447b3f106c306f525579

WORKDIR /workspace

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

COPY package.json yarn.lock .yarnrc.yml ./
# Node.js 25 and later no longer ship Corepack, and the image runs Node.js 26
# from Playwright 1.65 on, so it is installed from npm before Yarn can be enabled.
# The image already has Yarn 1 installed globally through npm; it is removed
# first, because Corepack's own yarn shim cannot be installed over it.
RUN npm uninstall -g yarn \
 && npm install -g corepack@0.36.0 \
 && corepack enable \
 && yarn install --immutable

CMD ["yarn", "test:vr"]
