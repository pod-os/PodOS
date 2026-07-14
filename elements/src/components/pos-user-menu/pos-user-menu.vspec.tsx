import { vi } from 'vitest';
import { describe, expect, it, render, h, RenderResult } from '@stencil/vitest';

import './pos-user-menu';

vi.mock('./shoelace', () => ({}));

describe('pos-user-menu', () => {
  it('renders the user menu', async () => {
    const page = await render(<pos-user-menu webId="https://pod.example/alice#me" />);

    expect(page.root.shadowRoot).toEqualHtml(`
      <pos-resource uri="https://pod.example/alice#me">
        <sl-dropdown>
          <button slot="trigger" aria-label="User menu">
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
    `);
  });

  it('navigates to profile', async () => {
    const page = await render(<pos-user-menu webId="https://pod.example/alice#me" />);
    const link = vi.fn();
    page.root.addEventListener('pod-os:link', link);

    select(page, 'profile');
    expect(link).toHaveBeenCalledWith(expect.objectContaining({ detail: 'https://pod.example/alice#me' }));
  });

  it('navigates to dashboard', async () => {
    const page = await render(<pos-user-menu webId="https://pod.example/alice#me" />);
    const link = vi.fn();
    page.root.addEventListener('pod-os:link', link);
    select(page, 'dashboard');
    expect(link).toHaveBeenCalledWith(expect.objectContaining({ detail: 'pod-os:dashboard' }));
  });

  it('navigates to settings', async () => {
    const page = await render(<pos-user-menu webId="https://pod.example/alice#me" />);
    const link = vi.fn();
    page.root.addEventListener('pod-os:link', link);
    select(page, 'settings');
    expect(link).toHaveBeenCalledWith(expect.objectContaining({ detail: 'pod-os:settings' }));
  });

  it('triggers logout', async () => {
    const page = await render(<pos-user-menu webId="https://pod.example/alice#me" />);
    const logout = vi.fn();
    page.root.addEventListener('pod-os:logout', logout);
    select(page, 'logout');
    expect(logout).toHaveBeenCalled();
  });

  function select(page: RenderResult, value: string) {
    page.root.dispatchEvent(new CustomEvent('sl-select', { detail: { item: { value } } }));
  }
});
