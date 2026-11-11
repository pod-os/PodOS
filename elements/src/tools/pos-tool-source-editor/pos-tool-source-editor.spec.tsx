import { vi } from 'vitest';
import { beforeEach, describe, expect, h, it, render } from '@stencil/vitest';

import { mockPodOS } from '../../test/mockPodOS.vitest';
import './pos-tool-source-editor';
import { getByRole } from '@testing-library/dom';
import { mockResource } from '../../test/mockResource';
import { PodOS, SolidFile, Thing } from '@pod-os/core';

describe('pos-tool-source-editor', () => {
  let os: PodOS;
  beforeEach(() => {
    os = mockPodOS();
  });

  it('renders skeleton while loading', async () => {
    const page = await render(<pos-tool-source-editor></pos-tool-source-editor>);
    expect(page.root).toMatchInlineSnapshot(`
      <pos-tool-source-editor class="hydrated">
        <article>
          <div class="content">
            <div class="skeleton">
              <sl-skeleton effect="sheen"></sl-skeleton>
              <sl-skeleton effect="sheen"></sl-skeleton>
              <sl-skeleton effect="sheen"></sl-skeleton>
              <sl-skeleton effect="sheen"></sl-skeleton>
              <sl-skeleton effect="sheen"></sl-skeleton>
              <sl-skeleton effect="sheen"></sl-skeleton>
            </div>
          </div>
        </article>
      </pos-tool-source-editor>
    `);
  });

  it('renders a contenteditable textbox with the file content after the file has been fetched', async () => {
    mockFile(os, 'https://resource.test/document.ttl', 'file source content');

    mockResource({
      uri: 'https://resource.test/document.ttl',
    } as unknown as Thing);
    const page = await render(<pos-tool-source-editor></pos-tool-source-editor>);

    await page.waitForChanges();

    const textbox = getByRole(page.root, 'textbox');
    expect(textbox).toMatchInlineSnapshot(`
      <div
        aria-multiline="true"
        aria-readonly="true"
        autocapitalize="off"
        autocorrect="off"
        class="cm-content"
        contenteditable="false"
        role="textbox"
        spellcheck="false"
        style="tab-size: 4;"
        tabindex="0"
        translate="no"
        writingsuggestions="false"
      >
        <div
          class="cm-line cm-activeLine"
        >
          file source content
        </div>
      </div>
    `);
  });
});

function mockFile(os: PodOS, url: string = 'https://resource.test/document.ttl', textContent: string) {
  const file = {
    url: url,
    blob: () => ({
      text: () => {
        return Promise.resolve(textContent);
      },
    }),
  } as SolidFile;
  vi.when(os.files().fetchFile).calledWith(url).thenResolveOnce(file);
}
