import { Locator, Page } from "@playwright/test";

export class ContainerContents {
  private readonly list: Locator;

  constructor(private page: Page) {
    this.list = page
      .getByRole("list", { name: "Container contents" })
      .describe("Container contents");
  }

  async submitNewFile(newFile: string) {
    const input = this.list
      .getByRole("textbox", {
        name: `Enter file name`,
      })
      .describe("File name input");
    await input.fill(newFile);
    await input.press("Enter");
  }
}
