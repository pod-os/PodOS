import { SuggestionProps } from '@tiptap/suggestion';
import { MentionNodeAttrs } from '@tiptap/extension-mention';

export const render = () => {
  let menu: HTMLPosMentionMenuElement;
  let unmount: () => void | undefined;
  return {
    onStart: (props: SuggestionProps<any, MentionNodeAttrs>) => {
      menu = document.createElement('pos-mention-menu');
      menu.items = props.items;
      menu.selectedIndex = 0;
      menu.command = props.command;
      unmount = props.mount(menu);
    },
    onUpdate: (props: SuggestionProps<any, MentionNodeAttrs>) => {
      menu.items = props.items;
      menu.selectedIndex = 0;
      menu.command = props.command;
    },
    onExit: () => {
      unmount?.();
    },
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      switch (event.key) {
        case 'ArrowDown':
          menu.selectedIndex = (menu.selectedIndex + 1) % menu.items.length;
          return true;
        case 'ArrowUp':
          menu.selectedIndex = (menu.selectedIndex - 1 + menu.items.length) % menu.items.length;
          return true;
        case 'Enter': {
          const item = menu.items[menu.selectedIndex];
          if (item) {
            menu.command(item);
          }
          return true;
        }
        default:
          return false;
      }
    },
  };
};
