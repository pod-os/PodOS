import { test as base } from "playwright/test";
import { NavigationBar } from "../page-objects/NavigationBar";
import { LdpContainerTool } from "../page-objects/container/LdpContainerTool";

export const test = base.extend<{
  navigationBar: NavigationBar;
  ldpContainerTool: LdpContainerTool;
}>({
  navigationBar: async ({ page }, use) => {
    await use(new NavigationBar(page));
  },
  ldpContainerTool: async ({ page }, use) => {
    await use(new LdpContainerTool(page));
  },
});
