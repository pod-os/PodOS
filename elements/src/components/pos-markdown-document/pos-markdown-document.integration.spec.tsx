import { beforeEach, describe, expect, h, it, render } from '@stencil/vitest';
import { authenticatedUser, server, turtleFile } from '../../test/msw';
import { waitFor } from '@testing-library/dom';

import { SolidFile } from '@pod-os/core';
import { userEvent } from '@testing-library/user-event';

describe('pos-markdown-document', () => {
  beforeEach(() => {
    server.use(
      ...authenticatedUser('https://alice.test/profile/card#me'),
      turtleFile(
        'https://alice.test/profile/card',
        `
          <#me> <http://www.w3.org/ns/solid/terms#privateLabelIndex> <privateLabelIndex.ttl> .
        `,
      ),
      turtleFile(
        'https://alice.test/profile/privateLabelIndex.ttl',
        `
          <https://alice.test/something#it> <http://www.w3.org/2000/01/rdf-schema#label> "Test found it" .
        `,
      ),
    );
  });

  it('offers label-index items as mention suggestions while editing', async () => {
    const markdownBlob = new Blob(['# Test'], {
      type: 'text/markdown',
    });
    const file = {
      url: 'https://alice.test/document/readme.md',
      blob: () => markdownBlob,
    } as SolidFile;

    const page = await render(
      <pos-app>
        <pos-markdown-document editable file={file}></pos-markdown-document>
      </pos-app>,
    );
    await page.waitForChanges();
    const markdownDocument = page.root.querySelector('pos-markdown-document');
    await waitFor(() => {
      expect(markdownDocument.shadowRoot.querySelector('article header button')).not.toBeNull();
    });

    // start editing
    const editButton = markdownDocument.shadowRoot.querySelector('article header button');
    editButton.click();
    await page.waitForChanges();

    // type the mention trigger and query
    const editor = await waitFor(() => {
      const el = markdownDocument.shadowRoot.querySelector('div.content .ProseMirror');
      expect(el).not.toBeNull();
      return el;
    });
    editor.focus();
    await page.waitForChanges();
    await userEvent.type(editor, 'test');

    await waitFor(
      () => {
        // tiptap mounts the suggestion popup into document.body, not the shadow root
        const options = Array.from(document.body.querySelectorAll('pos-mention-menu li'));
        expect(options).toHaveLength(1);
        expect(options[0]).toHaveTextContent('Test found it');
      },
      { timeout: 5000 },
    );
  });
});
