import { newSpecPage } from '@stencil/core/testing';
import { screen } from '@testing-library/dom';
import { PosAddNewThing } from '../pos-add-new-thing';

describe('pos-add-new-thing', () => {
  it('renders a button and a dialog with form for new thing', async () => {
    const page = await newSpecPage({
      components: [PosAddNewThing],
      html: `<pos-add-new-thing reference-uri="https://pod.test/"></pos-add-new-thing>`,
    });
    expect(page.root).toEqualHtml(`
<pos-add-new-thing reference-uri="https://pod.test/">
    <mock:shadow-root>
        <button id="new" title="Add a new thing">
            <ion-icon name="add-circle-outline"></ion-icon>
        </button>
        <dialog>
            <header>
                <span id="title">
                  Add a new thing
                </span>
                <button tabindex="-1" id="close" title="Close">
                    <ion-icon name="close-outline"></ion-icon>
                </button>
            </header>
            <pos-new-thing-form referenceUri="https://pod.test/" />
        </dialog>
    </mock:shadow-root>
</pos-add-new-thing>
    `);
  });

  it('opens a modal dialog, when the button is clicked', async () => {
    const page = await newSpecPage({
      components: [PosAddNewThing],
      html: `<pos-add-new-thing reference-uri="https://pod.test/"></pos-add-new-thing>`,
      supportsShadowDom: false,
    });

    const dialog = page.root.querySelector('dialog');
    dialog.showModal = jest.fn();

    const button = screen.getByTitle('Add a new thing');
    button.click();

    expect(dialog.showModal).toHaveBeenCalled();
  });

  it('closes the modal dialog, when the close button is clicked', async () => {
    const page = await newSpecPage({
      components: [PosAddNewThing],
      html: `<pos-add-new-thing reference-uri="https://pod.test/"></pos-add-new-thing>`,
      supportsShadowDom: false,
    });

    const dialog = page.root.querySelector('dialog');
    dialog.showModal = jest.fn();
    dialog.close = jest.fn();

    const button = screen.getByTitle('Add a new thing');
    button.click();

    const closeButton = screen.getByTitle('Close');
    closeButton.click();

    expect(dialog.close).toHaveBeenCalled();
  });
});
