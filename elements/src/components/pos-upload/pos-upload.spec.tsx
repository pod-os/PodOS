import { newSpecPage } from '@stencil/core/testing';
import { PosUpload } from './pos-upload';

describe('pos-upload', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PosUpload],
      html: `<pos-upload />`,
    });

    expect(page.root).toEqualHtml(`
      <pos-upload>
        <input type="file" />
      </pos-upload>
    `);
  });
});
