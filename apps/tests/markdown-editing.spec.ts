import { expect } from "@playwright/test";

import { test } from "./fixtures";
import { signIn } from "./actions/signIn";
import { alice } from "./fixtures/credentials";
import { GenericThingPage } from "./page-objects/GenericThingPage";
import { MarkdownEditor } from "./page-objects/MarkdownEditor";

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

    await test.step("and editing the content", async () => {
      const editor = new MarkdownEditor(page);
      await editor.startEditing();
      await editor.replaceContent(
        "# Updated Markdown Document\n\nUpdated content",
      );
    });

    await test.step("then changes are saved", async () => {
      await expect(
        page.getByRole("status", { name: "all saved" }),
      ).toBeVisible();
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

  test("Inserts a mention from the label index and navigates to the mentioned resource", async ({
    page,
    navigationBar,
  }) => {
    await test.step("Given PodOS Browser is open", async () => {
      await page.goto("/");
    });

    await test.step("And Pod owner is signed in", async () => {
      await signIn(page, alice);
    });

    const editor =
      await test.step("when navigating to a markdown document and editing it", async () => {
        await navigationBar.fillAndSubmit(
          "http://localhost:4000/alice/markdown/document.md",
        );
        const editor = new MarkdownEditor(page);
        await editor.startEditing();
        await editor.replaceContent("");
        return editor;
      });

    await test.step("and typing the mention trigger plus a query", async () => {
      await editor.replaceContent("#Someth");

      const suggestion = page
        .getByRole("option")
        .filter({ hasText: "Something" })
        .describe("Mention suggestion");
      await expect(suggestion).toBeVisible();
    });

    await test.step("and accepting the suggestion", async () => {
      await editor.acceptSuggestion();
    });

    await test.step("then the mention is inserted as a link in the editor", async () => {
      await expect(editor.link("Something")).toBeVisible();
    });

    await test.step("and the user can follow the link to visit the mentioned thing", async () => {
      await editor.link("Something").click();

      await expect(page).toHaveURL(
        /uri=[^&]*alice%2Fpublic%2Fgeneric%2Fresource/,
      );
      const somethingPage = new GenericThingPage(page, "Something");
      await expect(somethingPage.heading()).toHaveText("Something");
      await expect(somethingPage.overview()).toHaveText(/A very generic item/);
    });
  });
});
