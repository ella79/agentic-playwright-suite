import { type APIRequestContext } from "@playwright/test";
import { readJson } from "./readJson";

export interface CatalogProduct {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: { usertype: string };
    category: string;
  };
}

export interface ProductsListBody {
  responseCode: number;
  products: CatalogProduct[];
}

export interface BrandsListBody {
  responseCode: number;
  brands: Array<{ id: number; brand: string }>;
}

export type SearchProductBody =
  | { responseCode: 200; products: CatalogProduct[] }
  | { responseCode: 400; message: string };

/**
 * Wraps the read-only catalog endpoints under `/api`: the same data the
 * products page and its sidebar render, available without a browser.
 */
export class CatalogApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async getProductsList(): Promise<ProductsListBody> {
    const response = await this.request.get("/api/productsList");
    return readJson(response);
  }

  async getBrandsList(): Promise<BrandsListBody> {
    const response = await this.request.get("/api/brandsList");
    return readJson(response);
  }

  async searchProduct(term: string): Promise<SearchProductBody> {
    const response = await this.request.post("/api/searchProduct", {
      form: { search_product: term },
    });
    return readJson(response);
  }
}
