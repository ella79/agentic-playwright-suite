# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/signup/signup.spec.ts >> Signup Page >> TC-12: Signing up with an already registered email is rejected
- Location: tests/signup/signup.spec.ts:52:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Features Items' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Features Items' }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Features Items' })

```

```yaml
- banner:
  - heading "Web server is returning an unknown error Error code 520" [level=1]
  - text: Visit
  - link "cloudflare.com":
    - /url: https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_520&utm_campaign=automationexercise.com
  - text: for more information. 2026-09-25 04:58:53 UTC
- text: You
- heading "Browser" [level=3]
- text: Working
- link:
  - /url: https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_520&utm_campaign=automationexercise.com
- text: Chicago
- heading "Cloudflare" [level=3]:
  - link "Cloudflare":
    - /url: https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_520&utm_campaign=automationexercise.com
- text: Working automationexercise.com
- heading "Host" [level=3]
- text: Error
- heading "What happened?" [level=2]
- paragraph: There is an unknown connection issue between Cloudflare and the origin web server. As a result, the web page can not be displayed.
- heading "What can I do?" [level=2]
- heading "If you are a visitor of this website:" [level=3]
- paragraph: Please try again in a few minutes.
- heading "If you are the owner of this website:" [level=3]
- paragraph:
  - text: There is an issue between Cloudflare's cache and your origin web server. Cloudflare monitors for these errors and automatically investigates the cause. To help support the investigation, you can pull the corresponding error log from your web server and submit it our support team. Please include the Ray ID (which is at the bottom of this error page).
  - link "Additional troubleshooting resources":
    - /url: https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-520/
  - text: .
- paragraph:
  - text: "Cloudflare Ray ID:"
  - strong: a40774d029976189
  - text: "• Your IP:"
  - button "Click to reveal"
  - text: • Performance & security by
  - link "Cloudflare":
    - /url: https://www.cloudflare.com/5xx-error-landing?utm_source=errorcode_520&utm_campaign=automationexercise.com
```

# Test source

```ts
  1   | import { expect, type Locator, type Page } from "@playwright/test";
  2   | import { BaseAppPage } from "../baseAppPage";
  3   | import { AddToCartModal } from "../shared/addToCartModal";
  4   | import { url } from "../../url";
  5   | 
  6   | export class HomePage extends BaseAppPage {
  7   |   readonly heroSection: Locator;
  8   |   readonly heroHeading: Locator;
  9   |   readonly heroSubheading: Locator;
  10  |   readonly heroDescription: Locator;
  11  |   readonly testCasesButton: Locator;
  12  |   readonly apiTestingButton: Locator;
  13  |   readonly categoryHeading: Locator;
  14  |   readonly categorySidebar: Locator;
  15  |   readonly brandsSidebar: Locator;
  16  |   readonly featuresItemsHeading: Locator;
  17  |   readonly featuredProductsGrid: Locator;
  18  |   readonly productCards: Locator;
  19  |   readonly recommendedItemsHeading: Locator;
  20  |   readonly recommendedItemsSection: Locator;
  21  |   readonly subscriptionHeading: Locator;
  22  |   readonly subscriptionSection: Locator;
  23  |   readonly subscriptionEmailInput: Locator;
  24  |   readonly subscriptionSubmitButton: Locator;
  25  |   readonly subscriptionSuccessMessage: Locator;
  26  |   readonly footerBottom: Locator;
  27  |   readonly copyrightText: Locator;
  28  | 
  29  |   constructor(page: Page) {
  30  |     super(page);
  31  |     // Scoped to whichever slide currently carries `.active`, not the first in
  32  |     // DOM order: Bootstrap hides the other two, so a screenshot of a merely
  33  |     // present-but-inactive slide times out waiting to become visible.
  34  |     // Heading, subheading and description are identical markup across all
  35  |     // three slides, verified live, so whichever one is active stands in for
  36  |     // all of them without racing the carousel's own rotation.
  37  |     const heroSlide = page.locator("#slider-carousel .item.active");
  38  |     // The screenshot target is the carousel wrapper, not the slide itself:
  39  |     // `.item`'s own two `.col-sm-6` children are floated with no clearfix, so
  40  |     // the item's own box collapses to zero height, verified live, the same
  41  |     // class of Bootstrap layout bug already documented elsewhere in this
  42  |     // suite. The wrapper has its own fixed height in the site's CSS and shows
  43  |     // only the active slide, since the other two are `display: none`.
  44  |     this.heroSection = page.locator("#slider-carousel");
  45  |     this.heroHeading = heroSlide.locator("h1");
  46  |     this.heroSubheading = heroSlide.locator("h2");
  47  |     this.heroDescription = heroSlide.locator("p");
  48  |     this.testCasesButton = heroSlide.getByRole("link", { name: "Test Cases" });
  49  |     this.apiTestingButton = heroSlide.getByRole("link", {
  50  |       name: "APIs list for practice",
  51  |     });
  52  |     // Shared markup with the products page: same ids and classes, verified live.
  53  |     // The heading sits as `#accordian`'s own sibling rather than its parent,
  54  |     // unlike Brands below, whose `<h2>` is a genuine child of `.brands_products`
  55  |     // and so is already part of that one screenshot. Verified live.
  56  |     this.categoryHeading = page
  57  |       .locator(".left-sidebar")
  58  |       .getByRole("heading", { name: "Category" });
  59  |     this.categorySidebar = page.locator("#accordian");
  60  |     this.brandsSidebar = page.locator(".brands_products");
  61  |     this.featuresItemsHeading = page.getByRole("heading", {
  62  |       name: "Features Items",
  63  |     });
  64  |     // CSS: the grid is a layout wrapper with no role and no accessible
  65  |     // name, so nothing semantic addresses it. It is a capture boundary, not
  66  |     // something a user interacts with.
  67  |     this.featuredProductsGrid = page.locator(".features_items");
  68  |     this.productCards = page.locator(".features_items .product-image-wrapper");
  69  |     this.recommendedItemsHeading = page.getByRole("heading", {
  70  |       name: "recommended items",
  71  |     });
  72  |     // CSS: a layout wrapper, addressed the same way as the featured grid.
  73  |     this.recommendedItemsSection = page.locator(".recommended_items");
  74  |     this.subscriptionHeading = page.getByRole("heading", {
  75  |       name: "Subscription",
  76  |     });
  77  |     // The widget wrapping the Subscription heading and its form, distinct
  78  |     // from the footer's copyright bar even though both sit inside <footer>.
  79  |     this.subscriptionSection = page.locator(".single-widget");
  80  |     this.subscriptionEmailInput = page.getByPlaceholder("Your email address");
  81  |     // Icon-only submit control with no accessible name.
  82  |     this.subscriptionSubmitButton = page.locator("#subscribe");
  83  |     this.subscriptionSuccessMessage = page.getByText(
  84  |       "You have been successfully subscribed!",
  85  |     );
  86  |     this.footerBottom = page.locator(".footer-bottom");
  87  |     this.copyrightText = this.footer.getByText("Copyright");
  88  |   }
  89  | 
  90  |   async gotoHomePage(): Promise<void> {
  91  |     await this.goto(url.home);
> 92  |     await expect(this.featuresItemsHeading).toBeVisible();
      |                                             ^ Error: expect(locator).toBeVisible() failed
  93  |   }
  94  | 
  95  |   // `#slider-carousel` carries `data-ride="carousel"`, verified live, so
  96  |   // Bootstrap's own data-api auto-initializes it on the window `load` event
  97  |   // and starts rotating it on a timer; left running, the slide a screenshot
  98  |   // resolved to can lose its `.active` class mid-capture. jQuery's own
  99  |   // `.carousel("pause")` doesn't help: called while a transition is already
  100 |   // under way, it forces that transition to finish through a synthetic event
  101 |   // rather than waiting for it, which leaves the slide invisible for good
  102 |   // instead of just paused. Verified live. Clearing the plugin instance's own
  103 |   // interval handle directly, the moment the instance exists and before its
  104 |   // first tick, avoids ever touching an in-progress transition.
  105 |   async pauseHeroCarousel(): Promise<void> {
  106 |     type CarouselInstance = { interval: number | null };
  107 |     type CarouselJQuery = (selector: string) => {
  108 |       data(key: string): CarouselInstance | undefined;
  109 |     };
  110 |     await this.page.waitForFunction(() => {
  111 |       const jq = (window as unknown as { jQuery?: CarouselJQuery }).jQuery;
  112 |       return jq?.("#slider-carousel").data("bs.carousel") !== undefined;
  113 |     });
  114 |     await this.page.evaluate(() => {
  115 |       const jq = (window as unknown as { jQuery: CarouselJQuery }).jQuery;
  116 |       const instance = jq("#slider-carousel").data("bs.carousel");
  117 |       if (instance?.interval) {
  118 |         clearInterval(instance.interval);
  119 |         instance.interval = null;
  120 |       }
  121 |     });
  122 |   }
  123 | 
  124 |   async subscribeToNewsletter(email: string): Promise<void> {
  125 |     await this.subscriptionHeading.scrollIntoViewIfNeeded();
  126 |     await this.subscriptionEmailInput.fill(email);
  127 |     await this.subscriptionSubmitButton.click();
  128 |   }
  129 | 
  130 |   getProductCard(productName: string): Locator {
  131 |     return this.productCards.filter({ hasText: productName }).first();
  132 |   }
  133 | 
  134 |   /**
  135 |    * By href rather than accessible name: "Women" and "Men" are substrings of
  136 |    * one another once matched loosely ("Wo-MEN"), and exact name matching
  137 |    * fails here too, since the accessible name carries whitespace from the
  138 |    * panel's own layout that exact mode does not trim. Verified live.
  139 |    */
  140 |   getCategoryLink(parentCategory: "Women" | "Men" | "Kids"): Locator {
  141 |     return this.categorySidebar.locator(`a[href="#${parentCategory}"]`);
  142 |   }
  143 | 
  144 |   /**
  145 |    * Subcategory links live in collapsed panels keyed by the parent category
  146 |    * name, and the same subcategory label appears under several parents, so the
  147 |    * panel must be scoped rather than matched globally.
  148 |    */
  149 |   async openCategory(
  150 |     parentCategory: "Women" | "Men" | "Kids",
  151 |     subCategory: string,
  152 |   ): Promise<void> {
  153 |     await this.getCategoryLink(parentCategory).click();
  154 |     await this.categorySidebar
  155 |       .locator(`#${parentCategory}`)
  156 |       .getByRole("link", { name: subCategory })
  157 |       .click();
  158 |   }
  159 | 
  160 |   async openBrand(brandName: string): Promise<void> {
  161 |     await this.brandsSidebar
  162 |       .getByRole("link", { name: brandName })
  163 |       .first()
  164 |       .click();
  165 |   }
  166 | 
  167 |   /**
  168 |    * The listing renders each card twice (base state plus hover overlay) with the
  169 |    * same product id, so both instances trigger the same request.
  170 |    *
  171 |    * Adding is an XHR: returning the confirmation modal forces callers to wait
  172 |    * for it to land instead of navigating away mid-request.
  173 |    */
  174 |   async addProductToCartFromListing(
  175 |     productId: number,
  176 |   ): Promise<AddToCartModal> {
  177 |     await this.page
  178 |       .locator(`.add-to-cart[data-product-id="${productId}"]`)
  179 |       .first()
  180 |       .click();
  181 | 
  182 |     const modal = new AddToCartModal(this.page);
  183 |     await modal.waitForVisible();
  184 |     return modal;
  185 |   }
  186 | }
  187 | 
```