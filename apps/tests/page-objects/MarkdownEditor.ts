import { Locator, Page } from "@playwright/test";
import { MentionMenu } from "./MentionMenu";

export class MarkdownEditor {
  private readonly editButton: Locator;
  private readonly editor: Locator;
  private readonly document: Locator;

  constructor(readonly page: Page) {
    this.editButton = page
      .getByRole("button", { name: "Edit" })
      .describe("Edit button");
    this.document = page.getByRole("article").describe("Document");
    this.editor = this.document.getByRole("textbox").describe("Editor");
  }

  async startEditing() {
    await this.editButton.click();
    await this.editor.click();
  }

  async replaceContent(content: string) {
    await this.editor.clear();
    await this.editor.pressSequentially(content);
  }

  async acceptSuggestion() {
    await this.editor.press("Enter");
  }

  link(label: string): Locator {
    return this.editor.getByRole("link", { name: label }).describe("Mention");
  }

  /** The mention suggestion menu shown while a query is typed. */
  mentionMenu(): MentionMenu {
    return new MentionMenu(this.document, this.editor);
  }
}
