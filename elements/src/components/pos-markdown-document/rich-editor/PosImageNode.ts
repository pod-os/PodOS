import Image from '@tiptap/extension-image';
import { NodeViewRenderer } from '@tiptap/core';

const allowedProtocols = new Set(['http:', 'https:']);

export const createNodeView: (baseUrl: string) => NodeViewRenderer =
  baseUrl =>
  ({ HTMLAttributes }) => {
    const container = document.createElement('pos-image');

    const uri = new URL(HTMLAttributes.src, baseUrl);
    if (allowedProtocols.has(uri.protocol)) {
      container.setAttribute('src', uri.toString());
    }
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

export const PosImageNode = (baseUrl: string) =>
  Image.extend({
    addNodeView() {
      return createNodeView(baseUrl);
    },
  });
