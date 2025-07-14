import { expect } from "@playwright/test";

import { test } from "./fixtures";

test("show contents of an LDP container", async ({ page, navigationBar }) => {
  // when opening PodOS Browser
  await page.goto("/");

  // and navigating to a ldp container resource
  await navigationBar.fillAndSubmit("http://localhost:4000/alice/container/");

  // then page shows the full container URL as heading
  const heading = await page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("container/");

  // and shows a list of all contents
  const contents = page.locator("pos-container-contents").getByRole("listitem");
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
  await expect(item1.locator("ion-icon")).toHaveAttribute(
    "name",
    "folder-outline",
  );
  await expect(item2.locator("ion-icon")).toHaveAttribute(
    "name",
    "document-outline",
  );
  await expect(item3.locator("ion-icon")).toHaveAttribute(
    "name",
    "document-outline",
  );
  await expect(item4.locator("ion-icon")).toHaveAttribute(
    "name",
    "folder-outline",
  );
});
