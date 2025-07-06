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
  @Prop() rel?: string;

  @Event({ eventName: 'pod-os:link' }) linkEmitter: EventEmitter;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: ResourceEventEmitter;

  @State() link?: string;
  @State() error: string = null;

  componentWillLoad() {
    if (!this.uri) subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    if (this.rel) {
      const links = resource.relations(this.rel);
      if (links.length == 0) {
        this.error = 'No matching link found';
      } else if (links[0].uris.length > 1) {
        this.error = 'More than one matching link found';
      } else {
        this.link = links[0].uris[0];
      }
    } else {
      this.link = resource.uri;
    }
  };

  render() {
    if (this.error) return this.error;

    const uri = this.uri || this.link;
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

    if (this.link) {
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
