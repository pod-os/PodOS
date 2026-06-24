import { describe, expect, h, it, render } from '@stencil/vitest';
import './pos-list';
import { when } from 'vitest-when';
import { of } from 'rxjs';
import { mockResource } from '../../test/mockResource';
import { mockOsProvider, mockPodOS } from '../../test/mockPodOS.vitest';

describe('pos-list', () => {
  it('contains only template initially', async () => {
    const page = await render(
      <pos-list rel="http://schema.org/video">
        <template>
          <div>Test</div>
        </template>
      </pos-list>,
    );
    await page.waitForChanges();
    expect(page.root).toMatchInlineSnapshot(`
      <pos-list class="hydrated">
        <template __self="[object global]" __source="[object Object]"></template>
      </pos-list>
    `);
  });

  it('renders single rel object', async () => {
    mockResource({
      relations: () => [
        {
          predicate: 'http://schema.org/video',
          label: 'url',
          uris: ['https://video.test/video-1'],
        },
      ],
    });
    const page = await render(
      <pos-list rel="http://schema.org/video">
        <template>Test</template>
      </pos-list>,
    );
    await page.waitForChanges();

    const el: HTMLElement = page.root as unknown as HTMLElement;

    expect(el.querySelectorAll('pos-resource')).toHaveLength(1);
    expect(el.querySelector('pos-resource')?.innerHTML).toEqualHtml('Test');
  });

  it('renders multiple rel objects', async () => {
    mockResource({
      relations: () => [
        {
          predicate: 'http://schema.org/video',
          label: 'url',
          uris: ['https://video.test/video-1', 'https://video.test/video-2'],
        },
      ],
    });
    const page = await render(
      <pos-list rel="http://schema.org/video">
        <template>Test</template>
      </pos-list>,
    );
    await page.waitForChanges();

    const el: HTMLElement = page.root as unknown as HTMLElement;

    expect(el.querySelectorAll('pos-resource')).toHaveLength(2);
  });

  it('renders the template for all things of the given type', async () => {
    const os = mockPodOS();
    mockOsProvider(os);
    when(os.store.observeFindMembers)
      .calledWith('http://schema.org/Recipe')
      .thenReturn(of(['https://recipe.test/1']));

    const page = await render(
      <pos-list if-typeof="http://schema.org/Recipe">
        <template>Test</template>
      </pos-list>,
    );
    await page.waitForChanges();

    const el: HTMLElement = page.root as unknown as HTMLElement;
    expect(el.querySelector('pos-resource')?.getAttribute('about')).toEqual('https://recipe.test/1');
  });

  it('displays error on missing template', async () => {
    const page = await render(<pos-list rel="http://schema.org/video"></pos-list>);
    await page.waitForChanges();

    const el: HTMLElement = page.root as unknown as HTMLElement;

    expect(el.textContent).toEqual('No template element found');
  });

  it('sets about and uri attributes on children', async () => {
    mockResource({
      relations: () => [
        {
          predicate: 'http://schema.org/video',
          label: 'url',
          uris: ['https://video.test/video-1', 'https://video.test/video-2'],
        },
      ],
    });
    const page = await render(
      <pos-list rel="http://schema.org/video">
        <template>Test</template>
      </pos-list>,
    );

    await page.waitForChanges();

    const el: HTMLElement = page.root as unknown as HTMLElement;
    const resources = el.querySelectorAll('pos-resource');

    expect(resources[0]?.getAttribute('about')).toEqual('https://video.test/video-1');
    expect(resources[1]?.getAttribute('about')).toEqual('https://video.test/video-2');
    expect(resources[0]?.getAttribute('uri')).toEqual('https://video.test/video-1');
    expect(resources[1]?.getAttribute('uri')).toEqual('https://video.test/video-2');
  });

  it('sets lazy attribute on children if fetch is not present', async () => {
    mockResource({
      relations: () => [
        {
          predicate: 'http://schema.org/video',
          label: 'url',
          uris: ['https://video.test/video-1'],
        },
      ],
    });
    const page = await render(
      <pos-list rel="http://schema.org/video">
        <template>Test</template>
      </pos-list>,
    );
    await page.waitForChanges();

    const el: HTMLElement = page.root as unknown as HTMLElement;

    expect(el.querySelector('pos-resource')?.getAttribute('lazy')).toEqual('');
  });

  it('does not set lazy attribute on children if fetch is present', async () => {
    mockResource({
      relations: () => [
        {
          predicate: 'http://schema.org/video',
          label: 'url',
          uris: ['https://video.test/video-1'],
        },
      ],
    });
    const page = await render(
      <pos-list rel="http://schema.org/video" fetch>
        <template>Test</template>
      </pos-list>,
    );
    await page.waitForChanges();

    const el: HTMLElement = page.root as unknown as HTMLElement;
    expect(el.querySelector('pos-resource')?.getAttribute('lazy')).toEqual(null);
  });
});
