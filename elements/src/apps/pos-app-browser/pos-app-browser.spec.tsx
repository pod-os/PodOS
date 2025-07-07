import { newSpecPage } from '@stencil/core/testing';
import { PosAppBrowser } from './pos-app-browser';
import { getByRole } from '@testing-library/dom';

describe('pos-app-browser', () => {
  it('uses internal router for internal URIs', async () => {
    const page = await newSpecPage({
      components: [PosAppBrowser],
      html: `<pos-app-browser />`,
    });

    page.rootInstance.uri = 'pod-os:dashboard';

    await page.waitForChanges();

    const main = getByRole(page.root, 'main');

    expect(main).toEqualHtml(`
      <main>
        <pos-internal-router uri="pod-os:dashboard"></pos-internal-router>
      </main>
    `);
  });

  it('hides uri in navigation bar, if visiting dashboard', async () => {
    const page = await newSpecPage({
      components: [PosAppBrowser],
      html: `<pos-app-browser />`,
    });

    page.rootInstance.uri = 'pod-os:dashboard';

    await page.waitForChanges();

    const main = getByRole(page.root, 'banner');
    const navigation = main.querySelector('pos-navigation');

    expect(navigation).toEqualAttribute('uri', '');
  });

  it('shows uri in navigation bar, if visiting other internal pages', async () => {
    const page = await newSpecPage({
      components: [PosAppBrowser],
      html: `<pos-app-browser />`,
    });

    page.rootInstance.uri = 'pod-os:other';

    await page.waitForChanges();

    const main = getByRole(page.root, 'banner');
    const navigation = main.querySelector('pos-navigation');

    expect(navigation).toEqualAttribute('uri', 'pod-os:other');
  });

  it('shows uri in navigation bar, if visiting http(s) URIs', async () => {
    const page = await newSpecPage({
      components: [PosAppBrowser],
      html: `<pos-app-browser />`,
    });

    page.rootInstance.uri = 'https://resource.test';

    await page.waitForChanges();

    const main = getByRole(page.root, 'banner');
    const navigation = main.querySelector('pos-navigation');

    expect(navigation).toEqualAttribute('uri', 'https://resource.test');
  });

  it('uses type router for http(s) URIs ', async () => {
    const page = await newSpecPage({
      components: [PosAppBrowser],
      html: `<pos-app-browser />`,
    });

    page.rootInstance.uri = 'https://resource.test/';

    await page.waitForChanges();

    const main = getByRole(page.root, 'main');

    expect(main).toEqualHtml(`
      <main>
        <pos-resource uri="https://resource.test/">
          <pos-type-router></pos-type-router>
        </pos-resource>
      </main>
    `);
  });

  it('render nothing as long as uri is not set', async () => {
    const page = await newSpecPage({
      components: [PosAppBrowser],
      html: `<pos-app-browser />`,
    });

    await page.waitForChanges();

    const main = getByRole(page.root, 'main');

    expect(main).toEqualHtml(`
      <main>
      </main>
    `);
  });
});
