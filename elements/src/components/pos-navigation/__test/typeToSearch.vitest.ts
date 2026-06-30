import { fireEvent } from '@testing-library/dom';
import { RenderResult } from '@stencil/vitest';

export async function typeToSearch(page: RenderResult, text: string) {
  const searchBar = page.root.shadowRoot!.querySelector('input')!;
  searchBar.value = text;
  // @ts-ignore
  fireEvent(searchBar, new CustomEvent('change', { target: { value: text } }));
}
