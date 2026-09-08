# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/auth/authentication.spec.ts >> Authentication >> TC-05: a signed-in user can delete their account
- Location: tests/auth/authentication.spec.ts:95:7

# Error details

```
Test timeout of 60000ms exceeded while setting up "uniqueAccount".
```

```
Error: locator.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByTestId('signup-name')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - heading "This website is under heavy load (queue full)" [level=2] [ref=e2]
  - paragraph [ref=e3]: We're sorry, too many people are accessing this website at the same time. We're working on this problem. Please try again later.
```

# Test source

```ts
  1  | import { type Locator, type Page } from "@playwright/test";
  2  | import { BaseAppPage } from "../baseAppPage";
  3  | import { url } from "../../url";
  4  | 
  5  | /**
  6  |  * The application serves login and signup entry from one route, as two separate
  7  |  * forms. Both are modelled here because a user sees a single page.
  8  |  */
  9  | export class LoginPage extends BaseAppPage {
  10 |   readonly loginHeading: Locator;
  11 |   readonly loginEmailInput: Locator;
  12 |   readonly loginPasswordInput: Locator;
  13 |   readonly loginButton: Locator;
  14 |   readonly loginErrorMessage: Locator;
  15 | 
  16 |   readonly signupHeading: Locator;
  17 |   readonly signupNameInput: Locator;
  18 |   readonly signupEmailInput: Locator;
  19 |   readonly signupButton: Locator;
  20 |   readonly signupErrorMessage: Locator;
  21 | 
  22 |   readonly loginForm: Locator;
  23 |   readonly signupForm: Locator;
  24 | 
  25 |   constructor(page: Page) {
  26 |     super(page);
  27 |     this.loginHeading = page.getByRole("heading", {
  28 |       name: "Login to your account",
  29 |     });
  30 |     this.loginEmailInput = page.getByTestId("login-email");
  31 |     this.loginPasswordInput = page.getByTestId("login-password");
  32 |     this.loginButton = page.getByTestId("login-button");
  33 |     this.loginErrorMessage = page.getByText(
  34 |       "Your email or password is incorrect!",
  35 |     );
  36 | 
  37 |     this.signupHeading = page.getByRole("heading", {
  38 |       name: "New User Signup!",
  39 |     });
  40 |     this.signupNameInput = page.getByTestId("signup-name");
  41 |     this.signupEmailInput = page.getByTestId("signup-email");
  42 |     this.signupButton = page.getByTestId("signup-button");
  43 |     this.signupErrorMessage = page.getByText("Email Address already exist!");
  44 | 
  45 |     // Form containers have no accessible names; scoped by action for VR captures.
  46 |     this.loginForm = page.locator('form[action="/login"]');
  47 |     this.signupForm = page.locator('form[action="/signup"]');
  48 |   }
  49 | 
  50 |   async gotoLoginPage(): Promise<void> {
  51 |     await this.goto(url.login);
  52 |   }
  53 | 
  54 |   async login(email: string, password: string): Promise<void> {
  55 |     await this.loginEmailInput.fill(email);
  56 |     await this.loginPasswordInput.fill(password);
  57 |     await this.loginButton.click();
  58 |   }
  59 | 
  60 |   async startSignup(name: string, email: string): Promise<void> {
> 61 |     await this.signupNameInput.fill(name);
     |                                ^ Error: locator.fill: Test timeout of 60000ms exceeded.
  62 |     await this.signupEmailInput.fill(email);
  63 |     await this.signupButton.click();
  64 |   }
  65 | }
  66 | 
```