/**
 * @jest-environment @happy-dom/jest-environment
 *
 * => dompurify needs a real DOM to work
 */

import { sanitizeHtmlTool } from './sanitizeHtmlTool';

describe('sanitizeHtmlTool', () => {
  it('keeps whitelisted elements', () => {
    const sanitized = sanitizeHtmlTool('<pos-label></pos-label>');
    expect(sanitized).toEqual('<pos-label></pos-label>');
  });

  it('removes unknown HTML elements from fragment', () => {
    const sanitized = sanitizeHtmlTool('<unknown-element>');
    expect(sanitized).toEqual('');
  });
});
