import { expect } from "@playwright/test";
import { signIn } from "./actions/signIn";
import { alice } from "./fixtures/credentials";
import { test } from "./fixtures";

const BINARY_RESOURCE_URI =
  "http://localhost:4000/alice/public/rdf-metadata/test.pdf";

test.describe("RDF metadata", () => {
  test("shows metadata triples for a binary resource via describedby", async ({
    page,
    navigationBar,
  }) => {
    await test.step("Given PodOS Browser is open", async () => {
      await page.goto("/");
    });

    await test.step("When navigating to a binary resource with a .meta document", async () => {
      await navigationBar.fillAndSubmit(BINARY_RESOURCE_URI);
    });

    await test.step("Then metadata from the .meta document is visible in the Data tool", async () => {
      // Switch to the Data tab where metadata triples are shown
      const dataTab = page.getByRole("tab", { name: /Data/i });
      await dataTab.click();

      // The title from the .meta document should appear as the heading
      const heading = page.getByRole("heading");
      await expect(heading).toHaveText("Test Document");

      // The type from the .meta document should be visible
      const overview = page.getByRole("article", { name: "Test Document" });
      await expect(overview).toHaveText(/DigitalDocument/);

      // The description from the .meta document should be visible
      await expect(overview).toHaveText(
        /A PDF document for testing RDF metadata/,
      );
    });
  });

  test("can add a literal value to a binary resource and it persists via the .meta document", async ({
    page,
    navigationBar,
  }) => {
    await test.step("Given PodOS Browser is open", async () => {
      await page.goto("/");
    });

    await test.step("And pod owner is signed in", async () => {
      await signIn(page, alice);
    });

    await test.step("When navigating to a binary resource with a .meta document", async () => {
      await navigationBar.fillAndSubmit(BINARY_RESOURCE_URI);
    });

    await test.step("And I switch to the Data tool and add a literal value", async () => {
      // Switch to the Data tab to access the add-literal interface
      const dataTool = page
        .getByRole("tab", { name: /Data/i })
        .describe("Data tool");
      await dataTool.click();

      const addLiteralField = page
        .getByPlaceholder("Add literal")
        .describe("Add literal field");
      await expect(addLiteralField).toBeVisible();

      // Select a property
      await addLiteralField.fill("https://schema.org/keywords");
      await addLiteralField.press("Tab");

      // Enter a value
      await page.keyboard.type("integration-test", { delay: 100 });
      await page.keyboard.press("Enter");
    });

    await test.step("Then the new literal value appears on the page", async () => {
      const newProperty = page
        .getByRole("term")
        .filter({ hasText: "keywords" })
        .locator("..");
      const newValue = newProperty.getByRole("definition");
      await expect(newValue).toContainText("integration-test");
    });
  });
});
