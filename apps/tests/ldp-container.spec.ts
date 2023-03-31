import { test, expect } from "@playwright/test";

test("show contents of an LDP container", async ({ page }) => {
  // when opening PodOS Browser
  await page.goto("/");

  // and navigating to a ldp container resource
  const navigationBar = page.getByPlaceholder("Enter URI");
  await navigationBar.fill("http://localhost:4000/alice/container/");
  await navigationBar.press("Enter");

  // then page shows the full container URL as heading
  const heading = await page.getByRole("heading", { level: 2 });
  await expect(heading).toHaveText("http://localhost:4000/alice/container/");

  // and shows a list of all contents
  const contents = page.locator("pos-container-contents").getByRole("listitem");
  let item1 = contents.nth(0);
  let item2 = contents.nth(1);
  let item3 = contents.nth(2);
  let item4 = contents.nth(3);

  // and for each item in the list the relative name is shown
  await expect(item1.getByRole("heading")).toHaveText("another-sub-container");
  await expect(item2.getByRole("heading")).toHaveText("readme.md");
  await expect(item3.getByRole("heading")).toHaveText("resource");
  await expect(item4.getByRole("heading")).toHaveText("sub-container");

  // and for each item in the list, the full URL is shown
  await expect(item1.getByRole("paragraph")).toHaveText(
    "http://localhost:4000/alice/container/another-sub-container/"
  );
  await expect(item2.getByRole("paragraph")).toHaveText(
    "http://localhost:4000/alice/container/readme.md"
  );
  await expect(item3.getByRole("paragraph")).toHaveText(
    "http://localhost:4000/alice/container/resource"
  );
  await expect(item4.getByRole("paragraph")).toHaveText(
    "http://localhost:4000/alice/container/sub-container/"
  );

  // and for each item in the list a icon is shown, indicating whether it is a folder or document
  await expect(item1.locator("ion-icon")).toHaveAttribute(
    "name",
    "folder-outline"
  );
  await expect(item2.locator("ion-icon")).toHaveAttribute(
    "name",
    "document-outline"
  );
  await expect(item3.locator("ion-icon")).toHaveAttribute(
    "name",
    "document-outline"
  );
  await expect(item4.locator("ion-icon")).toHaveAttribute(
    "name",
    "folder-outline"
  );
});
