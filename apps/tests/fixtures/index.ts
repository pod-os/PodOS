import { test as base } from "playwright/test";
import { NavigationBar } from "../page-objects/NavigationBar";
import { LdpContainerTool } from "../page-objects/container/LdpContainerTool";
import { ToolSelect } from "../page-objects/ToolSelect";

export const test = base.extend<{
  navigationBar: NavigationBar;
  ldpContainerTool: LdpContainerTool;
  toolSelect: ToolSelect;
}>({
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
