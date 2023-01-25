import { AnyHTMLElement } from '@stencil/core/internal';
import { newSpecPage } from '@stencil/core/testing';
import { mockPodOS } from '../../test/mockPodOS';
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
          <pos-resource uri="https://resource.test">
            <mock:shadow-root>
              <ion-progress-bar type="indeterminate"></ion-progress-bar>
            </mock:shadow-root>
            <pos-label>
              <mock:shadow-root>
              </mock:shadow-root>
            </pos-label>
          </pos-resource>
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
    <pos-resource uri="https://resource.test">
      <mock:shadow-root>
        <ion-card>
          <ion-card-header>
            <p>
              Sorry, something went wrong
            </p>
            <p>
              Status:
            </p>
            <details>
              not found
            </details>
          </ion-card-header>
          <ion-card-content>
            <p>
              You can try to open the link outside PodOS:
            </p>
            <a href="https://resource.test">
              https://resource.test
            </a>
          </ion-card-content>
        </ion-card>
      </mock:shadow-root>
      <pos-label>
        <mock:shadow-root>
        </mock:shadow-root>
      </pos-label>
    </pos-resource>
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
    </pos-app>
  `);
  });

  it('renders label for lazy resource that would fetch to fail', async () => {
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test').mockRejectedValue(new Error('not found'));
    when(os.store.get)
      .calledWith('https://resource.test')
      .mockReturnValue({
        label: () => 'Test Resource',
      });
    const page = await newSpecPage({
      components: [PosApp, PosResource, PosLabel],
      html: `<pos-app>
            <pos-resource lazy uri="https://resource.test">
              <pos-label />
            </pos-resource>
        </pos-app>`,
    });
    expect(page.root).toEqualHtml(`
    <pos-app>
        <pos-resource lazy uri="https://resource.test">
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          <pos-label>
            <mock:shadow-root>
              Test Resource
            </mock:shadow-root>
          </pos-label>
        </pos-resource>
    </pos-app>
  `);
  });

  it('renders error for lazy resource fails when fetched', async () => {
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test').mockRejectedValue(new Error('not found'));
    when(os.store.get)
      .calledWith('https://resource.test')
      .mockReturnValueOnce({
        label: () => 'Test Resource',
      });
    const page = await newSpecPage({
      components: [PosApp, PosResource, PosLabel],
      html: `<pos-app>
            <pos-resource lazy uri="https://resource.test">
              <pos-label />
            </pos-resource>
        </pos-app>`,
    });
    await (page.root.querySelector('pos-resource') as AnyHTMLElement).fetch();
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
    <pos-app>
        <pos-resource lazy uri="https://resource.test">
          <mock:shadow-root>
            <ion-card>
              <ion-card-header>
                <p>
                  Sorry, something went wrong
                </p>
                <p>
                  Status:
                </p>
                <details>
                  not found
                </details>
              </ion-card-header>
              <ion-card-content>
                <p>
                  You can try to open the link outside PodOS:
                </p>
                <a href="https://resource.test">
                  https://resource.test
                </a>
              </ion-card-content>
            </ion-card>
          </mock:shadow-root>
          <pos-label>
            <mock:shadow-root>
              Test Resource
            </mock:shadow-root>
          </pos-label>
        </pos-resource>
    </pos-app>
  `);
  });

  it('rerenders child after lazy resource was fetched', async () => {
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test').mockResolvedValue(null);
    when(os.store.get)
      .calledWith('https://resource.test')
      .mockReturnValueOnce({
        label: () => 'Test Resource',
      })
      .mockReturnValueOnce({
        label: () => 'Updated Test Resource',
      });
    const page = await newSpecPage({
      components: [PosApp, PosResource, PosLabel],
      html: `<pos-app>
            <pos-resource lazy uri="https://resource.test">
              <pos-label />
            </pos-resource>
        </pos-app>`,
    });
    await (page.root.querySelector('pos-resource') as AnyHTMLElement).fetch();
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
    <pos-app>
        <pos-resource lazy uri="https://resource.test">
          <mock:shadow-root>
            <slot></slot>
          </mock:shadow-root>
          <pos-label>
            <mock:shadow-root>
              Updated Test Resource
            </mock:shadow-root>
          </pos-label>
        </pos-resource>
    </pos-app>
  `);
  });
});
