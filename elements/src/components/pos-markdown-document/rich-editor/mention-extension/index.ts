import Mention from '@tiptap/extension-mention';
import { mergeAttributes } from '@tiptap/core';
import { PodOS } from '@pod-os/core';
import { render } from './render';

export function mention(os?: PodOS | Promise<PodOS>) {
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
        if (!os) {
          return [];
        }
        const resolved = await os;
        const searchIndex = await resolved.buildSearchIndex();
        return searchIndex.search(query).map(({ ref }) => {
          const thing = resolved.store.get(ref);
          return { id: ref, label: thing.label() };
        });
      },
      render,
    },
  });
}
