import { newSpecPage } from '@stencil/core/testing';
import { PosList } from './pos-list';
import { mockPodOS } from '../../test/mockPodOS';
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
          <div>Test</div>
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

    expect(el.querySelectorAll('div')).toHaveLength(1);
    expect(el.querySelector('div')?.innerText).toEqual('Test');
  });

  it('renders multiple rel objects', async () => {
    const page = await newSpecPage({
      components: [PosList],
      html: `
      <pos-list rel="http://schema.org/video">
        <template>
          <div>Test</div>
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

    expect(el.querySelectorAll('div')).toHaveLength(2);
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

  it('displays error if template does not have a single child', async () => {
    const page = await newSpecPage({
      components: [PosList],
      html: `
      <pos-list rel="http://schema.org/video">
        <template>
          <div>Test 1</div>
          <div>Test 2</div>
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

    expect(el.textContent).toEqualHtml('Template element should only have one child, e.g. li');
  });

  it('sets about attribute on children', async () => {
    const page = await newSpecPage({
      components: [PosList],
      html: `
      <pos-list rel="http://schema.org/video">
        <template>
          <div>Test</div>
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

    expect(el.querySelectorAll('div')[0]?.getAttribute('about')).toEqual('https://video.test/video-1');
    expect(el.querySelectorAll('div')[1]?.getAttribute('about')).toEqual('https://video.test/video-2');
  });

  it('provides resource to descendants', async () => {
    const page = await newSpecPage({
      components: [PosList],
      html: `
      <pos-list rel="http://schema.org/video">
        <template>
          <div class="resource">
            <div class="child"></div>
          </div>
        </template>
      </pos-list>`,
    });
    const os = mockPodOS();
    when(os.store.get).calledWith('https://video.test/video-1').mockReturnValue({ uri: 'https://video.test/video-1' });
    when(os.store.get).calledWith('https://video.test/video-2').mockReturnValue({ uri: 'https://video.test/video-2' });
    await page.rootInstance.receivePodOs(os);
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

    let receiveResource = jest.fn(resource => {});
    el.querySelectorAll('div.child')?.forEach(child => {
      let ev = new CustomEvent('pod-os:resource', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: receiveResource,
      });
      child.dispatchEvent(ev);
    });
    await page.waitForChanges();

    expect(receiveResource.mock.calls).toHaveLength(2);
    expect(receiveResource.mock.calls[0][0].uri).toBe('https://video.test/video-1');
    expect(receiveResource.mock.calls[1][0].uri).toBe('https://video.test/video-2');
  });
});
