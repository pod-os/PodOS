import Image from '@tiptap/extension-image';

export const PosImageNode = (baseUrl: string) =>
  Image.extend({
    addNodeView() {
      return ({ HTMLAttributes }) => {
        const container = document.createElement('pos-image');

        const uri = new URL(HTMLAttributes.src, baseUrl);
        container.setAttribute('src', uri.toString());
        let attrsToKeep = ['alt', 'title'];
        for (const attr of attrsToKeep) {
          if (HTMLAttributes[attr]) {
            container.setAttribute(attr, HTMLAttributes[attr]);
          }
        }

        return {
          dom: container,
          /**
           * ignoreMutation because:
           * - `pos-image` handles its own internal DOM updates
           * - We don't want the editor to interfere with the component's internal structure
           * - The component content shouldn't trigger editor updates
           */
          ignoreMutation: () => true,
        };
      };
    },
  });
