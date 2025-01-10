import { newSpecPage } from '@stencil/core/testing';
import { PosPicture } from './pos-picture';

describe('pos-picture', () => {
  it('is empty initially', async () => {
    const page = await newSpecPage({
      components: [PosPicture],
      html: `<pos-picture />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-picture>
        <mock:shadow-root></mock:shadow-root>
      </pos-picture>
  `);
  });

  it('renders pos-image depicting resource', async () => {
    const page = await newSpecPage({
      components: [PosPicture],
      html: `<pos-picture />`,
    });
    await page.rootInstance.receiveResource({
      label: () => 'a picture',
      picture: () => ({
        url: 'https://resource.test/picture.png',
      }),
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-picture>
        <mock:shadow-root><pos-image src="https://resource.test/picture.png" alt="a picture"/></mock:shadow-root>
      </pos-picture>
  `);
  });

  it('renders pos-image with blurred background', async () => {
    const page = await newSpecPage({
      components: [PosPicture],
      html: `<pos-picture blurred-background />`,
    });
    await page.rootInstance.receiveResource({
      label: () => 'a picture',
      picture: () => ({
        url: 'https://resource.test/picture.png',
      }),
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-picture blurred-background>
        <mock:shadow-root><pos-image blurredbackground="" src="https://resource.test/picture.png" alt="a picture"/></mock:shadow-root>
      </pos-picture>
  `);
  });

  it('renders nothing when resource has no picture', async () => {
    const page = await newSpecPage({
      components: [PosPicture],
      html: `<pos-picture />`,
    });
    await page.rootInstance.receiveResource({
      picture: () => null,
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-picture>
        <mock:shadow-root></mock:shadow-root>
      </pos-picture>
  `);
  });
});
