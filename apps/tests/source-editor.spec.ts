import { expect } from "@playwright/test";

import { test } from "./fixtures";
import { signIn } from "./actions/signIn";
import { alice } from "./fixtures/credentials";
import { SourceEditorTool } from "./page-objects/SourceEditorTool";

const TURTLE_DOCUMENT_URI =
  "http://localhost:4000/alice/turtle-document/document";

const UPDATED_TURTLE = `@prefix : <#> .
@prefix schema: <http://schema.org/> .

:it
    a schema:Thing ;
    schema:name "Turtle Document" ;
    schema:description "Updated description" ;
.
`;

test.describe("Turtle documents", () => {
  test("Edit and save a Turtle document in the source editor", async ({
    page,
    navigationBar,
  }) => {
    const sourceEditor = new SourceEditorTool(page);

    await test.step("Given PodOS Browser is open", async () => {
      await page.goto("/");
    });

    await test.step("And Pod owner is signed in", async () => {
      await signIn(page, alice);
    });

    await test.step("when navigating to a Turtle document", async () => {
      await navigationBar.fillAndSubmit(TURTLE_DOCUMENT_URI);
    });

    await test.step("and opening it in the source editor", async () => {
      await sourceEditor.open();
      await expect(sourceEditor.content()).toContainText(
        'schema:name "Turtle Document"',
      );
    });

    await test.step("and editing the content", async () => {
      await sourceEditor.replaceAll(UPDATED_TURTLE);
      await sourceEditor.expectUnsavedChanges();
    });

    await test.step("and saving the changes", async () => {
      await sourceEditor.save();
      await sourceEditor.expectAllSaved();
    });

    await test.step("then the change persists after reloading the resource", async () => {
      await page.reload();
      await sourceEditor.open();
      await expect(sourceEditor.content()).toContainText(
        'schema:description "Updated description"',
      );
    });
  });
});
