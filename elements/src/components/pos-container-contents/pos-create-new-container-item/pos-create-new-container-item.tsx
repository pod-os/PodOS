import { LdpContainer } from '@pod-os/core';
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-create-new-container-item',
  styleUrl: 'pos-create-new-container-item.css',
  shadow: true,
})
export class PosCreateNewContainerItem {
  @Prop()
  type!: 'file' | 'folder';

  @Prop()
  container!: LdpContainer;

  input: HTMLInputElement;

  componentDidLoad() {
    this.input.focus();
  }

  render() {
    const placeholder = `Enter ${this.type} name`;
    return (
      <form onSubmit={e => this.submit(e)}>
        <sl-icon name={this.getIcon()}></sl-icon>
        <input type="text" placeholder={placeholder} ref={it => (this.input = it)}></input>
      </form>
    );
  }

  private getIcon() {
    if (this.type === 'file') {
      return 'file-earmark-plus';
    } else {
      return 'folder-plus';
    }
  }

  private submit(evt: Event) {
    evt.preventDefault();
    console.log('submit new ', this.type);
  }
}
