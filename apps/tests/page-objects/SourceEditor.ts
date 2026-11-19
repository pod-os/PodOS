import { Locator, Page } from "@playwright/test";

export class SourceEditor {
  private readonly box: Locator;

  constructor(private readonly page: Page) {
    this.box = page
      .locator("pos-tool-source-editor")
      .getByRole("textbox")
      .describe("Editor textbox");
  }

  textbox() {
    return this.box;
  }
}
