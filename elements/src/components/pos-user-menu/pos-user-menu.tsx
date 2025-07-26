import { Component, Event, EventEmitter, h, Listen, Prop } from '@stencil/core';

import './shoelace';

@Component({
  tag: 'pos-user-menu',
  shadow: true,
  styleUrl: 'pos-user-menu.css',
})
export class PosUserMenu {
  @Prop()
  webId!: string;

  @Event({ eventName: 'pod-os:logout' })
  logout: EventEmitter;

  @Event({ eventName: 'pod-os:link' })
  link: EventEmitter;

  @Listen('sl-select')
  onSelect(e: CustomEvent<{ item: { value: 'profile' | 'logout' | 'dashboard' } }>) {
    const { value } = e.detail.item;
    if (value === 'logout') {
      this.logout.emit();
    } else if (value === 'profile') {
      this.link.emit(this.webId);
    } else if (value === 'dashboard') {
      this.link.emit('pod-os:dashboard');
    } else if (value === 'settings') {
      this.link.emit('pod-os:settings');
    }
  }

  render() {
    if (!this.webId) return null; //?
    return (
      <pos-resource uri={this.webId}>
        <sl-dropdown>
          <button slot="trigger">
            <pos-picture>
              <sl-avatar></sl-avatar>
            </pos-picture>
          </button>
          <sl-menu>
            <sl-menu-item value="dashboard">Dashboard</sl-menu-item>
            <sl-menu-item value="profile">
              <pos-label></pos-label>
            </sl-menu-item>
            <sl-menu-item value="settings">Settings</sl-menu-item>
            <sl-divider></sl-divider>
            <sl-menu-item value="logout">Logout</sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </pos-resource>
    );
  }
}
