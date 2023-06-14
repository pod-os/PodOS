import { expect, Page, test } from "@playwright/test";
import { Credentials, signIn } from "./actions/signIn";

const alice: Credentials = {
  email: "alice@mail.example",
  password: "alice",
};

test("can add a new thing", async ({ page }) => {
  // when opening PodOS Browser
  await page.goto("/");

  // and navigating to a container
  const navigationBar = page.getByPlaceholder("Enter URI");
  await navigationBar.fill(
    "http://localhost:4000/alice/acb50d31-42af-4d4c-9ead-e2d5e70d7317/"
  );
  await navigationBar.press("Enter");

  // when signing in as the pod owner
  await signIn(page, alice);

  // then I can click a button to add a new thing
  const addNewThing = page.getByTitle("Add a new thing");
  await addNewThing.click();

  // and see a dialog
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // when I select a type
  const typeField = page.locator("#type").getByRole("combobox"); // getByLabel not working, probably due to https://github.com/whatwg/html/issues/3219
  // await expect(typeField).toBeFocused(); // TODO: This is failing in most browsers currently (browser bug?)
  await typeField.type("https://vocab.example/Thing");
  await typeField.press("Tab");

  // and enter a name
  await page.keyboard.type("My new Thing", { delay: 100 });

  // and submit
  await page.keyboard.press("Enter");

  // then I am at the page showing the new thing
  await expect(navigationBar).toHaveValue(
    "http://localhost:4000/alice/acb50d31-42af-4d4c-9ead-e2d5e70d7317/my-new-thing#it"
  );

  // and page shows a heading with the resource name
  const heading = await page.getByRole("heading");
  await expect(heading).toHaveText("My new Thing");
});
