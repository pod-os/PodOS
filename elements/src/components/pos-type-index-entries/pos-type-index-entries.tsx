import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'pos-type-index-entries',
})
export class PosTypeIndexEntries {
  @Prop() uri: string;

  render() {
    return <Host></Host>;
  }
}
