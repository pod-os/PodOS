jest.mock('./shoelace', () => ({}));

// noinspection ES6UnusedImports
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PosToolSelect } from './pos-tool-select';
import { findAllByRole, getAllByRole, queryAllByRole, screen } from '@testing-library/dom';

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

  it('renders a button for each tool', async () => {
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

    const buttons = queryAllByRole(page.root, 'button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toEqual('Tool 1');
    expect(buttons[1].textContent).toEqual('Tool 2');
  });
});
