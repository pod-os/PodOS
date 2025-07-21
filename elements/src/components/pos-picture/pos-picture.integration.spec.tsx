import { newSpecPage } from '@stencil/core/testing';
import { mockPodOS } from '../../test/mockPodOS';
import { PosApp } from '../pos-app/pos-app';
import { PosResource } from '../pos-resource/pos-resource';
import { PosPicture } from './pos-picture';
import { when } from 'jest-when';

describe('pos-picture', () => {
  it('renders nothing while loading resource', async () => {
    const os = mockPodOS();
    const loadingPromise = new Promise(resolve => setTimeout(resolve, 1));
    when(os.fetch).calledWith('https://resource.test').mockReturnValue(loadingPromise);
    const page = await newSpecPage({
      components: [PosApp, PosResource, PosPicture],
      html: `<pos-app>
            <pos-resource uri="https://resource.test">
              <pos-picture />
            </pos-resource>
        </pos-app>`,
    });
    const picture = page.root.querySelector('pos-picture');
    expect(picture).toEqualHtml(`
      <pos-picture>
      <mock:shadow-root><slot></slot></mock:shadow-root>
      </pos-picture>
    `);
    await loadingPromise;
  });

  it('renders pos-image after successfully loading resource', async () => {
    const os = mockPodOS();
    const loadingPromise = new Promise(resolve => setTimeout(resolve, 1));
    when(os.fetch).calledWith('https://resource.test').mockReturnValue(loadingPromise);
    when(os.store.get)
      .calledWith('https://resource.test')
      .mockReturnValue({
        label: () => 'The resource',
        picture: () => ({
          url: 'https://resource.test/picture.png',
        }),
      });
    const page = await newSpecPage({
      components: [PosApp, PosResource, PosPicture],
      html: `<pos-app>
            <pos-resource uri="https://resource.test">
              <pos-picture />
            </pos-resource>
        </pos-app>`,
    });
    await loadingPromise;
    await page.waitForChanges();
    const picture = page.root.querySelector('pos-picture');
    expect(picture).toEqualHtml(`
      <pos-picture>
        <mock:shadow-root>
          <pos-image src="https://resource.test/picture.png" alt="The resource" />
        </mock:shadow-root>
      </pos-picture>
    `);
  });

  it('renders nothing when resource loading failed', async () => {
    const os = mockPodOS();
    const rejectedPromise = Promise.reject(new Error('not found'));
    when(os.fetch).calledWith('https://resource.test').mockReturnValue(rejectedPromise);
    const page = await newSpecPage({
      components: [PosApp, PosResource, PosPicture],
      html: `<pos-app>
            <pos-resource uri="https://resource.test">
              <pos-picture />
            </pos-resource>
        </pos-app>`,
    });
    const picture = page.root.querySelector('pos-picture');
    expect(picture).toEqualHtml(`
      <pos-picture>
      <mock:shadow-root><slot></slot></mock:shadow-root>
      </pos-picture>
    `);
  });
});
