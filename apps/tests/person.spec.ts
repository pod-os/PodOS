import { test, expect } from "@playwright/test";

test("show name as heading for a person", async ({ page }) => {
  // when opening PodOS Browser
  await page.goto("/");

  // and navigating to Alice's WebID
  const navigationBar = page.getByPlaceholder("Enter URI");
  await navigationBar.fill("http://localhost:4000/alice/profile/card#me");
  await navigationBar.press("Enter");

  // then the heading shows Alice's name as heading
  const label = await page.getByRole("heading");
  await expect(label).toHaveText("Alice");
});
