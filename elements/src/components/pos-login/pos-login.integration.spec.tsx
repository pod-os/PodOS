import { describe, expect, h, it, render, RenderResult } from '@stencil/vitest';
import { authenticatedUser, server, turtleFile } from '../../test/msw';
import { waitFor, within } from '@testing-library/dom';
import { http, HttpResponse } from 'msw';
import {
  deepQuerySelector,
  getByShadowLabelText,
  getByShadowRole,
  queryByShadowRole,
  queryByShadowText,
} from 'shadow-dom-testing-library';
import { userEvent } from '@testing-library/user-event';

describe('pos-login', () => {
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
  return within(login.shadowRoot as unknown as HTMLElement).getByRole('button', { name: 'Login' });
}
