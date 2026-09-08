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
    name: "QA Portfolio",
    email: `qa.portfolio.${unique}@example.com`,
    password: "Str0ngPassw0rd!",
    firstName: "Emanuela",
    lastName: "Tester",
    company: "Portfolio QA",
    address: "12 Test Drive",
    state: "Timis",
    city: "Timisoara",
    zipcode: "300001",
    mobileNumber: "0700000000",
    birthDay: "9",
    birthMonth: "June",
    birthYear: "1990",
    country: "Canada",
    ...overrides,
  };
}

export const paymentCard = {
  nameOnCard: "Emanuela Tester",
  cardNumber: "4111111111111111",
  cvc: "311",
  expiryMonth: "12",
  expiryYear: "2030",
} as const;

export const products = {
  blueTop: { id: 1, name: "Blue Top", price: "Rs. 500" },
  menTshirt: { id: 2, name: "Men Tshirt", price: "Rs. 400" },
} as const;

export const searchTerms = {
  matching: "top",
  nonExistent: "zzzznotaproduct",
} as const;
