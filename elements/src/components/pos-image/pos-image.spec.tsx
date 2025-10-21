jest.mock('../broken-file/BrokenFile');

import { BinaryFile, BrokenFile as BrokenFileData } from '@pod-os/core';
import { newSpecPage } from '@stencil/core/testing';
import { Blob } from 'buffer';
import { mockPodOS } from '../../test/mockPodOS';
import { mockSessionStore } from '../../test/mockSessionStore';
import { BrokenFile } from '../broken-file/BrokenFile';
import { PosImage } from './pos-image';
import { when } from 'jest-when';

import { h } from '@stencil/core';

import session from '../../store/session';

describe('pos-image', () => {
  let pngBlob;
  beforeEach(() => {
    pngBlob = new Blob(['1'], {
      type: 'image/png',
    });
  });

  beforeEach(() => {
    jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake-png-data');
  });

  it('renders loading indicator initially', async () => {
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" alt="image" />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/image.png" alt="image">
        <mock:shadow-root>
          <ion-skeleton-text animated=""></ion-skeleton-text>
        </mock:shadow-root>
      </pos-image>
  `);
  });

  it('renders loading indicator while fetching', async () => {
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" alt="image" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile)
      .calledWith('https://pod.test/image.png')
      .mockReturnValue(new Promise(() => null));
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/image.png" alt="image">
        <mock:shadow-root>
          <ion-skeleton-text animated=""></ion-skeleton-text>
        </mock:shadow-root>
      </pos-image>
  `);
  });

  it('renders img after loading', async () => {
    const file = mockBinaryFile(pngBlob);
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" alt="image" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').mockResolvedValue(file);
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(URL.createObjectURL).toHaveBeenCalledWith(pngBlob);
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/image.png" alt="image">
        <mock:shadow-root>
          <img src="blob:fake-png-data" alt="image">
        </mock:shadow-root>
      </pos-image>
  `);
  });

  it('uses the same image for a blurred background', async () => {
    const file = mockBinaryFile(pngBlob);
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" alt="image" blurred-background/>`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').mockResolvedValue(file);
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(URL.createObjectURL).toHaveBeenCalledWith(pngBlob);
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/image.png" alt="image" blurred-background style="background-image: url('blob:fake-png-data');">
        <mock:shadow-root>
          <img src="blob:fake-png-data" alt="image">
        </mock:shadow-root>
      </pos-image>
  `);
  });

  it('emits event after loading image', async () => {
    const onResourceLoaded = jest.fn();
    const file = mockBinaryFile(pngBlob);
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" alt="image" />`,
    });
    page.root.addEventListener('pod-os:resource-loaded', onResourceLoaded);
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').mockResolvedValue(file);
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(onResourceLoaded).toHaveBeenCalled();
    expect(onResourceLoaded.mock.calls[0][0].detail).toEqual('https://pod.test/image.png');
  });

  it('renders html img tag with src when fetch failed', async () => {
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').mockRejectedValue(new Error('network error'));
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/image.png">
        <mock:shadow-root>
          <img src="https://pod.test/image.png" />
        </mock:shadow-root>
      </pos-image>
  `);
  });

  it('renders a link when img tag fails to load image', async () => {
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').mockRejectedValue(new Error('network error'));
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    page.rootInstance.onImageError({});
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/image.png">
        <mock:shadow-root>
           <div class="error">
            <a href="https://pod.test/image.png">
              https://pod.test/image.png
            </a>
          </div>
        </mock:shadow-root>
      </pos-image>
  `);
  });

  it('renders error for inaccessible file', async () => {
    const brokenImage = {
      blob: () => null,
      toString: () => '403 - Forbidden - https://pod.test/image.png',
    } as unknown as BrokenFileData;
    when(BrokenFile).mockReturnValue(<div class="error">403 - Forbidden - https://pod.test/image.png</div>);
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').mockResolvedValue(brokenImage);
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/image.png">
        <mock:shadow-root>
          <div class="error">
            403 - Forbidden - https://pod.test/image.png
          </div>
        </mock:shadow-root>
      </pos-image>
  `);
  });

  it('updates and loads resource when src changes', async () => {
    const file = mockBinaryFile(pngBlob);
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').mockResolvedValue(file);
    when(os.files().fetchFile)
      .calledWith('https://pod.test/other.png')
      .mockReturnValue(new Promise(() => null));
    await page.rootInstance.setOs(os);
    page.root.setAttribute('src', 'https://pod.test/other.png');
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/other.png">
        <mock:shadow-root>
          <ion-skeleton-text animated=""></ion-skeleton-text>
        </mock:shadow-root>
      </pos-image>
  `);
  });

  it('re-fetches resource when session state changes', async () => {
    const file = mockBinaryFile(pngBlob);
    const session = mockSessionStore();
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').mockResolvedValueOnce(file);
    when(os.files().fetchFile)
      .calledWith('https://pod.test/image.png')
      .mockReturnValueOnce(new Promise(() => null));
    await page.rootInstance.setOs(os);
    expect(session.sessionChanged).toBeDefined();
    session.sessionChanged();
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/image.png">
        <mock:shadow-root>
          <ion-skeleton-text animated=""></ion-skeleton-text>
        </mock:shadow-root>
      </pos-image>
  `);
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
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" />`,
    });
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').mockResolvedValueOnce(unauthorizedFile);
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').mockResolvedValueOnce(file);
    await page.rootInstance.setOs(os);
    expect(sessionChanged).toBeDefined();
    sessionChanged();
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/image.png">
        <mock:shadow-root>
          <img src="blob:fake-png-data">
        </mock:shadow-root>
      </pos-image>
  `);
  });
});

function mockBinaryFile(pngBlob) {
  return {
    blob: () => pngBlob,
  } as BinaryFile;
}
