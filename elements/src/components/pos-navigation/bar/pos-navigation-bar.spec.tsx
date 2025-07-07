import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PosNavigationBar } from './pos-navigation-bar';

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
});
