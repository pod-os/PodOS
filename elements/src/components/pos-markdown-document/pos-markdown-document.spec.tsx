// noinspection ES6UnusedImports
import { h } from '@stencil/core';

jest.mock('./shoelace', () => ({}));

jest.mock('./rich-editor', () => ({
  RichEditor: jest.fn(function () {
    this.onUpdate = jest.fn();
    this.startEditing = jest.fn();
    this.stopEditing = jest.fn();
    this.observeChanges = jest.fn(() => EMPTY);
    this.isModified = jest.fn(() => false);
  }),
}));

import { newSpecPage } from '@stencil/core/testing';
import { PosMarkdownDocument } from './pos-markdown-document';

import { getByRole } from '@testing-library/dom';
import { EMPTY, of, Subject } from 'rxjs';

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
      `## Test

This is a test document`,
    );

    expect(page.root).toEqualHtml(`
      <pos-markdown-document>
        <article>
          <div class="content"></div>
        </article>
      </pos-markdown-document>
    `);
  });

  describe('edit / view buttons for editable documents', () => {
    it('shows an edit button in the header', async () => {
      const file = mockFile();
      const page = await newSpecPage({
        components: [PosMarkdownDocument],
        template: () => <pos-markdown-document editable file={file} />,
        supportsShadowDom: false,
      });

      await page.waitForChanges();

      expect(page.root.querySelector('article header')).toEqualHtml(`
        <header>
          <button><sl-icon name="pencil-square"></sl-icon>Edit</button>
        </header>
    `);
    });

    it('edit button is replaced with view button after editing started', async () => {
      const file = mockFile();
      const page = await newSpecPage({
        components: [PosMarkdownDocument],
        template: () => <pos-markdown-document editable file={file} />,
        supportsShadowDom: false,
      });

      const editButton = getByRole(page.root, 'button');
      expect(editButton.textContent).toEqual('Edit');
      editButton.click();
      await page.waitForChanges();

      expect(page.root.querySelector('article header button')).toEqualHtml(`
          <button>
            <sl-icon name="eye"></sl-icon>
            View
          </button>
    `);
    });

    it('switches back to view mode via view button', async () => {
      const file = mockFile();
      const page = await newSpecPage({
        components: [PosMarkdownDocument],
        template: () => <pos-markdown-document editable file={file} />,
        supportsShadowDom: false,
      });

      page.rootInstance.startEditing();
      await page.waitForChanges();

      const viewButton = getByRole(page.root, 'button');
      expect(viewButton.textContent).toEqual('View');
      viewButton.click();
      await page.waitForChanges();

      expect(page.root.querySelector('article header')).toEqualHtml(`
        <header>
          <button>
            <sl-icon name="pencil-square"></sl-icon>
            Edit
          </button>
        </header>
    `);
    });

    it('calls startEditing method when edit button is clicked', async () => {
      const file = mockFile();
      const page = await newSpecPage({
        components: [PosMarkdownDocument],
        template: () => <pos-markdown-document editable file={file} />,
        supportsShadowDom: false,
      });

      const editButton = getByRole(page.root, 'button');
      expect(editButton.textContent).toEqual('Edit');
      editButton.click();
      await page.waitForChanges();

      const { RichEditor } = require('./rich-editor');
      const editorInstance = RichEditor.mock.instances[0];
      expect(editorInstance.startEditing).toHaveBeenCalled();
    });

    it('calls stopEditing method when view button is clicked', async () => {
      const file = mockFile();
      const page = await newSpecPage({
        components: [PosMarkdownDocument],
        template: () => <pos-markdown-document editable file={file} />,
        supportsShadowDom: false,
      });

      page.rootInstance.startEditing();
      await page.waitForChanges();

      const viewButton = getByRole(page.root, 'button');
      expect(viewButton.textContent).toEqual('View');
      viewButton.click();
      await page.waitForChanges();

      const { RichEditor } = require('./rich-editor');
      const editorInstance = RichEditor.mock.instances[0];
      expect(editorInstance.stopEditing).toHaveBeenCalled();
    });
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

      expectEditor('https://pod.test/document/readme.md', `![Alt text](image.jpg)`);
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
      await newSpecPage({
        components: [PosMarkdownDocument],
        template: () => <pos-markdown-document file={file} />,
        supportsShadowDom: false,
      });

      expectEditor('https://pod.test/document/readme.md', '![Alt text](https://pod.test/image.jpg "Image Title")');
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
      expectEditor('https://pod.test/document/readme.md', '[Other file](file.md)');
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

      expectEditor('https://pod.test/document/readme.md', '[Other file](https://other-pod.test/document/file.md)');
    });
  });

  describe('modification status', () => {
    it('shows that all changes have been saved', async () => {
      const file = mockFile();
      const page = await newSpecPage({
        components: [PosMarkdownDocument],
        template: () => <pos-markdown-document editable file={file} />,
        supportsShadowDom: false,
      });

      page.rootInstance.startEditing();
      await page.waitForChanges();

      expect(page.root.querySelector('header .status')).toEqualHtml(`
        <span class="status success" role="status" aria-live="polite" aria-labelledby="status-message">
          <sl-icon name="check2-circle" aria-hidden="true"></sl-icon>
          <span id="status-message">all saved</span>
        </span>
    `);
    });

    it('shows that saving the changes failed', async () => {
      const file = mockFile();
      const page = await newSpecPage({
        components: [PosMarkdownDocument],
        template: () => <pos-markdown-document saveStatus="failed" editable file={file} />,
        supportsShadowDom: false,
      });

      page.rootInstance.startEditing();
      await page.waitForChanges();

      expect(page.root.querySelector('header .status')).toEqualHtml(`
        <span class="error status" role="status" aria-live="polite" aria-labelledby="status-message">
          <sl-icon name="x-octagon" aria-hidden="true"></sl-icon>
          <span id="status-message">saving failed</span>
        </span>
    `);
    });

    it('shows pending changes, if editor has been modified', async () => {
      const file = mockFile();
      const page = await newSpecPage({
        components: [PosMarkdownDocument],
        template: () => <pos-markdown-document editable file={file} />,
        supportsShadowDom: false,
      });

      page.rootInstance.startEditing();
      page.rootInstance.isModified = true;
      await page.waitForChanges();

      expect(page.root.querySelector('header .status')).toEqualHtml(`
        <span class="status pending" role="status" aria-live="polite" aria-labelledby="status-message">
          <sl-icon name="clock-history" aria-hidden="true"></sl-icon>
          <span id="status-message">pending changes</span>
        </span>
    `);
    });

    it('shows pending changes, if editor has been modified even if last saving failed', async () => {
      const file = mockFile();
      const page = await newSpecPage({
        components: [PosMarkdownDocument],
        template: () => <pos-markdown-document savingFailed editable file={file} />,
        supportsShadowDom: false,
      });

      page.rootInstance.startEditing();
      page.rootInstance.isModified = true;
      await page.waitForChanges();

      expect(page.root.querySelector('header .status')).toEqualHtml(`
        <span class="status pending" role="status" aria-live="polite" aria-labelledby="status-message">
          <sl-icon name="clock-history" aria-hidden="true"></sl-icon>
          <span id="status-message">pending changes</span>
        </span>
    `);
    });
  });

  describe('document modified', () => {
    it('emits pod-os:document-modified event with markdown content when changes are observed', async () => {
      const file = mockFile();
      const onDocumentModified = jest.fn();

      const { RichEditor } = require('./rich-editor');
      RichEditor.mockImplementation(function () {
        this.onUpdate = jest.fn();
        this.observeChanges = jest.fn(() => of({ content: 'changed markdown content' }));
      });

      await newSpecPage({
        components: [PosMarkdownDocument],
        template: () => <pos-markdown-document editable onPod-os:document-modified={onDocumentModified} file={file} />,
        supportsShadowDom: false,
      });

      expect(onDocumentModified).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { file, newContent: 'changed markdown content' } }),
      );
    });

    it('resets modification status after changes have been processed', async () => {
      // given an editor communicating changes
      const file = mockFile();
      const changes = new Subject();
      const { RichEditor } = require('./rich-editor');
      RichEditor.mockImplementation(function () {
        this.onUpdate = jest.fn();
        this.observeChanges = jest.fn(() => changes);
      });

      // and a page with pos-markdown-document
      const page = await newSpecPage({
        components: [PosMarkdownDocument],
        template: () => <pos-markdown-document editable file={file} />,
        supportsShadowDom: false,
      });

      // and the document has currently been modified
      page.rootInstance.isModified = true;
      expect(page.rootInstance.isModified).toBe(true);

      // when the editor communicates the changes
      changes.next({ content: 'changed content' });

      // then the document is no longer modified (compared to what has been communicated already)
      expect(page.rootInstance.isModified).toBe(false);
    });
  });
});

function expectEditor(expectedBaseUrl: string, expectedContent: string) {
  const { RichEditor } = require('./rich-editor');
  const [_, content, baseUrl] = RichEditor.mock.calls[0];
  expect(RichEditor).toHaveBeenCalled();
  expect(content).toEqual(expectedContent);
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
