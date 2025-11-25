import { Locator, Page } from "@playwright/test";
import { FileUpload } from "./FileUpload";

export class GenericThingPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  heading(): Locator {
    return this.page.getByRole("heading").describe("Heading");
  }

  overview(thingName: string): Locator {
    return this.page
      .getByRole("article", { name: thingName })
      .describe("Overview");
  }

  picture(thingName: string): Locator {
    return this.overview(thingName).getByAltText(thingName).describe("Picture");
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

  imageRelation(imageName: string): Locator {
    return this.relationsSection().getByRole("link", { name: imageName });
  }
}
