import { newSpecPage } from '@stencil/core/testing';
import { PosList } from './pos-list';


describe('pos-list', () => {

  it('contains only template initially', async () => {
    const page = await newSpecPage({
      components: [PosList],
      html: `<pos-list rel="http://schema.org/video"><template><div>Test</div></template></pos-list>`,
    });
    expect(page.root).toEqualHtml(`
          <pos-list rel="http://schema.org/video" />
            <template><div>Test</div></template>
          </pos-list>
      `);
  });

  it('renders single rel object', async () => {
    const page = await newSpecPage({
      components: [PosList],
      html: `<pos-list rel="http://schema.org/video"><template><div>Test</div></template></pos-list>`,
    });
    await page.rootInstance.receiveResource({
      relations: () => [
        {
          predicate: 'http://schema.org/video',
          label: 'url',
          uris: ['https://video.test/video-1'],
        },
      ],
    });
    await page.waitForChanges();

    const el: HTMLElement = page.root as unknown as HTMLElement;

    expect(el.querySelectorAll("div")).toHaveLength(1)
    expect(el.querySelector("div")?.innerText).toEqual("Test")
  })

  it('renders multiple rel objects', async () => {
    const page = await newSpecPage({
      components: [PosList],
      html: `<pos-list rel="http://schema.org/video"><template><div>Test</div></template></pos-list>`,
    });
    await page.rootInstance.receiveResource({
      relations: () => [
        {
          predicate: 'http://schema.org/video',
          label: 'url',
          uris: ['https://video.test/video-1', 'https://video.test/video-2'],
        },
      ],
    });
    await page.waitForChanges();

    const el: HTMLElement = page.root as unknown as HTMLElement;

    expect(el.querySelectorAll("div")).toHaveLength(2)
  })


});
