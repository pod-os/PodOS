import { Component, Event, EventEmitter, h, Host } from '@stencil/core';

@Component({
  tag: 'pos-contacts-welcome-page',
  styleUrl: './welcome-page.css',
})
export class WelcomePage {
  @Event({ eventName: 'pod-os-contacts:open-address-book' }) openAddressBook: EventEmitter<string>;

  promptAndOpen() {
    const uri = prompt('Please enter URI of an address book');
    this.openAddressBook.emit(uri);
  }

  render() {
    return (
      <Host>
        <header>
          <h1>PodOS contacts</h1>
          <pos-login></pos-login>
        </header>
        <main>
          <button onClick={() => this.promptAndOpen()}>open address book</button>
        </main>
      </Host>
    );
  }
}
