import { describe, expect, h, it, render } from '@stencil/vitest';
import './pos-tool-source-editor';
import { getByRole } from '@testing-library/dom';
import { mockResource } from '../../test/mockResource';
import { Thing } from '@pod-os/core';

describe('pos-tool-source-editor', () => {
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

  it('renders a contenteditable textbox after the resource is available', async () => {
    mockResource({
      uri: 'https://resource.test/document.ttl',
    } as unknown as Thing);
    const page = await render(<pos-tool-source-editor></pos-tool-source-editor>);

    await page.waitForChanges();

    const textbox = getByRole(page.root, 'textbox');
    expect(textbox).toMatchInlineSnapshot(`
      <div
        aria-multiline="true"
        autocapitalize="off"
        autocorrect="off"
        class="cm-content"
        contenteditable="true"
        role="textbox"
        spellcheck="false"
        style="tab-size: 4;"
        translate="no"
        writingsuggestions="false"
      >
        <div
          class="cm-line cm-activeLine"
        >
          TODO: show real document content
        </div>
      </div>
    `);
  });
});
