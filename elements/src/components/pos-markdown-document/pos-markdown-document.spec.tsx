import { Mock, vi } from 'vitest';
import { afterEach, describe, expect, h, it, render } from '@stencil/vitest';

// @ts-ignore
import { RichEditor } from './rich-editor';
import './pos-markdown-document';
import { EMPTY, of, Subject } from 'rxjs';
import { withinShadow } from '../../test/withinShadow';
import { SolidFile } from '@pod-os/core';

vi.mock('./shoelace', () => ({}));

vi.mock('./rich-editor', () => ({
  RichEditor: vi.fn(
    class {
      onUpdate = vi.fn();
      startEditing = vi.fn();
      stopEditing = vi.fn();
      observeChanges = vi.fn(() => EMPTY);
      isModified = vi.fn(() => false);
    },
  ),
}));

describe('pos-markdown-document', () => {
  afterEach(() => {
    vi.clearAllMocks();
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
    } as SolidFile;
    const page = await render(<pos-markdown-document file={file}></pos-markdown-document>);

    expectEditor(
      'https://pod.test/document/readme.md',
      `## Test

This is a test document`,
    );

    expect(page.root.shadowRoot).toEqualHtml(`
        <article>
          <div class="content"></div>
        </article>
    `);
  });

  describe('edit / view buttons for editable documents', () => {
    it('shows an edit button in the header', async () => {
      const file = mockFile();
      const page = await render(<pos-markdown-document editable file={file}></pos-markdown-document>);

      await page.waitForChanges();

      expect(page.root.shadowRoot!.querySelector('article header')).toEqualHtml(`
      <header>
        <button>
          <sl-icon name="pencil-square"></sl-icon>
          Edit
        </button>
      </header>
    `);
    });

    it('edit button is replaced with view button after editing started', async () => {
      const file = mockFile();
      const page = await render(<pos-markdown-document editable file={file}></pos-markdown-document>);

      const editButton = withinShadow(page).getByRole('button');
      expect(editButton.textContent).toEqual('Edit');
      editButton.click();
      await page.waitForChanges();

      expect(page.root.shadowRoot!.querySelector('article header button')).toEqualHtml(`
          <button>
            <sl-icon name="eye"></sl-icon>
            View
          </button>
    `);
    });

    it('switches back to view mode via view button', async () => {
      const file = mockFile();
      const page = await render(<pos-markdown-document editable file={file}></pos-markdown-document>);

      page.instance.startEditing();
      await page.waitForChanges();

      const viewButton = withinShadow(page).getByRole('button');
      expect(viewButton.textContent).toEqual('View');
      viewButton.click();
      await page.waitForChanges();

      expect(page.root.shadowRoot!.querySelector('article header')).toEqualHtml(`
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
      const page = await render(<pos-markdown-document editable file={file}></pos-markdown-document>);

      const editButton = withinShadow(page).getByRole('button');
      expect(editButton.textContent).toEqual('Edit');
      editButton.click();
      await page.waitForChanges();

      const editorInstance = (RichEditor as Mock).mock.instances[0] as RichEditor;
      expect(editorInstance.startEditing).toHaveBeenCalled();
    });

    it('calls stopEditing method when view button is clicked', async () => {
      const file = mockFile();
      const page = await render(<pos-markdown-document editable file={file}></pos-markdown-document>);

      page.instance.startEditing();
      await page.waitForChanges();

      const viewButton = withinShadow(page).getByRole('button');
      expect(viewButton.textContent).toEqual('View');
      viewButton.click();
      await page.waitForChanges();

      const editorInstance = (RichEditor as Mock).mock.instances[0] as RichEditor;
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
      } as SolidFile;

      await render(<pos-markdown-document file={file}></pos-markdown-document>);

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
      } as SolidFile;
      await render(<pos-markdown-document file={file}></pos-markdown-document>);

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
      } as SolidFile;
      await render(<pos-markdown-document file={file}></pos-markdown-document>);
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
      } as SolidFile;
      await render(<pos-markdown-document file={file}></pos-markdown-document>);

      expectEditor('https://pod.test/document/readme.md', '[Other file](https://other-pod.test/document/file.md)');
    });
  });

  describe('modification status', () => {
    it('shows that all changes have been saved', async () => {
      const file = mockFile();
      const page = await render(<pos-markdown-document editable file={file}></pos-markdown-document>);

      page.instance.startEditing();
      await page.waitForChanges();

      expect(page.root.shadowRoot!.querySelector('header .status')).toMatchInlineSnapshot(`
        <span
          aria-labelledby="status-message"
          aria-live="polite"
          class="status success"
          role="status"
        >
          <sl-icon name="check2-circle" aria-hidden="true"></sl-icon>
          <span
            id="status-message"
          >
            all saved
          </span>
        </span>
      `);
    });

    it('shows that saving the changes failed', async () => {
      const file = mockFile();
      const page = await render(
        <pos-markdown-document saveStatus="failed" editable file={file}></pos-markdown-document>,
      );

      page.instance.startEditing();
      await page.waitForChanges();

      expect(page.root.shadowRoot!.querySelector('header .status')).toMatchInlineSnapshot(`
        <span
          aria-labelledby="status-message"
          aria-live="polite"
          class="status error"
          role="status"
        >
          <sl-icon name="x-octagon" aria-hidden="true"></sl-icon>
          <span
            id="status-message"
          >
            saving failed
          </span>
        </span>
      `);
    });

    it('shows that a save is in progress', async () => {
      const file = mockFile();
      const page = await render(
        <pos-markdown-document saveStatus="saving" editable file={file}></pos-markdown-document>,
      );

      page.instance.startEditing();
      await page.waitForChanges();

      expect(page.root.shadowRoot!.querySelector('header .status')).toMatchInlineSnapshot(`
        <span
          aria-labelledby="status-message"
          aria-live="polite"
          class="status saving"
          role="status"
        >
          <sl-icon name="cloud-upload" aria-hidden="true"></sl-icon>
          <span
            id="status-message"
          >
            saving changes
          </span>
        </span>
      `);
    });

    it('shows pending changes, if editor has been modified', async () => {
      const file = mockFile();
      const page = await render(<pos-markdown-document editable file={file}></pos-markdown-document>);

      page.instance.startEditing();
      page.instance.isModified = true;
      await page.waitForChanges();

      expect(page.root.shadowRoot!.querySelector('header .status')).toMatchInlineSnapshot(`
        <span
          aria-labelledby="status-message"
          aria-live="polite"
          class="status pending"
          role="status"
        >
          <sl-icon name="clock-history" aria-hidden="true"></sl-icon>
          <span
            id="status-message"
          >
            pending changes
          </span>
        </span>
      `);
    });

    it('shows pending changes, if editor has been modified even if last saving failed', async () => {
      const file = mockFile();
      const page = await render(
        <pos-markdown-document saveStatus="failed" editable file={file}></pos-markdown-document>,
      );

      page.instance.startEditing();
      page.instance.isModified = true;
      await page.waitForChanges();

      expect(page.root.shadowRoot!.querySelector('header .status')).toMatchInlineSnapshot(`
        <span
          aria-labelledby="status-message"
          aria-live="polite"
          class="status pending"
          role="status"
        >
          <sl-icon name="clock-history" aria-hidden="true"></sl-icon>
          <span
            id="status-message"
          >
            pending changes
          </span>
        </span>
      `);
    });
  });

  describe('document modified', () => {
    it('emits pod-os:document-modified event with markdown content when changes are observed', async () => {
      const file = mockFile();
      const onDocumentModified = vi.fn();

      (RichEditor as Mock).mockImplementation(
        // @ts-ignore
        class {
          onUpdate = vi.fn();
          observeChanges = vi.fn(() => of({ content: 'changed markdown content' }));
        },
      );

      await render(
        <pos-markdown-document
          editable
          onPod-os:document-modified={onDocumentModified}
          file={file}
        ></pos-markdown-document>,
      );

      expect(onDocumentModified).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { file, newContent: 'changed markdown content' } }),
      );
    });

    it('resets modification status after changes have been processed', async () => {
      // given an editor communicating changes
      const file = mockFile();
      const changes = new Subject();
      (RichEditor as Mock).mockImplementation(
        // @ts-ignore
        class {
          onUpdate = vi.fn();
          observeChanges = vi.fn(() => changes);
        },
      );

      // and a page with pos-markdown-document
      const page = await render(<pos-markdown-document editable file={file}></pos-markdown-document>);

      // and the document has currently been modified
      page.instance.isModified = true;
      expect(page.instance.isModified).toBe(true);

      // when the editor communicates the changes
      changes.next({ content: 'changed content' });

      // then the document is no longer modified (compared to what has been communicated already)
      expect(page.instance.isModified).toBe(false);
    });
  });
});

async function expectEditor(expectedBaseUrl: string, expectedContent: string) {
  expect(RichEditor).toHaveBeenCalled();
  const [_, content, baseUrl] = (RichEditor as Mock).mock.calls[0];
  expect(content).toEqual(expectedContent);
  expect(baseUrl).toEqual(expectedBaseUrl);
}

function mockFile(content: string = 'any content', url: string = 'https://pod.test/document/readme.md'): SolidFile {
  const file = {
    url,
    blob: () => ({
      text: () => {
        return Promise.resolve(content);
      },
    }),
  } as SolidFile;
  return file;
}
