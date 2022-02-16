import { newSpecPage } from '@stencil/core/testing';
import { PosRichLink } from './pos-rich-link';

describe('pos-rich-link', () => {
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
      expect(link.innerText).toEqual('https://pod.example/resource');
    });
  });
});
