import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'pos-upload',
  styleUrl: 'pos-upload.css',
  shadow: true,
})
export class PosUpload {
  /**
   * The accepted file types, as defined by the HTML5 `accept` attribute.
   */
  @Prop()
  accept: string = 'image/*';

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
          accept={this.accept}
          onDragEnter={() => (this.dragover = true)}
          onDragLeave={() => (this.dragover = false)}
          onDrop={() => (this.dragover = false)}
        ></input>
      </form>
    );
  }
}
