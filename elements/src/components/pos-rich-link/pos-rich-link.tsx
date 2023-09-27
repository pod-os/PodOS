import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-rich-link',
  shadow: true,
  styleUrl: 'pos-rich-link.css',
})
export class PosRichLink {
  @Prop() uri: string;

  @Event({ eventName: 'pod-os:link' }) linkEmitter: EventEmitter;

  render() {
    return (
      <a
        class="container"
        href={this.uri}
        onClick={e => {
          e.preventDefault();
          this.linkEmitter.emit(this.uri);
        }}
      >
        <pos-resource lazy={true} uri={this.uri}>
          <p class="content">
            <pos-label />
            <pos-description />
            <a class="uri" href={this.uri}>
              {this.uri}
            </a>
          </p>
        </pos-resource>
      </a>
    );
  }
}
