import { expect } from "@playwright/test";

import { test } from "./fixtures";
import { signIn } from "./actions/signIn";
import { alice } from "./fixtures/credentials";

test.describe("Markdown documents", () => {
  test("Render existing markdown document", async ({ page, navigationBar }) => {
    // given PodOS Browser is opened
    await test.step("Given PodOS Browser is open", async () => {
      await page.goto("/");
    });

    await test.step("And Pod owner is signed in", async () => {
      await signIn(page, alice);
    });

    await test.step("when navigating to a Markdown document", async () => {
      await navigationBar.fillAndSubmit(
        "http://localhost:4000/alice/markdown/document.md",
      );
    });

    await test.step("then the document is rendered as HTML", async () => {
      const article = page.getByRole("article").describe("Document");
      const heading = article
        .getByRole("heading", {
          name: "Existing Markdown Document",
        })
        .describe("Heading");
      await expect(heading).toBeVisible();

      await expect(
        article.getByText("Existing content").describe("Content"),
      ).toBeVisible();
    });
  });
});
