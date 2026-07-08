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
    toolSelect,
  }) => {
    await test.step("Given PodOS Browser is open", async () => {
      await page.goto("/");
    });

    await test.step("When navigating to a binary resource with a .meta document", async () => {
      await navigationBar.fillAndSubmit(BINARY_RESOURCE_URI);
    });

    await test.step("Then metadata from the .meta document is visible in the Data tool", async () => {
      const dataTool = await toolSelect.openDataTool("Test Document");

      // The title from the .meta document should appear as the heading
      await expect(dataTool.heading()).toHaveText("Test Document");

      // The type from the .meta document should be visible
      const overview = dataTool.overview();
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
    toolSelect,
  }) => {
    await test.step("Given PodOS Browser is open", async () => {
      await page.goto("/");
    });

    await test.step("And I am signed in", async () => {
      await signIn(page, alice);
    });

    await test.step("When navigating to a binary resource with a .meta document", async () => {
      await navigationBar.fillAndSubmit(BINARY_RESOURCE_URI);
    });

    const dataTool =
      await test.step("And I switch to the Data tool", async () => {
        return await toolSelect.openDataTool("Test Document");
      });

    await test.step("And I add a literal value", async () => {
      const addLiteral = dataTool.addLiteralValue();
      await addLiteral.fill("https://schema.org/keywords", "integration-test");
    });

    await test.step("Then the new literal value appears on the page", async () => {
      await expect(dataTool.literals().valueOf("keywords")).toContainText(
        "integration-test",
      );
    });
  });
});
