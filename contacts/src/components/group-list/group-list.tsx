import { Group } from '@solid-data-modules/contacts-rdflib';
import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';

@Component({
  tag: 'pos-contacts-group-list',
  styleUrl: './group-list.css',
  shadow: true,
})
export class GroupList {
  @Prop()
  groups: Group[];

  @Event({ eventName: 'pod-os-contacts:group-selected' }) groupSelected: EventEmitter<Group>;

  render() {
    return (
      <ul>
        {this.groups.map(it => (
          <li>
            <a
              href={it.uri}
              onClick={e => {
                e.preventDefault();
                this.groupSelected.emit(it);
              }}
            >
              {it.name || it.uri}
            </a>
          </li>
        ))}
      </ul>
    );
  }
}
