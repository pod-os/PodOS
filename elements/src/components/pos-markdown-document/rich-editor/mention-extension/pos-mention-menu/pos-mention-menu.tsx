import { Component, h, Prop } from '@stencil/core';

export interface MentionItem {
  id: string;
  label: string;
}

@Component({
  tag: 'pos-mention-menu',
})
export class PosMentionMenu {
  @Prop()
  items: MentionItem[] = [];

  render() {
    return (
      <sl-menu>
        {this.items.map(item => (
          <sl-menu-item key={item.id}>{item.label}</sl-menu-item>
        ))}
      </sl-menu>
    );
  }
}
