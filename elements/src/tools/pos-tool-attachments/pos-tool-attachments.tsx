import { Component, h, Host } from '@stencil/core';

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
            uploader={() => {
              throw new Error('Not yet implemented');
            }}
          ></pos-upload>
        </section>
      </Host>
    );
  }
}
