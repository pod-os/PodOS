import { vi } from 'vitest';

import { describe, h, it, render, expect } from '@stencil/vitest';
import { BrokenFile } from './BrokenFile';
import { BrokenFile as BrokenFileData } from '@pod-os/core';

vi.mock('@shoelace-style/shoelace/dist/components/icon/icon.js', () => ({}));

describe('BrokenFile', () => {
  it('renders', async () => {
    const brokenFile = {
      url: 'https://pod.test/image.png',
      toString: () => 'error message',
      status: { code: 401, text: 'unauthenticated' },
    } as unknown as BrokenFileData;
    const page = await renderComponent(brokenFile);
    expect(page.root).toMatchSnapshot();
  });

  it.each`
    code   | iconName
    ${401} | ${'lock'}
    ${403} | ${'lock'}
    ${404} | ${'question-circle'}
    ${500} | ${'exclamation-circle'}
  `(`renders $iconName icon for status $code`, async ({ code, iconName }) => {
    const brokenFile = {
      url: 'https://pod.test/image.png',
      toString: () => 'error message',
      status: { code, text: 'unauthenticated' },
    } as unknown as BrokenFileData;
    const page = await renderComponent(brokenFile);
    expect(page.root.querySelector('sl-icon')).toEqualAttribute('name', iconName);
  });
});

async function renderComponent(brokenFile: BrokenFileData) {
  return await render(<BrokenFile file={brokenFile} />, {
    waitForReady: false, // do not wait for hydration, because sl-icon will never hydrate
  });
}
