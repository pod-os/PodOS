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

  it('renders only the example resources when signed in', async () => {
    session.state = {
      isLoggedIn: true,
      webId: 'https://alice.example/card#me',
      profile: {} as WebIdProfile,
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
