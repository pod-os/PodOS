import { Component, h, Host, Element, State } from '@stencil/core';
import { PodOS, Thing } from '@pod-os/core';
import { usePodOS } from '../../components/events/usePodOS';
import { useResource } from '../../components/events/useResource';

/**
 * A tool to manage attachments of a thing.
 */
@Component({
  tag: 'pos-tool-attachments',
  styleUrls: [
    './pos-tool-attachments.css',
    '../../apps/styles/default-app-layout.css',
    '../../apps/styles/article-card.css',
  ],
  shadow: true,
})
export class PosToolAttachments {
  @Element() el: HTMLElement;

  @State() os: PodOS;
  @State() resource: Thing;

  async componentWillLoad() {
    this.os = await usePodOS(this.el);
    this.resource = await useResource(this.el);
  }

  render() {
    return (
      <Host>
        <section>
          <article>
            <h2>Attachments</h2>
            <pos-attachments></pos-attachments>
          </article>
        </section>
        <section>
          <pos-upload
            accept={['*/*']}
            uploader={file => {
              return this.os.attachments().uploadAndAddAttachment(this.resource, file);
            }}
          ></pos-upload>
        </section>
      </Host>
    );
  }
}
