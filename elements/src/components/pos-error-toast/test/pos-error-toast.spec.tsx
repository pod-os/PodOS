import { newSpecPage } from '@stencil/core/testing';

import { PosErrorToast } from '../pos-error-toast';

describe('pos-error-toast', () => {
  it('renders its children', async () => {
    const page = await newSpecPage({
      components: [PosErrorToast],
      supportsShadowDom: false,
      html: `<pos-error-toast>Slot value</pos-error-toast>`,
    });
    expect(page.root).toEqualHtml(`
      <pos-error-toast>
        <ion-toast duration="0" message="Workarround to preload ion-toast and ion-ripple-effect to be able to show errors while offline" trigger="never">
          <ion-ripple-effect></ion-ripple-effect>
        </ion-toast>
        Slot value
      </pos-error-toast>
    `);
  });
});
