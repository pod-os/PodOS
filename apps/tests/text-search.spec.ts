import { test, expect } from "@playwright/test";
import { signIn } from "./actions/signIn";
import { alice } from "./fixtures/credentials";

test.describe("Text search", () => {
  test("finds a thing based on the label index", async ({ page }) => {
    await test.step("given a user is signed in", async () => {
      await page.goto("/");
      await signIn(page, alice);
    });

    await test.step("when they search for a text and select the first result", async () => {
      const navigationBar = page.getByPlaceholder("Search or enter URI");
      await navigationBar.fill("ometh");

      const result = page
        .getByRole("listitem")
        .filter({ hasText: "Something" });
      await expect(result).toBeVisible();
      await navigationBar.press("ArrowDown");
      await navigationBar.press("Enter");
    });

    await test.step("then the page shows the selected resource", async () => {
      const overview = page.getByRole("article", { name: "Something" });
      await expect(overview, "show description").toHaveText(
        /A very generic item/,
      );
    });
  });

  test("can find a thing, after making it findable", async ({ page }) => {
    await test.step("given a user is signed in", async () => {
      await page.goto("/");
      await signIn(page, alice);
    });

    await test.step("and there is no search result for 'Banana'", async () => {
      const navigationBar = page.getByPlaceholder("Search or enter URI");
      await navigationBar.fill("Banana");

      const result = page.getByRole("listitem").filter({ hasText: "Banana" });
      await expect(result).not.toBeVisible();
    });

    await test.step("when they navigate to the thing", async () => {
      const navigationBar = page.getByPlaceholder("Enter URI");
      await navigationBar.fill(
        "http://localhost:4000/alice/make-findable/banana#it",
      );
      await navigationBar.press("Enter");
      await expect(page.getByRole("heading", { name: "Banana" })).toBeVisible();
    });

    await test.step("and they make it findable", async () => {
      await page.getByRole("button", { name: "Make this findable" }).click();
    });

    await test.step("then they will find it when retrying the search", async () => {
      const navigationBar = page.getByPlaceholder("Search or enter URI");
      await navigationBar.fill("Banana");

      const result = page.getByRole("listitem").filter({ hasText: "Banana" });
      await expect(result).toBeVisible();
    });
  });
});
