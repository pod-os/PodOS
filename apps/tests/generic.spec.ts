import { test, expect } from "@playwright/test";

test("show generic information about unknown types of things", async ({
  page,
}) => {
  // when opening PodOS Browser
  await page.goto("/");

  // and navigating to a generic resource
  const navigationBar = page.getByPlaceholder("Enter URI");
  await navigationBar.fill(
    "http://localhost:4000/alice/public/generic/resource#it",
  );
  await navigationBar.press("Enter");

  // then page shows a heading with the resource name
  const heading = page.getByRole("heading");
  await expect(heading).toHaveText("Something");

  // and it shows the description of the resource
  const overview = page.getByRole("article", { name: "Something" });
  await expect(overview).toHaveText(/A very generic item/);

  // and the type of the resource
  await expect(overview).toHaveText(/Thing/);

  // and the image
  const image = overview.getByAltText("Something");
  await expect(image).toHaveAttribute("src", /blob:/);
});
