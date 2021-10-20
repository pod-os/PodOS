jest.mock('../../store/session');

import { newSpecPage } from '@stencil/core/testing';
import { PosLogin } from './pos-login';

import session from '../../store/session';

describe('pos-login', () => {
  it('renders login button', async () => {
    session.isLoggedIn = false;
    const page = await newSpecPage({
      components: [PosLogin],
      html: `<pos-login></pos-login>`,
    });
    expect(page.root).toEqualHtml(`
    <pos-login>
      <ion-button>
        Login
      </ion-button>
    </pos-login>
  `);
  });

  it('renders logout button and WebID', async () => {
    session.isLoggedIn = true;
    session.webId = 'https://pod.example/alice#me';
    const page = await newSpecPage({
      components: [PosLogin],
      html: `<pos-login></pos-login>`,
    });
    expect(page.root).toEqualHtml(`
    <pos-login>
      https://pod.example/alice#me
      <ion-button>
        Logout
      </ion-button>
    </pos-login>
  `);
  });
});
