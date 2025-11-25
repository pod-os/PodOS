import { expect } from "@playwright/test";
import { signIn } from "./actions/signIn";
import { alice } from "./fixtures/credentials";

import { test } from "./fixtures";
import { GenericThingPage } from "./page-objects/GenericThingPage";

test.describe("Text search", () => {
  test("finds a thing based on the label index", async ({
    page,
    navigationBar,
  }) => {
    await test.step("given a user is signed in", async () => {
      await page.goto("/");
      await signIn(page, alice);
    });

    await test.step("when they search for a text and select the first result", async () => {
      const input = await navigationBar.fill("ometh");

      const result = page.getByRole("option").filter({ hasText: "Something" });
      await expect(result).toBeVisible();
      await input.press("ArrowDown");
      await input.press("Enter");
    });

    await test.step("then the page shows the selected resource", async () => {
      const somethingPage = new GenericThingPage(page, "Something");
      await expect(somethingPage.overview(), "show description").toHaveText(
        /A very generic item/,
      );
    });
  });

  test("can find a thing, after making it findable", async ({
    page,
    navigationBar,
  }) => {
    await test.step("given a user is signed in", async () => {
      await page.goto("/");
      await signIn(page, alice);
    });

    const input = await navigationBar.activateInput();

    await test.step("and there is no search result for 'Banana'", async () => {
      await input.fill("Banana");

      const result = page.getByRole("option").filter({ hasText: "Banana" });
      await expect(result).not.toBeVisible();
    });

    await test.step("when they navigate to the thing", async () => {
      await input.fill("http://localhost:4000/alice/make-findable/banana#it");
      await input.press("Enter");
      await expect(page.getByRole("heading", { name: "Banana" })).toBeVisible();
    });

    await test.step("and they make it findable", async () => {
      await page.getByRole("button", { name: "Make this findable" }).click();
    });

    await test.step("then they will find it when retrying the search", async () => {
      await navigationBar.fill("Banana");

      const result = page.getByRole("option").filter({ hasText: "Banana" });
      await expect(result).toBeVisible();
    });
  });
});
