jest.mock('../broken-file/BrokenFile');

// noinspection ES6UnusedImports
import { h } from '@stencil/core';

import { Components } from '../../components';
import { BinaryFile, BrokenFile as BrokenFileData } from '@pod-os/core';
import { newSpecPage } from '@stencil/core/testing';
import { Blob } from 'buffer';
import { mockPodOS } from '../../test/mockPodOS';
import { mockSessionStore } from '../../test/mockSessionStore';
import { BrokenFile } from '../broken-file/BrokenFile';
import { PosDocument } from './pos-document';

import { when } from 'jest-when';

import session from '../../store/session';

describe('pos-document', () => {
  let pdfBlob;
  beforeEach(() => {
    pdfBlob = new Blob(['1'], {
      type: 'application/pdf',
    });
  });

  beforeEach(() => {
    jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake-pdf-data');
  });

  it('renders loading indicator initially', async () => {
    const page = await newSpecPage({
      components: [PosDocument],
      html: `<pos-document src="https://pod.test/test.pdf" />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-document src="https://pod.test/test.pdf">
        <mock:shadow-root>
          <ion-skeleton-text animated=""></ion-skeleton-text>
        </mock:shadow-root>
      </pos-document>
  `);
  });

  it('renders loading indicator while fetching', async () => {
    const page = await newSpecPage({
      components: [PosDocument],
      html: `<pos-document src="https://pod.test/test.pdf" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile)
      .calledWith('https://pod.test/test.pdf')
      .mockReturnValue(new Promise(() => null));
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-document src="https://pod.test/test.pdf">
        <mock:shadow-root>
          <ion-skeleton-text animated=""></ion-skeleton-text>
        </mock:shadow-root>
      </pos-document>
  `);
  });

  it('renders iframe after loading', async () => {
    const file = mockBinaryFile(pdfBlob);
    const page = await newSpecPage({
      components: [PosDocument],
      html: `<pos-document src="https://pod.test/test.pdf" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/test.pdf').mockResolvedValue(file);
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(URL.createObjectURL).toHaveBeenCalledWith(pdfBlob);
    expect(page.root).toEqualHtml(`
      <pos-document src="https://pod.test/test.pdf">
        <mock:shadow-root>
          <iframe src="blob:fake-pdf-data"></iframe>
        </mock:shadow-root>
      </pos-document>
  `);
  });

  it('renders editable pos-markdown-document for editable markdown files', async () => {
    const markdownBlob = new Blob(['# Test'], {
      type: 'text/markdown',
    });
    const file = mockBinaryFile(markdownBlob);
    const page = await newSpecPage({
      components: [PosDocument],
      html: `<pos-document src="https://pod.test/test.md" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/test.md').mockResolvedValue(file);
    when(os.store.get).calledWith('https://pod.test/test.md').mockReturnValue({ editable: true });
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-document src="https://pod.test/test.md">
        <mock:shadow-root>
          <pos-markdown-document editable></pos-markdown-document>
        </mock:shadow-root>
      </pos-document>
  `);
    const markdownDocument: Components.PosMarkdownDocument =
      page.root.shadowRoot.querySelector('pos-markdown-document');
    expect(markdownDocument.file).toBe(file);
  });

  it('renders read-only pos-markdown-document for non-editable markdown files', async () => {
    const markdownBlob = new Blob(['# Test'], {
      type: 'text/markdown',
    });
    const file = mockBinaryFile(markdownBlob);
    const page = await newSpecPage({
      components: [PosDocument],
      html: `<pos-document src="https://pod.test/test.md" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/test.md').mockResolvedValue(file);
    when(os.store.get).calledWith('https://pod.test/test.md').mockReturnValue({ editable: false });
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-document src="https://pod.test/test.md">
        <mock:shadow-root>
          <pos-markdown-document></pos-markdown-document>
        </mock:shadow-root>
      </pos-document>
  `);
    const markdownDocument: Components.PosMarkdownDocument =
      page.root.shadowRoot.querySelector('pos-markdown-document');
    expect(markdownDocument.file).toBe(file);
  });

  it('emits event after loading', async () => {
    const onResourceLoaded = jest.fn();
    const file = mockBinaryFile(pdfBlob);
    const page = await newSpecPage({
      components: [PosDocument],
      html: `<pos-document src="https://pod.test/test.pdf" />`,
    });
    page.root.addEventListener('pod-os:resource-loaded', onResourceLoaded);
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/test.pdf').mockResolvedValue(file);
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(onResourceLoaded).toHaveBeenCalled();
    expect(onResourceLoaded.mock.calls[0][0].detail).toEqual('https://pod.test/test.pdf');
  });

  it('renders error when fetch failed', async () => {
    const page = await newSpecPage({
      components: [PosDocument],
      html: `<pos-document src="https://pod.test/test.pdf" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/test.pdf').mockRejectedValue(new Error('network error'));
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-document src="https://pod.test/test.pdf">
        <mock:shadow-root>
          <div class="error">
            network error
          </div>
        </mock:shadow-root>
      </pos-document>
  `);
  });

  it('renders error for inaccessible file', async () => {
    const brokenImage = {
      blob: () => null,
      toString: () => '403 - Forbidden - https://pod.test/test.pdf',
    } as unknown as BrokenFileData;
    when(BrokenFile).mockReturnValue(<div class="error">403 - Forbidden - https://pod.test/test.pdf</div>);
    const page = await newSpecPage({
      components: [PosDocument],
      html: `<pos-document src="https://pod.test/test.pdf" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/test.pdf').mockResolvedValue(brokenImage);
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-document src="https://pod.test/test.pdf">
        <mock:shadow-root>
          <div class="error">
            403 - Forbidden - https://pod.test/test.pdf
          </div>
        </mock:shadow-root>
      </pos-document>
  `);
  });

  it('updates and loads resource when src changes', async () => {
    const file = mockBinaryFile(pdfBlob);
    const page = await newSpecPage({
      components: [PosDocument],
      html: `<pos-document src="https://pod.test/test.pdf" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/test.pdf').mockResolvedValue(file);
    when(os.files().fetchFile)
      .calledWith('https://pod.test/other.png')
      .mockReturnValue(new Promise(() => null));
    await page.rootInstance.setOs(os);
    page.root.setAttribute('src', 'https://pod.test/other.png');
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-document src="https://pod.test/other.png">
        <mock:shadow-root>
          <ion-skeleton-text animated=""></ion-skeleton-text>
        </mock:shadow-root>
      </pos-document>
  `);
  });

  it('re-fetches resource when session state changes', async () => {
    const file = mockBinaryFile(pdfBlob);
    const session = mockSessionStore();

    const page = await newSpecPage({
      components: [PosDocument],
      html: `<pos-document src="https://pod.test/test.pdf" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/test.pdf').mockResolvedValueOnce(file);
    when(os.files().fetchFile)
      .calledWith('https://pod.test/test.pdf')
      .mockReturnValueOnce(new Promise(() => null));
    await page.rootInstance.setOs(os);
    expect(session.sessionChanged).toBeDefined();
    session.sessionChanged();
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-document src="https://pod.test/test.pdf">
        <mock:shadow-root>
          <ion-skeleton-text animated=""></ion-skeleton-text>
        </mock:shadow-root>
      </pos-document>
  `);
  });

  it('removes error message after successful loading', async () => {
    const file = mockBinaryFile(pdfBlob);
    const unauthorizedFile = {
      toString: () => 'Unauthorized',
    } as BrokenFileData;
    let sessionChanged;
    // @ts-ignore
    session.onChange = (prop, callback) => {
      if (prop === 'isLoggedIn') {
        sessionChanged = callback;
      }
    };
    const page = await newSpecPage({
      components: [PosDocument],
      html: `<pos-document src="https://pod.test/test.pdf" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/test.pdf').mockResolvedValueOnce(unauthorizedFile);
    when(os.files().fetchFile).calledWith('https://pod.test/test.pdf').mockResolvedValueOnce(file);
    await page.rootInstance.setOs(os);
    expect(sessionChanged).toBeDefined();
    sessionChanged();
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-document src="https://pod.test/test.pdf">
        <mock:shadow-root>
          <iframe src="blob:fake-pdf-data"></iframe>
        </mock:shadow-root>
      </pos-document>
  `);
  });

  describe('saving modified documents', () => {
    it('calls os.files().putFile on pod-os:document-modified event', async () => {
      // given a file
      const file = mockBinaryFile(
        new Blob(['# Test'], {
          type: 'text/markdown',
        }),
      );

      // and a page with a pos-document
      const page = await newSpecPage({
        components: [PosDocument],
        html: `<pos-document src="https://pod.test/test.md" />`,
      });

      // and PodOS can put the file successfully
      const os = mockPodOS();
      when(os.files().putFile)
        .calledWith('https://pod.test/test.md', file)
        .mockResolvedValue(new Response(null, { status: 200 }));
      await page.rootInstance.setOs(os);

      // when the file was modified with new content
      page.root.dispatchEvent(
        new CustomEvent('pod-os:document-modified', { detail: { file, newContent: 'new content' } }),
      );

      // then the new content is put to the original file
      expect(os.files().putFile).toHaveBeenCalledWith(file, 'new content');
    });
  });
});

function mockBinaryFile(pngBlob) {
  return {
    blob: () => pngBlob,
  } as BinaryFile;
}
