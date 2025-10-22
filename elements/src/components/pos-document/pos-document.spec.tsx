import { waitFor } from '@testing-library/dom';

jest.mock('../broken-file/BrokenFile');

// noinspection ES6UnusedImports
import { h } from '@stencil/core';

import { Components } from '../../components';
import { BinaryFile, BrokenFile as BrokenFileData, PodOS, Thing } from '@pod-os/core';
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
    when(os.store.get)
      .calledWith('https://pod.test/test.md')
      .mockReturnValue({ editable: true } as unknown as Thing);
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-document src="https://pod.test/test.md">
        <mock:shadow-root>
          <pos-markdown-document editable saveStatus="idle"></pos-markdown-document>
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
    when(os.store.get)
      .calledWith('https://pod.test/test.md')
      .mockReturnValue({ editable: false } as unknown as Thing);
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-document src="https://pod.test/test.md">
        <mock:shadow-root>
          <pos-markdown-document saveStatus="idle"></pos-markdown-document>
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
        .calledWith(file, 'new content')
        .mockResolvedValue(new Response(null, { status: 200 }));
      await page.rootInstance.setOs(os);

      // when the file was modified with new content
      page.root.dispatchEvent(
        new CustomEvent('pod-os:document-modified', { detail: { file, newContent: 'new content' } }),
      );

      // then the new content is put to the original file
      expect(os.files().putFile).toHaveBeenCalledWith(file, 'new content');
    });

    it('shows saving status while save is in progress', async () => {
      // given a file
      const markdownBlob = new Blob(['# Test'], {
        type: 'text/markdown',
      });
      const file = mockBinaryFile(markdownBlob);

      // and a page with a pos-document
      const page = await newSpecPage({
        components: [PosDocument],
        html: `<pos-document src="https://pod.test/test.md" />`,
      });

      // and PodOS can put the file successfully
      const os = mockPodOS();
      when(os.files().fetchFile).calledWith('https://pod.test/test.md').mockResolvedValue(file);
      when(os.store.get)
        .calledWith('https://pod.test/test.md')
        .mockReturnValue({ editable: true } as unknown as Thing);
      await page.rootInstance.setOs(os);
      await page.waitForChanges();

      // and the saveStatus is idle initially
      const markdownDocInitial = page.root.shadowRoot.querySelector('pos-markdown-document');
      expect(markdownDocInitial).toEqualAttribute('saveStatus', 'idle');

      // when a save operation is triggered but hasn't resolved yet
      let resolvePut;
      const putPromise = new Promise<Response>(resolve => {
        resolvePut = () => resolve({ ok: true } as Response);
      });
      when(os.files().putFile).calledWith(file, 'modified content').mockReturnValue(putPromise);

      page.root.dispatchEvent(
        new CustomEvent('pod-os:document-modified', { detail: { file, newContent: 'modified content' } }),
      );
      await page.waitForChanges(); // wait for event processing

      // then the saveStatus is "saving"
      const markdownDocSaving = page.root.shadowRoot.querySelector('pos-markdown-document');
      expect(markdownDocSaving).toEqualAttribute('saveStatus', 'saving');

      // when the save operation completes successfully
      resolvePut();
      await page.waitForChanges(); // wait for put to resolve
      await page.waitForChanges(); // wait for rerender

      // then the saveStatus returns to idle
      const markdownDocCompleted = page.root.shadowRoot.querySelector('pos-markdown-document');
      expect(markdownDocCompleted).toEqualAttribute('saveStatus', 'idle');
    });

    describe('errors during save', () => {
      let os: PodOS;
      let page;
      let file: BinaryFile;
      let errorSpy: jest.Mock;
      beforeEach(async () => {
        // Given a markdown file
        const markdownBlob = new Blob(['# Test'], {
          type: 'text/markdown',
        });
        file = mockBinaryFile(markdownBlob);
        page = await newSpecPage({
          components: [PosDocument],
          html: `<pos-document src="https://pod.test/test.md" />`,
        });

        // and the file can be fetched initially
        os = mockPodOS();
        when(os.files().fetchFile).calledWith('https://pod.test/test.md').mockResolvedValue(file);
        when(os.store.get)
          .calledWith('https://pod.test/test.md')
          .mockReturnValue({ editable: true } as unknown as Thing);
        await page.rootInstance.setOs(os);
        await page.waitForChanges();

        // and the page listens to pod-os:error events
        errorSpy = jest.fn();
        page.root.addEventListener('pod-os:error', errorSpy);

        // and the pos-markdown-component shows up
        expect(page.root).toEqualHtml(`
          <pos-document src="https://pod.test/test.md">
            <mock:shadow-root>
              <pos-markdown-document editable saveStatus="idle"></pos-markdown-document>
          </pos-document>
      `);
      });

      it('emits pod-os:error when putFile responds with non-ok http status', async () => {
        // but PodOS will fail to put the file responding with non-ok http status
        const error = { status: 401, statusText: 'Unauthorized', ok: false } as Response;
        when(os.files().putFile).calledWith(file, 'new content').mockResolvedValue(error);

        // when the file was modified with new content
        page.root.dispatchEvent(
          new CustomEvent('pod-os:document-modified', { detail: { file, newContent: 'new content' } }),
        );

        // then the new content is put to the original file
        expect(os.files().putFile).toHaveBeenCalledWith(file, 'new content');

        await page.waitForChanges();

        // and a pod-os:error event is emitted
        expect(errorSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: new Error(`Failed to save file: 401 Unauthorized`),
          }),
        );
      });

      it('emits pod-os:error when putFile responds with exception', async () => {
        // but PodOS will fail to put the file, throwing an error
        when(os.files().putFile)
          .calledWith(file, 'new content')
          .mockImplementation(() => {
            throw new Error('Network error');
          });

        // when the file was modified with new content
        page.root.dispatchEvent(
          new CustomEvent('pod-os:document-modified', { detail: { file, newContent: 'new content' } }),
        );

        // then the new content is put to the original file
        expect(os.files().putFile).toHaveBeenCalledWith(file, 'new content');

        await page.waitForChanges();

        // and a pod-os:error event is emitted
        expect(errorSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: new Error('Network error'),
          }),
        );
      });

      it('flags markdown document with error iff last saving failed', async () => {
        // when PUT fails
        const error = { status: 401, statusText: 'Unauthorized', ok: false } as Response;
        when(os.files().putFile).mockResolvedValue(error);

        page.root.dispatchEvent(
          new CustomEvent('pod-os:document-modified', { detail: { file, newContent: 'new content' } }),
        );

        await page.waitForChanges(); // wait for put to resolve
        await page.waitForChanges(); // wait for rerender

        // then error indication is passed to pos-markdown-document
        const markdownDocFailed = page.root.shadowRoot.querySelector('pos-markdown-document');
        expect(markdownDocFailed).toEqualAttribute('saveStatus', 'failed');

        // but when PUT then succeeds again
        when(os.files().putFile).mockResolvedValue({ ok: true } as Response);
        page.root.dispatchEvent(
          new CustomEvent('pod-os:document-modified', { detail: { file, newContent: 'new content' } }),
        );
        await page.waitForChanges(); // wait for put to resolve
        await page.waitForChanges(); // wait for rerender

        // then the error indication is removed again
        const markdownDocRecovered = page.root.shadowRoot.querySelector('pos-markdown-document');
        expect(markdownDocRecovered).toEqualAttribute('saveStatus', 'idle');
      });
    });
  });
});

function mockBinaryFile(pngBlob) {
  return {
    blob: () => pngBlob,
  } as BinaryFile;
}
