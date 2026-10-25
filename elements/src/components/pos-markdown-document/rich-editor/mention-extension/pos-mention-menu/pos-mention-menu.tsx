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

  /**
   * Element that announces the active descendant of the listbox, typically the
   * editor that controls it via aria-controls
   */
  @Prop()
  controls!: HTMLElement;

  componentDidRender() {
    if (this.items.length > 0) {
      this.controls.setAttribute('aria-activedescendant', `pos-mention-menu-option-${this.selectedIndex + 1}`);
    } else {
      this.controls.removeAttribute('aria-activedescendant');
    }
  }

  disconnectedCallback() {
    this.controls.removeAttribute('aria-activedescendant');
  }

  @Listen('mousedown')
  onMouseDown(e: MouseEvent) {
    e.preventDefault();
  }

  render() {
    if (this.items.length === 0) {
      return null;
    }
    return (
      <ul role="listbox" id="pos-mention-menu-listbox">
        {this.items.map((item, index) => (
          <li
            id={`pos-mention-menu-option-${index + 1}`}
            key={item.id}
            role="option"
            class={item.type}
            aria-selected={index === this.selectedIndex ? 'true' : undefined}
            onMouseDown={() => this.command(item)}
          >
            {item.type === 'new-thing' ? `Create '${item.label}'` : item.label}
          </li>
        ))}
      </ul>
    );
  }
}
