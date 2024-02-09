import { PodOS } from '@pod-os/core';
import { ContactsModule } from '@solid-data-modules/contacts-rdflib';
import { Component, Event, h, Host, State } from '@stencil/core';

import { createRouter, match, Route } from 'stencil-router-v2';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';

const Router = createRouter();

@Component({
  tag: 'pos-contacts',
})
export class Contacts implements PodOsAware {
  @State() contactsModule: ContactsModule;

  @Event({ eventName: 'pod-os:init' }) subscribePodOs: PodOsEventEmitter;

  @State()
  uri: string;

  private openAddressBook() {
    const uri = prompt('Please enter URI of an address book');
    Router.push('/address-book?uri=' + encodeURIComponent(uri));
  }

  componentWillLoad() {
    subscribePodOs(this);
    this.updateUri();
    Router.onChange('url', () => {
      this.updateUri();
    });
  }

  updateUri() {
    this.uri = new URLSearchParams(window.location.search).get('uri');
  }

  receivePodOs = async (os: PodOS) => {
    this.contactsModule = await os.loadContactsModule();
  };

  render() {
    if (!this.contactsModule) {
      return <div>Loading contacts module...</div>;
    }
    return (
      <Host>
        <nav>
          <button onClick={this.openAddressBook}>open address book</button>
        </nav>
        <Router.Switch>
          <Route path={match('/', { exact: true })}></Route>
          <Route path="/address-book">
            <pos-contacts-address-book contactsModule={this.contactsModule} uri={this.uri} />
          </Route>
          <Route path="/contact">
            <pos-contacts-contact contactsModule={this.contactsModule} uri={this.uri} />
          </Route>
          <Route path="/group">
            <pos-contacts-group contactsModule={this.contactsModule} uri={this.uri} />
          </Route>
        </Router.Switch>
      </Host>
    );
  }
}
