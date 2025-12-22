import { Locator, Page } from "@playwright/test";
import { FileUpload } from "./FileUpload";
import { AttachmentTool } from "./AttachmentTool";

export class GenericThingPage {
  private readonly page: Page;
  private readonly thingName: string;

  constructor(page: Page, thingName: string) {
    this.page = page;
    this.thingName = thingName;
  }

  heading(): Locator {
    return this.page.getByRole("heading").describe("Heading");
  }

  overview(): Locator {
    return this.page
      .getByRole("article", { name: this.thingName })
      .describe("Overview");
  }

  picture(): Locator {
    return this.overview().getByAltText(this.thingName).describe("Picture");
  }

  private uploadPictureButton(): Locator {
    return this.page
      .getByRole("button", { name: /Upload picture/i })
      .describe("Upload button");
  }

  async openPictureUpload(): Promise<FileUpload> {
    await this.uploadPictureButton().click();
    return new FileUpload(this.page);
  }

  relationsSection(): Locator {
    return this.page.locator("pos-relations").describe("Relations section");
  }

  relation(targetName: string): Locator {
    return this.relationsSection().getByRole("link", { name: targetName });
  }

  private attachToolButton(): Locator {
    return this.page
      .getByRole("tab", { name: /Attach/i })
      .describe("Attach tool button");
  }

  async openAttachmentsTool(): Promise<AttachmentTool> {
    await this.attachToolButton().click();
    return new AttachmentTool(this.page);
  }
}
