import { PosDialog } from '../pos-dialog/pos-dialog';
import { screen } from '@testing-library/dom';
import { newSpecPage } from '@stencil/core/testing';
import { PosLogin } from './pos-login';

import session from '../../store/session';

jest.mock('@pod-os/core', () => ({}));

jest.mock('../../store/session');

describe('pos-login', () => {
  afterEach(() => {
    session.dispose();
  });

  it('renders login button', async () => {
    session.state.isLoggedIn = false;
    const page = await newSpecPage({
      components: [PosLogin],
      html: `<pos-login></pos-login>`,
    });
    expect(page.root).toEqualHtml(`
    <pos-login>
      <mock:shadow-root>
        <div class="container">
          <button id='login'>
            Login
          </button>
        </div>
        <pos-dialog>
          <span slot="title">
            Sign in to your Pod
          </span>
          <pos-login-form slot="content"></pos-login-form>
        </pos-dialog>
      </mock:shadow-root>
    </pos-login>
  `);
  });

  describe('login dialog', () => {
    let dialog: PosDialog;
    beforeEach(async () => {
      // given a user is not logged in
      session.state.isLoggedIn = false;

      // and a login component
      const page = await newSpecPage({
        components: [PosLogin],
        supportsShadowDom: false,
        html: `<pos-login></pos-login>`,
      });

      // and a dialog that can eventually be opened
      dialog = page.root.querySelector('pos-dialog') as unknown as PosDialog;
      dialog.showModal = jest.fn();
    });

    it('is opened when button is clicked', async () => {
      // when the login button is clicked
      screen.getByRole('button').click();
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
    // and the component is on the page
    const page = await newSpecPage({
      components: [PosLogin],
      html: `<pos-login></pos-login>`,
    });
    const logout = jest.fn();
    await page.rootInstance.setOs({
      logout,
    });
    // when the document receives a logout event
    document.dispatchEvent(new CustomEvent('pod-os:logout'));
    // then logout is performed
    expect(logout).toHaveBeenCalled();
  });

  it('renders logout button, label and picture for webId', async () => {
    session.state.isLoggedIn = true;
    session.state.webId = 'https://pod.example/alice#me';
    const page = await newSpecPage({
      components: [PosLogin],
      html: `<pos-login></pos-login>`,
    });
    expect(page.root).toEqualHtml(`
    <pos-login>
      <mock:shadow-root>
        <div class="container">
          <pos-resource uri="https://pod.example/alice#me">
            <span class="user-data">
              <pos-picture></pos-picture>
              <pos-label></pos-label>
            </span>
          </pos-resource>
          <button id='logout'>
            Logout
          </button>
        </div>
        <pos-dialog>
        <span slot="title">
          Sign in to your Pod
        </span>
        <pos-login-form slot="content"></pos-login-form>
      </pos-dialog>
      </mock:shadow-root>
    </pos-login>
  `);
  });

  it('renders custom logout slot', async () => {
    session.state.isLoggedIn = true;
    session.state.webId = 'https://pod.example/alice#me';
    const page = await newSpecPage({
      components: [PosLogin],
      supportsShadowDom: false,
      html: `<pos-login>
        <span slot="if-logged-in">Custom component</span>
      </pos-login>`,
    });
    expect(page.root).toEqualHtml(`
    <pos-login>
      <div class="container">
        <span slot="if-logged-in">
          Custom component
        </span>
      </div>
      <pos-dialog>
        <span slot="title">
          Sign in to your Pod
        </span>
        <pos-login-form slot="content"></pos-login-form>
      </pos-dialog>
    </pos-login>
  `);
  });
});
