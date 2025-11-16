import { expect } from "@playwright/test";

import { test } from "./fixtures";
import { alice } from "./fixtures/credentials";
import { signIn } from "./actions/signIn";
import { v4 as random } from "uuid";

test.describe("An LDP container", () => {
  test("show its own contents", async ({ page, navigationBar }) => {
    // when opening PodOS Browser
    await page.goto("/");

    // and navigating to a ldp container resource
    await navigationBar.fillAndSubmit("http://localhost:4000/alice/container/");

    // then page shows the full container URL as heading
    const heading = await page.getByRole("heading", { level: 1 });
    await expect(heading).toHaveText("container");

    // and shows a list of all contents
    const contents = page
      .locator("pos-container-contents")
      .getByRole("listitem");
    let item1 = contents.nth(0);
    let item2 = contents.nth(1);
    let item3 = contents.nth(2);
    let item4 = contents.nth(3);

    // and for each item in the list the relative name is shown
    await expect(item1).toHaveText("another-sub-container");
    await expect(item2).toHaveText("readme.md");
    await expect(item3).toHaveText("resource");
    await expect(item4).toHaveText("sub-container");

    // and each item links to the full URL
    await expect(item1.getByRole("link")).toHaveAttribute(
      "href",
      "http://localhost:4000/alice/container/another-sub-container/",
    );
    await expect(item2.getByRole("link")).toHaveAttribute(
      "href",
      "http://localhost:4000/alice/container/readme.md",
    );
    await expect(item3.getByRole("link")).toHaveAttribute(
      "href",
      "http://localhost:4000/alice/container/resource",
    );
    await expect(item4.getByRole("link")).toHaveAttribute(
      "href",
      "http://localhost:4000/alice/container/sub-container/",
    );

    // and for each item in the list a icon is shown, indicating whether it is a folder or document
    await expect(item1.locator("sl-icon")).toHaveAttribute("name", "folder2");
    await expect(item2.locator("sl-icon")).toHaveAttribute(
      "name",
      "file-earmark",
    );
    await expect(item3.locator("sl-icon")).toHaveAttribute(
      "name",
      "file-earmark",
    );
    await expect(item4.locator("sl-icon")).toHaveAttribute("name", "folder2");
  });

  test("can create a new file in the container", async ({
    page,
    navigationBar,
    ldpContainerTool,
  }) => {
    const filename = random();

    await test.step("Given PodOS Browser is open", async () => {
      await page.goto("/");
    });

    await test.step("and the pod owner is signed in", async () => {
      await signIn(page, alice);
    });

    await test.step("and a container is shown ", async () => {
      await navigationBar.fillAndSubmit("http://localhost:4000/alice/");
    });

    await test.step("when the user creates a new file", async () => {
      await ldpContainerTool.createNewFile(filename);
    });

    await test.step("then the file is created and shown", async () => {
      const heading = page.getByRole("heading");
      await expect(heading).toHaveText(filename);
      expect(await navigationBar.inputValue()).toEqual(
        `http://localhost:4000/alice/${filename}`,
      );
    });
  });

  test("can create a new folder in the container", async ({
    page,
    navigationBar,
    ldpContainerTool,
  }) => {
    const folderName = random();

    await test.step("Given PodOS Browser is open", async () => {
      await page.goto("/");
    });

    await test.step("and the pod owner is signed in", async () => {
      await signIn(page, alice);
    });

    await test.step("and a container is shown ", async () => {
      await navigationBar.fillAndSubmit("http://localhost:4000/alice/");
    });

    await test.step("when the user creates a new folder", async () => {
      await ldpContainerTool.createNewFolder(folderName);
    });

    await test.step("then the folder is created and shown", async () => {
      const heading = page.getByRole("heading");
      await expect(heading).toHaveText(folderName);
      expect(await navigationBar.inputValue()).toEqual(
        `http://localhost:4000/alice/${folderName}/`,
      );
      const overview = page
        .getByRole("article", { name: folderName })
        .describe("Overview card");
      await expect(overview, "has container type").toHaveText(/BasicContainer/);
    });
  });
});
