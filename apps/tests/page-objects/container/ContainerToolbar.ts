import { Locator, Page } from "@playwright/test";

export class ContainerToolbar {
  private readonly toolbar: Locator;

  constructor(private page: Page) {
    this.toolbar = page
      .getByRole("toolbar", { name: "Container actions" })
      .describe("Container actions");
  }

  newFileButton() {
    return this.toolbar
      .getByRole("button", { name: "Create new file" })
      .describe("Create new file button");
  }

  newFolderButton() {
    return this.toolbar
      .getByRole("button", { name: "Create new folder" })
      .describe("Create new folder button");
  }
}
