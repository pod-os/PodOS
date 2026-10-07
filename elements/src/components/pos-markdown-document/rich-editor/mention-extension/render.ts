import { SuggestionProps } from '@tiptap/suggestion';
import { MentionNodeAttrs } from '@tiptap/extension-mention';

export const render = () => {
  let menu: HTMLPosMentionMenuElement;
  let unmount: () => void | undefined;
  return {
    onStart: (props: SuggestionProps<any, MentionNodeAttrs>) => {
      menu = document.createElement('pos-mention-menu');
      menu.items = props.items;
      unmount = props.mount(menu);
    },
    onUpdate: (props: SuggestionProps<any, MentionNodeAttrs>) => {
      menu.items = props.items;
    },
    onExit: () => {
      unmount?.();
    },
  };
};
