import { fireEvent } from '@testing-library/dom';

export async function typeToSearch(page, text: string) {
  jest.useFakeTimers();
  const searchBar = page.root.querySelector('input');
  searchBar.value = text;
  // @ts-ignore
  fireEvent(searchBar, new CustomEvent('change', { target: { value: text } }));
  jest.advanceTimersByTime(300); // advance debounce time
  jest.useRealTimers();
  await page.waitForChanges();
}
