vi.mock('../../components/events/usePodOS');
vi.mock('../../components/events/useResource');

import { Mock, vi } from 'vitest';
import { describe, expect, it, render, h } from '@stencil/vitest';
import { PodOS, Thing } from '@pod-os/core';
import { ok } from 'neverthrow';
import { usePodOS } from '../../components/events/usePodOS';
import { useResource } from '../../components/events/useResource';

import './pos-tool-attachments';

describe('pos-tool-attachments', () => {
  it('renders', async () => {
    // given a thing that can receive attachments
    const mockThing = {
      uri: 'https://pod.test/things/thing1',
      editable: true,
    } as Thing;

    (useResource as Mock).mockResolvedValue(mockThing);

    // when the component renders
    const page = await render(<pos-tool-attachments></pos-tool-attachments>);

    // then it shows a list and an upload feature
    expect(page.root.shadowRoot).toEqualHtml(`
      <section>
        <article>
          <h2>
            Attachments
          </h2>
          <pos-attachments></pos-attachments>
        </article>
      </section>
      <section>
        <pos-upload></pos-upload>
      </section>
    `);
  });

  it('uploads and links file when file is selected for upload', async () => {
    // given: a thing that can receive attachments
    const mockThing = {
      uri: 'https://pod.test/things/thing1',
      editable: true,
    } as Thing;

    (useResource as Mock).mockResolvedValue(mockThing);

    // and: a PodOS instance with an attachment gateway that can upload
    const mockUploadAndAddAttachment = vi.fn().mockReturnValue(
      ok({
        url: 'https://pod.test/things/document.pdf',
        name: 'document.pdf',
        contentType: 'application/pdf',
      }),
    );

    const mockOs = {
      attachments: vi.fn().mockReturnValue({
        uploadAndAddAttachment: mockUploadAndAddAttachment,
      }),
    } as unknown as PodOS;

    (usePodOS as Mock).mockResolvedValue(mockOs);

    // when: the component renders
    const page = await render(<pos-tool-attachments></pos-tool-attachments>);

    (page.instance as any).attachmentsElement = {
      addToList: vi.fn(),
    };

    // and: a file is selected for upload
    const testFile = new File(['test content'], 'document.pdf', {
      type: 'application/pdf',
    });
    const uploadElement = page.root.shadowRoot!.querySelector('pos-upload') as any;
    const uploaderFn = uploadElement.uploader;
    await uploaderFn(testFile);

    // then: the file should be uploaded and linked to the thing
    expect(mockUploadAndAddAttachment).toHaveBeenCalledWith(mockThing, testFile);

    // and: the list should be updated
    expect((page.instance as any).attachmentsElement.addToList).toHaveBeenCalledWith({
      uri: 'https://pod.test/things/document.pdf',
      label: 'document.pdf',
    });
  });

  it('does not show pos-upload if resource is not editable', async () => {
    // given: a resource that is not editable
    const mockThing = {
      uri: 'https://pod.test/things/thing1',
      editable: false,
    } as Thing;

    (useResource as Mock).mockResolvedValue(mockThing);

    // and: a PodOS instance
    const mockOs = {
      attachments: vi.fn().mockReturnValue({
        uploadAndAddAttachment: vi.fn(),
      }),
    } as unknown as PodOS;

    (usePodOS as Mock).mockResolvedValue(mockOs);

    // when: the component renders
    const page = await render(<pos-tool-attachments></pos-tool-attachments>);

    // then: the pos-upload element should not be present
    expect(page.root.shadowRoot!.querySelector('pos-upload')).toBeNull();
  });
});
