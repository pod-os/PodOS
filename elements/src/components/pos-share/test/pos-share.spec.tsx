import { newSpecPage } from '@stencil/core/testing';
import { PosShare } from '../pos-share';

describe('pos-share', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PosShare],
      html: `<pos-share />`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-share>
        <button part="button">
          <sl-icon name="share"></sl-icon>
        </button>
      </pos-share>
    `);
  });
});
