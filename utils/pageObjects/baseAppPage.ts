import {
  expect,
  type Locator,
  type Page,
  type Response,
} from "@playwright/test";
import { url } from "../url";

/**
 * Every navigation below stops here rather than at Playwright's default, the
 * `load` event. `load` waits for every subresource, and one image the demo
 * host leaves unanswered holds it open for as long as the caller allows: of
 * the 58 requests the home page made in the WebKit run of #117, all but one
 * settled inside 3.4 seconds, and the product photo that never responded kept
 * the navigation waiting until the budget below expired — so the landmark that
 * decides whether the page arrived was never asserted once. A landmark is the
 * proof, the photography is not, and the cases that do need the images wait
 * for them through `waitForImagesLoaded`.
 */
const DOCUMENT_READY = "domcontentloaded" as const;

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export abstract class BaseAppPage {
  readonly page: Page;
  readonly header: Locator;
  readonly footer: Locator;
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
    this.footer = page.getByRole("contentinfo");
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
    this.scrollUpButton = page.locator("#scrollUp");
  }

  protected async goto(path: string, landmark: Locator): Promise<void> {
    await expect(async () => {
      const response = await this.navigate(path);

      if (response && !response.ok()) {
        throw new Error(`GET ${path} answered HTTP ${response.status()}`);
      }
    }).toPass();

    await expect(landmark).toBeVisible();
  }

  protected async navigate(path: string): Promise<Response | null> {
    return this.page.goto(path, { waitUntil: DOCUMENT_READY });
  }

  /**
   * Waits for the images in a visual capture to settle before Playwright
   * takes its screenshot. `complete` is the browser's settled-state signal:
   * it covers both successful loads and failed/aborted loads. Listening for
   * load/error after `complete` is too late for an image that already settled,
   * and can leave the Promise pending until the test timeout.
   */
  async waitForImagesLoaded(scope?: Locator): Promise<void> {
    await (scope ?? this.page.locator("body")).evaluate(
      async (element: HTMLElement) => {
        const images = Array.from(element.querySelectorAll("img"));

        await Promise.all(
          images.map((image) => {
            if (image.complete) {
              return Promise.resolve();
            }

            return new Promise<void>((resolve) => {
              image.addEventListener("load", () => resolve(), { once: true });
              image.addEventListener("error", () => resolve(), { once: true });
            });
          }),
        );
      },
    );
  }

  async scrollToTop(target: Locator): Promise<void> {
    await this.settledBoundingBoxes([target]);
    await target.evaluate((element: Element) =>
      element.scrollIntoView({ block: "start", behavior: "instant" }),
    );
  }

  async unionBoundingBox(locators: Locator[]): Promise<BoundingBox> {
    let boxes = await this.settledBoundingBoxes(locators);
    if (!this.fitsInViewport(this.union(boxes))) {
      for (const locator of [...locators].reverse()) {
        await locator.scrollIntoViewIfNeeded();
      }
      boxes = await this.settledBoundingBoxes(locators);
    }
    return this.union(boxes);
  }

  private union(boxes: BoundingBox[]): BoundingBox {
    const left = Math.min(...boxes.map((box) => box.x));
    const top = Math.min(...boxes.map((box) => box.y));
    const right = Math.max(...boxes.map((box) => box.x + box.width));
    const bottom = Math.max(...boxes.map((box) => box.y + box.height));
    return { x: left, y: top, width: right - left, height: bottom - top };
  }

  private fitsInViewport(box: BoundingBox): boolean {
    const viewport = this.page.viewportSize();
    if (!viewport) {
      return true;
    }
    return (
      box.x >= 0 &&
      box.y >= 0 &&
      box.x + box.width <= viewport.width &&
      box.y + box.height <= viewport.height
    );
  }

  private async settledBoundingBoxes(
    locators: Locator[],
  ): Promise<BoundingBox[]> {
    let previous = "";
    let settled: BoundingBox[] = [];
    await expect(async () => {
      const boxes = await Promise.all(
        locators.map((locator) => locator.boundingBox()),
      );
      const resolved = boxes.filter((box) => box !== null);
      expect(resolved.length).toBeGreaterThan(0);
      const reading = JSON.stringify(resolved);
      const agrees = reading === previous;
      previous = reading;
      settled = resolved;
      expect(agrees).toBe(true);
    }).toPass();
    return settled;
  }

  async waitForStableBoundingBox(locator: Locator): Promise<void> {
    await this.settledBoundingBoxes([locator]);
  }

  async scrollDownAndReturnToTop(): Promise<void> {
    await this.page.mouse.wheel(0, 2500);
    await this.scrollUpButton.click();
  }

  /**
   * Both of these leave the page behind, so both wait for the one they reach,
   * for the reason `CartPage.proceedToCheckout` gives: `waitForURL` waits for
   * the load event, not only for the new address. Returning on the click alone
   * handed the caller a page mid-navigation, and the assertion that followed
   * then had the expect default to find content the host had not finished
   * sending — TC-09 and TC-10 both failed that way, on a banner and a header
   * link that were never missing, only late.
   */
  async logout(): Promise<void> {
    await this.logoutLink.click();
    await this.page.waitForURL(new RegExp(`${url.login}$`));
  }

  async deleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
    await this.page.waitForURL(new RegExp(`${url.deleteAccount}$`));
  }
}
