export async function pressKey(page, key: string, options: KeyboardEventInit = {}) {
  const keyEvent = new KeyboardEvent('keydown', {
    key,
    ...options,
  });
  page.root.dispatchEvent(keyEvent);
  await page.waitForChanges();
}
