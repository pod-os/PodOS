import { Component, h } from '@stencil/core';

@Component({
  tag: 'pos-contacts-create-new-contact-form',
  styleUrl: 'create-new-contact-form.css',
  shadow: {
    delegatesFocus: true,
  },
})
export class CreateNewContactForm {
  render() {
    return (
      <form method="dialog" onSubmit={() => alert('To be done.')}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required={true} />
        <label htmlFor="phoneNumber">Phone</label>
        <input id="phoneNumber" name="phoneNumber" type="tel" />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
        <input type="submit" id="create" value="Save"></input>
      </form>
    );
  }
}
