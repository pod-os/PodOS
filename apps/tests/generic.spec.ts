import { expect } from "@playwright/test";

import { test } from "./fixtures";
import { GenericThingPage } from "./page-objects/GenericThingPage";

test("show generic information about unknown types of things", async ({
  page,
  navigationBar,
}) => {
  // when opening PodOS Browser
  await page.goto("/");

  // and navigating to a generic resource
  await navigationBar.fillAndSubmit(
    "http://localhost:4000/alice/public/generic/resource#it",
  );

  const somethingPage = new GenericThingPage(page, "Something");

  // then page shows a heading with the resource name
  await expect(somethingPage.heading()).toHaveText("Something");

  // and it shows the description of the resource
  await expect(somethingPage.overview()).toHaveText(/A very generic item/);

  // and the type of the resource
  await expect(somethingPage.overview()).toHaveText(/Thing/);

  // and the image
  await expect(somethingPage.picture()).toHaveAttribute("src", /blob:/);
});
