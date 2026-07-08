import { vi } from 'vitest';
import { beforeEach, describe, expect, h, it, render, RenderResult } from '@stencil/vitest';
import { getByText } from '@testing-library/dom';
import { when } from 'vitest-when';

import './pos-rich-link';

describe('pos-rich-link with uri', () => {
  let page: RenderResult;
  beforeEach(async () => {
    page = await render(<pos-rich-link uri="https://pod.example/resource"></pos-rich-link>);
  });

  describe('contents', () => {
    it('lazy loads the linked resource', () => {
      const resource = page.root.shadowRoot!.querySelector('pos-resource');
      expect(resource).not.toBeNull();
      expect(resource).toEqualAttribute('uri', 'https://pod.example/resource');
      expect(resource).toHaveAttribute('lazy');
    });

    it('shows the resource label', () => {
      const resource = page.root.shadowRoot!.querySelector('pos-resource')!;
      const label = resource.querySelector('pos-label');
      expect(label).not.toBeNull();
    });

    it('shows the resource description', () => {
      const resource = page.root.shadowRoot!.querySelector('pos-resource')!;
      const description = resource.querySelector('pos-description');
      expect(description).not.toBeNull();
    });

    it('shows a link to the resource', () => {
      const resource = page.root.shadowRoot!.querySelector('pos-resource')!;
      const link = resource.querySelector('a')!;
      expect(link).not.toBeNull();
      expect(link).toEqualAttribute('href', 'https://pod.example/resource');
      expect(link.innerHTML).toEqual('<pos-label></pos-label>');
    });

    it('shows the host of the link', () => {
      const resource = page.root.shadowRoot!.querySelector('pos-resource')!;
      expect(getByText(resource, 'pod.example')).toEqualHtml(`
      <span class="url">
        pod.example
      </span>
      `);
    });
  });
});

describe('pos-rich-link without uri', () => {
  it('does not emit pod-os:resource event if uri is present', async () => {
    const onResource = vi.fn();
    document.addEventListener('pod-os:resource', onResource);
    await render(<pos-rich-link uri="https://pod.example/resource"></pos-rich-link>);
    expect(onResource).toHaveBeenCalledTimes(0);
  });

  it('receives resource and sets it as link if uri is not present', async () => {
    const onResource = vi.fn();
    document.addEventListener('pod-os:resource', onResource);
    const page = await render(<pos-rich-link></pos-rich-link>);
    expect(onResource).toHaveBeenCalledTimes(1);

    await page.instance.receiveResource({
      uri: 'https://pod.example/resource',
    });
    await page.waitForChanges();
    const link = page.root?.shadowRoot?.querySelector('a');
    expect(link).toEqualAttribute('href', 'https://pod.example/resource');
  });

  it('is empty if neither uri nor resource are received', async () => {
    const page = await render(<pos-rich-link></pos-rich-link>);
    expect(page.root).toBeEmptyDOMElement();
  });

  it('does not use pos-resource if uri is not present', async () => {
    const page = await render(<pos-rich-link></pos-rich-link>);
    await page.instance.receiveResource({
      uri: 'https://pod.example/resource',
    });
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.querySelector('pos-resource')).toBeNull();
  });

  it('uses the matching relation if rel prop is defined', async () => {
    const page = await render(<pos-rich-link rel="https://schema.org/video"></pos-rich-link>);
    const thing = {
      uri: 'https://pod.example/resource',
      relations: vi.fn(),
    };
    when(thing.relations)
      .calledWith('https://schema.org/video')
      .thenReturn([{ predicate: 'https://schema.org/video', uris: ['https://video.test/video-1'] }]);

    await page.instance.receiveResource(thing);
    await page.waitForChanges();
    const link = page.root?.shadowRoot?.querySelector('a');
    expect(link).toEqualAttribute('href', 'https://video.test/video-1');
  });

  it('uses the matching relation if rev prop is defined', async () => {
    const page = await render(<pos-rich-link rev="https://schema.org/video"></pos-rich-link>);
    const thing = {
      uri: 'https://video.test/video-1',
      reverseRelations: vi.fn(),
    };
    when(thing.reverseRelations)
      .calledWith('https://schema.org/video')
      .thenReturn([{ predicate: 'https://schema.org/video', uris: ['https://pod.example/resource'] }]);

    await page.instance.receiveResource(thing);
    await page.waitForChanges();
    const link = page.root?.shadowRoot?.querySelector('a');
    expect(link).toEqualAttribute('href', 'https://pod.example/resource');
  });

  it('displays and emits an error if no link is found', async () => {
    const page = await render(<pos-rich-link rel="https://schema.org/video"></pos-rich-link>);
    const errorListener = vi.fn();
    page.root.addEventListener('pod-os:error', errorListener);
    await page.instance.receiveResource({
      uri: 'https://pod.example/resource',
      relations: () => [],
    });
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.textContent).toEqual('No matching link found');
    expect(errorListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: new Error(
          'pos-rich-link: No matching link found from https://pod.example/resource rel=https://schema.org/video',
        ),
      }),
    );
  });

  it('displays and emits an error if more than one link is found', async () => {
    const page = await render(<pos-rich-link rel="https://schema.org/video"></pos-rich-link>);
    const errorListener = vi.fn();
    page.root.addEventListener('pod-os:error', errorListener);

    await page.instance.receiveResource({
      uri: 'https://pod.example/resource',
      relations: () => [
        { predicate: 'https://schema.org/video', uris: ['https://video.test/video-1', 'https://video.test/video-2'] },
      ],
    });
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.textContent).toEqual('More than one matching link found');
    expect(errorListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: new Error(
          'pos-rich-link: More than one matching link found from https://pod.example/resource rel=https://schema.org/video',
        ),
      }),
    );
  });
});

describe('pos-rich-link with slot', () => {
  it('uses slotted text if present with specified uri', async () => {
    const page = await render(<pos-rich-link uri="https://pod.example/resource">Link text</pos-rich-link>);
    expect(page.root).toMatchInlineSnapshot(`
      <pos-rich-link class="hydrated">
        <mock:shadow-root>
          <pos-resource lazy uri="https://pod.example/resource">
            <a href="https://pod.example/resource">
              <slot></slot>
            </a>
          </pos-resource>
        </mock:shadow-root>
        Link text
      </pos-rich-link>
    `);
  });

  it('uses slotted element if present with specified uri', async () => {
    const page = await render(
      <pos-rich-link uri="https://pod.example/resource">
        <pos-label />
      </pos-rich-link>,
    );
    expect(page.root).toMatchInlineSnapshot(`
      <pos-rich-link class="hydrated">
        <mock:shadow-root>
          <pos-resource lazy uri="https://pod.example/resource">
            <a href="https://pod.example/resource">
              <slot></slot>
            </a>
          </pos-resource>
        </mock:shadow-root>
        <pos-label></pos-label>
      </pos-rich-link>
    `);
  });

  it('uses slotted text if present with received resource ', async () => {
    const page = await render(<pos-rich-link>Link text</pos-rich-link>);
    await page.instance.receiveResource({
      uri: 'https://pod.example/resource',
    });
    await page.waitForChanges();
    expect(page.root).toMatchInlineSnapshot(`
      <pos-rich-link class="hydrated">
        <mock:shadow-root>
          <a href="https://pod.example/resource">
            <slot></slot>
          </a>
        </mock:shadow-root>
        Link text
      </pos-rich-link>
    `);
  });

  it('uses slotted element if present with received resource ', async () => {
    const page = await render(
      <pos-rich-link>
        <pos-label />
      </pos-rich-link>,
    );
    await page.instance.receiveResource({
      uri: 'https://pod.example/resource',
    });
    await page.waitForChanges();
    expect(page.root).toMatchInlineSnapshot(`
      <pos-rich-link class="hydrated">
        <mock:shadow-root>
          <a href="https://pod.example/resource">
            <slot></slot>
          </a>
        </mock:shadow-root>
        <pos-label></pos-label>
      </pos-rich-link>
    `);
  });
});
