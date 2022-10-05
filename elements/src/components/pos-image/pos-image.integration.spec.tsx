import { newSpecPage } from '@stencil/core/testing';
import { Blob } from 'buffer';
import { when } from 'jest-when';
import { mockPodOS } from '../../test/mockPodOS';
import { PosApp } from '../pos-app/pos-app';
import { PosImage } from './pos-image';

describe('pos-image', () => {
  it('renders img after successfully loading image data', async () => {
    const os = mockPodOS();
    const pngBlob = new Blob(['1'], {
      type: 'image/png',
    });
    jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake-png-data');
    const loadingPromise = new Promise(resolve => setTimeout(() => resolve(pngBlob), 1));
    when(os.fetchBlob).calledWith('https://pod.test/image.png').mockReturnValue(loadingPromise);
    const page = await newSpecPage({
      components: [PosApp, PosImage],
      html: `<pos-app>
            <pos-image src="https://pod.test/image.png" />
        </pos-app>`,
    });
    await loadingPromise;
    await page.waitForChanges();
    expect(URL.createObjectURL).toHaveBeenCalledWith(pngBlob);
    expect(page.root).toEqualHtml(`
    <pos-app>
      <ion-app>
        <pos-image src="https://pod.test/image.png">
            <mock:shadow-root>
              <img src="blob:fake-png-data" />
            </mock:shadow-root>
        </pos-image>
      </ion-app>
    </pos-app>
  `);
  });

  it('renders placeholder while loading image data', async () => {
    const os = mockPodOS();
    const pngBlob = new Blob(['1'], {
      type: 'image/png',
    });
    jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake-png-data');
    const loadingPromise = new Promise(resolve => setTimeout(() => resolve(pngBlob), 1));
    when(os.fetchBlob).calledWith('https://pod.test/image.png').mockReturnValue(loadingPromise);
    const page = await newSpecPage({
      components: [PosApp, PosImage],
      html: `<pos-app>
            <pos-image src="https://pod.test/image.png" />
        </pos-app>`,
    });
    expect(page.root).toEqualHtml(`
      <pos-app>
      <ion-app>
        <pos-image src="https://pod.test/image.png">
            <mock:shadow-root>
              <ion-skeleton-text animated></ion-skeleton-text>
            </mock:shadow-root>
        </pos-image>
      </ion-app>
    </pos-app>
  `);
    await loadingPromise;
  });

  it('renders broken image when fetching image data failed', async () => {
    const os = mockPodOS();
    when(os.fetchBlob).calledWith('https://pod.test/image.png').mockRejectedValue(new Error('network error'));
    const page = await newSpecPage({
      components: [PosApp, PosImage],
      html: `<pos-app>
            <pos-image src="https://pod.test/image.png" />
        </pos-app>`,
    });
    expect(page.root).toEqualHtml(`
      <pos-app>
      <ion-app>
        <pos-image src="https://pod.test/image.png">
            <mock:shadow-root>
              <div class="error">
                network error
              </div>
            </mock:shadow-root>
        </pos-image>
      </ion-app>
    </pos-app>
  `);
  });
});
