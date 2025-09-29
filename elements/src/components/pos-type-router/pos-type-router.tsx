import { RdfType, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';
import { selectAppForTypes } from './selectAppForTypes';

@Component({
  tag: 'pos-type-router',
  shadow: true,
  styleUrl: 'pos-type-router.css',
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
    const apps = [App];
    return (
      <section>
        {apps.length > 1 ? <pos-tool-select></pos-tool-select> : null}
        <App></App>
      </section>
    );
  }
}
