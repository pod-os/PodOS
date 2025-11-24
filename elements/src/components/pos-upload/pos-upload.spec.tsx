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
import { waitFor } from '@testing-library/dom';
import { when } from 'jest-when';
import { err, ok, Ok, ResultAsync } from 'neverthrow';
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
        <div></div>
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
    uploader(['image.png']);

    // then the upload start is promoted
    expect(emit).toHaveBeenCalledWith('upload-start', filesToUpload);

    // and upload-success is promoted for the file
    expect(emit).toHaveBeenCalledWith('upload-success', filesToUpload[0], { status: 201 });
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
    uploader(['image.png']);

    // then the upload start is promoted
    expect(emit).toHaveBeenCalledWith('upload-start', filesToUpload);

    // and upload-error is promoted for the file containing problem title and details
    expect(emit).toHaveBeenCalledWith(
      'upload-error',
      filesToUpload[0],
      new Error('Failed - Some details about the failure'),
    );
  });
});
