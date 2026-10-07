import Mention from '@tiptap/extension-mention';
import { mergeAttributes } from '@tiptap/core';

export function mention() {
  return Mention.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    renderHTML({ options, node }) {
      return ['pos-rich-link', mergeAttributes({ uri: node.attrs.id }, options.HTMLAttributes), node.attrs.label];
    },
    suggestion: {
      char: '#',
      items: ({ query }) => {
        return [
          { id: 'http://localhost:3000/alice/profile/card#me', label: 'Alice' },
          { id: 'http://localhost:3000/bob/profile/card#me', label: 'Bob' },
          { id: 'http://localhost:3000/carol/profile/card#me', label: 'Carol' },
        ].filter(person => person.label.toLowerCase().includes(query.toLowerCase()));
      },

      render: () => {
        let popup: HTMLElement;
        let unmount: () => void | undefined;
        return {
          onStart: props => {
            popup = document.createElement('sl-menu');
            props.items.forEach(item => {
              const button = document.createElement('sl-menu-item');
              button.textContent = item.label;
              button.addEventListener('click', () => props.command(item));
              popup.appendChild(button);
            });
            unmount = props.mount(popup);
          },
          onUpdate: props => {
            popup.innerHTML = '';
            props.items.forEach(item => {
              const button = document.createElement('sl-menu-item');
              button.textContent = item.label;
              button.addEventListener('click', () => props.command(item));
              popup.appendChild(button);
            });
          },
          onExit: () => {
            unmount?.();
            popup.remove();
          },
        };
      },
    },
  });
}
