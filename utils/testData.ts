export interface TestAccount {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  country: string;
}

/**
 * Emails must be unique per run: the application rejects a duplicate address,
 * and parallel workers would otherwise collide on the same account.
 */
export function buildAccount(
  overrides: Partial<TestAccount> = {},
): TestAccount {
  const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

  return {
    name: "QA Test",
    email: `qa.test.${unique}@example.com`,
    password: "Str0ngPassw0rd!",
    firstName: "QA",
    lastName: "Test",
    company: "Test Company",
    address: "1 Example Street",
    state: "Test State",
    city: "Test City",
    zipcode: "00000",
    mobileNumber: "1234567890",
    birthDay: "9",
    birthMonth: "June",
    birthYear: "1990",
    country: "Canada",
    ...overrides,
  };
}

export const paymentCard = {
  nameOnCard: "QA Test",
  cardNumber: "4111111111111111",
  cvc: "311",
  expiryMonth: "12",
  expiryYear: "2030",
} as const;

export const products = {
  blueTop: { id: 1, name: "Blue Top", price: "Rs. 500" },
  menTshirt: { id: 2, name: "Men Tshirt", price: "Rs. 400" },
} as const;

/**
 * Search matches category names as well as product names, so a term like "top"
 * legitimately returns items whose name does not contain it. "saree" is used
 * because every product in that category also carries the word in its name,
 * which keeps the assertion meaningful without asserting false behaviour.
 */
export const searchTerms = {
  matching: "saree",
  nonExistent: "zzzznotaproduct",
} as const;
