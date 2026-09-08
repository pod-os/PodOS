import { expect } from "@playwright/test";
import { signIn } from "./actions/signIn";
import { alice } from "./fixtures/credentials";

import { test } from "./fixtures";
import { GenericThingPage } from "./page-objects/GenericThingPage";

test("can edit a literal value", async ({ page, navigationBar }) => {
  await test.step("Given Alice uses PodOS Browser", async () => {
    await page.goto("/");
    await signIn(page, alice);
  });

  const literals =
    await test.step("And she views the literals of a generic thing", async () => {
      await navigationBar.fillAndSubmit(
        "http://localhost:4000/alice/public/generic/resource#it",
      );
      return new GenericThingPage(page, "Something").literals();
    });

  await test.step("and she can see the current value of a text literal", async () => {
    await expect(literals.valueOf("text")).toContainText("Old value");
  });

  await test.step("when she changes the text to a new value", async () => {
    await literals.editValue("text", "New value");
  });

  // then it is saved
  await test.step("then it is saved", async () => {
    await expect(literals.valueOf("text")).toContainText("New value");
    await expect(literals.fieldStatus("text")).toHaveText("Saved successfully");
  });

  await test.step("and I can still see the new value even after a page reload", async () => {
    await page.reload();
    await expect(literals.valueOf("text")).toContainText("New value");
  });
});
