import { Component, h } from '@stencil/core';

@Component({
  tag: 'pos-app-settings',
  styleUrl: 'pos-app-settings.css',
  shadow: true,
})
export class PosAppSettings {
  render() {
    return <pos-setting-offline-cache></pos-setting-offline-cache>;
  }
}
