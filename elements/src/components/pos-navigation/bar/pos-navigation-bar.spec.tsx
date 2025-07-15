import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PosNavigationBar } from './pos-navigation-bar';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { pressKey } from '../../../test/pressKey';

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
          <button aria-label="Test Label (Click to search or enter URI)">
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
        <button aria-label="Search or enter URI">
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

  describe('keyboard shortcut', () => {
    let page;
    let onNavigate;
    beforeEach(async () => {
      page = await newSpecPage({
        components: [PosNavigationBar],
        template: () => <pos-navigation-bar />,
        supportsShadowDom: false,
      });
      onNavigate = jest.fn();
      page.root.addEventListener('pod-os:navigate', onNavigate);
    });

    it('emits navigation event when ctrl-k is pressed', async () => {
      // when the user presses CTRL-K
      await pressKey(page, 'k', { ctrlKey: true, bubbles: true });

      // then navigate is emitted
      expect(onNavigate).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'pod-os:navigate',
        }),
      );
    });

    it('emits navigation event when cmd-k is pressed', async () => {
      // when the user presses CTRL-K
      await pressKey(page, 'k', { ctrlKey: false, metaKey: true, bubbles: true });

      // then navigate is emitted
      expect(onNavigate).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'pod-os:navigate',
        }),
      );
    });

    it('does not emit navigation event if CTRL key is not pressed', async () => {
      // when the user presses K without CTRL
      await pressKey(page, 'k', { ctrlKey: false, bubbles: true });

      // then navigate is not emitted
      expect(onNavigate).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'pod-os:navigate',
        }),
      );
    });

    it('does not emit navigation event if CTRL is pressed with other keys', async () => {
      // when the user presses CTRL-J
      await pressKey(page, 'j', { ctrlKey: true, bubbles: true });

      // then navigate is not emitted
      expect(onNavigate).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'pod-os:navigate',
        }),
      );
    });
  });
});
