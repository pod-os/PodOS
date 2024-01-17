import { PodOS, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, State, Watch } from '@stencil/core';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../../components/events/PodOsAware';
import { ResourceAware, subscribeResource } from '../../components/events/ResourceAware';

@Component({
  tag: 'pos-app-address-book',
})
export class PosAppAddressBook implements PodOsAware, ResourceAware {
  @State() os: PodOS;

  @Event({ eventName: 'pod-os:init' }) subscribePodOs: PodOsEventEmitter;
  @Event({ eventName: 'pod-os:resource' }) subscribeResource: EventEmitter;

  @State() private module: any; // TODO: typings
  @State() private book: any;

  @State() private resource: Thing;

  componentWillLoad() {
    subscribePodOs(this);
    subscribeResource(this);
  }

  receiveResource = async (resource: Thing) => {
    this.resource = resource;
  };

  receivePodOs = async (os: PodOS) => {
    this.os = os;
    this.module = await this.os.contactsModule();
  };

  @Watch('resource')
  @Watch('module')
  async readAddressBook() {
    if (this.resource && this.module) {
      this.book = await this.module.readAddressBook(this.resource.uri);
    }
  }

  render() {
    return this.book ? (
      <div>
        <h2>Contacts</h2>
        <ul>
          {this.book.contacts.map(it => (
            <li>
              {' '}
              <pos-rich-link uri={it.uri} />
            </li>
          ))}
        </ul>
        <h2>Groups</h2>
        <ul>
          {this.book.groups.map(it => (
            <li>
              {' '}
              <pos-rich-link uri={it.uri} />
            </li>
          ))}
        </ul>
      </div>
    ) : null;
  }
}
