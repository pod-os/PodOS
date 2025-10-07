// noinspection ES6UnusedImports
import { h } from '@stencil/core';

import { newSpecPage } from '@stencil/core/testing';
import { PosMarkdownDocument } from './pos-markdown-document';

describe('pos-markdown-document', () => {
  it('parses and renders the markdown document', async () => {
    const fileContent = `## Test

This is a test document`;
    const file = {
      blob: () => ({
        text: () => {
          return Promise.resolve(fileContent);
        },
      }),
    };
    const page = await newSpecPage({
      components: [PosMarkdownDocument],
      template: () => <pos-markdown-document file={file} />,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-markdown-document>
        <article>
          <h2>
            Test
          </h2>
          <p>
            This is a test document
          </p>
        </article>
      </pos-markdown-document>
    `);
  });
});
