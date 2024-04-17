import { SessionInfo } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Listen, Prop, State } from '@stencil/core';

@Component({
  tag: 'pos-contacts-open-address-book',
  shadow: true,
  styleUrl: 'open-address-book.css',
})
export class OpenAddressBook {
  @Event({ eventName: 'pod-os-contacts:open-address-book' }) openAddressBook: EventEmitter<string>;

  @State()
  sessionInfo: SessionInfo | undefined;

  @Listen('pod-os:session-changed', { target: 'window' })
  sessionChanged(event: CustomEvent<SessionInfo>) {
    this.sessionInfo = event.detail;
  }

  @Prop()
  webId: string | undefined;

  promptAndOpen() {
    const uri = prompt('Please enter URI of an address book', 'http://localhost:3000/alice/public-contacts/index.ttl#this');
    if (uri) {
      this.openAddressBook.emit(uri);
    }
  }

  render() {
    return (
      <div id="container">
        {this.sessionInfo?.isLoggedIn ? (
          <pos-contacts-list-address-books webId={this.sessionInfo.webId} />
        ) : (
          <div id="sign-in">
            <pos-login></pos-login>
            Sign in to list your address books.
          </div>
        )}
        <button title="open any other address book by it's URI" class="open" onClick={() => this.promptAndOpen()}>
          <ion-icon name="folder-open-outline"></ion-icon>
          open other
        </button>
      </div>
    );
  }
}
