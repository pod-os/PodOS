import { test as base } from "playwright/test";
import { NavigationBar } from "../page-objects/NavigationBar";
import { LdpContainerTool } from "../page-objects/container/LdpContainerTool";
import { ToolSelect } from "../page-objects/ToolSelect";

export type TestOptions = {
  /** whether the app under test is the built bundle, which registers a service worker */
  includesServiceWorker: boolean;
};

type TestFixtures = {
  navigationBar: NavigationBar;
  ldpContainerTool: LdpContainerTool;
  toolSelect: ToolSelect;
};

export const test = base.extend<TestFixtures & TestOptions>({
  includesServiceWorker: false,
  navigationBar: async ({ page }, use) => {
    await use(new NavigationBar(page));
  },
  ldpContainerTool: async ({ page }, use) => {
    await use(new LdpContainerTool(page));
  },
  toolSelect: async ({ page }, use) => {
    await use(new ToolSelect(page));
  },
});
