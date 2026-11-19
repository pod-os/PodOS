import { Locator, Page } from "@playwright/test";

export class SourceEditor {
  private readonly box: Locator;
  private readonly status: Locator;
  private readonly saveButton: Locator;

  constructor(private readonly page: Page) {
    const self = page.locator("pos-tool-source-editor");
    this.box = self.getByRole("textbox").describe("Editor textbox");
    this.status = self.getByRole("status").describe("Save status");
    this.saveButton = self
      .getByRole("button", { name: "Save" })
      .describe("Save button");
  }

  textbox() {
    return this.box;
  }

  async replaceContent(newContent: string) {
    await this.box.clear();
    await this.box.pressSequentially(newContent);
  }

  getStatus() {
    return this.status;
  }

  async save() {
    await this.saveButton.click();
  }
}
