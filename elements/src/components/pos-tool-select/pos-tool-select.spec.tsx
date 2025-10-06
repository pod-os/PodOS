jest.mock('./shoelace', () => ({}));

// noinspection ES6UnusedImports
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PosToolSelect } from './pos-tool-select';
import { queryAllByRole } from '@testing-library/dom';

describe('pos-tool-select', () => {
  it('renders nothing if no tools configured', async () => {
    const page = await newSpecPage({
      components: [PosToolSelect],
      template: () => <pos-tool-select tools={[]} />,
    });

    expect(page.root).toEqualHtml(`
      <pos-tool-select>
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
    ];
    const page = await newSpecPage({
      components: [PosToolSelect],
      template: () => <pos-tool-select tools={tools} />,
    });

    expect(page.root).toEqualHtml(`
      <pos-tool-select>
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
    ];
    const page = await newSpecPage({
      components: [PosToolSelect],
      template: () => <pos-tool-select tools={tools} />,
      supportsShadowDom: false,
    });

    const buttons = queryAllByRole(page.root, 'tab');
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
    ];
    const page = await newSpecPage({
      components: [PosToolSelect],
      template: () => <pos-tool-select tools={tools} />,
      supportsShadowDom: false,
    });

    const icons = page.root.querySelectorAll('sl-icon');
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
    ];
    const page = await newSpecPage({
      components: [PosToolSelect],
      template: () => <pos-tool-select tools={tools} />,
      supportsShadowDom: false,
    });

    const eventSpy = jest.fn();
    page.win.addEventListener('pod-os:tool-selected', eventSpy);

    const button = queryAllByRole(page.root, 'tab')[0];
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
    ];
    const page = await newSpecPage({
      components: [PosToolSelect],
      template: () => <pos-tool-select tools={tools} selected={tools[1]} />,
      supportsShadowDom: false,
    });

    const buttons = queryAllByRole(page.root, 'tab');
    expect(buttons[0]).not.toHaveAttribute('aria-selected');
    expect(buttons[1]).toHaveAttribute('aria-selected');
  });
});
