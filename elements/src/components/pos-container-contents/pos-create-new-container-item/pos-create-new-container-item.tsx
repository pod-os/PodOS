import { LdpContainer } from '@pod-os/core';
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-create-new-container-item',
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
    return <input type="text" placeholder={placeholder} ref={it => (this.input = it)}></input>;
  }
}
