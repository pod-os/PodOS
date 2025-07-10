import { newSpecPage } from '@stencil/core/testing';
import { PosRichLink } from './pos-rich-link';
import { getByText } from '@testing-library/dom';

describe('pos-rich-link with uri', () => {
  let page;
  beforeEach(async () => {
    page = await newSpecPage({
      components: [PosRichLink],
      html: `<pos-rich-link uri="https://pod.example/resource" />`,
    });
  });

  describe('contents', () => {
    it('lazy loads the linked resource', () => {
      const resource = page.root.shadowRoot.querySelector('pos-resource');
      expect(resource).not.toBeNull();
      expect(resource).toEqualAttribute('uri', 'https://pod.example/resource');
      expect(resource).toHaveAttribute('lazy');
    });

    it('shows the resource label', () => {
      const resource = page.root.shadowRoot.querySelector('pos-resource');
      const label = resource.querySelector('pos-label');
      expect(label).not.toBeNull();
    });

    it('shows the resource description', () => {
      const resource = page.root.shadowRoot.querySelector('pos-resource');
      const description = resource.querySelector('pos-description');
      expect(description).not.toBeNull();
    });

    it('shows a link to the resource', () => {
      const resource = page.root.shadowRoot.querySelector('pos-resource');
      const link = resource.querySelector('a');
      expect(link).not.toBeNull();
      expect(link).toEqualAttribute('href', 'https://pod.example/resource');
      expect(link.innerHTML).toEqual('<pos-label></pos-label>');
    });

    it('shows the host of the link', () => {
      const resource = page.root.shadowRoot.querySelector('pos-resource');
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
    const onResource = jest.fn();
    const page = await newSpecPage({
      components: [PosRichLink],
    });
    page.body.addEventListener('pod-os:resource', onResource);
    await page.setContent('<pos-rich-link uri="https://pod.example/resource" />');
    expect(onResource).toHaveBeenCalledTimes(0);
  });

  it('receives resource and sets it as link if uri is not present', async () => {
    const onResource = jest.fn();
    const page = await newSpecPage({
      components: [PosRichLink],
    });
    page.body.addEventListener('pod-os:resource', onResource);
    await page.setContent('<pos-rich-link/>');
    expect(onResource).toHaveBeenCalledTimes(1);

    await page.rootInstance.receiveResource({
      uri: 'https://pod.example/resource',
    });
    await page.waitForChanges();
    const link = page.root?.shadowRoot?.querySelector('a');
    expect(link).toEqualAttribute('href', 'https://pod.example/resource');
  });

  it('is empty if neither uri nor resource are received', async () => {
    const page = await newSpecPage({
      components: [PosRichLink],
      html: `<pos-rich-link/>`,
    });
    expect(page.root?.innerHTML).toBe('');
  });

  it('does not use pos-resource if uri is not present', async () => {
    const page = await newSpecPage({
      components: [PosRichLink],
      html: `<pos-rich-link/>`,
    });
    await page.rootInstance.receiveResource({
      uri: 'https://pod.example/resource',
    });
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.querySelector('pos-resource')).toBeNull();
  });

  it('uses the matching relation if rel prop is defined', async () => {
    const page = await newSpecPage({
      components: [PosRichLink],
      html: `<pos-rich-link rel="https://schema.org/video" />`,
    });
    await page.rootInstance.receiveResource({
      uri: 'https://pod.example/resource',
      relations: () => [{ predicate: 'https://schema.org/video', uris: ['https://video.test/video-1'] }],
    });
    await page.waitForChanges();
    const link = page.root?.shadowRoot?.querySelector('a');
    expect(link).toEqualAttribute('href', 'https://video.test/video-1');
  });

  it('displays an error if no link is found', async () => {
    const page = await newSpecPage({
      components: [PosRichLink],
      html: `<pos-rich-link rel="https://schema.org/video" />`,
    });
    await page.rootInstance.receiveResource({
      uri: 'https://pod.example/resource',
      relations: () => [],
    });
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.textContent).toEqual('No matching link found');
  });

  it('displays an error if more than one link is found', async () => {
    const page = await newSpecPage({
      components: [PosRichLink],
      html: `<pos-rich-link rel="https://schema.org/video" />`,
    });
    await page.rootInstance.receiveResource({
      uri: 'https://pod.example/resource',
      relations: () => [
        { predicate: 'https://schema.org/video', uris: ['https://video.test/video-1', 'https://video.test/video-2'] },
      ],
    });
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.textContent).toEqual('More than one matching link found');
  });
});
