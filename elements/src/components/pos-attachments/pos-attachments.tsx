import { Component, Element, h, Host, State } from '@stencil/core';
import { Attachment, Thing } from '@pod-os/core';
import { useResource } from '../events/useResource';

/**
 * Lists whatever is attached to the current thing
 */
@Component({
  tag: 'pos-attachments',
  styleUrl: 'pos-attachments.css',
  shadow: true,
})
export class PosAttachments {
  @Element() el: HTMLElement;

  @State() resource: Thing;
  @State() attachments: Attachment[];

  async componentWillLoad() {
    this.resource = await useResource(this.el);
    this.attachments = this.resource.attachments();
  }

  render() {
    if (this.attachments.length === 0) {
      return <Host>No attachments found.</Host>;
    }

    return (
      <ul>
        {this.attachments.map(it => (
          <li>
            <pos-rich-link uri={it.uri}></pos-rich-link>
          </li>
        ))}
      </ul>
    );
  }
}
