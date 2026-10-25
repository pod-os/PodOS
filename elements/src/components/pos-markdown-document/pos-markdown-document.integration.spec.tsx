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
    // given a Markdown file
    const file = {
      url: 'https://alice.test/document/readme.md',
      blob: () =>
        new Blob(['# Test'], {
          type: 'text/markdown',
        }),
    } as SolidFile;

    // and pos-markdown-document allows to edit this file
    const page = await render(
      <pos-app>
        <pos-markdown-document editable file={file}></pos-markdown-document>
      </pos-app>,
    );
    await page.waitForChanges();
    const markdownDocument = page.root.querySelector('pos-markdown-document') as HTMLElement;

    // and the user started editing
    await userEvent.click(await findByShadowRole(markdownDocument, 'button', { name: 'Edit' }));
    await page.waitForChanges();

    // when they mention a thing from their label index
    const editor = await findByShadowRole(markdownDocument, 'textbox');
    await userEvent.type(editor, '#test');

    // then suggestions pop up to link the indexed thing or create a new one
    const options = await waitFor(async () => {
      const listbox = await findByShadowRole(markdownDocument, 'listbox');
      const options = await within(listbox).findAllByRole('option');
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveTextContent('Test found it');
      expect(options[0]).toHaveClass('indexed');
      expect(options[1]).toHaveTextContent('test');
      expect(options[1]).toHaveClass('new-thing');
      return options;
    });

    // when they click on the suggested item
    await userEvent.click(options[0]);

    // then the thing is linked in the document
    const link = await findByShadowRole(markdownDocument, 'link', { name: 'Test found it' });
    expect(link).toHaveAttribute('href', 'https://alice.test/something#it');
  });
});
