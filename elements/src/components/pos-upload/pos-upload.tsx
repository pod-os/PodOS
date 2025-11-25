import { Component, h, Prop } from '@stencil/core';

import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import ImageEditor from '@uppy/image-editor';
import { ResultAsync } from 'neverthrow';
import { HttpProblem, NetworkProblem } from '@pod-os/core';

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
      })
      .use(ImageEditor);
    uppy.setOptions({
      restrictions: {
        allowedFileTypes: this.accept,
      },
    });
    uppy.addUploader(async fileIds => {
      const files = uppy.getFilesByIds(fileIds);
      uppy.emit('upload-start', files);

      for (const file of files) {
        if (file.data instanceof File) {
          await this.uploader(file.data)
            .map(() => {
              uppy.emit('upload-success', file, { status: 201 });
            })
            .mapErr(it => uppy.emit('upload-error', file, new Error(it.title + ' - ' + it.detail)));
        } else {
          uppy.emit('upload-error', file, new Error('Expected file to be a File object'));
        }
      }
    });
  }

  render() {
    return <div class="container" ref={el => (this.uppy = el)}></div>;
  }
}
