import { vi } from 'vitest';
import { describe, expect, h, it, render } from '@stencil/vitest';

import '../pos-add-new-thing';
import { withinShadow } from '../../../test/withinShadow';

describe('pos-add-new-thing', () => {
  it('renders a button and a dialog with form for new thing', async () => {
    const page = await renderComponent();
    expect(page.root.shadowRoot).toEqualHtml(`
        <button id="new" title="Add a new thing">
            <sl-icon name="plus-circle"></sl-icon>
        </button>
        <pos-dialog>
            <span slot="title">
                  Add a new thing
            </span>
            <pos-new-thing-form slot="content" referenceuri="https://pod.test/"></pos-new-thing-form>
        </pos-dialog>
    `);
  });

  it('opens a modal dialog, when the button is clicked', async () => {
    const page = await renderComponent();

    const dialog = page.root.shadowRoot!.querySelector('pos-dialog')!;
    dialog.showModal = vi.fn();

    const button = withinShadow(page).getByTitle('Add a new thing');
    button.click();

    expect(dialog.showModal).toHaveBeenCalled();
  });
});

async function renderComponent() {
  return render(<pos-add-new-thing referenceUri="https://pod.test/"></pos-add-new-thing>);
}
