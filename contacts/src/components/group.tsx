import { ContactsModule, FullGroup } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { href } from 'stencil-router-v2';
@Component({
  tag: 'pos-contacts-group',
})
export class Group {
  @Prop()
  uri: string;

  @Prop()
  contactsModule: ContactsModule;

  @State()
  group: FullGroup;

  componentWillLoad() {
    this.loadGroup();
  }

  @Watch('uri')
  async loadGroup() {
    this.group = await this.contactsModule.readGroup(this.uri);
  }

  render() {
    return (
      <Host>
        <h2>{this.group.name}</h2>
        <ul>
          {this.group.members.map(it => (
            <li>
              <a {...href(`/contact?uri=${encodeURIComponent(it.uri)}`)}>{it.name || it.uri}</a>
            </li>
          ))}
        </ul>
      </Host>
    );
  }
}
