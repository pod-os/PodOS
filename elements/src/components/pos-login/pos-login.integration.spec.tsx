import { afterEach, describe, expect, h, it, render, RenderResult } from '@stencil/vitest';
import { authenticatedUser, server, turtleFile } from '../../test/msw';
import { waitFor } from '@testing-library/dom';
import {
  deepQuerySelector,
  getByShadowLabelText,
  getByShadowRole,
  queryByShadowRole,
  queryByShadowText,
} from 'shadow-dom-testing-library';
import { http, HttpResponse } from 'msw';
import { userEvent } from '@testing-library/user-event';
import { withinShadow } from '../../test/withinShadow';

describe('pos-login', () => {
  afterEach(() => {
    localStorage.removeItem('settings');
  });

  it('renders a login button', async () => {
    // When a page renders a pos-login
    const page = await render(
      <pos-app>
        <pos-login></pos-login>
      </pos-app>,
    );

    // then it renders a login button
    const loginButton = getLoginButton(page);
    expect(loginButton).toMatchInlineSnapshot(`
      <button
        id="login"
      >
        Login
      </button>
    `);

    // and does not yet show a dialog
    expect(queryByShadowRole(page.root, 'dialog')).toBeNull();
  });

  it('choosing an IdP redirects to its login page', async () => {
    // Given an Identity Provider is available
    server.use(
      http.get('https://idp.test/.well-known/openid-configuration', () =>
        HttpResponse.json({
          authorization_endpoint: 'https://idp.test/.oidc/auth',
          claims_parameter_supported: true,
          claims_supported: ['azp', 'sub', 'webid', 'sid', 'auth_time', 'iss'],
          code_challenge_methods_supported: ['S256'],
          end_session_endpoint: 'https://idp.test/.oidc/session/end',
          grant_types_supported: ['implicit', 'authorization_code', 'refresh_token', 'client_credentials'],
          issuer: 'https://idp.test/',
          jwks_uri: 'https://idp.test/.oidc/jwks',
          registration_endpoint: 'https://idp.test/.oidc/reg',
          authorization_response_iss_parameter_supported: true,
          response_modes_supported: ['form_post', 'fragment', 'query'],
          response_types_supported: ['code id_token', 'code', 'id_token', 'none'],
          scopes_supported: ['openid', 'profile', 'offline_access', 'webid'],
          subject_types_supported: ['public'],
          token_endpoint_auth_methods_supported: [
            'client_secret_basic',
            'client_secret_jwt',
            'client_secret_post',
            'private_key_jwt',
            'none',
          ],
          token_endpoint_auth_signing_alg_values_supported: ['HS256', 'RS256', 'PS256', 'ES256', 'EdDSA'],
          token_endpoint: 'https://idp.test/.oidc/token',
          id_token_signing_alg_values_supported: ['ES256'],
          pushed_authorization_request_endpoint: 'https://idp.test/.oidc/request',
          request_parameter_supported: false,
          request_uri_parameter_supported: false,
          introspection_endpoint: 'https://idp.test/.oidc/token/introspection',
          dpop_signing_alg_values_supported: [
            'RS256',
            'RS384',
            'RS512',
            'PS256',
            'PS384',
            'PS512',
            'ES256',
            'ES256K',
            'ES384',
            'ES512',
            'EdDSA',
          ],
          revocation_endpoint: 'https://idp.test/.oidc/token/revocation',
          claim_types_supported: ['normal'],
        }),
      ),
      http.post('https://idp.test/.oidc/reg', () => {
        return HttpResponse.json({});
      }),
    );

    // and a page renders a pos-login
    const page = await render(
      <pos-app>
        <pos-login></pos-login>
      </pos-app>,
    );

    // when the login button is clicked
    const loginButton = getLoginButton(page);
    await userEvent.click(loginButton);

    // then the dialog shows up
    const dialog = getByShadowRole(page.root, 'dialog');
    expect(dialog).toBeVisible();

    // when Alice enters there Identity Provider
    const idpUrl = getByShadowLabelText(dialog, 'Please enter your Identity Provider');
    await userEvent.type(idpUrl, 'https://idp.test');

    // and clicks the login button
    const loginButtonInDialog = getByShadowRole(dialog, 'button', { name: 'Login' });
    await userEvent.click(loginButtonInDialog);

    // Then she is redirected to the Identity Provider
    await waitFor(() => {
      expect(location.href).toMatch(/https:\/\/idp\.test\/\.oidc\/auth\?response_type=code&redirect_uri=.*/);
    });
  });

  it('pre-fills the IdP URL when one has been remembered', async () => {
    // Given an IdP URL was remembered from a previous visit
    const rememberedIdp = 'https://remembered.idp.test';
    localStorage.setItem('settings', JSON.stringify({ offlineCache: false, rememberedIdp }));
    // The settings store in the bundle reads localStorage only once when its module is
    // evaluated. At this point in a full test run it is already loaded, so the only way
    // to get the seeded value into the store is its real cross-tab sync: dispatching the
    // storage event makes the store's own listener pick up the value.
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'settings',
        newValue: localStorage.getItem('settings'),
      }),
    );

    // when a page renders a pos-login
    const page = await render(
      <pos-app>
        <pos-login></pos-login>
      </pos-app>,
    );

    // and the login dialog is opened
    const loginButton = getLoginButton(page);
    await userEvent.click(loginButton);

    // then the IdP input already has the remembered URL as its value
    const dialog = getByShadowRole(page.root, 'dialog');
    const idpUrl = getByShadowLabelText(dialog, 'Please enter your Identity Provider');
    expect((idpUrl as HTMLInputElement).value).toBe(rememberedIdp);

    // and the login button is already enabled, without typing anything
    const loginButtonInDialog = getByShadowRole(dialog, 'button', { name: 'Login' });
    expect(loginButtonInDialog).toBeEnabled();
  });

  it('shows user info and allows to sign out, when already logged in', async () => {
    // Given Jane is authenticated
    server.use(
      ...authenticatedUser('https://janedoe.test/profile/card#me'),
      turtleFile(
        'https://janedoe.test/profile/card',
        `
          <#me> a <http://schema.org/Person> ;
                  <http://schema.org/name> "Jane Doe" .
        `,
      ),
    );
    // when a page renders a pos-login
    const page = await render(
      <pos-app>
        <pos-login></pos-login>
      </pos-app>,
    );

    // then a logout button shows up
    let logout!: HTMLElement;
    await waitFor(() => {
      logout = getByShadowRole(page.root, 'button', { name: 'Logout' });
    });
    expect(logout).toMatchInlineSnapshot(`
      <button
        id="logout"
      >
        Logout
      </button>
    `);

    // and Jane's name is shown
    const name = queryByShadowText(page.root, 'Jane Doe');
    expect(name).not.toBeNull();

    // when Jane signs out
    await userEvent.click(logout);

    // then her name disappears
    await waitFor(() => {
      expect(queryByShadowText(page.root, 'Jane Doe')).toBeNull();
    });

    // and the login button shows up
    const login = getLoginButton(page);
    expect(login).toBeVisible();
  });
});

function getLoginButton(page: RenderResult) {
  const login = deepQuerySelector(page.root, 'pos-login')!;
  return withinShadow(login).getByRole('button', { name: 'Login' });
}
