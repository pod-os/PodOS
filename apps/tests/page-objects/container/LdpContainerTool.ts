import { Page } from "@playwright/test";
import { ContainerToolbar } from "./ContainerToolbar";
import { ContainerContents } from "./ContainerContents";

export class LdpContainerTool {
  readonly toolbar: ContainerToolbar;
  readonly contents: ContainerContents;

  constructor(private page: Page) {
    this.toolbar = new ContainerToolbar(page);
    this.contents = new ContainerContents(page);
  }

  async createNewFile(newFile: string) {
    await this.toolbar.newFileButton().click();
    await this.contents.submitNewFile(newFile);
  }

  async createNewFolder(folderName: string) {
    await this.toolbar.newFolderButton().click();
    await this.contents.submitNewFolder(folderName);
  }
}
