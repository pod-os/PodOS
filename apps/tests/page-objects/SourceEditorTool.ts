import { Locator, Page } from "@playwright/test";

/**
 * The source editor tool (pos-tool-source-editor) as shown in the Src tool
 * tab of the PodOS Browser.
 */
export class SourceEditorTool {
  private readonly root: Locator;
  private readonly saveButton: Locator;
  private readonly editor: Locator;
  private readonly status: Locator;

  constructor(private readonly page: Page) {
    this.root = page
      .locator("pos-tool-source-editor")
      .describe("Source editor tool");
    this.saveButton = this.root
      .getByRole("button", { name: "Save" })
      .describe("Save button");
    this.editor = this.root.getByRole("textbox").describe("Source code editor");
    this.status = this.root.getByRole("status").describe("Save status");
  }

  /** Opens the Src tool tab for the currently shown resource. */
  async open() {
    await this.page
      .getByRole("main")
      .getByRole("tablist", { name: "Tools" })
      .getByRole("tab", { name: /Src/i })
      .describe("Src tool tab")
      .click();
  }

  async replaceAll(content: string) {
    await this.editor.click();
    await this.editor.press("ControlOrMeta+a");
    await this.editor.pressSequentially(content);
  }

  content(): Locator {
    return this.editor.describe("Editor content");
  }

  async save() {
    await this.saveButton.click();
  }

  async expectAllSaved() {
    await this.expectStatusVisible("all saved");
  }

  async expectUnsavedChanges() {
    await this.expectStatusVisible("pending changes");
  }

  private async expectStatusVisible(name: string) {
    await this.status
      .filter({ hasText: name })
      .describe("Save status")
      .waitFor();
  }
}
