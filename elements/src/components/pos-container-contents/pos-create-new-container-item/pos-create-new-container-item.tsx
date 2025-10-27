import { LdpContainer, PodOS } from '@pod-os/core';
import { Component, Element, h, Prop, State } from '@stencil/core';
import { usePodOS } from '../../events/usePodOS';

@Component({
  tag: 'pos-create-new-container-item',
  styleUrl: 'pos-create-new-container-item.css',
  shadow: true,
})
export class PosCreateNewContainerItem {
  @Element() el: HTMLElement;

  @Prop()
  type!: 'file' | 'folder';

  @Prop()
  container!: LdpContainer;

  @State()
  os: PodOS;

  @State()
  name: string;

  input: HTMLInputElement;

  async componentWillLoad() {
    this.os = await usePodOS(this.el);
  }

  handleInput = (e: InputEvent) => {
    this.name = (e.target as HTMLInputElement).value;
  };

  componentDidLoad() {
    this.input.focus();
  }

  render() {
    const placeholder = `Enter ${this.type} name`;
    return (
      <form onSubmit={e => this.submit(e)}>
        <sl-icon name={this.getIcon()}></sl-icon>
        <input
          type="text"
          value={this.name}
          onInput={e => this.handleInput(e)}
          placeholder={placeholder}
          ref={it => (this.input = it)}
        ></input>
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

  private async submit(e: Event) {
    e.preventDefault();
    if (this.type === 'file') {
      await this.os.files().createNewFile(this.container, this.name);
    } else {
      await this.os.files().createNewFolder(this.container, this.name);
    }
  }
}
