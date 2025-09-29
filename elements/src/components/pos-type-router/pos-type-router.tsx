import { RdfType, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';
import { selectToolsForTypes } from './selectToolsForTypes';

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
    const availableTools = selectToolsForTypes(this.types);
    const SelectedTool = availableTools[0].element;
    return (
      <section>
        <pos-tool-select tools={availableTools}></pos-tool-select>
        <SelectedTool></SelectedTool>
      </section>
    );
  }
}
