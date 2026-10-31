import Mention from '@tiptap/extension-mention';
import { mergeAttributes } from '@tiptap/core';
import { PodOS } from '@pod-os/core';
import { render } from './render';
import { items } from './items';

export function mention(os: PodOS, baseUrl: string, container: HTMLElement) {
  const searchIndex = os.buildSearchIndex();
  return Mention.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    renderHTML({ options, node }) {
      return ['pos-rich-link', mergeAttributes({ uri: node.attrs.id }, options.HTMLAttributes), node.attrs.label];
    },
    suggestion: {
      char: '#',
      dismissOnOutsideClick: false,
      container,
      debounce: 120,
      shouldShow: ({ query }) => query.length > 0,
      items: async ({ query }: { query: string }) => items(os, await searchIndex, query, baseUrl),
      render: render(os),
    },
  });
}
