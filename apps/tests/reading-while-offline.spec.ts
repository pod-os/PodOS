import { expect } from "@playwright/test";

import { test } from "./fixtures";

test("can access cached resources while offline", async ({
  page,
  context,
  browserName,
  navigationBar,
}) => {
  test.skip(
    browserName === "webkit",
    "Does not work with the webkit version provided by Playwright. Manually confirmed it works in a webkit browser.",
  );
  await test.step("given the user has enabled offline cache", async () => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("settings", JSON.stringify({ offlineCache: true }));
    });
  });

  await test.step("and the they have visited a resource", async () => {
    await navigationBar.fillAndSubmit(
      "http://localhost:4000/alice/public/generic/resource#it",
    );

    const heading = page.getByRole("heading");
    await expect(heading).toHaveText("Something");
  });

  await test.step("and the user has returned to the home page", async () => {
    await page.goto("/");
  });

  await test.step("when the user goes offline", async () => {
    await context.setOffline(true);
  });

  await test.step("and visits the previously loaded resource", async () => {
    await navigationBar.fillAndSubmit(
      "http://localhost:4000/alice/public/generic/resource#it",
    );
  });

  await test.step("then the cached content is still accessible", async () => {
    const heading = page.getByRole("heading");
    await expect(heading).toHaveText("Something");

    const overview = page.getByRole("article", { name: "Something" });
    await expect(overview).toHaveText(/A very generic item/);
    await expect(overview).toHaveText(/Thing/);

    const image = overview.getByAltText("Something");
    await expect(image).toHaveAttribute("src", /blob:/);
  });

  await test.step("cleanup: restore online mode", async () => {
    await context.setOffline(false);
  });
});
