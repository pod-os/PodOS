import { Component, h } from '@stencil/core';

@Component({
  tag: 'pos-tool-select',
  styleUrl: 'pos-tool-select.css',
  shadow: true,
})
export class PosToolSelect {
  render() {
    return (
      <aside>
        <button>A</button>
        <button>B</button>
        <button>C</button>
        <button>D</button>
        <button>E</button>
        <button>F</button>
        <button>G</button>
        <button>H</button>
      </aside>
    );
  }
}
