import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-rich-link',
  shadow: true,
})
export class PosLabel {
  @Prop() uri: string;

  render() {
    return (
      <pos-resource lazy={true} uri={this.uri}>
        <ion-item href={this.uri}>
          <ion-label>
            <h2>
              <pos-label />
            </h2>
            <p>{this.uri}</p>
          </ion-label>
        </ion-item>
      </pos-resource>
    );
  }
}
