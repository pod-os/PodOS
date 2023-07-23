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
        <pos-dialog>
                <span slot="dialog-title">
                      Add a new thing
                </span>
            <pos-new-thing-form referenceUri="https://pod.test/" slot="dialog-content"/>
        </pos-dialog>
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

    const dialog = page.root.querySelector('pos-dialog');
    dialog.showModal = jest.fn();

    const button = screen.getByTitle('Add a new thing');
    button.click();

    expect(dialog.showModal).toHaveBeenCalled();
  });
});
