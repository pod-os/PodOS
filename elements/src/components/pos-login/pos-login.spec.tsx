import { vi } from 'vitest';
import { afterEach, beforeEach, describe, expect, h, it, render, RenderResult } from '@stencil/vitest';
import './pos-login';

import session from '../../store/session';
import { mockOsProvider, mockPodOS } from '../../test/mockPodOS.vitest';
import { withinShadow } from '../../test/withinShadow';
import { userEvent } from '@testing-library/user-event';

vi.mock('@pod-os/core', () => ({}));

vi.mock('../../store/session');

describe('pos-login', () => {
  afterEach(() => {
    session.dispose();
  });

  it('renders login button', async () => {
    session.state.isLoggedIn = false;
    const page = await render(<pos-login></pos-login>);
    expect(page.root.shadowRoot).toEqualHtml(`
        <div class="container">
          <button id="login">
            Login
          </button>
        </div>
        <pos-dialog>
          <span slot="title">
            Sign in to your Pod
          </span>
          <pos-login-form slot="content"></pos-login-form>
        </pos-dialog>
  `);
  });

  describe('login dialog', () => {
    let dialog: HTMLPosDialogElement;
    let page: RenderResult;
    beforeEach(async () => {
      // given a user is not logged in
      session.state.isLoggedIn = false;

      // and a login component
      page = await render(<pos-login></pos-login>);

      // and a dialog that can eventually be opened
      dialog = page.root.shadowRoot!.querySelector('pos-dialog') as HTMLPosDialogElement;
      dialog.showModal = vi.fn();
    });

    it('is opened when button is clicked', async () => {
      // when the login button is clicked
      const button = withinShadow(page).getByRole('button');
      await userEvent.click(button);
      // then the dialog is opened
      expect(dialog.showModal).toHaveBeenCalled();
    });

    it('is opened on login event', async () => {
      // when the document receives a login event
      document.dispatchEvent(new CustomEvent('pod-os:login'));
      // then the dialog is opened
      expect(dialog.showModal).toHaveBeenCalled();
    });
  });

  it('logs out when logout event is received', async () => {
    // given a user is logged in
    session.state.isLoggedIn = true;
    session.state.webId = 'https://pod.example/alice#me';
    // and a PodOS instance
    const os = mockPodOS();
    mockOsProvider(os);
    // and the component is on the page
    await render(<pos-login></pos-login>);
    // when the document receives a logout event
    document.dispatchEvent(new CustomEvent('pod-os:logout'));
    // then logout is performed
    expect(os.logout).toHaveBeenCalled();
  });

  it('renders logout button, label and picture for webId', async () => {
    session.state.isLoggedIn = true;
    session.state.webId = 'https://pod.example/alice#me';
    const page = await render(<pos-login></pos-login>);
    expect(page.root.shadowRoot).toEqualHtml(`
        <div class="container">
          <pos-resource uri="https://pod.example/alice#me">
            <span class="user-data">
              <pos-picture no-upload></pos-picture>
              <pos-label></pos-label>
            </span>
          </pos-resource>
          <button id="logout">
            Logout
          </button>
        </div>
        <pos-dialog>
        <span slot="title">
          Sign in to your Pod
        </span>
        <pos-login-form slot="content"></pos-login-form>
      </pos-dialog>
  `);
  });

  it('renders custom logout slot', async () => {
    session.state.isLoggedIn = true;
    session.state.webId = 'https://pod.example/alice#me';
    const page = await render(
      <pos-login>
        <span slot="if-logged-in">Custom component</span>
      </pos-login>,
    );
    expect(page.root.shadowRoot!.querySelector('.container')).toMatchInlineSnapshot(`
      <div
        class="container"
      >
        <slot
          name="if-logged-in"
        />
      </div>
    `);
    expect(page.root.querySelector('span[slot="if-logged-in"]')).toHaveTextContent('Custom component');
  });

  it('disables no upload on avatar picture', async () => {
    // Given a logged-in user
    session.state.isLoggedIn = true;
    session.state.webId = 'https://pod.example/alice#me';
    const page = await render(<pos-login></pos-login>);

    // When the component renders the avatar
    const picture = page.root.shadowRoot!.querySelector('pos-picture')!;

    // Then the upload functionality should be disabled
    expect(picture).toHaveAttribute('no-upload');
  });
});
