import { SessionInfo } from '@pod-os/core';
import { Component, Element, Event, EventEmitter, h, Listen, State } from '@stencil/core';
import { Subject, takeUntil } from 'rxjs';
import { usePodOS } from '../../events/usePodOS';

@Component({
  tag: 'pos-contacts-open-address-book',
  shadow: true,
  styleUrl: 'open-address-book.css',
})
export class OpenAddressBook {
  @Event({ eventName: 'pod-os-contacts:open-address-book' }) openAddressBook: EventEmitter<string>;

  @Element() el: HTMLElement;

  @State()
  sessionInfo: SessionInfo | undefined;

  private readonly disconnected$ = new Subject<void>();

  async componentWillLoad() {
    const os = await usePodOS(this.el);
    os.observeSession()
      .pipe(takeUntil(this.disconnected$))
      .subscribe(sessionInfo => {
        this.sessionInfo = { ...sessionInfo };
      });
  }

  disconnectedCallback() {
    this.disconnected$.next();
    this.disconnected$.unsubscribe();
  }

  @Listen('pod-os:link')
  openFromLink(event: CustomEvent<string>) {
    this.openAddressBook.emit(event.detail);
  }

  promptAndOpen() {
    const uri = prompt('Please enter URI of an address book', 'https://');
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
