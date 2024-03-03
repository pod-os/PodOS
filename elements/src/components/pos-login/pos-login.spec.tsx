jest.mock('../../store/session');

import { newSpecPage } from '@stencil/core/testing';
import { PosLogin } from './pos-login';

import session from '../../store/session';

describe('pos-login', () => {
  it('renders login button', async () => {
    session.state.isLoggedIn = false;
    const page = await newSpecPage({
      components: [PosLogin],
      html: `<pos-login></pos-login>`,
    });
    expect(page.root).toEqualHtml(`
    <pos-login>
      <mock:shadow-root>
        <ion-button>
          Login
        </ion-button>
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
        <pos-resource uri="https://pod.example/alice#me">
          <span class="user-data">
            <pos-picture></pos-picture>
            <pos-label></pos-label>
          </span>
        </pos-resource>
        <ion-button>
          Logout
        </ion-button>
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
});
