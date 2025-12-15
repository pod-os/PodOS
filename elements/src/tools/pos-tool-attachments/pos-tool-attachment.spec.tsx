jest.mock('../../components/events/usePodOS');
jest.mock('../../components/events/useResource');

import { newSpecPage } from '@stencil/core/testing';
import { PosToolAttachments } from './pos-tool-attachments';
import { PodOS, Thing } from '@pod-os/core';
import { ok } from 'neverthrow';
import { when } from 'jest-when';
import { usePodOS } from '../../components/events/usePodOS';
import { useResource } from '../../components/events/useResource';

describe('pos-tool-attachments', () => {
  it('renders', async () => {
    // given a thing that can receive attachments
    const mockThing = {
      uri: 'https://pod.test/things/thing1',
      editable: true,
    } as Thing;

    when(useResource).mockResolvedValue(mockThing);

    // when the component renders
    const page = await newSpecPage({
      components: [PosToolAttachments],
      html: `<pos-tool-attachments />`,
      supportsShadowDom: false,
    });

    // then it shows a list and an upload feature
    expect(page.root).toEqualHtml(`
      <pos-tool-attachments>
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
      </pos-tool-attachments>
    `);
  });

  it('uploads and links file when file is selected for upload', async () => {
    // given: a thing that can receive attachments
    const mockThing = {
      uri: 'https://pod.test/things/thing1',
      editable: true,
    } as Thing;

    when(useResource).mockResolvedValue(mockThing);

    // and: a PodOS instance with an attachment gateway that can upload
    const mockUploadAndAddAttachment = jest.fn().mockReturnValue(
      ok({
        url: 'https://pod.test/things/document.pdf',
        name: 'document.pdf',
        contentType: 'application/pdf',
      }),
    );

    const mockOs = {
      attachments: jest.fn().mockReturnValue({
        uploadAndAddAttachment: mockUploadAndAddAttachment,
      }),
    } as unknown as PodOS;

    when(usePodOS).mockResolvedValue(mockOs);

    // when: the component renders
    const page = await newSpecPage({
      components: [PosToolAttachments],
      html: `<pos-tool-attachments />`,
      supportsShadowDom: false,
    });

    page.rootInstance.attachmentsElement = {
      addToList: jest.fn(),
    };

    // and: a file is selected for upload
    const testFile = new File(['test content'], 'document.pdf', {
      type: 'application/pdf',
    });
    const uploadElement = page.root?.querySelector('pos-upload') as any;
    const uploaderFn = uploadElement.uploader;
    await uploaderFn(testFile);

    // then: the file should be uploaded and linked to the thing
    expect(mockUploadAndAddAttachment).toHaveBeenCalledWith(mockThing, testFile);

    // and: the list should be updated
    expect(page.rootInstance.attachmentsElement.addToList).toHaveBeenCalledWith({
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

    when(useResource).mockResolvedValue(mockThing);

    // and: a PodOS instance
    const mockOs = {
      attachments: jest.fn().mockReturnValue({
        uploadAndAddAttachment: jest.fn(),
      }),
    } as unknown as PodOS;

    when(usePodOS).mockResolvedValue(mockOs);

    // when: the component renders
    const page = await newSpecPage({
      components: [PosToolAttachments],
      html: `<pos-tool-attachments />`,
      supportsShadowDom: false,
    });

    // then: the pos-upload element should not be present
    expect(page.root?.querySelector('pos-upload')).toBeNull();
  });
});
