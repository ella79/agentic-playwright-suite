import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../base/BaseAppPage";
import { url } from "../../url";

export class ProductsPage extends BaseAppPage {
  readonly allProductsHeading: Locator;
  readonly searchedProductsHeading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productGrid: Locator;
  readonly productCards: Locator;
  readonly categorySidebar: Locator;
  readonly brandsSidebar: Locator;

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
    this.categorySidebar = page.locator("#accordian");
    this.brandsSidebar = page.locator(".brands_products");
  }

  async gotoProductsPage(): Promise<void> {
    await this.goto(url.products);
  }

  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  getProductCard(productName: string): Locator {
    return this.productCards.filter({ hasText: productName }).first();
  }

  async openCategory(
    parentCategory: "Women" | "Men" | "Kids",
    subCategory: string,
  ): Promise<void> {
    await this.categorySidebar
      .getByRole("link", { name: parentCategory })
      .click();
    await this.categorySidebar
      .getByRole("link", { name: subCategory })
      .first()
      .click();
  }

  async openBrand(brandName: string): Promise<void> {
    await this.brandsSidebar
      .getByRole("link", { name: brandName })
      .first()
      .click();
  }

  async viewProduct(productId: number): Promise<void> {
    await this.page
      .getByRole("link", { name: "View Product" })
      .nth(productId - 1)
      .click();
  }

  /**
   * The listing renders each card twice (base state plus hover overlay) with the
   * same product id, so both instances trigger the same request.
   */
  async addProductToCartFromListing(productId: number): Promise<void> {
    await this.page
      .locator(`.add-to-cart[data-product-id="${productId}"]`)
      .first()
      .click();
  }

  async productCount(): Promise<number> {
    return this.productCards.count();
  }
}
