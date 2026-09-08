/**
 * @jest-environment @happy-dom/jest-environment
 *
 * => dompurify needs a real DOM to work
 */
import { sanitizeHtmlTool } from '../pos-html-tool/sanitizeHtmlTool';

describe('pos-label', () => {
  it('is whitelisted by sanitizeHtmlTool', () => {
    const sanitized = sanitizeHtmlTool('<pos-label/>');
    expect(sanitized).toEqual('<pos-label></pos-label>');
  });
});
