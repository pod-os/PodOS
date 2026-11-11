import { describe, expect, h, it, render } from '@stencil/vitest';
import './pos-tool-source-editor';
import { getByRole } from '@testing-library/dom';

describe('pos-tool-source-editor', () => {
  it('renders a contenteditable textbox', async () => {
    const page = await render(<pos-tool-source-editor></pos-tool-source-editor>);

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
