import { Component, h, Prop } from '@stencil/core';

import Uppy, { Meta, UppyFile } from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import ImageEditor from '@uppy/image-editor';
import Webcam from '@uppy/webcam';
import { err, ok, Result, ResultAsync } from 'neverthrow';
import { HttpProblem, NetworkProblem, Problem } from '@pod-os/core';

@Component({
  tag: 'pos-upload',
  styleUrl: 'pos-upload.css',
  shadow: true,
})
export class PosUpload {
  /**
   * The accepted file types.
   */
  @Prop()
  accept: string[] = ['image/*'];

  @Prop() uploader: (file: File) => ResultAsync<{ url: string }, HttpProblem | NetworkProblem>;

  uppy: HTMLElement;

  componentDidRender() {
    const uppy = new Uppy()
      .use(Dashboard, {
        inline: true,
        target: this.uppy,
        theme: 'auto',
      })
      .use(ImageEditor)
      .use(Webcam, { modes: ['picture'], showVideoSourceDropdown: true });
    uppy.setOptions({
      restrictions: {
        allowedFileTypes: this.accept,
      },
    });
    uppy.addUploader(async fileIds => {
      const files = uppy.getFilesByIds(fileIds);
      uppy.emit('upload-start', files);

      for (const file of files) {
        await this.toFile(file)
          .asyncAndThen(it => this.uploader(it))
          .match(
            () => uppy.emit('upload-success', file, { status: 201 }),
            error => {
              uppy.emit('upload-error', file, new Error(error.title + ' - ' + error.detail));
            },
          );
      }
    });
  }

  toFile(file: UppyFile<Meta, Record<string, never>>): Result<File, Problem> {
    if (file.data instanceof File) {
      return ok(file.data);
    } else if (file.data instanceof Blob) {
      return ok(new File([file.data], file.name, { type: file.type }));
    } else {
      return err({ type: 'file', title: 'Unknow data type', detail: 'Expected file to be a File or Blob object' });
    }
  }

  render() {
    return <div class="container" ref={el => (this.uppy = el)}></div>;
  }
}
