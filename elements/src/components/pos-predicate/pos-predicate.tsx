import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-predicate',
})
export class PosPredicate {
  @Prop()
  uri: string;

  @Prop()
  label: string;

  render() {
    return <ion-label title={this.uri}>{this.label}</ion-label>;
  }
}
