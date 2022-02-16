import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-rich-link',
  shadow: true,
})
export class PosRichLink {
  @Prop() uri: string;

  @Event({ eventName: 'pod-os:link' }) linkEmitter: EventEmitter;

  render() {
    return (
      <pos-resource lazy={true} uri={this.uri}>
        <ion-item
          href={this.uri}
          onClick={e => {
            e.preventDefault();
            this.linkEmitter.emit(this.uri);
          }}
        >
          <ion-label>
            <h2>
              <pos-label />
            </h2>
            <p>
              <ion-label style={{ maxWidth: '50rem' }}>
                <pos-description />
              </ion-label>
            </p>
            <p>
              <a href={this.uri}>{this.uri}</a>
            </p>
          </ion-label>
        </ion-item>
      </pos-resource>
    );
  }
}
