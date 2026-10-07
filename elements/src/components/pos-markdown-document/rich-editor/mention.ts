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
        let menu: HTMLPosMentionMenuElement;
        let unmount: () => void | undefined;
        return {
          onStart: props => {
            menu = document.createElement('pos-mention-menu');
            menu.items = props.items;
            unmount = props.mount(menu);
          },
          onUpdate: props => {
            menu.items = props.items;
          },
          onExit: () => {
            unmount?.();
          },
        };
      },
    },
  });
}
