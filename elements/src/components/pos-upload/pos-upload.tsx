import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';

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

  /**
   * Fires when files are selected from the file input.
   */
  @Event({ eventName: 'pod-os:files-selected' }) filesSelected: EventEmitter<FileList>;

  @State() dragover: boolean = false;

  private readonly handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.filesSelected.emit(input.files);
    }
  };

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
          onChange={this.handleChange}
        ></input>
      </form>
    );
  }
}
