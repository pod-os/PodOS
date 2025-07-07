import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PosNavigationBar } from './pos-navigation-bar';
import { screen } from '@testing-library/dom';

describe('pos-navigation-bar', () => {
  it('shows the resource label', async () => {
    const mockThing = {
      label: () => 'Test Label',
    };

    const page = await newSpecPage({
      components: [PosNavigationBar],
      template: () => <pos-navigation-bar current={mockThing} />,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-navigation-bar>
        <nav>
          <button>
            Test Label
          </button>
        </nav>
      </pos-navigation-bar>
    `);
  });

  it('emits navigation event on button click', async () => {
    const mockThing = {
      label: () => 'Test Label',
    };

    const page = await newSpecPage({
      components: [PosNavigationBar],
      template: () => <pos-navigation-bar current={mockThing} />,
      supportsShadowDom: false,
    });

    const onNavigate = jest.fn();
    page.root.addEventListener('pod-os:navigate', onNavigate);

    screen.getByRole('button').click();

    expect(onNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'pod-os:navigate',
      }),
    );
  });
});
