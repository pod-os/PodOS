import { vi } from 'vitest';
import { describe, expect, h, it, render } from '@stencil/vitest';
import { screen } from '@testing-library/dom';
import '../pos-dialog';

describe('pos-dialog', () => {
  it('renders a dialog with the given slot content', async () => {
    const page = await render(
      <pos-dialog>
        <span slot="title">Title</span>
        <span slot="content">Content</span>
      </pos-dialog>,
    );
    expect(page.root).toMatchInlineSnapshot(`
      <pos-dialog class="hydrated">
        <dialog>
          <header>
            <span slot="title" __self="[object global]" __source="[object Object]">
              Title
            </span>
            <button tabindex="-1" id="close" title="Close">
              <sl-icon name="x"></sl-icon>
            </button>
          </header>
          <span slot="content" __self="[object global]" __source="[object Object]">
            Content
          </span>
        </dialog>
      </pos-dialog>
    `);
  });

  it('showModal method calls showModal of the underlying dialog', async () => {
    const page = await render(
      <pos-dialog>
        <span slot="title">Title</span>
        <span slot="content">Content</span>
      </pos-dialog>,
    );
    const dialog = page.root.querySelector('dialog')!;
    dialog.showModal = vi.fn();

    page.instance.showModal();

    expect(dialog.showModal).toHaveBeenCalled();
  });

  it('close method closes the modal dialog', async () => {
    const page = await render(
      <pos-dialog>
        <span slot="title">Title</span>
        <span slot="content">Content</span>
      </pos-dialog>,
    );
    const dialog = page.root.querySelector('dialog')!;
    dialog.close = vi.fn();

    page.instance.close();

    expect(dialog.close).toHaveBeenCalled();
  });

  it('closes the modal dialog, when the close button is clicked', async () => {
    const page = await render(
      <pos-dialog>
        <span slot="title">Title</span>
        <span slot="content">Content</span>
      </pos-dialog>,
    );
    const dialog = page.root.querySelector('dialog')!;
    dialog.close = vi.fn();

    const closeButton = screen.getByTitle('Close');
    closeButton.click();

    expect(dialog.close).toHaveBeenCalled();
  });
});
