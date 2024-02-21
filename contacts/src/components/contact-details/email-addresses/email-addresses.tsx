import { Email } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-contacts-email-addresses',
})
export class EmailAddresses {
  @Prop()
  emailAddresses!: Email[];
  render() {
    if (this.emailAddresses.length == 0) {
      return null;
    }
    return (
      <ul>
        {this.emailAddresses.map(email => (
          <li>{email.value}</li>
        ))}
      </ul>
    );
  }
}
