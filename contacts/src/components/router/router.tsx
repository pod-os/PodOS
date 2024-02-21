import { PodOS } from '@pod-os/core';
import { ContactsModule } from '@solid-data-modules/contacts-rdflib';
import { Component, Event, h, Host, Listen, State } from '@stencil/core';

import { createRouter, match, Route } from 'stencil-router-v2';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../../events/PodOsAware';

const Router = createRouter();

@Component({
  tag: 'pos-contacts-router',
  shadow: true,
})
export class ContactsRouter implements PodOsAware {
  @State() contactsModule: ContactsModule;

  @Event({ eventName: 'pod-os:init' }) subscribePodOs: PodOsEventEmitter;

  @State()
  uri: string;

  @Listen('pod-os-contacts:open-address-book')
  openAddressBook(event: CustomEvent) {
    Router.push('/address-book?uri=' + encodeURIComponent(event.detail));
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
        <Router.Switch>
          <Route path={match('/', { exact: true })}>
            <pos-contacts-welcome-page />
          </Route>
          <Route path="/address-book">
            <pos-contacts-address-book-page contactsModule={this.contactsModule} uri={this.uri} />
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
