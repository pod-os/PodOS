import { Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { ResourceAware, ResourceEventEmitter, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-rich-link',
  shadow: true,
  styleUrl: 'pos-rich-link.css',
})
export class PosRichLink implements ResourceAware {
  /**
   * Link will use this URI
   */
  @Prop() uri?: string;
  /**
   * Link will be obtained by following the predicate with this URI forward from a resource
   */
  @Prop() rel?: string;
  /**
   * Link will be obtained by following the predicate with this URI in reverse from a resource
   */
  @Prop() rev?: string;

  @Event({ eventName: 'pod-os:link' }) linkEmitter: EventEmitter;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: ResourceEventEmitter;

  @State() link?: string;
  @State() error: string = null;

  componentWillLoad() {
    if (!this.uri) subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    if (this.rel || this.rev) {
      let links = [];
      if (this.rel) {
        links = resource.relations(this.rel);
      } else if (this.rev) {
        links = resource.reverseRelations(this.rev);
      }

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
    const content = (uri: string) => (
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

    if (this.error) {
      return this.error;
    } else if (this.link) {
      return content(this.link);
    } else if (this.uri) {
      return (
        <pos-resource lazy={true} uri={this.uri}>
          {content(this.uri)}
        </pos-resource>
      );
    } else {
      return null;
    }
  }
}
