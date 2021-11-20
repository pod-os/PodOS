import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('pos-resource', () => {
  it('renders child content after fetching successfully', async () => {
    const page = await newE2EPage();

    await mockPodOs(page);
    await page.setContent(`
        <pos-app>
            <pos-resource uri="https://resource.test">
            </pos-resource>
        </pos-app>
     `);

    const el = await page.find('pos-resource');
    expect(el).not.toBeNull();
    expect(el.shadowRoot).toEqualHtml('<slot></slot>');
  });

  it('renders error message when fetch failed', async () => {
    const page = await newE2EPage();
    await mockPodOs(page);
    await page.setContent(`
        <pos-app>
            <pos-resource uri="https://resource.test/non-existent">
            </pos-resource>
        </pos-app>
     `);

    const el = await page.find('pos-resource');
    expect(el).not.toBeNull();
    expect(el.shadowRoot).toEqualHtml('<div>not found</div>');
  });

  it('renders loading indicator while fetching', async () => {
    const page = await newE2EPage();
    await mockPodOs(page);
    await page.setContent(`
        <pos-app>
            <pos-resource uri="https://resource.test/loading">
            </pos-resource>
        </pos-app>
     `);

    const el = await page.find('pos-resource');
    expect(el).not.toBeNull();
    expect(el.shadowRoot).toEqualHtml(
      '<ion-progress-bar aria-valuemax="1" aria-valuemin="0" class="hydrated md progress-bar-indeterminate" role="progressbar"></ion-progress-bar>',
    );
  });

  async function mockPodOs(page: E2EPage) {
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(window, 'PodOS', {
        get() {
          return {
            PodOS: function PodOS() {
              this.fetch = (uri: string) => {
                if (uri === 'https://resource.test') {
                  return Promise.resolve();
                } else if (uri === 'https://resource.test/loading') {
                  return new Promise(() => null);
                } else {
                  return Promise.reject(new Error('not found'));
                }
              };
              this.store = {
                get: () => ({}),
              };
              this.trackSession = () => null;
              this.handleIncomingRedirect = () => Promise.resolve();
            },
          };
        },
      });
    });
  }
});
