// noinspection ES6UnusedImports
import { h } from '@stencil/core';

import { createMarkViewRenderer } from './PosRichLinkMark';
import { MarkViewRendererProps } from '@tiptap/core';

describe('PosRichLinkMark', () => {
  it('renders empty href relative to base url', () => {
    const renderer = createMarkViewRenderer('https://link.example');
    const view = renderer({
      HTMLAttributes: { href: '' },
    } as unknown as MarkViewRendererProps);
    const expected = '<pos-rich-link uri="https://link.example/" />';
    expect(view.dom).toEqualHtml(expected);
    expect(view.contentDOM).toEqualHtml(expected);
  });
  it('renders absolute href', () => {
    const renderer = createMarkViewRenderer('https://link.example');
    const view = renderer({
      HTMLAttributes: { href: 'https://other.example' },
    } as unknown as MarkViewRendererProps);
    const expected = '<pos-rich-link uri="https://other.example/" />';
    expect(view.dom).toEqualHtml(expected);
    expect(view.contentDOM).toEqualHtml(expected);
  });
  it('renders relative href relative to base url', () => {
    const renderer = createMarkViewRenderer('https://link.example');
    const view = renderer({
      HTMLAttributes: { href: '/path/to/resource#it' },
    } as unknown as MarkViewRendererProps);
    const expected = '<pos-rich-link uri="https://link.example/path/to/resource#it" />';
    expect(view.dom).toEqualHtml(expected);
    expect(view.contentDOM).toEqualHtml(expected);
  });
  it('renders mailto url', () => {
    const renderer = createMarkViewRenderer('https://link.example');
    const view = renderer({
      HTMLAttributes: { href: 'mailto:alice@mail.test' },
    } as unknown as MarkViewRendererProps);
    const expected = '<pos-rich-link uri="mailto:alice@mail.test" />';
    expect(view.dom).toEqualHtml(expected);
    expect(view.contentDOM).toEqualHtml(expected);
  });
  it('renders tel url', () => {
    const renderer = createMarkViewRenderer('https://link.example');
    const view = renderer({
      HTMLAttributes: { href: 'tel:+123456789' },
    } as unknown as MarkViewRendererProps);
    const expected = '<pos-rich-link uri="tel:+123456789" />';
    expect(view.dom).toEqualHtml(expected);
    expect(view.contentDOM).toEqualHtml(expected);
  });

  it('renders http (without the s) url', () => {
    const renderer = createMarkViewRenderer('https://link.example');
    const view = renderer({
      HTMLAttributes: { href: 'http://url.test' },
    } as unknown as MarkViewRendererProps);
    const expected = '<pos-rich-link uri="http://url.test/" />';
    expect(view.dom).toEqualHtml(expected);
    expect(view.contentDOM).toEqualHtml(expected);
  });

  it.each([
    'javascript:alert("XSS")',
    'JavaScript:alert("XSS")',
    'JAVASCRIPT:alert("XSS")',
    'JaVaScRiPt:alert("XSS")',
    'javaSCRIPT:alert("XSS")',
    'vbscript:msgbox("XSS")',
    'data:whatever',
  ])('does not render urls with potentially malicious content', href => {
    const renderer = createMarkViewRenderer('https://link.example');
    const view = renderer({
      HTMLAttributes: { href },
    } as unknown as MarkViewRendererProps);
    const expected = '<pos-rich-link />';
    expect(view.dom).toEqualHtml(expected);
    expect(view.contentDOM).toEqualHtml(expected);
  });
});
