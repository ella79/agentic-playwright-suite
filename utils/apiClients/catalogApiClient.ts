import { type APIRequestContext } from "@playwright/test";
import { sendJson } from "./sendJson";

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
 *
 * Every read goes through `sendJson`, so the host shedding load is re-sent
 * rather than reported as a missing catalog. Nothing here is ever called from
 * inside a block that already retries, which is what lets the retry sit at
 * this boundary instead of at each caller.
 */
export class CatalogApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async getProductsList(): Promise<ProductsListBody> {
    return sendJson(() => this.request.get("/api/productsList"));
  }

  async getBrandsList(): Promise<BrandsListBody> {
    return sendJson(() => this.request.get("/api/brandsList"));
  }

  async searchProduct(term: string): Promise<SearchProductBody> {
    return sendJson(() =>
      this.request.post("/api/searchProduct", {
        form: { search_product: term },
      }),
    );
  }
}
