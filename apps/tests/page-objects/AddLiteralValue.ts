import { Locator, Page } from "@playwright/test";

/**
 * Represents the `pos-add-literal-value` component, used to add a literal
 * value (predicate + value) to the current resource.
 */
export class AddLiteralValue {
  private readonly root: Locator;

  constructor(private readonly page: Page) {
    this.root = page
      .locator("pos-add-literal-value")
      .describe("Add literal value");
  }

  /** The input used to select a predicate (term) by URI. */
  field(): Locator {
    return this.root
      .getByPlaceholder("Add literal")
      .describe("Add literal field");
  }

  /**
   * Selects a predicate by URI and enters a literal value, submitting it.
   * Mirrors the user flow: type the term URI, tab to the value input, type
   * the value and press Enter to save.
   */
  async fill(termUri: string, value: string): Promise<void> {
    const field = this.field();
    await field.fill(termUri);
    await field.press("Tab");
    await this.page.keyboard.type(value, { delay: 100 });
    await this.page.keyboard.press("Enter");
  }
}
