export async function pressKey(page, key: string) {
  const keyEvent = new KeyboardEvent('keydown', {
    key,
  });
  page.root.dispatchEvent(keyEvent);
  await page.waitForChanges();
}
