import { RdfType, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Listen, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';
import { selectToolsForTypes, ToolConfig } from './selectToolsForTypes';

@Component({
  tag: 'pos-type-router',
  shadow: true,
  styleUrl: 'pos-type-router.css',
})
export class PosTypeRouter implements ResourceAware {
  @State() types: RdfType[];

  @State() selectedTool: string;
  @State() oldTool: string;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
    const urlParams = new URLSearchParams(window.location.search);
    const toolParam = urlParams.get('tool');
    if (toolParam) {
      this.selectedTool = toolParam;
    }
  }

  @Listen('pod-os:tool-selected')
  handleToolSelected(event: CustomEvent<ToolConfig>) {
    this.oldTool = this.selectedTool;
    this.selectedTool = event.detail.element;
    const url = new URL(window.location.href);
    url.searchParams.set('tool', event.detail.element);
    window.history.replaceState({}, '', url.toString());
  }

  receiveResource = (resource: Thing) => {
    this.types = resource.types();
  };

  render() {
    return this.types ? this.renderApp() : null;
  }

  private renderApp() {
    const availableTools = selectToolsForTypes(this.types);
    const tool = availableTools.find(it => it.element === this.selectedTool) ?? availableTools[0];
    const SelectedTool = tool.element;
    const OldTool = this.oldTool;
    return (
      <section>
        <pos-tool-select selected={tool} tools={availableTools}></pos-tool-select>
        <div class="tools" onAnimationEnd={() => this.removeOldTool()}>
          {OldTool && <OldTool class="tool hidden"></OldTool>}
          <SelectedTool class="tool visible"></SelectedTool>
        </div>
      </section>
    );
  }

  private removeOldTool() {
    this.oldTool = null;
  }
}
