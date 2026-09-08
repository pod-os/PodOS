import { Locator, Page } from "@playwright/test";

/**
 * Represents the `pos-literals` component, which renders the literal
 * term/definition pairs of a thing.
 */
export class Literals {
  private readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator("pos-literals").describe("Literals");
  }

  /** The value(s) shown for the term with the given label. */
  valueOf(label: string): Locator {
    return this.root
      .getByRole("term")
      .filter({ hasText: label })
      .describe(`Literal "${label}"`)
      .locator("..")
      .getByRole("definition")
      .describe(`Value of "${label}"`);
  }

  /**
   * Text indicating the editing status
   */
  fieldStatus(label: string): Locator {
    return this.valueOf(label)
      .getByRole("status")
      .describe(`Editing status of "${label}"`);
  }

  /**
   * The textbox to edit the literal value
   */
  editorOf(label: string): Locator {
    return this.valueOf(label)
      .getByRole("textbox")
      .describe(`Editor for "${label}"`);
  }

  /**
   * Change the literal value to a new value
   */
  async editValue(label: string, newValue: string): Promise<void> {
    await this.editorOf(label).fill(newValue);
  }
}
