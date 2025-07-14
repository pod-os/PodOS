import { expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { test } from "./fixtures";

test.describe("accessibility", () => {
  ["light", "dark"].forEach((colorScheme: "light" | "dark") => {
    test(`no contrast issues in ${colorScheme} mode`, async ({
      page,
      navigationBar,
    }) => {
      await test.step(`given the preferred color scheme is set to ${colorScheme}`, async () => {
        await page.emulateMedia({ colorScheme });
      });

      await test.step("when viewing a typical page in PodOS Browser", async () => {
        await page.goto("/");

        await navigationBar.fillAndSubmit(
          "http://localhost:4000/alice/public/generic/resource#it",
        );

        const heading = page.getByRole("heading");
        await expect(heading).toHaveText("Something");
      });

      await test.step("then it has no contrast issues", async () => {
        const accessibilityScanResults = await new AxeBuilder({
          page,
        }).analyze();
        const contrastsIssues = accessibilityScanResults.violations.filter(
          (it) => it.id === "color-contrast",
        );
        expect(contrastsIssues).toEqual([]);
      });
    });
  });
});
