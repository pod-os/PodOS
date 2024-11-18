import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'pos-predicate',
  shadow: true,
})
export class PosPredicate {
  @Prop()
  uri: string;

  @Prop()
  label: string;

  @State()
  expanded: boolean = false;

  render() {
    if (this.expanded) {
      return (
        <div>
          <a href={this.uri}>{this.uri}</a>
          <button onClick={() => (this.expanded = false)}>
            <ion-icon name="chevron-back-circle-outline"></ion-icon>
          </button>
        </div>
      );
    } else {
      return (
        <button onClick={() => (this.expanded = true)} title={this.uri}>
          {this.label}
        </button>
      );
    }
  }
}
