import { expect } from "@playwright/test";

import { test } from "./fixtures";

import { signIn } from "./actions/signIn";
import { alice } from "./fixtures/credentials";

test.describe("Source Editor", () => {
  test("Edit turtle source", async ({ page, navigationBar, toolSelect }) => {
    await test.step("Given PodOS Browser is open", async () => {
      await page.goto("/");
    });

    await test.step("And Pod owner is signed in", async () => {
      await signIn(page, alice);
    });

    await test.step("when navigating to a Turtle document", async () => {
      await navigationBar.fillAndSubmit(
        "http://localhost:4000/alice/source-editor/document.ttl",
      );
    });

    const editor = await test.step("and switching to the Src tab", async () => {
      return await toolSelect.openSrcTool();
    });

    await test.step("then the turtle sources are shown in an editor", async () => {
      expect(editor.textbox()).toContainText(
        `@prefix : <#>.@prefix schema: <http://schema.org/>.<>    schema:name "A turtle file";    schema:description "Used to test the pos-tool-source-editor" .`,
      );
    });
  });
});
