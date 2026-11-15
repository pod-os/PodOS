import { Mock, vi } from 'vitest';
import { beforeEach, describe, expect, h, it, render, RenderResult } from '@stencil/vitest';
import { BrokenFile } from '../../components/broken-file/BrokenFile';

import { mockPodOS } from '../../test/mockPodOS.vitest';
import './pos-tool-source-editor';
import { mockResource } from '../../test/mockResource';
import { BrokenFile as BrokenFileData, PodOS, SolidFile, Thing } from '@pod-os/core';
import { getByShadowRole } from 'shadow-dom-testing-library';
import { userEvent } from '@testing-library/user-event';
import { onPodOsError } from '../../test/onPodOsError';

vi.mock('../../components/broken-file/BrokenFile');

describe('pos-tool-source-editor', () => {
  let os: PodOS;
  beforeEach(() => {
    os = mockPodOS();
  });

  it('renders skeleton while loading', async () => {
    const page = await render(<pos-tool-source-editor></pos-tool-source-editor>);
    expect(page.root).toMatchInlineSnapshot(`
      <pos-tool-source-editor class="hydrated">
        <mock:shadow-root>
          <section class="editor">
            <header></header>
            <div class="content">
              <div class="skeleton">
                <sl-skeleton effect="sheen"></sl-skeleton>
                <sl-skeleton effect="sheen"></sl-skeleton>
                <sl-skeleton effect="sheen"></sl-skeleton>
                <sl-skeleton effect="sheen"></sl-skeleton>
                <sl-skeleton effect="sheen"></sl-skeleton>
                <sl-skeleton effect="sheen"></sl-skeleton>
              </div>
            </div>
          </section>
        </mock:shadow-root>
      </pos-tool-source-editor>
    `);
  });

  it('renders a read-only textbox with the file content after an uneditable file has been fetched', async () => {
    mockFile(os, 'https://resource.test/document.ttl', 'file source content');

    mockResource({
      uri: 'https://resource.test/document.ttl',
      editable: false,
    } as unknown as Thing);
    const page = await render(<pos-tool-source-editor></pos-tool-source-editor>);

    await page.waitForChanges();

    const textbox = getByShadowRole(page.root, 'textbox');
    expect(textbox).toMatchInlineSnapshot(`
      <div
        aria-multiline="true"
        aria-readonly="true"
        autocapitalize="off"
        autocorrect="off"
        class="cm-content cm-lineWrapping"
        contenteditable="false"
        role="textbox"
        spellcheck="false"
        style="tab-size: 4;"
        tabindex="0"
        translate="no"
        writingsuggestions="false"
      >
        <div
          class="cm-line cm-activeLine"
        >
          file source content
        </div>
      </div>
    `);
  });

  describe('editable document', () => {
    let page: RenderResult;
    let file: SolidFile;
    beforeEach(async () => {
      file = mockFile(os, 'https://resource.test/document.ttl', 'file source content');

      mockResource({
        uri: 'https://resource.test/document.ttl',
        editable: true,
      } as unknown as Thing);
      page = await render(<pos-tool-source-editor></pos-tool-source-editor>);
      await page.waitForChanges();
    });

    it('renders an editable textbox with the file content after an editable file has been fetched', async () => {
      const textbox = getByShadowRole(page.root, 'textbox');
      expect(textbox).toMatchInlineSnapshot(`
      <div
        aria-multiline="true"
        autocapitalize="off"
        autocorrect="off"
        class="cm-content cm-lineWrapping"
        contenteditable="true"
        role="textbox"
        spellcheck="false"
        style="tab-size: 4;"
        translate="no"
        writingsuggestions="false"
      >
        <div
          class="cm-line cm-activeLine"
        >
          file source content
        </div>
      </div>
    `);
    });

    it('indicates unsaved changes to the content', async () => {
      // given the editor is currently idle
      const status = page.root.shadowRoot?.querySelector('pos-save-status');
      expect(status).toMatchInlineSnapshot(`<pos-save-status savestatus="idle"></pos-save-status>`);

      // when the user edits the document
      // @ts-ignore Accessing a private field here for testing
      page.instance.editor.view.dispatch({ changes: { from: 0, insert: 'some changes' } });
      await page.waitForChanges();
      // then the status indicates pending changes
      expect(status).toMatchInlineSnapshot(`<pos-save-status savestatus="pending"></pos-save-status>`);
    });

    describe('saving', () => {
      it('renders a save button', () => {
        const saveButton = getByShadowRole(page.root, 'button', { name: 'Save' });
        expect(saveButton).toMatchInlineSnapshot(`
        <button>
          <sl-icon name="cloud-arrow-up"></sl-icon>
          Save
        </button>
      `);
      });

      it('saves the document when clicking the save button', async () => {
        const saveButton = getByShadowRole(page.root, 'button', { name: 'Save' });
        await userEvent.click(saveButton);
        expect(os.files().putFile).toHaveBeenCalledWith(file, 'file source content');
      });

      it('indicates saving in progress while saving', async () => {
        let finishSaving: Function;
        const savingPromise = new Promise<Response>(resolve => {
          finishSaving = resolve;
        });
        vi.when(os.files().putFile).calledWith(file, 'file source content').thenReturnOnce(savingPromise);
        const saveButton = getByShadowRole(page.root, 'button', { name: 'Save' });
        await userEvent.click(saveButton);
        expect(saveButton).toBeDisabled();
        const status = page.root.shadowRoot?.querySelector('pos-save-status');
        expect(status).toMatchInlineSnapshot(`<pos-save-status savestatus="saving"></pos-save-status>`);
        finishSaving!({
          ok: true,
        });
        await page.waitForChanges();
        expect(saveButton).toBeEnabled();
        expect(status).toMatchInlineSnapshot(`<pos-save-status savestatus="idle"></pos-save-status>`);
      });

      it('indicates that saving has failed', async () => {
        vi.when(os.files().putFile)
          .calledWith(file, 'file source content')
          .thenRejectOnce(new Error('something went wrong'));
        const saveButton = getByShadowRole(page.root, 'button', { name: 'Save' });
        const onError = onPodOsError(page.root);
        await userEvent.click(saveButton);
        const status = page.root.shadowRoot?.querySelector('pos-save-status');
        expect(status).toMatchInlineSnapshot(`<pos-save-status savestatus="failed"></pos-save-status>`);
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: new Error('something went wrong'),
          }),
        );
      });

      it('indicates that saving has failed with a bad http response', async () => {
        vi.when(os.files().putFile)
          .calledWith(file, 'file source content')
          .thenResolveOnce({
            ok: false,
            status: 401,
            statusText: 'Unauthorized',
          } as Response);
        const onError = onPodOsError(page.root);
        const saveButton = getByShadowRole(page.root, 'button', { name: 'Save' });
        await userEvent.click(saveButton);
        const status = page.root.shadowRoot?.querySelector('pos-save-status');
        expect(status).toMatchInlineSnapshot(`<pos-save-status savestatus="failed"></pos-save-status>`);
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: new Error('Failed to save file: 401 Unauthorized'),
          }),
        );
      });
    });

    describe.each(['pod-os:link', 'pod-os:tool-selected', 'pod-os:logout'])(
      'prevent losing unsaved changes when navigating via %s',
      () => {
        it('stay in the editor if not confirming losing unsaved changes', () => {
          const navigationEvent = vi.fn();
          page.root.addEventListener('pod-os:link', navigationEvent);
          // given the user edited the document
          // @ts-ignore Accessing a private field here for testing
          page.instance.editor.view.dispatch({ changes: { from: 0, insert: 'some changes' } });

          // when they try to navigate away and do not confirm
          vi.stubGlobal('confirm', vi.fn().mockReturnValue(false));
          page.root.dispatchEvent(new CustomEvent('pod-os:link'));
          expect(window.confirm).toHaveBeenCalledWith('There are unsaved changes that will be lost, if you proceed.');

          // then they stay on the page
          expect(navigationEvent).not.toHaveBeenCalled();
        });

        it('proceed with navigation when confirming losing unsaved changes', () => {
          const navigationEvent = vi.fn();
          page.root.addEventListener('pod-os:link', navigationEvent);
          // given the user edited the document
          // @ts-ignore Accessing a private field here for testing
          page.instance.editor.view.dispatch({ changes: { from: 0, insert: 'some changes' } });

          // when they try to navigate away and confirm it
          vi.stubGlobal('confirm', vi.fn().mockReturnValue(true));
          page.root.dispatchEvent(new CustomEvent('pod-os:link'));
          expect(window.confirm).toHaveBeenCalledWith('There are unsaved changes that will be lost, if you proceed.');

          // then they leave the page
          expect(navigationEvent).toHaveBeenCalled();
        });

        it('proceed with navigation no unsaved changes exist', () => {
          const navigationEvent = vi.fn();
          page.root.addEventListener('pod-os:link', navigationEvent);
          // given the user did not change the document
          // when they try to navigate away
          vi.stubGlobal('confirm', vi.fn());
          page.root.dispatchEvent(new CustomEvent('pod-os:link'));

          // then they do not need to confirm that
          expect(window.confirm).not.toHaveBeenCalled();

          // then they leave the page
          expect(navigationEvent).toHaveBeenCalled();
        });
      },
    );
  });

  it('renders error for broken file', async () => {
    const brokenFile = {
      blob: () => null,
      toString: () => '403 - Forbidden - https://resource.test/document.ttl',
    } as unknown as BrokenFileData;

    vi.when(os.files().fetchFile).calledWith('https://resource.test/document.ttl').thenResolveOnce(brokenFile);

    (BrokenFile as Mock).mockReturnValue(<div class="error">403 - Forbidden - https://resource.test/document.ttl</div>);

    mockResource({
      uri: 'https://resource.test/document.ttl',
    } as unknown as Thing);
    const page = await render(<pos-tool-source-editor></pos-tool-source-editor>);

    await page.waitForChanges();

    expect(page.root).toMatchInlineSnapshot(`
      <pos-tool-source-editor class="hydrated">
        <mock:shadow-root>
          <div class="error">
            403 - Forbidden - https://resource.test/document.ttl
          </div>
        </mock:shadow-root>
      </pos-tool-source-editor>
    `);
  });
});

function mockFile(os: PodOS, url: string = 'https://resource.test/document.ttl', textContent: string): SolidFile {
  const file = {
    url: url,
    blob: () => ({
      text: () => {
        return Promise.resolve(textContent);
      },
    }),
  } as SolidFile;
  vi.when(os.files().fetchFile).calledWith(url).thenResolveOnce(file);
  return file;
}
