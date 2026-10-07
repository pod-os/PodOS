import { Component, h, Listen, Prop } from '@stencil/core';

import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';

export interface MentionItem {
  id: string;
  label: string;
}

@Component({
  tag: 'pos-mention-menu',
})
export class PosMentionMenu {
  /**
   * List of suggestions to display
   */
  @Prop()
  items: MentionItem[] = [];

  /**
   * Function to call when a suggestion is selected
   */
  @Prop()
  command: (item: MentionItem) => void = () => {};

  @Listen('sl-select')
  async onSelect(e: CustomEvent<{ item: { value: MentionItem } }>) {
    this.command(e.detail.item.value);
  }

  render() {
    return (
      <sl-menu>
        {this.items.map(item => (
          <sl-menu-item key={item.id} value={item}>
            {item.label}
          </sl-menu-item>
        ))}
      </sl-menu>
    );
  }
}
