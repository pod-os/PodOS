// noinspection ES6UnusedImports
import { h } from '@stencil/core';

jest.mock('./shoelace', () => ({}));

jest.mock('./rich-editor', () => ({
  RichEditor: jest.fn(function () {
    this.onUpdate = () => {};
    this.startEditing = () => {};
    this.isModified = () => false;
  }),
}));

import { newSpecPage } from '@stencil/core/testing';
import { PosMarkdownDocument } from './pos-markdown-document';

import { when } from 'jest-when';

describe('pos-markdown-document', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('parses and renders the markdown document', async () => {
    const fileContent = `## Test

This is a test document`;
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

    expectEditor(
      'https://pod.test/document/readme.md',
      `<h2>Test</h2>
<p>This is a test document</p>
`,
    );

    expect(page.root).toEqualHtml(`
      <pos-markdown-document>
        <article><div></div></article>
      </pos-markdown-document>
    `);
  });

  describe('Images', () => {
    it('renders images with relative URL', async () => {
      const fileContent = `![Alt text](image.jpg)`;
      const file = {
        url: 'https://pod.test/document/readme.md',
        blob: () => ({
          text: () => {
            return Promise.resolve(fileContent);
          },
        }),
      };

      await newSpecPage({
        components: [PosMarkdownDocument],
        template: () => <pos-markdown-document file={file} />,
        supportsShadowDom: false,
      });

      expectEditor(
        'https://pod.test/document/readme.md',
        `<p><img src="image.jpg" alt="Alt text"></p>
`,
      );
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

      expectEditor(
        'https://pod.test/document/readme.md',
        '<p><img src="https://pod.test/image.jpg" alt="Alt text" title="Image Title"></p>\n',
      );
    });
  });

  describe('Links', () => {
    it('renders relative links', async () => {
      const fileContent = `[Other file](file.md)`;
      const file = {
        url: 'https://pod.test/document/readme.md',
        blob: () => ({
          text: () => {
            return Promise.resolve(fileContent);
          },
        }),
      };
      await newSpecPage({
        components: [PosMarkdownDocument],
        template: () => <pos-markdown-document file={file} />,
        supportsShadowDom: false,
      });
      expectEditor('https://pod.test/document/readme.md', '<p><a href="file.md">Other file</a></p>\n');
    });

    it('renders absolute links', async () => {
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

      expectEditor(
        'https://pod.test/document/readme.md',
        '<p><a href="https://other-pod.test/document/file.md">Other file</a></p>\n',
      );
    });
  });

  it('sanitizes markdown', async () => {
    const sanitizeSpy = jest.spyOn(require('./sanitize'), 'sanitize');
    const maliciousCode = `<div>malicious code</div>`;

    when(sanitizeSpy).calledWith(maliciousCode).mockReturnValue({ value: 'sanitized code' });
    const file = {
      url: 'https://pod.test/document/readme.md',
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

    expectEditor('https://pod.test/document/readme.md', 'sanitized code');

    expect(sanitizeSpy).toHaveBeenCalledWith('<div>malicious code</div>');
  });

  describe('modification status', () => {
    it('shows that all changes have been saved', async () => {
      const file = mockFile();
      const page = await newSpecPage({
        components: [PosMarkdownDocument],
        template: () => <pos-markdown-document file={file} />,
        supportsShadowDom: false,
      });

      page.rootInstance.startEditing();
      await page.waitForChanges();

      expect(page.root.querySelector('footer')).toEqualHtml(`
      <footer>
        <span class="status">
          <sl-icon name="check2-circle"></sl-icon>
          all saved
        </span>
      </footer>
    `);
    });

    it('shows pending changes, if editor has been modified', async () => {
      const file = mockFile();
      const page = await newSpecPage({
        components: [PosMarkdownDocument],
        template: () => <pos-markdown-document file={file} />,
        supportsShadowDom: false,
      });

      page.rootInstance.startEditing();
      page.rootInstance.isModified = true;
      await page.waitForChanges();

      expect(page.root.querySelector('footer')).toEqualHtml(`
      <footer>
        <span class="status">
          <sl-icon name="clock-history"></sl-icon>
          pending changes
        </span>
      </footer>
    `);
    });
  });
});

function expectEditor(expectedBaseUrl: string, expectedContent: string) {
  const { RichEditor } = require('./rich-editor');
  const [_, content, baseUrl] = RichEditor.mock.calls[0];
  expect(RichEditor).toHaveBeenCalled();
  expect(content).toEqual({
    value: expectedContent,
  });
  expect(baseUrl).toEqual(expectedBaseUrl);
}

function mockFile(content: string = 'any content', url: string = 'https://pod.test/document/readme.md') {
  const file = {
    url,
    blob: () => ({
      text: () => {
        return Promise.resolve(content);
      },
    }),
  };
  return file;
}
