import { vi } from 'vitest';
import { describe, expect, it, render, h } from '@stencil/vitest';
import './pos-tool-select';
import { ToolConfig } from '../pos-type-router/selectToolsForTypes';
import { withinShadow } from '../../test/withinShadow';

vi.mock('./shoelace', () => ({}));

describe('pos-tool-select', () => {
  it('renders nothing if no tools configured', async () => {
    const page = await render(<pos-tool-select tools={[]} />);

    expect(page.root).toEqualHtml(`
      <pos-tool-select class="hydrated">
        <mock:shadow-root></mock:shadow-root>
      </pos-tool-select>
    `);
  });

  it('renders nothing if only one tool available', async () => {
    const tools = [
      {
        label: 'Test Tool',
        component: 'pos-test-tool',
      },
    ] as unknown as ToolConfig[];
    const page = await render(<pos-tool-select tools={tools} />);

    expect(page.root).toEqualHtml(`
      <pos-tool-select class="hydrated">
        <mock:shadow-root></mock:shadow-root>
      </pos-tool-select>
    `);
  });

  it('renders a tab for each tool', async () => {
    const tools = [
      {
        label: 'Tool 1',
        component: 'pos-test-tool-1',
      },
      {
        label: 'Tool 2',
        component: 'pos-test-tool-2',
      },
    ] as unknown as ToolConfig[];
    const page = await render(<pos-tool-select tools={tools} />);

    const buttons = withinShadow(page).getAllByRole('tab');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toEqual('Tool 1');
    expect(buttons[1].textContent).toEqual('Tool 2');
  });

  it('renders a sl-icon matching the tool config', async () => {
    const tools = [
      {
        label: 'Tool 1',
        component: 'pos-test-tool-1',
        icon: 'icon-1',
      },
      {
        label: 'Tool 2',
        component: 'pos-test-tool-2',
        icon: 'icon-2',
      },
    ] as unknown as ToolConfig[];
    const page = await render(<pos-tool-select tools={tools} />);

    const icons = page.root.shadowRoot!.querySelectorAll('sl-icon');
    expect(icons.length).toBe(2);
    expect(icons[0].getAttribute('name')).toBe('icon-1');
    expect(icons[1].getAttribute('name')).toBe('icon-2');
  });

  it('fires pod-os:tool-selected event on tab click', async () => {
    const tools = [
      {
        label: 'Tool 1',
        component: 'pos-test-tool-1',
      },
      {
        label: 'Tool 2',
        component: 'pos-test-tool-2',
      },
    ] as unknown as ToolConfig[];
    const page = await render(<pos-tool-select tools={tools} />);

    const eventSpy = vi.fn();
    window.addEventListener('pod-os:tool-selected', eventSpy);

    const button = withinShadow(page).getAllByRole('tab')[0];
    expect(button.textContent).toEqual('Tool 1');
    button.click();

    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: tools[0],
      }),
    );
  });

  it('renders aria-selected for selected tool', async () => {
    const tools = [
      {
        label: 'Tool 1',
        component: 'pos-test-tool-1',
        element: 'element-1',
      },
      {
        label: 'Tool 2',
        component: 'pos-test-tool-2',
        element: 'element-2',
      },
    ] as unknown as ToolConfig[];
    const page = await render(<pos-tool-select tools={tools} selected={tools[1]} />);

    const buttons = withinShadow(page).getAllByRole('tab');
    expect(buttons[0]).not.toHaveAttribute('aria-selected');
    expect(buttons[1]).toHaveAttribute('aria-selected');
  });
});
