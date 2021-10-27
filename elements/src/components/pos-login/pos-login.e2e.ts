import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('pos-login', () => {
  it('allows Alice to log in', async () => {
    // given a page with login and session tracking
    const page = await newE2EPage();
    await mockPodOs(page);
    const errors = trackErrors(page);
    await page.setContent(`<pos-app><pos-login></pos-login></pos-app>`);

    // when alice logs in
    const beforeLogin = await page.find('pos-login');
    const loginButton = await beforeLogin.find('ion-button');
    expect(loginButton.innerText).toEqual('Login');
    page.on('dialog', dialog => {
      dialog.accept('https://ipd.example/');
    });
    await loginButton.click();
    await page.waitForChanges();

    // then her WebID shows up
    const afterLogin = await page.find('pos-login');
    expect(afterLogin.innerText).toContain('https://pod.example/alice#me');

    // and a logout button becomes available
    const logoutButton = await afterLogin.find('ion-button');
    expect(logoutButton.innerText).toEqual('Logout');
    expect(errors[0]).toBeUndefined();
  });

  async function mockPodOs(page: E2EPage) {
    await page.evaluateOnNewDocument(() => {
      let trackSessionCallback = null;
      Object.defineProperty(window, 'PodOS', {
        get() {
          return {
            PodOS: function PodOS() {
              this.login = () => trackSessionCallback({ isLoggedIn: true, webId: 'https://pod.example/alice#me' });
              this.logout = () => null;
              this.trackSession = cb => (trackSessionCallback = cb);
              this.handleIncomingRedirect = () => Promise.resolve();
            },
          };
        },
      });
    });
  }

  function trackErrors(page: E2EPage) {
    const errors = [];
    page.on('pageerror', function (err) {
      errors.push(err);
    });
    return errors;
  }
});
