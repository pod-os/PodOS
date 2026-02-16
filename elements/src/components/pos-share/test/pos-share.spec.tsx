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
        <sl-dropdown>
          <button aria-label="Share" part="button" slot="trigger">
            <sl-icon name="share"></sl-icon>
          </button>
          <sl-menu>
            <sl-menu-item value="dashboard">
              <sl-icon name="copy" slot="prefix"></sl-icon>
              Copy URI
            </sl-menu-item>
            <sl-divider></sl-divider>
            <sl-menu-item disabled="">
              Open with...
            </sl-menu-item>
            <sl-menu-item value="logout">
              SolidOS Data Browser
            </sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </pos-share>
    `);
  });
});
