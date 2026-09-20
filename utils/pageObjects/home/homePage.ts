import { expect, type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";
import { AddToCartModal } from "../shared/addToCartModal";
import { url } from "../../url";

export class HomePage extends BaseAppPage {
  readonly heroSection: Locator;
  readonly heroHeading: Locator;
  readonly heroSubheading: Locator;
  readonly heroDescription: Locator;
  readonly testCasesButton: Locator;
  readonly apiTestingButton: Locator;
  readonly categoryHeading: Locator;
  readonly categorySidebar: Locator;
  readonly brandsSidebar: Locator;
  readonly featuresItemsHeading: Locator;
  readonly featuredProductsGrid: Locator;
  readonly productCards: Locator;
  readonly recommendedItemsHeading: Locator;
  readonly recommendedItemsSection: Locator;
  readonly subscriptionHeading: Locator;
  readonly subscriptionSection: Locator;
  readonly subscriptionEmailInput: Locator;
  readonly subscriptionSubmitButton: Locator;
  readonly subscriptionSuccessMessage: Locator;
  readonly footer: Locator;
  readonly footerBottom: Locator;
  readonly copyrightText: Locator;

  constructor(page: Page) {
    super(page);
    // Scoped to whichever slide currently carries `.active`, not the first in
    // DOM order: Bootstrap hides the other two, so a screenshot of a merely
    // present-but-inactive slide times out waiting to become visible.
    // Heading, subheading and description are identical markup across all
    // three slides, verified live, so whichever one is active stands in for
    // all of them without racing the carousel's own rotation.
    const heroSlide = page.locator("#slider-carousel .item.active");
    // The screenshot target is the carousel wrapper, not the slide itself:
    // `.item`'s own two `.col-sm-6` children are floated with no clearfix, so
    // the item's own box collapses to zero height, verified live, the same
    // class of Bootstrap layout bug already documented elsewhere in this
    // suite. The wrapper has its own fixed height in the site's CSS and shows
    // only the active slide, since the other two are `display: none`.
    this.heroSection = page.locator("#slider-carousel");
    this.heroHeading = heroSlide.locator("h1");
    this.heroSubheading = heroSlide.locator("h2");
    this.heroDescription = heroSlide.locator("p");
    this.testCasesButton = heroSlide.getByRole("link", { name: "Test Cases" });
    this.apiTestingButton = heroSlide.getByRole("link", {
      name: "APIs list for practice",
    });
    // Shared markup with the products page: same ids and classes, verified live.
    // The heading sits as `#accordian`'s own sibling rather than its parent,
    // unlike Brands below, whose `<h2>` is a genuine child of `.brands_products`
    // and so is already part of that one screenshot. Verified live.
    this.categoryHeading = page
      .locator(".left-sidebar")
      .getByRole("heading", { name: "Category" });
    this.categorySidebar = page.locator("#accordian");
    this.brandsSidebar = page.locator(".brands_products");
    this.featuresItemsHeading = page.getByRole("heading", {
      name: "Features Items",
    });
    // CSS: the grid is a layout wrapper with no role and no accessible
    // name, so nothing semantic addresses it. It is a capture boundary, not
    // something a user interacts with.
    this.featuredProductsGrid = page.locator(".features_items");
    this.productCards = page.locator(".features_items .product-image-wrapper");
    this.recommendedItemsHeading = page.getByRole("heading", {
      name: "recommended items",
    });
    // CSS: a layout wrapper, addressed the same way as the featured grid.
    this.recommendedItemsSection = page.locator(".recommended_items");
    this.subscriptionHeading = page.getByRole("heading", {
      name: "Subscription",
    });
    // The widget wrapping the Subscription heading and its form, distinct
    // from the footer's copyright bar even though both sit inside <footer>.
    this.subscriptionSection = page.locator(".single-widget");
    this.subscriptionEmailInput = page.getByPlaceholder("Your email address");
    // Icon-only submit control with no accessible name.
    this.subscriptionSubmitButton = page.locator("#subscribe");
    this.subscriptionSuccessMessage = page.getByText(
      "You have been successfully subscribed!",
    );
    this.footer = page.getByRole("contentinfo");
    this.footerBottom = page.locator(".footer-bottom");
    this.copyrightText = this.footer.getByText("Copyright");
  }

  async gotoHomePage(): Promise<void> {
    await this.goto(url.home);
    await expect(this.featuresItemsHeading).toBeVisible();
  }

  // `#slider-carousel` carries `data-ride="carousel"`, verified live, so
  // Bootstrap's own data-api auto-initializes it on the window `load` event
  // and starts rotating it on a timer; left running, the slide a screenshot
  // resolved to can lose its `.active` class mid-capture. jQuery's own
  // `.carousel("pause")` doesn't help: called while a transition is already
  // under way, it forces that transition to finish through a synthetic event
  // rather than waiting for it, which leaves the slide invisible for good
  // instead of just paused. Verified live. Clearing the plugin instance's own
  // interval handle directly, the moment the instance exists and before its
  // first tick, avoids ever touching an in-progress transition.
  async pauseHeroCarousel(): Promise<void> {
    type CarouselInstance = { interval: number | null };
    type CarouselJQuery = (selector: string) => {
      data(key: string): CarouselInstance | undefined;
    };
    await this.page.waitForFunction(() => {
      const jq = (window as unknown as { jQuery?: CarouselJQuery }).jQuery;
      return jq?.("#slider-carousel").data("bs.carousel") !== undefined;
    });
    await this.page.evaluate(() => {
      const jq = (window as unknown as { jQuery: CarouselJQuery }).jQuery;
      const instance = jq("#slider-carousel").data("bs.carousel");
      if (instance?.interval) {
        clearInterval(instance.interval);
        instance.interval = null;
      }
    });
  }

  async subscribeToNewsletter(email: string): Promise<void> {
    await this.subscriptionHeading.scrollIntoViewIfNeeded();
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionSubmitButton.click();
  }

  getProductCard(productName: string): Locator {
    return this.productCards.filter({ hasText: productName }).first();
  }

  /**
   * By href rather than accessible name: "Women" and "Men" are substrings of
   * one another once matched loosely ("Wo-MEN"), and exact name matching
   * fails here too, since the accessible name carries whitespace from the
   * panel's own layout that exact mode does not trim. Verified live.
   */
  getCategoryLink(parentCategory: "Women" | "Men" | "Kids"): Locator {
    return this.categorySidebar.locator(`a[href="#${parentCategory}"]`);
  }

  /**
   * Subcategory links live in collapsed panels keyed by the parent category
   * name, and the same subcategory label appears under several parents, so the
   * panel must be scoped rather than matched globally.
   */
  async openCategory(
    parentCategory: "Women" | "Men" | "Kids",
    subCategory: string,
  ): Promise<void> {
    await this.getCategoryLink(parentCategory).click();
    await this.categorySidebar
      .locator(`#${parentCategory}`)
      .getByRole("link", { name: subCategory })
      .click();
  }

  async openBrand(brandName: string): Promise<void> {
    await this.brandsSidebar
      .getByRole("link", { name: brandName })
      .first()
      .click();
  }

  /**
   * The listing renders each card twice (base state plus hover overlay) with the
   * same product id, so both instances trigger the same request.
   *
   * Adding is an XHR: returning the confirmation modal forces callers to wait
   * for it to land instead of navigating away mid-request.
   */
  async addProductToCartFromListing(
    productId: number,
  ): Promise<AddToCartModal> {
    await this.page
      .locator(`.add-to-cart[data-product-id="${productId}"]`)
      .first()
      .click();

    const modal = new AddToCartModal(this.page);
    await modal.waitForVisible();
    return modal;
  }
}
