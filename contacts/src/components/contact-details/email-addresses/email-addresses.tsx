import { Email } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Prop } from '@stencil/core';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';

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
        <sl-icon aria-hidden="true" size="large" name="envelope-at"></sl-icon>
        <ul>
          {this.emailAddresses.map(email => (
            <li>
              <a href={`mailto:${email.value}`}>{email.value}</a>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}
