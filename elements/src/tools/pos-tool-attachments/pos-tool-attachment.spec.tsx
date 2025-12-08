import { newSpecPage } from '@stencil/core/testing';
import { PosToolAttachments } from './pos-tool-attachments';

describe('pos-tool-attachments', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PosToolAttachments],
      html: `<pos-tool-attachments />`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-tool-attachments>
        <section>
          <article>
            <h2>
              Attachments
            </h2>
            <pos-attachments></pos-attachments>
          </article>
        </section>
        <section>
          <pos-upload></pos-upload>
        </section>
      </pos-tool-attachments>
    `);
  });
});
