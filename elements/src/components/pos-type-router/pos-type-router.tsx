import { Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Listen, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';
import { HTMLToolConfig, selectToolsForTypes, ToolConfig } from './selectToolsForTypes';

/**
 * This component is responsible for rendering tools that are useful to interact with the current resource.
 */
@Component({
  tag: 'pos-type-router',
  shadow: true,
  styleUrl: 'pos-type-router.css',
})
export class PosTypeRouter implements ResourceAware {
  @State() initialTool: string;
  @State() availableTools: ToolConfig[];
  @State() oldTool: ToolConfig;
  @State() currentTool: ToolConfig;

  @State() transitioning: boolean = false;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
    const urlParams = new URLSearchParams(window.location.search);
    const toolParam = urlParams.get('tool');
    if (toolParam) {
      this.initialTool = toolParam;
    }
  }

  @Listen('pod-os:tool-selected')
  handleToolSelected(event: CustomEvent<ToolConfig>) {
    this.oldTool = this.currentTool;
    this.currentTool = event.detail;
    this.transitioning = true;
    const url = new URL(window.location.href);
    url.searchParams.set('tool', event.detail.element);
    window.history.replaceState({}, '', url.toString());
  }

  receiveResource = (resource: Thing) => {
    const types = resource.types();
    const registeredTools = [
      {
        element: 'pos-html-tool',
        label: 'Example tool',
        icon: 'list-ul',
        types: [
          {
            uri: 'https://schema.org/Recipe',
            priority: 20,
          },
        ],
        fragment: '<pos-label/>',
      },
    ];
    this.availableTools = selectToolsForTypes(types, registeredTools);
    this.currentTool = this.availableTools.find(it => it.element === this.initialTool) ?? this.availableTools[0];
  };

  render() {
    return this.availableTools ? this.renderApp() : null;
  }

  private renderApp() {
    const SelectedTool = this.currentTool.element;
    const OldTool = this.oldTool?.element;
    return (
      <section>
        <pos-tool-select selected={this.currentTool} tools={this.availableTools}></pos-tool-select>
        <div class={{ tools: true, transition: this.transitioning }} onAnimationEnd={() => this.removeOldTool()}>
          {OldTool && <OldTool class="tool hidden"></OldTool>}
          {SelectedTool == 'pos-html-tool' ? (
            <pos-html-tool
              fragment={(this.currentTool as HTMLToolConfig).fragment}
              class="tool visible"
            ></pos-html-tool>
          ) : (
            <SelectedTool class="tool visible"></SelectedTool>
          )}
        </div>
      </section>
    );
  }

  private removeOldTool() {
    this.oldTool = null;
    this.transitioning = false;
  }
}
