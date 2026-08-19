import { Mock, vi } from 'vitest';
import { beforeEach, describe, expect, h, it, render } from '@stencil/vitest';
import { when } from 'vitest-when';

import { BrokenFile } from '../broken-file/BrokenFile';
import { mockPodOS } from '../../test/mockPodOS.vitest';
import { BinaryFile, BrokenFile as BrokenFileData } from '@pod-os/core';

import './pos-image';
import session from '../../store/session';

vi.mock('../broken-file/BrokenFile');

describe('pos-image', () => {
  let pngBlob: Blob;
  beforeEach(() => {
    pngBlob = new Blob(['1'], {
      type: 'image/png',
    });
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake-png-data');
  });

  it('renders loading indicator initially', async () => {
    const page = await render(<pos-image src="https://pod.test/image.png" alt="image" />);
    expect(page.root.shadowRoot).toEqualHtml('<sl-skeleton effect="sheen"></sl-skeleton>');
  });

  it('renders loading indicator while fetching', async () => {
    const os = mockPodOS();
    when(os.files().fetchFile)
      .calledWith('https://pod.test/image.png')
      .thenReturn(new Promise(() => null));
    const page = await render(<pos-image src="https://pod.test/image.png" alt="image" />);

    await page.waitForChanges();
    expect(os.files().fetchFile).toHaveBeenCalled();
    expect(page.root.shadowRoot).toEqualHtml('<sl-skeleton effect="sheen"></sl-skeleton>');
  });

  it('renders img after loading', async () => {
    const file = mockBinaryFile(pngBlob);
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').thenResolve(file);
    const page = await render(<pos-image src="https://pod.test/image.png" alt="image" />);
    await page.waitForChanges();
    expect(URL.createObjectURL).toHaveBeenCalledWith(pngBlob);
    expect(page.root.shadowRoot).toEqualHtml('<img src="blob:fake-png-data" alt="image">');
  });

  it('uses the same image for a blurred background', async () => {
    const file = mockBinaryFile(pngBlob);
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').thenResolve(file);
    const page = await render(<pos-image src="https://pod.test/image.png" alt="image" blurred-background />);
    await page.waitForChanges();
    expect(URL.createObjectURL).toHaveBeenCalledWith(pngBlob);
    expect(page.root).toHaveAttribute('blurred-background');
    expect(page.root).toEqualAttribute('style', 'background-image: url("blob:fake-png-data");');
  });

  it('emits event after loading image', async () => {
    const onResourceLoaded = vi.fn();
    document.addEventListener('pod-os:resource-loaded', onResourceLoaded);
    const file = mockBinaryFile(pngBlob);
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').thenResolve(file);
    const page = await render(<pos-image src="https://pod.test/image.png" alt="image" />);
    await page.waitForChanges();
    expect(onResourceLoaded).toHaveBeenCalled();
    expect(onResourceLoaded.mock.calls[0][0].detail).toEqual('https://pod.test/image.png');
  });

  it('renders html img tag with src when fetch failed', async () => {
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').thenReject(new Error('network error'));
    const page = await render(<pos-image src="https://pod.test/image.png" />);
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml('<img src="https://pod.test/image.png">');
  });

  it('renders a link when img tag fails to load image', async () => {
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').thenReject(new Error('network error'));
    const page = await render(<pos-image src="https://pod.test/image.png" />);
    await page.waitForChanges();
    page.root.shadowRoot!.querySelector('img')!.dispatchEvent(new Event('error'));
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml(`
           <div class="error">
            <a href="https://pod.test/image.png">
              https://pod.test/image.png
            </a>
          </div>
  `);
  });

  it('renders error for inaccessible file', async () => {
    const brokenImage = {
      blob: () => null,
      status: {
        code: 403,
        text: 'Forbidden',
      },
    } as unknown as BrokenFileData;
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').thenResolve(brokenImage);
    (BrokenFile as Mock).mockReturnValue(<div class="error">403 - Forbidden - https://pod.test/image.png</div>);
    const page = await render(<pos-image src="https://pod.test/image.png" />);
    await page.waitForChanges();
    expect(page.root.shadowRoot).toHaveTextContent('403 - Forbidden - https://pod.test/image.png');
  });

  it('updates and loads resource when src changes', async () => {
    const file = mockBinaryFile(pngBlob);
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').thenResolve(file);
    when(os.files().fetchFile)
      .calledWith('https://pod.test/other.png')
      .thenReturn(new Promise(() => null));
    const page = await render(<pos-image src="https://pod.test/image.png" />);

    page.root.setAttribute('src', 'https://pod.test/other.png');
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml('<sl-skeleton effect="sheen"></sl-skeleton>');
  });

  it('re-fetches resource when session state changes', async () => {
    const file = mockBinaryFile(pngBlob);
    const os = mockPodOS();
    when(os.files().fetchFile, { times: 1 }).calledWith('https://pod.test/image.png').thenResolve(file);
    const page = await render(<pos-image src="https://pod.test/image.png" />);
    when(os.files().fetchFile, { times: 1 })
      .calledWith('https://pod.test/image.png')
      .thenReturn(new Promise(() => null));
    session.state.isLoggedIn = true;
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml('<sl-skeleton effect="sheen"></sl-skeleton>');
  });

  it('removes error message after successful loading', async () => {
    const file = mockBinaryFile(pngBlob);
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
    const os = mockPodOS();
    when(os.files().fetchFile, { times: 1 }).calledWith('https://pod.test/image.png').thenResolve(unauthorizedFile);
    const page = await render(<pos-image src="https://pod.test/image.png" />);
    when(os.files().fetchFile, { times: 1 }).calledWith('https://pod.test/image.png').thenResolve(file);
    expect(sessionChanged).toBeDefined();
    sessionChanged!();
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml('<img src="blob:fake-png-data">');
  });
});

function mockBinaryFile(pngBlob: Blob) {
  return {
    blob: () => pngBlob,
  } as BinaryFile;
}
