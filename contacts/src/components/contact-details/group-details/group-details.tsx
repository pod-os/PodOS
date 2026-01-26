import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'pos-contacts-group-details',
})
export class GroupDetails {
  @Prop()
  uri!: string;

  render() {
    return <Host>{this.uri}</Host>;
  }
}
