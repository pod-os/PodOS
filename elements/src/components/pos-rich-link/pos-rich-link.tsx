import { Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-rich-link',
  shadow: true,
  styleUrl: 'pos-rich-link.css',
})
export class PosRichLink implements ResourceAware {
  @Prop() uri?: string;

  @Event({ eventName: 'pod-os:link' }) linkEmitter: EventEmitter;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: ResourceEventEmitter;

  @State() resource?: Thing;

  componentWillLoad() {
    if (!this.uri) subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.resource = resource;
  };

  render() {
    const uri = this.uri || this.resource?.uri;
    if (!uri) return null;

    const content = (
      <p class="content">
        <a
          href={uri}
          onClick={e => {
            e.preventDefault();
            this.linkEmitter.emit(uri);
          }}
        >
          <pos-label />
        </a>
        <span class="url">{new URL(uri).host}</span>
        <pos-description />
      </p>
    );

    if (this.resource) {
      return content;
    } else if (this.uri) {
      return (
        <pos-resource lazy={true} uri={this.uri}>
          {content}
        </pos-resource>
      );
    }
  }
}
