import { Mock, vi } from 'vitest';
import { beforeEach, describe, expect, h, it, render, RenderResult } from '@stencil/vitest';
import './pos-navigation-bar';
import { pressKey } from '../../../test/pressKey';
import { Thing } from '@pod-os/core';
import { withinShadow } from '../../../test/withinShadow';
import { userEvent } from '@testing-library/user-event';

describe('pos-navigation-bar', () => {
  it('shows the resource label and a share feature', async () => {
    const mockThing = {
      uri: 'https://test.pod/resource/1234567890',
      label: () => 'Test Label',
    } as Thing;

    const page = await render(<pos-navigation-bar current={mockThing}></pos-navigation-bar>);

    expect(page.root).toMatchInlineSnapshot(`
  <pos-navigation-bar class="hydrated">
    <mock:shadow-root>
      <section class="current">
        <button aria-label="Test Label (Click to search or enter URI)">
          <div>
            Test Label
          </div>
          ${icon}
        </button>
        <pos-share uri="https://test.pod/resource/1234567890"></pos-share>
      </section>
    </mock:shadow-root>
  </pos-navigation-bar>
`);
  });

  const icon = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"></path>
          </svg>`;

  it('shows nothing if current resource is not set', async () => {
    const page = await render(<pos-navigation-bar></pos-navigation-bar>);

    expect(page.root).toMatchInlineSnapshot(`
  <pos-navigation-bar class="hydrated">
    <mock:shadow-root>
      <section class="current">
        <button aria-label="Search or enter URI">
          <div>
            Search or enter URI
          </div>
          ${icon}
        </button>
      </section>
    </mock:shadow-root>
  </pos-navigation-bar>
`);
  });

  describe('make findable', () => {
    it('shows pos-make-findable when searchIndexReady is true', async () => {
      const mockThing = {
        uri: 'https://test.pod/resource/1234567890',
        label: () => 'Test Label',
      } as Thing;

      const page = await render(<pos-navigation-bar current={mockThing} searchIndexReady={true}></pos-navigation-bar>);

      const makeFindable = page.root.shadowRoot!.querySelector('pos-make-findable');
      expect(makeFindable).not.toBeNull();
    });

    it('hides pos-make-findable when searchIndexReady is false', async () => {
      const mockThing = {
        uri: 'https://test.pod/resource/1234567890',
        label: () => 'Test Label',
      } as Thing;

      const page = await render(<pos-navigation-bar current={mockThing} searchIndexReady={false}></pos-navigation-bar>);

      const makeFindable = page.root.shadowRoot!.querySelector('pos-make-findable')!;
      expect(makeFindable).toBeNull();
    });
  });

  it('emits navigation event with current resource on button click', async () => {
    const mockThing = {
      uri: 'https://test.pod/resource/1234567890',
      label: () => 'Test Label',
    } as Thing;

    const page = await render(<pos-navigation-bar current={mockThing}></pos-navigation-bar>);

    const onNavigate = vi.fn();
    page.root.addEventListener('pod-os:navigate', onNavigate);

    const button = withinShadow(page).getByRole('button');
    await userEvent.click(button);

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
    let page: RenderResult;
    let onNavigate: Mock;
    beforeEach(async () => {
      page = await render(<pos-navigation-bar></pos-navigation-bar>);
      onNavigate = vi.fn();
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
