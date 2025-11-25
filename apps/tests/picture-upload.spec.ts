import { expect } from "@playwright/test";
import { signIn } from "./actions/signIn";
import { alice } from "./fixtures/credentials";
import { test } from "./fixtures";
import * as path from "node:path";

test("can upload a picture to a thing that has no picture", async ({
  page,
  navigationBar,
}) => {
  await test.step("Given PodOS Browser is open", async () => {
    await page.goto("/");
  });

  await test.step("And pod owner is signed in", async () => {
    await signIn(page, alice);
  });

  await test.step("When navigating to a thing without a picture", async () => {
    await navigationBar.fillAndSubmit(
      "http://localhost:4000/alice/acb50d31-42af-4d4c-9ead-e2d5e70d7317/thing-without-picture#it",
    );
  });

  await test.step("Then the thing is displayed without a picture", async () => {
    const heading = page.getByRole("heading").describe("Heading");
    await expect(heading).toHaveText("Thing Without Picture");

    const overview = page
      .getByRole("article", {
        name: "Thing Without Picture",
      })
      .describe("Overview");
    await expect(overview).toHaveText(/A generic item that has no picture yet/);

    const noPictureImage = overview
      .getByAltText("Thing Without Picture")
      .describe("Picture");
    await expect(noPictureImage).not.toBeVisible();
  });

  await test.step("When I click the upload button", async () => {
    const overview = page.getByRole("article", {
      name: "Thing Without Picture",
    });
    const uploadButton = overview.getByRole("button", {
      name: /Upload picture/,
    });
    await uploadButton.click();
  });

  await test.step("And I select and upload an image file", async () => {
    const fileChooserPromise = page.waitForEvent("filechooser");
    const browseButton = page.getByRole("button", { name: "browse files" });
    await browseButton.click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, "./assets/test-tube.png"));

    const uploadButton = page.getByRole("button", { name: "Upload 1 file" });
    await uploadButton.click();
  });

  await test.step("And I close the upload interface", async () => {
    const closeButton = page
      .getByRole("button", { name: "Close upload" })
      .describe("Close button");
    await closeButton.click();
  });

  await test.step("Then the upload interface is gone", async () => {
    const uploadDialog = page.locator("pos-upload").describe("Upload area");
    await expect(uploadDialog).not.toBeVisible();
  });

  await test.step("And I can see the uploaded picture", async () => {
    const overview = page.getByRole("article", {
      name: "Thing Without Picture",
    });
    const uploadedImage = overview
      .getByAltText("Thing Without Picture")
      .describe("Uploaded picture");
    await expect(uploadedImage).toBeVisible();
    await expect(uploadedImage).toHaveAttribute("src", /blob:/);
  });

  await test.step("And I can see the picture link in the relations section", async () => {
    await page.reload(); // needed until https://github.com/pod-os/PodOS/issues/37 is implemented
    const relationsSection = page
      .locator("pos-relations")
      .describe("Relations section");
    await expect(relationsSection).toBeVisible();

    const relations = page.locator("pos-relations");
    const imageRelation = relations.getByRole("link", {
      name: "test-tube.png",
    });
    await expect(imageRelation).toBeVisible();
  });
});
