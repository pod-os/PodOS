jest.mock('@pod-os/core', () => ({}));

import { newSpecPage } from '@stencil/core/testing';

import { PosContainerContents } from './pos-container-contents';

describe('pos-container-contents', () => {
  it('are empty initially', async () => {
    const page = await newSpecPage({
      components: [PosContainerContents],
      html: `<pos-container-contents />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-container-contents>
        <mock:shadow-root></mock:shadow-root>
      </pos-container-contents>
  `);
  });

  it('renders single file and a link to it', async () => {
    const page = await newSpecPage({
      components: [PosContainerContents],
      html: `<pos-container-contents />`,
    });
    await page.rootInstance.receiveResource({
      assume: () => ({
        contains: () => [
          {
            uri: 'https://pod.test/container/file',
            name: 'file',
          },
        ],
      }),
    });
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`<pos-container-contents>
  <mock:shadow-root>
    <ion-list>
      <pos-resource lazy="" uri="https://pod.test/container/file">
        <pos-container-item role="listitem">
          <ion-label>
            <h3>file</h3>
            <p>
              https://pod.test/container/file
            </p>
          </ion-label>
        </pos-container-item>
      </pos-resource>
    </ion-list>
  </mock:shadow-root>
</pos-container-contents>`);
  });

  it('renders a note about container being empty', async () => {
    const page = await newSpecPage({
      components: [PosContainerContents],
      html: `<pos-container-contents />`,
    });
    await page.rootInstance.receiveResource({
      assume: () => ({
        contains: () => [],
      }),
    });
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`<pos-container-contents>
      <mock:shadow-root>
        <p>
          The container is empty
        </p>
      </mock:shadow-root>
    </pos-container-contents>
 `);
  });

  it('renders multiple contents and links to them, sorted alphabetically', async () => {
    const page = await newSpecPage({
      components: [PosContainerContents],
      html: `<pos-container-contents />`,
    });
    await page.rootInstance.receiveResource({
      assume: () => ({
        contains: () => [
          {
            uri: 'https://pod.test/container/file',
            name: 'file',
          },
          {
            uri: 'https://pod.test/container/subdir/',
            name: 'subdir',
          },
          {
            uri: 'https://pod.test/container/a-file-on-top-of-the-list',
            name: 'a-file-on-top-of-the-list',
          },
        ],
      }),
    });
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
        <pos-container-contents>
            <mock:shadow-root>
                <ion-list>
                  <pos-resource lazy="" uri="https://pod.test/container/a-file-on-top-of-the-list">
                    <pos-container-item role="listitem">
                      <ion-label>
                        <h3>a-file-on-top-of-the-list</h3>
                        <p>
                          https://pod.test/container/a-file-on-top-of-the-list
                        </p>
                      </ion-label>
                    </pos-container-item>
                  </pos-resource>
                    <pos-resource lazy="" uri="https://pod.test/container/file">
                        <pos-container-item role="listitem">
                            <ion-label>
                                <h3>file</h3>
                                <p>
                                    https://pod.test/container/file
                                </p>
                            </ion-label>
                        </pos-container-item>
                    </pos-resource>
                    <pos-resource lazy="" uri="https://pod.test/container/subdir/">
                        <pos-container-item role="listitem">
                            <ion-label>
                                <h3>subdir</h3>
                                <p>
                                    https://pod.test/container/subdir/
                                </p>
                            </ion-label>
                        </pos-container-item>
                    </pos-resource>
                </ion-list>
            </mock:shadow-root>
        </pos-container-contents>`);
  });
});
