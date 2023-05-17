import { newSpecPage } from '@stencil/core/testing';
import { PosNewThingForm } from '../pos-new-thing-form';

describe('pos-new-thing-form', async () => {
  it('renders a form', async () => {
    const page = await newSpecPage({
      components: [PosNewThingForm],
      html: `<pos-new-thing-form></pos-new-thing-form>`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(
      `
        <pos-new-thing-form>
          <form>
            <label>
              Type
              <pos-select-term></pos-select-term>
            </label>
            <label>
              Name
              <input type="text">
            </label>
            <input type="submit" value="Create" />
          </form>
        </pos-new-thing-form>`,
    );
  });
});
