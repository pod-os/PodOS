import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { ToolConfig } from '../pos-type-router/selectToolsForTypes';

import './shoelace';

@Component({
  tag: 'pos-tool-select',
  styleUrl: 'pos-tool-select.css',
  shadow: true,
})
export class PosToolSelect {
  @Prop()
  tools: ToolConfig[] = [];

  @Event({ eventName: 'pod-os:tool-selected' })
  toolSelected: EventEmitter<ToolConfig>;

  render() {
    if (this.tools.length > 1) {
      return (
        <aside>
          {this.tools.map(it => (
            <button onClick={() => this.toolSelected.emit(it)}>
              <sl-icon name="list-ul"></sl-icon>
              <span class="text">{it.label}</span>
            </button>
          ))}
        </aside>
      );
    }
    return null;
  }
}
