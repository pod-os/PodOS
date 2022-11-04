import { Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-type-router',
  shadow: true,
})
export class PosTypeRouter implements ResourceAware {
  @State() types: string[];

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.types = resource.types();
  };

  render() {
    return this.types ? this.renderApp() : null;
  }

  private renderApp() {
    if (this.types.includes('http://www.w3.org/2007/ont/link#RDFDocument')) {
      return <pos-app-rdf-document />;
    } else {
      return <pos-app-generic />;
    }
  }
}