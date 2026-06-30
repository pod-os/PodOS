import { Components } from '../../components';
import { BinaryFile, BrokenFile as BrokenFileData, PodOS, Thing } from '@pod-os/core';
import { mockOsProvider, mockPodOS } from '../../test/mockPodOS.vitest';
import { BrokenFile } from '../broken-file/BrokenFile';
import { when } from 'vitest-when';

import session from '../../store/session';

import { Mock, vi } from 'vitest';
import { beforeEach, describe, expect, h, it, render, RenderResult } from '@stencil/vitest';
import './pos-document';

vi.mock('../broken-file/BrokenFile');

describe('pos-document', () => {
  let pdfBlob: Blob;
  beforeEach(() => {
    session.dispose();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake-pdf-data');
    pdfBlob = new Blob(['1'], {
      type: 'application/pdf',
    });
  });

  it('renders loading indicator initially', async () => {
    const page = await render(<pos-document src="https://pod.test/test.pdf"></pos-document>);
    expect(page.root.shadowRoot).toEqualHtml(skeleton());
  });

  function skeleton() {
    return `
    <div class="skeleton">
      <sl-skeleton effect="sheen"></sl-skeleton>
      <sl-skeleton effect="sheen"></sl-skeleton>
      <sl-skeleton effect="sheen"></sl-skeleton>
      <sl-skeleton effect="sheen"></sl-skeleton>
      <sl-skeleton effect="sheen"></sl-skeleton>
      <sl-skeleton effect="sheen"></sl-skeleton>
    </div>
    `;
  }

  it('renders loading indicator while fetching', async () => {
    const os = mockPodOS();
    mockOsProvider(os);
    when(os.files().fetchFile)
      .calledWith('https://pod.test/test.pdf')
      .thenReturn(new Promise(() => null));
    const page = await render(<pos-document src="https://pod.test/test.pdf"></pos-document>);
    await page.waitForChanges();
    expect(os.files().fetchFile).toHaveBeenCalledOnce();
    expect(page.root.shadowRoot).toEqualHtml(skeleton());
  });

  it('renders iframe after loading', async () => {
    const file = mockBinaryFile(pdfBlob);
    const os = mockPodOS();
    mockOsProvider(os);
    when(os.files().fetchFile).calledWith('https://pod.test/test.pdf').thenResolve(file);
    const page = await render(<pos-document src="https://pod.test/test.pdf"></pos-document>);
    await page.waitForChanges();
    expect(os.files().fetchFile).toHaveBeenCalledOnce();
    expect(URL.createObjectURL).toHaveBeenCalledWith(pdfBlob);
    expect(page.root.shadowRoot).toEqualHtml('<iframe src="blob:fake-pdf-data"></iframe>');
  });

  it('renders editable pos-markdown-document for editable markdown files', async () => {
    const markdownBlob = new Blob(['# Test'], {
      type: 'text/markdown',
    });
    const os = mockPodOS();
    mockOsProvider(os);
    const file = mockBinaryFile(markdownBlob);
    when(os.files().fetchFile).calledWith('https://pod.test/test.md').thenResolve(file);
    when(os.store.get)
      .calledWith('https://pod.test/test.md')
      .thenReturn({ editable: true } as unknown as Thing);
    const page = await render(<pos-document src="https://pod.test/test.md"></pos-document>);

    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml(
      '<pos-markdown-document editable savestatus="idle"></pos-markdown-document>',
    );
    const markdownDocument: Components.PosMarkdownDocument =
      page.root.shadowRoot!.querySelector('pos-markdown-document')!;
    expect(markdownDocument.file).toBe(file);
  });

  it('renders read-only pos-markdown-document for non-editable markdown files', async () => {
    const markdownBlob = new Blob(['# Test'], {
      type: 'text/markdown',
    });
    const os = mockPodOS();
    mockOsProvider(os);
    const file = mockBinaryFile(markdownBlob);
    when(os.files().fetchFile).calledWith('https://pod.test/test.md').thenResolve(file);
    when(os.store.get)
      .calledWith('https://pod.test/test.md')
      .thenReturn({ editable: false } as unknown as Thing);
    const page = await render(<pos-document src="https://pod.test/test.md"></pos-document>);
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml('<pos-markdown-document savestatus="idle"></pos-markdown-document>');
    const markdownDocument: Components.PosMarkdownDocument =
      page.root.shadowRoot!.querySelector('pos-markdown-document')!;
    expect(markdownDocument.file).toBe(file);
  });

  it('emits event after loading', async () => {
    const os = mockPodOS();
    mockOsProvider(os);
    const file = mockBinaryFile(pdfBlob);
    when(os.files().fetchFile).calledWith('https://pod.test/test.pdf').thenResolve(file);
    const onResourceLoaded = vi.fn();
    document.addEventListener('pod-os:resource-loaded', onResourceLoaded);
    const page = await render(<pos-document src="https://pod.test/test.pdf"></pos-document>);
    await page.waitForChanges();
    expect(onResourceLoaded).toHaveBeenCalled();
    expect(onResourceLoaded.mock.calls[0][0].detail).toEqual('https://pod.test/test.pdf');
  });

  it('renders error when fetch failed', async () => {
    const os = mockPodOS();
    mockOsProvider(os);
    when(os.files().fetchFile).calledWith('https://pod.test/test.pdf').thenReject(new Error('network error'));
    const page = await render(<pos-document src="https://pod.test/test.pdf"></pos-document>);
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml(`
      <div class="error">
        network error
      </div>
  `);
  });

  it('renders error for inaccessible file', async () => {
    const brokenImage = {
      blob: () => null,
      toString: () => '403 - Forbidden - https://pod.test/test.pdf',
    } as unknown as BrokenFileData;
    const os = mockPodOS();
    mockOsProvider(os);
    when(os.files().fetchFile).calledWith('https://pod.test/test.pdf').thenResolve(brokenImage);
    (BrokenFile as Mock).mockReturnValue(<div class="error">403 - Forbidden - https://pod.test/test.pdf</div>);
    const page = await render(<pos-document src="https://pod.test/test.pdf"></pos-document>);
    await page.waitForChanges();
    expect(page.root.shadowRoot!.querySelector('.error')).toHaveTextContent(
      '403 - Forbidden - https://pod.test/test.pdf',
    );
  });

  it('updates and loads resource when src changes', async () => {
    const file = mockBinaryFile(pdfBlob);
    const os = mockPodOS();
    mockOsProvider(os);
    when(os.files().fetchFile).calledWith('https://pod.test/test.pdf').thenResolve(file);
    when(os.files().fetchFile)
      .calledWith('https://pod.test/other.png')
      .thenReturn(new Promise(() => null));
    const page = await render(<pos-document src="https://pod.test/test.pdf"></pos-document>);
    page.root.setAttribute('src', 'https://pod.test/other.png');
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml(skeleton());
  });

  it('re-fetches resource when session state changes', async () => {
    const os = mockPodOS();
    mockOsProvider(os);

    // given a file can be fetched initially
    const file = mockBinaryFile(pdfBlob);
    when(os.files().fetchFile, { times: 1 }).calledWith('https://pod.test/test.pdf').thenResolve(file);

    // and a pos-document showing that file
    const page = await render(<pos-document src="https://pod.test/test.pdf"></pos-document>);
    await page.waitForChanges();

    // and a second fetch will keep loading
    when(os.files().fetchFile, { times: 1 })
      .calledWith('https://pod.test/test.pdf')
      .thenReturn(new Promise(() => null));

    // when the session state changes
    session.state.isLoggedIn = true;
    await page.waitForChanges();

    // then loading skeleton is shown because the file is being re-fetched
    expect(page.root.shadowRoot).toEqualHtml(skeleton());
  });

  it('removes error message after successful loading', async () => {
    const os = mockPodOS();
    mockOsProvider(os);
    // given the initial fetch of a file results in an error
    const file = mockBinaryFile(pdfBlob);
    when(os.files().fetchFile, { times: 1 }).calledWith('https://pod.test/test.pdf').thenReject(new Error('failed'));
    const page = await render(<pos-document src="https://pod.test/test.pdf"></pos-document>);
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml('<div class="error"> failed </div>');

    // But after sign-in the fetch works
    when(os.files().fetchFile, { times: 1 }).calledWith('https://pod.test/test.pdf').thenResolve(file);
    session.state.isLoggedIn = true;
    await page.waitForChanges();

    // then the error message is removed and the file is shown
    expect(page.root.shadowRoot).toEqualHtml('<iframe src="blob:fake-pdf-data"></iframe>');
  });

  describe('saving modified documents', () => {
    it('calls os.files().putFile on pod-os:document-modified event', async () => {
      // given a file
      const file = mockBinaryFile(
        new Blob(['# Test'], {
          type: 'text/markdown',
        }),
      );
      // and PodOS can put the file successfully
      const os = mockPodOS();
      mockOsProvider(os);
      when(os.files().putFile)
        .calledWith(file, 'new content')
        .thenResolve(new Response(null, { status: 200 }));

      // and a page with a pos-document
      const page = await render(<pos-document src="https://pod.test/test.md"></pos-document>);

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

      // and PodOS can put the file successfully
      const os = mockPodOS();
      mockOsProvider(os);
      when(os.files().fetchFile).calledWith('https://pod.test/test.md').thenResolve(file);
      when(os.store.get)
        .calledWith('https://pod.test/test.md')
        .thenReturn({ editable: true } as unknown as Thing);

      // and a page with a pos-document
      const page = await render(<pos-document src="https://pod.test/test.md"></pos-document>);

      // and the saveStatus is idle initially
      const markdownDocInitial = page.root.shadowRoot!.querySelector('pos-markdown-document');
      expect(markdownDocInitial).toEqualAttribute('saveStatus', 'idle');

      // when a save operation is triggered but hasn't resolved yet
      let resolvePut = () => {};
      const putPromise = new Promise<Response>(resolve => {
        resolvePut = () => resolve({ ok: true } as Response);
      });
      when(os.files().putFile).calledWith(file, 'modified content').thenReturn(putPromise);

      page.root.dispatchEvent(
        new CustomEvent('pod-os:document-modified', { detail: { file, newContent: 'modified content' } }),
      );
      await page.waitForChanges(); // wait for event processing

      // then the saveStatus is "saving"
      const markdownDocSaving = page.root.shadowRoot!.querySelector('pos-markdown-document');
      expect(markdownDocSaving).toEqualAttribute('saveStatus', 'saving');

      // when the save operation completes successfully
      resolvePut();
      await page.waitForChanges(); // wait for put to resolve
      await page.waitForChanges(); // wait for rerender

      // then the saveStatus returns to idle
      const markdownDocCompleted = page.root.shadowRoot!.querySelector('pos-markdown-document');
      expect(markdownDocCompleted).toEqualAttribute('saveStatus', 'idle');
    });

    describe('errors during save', () => {
      let os: PodOS;
      let page: RenderResult;
      let file: BinaryFile;
      let errorSpy: Mock;
      beforeEach(async () => {
        // Given a markdown file
        const markdownBlob = new Blob(['# Test'], {
          type: 'text/markdown',
        });
        file = mockBinaryFile(markdownBlob);
        // and the file can be fetched initially
        os = mockPodOS();
        mockOsProvider(os);
        when(os.files().fetchFile).calledWith('https://pod.test/test.md').thenResolve(file);
        when(os.store.get)
          .calledWith('https://pod.test/test.md')
          .thenReturn({ editable: true } as unknown as Thing);

        page = await render(<pos-document src="https://pod.test/test.md"></pos-document>);
        await page.waitForChanges();

        // and the page listens to pod-os:error events
        errorSpy = vi.fn();
        page.root.addEventListener('pod-os:error', errorSpy);

        // and the pos-markdown-component shows up
        expect(page.root.shadowRoot).toEqualHtml(
          '<pos-markdown-document editable savestatus="idle"></pos-markdown-document>',
        );
      });

      it('emits pod-os:error when putFile responds with non-ok http status', async () => {
        // but PodOS will fail to put the file responding with non-ok http status
        const error = { status: 401, statusText: 'Unauthorized', ok: false } as Response;
        when(os.files().putFile).calledWith(file, 'new content').thenResolve(error);

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
          .thenDo(() => {
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
        (os.files().putFile as Mock).mockResolvedValue(error);

        page.root.dispatchEvent(
          new CustomEvent('pod-os:document-modified', { detail: { file, newContent: 'new content' } }),
        );

        await page.waitForChanges(); // wait for put to resolve
        await page.waitForChanges(); // wait for rerender

        // then error indication is passed to pos-markdown-document
        const markdownDocFailed = page.root.shadowRoot!.querySelector('pos-markdown-document');
        expect(markdownDocFailed).toEqualAttribute('saveStatus', 'failed');

        // but when PUT then succeeds again
        (os.files().putFile as Mock).mockResolvedValue({ ok: true } as Response);
        page.root.dispatchEvent(
          new CustomEvent('pod-os:document-modified', { detail: { file, newContent: 'new content' } }),
        );
        await page.waitForChanges(); // wait for put to resolve
        await page.waitForChanges(); // wait for rerender

        // then the error indication is removed again
        const markdownDocRecovered = page.root.shadowRoot!.querySelector('pos-markdown-document');
        expect(markdownDocRecovered).toEqualAttribute('saveStatus', 'idle');
      });
    });
  });
});

function mockBinaryFile(pngBlob: Blob) {
  return {
    blob: () => pngBlob,
  } as BinaryFile;
}
