import { Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Host, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../../components/events/ResourceAware';

@Component({
  tag: 'pos-app-document-viewer',
  shadow: true,
  styleUrls: ['../styles/default-app-layout.css', '../styles/article-card.css'],
})
export class PosAppDocumentViewer implements ResourceAware {
  @State() resource: Thing;

  @Event({ eventName: 'pod-os:resource' }) subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.resource = resource;
  };

  render() {
    if (!this.resource) {
      return null;
    }

    return (
      <Host>
        <section>
          <pos-document src={this.resource.uri} />
        </section>
        <section>
          <article>
            <header>
              <h1>
                <pos-label />
              </h1>
              <pos-type-badges />
            </header>
            <pos-literals />
          </article>
        </section>
      </Host>
    );
  }
}
