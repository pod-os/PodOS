import { ContactsModule } from '@solid-data-modules/contacts-rdflib';
import { Component, Element, h, Host, Listen, State } from '@stencil/core';

import { createRouter, match, Route } from 'stencil-router-v2';
import { usePodOS } from '../../events/usePodOS';

const Router = createRouter();

@Component({
  tag: 'pos-contacts-router',
  shadow: true,
})
export class ContactsRouter {
  @State() contactsModule: ContactsModule;

  @Element()
  el: HTMLElement;

  @State()
  uri: string;

  @Listen('pod-os-contacts:open-address-book')
  openAddressBook(event: CustomEvent) {
    Router.push('/address-book?uri=' + encodeURIComponent(event.detail));
  }

  @Listen('pod-os:session-restored', { target: 'window' })
  sessionRestored(e) {
    Router.push(e.detail.url);
  }

  async componentWillLoad() {
    const os = await usePodOS(this.el);
    this.contactsModule = await os.loadModule('contacts');
    this.updateUri();
    Router.onChange('url', () => {
      this.updateUri();
    });
  }

  updateUri() {
    this.uri = new URLSearchParams(window.location.search).get('uri');
  }

  render() {
    return (
      <Host>
        <Router.Switch>
          <Route path={match('/', { exact: true })}>
            <pos-contacts-welcome-page />
          </Route>
          <Route path="/address-book">
            <pos-contacts-address-book-page uri={this.uri} />
          </Route>
          <Route path="/contact">
            <pos-contacts-contact uri={this.uri} />
          </Route>
          <Route path="/group">
            <pos-contacts-group contactsModule={this.contactsModule} uri={this.uri} />
          </Route>
        </Router.Switch>
      </Host>
    );
  }
}
