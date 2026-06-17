import { Mock, vi } from 'vitest';
import { describe, expect, h, it, render } from '@stencil/vitest';
import { useResource } from '../events/useResource';
import { Thing } from '@pod-os/core';

import './pos-attachments';

vi.mock('../events/useResource');

describe('pos-attachments', () => {
  it('renders message when thing has no attachments', async () => {
    (useResource as Mock).mockResolvedValue({
      attachments: vi.fn().mockReturnValue([]),
    } as unknown as Thing);

    const page = await render(<pos-attachments></pos-attachments>);

    expect(page.root.shadowRoot).toEqualHtml('No attachments found.');
  });

  it('shows a single attachment', async () => {
    // Given: a thing with one attachment
    const mockAttachment = {
      uri: 'http://example.com/file.pdf',
      label: 'Sample Document',
    };

    (useResource as Mock).mockResolvedValue({
      attachments: vi.fn().mockReturnValue([mockAttachment]),
    } as unknown as Thing);

    // When: the component renders
    const page = await render(<pos-attachments></pos-attachments>);

    // Then: the attachment is displayed as a link
    expect(page.root.shadowRoot).toEqualHtml(`
        <ul>
          <li class>
            <pos-rich-link uri="http://example.com/file.pdf"></pos-rich-link>
          </li>
        </ul>
      `);
  });

  describe('addToList', () => {
    it('adds an attachment to the list', async () => {
      const initialAttachment = {
        uri: 'http://example.com/existing.pdf',
        label: 'Existing Document',
      };

      (useResource as Mock).mockResolvedValue({
        attachments: vi.fn().mockReturnValue([initialAttachment]),
      } as unknown as Thing);

      const page = await render(<pos-attachments></pos-attachments>);

      const newAttachment = {
        uri: 'http://example.com/new.pdf',
        label: 'New Document',
      };

      await page.instance.addToList(newAttachment);
      await page.waitForChanges();

      expect(page.root.shadowRoot).toEqualHtml(`
          <ul>
            <li class>
              <pos-rich-link uri="http://example.com/existing.pdf"></pos-rich-link>
            </li>
            <li class="new">
              <pos-rich-link uri="http://example.com/new.pdf"></pos-rich-link>
            </li>
          </ul>`);
    });
  });
});
