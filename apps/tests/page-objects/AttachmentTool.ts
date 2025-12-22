import { Locator, Page } from "@playwright/test";
import { FileUpload } from "./FileUpload";

export class AttachmentTool {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  attachmentsSection(): Locator {
    return this.page.locator("pos-attachments").describe("Attachments section");
  }

  attachment(fileName: string): Locator {
    return this.attachmentsSection().getByRole("link", { name: fileName });
  }

  async fileUpload(): Promise<FileUpload> {
    return new FileUpload(this.page);
  }
}
