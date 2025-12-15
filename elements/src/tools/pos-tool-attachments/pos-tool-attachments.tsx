import { Component, Element, h, Host, State } from '@stencil/core';
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

  private attachmentsElement: HTMLPosAttachmentsElement;

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
            <pos-attachments ref={it => (this.attachmentsElement = it)}></pos-attachments>
          </article>
        </section>
        <section>
          {this.resource?.editable ? (
            <pos-upload
              accept={['*/*']}
              uploader={file => {
                const result = this.os.attachments().uploadAndAddAttachment(this.resource, file);
                result.map(it => {
                  this.attachmentsElement.addToList({
                    uri: it.url,
                    label: file.name,
                  });
                });
                return result;
              }}
            ></pos-upload>
          ) : null}
        </section>
      </Host>
    );
  }
}
