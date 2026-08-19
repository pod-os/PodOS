import { beforeEach, describe, expect, it, render } from '@stencil/vitest';

import session from '../../store/session';
import { WebIdProfile } from '@pod-os/core';

import './pos-app-dashboard';
import { getByRole } from '@testing-library/dom';

describe('pos-app-dashboard', () => {
  beforeEach(() => {
    session.reset();
  });

  it('renders getting started and example resources when not signed in', async () => {
    const page = await render('<pos-app-dashboard></pos-app-dashboard>');

    expect(page.root.shadowRoot).toEqualHtml(`
      <pos-getting-started></pos-getting-started>
      <pos-example-resources></pos-example-resources>
    `);
  });

  it('renders example resources and type index entries when signed in', async () => {
    session.state = {
      isLoggedIn: true,
      webId: 'https://alice.example/card#me',
      profile: {
        getPublicTypeIndex: () => 'https://alice.example/settings/publicTypeIndex',
        getPrivateTypeIndex: () => 'https://alice.example/settings/privateTypeIndex',
      } as WebIdProfile,
    };

    const page = await render('<pos-app-dashboard></pos-app-dashboard>');

    expect(page.root.shadowRoot!.querySelector('pos-example-resources')).toBeDefined();

    const publicThings = getByRole(page.root.shadowRoot as unknown as HTMLElement, 'heading', {
      name: 'Your public things',
    }).parentElement!;

    expect(publicThings.querySelector('pos-type-index-entries')).toEqualHtml(
      `<pos-type-index-entries uri="https://alice.example/settings/publicTypeIndex"></pos-type-index-entries>`,
    );

    const privateThings = getByRole(page.root.shadowRoot as unknown as HTMLElement, 'heading', {
      name: 'Your private things',
    }).parentElement!;

    expect(privateThings.querySelector('pos-type-index-entries')).toEqualHtml(
      `<pos-type-index-entries uri="https://alice.example/settings/privateTypeIndex"></pos-type-index-entries>`,
    );
  });

  it('renders only example resources when signed in and now type indexes available', async () => {
    session.state = {
      isLoggedIn: true,
      webId: 'https://alice.example/card#me',
      profile: {
        getPublicTypeIndex: () => undefined,
        getPrivateTypeIndex: () => undefined,
      } as WebIdProfile,
    };

    const page = await render('<pos-app-dashboard></pos-app-dashboard>');

    expect(page.root.shadowRoot).toEqualHtml(`<pos-example-resources></pos-example-resources>`);
  });
});
