import { vi } from 'vitest';
import { describe, expect, h, it, render } from '@stencil/vitest';

import './pos-mention-menu';
import { fireEvent } from '@testing-library/dom';
import { MentionItem } from './pos-mention-menu';

describe('pos-mention-menu', () => {
  it('does not render when empty', async () => {
    const page = await render(<pos-mention-menu items={[]}></pos-mention-menu>);

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
    const page = await render(<pos-mention-menu items={items}></pos-mention-menu>);

    expect(page.root).toMatchInlineSnapshot(`
      <pos-mention-menu class="hydrated">
        <ul role="listbox">
          <li role="option" class="indexed" aria-selected="true">
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
    const page = await render(<pos-mention-menu items={items}></pos-mention-menu>);

    expect(page.root).toMatchInlineSnapshot(`
      <pos-mention-menu class="hydrated">
        <ul role="listbox">
          <li role="option" class="new-thing" aria-selected="true">
            New Thing
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
    const page = await render(<pos-mention-menu items={items}></pos-mention-menu>);

    expect(page.root).toMatchInlineSnapshot(`
      <pos-mention-menu class="hydrated">
        <ul role="listbox">
          <li role="option" class="indexed" aria-selected="true">
            First
          </li>
          <li role="option" class="indexed">
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
    const page = await render(<pos-mention-menu items={[item]} command={command}></pos-mention-menu>);

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
        ></pos-mention-menu>,
      );

      await page.waitForChanges();
      expect(page.root.querySelector('li:nth-child(2)')).toEqualAttribute('aria-selected', 'true');
    });
  });
});
