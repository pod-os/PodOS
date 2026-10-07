import Mention from '@tiptap/extension-mention';
import { mergeAttributes } from '@tiptap/core';
import { render } from './render';
import { items } from './items';

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
      items,
      render,
    },
  });
}
