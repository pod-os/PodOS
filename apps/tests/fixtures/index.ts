import { test as base } from "playwright/test";
import { NavigationBar } from "../page-objects/NavigationBar";
import { LdpContainerTool } from "../page-objects/container/LdpContainerTool";
import { GenericThingPage } from "../page-objects/GenericThingPage";

export const test = base.extend<{
  navigationBar: NavigationBar;
  ldpContainerTool: LdpContainerTool;
  genericThingPage: GenericThingPage;
}>({
  navigationBar: async ({ page }, use) => {
    await use(new NavigationBar(page));
  },
  ldpContainerTool: async ({ page }, use) => {
    await use(new LdpContainerTool(page));
  },
  genericThingPage: async ({ page }, use) => {
    await use(new GenericThingPage(page));
  },
});
