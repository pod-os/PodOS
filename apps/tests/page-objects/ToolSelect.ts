import { Locator, Page } from "@playwright/test";
import { GenericThingPage } from "./GenericThingPage";
import { SourceEditor } from "./SourceEditor";

/**
 * Represents the tool tab bar (`pos-tool-select`) that lets the user switch
 * between the tools available for the current resource.
 */
export class ToolSelect {
  constructor(private readonly page: Page) {}

  /**
   * Opens the Data tool and returns the page object for it.
   * The Data tool renders the generic thing view, hence a GenericThingPage.
   */
  async openDataTool(thingName: string): Promise<GenericThingPage> {
    await this.openTool("Data").click();
    return new GenericThingPage(this.page, thingName);
  }

  async openSrcTool(): Promise<SourceEditor> {
    await this.openTool("Src").click();
    return new SourceEditor(this.page);
  }

  private openTool(label: string): Locator {
    return this.page
      .getByRole("tablist", { name: "Tools" })
      .getByRole("tab", { name: new RegExp(label, "i") })
      .describe(`${label} tool tab`);
  }
}
