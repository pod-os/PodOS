import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PosNavigationBar } from './pos-navigation-bar';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';

describe('pos-navigation-bar', () => {
  it('shows the resource label', async () => {
    const mockThing = {
      uri: 'https://test.pod/resource/1234567890',
      label: () => 'Test Label',
    };

    const page = await newSpecPage({
      components: [PosNavigationBar],
      template: () => <pos-navigation-bar current={mockThing} />,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-navigation-bar>
        <section class="current">
          <button>
            Test Label
          </button>
        </section>
      </pos-navigation-bar>
    `);
  });

  it('shows nothing if current resource is not set', async () => {
    const page = await newSpecPage({
      components: [PosNavigationBar],
      template: () => <pos-navigation-bar />,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
    <pos-navigation-bar>
      <section class="current">
        <button>
          Search or enter URI
        </button>
      </section>
    </pos-navigation-bar>
  `);
  });

  describe('make findable', () => {
    it('shows pos-make-findable when searchIndexReady is true', async () => {
      const mockThing = {
        uri: 'https://test.pod/resource/1234567890',
        label: () => 'Test Label',
      };

      const page = await newSpecPage({
        components: [PosNavigationBar],
        template: () => <pos-navigation-bar current={mockThing} searchIndexReady={true} />,
        supportsShadowDom: false,
      });

      const makeFindable = page.root.querySelector('pos-make-findable');
      expect(makeFindable).not.toBeNull();
    });

    it('hides pos-make-findable when searchIndexReady is false', async () => {
      const mockThing = {
        uri: 'https://test.pod/resource/1234567890',
        label: () => 'Test Label',
      };

      const page = await newSpecPage({
        components: [PosNavigationBar],
        template: () => <pos-navigation-bar current={mockThing} searchIndexReady={false} />,
        supportsShadowDom: false,
      });

      const makeFindable = page.root.querySelector('pos-make-findable');
      expect(makeFindable).toBeNull();
    });
  });

  it('emits navigation event with current resource on button click', async () => {
    const mockThing = {
      uri: 'https://test.pod/resource/1234567890',
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
        detail: expect.objectContaining({
          uri: 'https://test.pod/resource/1234567890',
        }),
      }),
    );
  });
});
