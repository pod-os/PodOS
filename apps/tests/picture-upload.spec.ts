import { expect } from "@playwright/test";
import { signIn } from "./actions/signIn";
import { alice } from "./fixtures/credentials";
import { test } from "./fixtures";
import * as path from "node:path";

const THING_NAME = "Thing Without Picture";
const THING_URL =
  "http://localhost:4000/alice/acb50d31-42af-4d4c-9ead-e2d5e70d7317/thing-without-picture#it";
const TEST_IMAGE_PATH = path.join(__dirname, "./assets/test-tube.png");
const TEST_IMAGE_NAME = "test-tube.png";

test("can upload a picture to a thing that has no picture", async ({
  page,
  navigationBar,
  genericThingPage,
}) => {
  await test.step("Given PodOS Browser is open", async () => {
    await page.goto("/");
  });

  await test.step("And pod owner is signed in", async () => {
    await signIn(page, alice);
  });

  await test.step("When navigating to a thing without a picture", async () => {
    await navigationBar.fillAndSubmit(THING_URL);
  });

  await test.step("Then the thing is displayed without a picture", async () => {
    await expect(genericThingPage.heading()).toHaveText(THING_NAME);
    await expect(genericThingPage.overview(THING_NAME)).toHaveText(
      /A generic item that has no picture yet/,
    );
    await expect(genericThingPage.picture(THING_NAME)).not.toBeVisible();
  });

  const pictureUpload =
    await test.step("When I open the picture upload", async () => {
      return await genericThingPage.openPictureUpload();
    });

  await test.step("And I select and upload an image file", async () => {
    await pictureUpload.selectAndUploadFile(TEST_IMAGE_PATH);
  });

  await test.step("And I close the upload interface", async () => {
    await pictureUpload.close();
  });

  await test.step("Then the upload interface is gone", async () => {
    await expect(pictureUpload.uploadArea()).not.toBeVisible();
  });

  await test.step("And I can see the uploaded picture", async () => {
    await expect(genericThingPage.picture(THING_NAME)).toBeVisible();
    await expect(genericThingPage.picture(THING_NAME)).toHaveAttribute(
      "src",
      /blob:/,
    );
  });

  await test.step("And I can see the picture link in the relations section", async () => {
    await page.reload(); // needed until https://github.com/pod-os/PodOS/issues/37 is implemented
    await expect(genericThingPage.relationsSection()).toBeVisible();
    await expect(genericThingPage.imageRelation(TEST_IMAGE_NAME)).toBeVisible();
  });
});
