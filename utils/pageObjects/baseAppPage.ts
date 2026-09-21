import { expect, type Locator, type Page } from "@playwright/test";

export abstract class BaseAppPage {
  readonly page: Page;
  readonly header: Locator;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly signupLoginLink: Locator;
  readonly testCasesLink: Locator;
  readonly apiTestingLink: Locator;
  readonly contactUsLink: Locator;
  readonly videoTutorialsLink: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly loggedInAs: Locator;
  readonly scrollUpButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByRole("banner");
    // Every nav link is scoped to the header rather than matched page-wide:
    // "Cart"'s accessible name carries a leading space from its icon markup,
    // which exact matching does not trim, and several of these names are also
    // used elsewhere on the page (the hero's own "Test Cases" button, the
    // add-to-cart modal's "View Cart" link) that an unscoped match would also
    // resolve to. Verified live.
    this.homeLink = this.header.getByRole("link", { name: "Home" });
    this.productsLink = this.header.getByRole("link", { name: "Products" });
    this.cartLink = this.header.getByRole("link", { name: "Cart" });
    this.signupLoginLink = this.header.getByRole("link", {
      name: "Signup / Login",
    });
    this.testCasesLink = this.header.getByRole("link", { name: "Test Cases" });
    this.apiTestingLink = this.header.getByRole("link", {
      name: "API Testing",
    });
    this.contactUsLink = this.header.getByRole("link", { name: "Contact us" });
    this.videoTutorialsLink = this.header.getByRole("link", {
      name: "Video Tutorials",
    });
    this.logoutLink = this.header.getByRole("link", { name: "Logout" });
    this.deleteAccountLink = this.header.getByRole("link", {
      name: "Delete Account",
    });
    this.loggedInAs = page.getByText("Logged in as");
    // No text and no role: a decorative anchor the scrollUp plugin injects.
    this.scrollUpButton = page.locator("#scrollUp");
  }

  /**
   * No consent-dismiss step here: `testFixtures.ts` blocks
   * `fundingchoicesmessages`, the host that would render that banner, as
   * third-party noise. A banner that can never load has nothing to dismiss —
   * verified against all 78 published browser-driven results, every one
   * carrying the same doomed three-second wait.
   */
  protected async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Resolves once every image inside the scope has finished decoding.
   *
   * Product photography streams in after load, so a region holding it keeps
   * reflowing. A screenshot assertion waits for stability, and under parallel
   * load that wait can expire mid-arrival, failing on stability rather than on
   * any visual difference. Waiting for the images fixes the cause; a longer
   * screenshot timeout only moves the deadline. A broken image settles through
   * its error event, so it cannot hang this.
   */
  async waitForImagesLoaded(scope: Locator): Promise<void> {
    await scope.evaluate(async (element: HTMLElement) => {
      const images: HTMLImageElement[] = Array.from(
        element.querySelectorAll("img"),
      );
      await Promise.all(
        images.map((image) =>
          image.complete && image.naturalWidth > 0
            ? Promise.resolve()
            : new Promise((resolve) => {
                image.addEventListener("load", resolve, { once: true });
                image.addEventListener("error", resolve, { once: true });
              }),
        ),
      );
    });
  }

  /**
   * Aligns an element to the top of the viewport.
   *
   * `scrollIntoViewIfNeeded` scrolls the minimum distance required, so where it
   * lands depends on where the page already was. A visual capture of the
   * viewport needs the same framing every run, which this guarantees.
   */
  async scrollToTop(target: Locator): Promise<void> {
    await target.evaluate((element: Element) =>
      element.scrollIntoView({ block: "start", behavior: "instant" }),
    );
  }

  /**
   * The smallest rectangle enclosing every given locator's own box, for a
   * `page.screenshot({ clip })` capture spanning elements with no single
   * existing container tight enough to scope to directly, such as a heading
   * and the block it titles when the two are rendered as plain siblings.
   */
  async unionBoundingBox(
    locators: Locator[],
  ): Promise<{ x: number; y: number; width: number; height: number }> {
    const boxes = await Promise.all(
      locators.map((locator) => locator.boundingBox()),
    );
    const resolved = boxes.filter((box) => box !== null);
    const left = Math.min(...resolved.map((box) => box.x));
    const top = Math.min(...resolved.map((box) => box.y));
    const right = Math.max(...resolved.map((box) => box.x + box.width));
    const bottom = Math.max(...resolved.map((box) => box.y + box.height));
    return { x: left, y: top, width: right - left, height: bottom - top };
  }

  /**
   * Waits until a locator's own bounding box stops changing between two
   * consecutive reads, for content whose *presence* is a poor proxy for its
   * *final size* — a Bootstrap accordion panel, for instance, keeps pushing
   * later siblings down for a moment after the panel's own text is already
   * visible, verified live: a `unionBoundingBox` taken right after that text
   * appears can still miss a sibling that has not finished being pushed into
   * place. `animations: "disabled"` does not cover this, since the sibling is
   * being repositioned by the transitioning element's layout, not animating
   * itself.
   */
  async waitForStableBoundingBox(locator: Locator): Promise<void> {
    let previousHeight: number | null = null;
    await expect(async () => {
      const box = await locator.boundingBox();
      const stable = box !== null && box.height === previousHeight;
      previousHeight = box?.height ?? null;
      expect(stable).toBe(true);
    }).toPass();
  }

  /**
   * Scrolls with the wheel rather than the API on purpose. The control is fixed
   * at a negative offset until the plugin animates it in, and it listens for a
   * real scroll: `window.scrollTo` leaves it off screen and unclickable.
   */
  async scrollDownAndReturnToTop(): Promise<void> {
    await this.page.mouse.wheel(0, 2500);
    await this.scrollUpButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async deleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
  }
}
