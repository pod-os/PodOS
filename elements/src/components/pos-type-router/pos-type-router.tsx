import { RdfType, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';
import { selectAppForTypes } from './selectAppForTypes';

@Component({
  tag: 'pos-type-router',
  shadow: true,
})
export class PosTypeRouter implements ResourceAware {
  @State() types: RdfType[];

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
    const App = selectAppForTypes(this.types);
    return <App />;
  }
}
