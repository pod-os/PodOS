import { Component, Element, h, Host, Method, State } from '@stencil/core';
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
  @State() attachments: AttachmentListItem[];

  /**
   * Adds an attachment visually to the list of attachments.
   * This only adds an entry to the list, it does not actually upload the attachment.
   * It is meant to be used after an attachment has been uploaded to update the view.
   *
   * @param attachment The attachment to add to the list.
   */
  @Method()
  async addToList(attachment: Attachment) {
    this.attachments = [
      ...this.attachments,
      {
        ...attachment,
        newlyAdded: true,
      },
    ];
  }

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
          <li class={{ new: it.newlyAdded }}>
            <pos-rich-link uri={it.uri}></pos-rich-link>
          </li>
        ))}
      </ul>
    );
  }
}

type AttachmentListItem = Attachment & { newlyAdded?: boolean };
