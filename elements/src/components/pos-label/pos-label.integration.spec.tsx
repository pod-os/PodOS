import { newSpecPage } from '@stencil/core/testing';
import { mockPodOS } from '../../test/mockPodOS';
import { PosApp } from '../pos-app/pos-app';
import { PosResource } from '../pos-resource/pos-resource';
import { PosLabel } from './pos-label';
import { when } from 'jest-when';

describe('pos-label', () => {
  it('renders label for successfully loaded resource', async () => {
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test').mockReturnValue(Promise.resolve());
    when(os.store.get)
      .calledWith('https://resource.test')
      .mockReturnValue({
        label: () => 'Test Resource',
      });
    const page = await newSpecPage({
      components: [PosApp, PosResource, PosLabel],
      html: `<pos-app>
            <pos-resource uri="https://resource.test">
              <pos-label />
            </pos-resource>
        </pos-app>`,
    });
    const label = page.root.querySelector('pos-label');
    expect(label).toEqualHtml(`
      <pos-label>
        <mock:shadow-root>
          Test Resource
        </mock:shadow-root>
      </pos-label>
  `);
  });

  it('renders label after successfully loading resource', async () => {
    const os = mockPodOS();
    const loadingPromise = new Promise(resolve => setTimeout(resolve, 1));
    when(os.fetch).calledWith('https://resource.test').mockReturnValue(loadingPromise);
    when(os.store.get)
      .calledWith('https://resource.test')
      .mockReturnValue({
        label: () => 'Test Resource',
      });
    const page = await newSpecPage({
      components: [PosApp, PosResource, PosLabel],
      html: `<pos-app>
            <pos-resource uri="https://resource.test">
              <pos-label />
            </pos-resource>
        </pos-app>`,
    });
    await loadingPromise;
    await page.waitForChanges();
    const label = page.root.querySelector('pos-label');
    expect(label).toEqualHtml(`
      <pos-label>
        <mock:shadow-root>
          Test Resource
        </mock:shadow-root>
      </pos-label>
    `);
  });

  it('renders nothing while loading resource', async () => {
    const os = mockPodOS();
    const loadingPromise = new Promise(resolve => setTimeout(resolve, 1));
    when(os.fetch).calledWith('https://resource.test').mockReturnValue(loadingPromise);
    const page = await newSpecPage({
      components: [PosApp, PosResource, PosLabel],
      html: `<pos-app>
            <pos-resource uri="https://resource.test">
              <pos-label />
            </pos-resource>
        </pos-app>`,
    });
    const label = page.root.querySelector('pos-label');
    expect(label).toEqualHtml(`
      <pos-label>
      <mock:shadow-root></mock:shadow-root>
      </pos-label>
    `);
    await loadingPromise;
  });

  it('renders nothing when resource loading failed', async () => {
    const os = mockPodOS();
    const rejectedPromise = Promise.reject(new Error('not found'));
    when(os.fetch).calledWith('https://resource.test').mockReturnValue(rejectedPromise);
    const page = await newSpecPage({
      components: [PosApp, PosResource, PosLabel],
      html: `<pos-app>
            <pos-resource uri="https://resource.test">
              <pos-label />
            </pos-resource>
        </pos-app>`,
    });
    const label = page.root.querySelector('pos-label');
    expect(label).toEqualHtml(`
      <pos-label>
      <mock:shadow-root></mock:shadow-root>
      </pos-label>
    `);
  });
});
