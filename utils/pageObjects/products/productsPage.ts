import { expect, type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";
import { url } from "../../url";

export class ProductsPage extends BaseAppPage {
  readonly allProductsHeading: Locator;
  readonly searchedProductsHeading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productGrid: Locator;
  readonly productCards: Locator;
  readonly categorySidebar: Locator;
  readonly specialOfferBanner: Locator;

  constructor(page: Page) {
    super(page);
    this.allProductsHeading = page.getByRole("heading", {
      name: "All Products",
    });
    this.searchedProductsHeading = page.getByRole("heading", {
      name: "Searched Products",
    });
    this.searchInput = page.getByPlaceholder("Search Product");
    // Icon-only search control with no accessible name.
    this.searchButton = page.locator("#submit_search");
    // Layout containers: no roles or accessible names on the product grid.
    this.productGrid = page.locator(".features_items");
    this.productCards = page.locator(".features_items .product-image-wrapper");
    // Kept for the visual suite (products.vr.spec.ts, VR-06), which still
    // captures this sidebar; the functional suite drives it from HomePage
    // instead, since that is where category and brand filtering are covered.
    this.categorySidebar = page.locator("#accordian");
    // Carries no visible text of its own (alt="Website for practice"),
    // identified by its stable id instead. Verified live.
    this.specialOfferBanner = page.locator("#sale_image");
  }

  getCategoryResultsHeading(
    parentCategory: string,
    subCategory: string,
  ): Locator {
    return this.page.getByRole("heading", {
      name: new RegExp(
        `${parentCategory}\\s*-\\s*${subCategory} products`,
        "i",
      ),
    });
  }

  getBrandResultsHeading(brandName: string): Locator {
    return this.page.getByRole("heading", {
      name: new RegExp(`brand\\s*-\\s*${brandName} products`, "i"),
    });
  }

  async gotoProductsPage(): Promise<void> {
    await this.goto(url.products);
    await expect(this.page).toHaveURL(new RegExp(`${url.products}$`));
    await expect(this.allProductsHeading).toBeVisible();
  }

  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  getProductCard(productName: string): Locator {
    return this.productCards.filter({ hasText: productName }).first();
  }

  async openProductDetail(productName: string): Promise<void> {
    await this.getProductCard(productName)
      .getByRole("link", { name: "View Product" })
      .click();
  }

  /**
   * Full page width, from the search bar's own top down to the result
   * grid's bottom, for a VR capture that proves a search actually ran. The
   * search bar and the grid sit in separate, unrelated sections with no
   * shared container, and the sidebar sits between them at some of the same
   * horizontal positions, so a clip tightened to just the bar and the grid's
   * own boxes would slice through the sidebar rather than skip it cleanly.
   * Verified live.
   */
  async searchResultsClip(): Promise<{
    x: number;
    y: number;
    width: number;
    height: number;
  }> {
    // A clip is computed from layout, and layout is only final once the
    // document, stylesheets included, has loaded.
    await this.page.waitForLoadState("load");
    const [searchBox, gridBox] = await Promise.all([
      this.searchInput.boundingBox(),
      this.productGrid.boundingBox(),
    ]);
    if (!searchBox || !gridBox) {
      throw new Error("Search input or product grid is not rendered.");
    }
    const viewportWidth = this.page.viewportSize()?.width ?? 0;
    return {
      x: 0,
      y: searchBox.y,
      width: viewportWidth,
      height: gridBox.y + gridBox.height - searchBox.y,
    };
  }
}
