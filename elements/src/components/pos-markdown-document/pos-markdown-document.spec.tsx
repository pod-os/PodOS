// noinspection ES6UnusedImports
import { h } from '@stencil/core';

import { newSpecPage } from '@stencil/core/testing';
import { PosMarkdownDocument } from './pos-markdown-document';
import { when } from 'jest-when';

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

  describe('Images', () => {
    it('renders images as pos-image relative to the document url', async () => {
      const fileContent = `![Alt text](image.jpg)`;
      const file = {
        url: 'https://pod.test/document/readme.md',
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
          <p>
            <pos-image src="https://pod.test/document/image.jpg" alt="Alt text">
          </p>
        </article>
      </pos-markdown-document>
    `);
    });

    it('renders image with absolute URL and a title', async () => {
      const fileContent = `![Alt text](https://pod.test/image.jpg "Image Title")`;
      const file = {
        url: 'https://pod.test/document/readme.md',
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
          <p>
            <pos-image src="https://pod.test/image.jpg" alt="Alt text" title="Image Title">
          </p>
        </article>
      </pos-markdown-document>
    `);
    });
  });

  describe('Links', () => {
    it('renders relative links as pos-rich-link relative to the document url', async () => {
      const fileContent = `[Other file](file.md)`;
      const file = {
        url: 'https://pod.test/document/readme.md',
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
          <p>
            <pos-rich-link uri="https://pod.test/document/file.md">
              Other file
            </pos-rich-link>
          </p>
        </article>
      </pos-markdown-document>
    `);
    });

    it('renders absolute links as pos-rich-link', async () => {
      const fileContent = `[Other file](https://other-pod.test/document/file.md)`;
      const file = {
        url: 'https://pod.test/document/readme.md',
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
          <p>
            <pos-rich-link uri="https://other-pod.test/document/file.md">
              Other file
            </pos-rich-link>
          </p>
        </article>
      </pos-markdown-document>
    `);
    });
  });

  it('sanitizes markdown', async () => {
    const sanitizeSpy = jest.spyOn(require('./sanitize'), 'sanitize');
    const maliciousCode = `<div>malicious code</div>`;

    when(sanitizeSpy).calledWith(maliciousCode).mockReturnValue({ value: 'sanitized code' });
    const file = {
      blob: () => ({
        text: () => {
          return Promise.resolve(maliciousCode);
        },
      }),
    };
    const page = await newSpecPage({
      components: [PosMarkdownDocument],
      template: () => <pos-markdown-document file={file} />,
      supportsShadowDom: false,
    });

    expect(sanitizeSpy).toHaveBeenCalledWith('<div>malicious code</div>');
    expect(page.root).toEqualHtml(`
    <pos-markdown-document>
      <article>
        sanitized code
      </article>
    </pos-markdown-document>
  `);
  });
});
