import { RdfType, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Host, State } from '@stencil/core';
import { ResourceAware, subscribeResource } from '../events/ResourceAware';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

@Component({
  tag: 'pos-type-badges',
  shadow: true,
  styleUrl: 'pos-type-badges.css',
})
export class PosTypeBadges implements ResourceAware {
  @State() data: RdfType[] = [];
  @State() typeLabels: string[] = [];

  @State() isExpanded: boolean = false;

  @Event({ eventName: 'pod-os:resource' })
  subscribeResource: EventEmitter;

  componentWillLoad() {
    subscribeResource(this);
  }

  receiveResource = (resource: Thing) => {
    this.data = resource.types();
    this.typeLabels = [...new Set(resource.types().map(it => it.label))];
  };

  toggleDetails() {
    this.isExpanded = !this.isExpanded;
  }

  render() {
    if (this.data.length == 0) {
      return null;
    }
    if (this.isExpanded) {
      return (
        <div class="types expanded">
          <sl-tooltip content="Collapse types">
            <button class="toggle" onClick={() => this.toggleDetails()}>
              <sl-icon name="arrows-collapse"></sl-icon>
            </button>
          </sl-tooltip>
          <ul>
            {this.data.map(it => (
              <li>{it.uri}</li>
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <Host>
          <div class="types">
            <ul>
              {this.typeLabels.map(it => (
                <li>{it}</li>
              ))}
            </ul>
            <sl-tooltip content="Expand types">
              <button class="toggle" onClick={() => this.toggleDetails()}>
                <sl-icon name="arrows-expand"></sl-icon>
              </button>
            </sl-tooltip>
          </div>
        </Host>
      );
    }
  }
}
