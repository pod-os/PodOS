import { ContainerContent, LdpContainer, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Host, Listen, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

@Component({
  tag: 'pos-container-contents',
  shadow: true,
  styleUrl: 'pos-container-contents.css',
})
export class PosContainerContents implements ResourceAware {
  @State()
  container: LdpContainer;

  @State() contents: ContainerContent[] = [];

  @State() loading = true;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: EventEmitter;

  @State()
  private createNewItem: 'file' | 'folder' | null = null;

  onCreateNewFile() {
    this.createNewItem = 'file';
  }

  onCreateNewFolder() {
    this.createNewItem = 'folder';
  }

  componentWillLoad() {
    subscribeResource(this);
  }

  @Listen('keydown')
  handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.createNewItem = null;
    }
  }

  receiveResource = (resource: Thing) => {
    this.container = resource.assume(LdpContainer);
    this.loading = false;
    this.contents = this.container.contains().sort((a, b) => a.name.localeCompare(b.name));
  };

  render() {
    if (this.loading) return null;
    const items = this.contents.map(it => (
      <li key={it.uri}>
        <pos-resource lazy={true} uri={it.uri}>
          <pos-container-item>{it.name}</pos-container-item>
        </pos-resource>
      </li>
    ));
    if (this.createNewItem !== null) {
      items.unshift(
        <li key="new-item">
          <pos-create-new-container-item
            type={this.createNewItem}
            container={this.container}
          ></pos-create-new-container-item>
        </li>,
      );
    }
    return (
      <Host>
        <pos-container-toolbar
          onPod-os:create-new-file={() => this.onCreateNewFile()}
          onPod-os:create-new-folder={() => this.onCreateNewFolder()}
        ></pos-container-toolbar>
        {items.length > 0 ? <ul aria-label="Container contents">{items}</ul> : <p>The container is empty</p>}
      </Host>
    );
  }
}
