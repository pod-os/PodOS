import { Group } from '@solid-data-modules/contacts-rdflib';
import { Component, h, Prop } from '@stencil/core';
import { href } from 'stencil-router-v2';

@Component({
  tag: 'pos-contacts-group-list',
  styleUrl: './group-list.css',
  shadow: true,
})
export class GroupList {
  @Prop()
  groups: Group[];
  render() {
    return (
      <ul>
        {this.groups.map(it => (
          <li>
            <a {...href(`/group?uri=${encodeURIComponent(it.uri)}`)}>{it.name || it.uri}</a>
          </li>
        ))}
      </ul>
    );
  }
}
