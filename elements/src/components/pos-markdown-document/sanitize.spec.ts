/**
 * @jest-environment @happy-dom/jest-environment
 *
 * => dompurify needs a real DOM to work
 */

import { sanitize } from './sanitize';

describe('sanitize', () => {
  it('removes scripts', () => {
    const { value } = sanitize("<script>alert('xss')</script>");
    expect(value).toEqual('');
  });

  it('removes click handlers', () => {
    const { value } = sanitize(`<div onclick="alert('xss')">click me</div>`);
    expect(value).toEqual('<div>click me</div>');
  });

  it('removes malicious image onerror attribute', () => {
    const { value } = sanitize(`<img src="x" onerror="alert('xss')">`);
    expect(value).toEqual('<img src="x">');
  });

  it('removes javascript protocol in URLs', () => {
    const { value } = sanitize(`<a href="javascript:alert('xss')">click me</a>`);
    expect(value).toEqual('<a>click me</a>');
  });

  it('removes malicious iframes', () => {
    const { value } = sanitize(`<iframe src="javascript:alert('xss')"></iframe>`);
    expect(value).toEqual('');
  });

  it('removes data URLs with embedded scripts', () => {
    const { value } = sanitize(`<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgneHNzJyk8L3NjcmlwdD4=">click</a>`);
    expect(value).toEqual('<a>click</a>');
  });

  it('keeps pos-rich-link elements with uri attribute', () => {
    const { value } = sanitize(`<pos-rich-link uri="https://pod.test">example</pos-rich-link>`);
    expect(value).toEqual('<pos-rich-link uri="https://pod.test">example</pos-rich-link>');
  });

  it('sanitized malicious uri in pos-rich-link', () => {
    const { value } = sanitize(`<pos-rich-link uri="javascript:alert('xss')">example</pos-rich-link>`);
    expect(value).toEqual('<pos-rich-link>example</pos-rich-link>');
  });

  it('keeps pos-image elements', () => {
    const { value } = sanitize('<pos-image src="https://pod.test/image.jpg"></pos-image>');
    expect(value).toEqual('<pos-image src="https://pod.test/image.jpg"></pos-image>');
  });

  it('removes malicious pos-image attributes', () => {
    const { value } = sanitize(`<pos-image src="javascript:alert('xss')" onerror="alert('xss')">`);
    expect(value).toEqual('<pos-image></pos-image>');
  });
});
