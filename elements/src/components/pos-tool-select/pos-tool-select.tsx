import { Component, h, Prop } from '@stencil/core';

interface Tool {}

@Component({
  tag: 'pos-tool-select',
  styleUrl: 'pos-tool-select.css',
  shadow: true,
})
export class PosToolSelect {
  @Prop()
  tools: Tool[] = [];

  render() {
    if (this.tools.length > 1) {
      return (
        <aside>
          {this.tools.map(() => (
            <button>Tool</button>
          ))}
        </aside>
      );
    }
    return null;
  }
}
