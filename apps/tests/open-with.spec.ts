import { expect } from "@playwright/test";

import { test } from "./fixtures";
import { GenericThingPage } from "./page-objects/GenericThingPage";

test("open recipes with Umai", async ({ page, navigationBar }) => {
  await test.step("Given PodOS Browser shows a recipe", async () => {
    await page.goto("/");
    await navigationBar.fillAndSubmit(
      "http://localhost:4000/alice/cookbook/cacio-e-pepe#it",
    );
    const somethingPage = new GenericThingPage(page, "Cacio e Pepe");
    await expect(somethingPage.overview()).toHaveText(/Recipe/);
  });

  await test.step("When I open the resource with Umai", async () => {
    await navigationBar.openWith("Umai");
  });

  await test.step("Umai opens in a new tab, showing the recipe", async () => {
    const pagePromise = page.waitForEvent("popup");
    const newTab = await pagePromise;
    await newTab.waitForLoadState();
    await expect(newTab).toHaveURL(
      "https://umai.noeldemartin.com/viewer?url=http://localhost:4000/alice/cookbook/cacio-e-pepe%23it",
    );
  });
});
