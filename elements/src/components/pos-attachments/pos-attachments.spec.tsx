jest.mock('../events/useResource');

import '@testing-library/jest-dom';
import { newSpecPage } from '@stencil/core/testing';
import { screen, within } from '@testing-library/dom';
import { PosAttachments } from './pos-attachments';
import { useResource } from '../events/useResource';

import { when } from 'jest-when';
import { Thing } from '@pod-os/core';

describe('pos-attachments', () => {
  it('renders message when thing has no attachments', async () => {
    when(useResource).mockResolvedValue({
      attachments: jest.fn().mockReturnValue([]),
    } as unknown as Thing);

    const page = await newSpecPage({
      components: [PosAttachments],
      html: `<pos-attachments />`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-attachments>
        No attachments found.
      </pos-attachments>
    `);
  });

  it('shows a single attachment', async () => {
    // Given: a thing with one attachment
    const mockAttachment = {
      uri: 'http://example.com/file.pdf',
      label: 'Sample Document',
    };

    when(useResource).mockResolvedValue({
      attachments: jest.fn().mockReturnValue([mockAttachment]),
    } as unknown as Thing);

    // When: the component renders
    const page = await newSpecPage({
      components: [PosAttachments],
      html: `<pos-attachments />`,
      supportsShadowDom: false,
    });

    // Then: the attachment is displayed as a link
    expect(page.root).toEqualHtml(`
      <pos-attachments>
        <ul>
          <li>
            <pos-rich-link uri="http://example.com/file.pdf"></pos-rich-link>
          </li>
        </ul>
      </pos-attachments>`);
  });
});
