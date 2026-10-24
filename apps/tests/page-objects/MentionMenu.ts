import { Locator, Page } from "@playwright/test";

export class MentionMenu {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  suggestion(label: string): Locator {
    return this.page
      .getByRole("option", { name: label })
      .describe("Mention suggestion");
  }
}
