import { Component, h, Element, Prop, State, Listen, Watch } from '@stencil/core';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import { usePodOS } from '../events/usePodOS';
import { OpenWithApp, PodOS } from '@pod-os/core';
import { openNewTab } from './openNewTab';

/**
 * Allows sharing a resource with other apps, people, etc.
 */
@Component({
  tag: 'pos-share',
  styleUrl: 'pos-share.css',
  shadow: true,
})
export class PosShare {
  /**
   * URI of the resource to share.
   */
  @Prop() uri!: string;

  @Element() el!: HTMLElement;

  @State() apps: OpenWithApp[] = [];

  @State() os: PodOS;

  async componentWillLoad() {
    this.os = await usePodOS(this.el);
    await this.updateApps();
  }

  @Watch('uri')
  async updateApps() {
    const thing = this.os.store.get(this.uri);
    this.apps = this.os.proposeAppsFor(thing);
  }

  @Listen('sl-select')
  onSelect(e: CustomEvent<{ item: { value: 'copy-uri' | OpenWithApp } }>) {
    const { value } = e.detail.item;
    if (value === 'copy-uri') {
      navigator.clipboard.writeText(this.uri);
    } else {
      openNewTab(value.urlTemplate.expand({ uri: this.uri }));
    }
  }

  render() {
    return (
      <sl-dropdown>
        <button slot="trigger" aria-label="Share" part="button">
          <sl-icon name="share"></sl-icon>
        </button>
        <sl-menu>
          <sl-menu-item value="copy-uri">
            <sl-icon slot="prefix" name="copy"></sl-icon>Copy URI
          </sl-menu-item>
          {this.apps.length > 0 && <OpenWithApps apps={this.apps}></OpenWithApps>}
        </sl-menu>
      </sl-dropdown>
    );
  }
}

function OpenWithApps({ apps }: { apps: OpenWithApp[] }) {
  return [
    <sl-divider></sl-divider>,
    <sl-menu-item disabled>Open with...</sl-menu-item>,
    apps.map(it => <sl-menu-item value={it}>{it.name}</sl-menu-item>),
  ];
}
