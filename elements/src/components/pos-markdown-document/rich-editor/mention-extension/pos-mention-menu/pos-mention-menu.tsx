import { Component, h, Listen, Prop } from '@stencil/core';

export interface MentionItem {
  id: string;
  label: string;
  type:
    | 'indexed' // found via search index
    | 'new-thing'; // new thing to create
}

@Component({
  tag: 'pos-mention-menu',
  styleUrls: ['pos-mention-menu.css'],
})
export class PosMentionMenu {
  /**
   * List of suggestions to display
   */
  @Prop()
  items: MentionItem[] = [];

  /**
   * Index of the currently selected suggestion
   */
  @Prop()
  selectedIndex = 0;

  /**
   * Function to call when a suggestion is selected
   */
  @Prop()
  command: (item: MentionItem) => void = () => {};

  @Listen('mousedown')
  onMouseDown(e: MouseEvent) {
    e.preventDefault();
  }

  render() {
    return (
      <ul role="listbox">
        {this.items.map((item, index) => (
          <li
            key={item.id}
            role="option"
            class={item.type}
            aria-selected={index === this.selectedIndex ? 'true' : undefined}
            onMouseDown={() => this.command(item)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    );
  }
}
