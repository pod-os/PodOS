import { Component, h, Prop } from '@stencil/core';
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

  render() {
    console.log('toos', this.tools);
    if (this.tools.length > 1) {
      return (
        <aside>
          {this.tools.map(it => (
            <button>
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
