import { vi } from 'vitest';
import { describe, expect, h, it, render } from '@stencil/vitest';

import './pos-mention-menu';
import { fireEvent } from '@testing-library/dom';
import { MentionItem } from './pos-mention-menu';

describe('pos-mention-menu', () => {
  it('does not render when empty', async () => {
    const page = await render(
      <pos-mention-menu items={[]} controls={document.createElement('div')}></pos-mention-menu>,
    );

    expect(page.root).toBeEmptyDOMElement();
  });

  it('renders single option', async () => {
    const items = [
      {
        id: 'https://resource.test',
        label: 'Something',
        type: 'indexed',
      },
    ] as MentionItem[];
    const page = await render(
      <pos-mention-menu items={items} controls={document.createElement('div')}></pos-mention-menu>,
    );

    expect(page.root).toMatchInlineSnapshot(`
      <pos-mention-menu class="hydrated">
        <ul role="listbox" id="pos-mention-menu-listbox">
          <li id="pos-mention-menu-option-1" role="option" class="indexed" aria-selected="true">
            Something
          </li>
        </ul>
      </pos-mention-menu>
    `);
  });

  it('renders only a create option', async () => {
    const items = [
      {
        id: 'https://resource.test',
        label: 'New Thing',
        type: 'new-thing',
      },
    ] as MentionItem[];
    const page = await render(
      <pos-mention-menu items={items} controls={document.createElement('div')}></pos-mention-menu>,
    );

    expect(page.root).toMatchInlineSnapshot(`
      <pos-mention-menu class="hydrated">
        <ul role="listbox" id="pos-mention-menu-listbox">
          <li id="pos-mention-menu-option-1" role="option" class="new-thing" aria-selected="true">
            Create 'New Thing'
          </li>
        </ul>
      </pos-mention-menu>
`);
  });

  it('renders multiple options', async () => {
    const items = [
      {
        id: 'https://first.test',
        label: 'First',
        type: 'indexed',
      },
      {
        id: 'https://second.test',
        label: 'Second',
        type: 'indexed',
      },
    ] as MentionItem[];
    const page = await render(
      <pos-mention-menu items={items} controls={document.createElement('div')}></pos-mention-menu>,
    );

    expect(page.root).toMatchInlineSnapshot(`
      <pos-mention-menu class="hydrated">
        <ul role="listbox" id="pos-mention-menu-listbox">
          <li id="pos-mention-menu-option-1" role="option" class="indexed" aria-selected="true">
            First
          </li>
          <li id="pos-mention-menu-option-2" role="option" class="indexed">
            Second
          </li>
        </ul>
      </pos-mention-menu>
    `);
  });

  it('calls the command when option is selected', async () => {
    const command = vi.fn();
    const item = {
      id: 'https://resource.test',
      label: 'Something',
      type: 'indexed',
    } as MentionItem;
    const page = await render(
      <pos-mention-menu items={[item]} command={command} controls={document.createElement('div')}></pos-mention-menu>,
    );

    const option = page.root.querySelector('li[role="option"]')!;
    fireEvent(option, new MouseEvent('mousedown', { bubbles: true, cancelable: true, composed: true }));
    await page.waitForChanges();
    expect(command).toHaveBeenCalledWith(item);
  });

  describe('keyboard navigation', () => {
    it('preselects the first option', async () => {
      const page = await render(
        <pos-mention-menu
          items={[
            { id: 'https://first.test', label: 'First', type: 'indexed' },
            { id: 'https://second.test', label: 'Second', type: 'indexed' },
          ]}
          controls={document.createElement('div')}
        ></pos-mention-menu>,
      );

      await page.waitForChanges();
      expect(page.root.querySelector('li:first-child')).toEqualAttribute('aria-selected', 'true');
    });

    it('highlights the item at selectedIndex', async () => {
      const page = await render(
        <pos-mention-menu
          selectedIndex={1}
          items={[
            { id: 'https://first.test', label: 'First', type: 'indexed' },
            { id: 'https://second.test', label: 'Second', type: 'indexed' },
          ]}
          controls={document.createElement('div')}
        ></pos-mention-menu>,
      );

      await page.waitForChanges();
      expect(page.root.querySelector('li:nth-child(2)')).toEqualAttribute('aria-selected', 'true');
    });
  });

  describe('active descendant', () => {
    const items = [
      { id: 'https://first.test', label: 'First', type: 'indexed' },
      { id: 'https://second.test', label: 'Second', type: 'indexed' },
    ] as MentionItem[];

    it('points the controlling element to the selected option once it is rendered', async () => {
      const controls = document.createElement('div');
      const page = await render(<pos-mention-menu controls={controls} items={items}></pos-mention-menu>);

      await page.waitForChanges();
      expect(controls).toHaveAttribute('aria-activedescendant', 'pos-mention-menu-option-1');
    });

    it('follows the selected index', async () => {
      const controls = document.createElement('div');
      const page = await render(
        <pos-mention-menu controls={controls} selectedIndex={1} items={items}></pos-mention-menu>,
      );

      await page.waitForChanges();
      expect(controls).toHaveAttribute('aria-activedescendant', 'pos-mention-menu-option-2');
    });

    it('removes the attribute while the options are still loading', async () => {
      const controls = document.createElement('div');
      controls.setAttribute('aria-activedescendant', 'pos-mention-menu-option-1');
      const page = await render(<pos-mention-menu controls={controls} items={[]}></pos-mention-menu>);

      await page.waitForChanges();
      expect(controls).not.toHaveAttribute('aria-activedescendant');
    });

    it('removes the attribute when the menu is disconnected', async () => {
      const controls = document.createElement('div');
      const page = await render(<pos-mention-menu controls={controls} items={items}></pos-mention-menu>);

      await page.waitForChanges();
      expect(controls).toHaveAttribute('aria-activedescendant', 'pos-mention-menu-option-1');

      // when the menu is removed
      page.root.remove();

      // the editor does not announce an active descendant anymore
      expect(controls).not.toHaveAttribute('aria-activedescendant');
    });
  });
});
