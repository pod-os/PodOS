import { newSpecPage } from '@stencil/core/testing';
import { PosAppDashboard } from './pos-app-dashboard';
import session from '../../store/session';
import { WebIdProfile } from '@pod-os/core';

describe('pos-app-dashboard', () => {
  beforeEach(() => {
    session.reset();
  });

  it('renders getting started and example resources when not signed in', async () => {
    const page = await newSpecPage({
      components: [PosAppDashboard],
      html: `<pos-app-dashboard />`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-app-dashboard>
        <pos-getting-started></pos-getting-started>
        <pos-example-resources></pos-example-resources>
      </pos-app-dashboard>
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

    const page = await newSpecPage({
      components: [PosAppDashboard],
      html: `<pos-app-dashboard />`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-app-dashboard>
        <pos-example-resources></pos-example-resources>
        <div class="card"><h2>Your public things</h2><pos-type-index-entries uri="https://alice.example/settings/publicTypeIndex"></pos-type-index-entries></div>
        <div class="card"><h2>Your private things</h2><pos-type-index-entries uri="https://alice.example/settings/privateTypeIndex"></pos-type-index-entries></div>
      </pos-app-dashboard>
    `);
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

    const page = await newSpecPage({
      components: [PosAppDashboard],
      html: `<pos-app-dashboard />`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-app-dashboard>
        <pos-example-resources></pos-example-resources>
      </pos-app-dashboard>
    `);
  });
});
