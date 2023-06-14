import { expect, Page } from "@playwright/test";

export interface Credentials {
  email: string;
  password: string;
}

export async function signIn(
  page: Page,
  credentials: Credentials,
  idp: string = "http://localhost:4000"
) {
  const originalLocation = page.url();
  page.on("dialog", (dialog) => {
    dialog.accept(idp);
  });
  const loginButton = page.locator("pos-login").getByRole("button");
  await loginButton.click();

  await expect(page).toHaveURL("http://localhost:4000/idp/login/");

  await page.getByLabel("Email").type("alice@mail.example");
  await page.getByLabel("Password").type("alice");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.getByRole("button", { name: "Authorize" }).click();

  await expect(page).toHaveURL(originalLocation);
}
