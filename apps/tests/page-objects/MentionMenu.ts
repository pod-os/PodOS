import { Locator } from "@playwright/test";

export class MentionMenu {
  constructor(
    private readonly document: Locator,
    private readonly editor: Locator,
  ) {}

  async suggestion(label: string): Promise<Locator> {
    const suggestions = await this.listbox();
    return suggestions
      .getByRole("option", { name: label })
      .describe(`Suggestion "${label}"`);
  }

  async listbox(): Promise<Locator> {
    const controlledId = await this.editor.getAttribute("aria-controls");
    return this.document
      .locator(`[id="${controlledId}"]`)
      .describe("Mention suggestions");
  }
}
