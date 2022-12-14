import { test, expect } from "@playwright/test";

test("show name as heading for a person", async ({ page }) => {
  // when navigating to a WebID of a person
  await page.goto(
    "/?uri=https%3A%2F%2Fangelo.veltens.org%2Fprofile%2Fcard%23me"
  );

  // then the page title is "PodOS Browser"
  await expect(page).toHaveTitle("PodOS Browser");

  // and the heading shows the name of the person
  const label = await page.getByRole("heading");
  await expect(label).toHaveText("Angelo Veltens");
});
