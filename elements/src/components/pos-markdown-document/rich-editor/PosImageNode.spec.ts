// noinspection ES6UnusedImports
import { h } from '@stencil/core';

import { createNodeView } from './PosImageNode';
import { NodeViewRendererProps } from '@tiptap/core';

describe('PosImageNode', () => {
  it('renders image relative to document', () => {
    const renderer = createNodeView('https://base.test');
    const attributes = { src: 'image.png' };
    const view = renderer({ HTMLAttributes: attributes } as unknown as NodeViewRendererProps);
    expect(view.dom).toEqualHtml(`
    <pos-image src="https://base.test/image.png"></pos-image>
`);
  });

  it('renders image with absolute src', () => {
    const renderer = createNodeView('https://base.test');
    const attributes = { src: 'https://other.test/image.png' };
    const view = renderer({ HTMLAttributes: attributes } as unknown as NodeViewRendererProps);
    expect(view.dom).toEqualHtml(`
    <pos-image src="https://other.test/image.png"></pos-image>
`);
  });

  it('renders image with absolute http (without the s) src', () => {
    const renderer = createNodeView('https://base.test');
    const attributes = { src: 'http://other.test/image.png' };
    const view = renderer({ HTMLAttributes: attributes } as unknown as NodeViewRendererProps);
    expect(view.dom).toEqualHtml(`
    <pos-image src="http://other.test/image.png"></pos-image>
`);
  });

  it('renders image with alt text', () => {
    const renderer = createNodeView('https://base.test');
    const attributes = { src: 'image.png', alt: 'alt text' };
    const view = renderer({ HTMLAttributes: attributes } as unknown as NodeViewRendererProps);
    expect(view.dom).toEqualHtml(`
    <pos-image src="https://base.test/image.png" alt="alt text"></pos-image>
`);
  });

  it('renders image with title', () => {
    const renderer = createNodeView('https://base.test');
    const attributes = { src: 'image.png', title: 'title text' };
    const view = renderer({ HTMLAttributes: attributes } as unknown as NodeViewRendererProps);
    expect(view.dom).toEqualHtml(`
    <pos-image src="https://base.test/image.png" title="title text"></pos-image>
`);
  });

  // TODO this should eventually be allowed if sanitization of data url can be guaranteed
  it('does not render image encoded as base64 data', () => {
    const renderer = createNodeView('https://base.test');
    const attributes = {
      src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    };
    const view = renderer({ HTMLAttributes: attributes } as unknown as NodeViewRendererProps);
    expect(view.dom).toEqualHtml(`
    <pos-image></pos-image>
`);
  });

  it('does not render image with malicious code in data url', () => {
    const renderer = createNodeView('https://base.test');
    const attributes = {
      src: "data:text/html,<script>alert('Protocol Handler XSS')</script>",
    };
    const view = renderer({ HTMLAttributes: attributes } as unknown as NodeViewRendererProps);
    expect(view.dom).toEqualHtml(`
    <pos-image></pos-image>
`);
  });

  //
});
