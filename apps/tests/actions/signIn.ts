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
  const loginButton = page.locator("pos-login").getByRole("button");
  await loginButton.click();

  const idpUrl = page.getByLabel("Please enter your Identity Provider");
  await idpUrl.fill("http://localhost:4000");
  await idpUrl.press("Enter");

  await expect(page).toHaveURL(
    "http://localhost:4000/.account/login/password/",
  );

  await page.getByLabel("Email").fill(credentials.email);
  await page.getByLabel("Password").fill(credentials.password);
  await page.getByRole("button", { name: "Log in" }).click();

  await page.getByRole("button", { name: "Authorize" }).click();

  await expect(page).toHaveURL(originalLocation);
  const name = page
    .getByRole("banner")
    .locator("pos-label")
    .filter({ hasText: credentials.name });
  await expect(name).toBeVisible();
}
