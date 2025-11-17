import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'pos-upload',
  styleUrl: 'pos-upload.css',
  shadow: true,
})
export class PosUpload {
  @State() dragover: boolean = false;

  render() {
    return (
      <form>
        <input
          class={{
            dragover: this.dragover,
          }}
          type="file"
          multiple
          accept="image/*"
          onDragEnter={() => (this.dragover = true)}
          onDragLeave={() => (this.dragover = false)}
          onDrop={() => (this.dragover = false)}
        ></input>
      </form>
    );
  }
}
