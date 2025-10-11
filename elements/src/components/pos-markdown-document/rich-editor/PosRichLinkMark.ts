import Link from '@tiptap/extension-link';

export const PosRichLinkMark = (baseUrl: string) =>
  Link.extend({
    addMarkView() {
      return ({ HTMLAttributes }) => {
        const container = document.createElement('pos-rich-link');
        const uri = new URL(HTMLAttributes.href, baseUrl);
        container.setAttribute('uri', uri.toString());

        return {
          dom: container,
          contentDOM: container,
          /**
           * ignoreMutation because:
           * - `pos-rich-link` handles its own internal DOM updates
           * - We don't want the editor to interfere with the component's internal structure
           * - The component content shouldn't trigger editor updates
           */
          ignoreMutation: () => true,
        };
      };
    },
  });
