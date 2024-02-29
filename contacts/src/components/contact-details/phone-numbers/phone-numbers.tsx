import { PhoneNumber } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-contacts-phone-numbers',
  styleUrl: './phone-numbers.css',
  shadow: true,
})
export class PhoneNumbers {
  @Prop()
  phoneNumbers!: PhoneNumber[];

  render() {
    if (this.phoneNumbers.length == 0) {
      return null;
    }
    return (
      <section aria-label="phone numbers">
        <ion-icon aria-hidden="true" size="large" name="call-outline"></ion-icon>
        <ul>
          {this.phoneNumbers.map(phoneNumber => (
            <li>
              <a href={`tel:${phoneNumber.value}`}>{phoneNumber.value}</a>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}
