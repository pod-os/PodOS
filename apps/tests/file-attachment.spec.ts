import { expect } from "@playwright/test";
import { signIn } from "./actions/signIn";
import { alice } from "./fixtures/credentials";
import { test } from "./fixtures";
import { GenericThingPage } from "./page-objects/GenericThingPage";
import * as path from "node:path";

const TEST_DOCUMENT_PATH = path.join(__dirname, "./assets/test-document.pdf");

test("can upload a file attachment to a thing that has no attachments", async ({
  page,
  navigationBar,
}) => {
  await test.step("Given PodOS Browser is open", async () => {
    await page.goto("/");
  });

  await test.step("And pod owner is signed in", async () => {
    await signIn(page, alice);
  });

  const attachmentTool =
    await test.step("And they are viewing a thing without attachments", async () => {
      await navigationBar.fillAndSubmit(
        "http://localhost:4000/alice/acb50d31-42af-4d4c-9ead-e2d5e70d7317/thing-without-attachments#it",
      );
      const thingPage = new GenericThingPage(page, "Thing Without Attachments");
      await expect(thingPage.heading()).toHaveText("Thing Without Attachments");
      const attachmentTool = await thingPage.openAttachmentsTool();
      await expect(attachmentTool.attachmentsSection()).toHaveText(
        /No attachments found/,
      );
      return attachmentTool;
    });

  await test.step("When they select and upload a PDF file", async () => {
    const fileUpload = await attachmentTool.fileUpload();
    await fileUpload.selectAndUploadFile(TEST_DOCUMENT_PATH);
  });

  await test.step("Then they can see the uploaded file in the attachments list", async () => {
    await expect(attachmentTool.attachment("test-document.pdf")).toBeVisible();
  });

  await test.step("And they can navigate to the attached file and view it", async () => {
    await attachmentTool.attachment("test-document.pdf").click();
    await expect(page).toHaveURL(/test-document\.pdf$/);
    const iframe = page.getByRole("main").locator("iframe");
    await expect(iframe).toHaveAttribute("src", /^blob:/);
  });
});
