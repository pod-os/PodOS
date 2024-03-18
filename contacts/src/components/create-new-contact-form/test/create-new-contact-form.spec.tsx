import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { CreateNewContactForm } from '../create-new-contact-form';

describe('create new contact form', () => {
  let page;
  beforeEach(async () => {
    page = await newSpecPage({
      components: [CreateNewContactForm],
      template: () => <pos-contacts-create-new-contact-form></pos-contacts-create-new-contact-form>,
      supportsShadowDom: false,
    });
  });

  it('shows a form to enter contact data', () => {
    expect(page.root).toEqualHtml(`<pos-contacts-create-new-contact-form>
  <form method="dialog">
    <label htmlfor="name">
      Name
    </label>
    <input id="name" name="name" required="" type="text">
    <label htmlfor="phoneNumber">
      Phone
    </label>
    <input id="phoneNumber" name="phoneNumber" type="tel">
    <label htmlfor="email">
      Email
    </label>
    <input id="email" name="email" type="email">
    <input id="create" type="submit" value="Save">
  </form>
</pos-contacts-create-new-contact-form>`);
  });
});
