import { beforeEach, describe, expect, h, it, render } from '@stencil/vitest';
import { findByShadowRole } from 'shadow-dom-testing-library';
import { waitFor, within } from '@testing-library/dom';
import { userEvent } from '@testing-library/user-event';

import { SolidFile } from '@pod-os/core';
import { authenticatedUser, server, turtleFile } from '../../test/msw';

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
    const markdownDocument = page.root.querySelector('pos-markdown-document') as HTMLElement;

    // start editing
    await userEvent.click(await findByShadowRole(markdownDocument, 'button', { name: 'Edit' }));
    await page.waitForChanges();

    // type the mention trigger and query
    const editor = await findByShadowRole(markdownDocument, 'textbox');
    await userEvent.type(editor, '#test');

    // tiptap mounts the suggestion popup into document.body, not the shadow root
    await waitFor(() => {
      const options = within(document.body).getAllByRole('option');
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('Test found it');
    });
  });
});
