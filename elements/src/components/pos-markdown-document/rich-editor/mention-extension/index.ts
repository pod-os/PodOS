import Mention from '@tiptap/extension-mention';
import { mergeAttributes } from '@tiptap/core';
import { PodOS } from '@pod-os/core';
import { render } from './render';

export function mention(os: PodOS) {
  return Mention.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    renderHTML({ options, node }) {
      return ['pos-rich-link', mergeAttributes({ uri: node.attrs.id }, options.HTMLAttributes), node.attrs.label];
    },
    suggestion: {
      char: '#',
      items: async ({ query }: { query: string }) => {
        const searchIndex = await os.buildSearchIndex();
        return searchIndex.search(query).map(({ ref }) => {
          const thing = os.store.get(ref);
          return { id: ref, label: thing.label() };
        });
      },
      render,
    },
  });
}
