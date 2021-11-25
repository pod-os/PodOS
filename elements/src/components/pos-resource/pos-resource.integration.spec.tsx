jest.mock('../../pod-os');

import { newSpecPage } from '@stencil/core/testing';
import { createPodOS } from '../../pod-os';
import { PosApp } from '../pos-app/pos-app';
import { PosResource } from './pos-resource';
import { PosLabel } from '../pos-label/pos-label';
import { when } from 'jest-when';

describe('pos-resource with a pos-label child', () => {
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
    expect(page.root).toEqualHtml(`
    <pos-app>
      <ion-app>
        <pos-resource uri="https://resource.test">
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          <pos-label>
            <mock:shadow-root>
              Test Resource
            </mock:shadow-root>
          </pos-label>
        </pos-resource>
      </ion-app>
    </pos-app>
  `);
  });

  it('renders label after successfully loading resource', async () => {
    const loadingPromise = new Promise(resolve => setTimeout(resolve, 1));
    const os = mockPodOS();
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
    expect(page.root).toEqualHtml(`
    <pos-app>
      <ion-app>
        <pos-resource uri="https://resource.test">
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          <pos-label>
            <mock:shadow-root>
              Test Resource
            </mock:shadow-root>
          </pos-label>
        </pos-resource>
      </ion-app>
    </pos-app>
  `);
  });

  it('renders loading indicator, but empty label while loading resource', async () => {
    const loadingPromise = new Promise(resolve => setTimeout(resolve, 1));
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test').mockReturnValue(loadingPromise);
    const page = await newSpecPage({
      components: [PosApp, PosResource, PosLabel],
      html: `<pos-app>
            <pos-resource uri="https://resource.test">
              <pos-label />
            </pos-resource>
        </pos-app>`,
    });
    expect(page.root).toEqualHtml(`
      <pos-app>
        <ion-app>
          <pos-resource uri="https://resource.test">
            <mock:shadow-root>
              <ion-progress-bar type="indeterminate"></ion-progress-bar>
            </mock:shadow-root>
            <pos-label>
              <mock:shadow-root>
              </mock:shadow-root>
            </pos-label>
          </pos-resource>
        </ion-app>
      </pos-app>
  `);
    await loadingPromise;
  });

  it('renders error, but no label when resource loading failed', async () => {
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test').mockRejectedValue(new Error('not found'));
    const page = await newSpecPage({
      components: [PosApp, PosResource, PosLabel],
      html: `<pos-app>
            <pos-resource uri="https://resource.test">
              <pos-label />
            </pos-resource>
        </pos-app>`,
    });
    expect(page.root).toEqualHtml(`
<pos-app>
  <ion-app>
    <pos-resource uri="https://resource.test">
      <mock:shadow-root>
        <div>
          not found
        </div>
      </mock:shadow-root>
      <pos-label>
        <mock:shadow-root>
        </mock:shadow-root>
      </pos-label>
    </pos-resource>
  </ion-app>
</pos-app>
  `);
  });

  it('renders multiple labels for successfully loaded resource', async () => {
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
              <pos-label />
              <pos-label />
            </pos-resource>
        </pos-app>`,
    });
    expect(page.root).toEqualHtml(`
    <pos-app>
      <ion-app>
        <pos-resource uri="https://resource.test">
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          <pos-label>
            <mock:shadow-root>
              Test Resource
            </mock:shadow-root>
            <pos-label>
              <mock:shadow-root>
                Test Resource
              </mock:shadow-root>
              <pos-label>
                <mock:shadow-root>
                  Test Resource
                </mock:shadow-root>
              </pos-label>
            </pos-label>
          </pos-label>
        </pos-resource>
      </ion-app>
    </pos-app>
  `);
  });

  it('renders multiple label after successfully loading resource', async () => {
    const loadingPromise = new Promise(resolve => setTimeout(resolve, 1));
    const os = mockPodOS();
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
              <pos-label />
              <pos-label />
            </pos-resource>
        </pos-app>`,
    });
    await loadingPromise;
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
    <pos-app>
      <ion-app>
        <pos-resource uri="https://resource.test">
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          <pos-label>
            <mock:shadow-root>
              Test Resource
            </mock:shadow-root>
            <pos-label>
              <mock:shadow-root>
                Test Resource
              </mock:shadow-root>
              <pos-label>
                <mock:shadow-root>
                  Test Resource
                </mock:shadow-root>
              </pos-label>
            </pos-label>
          </pos-label>
        </pos-resource>
      </ion-app>
    </pos-app>
  `);
  });
});

function mockPodOS() {
  const os = {
    fetch: jest.fn(),
    store: {
      get: jest.fn(),
    },
    trackSession: jest.fn(),
    handleIncomingRedirect: jest.fn(),
  };
  (createPodOS as jest.Mock).mockReturnValue(os);
  return os;
}
