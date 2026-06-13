import { describe, expect, it } from '@stencil/vitest';
import { getByRole } from '@testing-library/dom';

import { render } from '@stencil/vitest';

import './pos-app-browser';

describe('pos-app-browser', () => {
  it('uses internal router for internal URIs', async () => {
    const page = await render('<pos-app-browser></pos-app-browser>');

    routeChangedTo(page.root, 'pod-os:dashboard');

    await page.waitForChanges();

    const main = getByRole(page.root, 'main');

    expect(main).toEqualHtml(`
      <main>
        <pos-internal-router uri="pod-os:dashboard"></pos-internal-router>
      </main>
    `);
  });

  it('hides uri in navigation bar, if visiting dashboard', async () => {
    const page = await render('<pos-app-browser></pos-app-browser>');

    routeChangedTo(page.root, 'pod-os:dashboard');

    await page.waitForChanges();

    const main = getByRole(page.root, 'banner');
    const navigation = main.querySelector('pos-navigation');

    expect(navigation).toEqualAttribute('uri', '');
  });

  it('shows uri in navigation bar, if visiting other internal pages', async () => {
    const page = await render('<pos-app-browser></pos-app-browser>');

    routeChangedTo(page.root, 'pod-os:other');

    await page.waitForChanges();

    const main = getByRole(page.root, 'banner');
    const navigation = main.querySelector('pos-navigation');

    expect(navigation).toEqualAttribute('uri', 'pod-os:other');
  });

  it('shows uri in navigation bar, if visiting http(s) URIs', async () => {
    const page = await render('<pos-app-browser></pos-app-browser>');

    routeChangedTo(page.root, 'https://resource.test');

    await page.waitForChanges();

    const main = getByRole(page.root, 'banner');
    const navigation = main.querySelector('pos-navigation');

    expect(navigation).toEqualAttribute('uri', 'https://resource.test');
  });

  it('allows to log in', async () => {
    const page = await render('<pos-app-browser></pos-app-browser>');
    const main = getByRole(page.root, 'banner');
    const login = main.querySelector('pos-login');
    expect(login).toEqualHtml(`
    <pos-login>
      <pos-user-menu webid slot="if-logged-in"></pos-user-menu>
    </pos-login>`);
  });

  it('uses type router for http(s) URIs ', async () => {
    const page = await render('<pos-app-browser></pos-app-browser>');

    routeChangedTo(page.root, 'https://resource.test/');

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
    const page = await render('<pos-app-browser></pos-app-browser>');

    await page.waitForChanges();

    const main = getByRole(page.root, 'main');

    expect(main).toEqualHtml(`
      <main>
      </main>
    `);
  });

  function routeChangedTo(root: HTMLElement, route: string) {
    const router = root.querySelector('pos-router')!;
    router.dispatchEvent(new CustomEvent('pod-os:route-changed', { detail: route }));
  }
});
