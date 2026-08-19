import { vi } from 'vitest';
import { describe, expect, it, render, h } from '@stencil/vitest';

vi.mock('@pod-os/core', () => ({
  RdfDocument: class {},
}));

import './pos-subjects';

describe('pos-subjects', () => {
  it('are empty initially', async () => {
    const page = await render(<pos-subjects />);
    expect(page.root).toBeEmptyDOMElement();
  });

  it('renders single subject and rich link to it', async () => {
    const page = await render(<pos-subjects />);
    await page.instance.receiveResource({
      assume: () => ({
        subjects: () => [
          {
            uri: 'https://person.test/alice#me',
          },
        ],
      }),
    });
    await page.waitForChanges();

    const linkToAlice = page.root.shadowRoot!.querySelector('pos-rich-link[uri="https://person.test/alice#me"]');
    expect(linkToAlice).not.toBeNull();
  });

  it('renders multiple subjects and rich links to them', async () => {
    const page = await render(<pos-subjects />);
    await page.instance.receiveResource({
      assume: () => ({
        subjects: () => [
          {
            uri: 'https://person.test/alice#me',
          },
          {
            uri: 'https://person.test/alice#address',
          },
        ],
      }),
    });
    await page.waitForChanges();

    const linkToAlice = page.root.shadowRoot!.querySelector('pos-rich-link[uri="https://person.test/alice#me"]');
    expect(linkToAlice).not.toBeNull();

    const linkToAddress = page.root.shadowRoot!.querySelector('pos-rich-link[uri="https://person.test/alice#address"]');
    expect(linkToAddress).not.toBeNull();
  });
});
