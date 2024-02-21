import { PhoneNumber } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-contacts-phone-numbers',
})
export class PhoneNumbers {
  @Prop()
  phoneNumbers!: PhoneNumber[];

  render() {
    if (this.phoneNumbers.length == 0) {
      return null;
    }
    return (
      <ul>
        {this.phoneNumbers.map(phoneNumber => (
          <li>{phoneNumber.value}</li>
        ))}
      </ul>
    );
  }
}
