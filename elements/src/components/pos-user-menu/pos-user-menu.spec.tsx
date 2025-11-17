jest.mock('./shoelace', () => ({}));

import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { PosUserMenu } from './pos-user-menu';

describe('pos-user-menu', () => {
  it('renders the user menu', async () => {
    const page = await newSpecPage({
      components: [PosUserMenu],
      supportsShadowDom: false,
      html: `<pos-user-menu web-id="https://pod.example/alice#me" />`,
    });

    expect(page.root).toEqualHtml(`
      <pos-user-menu web-id="https://pod.example/alice#me">
          <pos-resource uri="https://pod.example/alice#me">
            <sl-dropdown>
              <button slot="trigger" aria-label="User menu" >
                <pos-picture no-upload>
                  <sl-avatar></sl-avatar>
                </pos-picture>
              </button>
              <sl-menu>
                <sl-menu-item value="dashboard">
                  Dashboard
                </sl-menu-item>
                <sl-menu-item value="profile">
                  <pos-label></pos-label>
                </sl-menu-item>
                <sl-menu-item value="settings">
                  Settings
                </sl-menu-item>
                <sl-divider></sl-divider>
                <sl-menu-item value="logout">
                  Logout
                </sl-menu-item>
              </sl-menu>
            </sl-dropdown>
          </pos-resource>
      </pos-user-menu>
    `);
  });

  it('navigates to profile', async () => {
    const page = await newSpecPage({
      components: [PosUserMenu],
      supportsShadowDom: false,
      html: `<pos-user-menu web-id="https://pod.example/alice#me" />`,
    });
    const link = jest.fn();
    page.root.addEventListener('pod-os:link', link);

    select(page, 'profile');
    expect(link).toHaveBeenCalledWith(expect.objectContaining({ detail: 'https://pod.example/alice#me' }));
  });

  it('navigates to dashboard', async () => {
    const page = await newSpecPage({
      components: [PosUserMenu],
      supportsShadowDom: false,
      html: `<pos-user-menu webId="https://pod.example/alice#me" />`,
    });
    const link = jest.fn();
    page.root.addEventListener('pod-os:link', link);
    select(page, 'dashboard');
    expect(link).toHaveBeenCalledWith(expect.objectContaining({ detail: 'pod-os:dashboard' }));
  });

  it('navigates to settings', async () => {
    const page = await newSpecPage({
      components: [PosUserMenu],
      supportsShadowDom: false,
      html: `<pos-user-menu webId="https://pod.example/alice#me" />`,
    });
    const link = jest.fn();
    page.root.addEventListener('pod-os:link', link);
    select(page, 'settings');
    expect(link).toHaveBeenCalledWith(expect.objectContaining({ detail: 'pod-os:settings' }));
  });

  it('triggers logout', async () => {
    const page = await newSpecPage({
      components: [PosUserMenu],
      supportsShadowDom: false,
      html: `<pos-user-menu webId="https://pod.example/alice#me" />`,
    });
    const logout = jest.fn();
    page.root.addEventListener('pod-os:logout', logout);
    select(page, 'logout');
    expect(logout).toHaveBeenCalled();
  });

  function select(page: SpecPage, value: string) {
    page.root.dispatchEvent(new CustomEvent('sl-select', { detail: { item: { value } } }));
  }
});
