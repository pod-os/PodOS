import { vi } from 'vitest';
import { beforeEach, describe, expect, it, render, h } from '@stencil/vitest';

const setOptions = vi.fn();
const addUploader = vi.fn();
const getFilesByIds = vi.fn();
const emit = vi.fn();

vi.mock('@uppy/core', () => ({
  default: class {
    use = vi.fn().mockImplementation(() => this);
    setOptions = setOptions;
    addUploader = addUploader;
    getFilesByIds = getFilesByIds;
    emit = emit;
  },
}));

vi.mock('@uppy/dashboard', () => ({ default: {} }));
vi.mock('@uppy/image-editor', () => ({ default: {} }));
vi.mock('@uppy/webcam', () => ({ default: {} }));

import './pos-upload';
import { when } from 'vitest-when';
import { err, ok } from 'neverthrow';
import { HttpProblem } from '@pod-os/core';

describe('pos-upload', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders a div as a host for uppy', async () => {
    const page = await render(<pos-upload></pos-upload>);
    expect(page.root.shadowRoot).toEqualHtml(`
        <div class="container"></div>
    `);
  });

  it('accepts image file types by default', async () => {
    await render(<pos-upload></pos-upload>);
    expect(setOptions).toHaveBeenCalledWith({
      restrictions: {
        allowedFileTypes: ['image/*'],
      },
    });
  });

  it('can accept other file types', async () => {
    await render(<pos-upload accept={['application/pdf']}></pos-upload>);
    expect(setOptions).toHaveBeenCalledWith({
      restrictions: {
        allowedFileTypes: ['application/pdf'],
      },
    });
  });

  it('uses the uploader function to successfully upload a single file', async () => {
    // given an upload component with an upload function that works fine
    const uploadFn = vi.fn().mockReturnValue(ok({ url: 'https://pod.test/image.png' }));
    await render(<pos-upload uploader={uploadFn}></pos-upload>);

    // and a single file has been selected for upload
    const filesToUpload = [{ data: new File([''], 'image.png', { type: 'image/png' }) }];
    when(getFilesByIds).calledWith(['image.png']).thenReturn(filesToUpload);

    // when upload is triggered for the file
    expect(addUploader).toHaveBeenCalled();
    const uploader = addUploader.mock.calls[0][0];
    await uploader(['image.png']);

    // then the upload start is promoted
    expect(emit).toHaveBeenCalledWith('upload-start', filesToUpload);

    // and upload-success is promoted for the file
    expect(emit).toHaveBeenCalledWith('upload-success', filesToUpload[0], { status: 201 });

    // and the upload function is called with the file
    expect(uploadFn).toHaveBeenCalledWith(filesToUpload[0].data);
  });

  it('uses the uploader function to successfully upload a blob as new file', async () => {
    // given an upload component with an upload function that works fine
    const uploadFn = vi.fn().mockReturnValue(ok({ url: 'https://pod.test/image.png' }));
    await render(<pos-upload uploader={uploadFn}></pos-upload>);

    // and a single blob has been selected for upload
    const filesToUpload = [{ data: new Blob(['file to upload']), name: 'file.txt', type: 'text/plain' }];
    when(getFilesByIds).calledWith(['file.txt']).thenReturn(filesToUpload);

    // when upload is triggered for the file
    expect(addUploader).toHaveBeenCalled();
    const uploader = addUploader.mock.calls[0][0];
    await uploader(['file.txt']);

    // then the upload start is promoted
    expect(emit).toHaveBeenCalledWith('upload-start', filesToUpload);

    // and upload-success is promoted for the file
    expect(emit).toHaveBeenCalledWith('upload-success', filesToUpload[0], { status: 201 });

    // and the upload function is called with the file
    expect(uploadFn).toHaveBeenCalled();
    const uploadedFile: File = uploadFn.mock.calls[0][0];
    expect(uploadedFile instanceof File).toBeTruthy();
    // @ts-ignore
    expect(Buffer.from(await uploadedFile.arrayBuffer()).toString()).toEqual('file to upload');
    expect(uploadedFile.name).toEqual('file.txt');
    expect(uploadedFile.type).toEqual('text/plain');
  });

  it('uses the uploader function to successfully upload multiple files', async () => {
    // given an upload component with an upload function that works fine
    const uploadFn = vi.fn().mockReturnValue(ok({ url: 'https://pod.test/image.png' }));
    await render(<pos-upload uploader={uploadFn}></pos-upload>);

    // and multiple files have been selected for upload
    const filesToUpload = [
      { data: new File([''], 'image.png', { type: 'image/png' }) },
      { data: new File([''], 'file.pdf', { type: 'application/pdf' }) },
    ];
    when(getFilesByIds).calledWith(['image.png', 'file.pdf']).thenReturn(filesToUpload);

    // when upload is triggered for the files
    expect(addUploader).toHaveBeenCalled();
    const uploader = addUploader.mock.calls[0][0];
    await uploader(['image.png', 'file.pdf']);

    // then the upload start is promoted
    expect(emit).toHaveBeenCalledWith('upload-start', filesToUpload);

    // and upload-success is promoted for each file
    expect(emit).toHaveBeenCalledWith('upload-success', filesToUpload[0], { status: 201 });
    expect(emit).toHaveBeenCalledWith('upload-success', filesToUpload[1], { status: 201 });
  });

  it('promotes the failure of a file upload', async () => {
    // given an upload component with an upload function that fails
    const problem: HttpProblem = {
      type: 'http',
      title: 'Failed',
      detail: 'Some details about the failure',
      status: 429,
    };
    const uploadFn = vi.fn().mockReturnValue(err(problem));
    await render(<pos-upload uploader={uploadFn}></pos-upload>);

    // and a single file has been selected for upload
    const filesToUpload = [{ data: new File([''], 'image.png', { type: 'image/png' }) }];
    when(getFilesByIds).calledWith(['image.png']).thenReturn(filesToUpload);

    // when upload is triggered for the file
    expect(addUploader).toHaveBeenCalled();
    const uploader = addUploader.mock.calls[0][0];
    await uploader(['image.png']);

    // then the upload start is promoted
    expect(emit).toHaveBeenCalledWith('upload-start', filesToUpload);

    // and upload-error is promoted for the file containing problem title and details
    expect(emit).toHaveBeenCalledWith(
      'upload-error',
      filesToUpload[0],
      new Error('Failed - Some details about the failure'),
    );
  });

  it('can upload one file, while failing the other', async () => {
    // given an upload component with an upload function that works fine for only one of two files
    const workingFile = new File(['working'], 'works.png', { type: 'image/png' });
    const failingFile = new File(['failing'], 'fails.pdf', { type: 'application/pdf' });

    const uploadFn = vi.fn();
    when(uploadFn)
      .calledWith(workingFile)
      .thenReturn(ok({ url: 'https://pod.test/works.png' }));
    when(uploadFn)
      .calledWith(failingFile)
      .thenReturn(
        err({
          type: 'http',
          title: 'Failed',
          detail: 'Some details about the failure',
          status: 429,
        }),
      );
    await render(<pos-upload uploader={uploadFn}></pos-upload>);

    // and multiple files have been selected for upload
    const filesToUpload = [{ data: workingFile }, { data: failingFile }];
    when(getFilesByIds).calledWith(['works.png', 'fails.pdf']).thenReturn(filesToUpload);

    // when upload is triggered for the files
    expect(addUploader).toHaveBeenCalled();
    const uploader = addUploader.mock.calls[0][0];
    await uploader(['works.png', 'fails.pdf']);

    // then the upload start is promoted
    expect(emit).toHaveBeenCalledWith('upload-start', filesToUpload);

    // and upload-success is promoted for the working file
    expect(emit).toHaveBeenCalledWith('upload-success', filesToUpload[0], { status: 201 });
    // but upload-error is promoted for the failing file containing problem title and details
    expect(emit).toHaveBeenCalledWith(
      'upload-error',
      filesToUpload[1],
      new Error('Failed - Some details about the failure'),
    );
  });

  it('throws error if selected items are no File or Blob for some reason', async () => {
    // given an upload component with an upload function
    const uploadFn = vi.fn();
    await render(<pos-upload uploader={uploadFn}></pos-upload>);

    // and a single file has been selected for upload
    const fileToUpload = [{ data: { size: 123 } }];
    when(getFilesByIds).calledWith(['image.png']).thenReturn(fileToUpload);

    // when upload is triggered for the file
    expect(addUploader).toHaveBeenCalled();
    const uploader = addUploader.mock.calls[0][0];
    await uploader(['image.png']);

    // then the upload start is promoted
    expect(emit).toHaveBeenCalledWith('upload-start', fileToUpload);

    // and upload-error is promoted for the blob
    expect(emit).toHaveBeenCalledWith(
      'upload-error',
      fileToUpload[0],
      new Error('Unknow data type - Expected file to be a File or Blob object'),
    );

    // and the upload function is not called
    expect(uploadFn).not.toHaveBeenCalled();
  });
});
