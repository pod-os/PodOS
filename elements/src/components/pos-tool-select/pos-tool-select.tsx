import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { ToolConfig } from '../pos-type-router/selectToolsForTypes';

import './shoelace';

/**
 * Allows selecting a tool from within a set of available tools
 */
@Component({
  tag: 'pos-tool-select',
  styleUrl: 'pos-tool-select.css',
  shadow: true,
})
export class PosToolSelect {
  /**
   * The tool that is currently selected
   */
  @Prop()
  selected: ToolConfig;

  /**
   * All tools that are available
   */
  @Prop()
  tools: ToolConfig[] = [];

  @Event({ eventName: 'pod-os:tool-selected' })
  toolSelected: EventEmitter<ToolConfig>;

  render() {
    if (this.tools.length > 1) {
      return (
        <div role="tablist" aria-label="Tools" aria-multiselectable="false">
          {this.tools.map(it => (
            <button
              role="tab"
              aria-selected={this.selected?.element === it.element}
              onClick={() => this.toolSelected.emit(it)}
            >
              <sl-icon name={it.icon}></sl-icon>
              <span class="text">{it.label}</span>
            </button>
          ))}
        </div>
      );
    }
    return null;
  }
}
