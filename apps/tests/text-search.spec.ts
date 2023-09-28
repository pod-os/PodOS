import { test, expect } from "@playwright/test";
import { signIn } from "./actions/signIn";
import { alice } from "./fixtures/credentials";

test("finds a thing based on the label index", async ({ page }) => {
  // given the PodOS Browser is open
  await page.goto("/");

  // and the Pod owner signed in
  await signIn(page, alice);

  // when searching for a text
  const navigationBar = page.getByPlaceholder("Search");
  await navigationBar.fill("ometh");

  // and choosing the first result
  const result = page.getByRole("listitem").filter({ hasText: "Something" });
  await expect(result).toBeVisible();
  await navigationBar.press("ArrowDown");
  await navigationBar.press("Enter");

  // then page shows a heading with the resource name
  const heading = await page.getByRole("heading");
  await expect(heading).toHaveText("Something");

  // and it shows the description of the resource
  const overview = page.locator("ion-col").filter({ has: heading });
  await expect(overview).toHaveText(/A very generic item/);

  // and the type of the resource
  await expect(overview).toHaveText(/Thing/);

  // and the image
  const image = overview.getByAltText("Something");
  await expect(image).toHaveAttribute("src", /blob:/);
});
