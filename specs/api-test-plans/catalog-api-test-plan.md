# Catalog API Test Plan

## Metadata

| Field        | Value                                  |
| ------------ | -------------------------------------- |
| Base Path    | `/api`                                 |
| Client       | `utils/apiClients/catalogApiClient.ts` |
| Spec File    | `api-tests/catalog.api.spec.ts`        |
| Precondition | None — pure API, no browser session    |

## Scope

The read-only catalog endpoints' own contract: status codes, response shape and error behaviour for
the products list, brands list and search. This plan covers the official API list at `/api_list` for
this resource group in full: API 1 through API 6 there map to the cases below. What these endpoints
return is also used to cross-check the rendered UI — the products page's card count against
`productsList` in `products-test-plan.md`'s TC-13, its search results against `searchProduct` in
TC-14, and the home page's brand sidebar against `brandsList` in `home-test-plan.md`'s TC-01 — but
that cross-validation is a property of each UI case, not a case of its own here.

## Preconditions

- None: every case is a read against public, unauthenticated endpoints, or a search with no lasting
  effect.
- The same quirk recorded in `account-api-test-plan.md` applies here: a business-logic rejection
  (missing `search_product`) still answers HTTP 200 with `responseCode` 400 in the body. Unlike the
  account endpoints, though, an unsupported method on `searchProduct` does not raise the transport
  status either — it also answers HTTP 200, with `responseCode` 405 in the body. Verified live on
  2026-09-20: the two endpoint groups are not consistent with each other here, so each plan states
  what it actually verified rather than assuming the other's behaviour.

## Test Cases

| ID     | Name                                                            | Type  | Method + Endpoint         | Scenario                                                             | Expected                                                                                                                    |
| ------ | --------------------------------------------------------------- | ----- | ------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| API-09 | The products list returns every catalog product                 | happy | `GET /api/productsList`   | A client requests the full catalog                                   | `responseCode` 200 and a non-empty product array including Blue Top (id 1)                                                  |
| API-10 | The brands list returns every catalog brand                     | happy | `GET /api/brandsList`     | A client requests the brand list                                     | `responseCode` 200 and a non-empty array naming every brand the sidebar shows                                               |
| API-11 | Searching returns only products matching the term               | happy | `POST /api/searchProduct` | A client searches for a term several products share                  | `responseCode` 200 and every returned product's name or category contains the term                                          |
| API-12 | Searching without a term is rejected                            | error | `POST /api/searchProduct` | A client posts the search endpoint with no `search_product` field    | `responseCode` 400 naming the missing parameter                                                                             |
| API-13 | An unsupported method on the search endpoint is rejected        | edge  | `GET /api/searchProduct`  | A client calls the search endpoint with the wrong HTTP method        | HTTP 200 with `responseCode` 405 in the body — this endpoint, unlike the account group's, never raises the transport status |
| API-14 | An unsupported method on the products list endpoint is rejected | edge  | `POST /api/productsList`  | A client calls the products list endpoint with the wrong HTTP method | HTTP 200 with `responseCode` 405 in the body, same shape as `searchProduct`                                                 |
| API-15 | An unsupported method on the brands list endpoint is rejected   | edge  | `PUT /api/brandsList`     | A client calls the brands list endpoint with the wrong HTTP method   | HTTP 200 with `responseCode` 405 in the body, same shape as `searchProduct`                                                 |

## Client Notes

- `searchProduct`'s result is typed as a union on `responseCode`, since the 400 shape carries
  `message` where the 200 shape carries `products` — the same pattern as `getUserDetailByEmail` in
  the account client.

## Out of Scope

- Category and brand filtering as a UI interaction: covered by `home-test-plan.md`.
- The products page's own rendering: covered by `products-test-plan.md`, which cross-validates its
  card count against `GET /api/productsList` directly.
