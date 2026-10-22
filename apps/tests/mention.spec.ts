import { expect } from "@playwright/test";

import { test } from "./fixtures";
import { signIn } from "./actions/signIn";
import { alice } from "./fixtures/credentials";
import { GenericThingPage } from "./page-objects/GenericThingPage";

test.describe("Mentions", () => {
  test("inserts a mention from the label index and navigates to the mentioned resource", async ({
    page,
    navigationBar,
  }) => {
    await test.step("given a user is signed in", async () => {
      await page.goto("/");
      await signIn(page, alice);
    });

    await test.step("and the served elements bundle contains the mention feature", async () => {
      const hasMentionFeature = await page.evaluate(() =>
        Boolean(customElements.get("pos-mention-menu")),
      );
      test.skip(
        !hasMentionFeature,
        "the served @pod-os/elements bundle does not include the mention feature; run via playwright-elements.config.ts against the local dev server",
      );
    });

    await test.step("when navigating to a markdown document and editing it", async () => {
      await navigationBar.fillAndSubmit(
        "http://localhost:4000/alice/markdown/document.md",
      );
      await page.getByRole("button", { name: "Edit" }).click();
      const editor = page.getByRole("textbox").describe("Editor");
      await editor.click();
      await editor.clear();
    });

    await test.step("and typing the mention trigger plus a query", async () => {
      const editor = page.getByRole("textbox").describe("Editor");
      await editor.pressSequentially("#Someth");

      const suggestion = page
        .getByRole("option")
        .filter({ hasText: "Something" });
      await expect(suggestion).toBeVisible();
    });

    await test.step("and selecting the suggestion", async () => {
      const editor = page.getByRole("textbox").describe("Editor");
      await editor.press("Enter");
    });

    await test.step("then the mention is inserted as a link", async () => {
      const mention = page.getByRole("link", { name: "Something" });
      await expect(mention).toBeVisible();
    });

    await test.step("when clicking the mention", async () => {
      await page.getByRole("link", { name: "Something" }).click();
    });

    await test.step("then the app navigates to the mentioned resource", async () => {
      await expect(page).toHaveURL(/uri=[^&]*alice%2Fpublic%2Fgeneric%2Fresource/);
      const somethingPage = new GenericThingPage(page, "Something");
      await expect(somethingPage.heading()).toHaveText("Something");
      await expect(somethingPage.overview()).toHaveText(/A very generic item/);
    });
  });
});
