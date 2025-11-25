/**
 * @jest-environment @happy-dom/jest-environment
 *
 * => dompurify needs a real DOM to work
 */

import { newSpecPage } from '@stencil/core/testing';
import { PosHtmlTool } from './pos-html-tool';

describe('pos-html-tool', () => {
  it('inserts sanitized HTML into the page', async () => {
    const page = await newSpecPage({
      components: [PosHtmlTool],
      html: `<pos-html-tool/>`,
    });
    page.rootInstance.fragment = '<pos-label></pos-label>';
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml('<pos-label></pos-label>');
  });
});
