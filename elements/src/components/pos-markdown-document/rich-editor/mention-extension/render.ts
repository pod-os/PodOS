import { SuggestionProps } from '@tiptap/suggestion';
import { MentionNodeAttrs } from '@tiptap/extension-mention';
import { processSelectedMention } from './processSelectedMention';
import { PodOS } from '@pod-os/core';
import { EditorView } from '@tiptap/pm/view';

function selectOption(menu: HTMLPosMentionMenuElement, selectedIndex: number, view: EditorView) {
  menu.selectedIndex = selectedIndex;
  view.dom.setAttribute('aria-activedescendant', `pos-mention-menu-option-${selectedIndex + 1}`);
}

export const render = (os: PodOS) => () => {
  let menu: HTMLPosMentionMenuElement;
  let unmount: () => void | undefined;

  return {
    onStart: (props: SuggestionProps<any, MentionNodeAttrs>) => {
      menu = document.createElement('pos-mention-menu');
      menu.items = props.items;
      props.editor.view.dom.setAttribute('aria-controls', 'pos-mention-menu-listbox');
      menu.command = processSelectedMention(os, props.command);
      unmount = props.mount(menu);
      selectOption(menu, 0, props.editor.view);
    },
    onUpdate: (props: SuggestionProps<any, MentionNodeAttrs>) => {
      menu.items = props.items;
      selectOption(menu, 0, props.editor.view);
      menu.command = processSelectedMention(os, props.command);
    },
    onExit: (props: SuggestionProps<any, MentionNodeAttrs>) => {
      props.editor.view.dom.removeAttribute('aria-controls');
      props.editor.view.dom.removeAttribute('aria-activedescendant');
      unmount?.();
    },
    onKeyDown: ({ event, view }: { event: KeyboardEvent; view: EditorView }) => {
      switch (event.key) {
        case 'ArrowDown':
          selectOption(menu, (menu.selectedIndex + 1) % menu.items.length, view);
          return true;
        case 'ArrowUp':
          selectOption(menu, (menu.selectedIndex - 1 + menu.items.length) % menu.items.length, view);
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
