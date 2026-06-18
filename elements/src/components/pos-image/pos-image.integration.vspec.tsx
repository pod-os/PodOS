import { vi } from 'vitest';
import { beforeEach, describe, expect, h, it, render } from '@stencil/vitest';
import { BinaryFile, BrokenFile, SolidFile } from '@pod-os/core';
import { when } from 'vitest-when';
import { mockPodOS } from '../../test/mockPodOS.vitest';
import './pos-image';
import '../pos-app/pos-app';

vi.mock('@shoelace-style/shoelace/dist/components/skeleton/skeleton.js', () => ({}));
vi.mock('@shoelace-style/shoelace/dist/components/icon/icon.js', () => ({}));

describe('pos-image', () => {
  let pngBlob: Blob;
  beforeEach(() => {
    pngBlob = new Blob(['1'], {
      type: 'image/png',
    });
  });

  it('renders img after successfully loading image data', async () => {
    const os = mockPodOS();
    const file = mockBinaryFile(pngBlob);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake-png-data');
    const loadingPromise = new Promise<SolidFile>(resolve => setTimeout(() => resolve(file), 1));
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').thenReturn(loadingPromise);
    const page = await render(
      <pos-app>
        <pos-image src="https://pod.test/image.png" />
      </pos-app>,
    );

    await loadingPromise;
    await page.waitForChanges();
    expect(URL.createObjectURL).toHaveBeenCalledWith(pngBlob);
    expect(page.root).toMatchInlineSnapshot(`
      <pos-app class="hydrated">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <pos-image class="hydrated">
          <mock:shadow-root>
            <img src="blob:fake-png-data">
          </mock:shadow-root>
        </pos-image>
      </pos-app>
    `);
  });

  it('renders placeholder while loading image data', async () => {
    const os = mockPodOS();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake-png-data');
    const loadingPromise = new Promise<SolidFile>(() => null);
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').thenReturn(loadingPromise);
    const page = await render(
      <pos-app>
        <pos-image src="https://pod.test/image.png" />
      </pos-app>,
    );
    expect(page.root).toMatchInlineSnapshot(`
      <pos-app class="hydrated">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <pos-image class="hydrated">
          <mock:shadow-root>
            <sl-skeleton effect="sheen"></sl-skeleton>
          </mock:shadow-root>
        </pos-image>
      </pos-app>
    `);
  });

  it('renders img tag with src when fetching image data failed', async () => {
    const os = mockPodOS();
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').thenReject(new Error('network error'));
    const page = await render(
      <pos-app>
        <pos-image src="https://pod.test/image.png" />
      </pos-app>,
    );
    expect(page.root).toMatchInlineSnapshot(`
      <pos-app class="hydrated">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <pos-image class="hydrated">
          <mock:shadow-root>
            <img src="https://pod.test/image.png">
          </mock:shadow-root>
        </pos-image>
      </pos-app>
    `);
  });

  it('renders broken image when fetching failed with http error', async () => {
    const os = mockPodOS();
    const brokenImage = {
      blob: () => null,
      status: {
        code: 403,
      },
    } as unknown as BrokenFile;
    when(os.files().fetchFile).calledWith('https://pod.test/image.png').thenResolve(brokenImage);
    const page = await render(
      <pos-app>
        <pos-image src="https://pod.test/image.png" />
      </pos-app>,
    );
    expect(page.root).toMatchInlineSnapshot(`
      <pos-app class="hydrated">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <pos-image class="hydrated">
          <mock:shadow-root>
            <div __self="[object global]" __source="[object Object]">
              <a class="error" __self="[object global]" __source="[object Object]">
                <div __self="[object global]" __source="[object Object]">
                  <sl-icon name="lock"></sl-icon>
                </div>
                <div class="code" __self="[object global]" __source="[object Object]">
                  403
                </div>
                <div class="text" __self="[object global]" __source="[object Object]"></div>
              </a>
            </div>
          </mock:shadow-root>
        </pos-image>
      </pos-app>
    `);
  });
});

function mockBinaryFile(pngBlob: Blob) {
  return {
    blob: () => pngBlob,
  } as BinaryFile;
}
