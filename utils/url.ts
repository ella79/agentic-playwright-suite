export const url = {
  home: "/",
  products: "/products",
  productDetail: (productId: number) => `/product_details/${productId}`,
  cart: "/view_cart",
  login: "/login",
  signup: "/signup",
  checkout: "/checkout",
  payment: "/payment",
  contactUs: "/contact_us",
  deleteAccount: "/delete_account",
  logout: "/logout",
} as const;

export const urlPattern = {
  orderPlaced: /\/payment_done\/\d+/,
} as const;
