import { type Locator, type Page } from "@playwright/test";
import { BaseAppPage } from "../baseAppPage";
import { AddToCartModal } from "../shared/addToCartModal";
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
  }

  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  getProductCard(productName: string): Locator {
    return this.productCards.filter({ hasText: productName }).first();
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
    await this.categorySidebar
      .getByRole("link", { name: parentCategory })
      .click();
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

  async openProductDetail(productName: string): Promise<void> {
    await this.getProductCard(productName)
      .getByRole("link", { name: "View Product" })
      .click();
  }

  async productNames(): Promise<string[]> {
    return this.productCards.locator(".productinfo p").allTextContents();
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
