import { type Locator, type Page } from "@playwright/test";

/**
 * Base for modals and dialogs. Every child locator resolves inside `root`, so
 * two dialogs sharing a label can never cross-match.
 */
export abstract class BaseComponentPage {
  readonly page: Page;
  readonly root: Locator;

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.root = root;
  }

  async waitForVisible(): Promise<void> {
    await this.root.waitFor({ state: "visible" });
  }

  async waitForHidden(): Promise<void> {
    await this.root.waitFor({ state: "hidden" });
  }
}
