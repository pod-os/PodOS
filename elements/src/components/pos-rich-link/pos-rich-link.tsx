import { Relation, Thing } from '@pod-os/core';
import { Component, Element, Event, EventEmitter, h, Prop, State } from '@stencil/core';
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

  @Event({ eventName: 'pod-os:error' }) errorEmitter: EventEmitter;

  @State() link?: string;
  @State() followPredicate: boolean = false;
  @State() error: string = null;

  @Element() host: HTMLElement;

  @State()
  private customContent: boolean = false;

  componentWillLoad() {
    this.customContent = !!this.host.lastElementChild || this.host.textContent.trim() != '';
    if (!this.uri) subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    const addLink = (links: Relation[], resource: Thing, predicate: string, direction: string) => {
      if (links.length == 0) {
        this.error = 'No matching link found';
        this.errorEmitter.emit(
          new Error(`pos-rich-link: No matching link found from ${resource.uri} ${direction}=${predicate}`),
        );
      } else if (links[0].uris.length > 1) {
        this.error = 'More than one matching link found';
        this.errorEmitter.emit(
          new Error(`pos-rich-link: More than one matching link found from ${resource.uri} ${direction}=${predicate}`),
        );
      } else {
        this.link = links[0].uris[0];
        this.followPredicate = true;
      }
    };

    if (this.rel) {
      addLink(resource.relations(this.rel), resource, this.rel, 'rel');
    } else if (this.rev) {
      addLink(resource.reverseRelations(this.rev), resource, this.rev, 'rev');
    } else {
      this.link = resource.uri;
    }
  };

  render() {
    const content = (uri: string) =>
      this.customContent ? (
        <a
          href={uri}
          onClick={e => {
            e.preventDefault();
            this.linkEmitter.emit(uri);
          }}
        >
          <slot></slot>
        </a>
      ) : (
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
    } else if (this.followPredicate) {
      return (
        <pos-resource lazy={true} uri={this.link}>
          {content(this.link)}
        </pos-resource>
      );
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
