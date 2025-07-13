import { newSpecPage } from '@stencil/core/testing';
import { PosList } from './pos-list';
import { when } from 'jest-when';

describe('pos-list', () => {
  it('contains only template initially', async () => {
    const page = await newSpecPage({
      components: [PosList],
      html: `
      <pos-list rel="http://schema.org/video">
        <template><div>Test</div></template>
      </pos-list>`,
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
      html: `
      <pos-list rel="http://schema.org/video">
        <template>
          Test
        </template>
      </pos-list>`,
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

    expect(el.querySelectorAll('pos-resource')).toHaveLength(1);
    expect(el.querySelector('pos-resource')?.innerHTML).toEqualHtml('Test');
  });

  it('renders multiple rel objects', async () => {
    const page = await newSpecPage({
      components: [PosList],
      html: `
      <pos-list rel="http://schema.org/video">
        <template>
          Test
        </template>
      </pos-list>`,
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

    expect(el.querySelectorAll('pos-resource')).toHaveLength(2);
  });

  it('renders if-typeof objects', async () => {
    const page = await newSpecPage({
      components: [PosList],
      html: `
      <pos-list if-typeof="http://schema.org/Recipe">
        <template>
          Test
        </template>
      </pos-list>`,
    });
    const os = {
      store: {
        findMembers: jest.fn(),
      },
    };
    when(os.store.findMembers).calledWith('http://schema.org/Recipe').mockReturnValue(['https://recipe.test/1']);
    await page.rootInstance.receivePodOs(os);
    await page.waitForChanges();

    const el: HTMLElement = page.root as unknown as HTMLElement;
    expect(el.querySelector('pos-resource')?.getAttribute('about')).toEqual('https://recipe.test/1');
  });

  it('displays error on missing template', async () => {
    const page = await newSpecPage({
      components: [PosList],
      html: `<pos-list rel="http://schema.org/video"></pos-list>`,
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

    expect(el.textContent).toEqual('No template element found');
  });

  it('sets about and uri attributes on children', async () => {
    const page = await newSpecPage({
      components: [PosList],
      html: `
      <pos-list rel="http://schema.org/video">
        <template>
          Test
        </template>
      </pos-list>`,
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
    const resources = el.querySelectorAll('pos-resource');

    expect(resources[0]?.getAttribute('about')).toEqual('https://video.test/video-1');
    expect(resources[1]?.getAttribute('about')).toEqual('https://video.test/video-2');
    expect(resources[0]?.getAttribute('uri')).toEqual('https://video.test/video-1');
    expect(resources[1]?.getAttribute('uri')).toEqual('https://video.test/video-2');
  });

  it('sets lazy attribute on children if fetch is not present', async () => {
    const page = await newSpecPage({
      components: [PosList],
      html: `
      <pos-list rel="http://schema.org/video">
        <template>
          Test
        </template>
      </pos-list>`,
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

    expect(el.querySelector('pos-resource')?.getAttribute('lazy')).toEqual('');
  });

  it('does not set lazy attribute on children if fetch is present', async () => {
    const page = await newSpecPage({
      components: [PosList],
      html: `
      <pos-list rel="http://schema.org/video" fetch="">
        <template>
          Test
        </template>
      </pos-list>`,
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
    expect(el.querySelector('pos-resource')?.getAttribute('lazy')).toEqual(null);
  });
});
