import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-contacts-list-address-books',
})
export class ListAddressBooks {
  @Prop()
  webId!: string;
  render() {
    return <div>TODO: list address books of {this.webId}</div>;
  }
}
