import { test as base } from "playwright/test";
import { NavigationBar } from "../page-objects/NavigationBar";

export const test = base.extend<{
  navigationBar: NavigationBar;
}>({
  navigationBar: async ({ page }, use) => {
    await use(new NavigationBar(page));
  },
});
