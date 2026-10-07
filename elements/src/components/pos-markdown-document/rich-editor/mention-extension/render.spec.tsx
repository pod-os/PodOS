import { render } from './render';
import './pos-mention-menu/pos-mention-menu';
import { SuggestionProps } from '@tiptap/suggestion';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

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
    it('passes on the command function', () => {
      const { onStart } = render();
      const mount = vi.fn();
      onStart({
        mount,
        items: [],
        command: 'fake command',
      } as unknown as SuggestionProps);
      expect(mount).toHaveBeenCalled();
      const menu = mount.mock.calls[0][0];
      expect(menu).toHaveProperty('command', 'fake command');
    });
  });
  describe('onUpdate', () => {
    it('updates the menu items and command', () => {
      const { onStart, onUpdate } = render();
      const mount = vi.fn();
      onStart({
        mount,
        items: [],
        command: () => {},
      } as unknown as SuggestionProps);
      expect(mount).toHaveBeenCalled();
      const menu = mount.mock.calls[0][0];
      expect(menu).toHaveProperty('items', []);
      const items = [{ id: 'https://resource.test', label: 'Test' }];
      const command = () => {};
      onUpdate({ items, command } as unknown as SuggestionProps);
      expect(menu).toHaveProperty('items', items);
      expect(menu).toHaveProperty('command', command);
    });

    it('resets the selection when items change', () => {
      const { onStart, onUpdate, onKeyDown } = render();
      const mount = (el: HTMLElement) => {
        document.body.appendChild(el);
        return () => el.remove();
      };
      const items = [
        { id: 'https://first.test', label: 'First' },
        { id: 'https://second.test', label: 'Second' },
      ];
      onStart({ mount, items, command: () => {} } as unknown as SuggestionProps);
      const menu = document.querySelector('pos-mention-menu') as HTMLPosMentionMenuElement;

      onKeyDown({ event: new KeyboardEvent('keydown', { key: 'ArrowDown' }) });
      expect(menu.selectedIndex).toBe(1);

      onUpdate({ items } as unknown as SuggestionProps);
      expect(menu.selectedIndex).toBe(0);

      menu.remove();
    });
  });
  describe('onKeyDown', () => {
    let onStart: any;
    let onKeyDown: any;
    let menu: HTMLPosMentionMenuElement;

    beforeEach(() => {
      ({ onStart, onKeyDown } = render());
      onStart({
        items: [],
        command: () => {},
        mount: (el: HTMLElement) => {
          document.body.appendChild(el);
          return () => el.remove();
        },
      } as unknown as SuggestionProps);
      menu = document.querySelector('pos-mention-menu') as HTMLPosMentionMenuElement;
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    const setupMenu = (itemLabels: string[], command = vi.fn()) => {
      menu.items = itemLabels.map((label, i) => ({ id: `https://test/${i}`, label }));
      menu.command = command;
      return command;
    };

    it('ArrowDown selects the next item, wrapping around', () => {
      setupMenu(['First', 'Second']);
      onKeyDown({ event: new KeyboardEvent('keydown', { key: 'ArrowDown' }) });
      expect(menu.selectedIndex).toBe(1);
      onKeyDown({ event: new KeyboardEvent('keydown', { key: 'ArrowDown' }) });
      expect(menu.selectedIndex).toBe(0);
    });

    it('ArrowUp selects the previous item, wrapping around', () => {
      setupMenu(['First', 'Second']);
      onKeyDown({ event: new KeyboardEvent('keydown', { key: 'ArrowUp' }) });
      expect(menu.selectedIndex).toBe(1);
      onKeyDown({ event: new KeyboardEvent('keydown', { key: 'ArrowUp' }) });
      expect(menu.selectedIndex).toBe(0);
    });

    it('Enter confirms the currently selected item', () => {
      const command = setupMenu(['First', 'Second']);
      onKeyDown({ event: new KeyboardEvent('keydown', { key: 'ArrowDown' }) });
      onKeyDown({ event: new KeyboardEvent('keydown', { key: 'Enter' }) });
      expect(command).toHaveBeenCalledWith({ id: 'https://test/1', label: 'Second' });
    });

    it('Enter with no items does not call the command', () => {
      const command = setupMenu([]);
      const handled = onKeyDown({ event: new KeyboardEvent('keydown', { key: 'Enter' }) });
      expect(command).not.toHaveBeenCalled();
      expect(handled).toBe(true);
    });

    it('ignores other keys', () => {
      const handled = onKeyDown({ event: new KeyboardEvent('keydown', { key: 'a' }) });
      expect(handled).toBe(false);
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
