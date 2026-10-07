import { render } from './render';
import { SuggestionProps } from '@tiptap/suggestion';
import { describe, expect, it, vi } from 'vitest';

describe('render', () => {
  describe('onStart', () => {
    it('mounts an empty menu', () => {
      const { onStart } = render();
      const mount = vi.fn();
      onStart({
        mount,
        items: [],
      } as unknown as SuggestionProps);
      expect(mount).toHaveBeenCalled();
      const menu = mount.mock.calls[0][0];
      expect(menu).toMatchInlineSnapshot(`<pos-mention-menu />`);
      expect(menu).toHaveProperty('items', []);
    });
    it('mounts a menu with items', () => {
      const { onStart } = render();
      const mount = vi.fn();
      const items = [{ id: 'https://resource.test', label: 'Test' }];
      onStart({
        mount,
        items,
      } as unknown as SuggestionProps);
      expect(mount).toHaveBeenCalled();
      const menu = mount.mock.calls[0][0];
      expect(menu).toMatchInlineSnapshot(`<pos-mention-menu />`);
      expect(menu).toHaveProperty('items', items);
    });
  });
  describe('onUpdate', () => {
    it('updates the menu items', () => {
      const { onStart, onUpdate } = render();
      const mount = vi.fn();
      onStart({
        mount,
        items: [],
      } as unknown as SuggestionProps);
      expect(mount).toHaveBeenCalled();
      const menu = mount.mock.calls[0][0];
      expect(menu).toMatchInlineSnapshot(`<pos-mention-menu />`);
      expect(menu).toHaveProperty('items', []);
      const items = [{ id: 'https://resource.test', label: 'Test' }];
      onUpdate({ items } as unknown as SuggestionProps);
      expect(menu).toHaveProperty('items', items);
    });
  });
  describe('onExit', () => {
    it('unmounts', () => {
      const unmount = vi.fn();
      const { onStart, onExit } = render();
      const mount = vi.fn().mockReturnValue(unmount);
      onStart({
        mount,
        items: [],
      } as unknown as SuggestionProps);
      expect(mount).toHaveBeenCalled();
      onExit();
      expect(unmount).toHaveBeenCalled();
    });
  });
});
