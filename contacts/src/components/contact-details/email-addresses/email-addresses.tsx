import { Email } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-contacts-email-addresses',
  styleUrl: './email-addresses.css',
  shadow: true,
})
export class EmailAddresses {
  @Prop()
  emailAddresses!: Email[];
  render() {
    if (this.emailAddresses.length == 0) {
      return null;
    }
    return (
      <section aria-label="e-mail addresses">
        <ion-icon aria-hidden="true" size="large" name="mail-outline"></ion-icon>
        <ul>
          {this.emailAddresses.map(email => (
            <li>{email.value}</li>
          ))}
        </ul>
      </section>
    );
  }
}
