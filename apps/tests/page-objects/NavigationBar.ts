import { Locator, Page } from "@playwright/test";

export class NavigationBar {
  private readonly nav: Locator;
  private readonly close: () => Promise<void>;

  constructor(private page: Page) {
    this.nav = page.getByRole("navigation");
    this.close = () => page.keyboard.press("Escape");
  }

  async fill(text: string) {
    const input = await this.activateInput();
    await input.fill(text);
    return input;
  }

  async fillAndSubmit(text: string) {
    const input = await this.fill(text);
    await input.press("Enter");
  }

  async activateInput() {
    const button = this.nav.getByRole("button", {
      name: "Search or enter URI",
    });
    await button.click();
    return this.page.getByPlaceholder("Search or enter URI");
  }

  async inputValue() {
    const input = await this.activateInput();
    const value = await input.inputValue();
    await this.close();
    return value;
  }

  async openWith(appName: string) {
    await this.nav.getByRole("button", { name: "Share" }).click();
    await this.nav.getByRole("menuitem", { name: appName }).click();
  }
}
