import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { fireEvent, screen, within } from '@testing-library/dom';
import { CreateNewContact } from '../create-new-contact';

describe('create new contact', () => {
  let page;
  beforeEach(async () => {
    page = await newSpecPage({
      components: [CreateNewContact],
      template: () => <pos-contacts-create-new-contact addressBookUri="https://pod.test/contacts#it"></pos-contacts-create-new-contact>,
      supportsShadowDom: false,
    });
  });

  it('shows a button to create a contact', async () => {
    const createContactButton = screen.getByText('Create contact', { selector: 'button' });
    expect(createContactButton).not.toBeNull();
  });

  it('clicking "Create contact" opens the create contact dialog', () => {
    const createContactButton = screen.getByText('Create contact', { selector: 'button' });
    const dialog = page.root.querySelector('pos-dialog');
    dialog.showModal = jest.fn();
    fireEvent.click(createContactButton);
    expect(dialog.showModal).toHaveBeenCalled();
  });

  it('dialog has a title', () => {
    const dialog = page.root.querySelector('pos-dialog');
    const title = within(dialog).getByRole('heading');
    expect(title).toEqualHtml(`
      <h2 slot='title'>
        Create new contact
      </h2>
    `);
  });

  it('dialog contains a form to create a new contact', () => {
    const dialog = page.root.querySelector('pos-contacts-create-new-contact-form');
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('addressBookUri')).toEqual('https://pod.test/contacts#it');
  });
});
