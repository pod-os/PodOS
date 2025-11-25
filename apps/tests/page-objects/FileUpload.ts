import { Locator, Page } from "@playwright/test";

export class FileUpload {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  uploadArea(): Locator {
    return this.page.locator("pos-upload").describe("Upload area");
  }

  browseButton(): Locator {
    return this.page.getByRole("button", { name: "browse files" });
  }

  uploadFilesButton(): Locator {
    return this.page.getByRole("button", { name: /Upload \d+ file/i });
  }

  closeButton(): Locator {
    return this.page
      .getByRole("button", { name: "Close upload" })
      .describe("Close button");
  }

  async selectAndUploadFile(filePath: string): Promise<void> {
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await this.browseButton().click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);

    await this.uploadFilesButton().click();
  }

  async close(): Promise<void> {
    await this.closeButton().click();
  }
}
