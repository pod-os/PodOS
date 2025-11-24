// noinspection ES6UnusedImports
import { h } from '@stencil/core';

const setOptions = jest.fn();
const addUploader = jest.fn();
const getFilesByIds = jest.fn();
const emit = jest.fn();

class MockUppy {
  use = jest.fn().mockImplementation(() => this);
  setOptions = setOptions;
  addUploader = addUploader;
  getFilesByIds = getFilesByIds;
  emit = emit;
}

jest.mock('@uppy/core', () => MockUppy);
jest.mock('@uppy/dashboard', () => ({}));

import { newSpecPage } from '@stencil/core/testing';
import { PosUpload } from './pos-upload';
import { when } from 'jest-when';
import { err, ok } from 'neverthrow';
import { HttpProblem } from '@pod-os/core';

describe('pos-upload', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders a div as a host for uppy', async () => {
    const page = await newSpecPage({
      components: [PosUpload],
      html: `<pos-upload />`,
      supportsShadowDom: false,
    });
    expect(page.root).toEqualHtml(`
      <pos-upload>
        <div class="container"></div>
      </pos-upload>
    `);
  });

  it('accepts image file types by default', async () => {
    await newSpecPage({
      components: [PosUpload],
      template: () => <pos-upload />,
    });
    expect(setOptions).toHaveBeenCalledWith({
      restrictions: {
        allowedFileTypes: ['image/*'],
      },
    });
  });

  it('can accept other file types', async () => {
    await newSpecPage({
      components: [PosUpload],
      template: () => <pos-upload accept={['application/pdf']} />,
    });
    expect(setOptions).toHaveBeenCalledWith({
      restrictions: {
        allowedFileTypes: ['application/pdf'],
      },
    });
  });

  it('uses the uploader function to successfully upload a single file', async () => {
    // given an upload component with an upload function that works fine
    const uploadFn = jest.fn().mockReturnValue(ok({ url: 'https://pod.test/image.png' }));
    await newSpecPage({
      components: [PosUpload],
      template: () => <pos-upload uploader={uploadFn} />,
    });

    // and a single file has been selected for upload
    const filesToUpload = [{ data: new File([''], 'image.png', { type: 'image/png' }) }];
    when(getFilesByIds).calledWith(['image.png']).mockReturnValue(filesToUpload);

    // when upload is triggered for the file
    expect(addUploader).toHaveBeenCalled();
    const uploader = addUploader.mock.calls[0][0];
    await uploader(['image.png']);

    // then the upload start is promoted
    expect(emit).toHaveBeenCalledWith('upload-start', filesToUpload);

    // and upload-success is promoted for the file
    expect(emit).toHaveBeenCalledWith('upload-success', filesToUpload[0], { status: 201 });
  });

  it('uses the uploader function to successfully upload multiple files', async () => {
    // given an upload component with an upload function that works fine
    const uploadFn = jest.fn().mockReturnValue(ok({ url: 'https://pod.test/image.png' }));
    await newSpecPage({
      components: [PosUpload],
      template: () => <pos-upload uploader={uploadFn} />,
    });

    // and multiple files have been selected for upload
    const filesToUpload = [
      { data: new File([''], 'image.png', { type: 'image/png' }) },
      { data: new File([''], 'file.pdf', { type: 'application/pdf' }) },
    ];
    when(getFilesByIds).calledWith(['image.png', 'file.pdf']).mockReturnValue(filesToUpload);

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
    const uploadFn = jest.fn().mockReturnValue(err(problem));
    await newSpecPage({
      components: [PosUpload],
      template: () => <pos-upload uploader={uploadFn} />,
    });

    // and a single file has been selected for upload
    const filesToUpload = [{ data: new File([''], 'image.png', { type: 'image/png' }) }];
    when(getFilesByIds).calledWith(['image.png']).mockReturnValue(filesToUpload);

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

    const uploadFn = jest.fn();
    when(uploadFn)
      .calledWith(workingFile)
      .mockReturnValue(ok({ url: 'https://pod.test/works.png' }));
    when(uploadFn)
      .calledWith(failingFile)
      .mockReturnValue(
        err({
          type: 'http',
          title: 'Failed',
          detail: 'Some details about the failure',
          status: 429,
        }),
      );
    await newSpecPage({
      components: [PosUpload],
      template: () => <pos-upload uploader={uploadFn} />,
    });

    // and multiple files have been selected for upload
    const filesToUpload = [{ data: workingFile }, { data: failingFile }];
    when(getFilesByIds).calledWith(['works.png', 'fails.pdf']).mockReturnValue(filesToUpload);

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

  it('throws error if selected items are no File for some reason', async () => {
    // given an upload component with an upload function
    const uploadFn = jest.fn();
    await newSpecPage({
      components: [PosUpload],
      template: () => <pos-upload uploader={uploadFn} />,
    });

    // and a single file has been selected for upload
    const blobToUpload = [{ data: new Blob([''], { type: 'image/png' }) }];
    when(getFilesByIds).calledWith(['image.png']).mockReturnValue(blobToUpload);

    // when upload is triggered for the file
    expect(addUploader).toHaveBeenCalled();
    const uploader = addUploader.mock.calls[0][0];
    await uploader(['image.png']);

    // then the upload start is promoted
    expect(emit).toHaveBeenCalledWith('upload-start', blobToUpload);

    // and upload-error is promoted for the blob
    expect(emit).toHaveBeenCalledWith('upload-error', blobToUpload[0], new Error('Expected file to be a File object'));

    // and the upload function is not called
    expect(uploadFn).not.toHaveBeenCalled();
  });
});
