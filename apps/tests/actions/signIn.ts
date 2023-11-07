import { expect, Page } from "@playwright/test";

export interface Credentials {
  name: string;
  email: string;
  password: string;
}

export async function signIn(
  page: Page,
  credentials: Credentials,
  idp: string = "http://localhost:4000",
) {
  const originalLocation = page.url();
  page.on("dialog", (dialog) => {
    dialog.accept(idp);
  });
  const loginButton = page.locator("pos-login").getByRole("button");
  await loginButton.click();

  await expect(page).toHaveURL(
    "http://localhost:4000/.account/login/password/",
  );

  await page.getByLabel("Email").type(credentials.email);
  await page.getByLabel("Password").type(credentials.password);
  await page.getByRole("button", { name: "Log in" }).click();

  await page
    .getByRole("radio", {
      name: "http://localhost:4000/alice/profile/card#me",
    })
    .click();

  await expect(page.getByText("Pod OS at localhost")).toBeVisible();
  await page.getByRole("button", { name: "Authorize" }).click();

  await expect(page).toHaveURL(originalLocation);
  const name = page
    .getByRole("banner")
    .locator("pos-label")
    .filter({ hasText: credentials.name });
  await expect(name).toBeVisible();
}
