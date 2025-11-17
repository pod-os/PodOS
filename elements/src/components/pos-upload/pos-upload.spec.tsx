import { newSpecPage } from '@stencil/core/testing';
import { PosUpload } from './pos-upload';

describe('pos-upload', () => {
  it('renders image upload by default', async () => {
    const page = await newSpecPage({
      components: [PosUpload],
      html: `<pos-upload />`,
      supportsShadowDom: false,
    });
    expect(page.root).toEqualHtml(`
      <pos-upload>
        <form>
          <input accept="image/*" multiple="" type="file">
        </form>
      </pos-upload>
    `);
  });

  it('can accept other file types', async () => {
    const page = await newSpecPage({
      components: [PosUpload],
      html: `<pos-upload accept="application/pdf"/>`,
      supportsShadowDom: false,
    });
    expect(page.root).toEqualHtml(`
      <pos-upload accept="application/pdf">
        <form>
          <input accept="application/pdf" multiple="" type="file">
        </form>
      </pos-upload>
    `);
  });

  describe('dragover', () => {
    let page;
    let input: HTMLInputElement;

    beforeEach(async () => {
      page = await newSpecPage({
        components: [PosUpload],
        html: `<pos-upload />`,
        supportsShadowDom: false,
      });
      input = page.root?.querySelector('input');
    });

    it('adds dragover class to input on dragenter', async () => {
      input.dispatchEvent(new Event('dragenter'));
      await page.waitForChanges();
      expect(input).toHaveClass('dragover');
    });

    it('removes dragover class from input on dragleave', async () => {
      input.dispatchEvent(new Event('dragenter'));
      await page.waitForChanges();
      input.dispatchEvent(new Event('dragleave'));
      await page.waitForChanges();
      expect(input).not.toHaveClass('dragover');
    });

    it('removes dragover class from input on drop', async () => {
      input.dispatchEvent(new Event('dragenter'));
      await page.waitForChanges();
      input.dispatchEvent(new Event('drop'));
      await page.waitForChanges();
      expect(input).not.toHaveClass('dragover');
    });
  });
});
