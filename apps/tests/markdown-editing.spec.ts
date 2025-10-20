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

  test("Edit existing markdown document", async ({ page, navigationBar }) => {
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

    await test.step("and clicking edit button", async () => {
      await page.getByRole("button", { name: "Edit" }).click();
    });

    await test.step("and editing the content", async () => {
      const editor = page.getByRole("textbox").describe("Editor");
      await editor.click();
      await editor.clear();
      await editor.pressSequentially(
        "# Updated Markdown Document\n\nUpdated content",
      );
    });

    await test.step("then changes are saved", async () => {
      await expect(page.getByText("All saved")).toBeVisible();
    });

    await test.step("and content persists after refresh", async () => {
      await page.reload();
      const article = page.getByRole("article").describe("Document");
      const heading = article
        .getByRole("heading", {
          name: "Updated Markdown Document",
        })
        .describe("Heading");
      await expect(heading).toBeVisible();
      await expect(
        article.getByText("Updated content").describe("Content"),
      ).toBeVisible();
    });
  });
});
