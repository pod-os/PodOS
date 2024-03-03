import { newSpecPage } from '@stencil/core/testing';
import { fireEvent, screen } from '@testing-library/dom';
import { PosLoginForm } from '../pos-login-form';

describe('pos-login-form', () => {
  it('renders an input for the idpUrl and a login button', async () => {
    const page = await newSpecPage({
      components: [PosLoginForm],
      html: `<pos-login-form></pos-login-form>`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-login-form>
  <form method="dialog">
    <label htmlfor="idpUrl">
      URL
    </label>
    <input id="idpUrl" list="suggestedIssuers" type="text" value="">
    <datalist id="suggestedIssuers">
      <option value="https://solidcommunity.net">
        solidcommunity.net
      </option>
      <option value="https://solidweb.org">
        solidweb.org
      </option>
      <option value="https://solidweb.me">
        solidweb.me
      </option>
      <option value="https://inrupt.net">
        inrupt.net
      </option>
      <option value="https://login.inrupt.com">
        Inrupt PodSpaces
      </option>
      <option value="https://trinpod.us">
        trinpod.us
      </option>
      <option value="https://use.id">
        use.id
      </option>
      <option value="https://solid.redpencil.io">
        redpencil.io
      </option>
      <option value="https://datapod.grant.io">
        Data Pod (grant.io)
      </option>
      <option value="https://teamid.live">
        teamid.live
      </option>
    </datalist>
    <input disabled="" id="login" type="submit" value="Create">
  </form>
</pos-login-form>
    `);
  });

  describe('enabling and disabling the login button', () => {
    it('is disabled initially', async () => {
      const page = await newSpecPage({
        components: [PosLoginForm],
        html: `<pos-login-form></pos-login-form>`,
        supportsShadowDom: false,
      });
      const button: HTMLButtonElement = screen.getByRole('button');

      expect(button.disabled).toBe(true);
    });

    it('is enabled after a URL has been entered', async () => {
      // given
      const page = await newSpecPage({
        components: [PosLoginForm],
        html: `<pos-login-form></pos-login-form>`,
        supportsShadowDom: false,
      });

      // when user enters a URL
      const urlInput = page.root.querySelector('input');
      fireEvent.input(urlInput, { target: { value: 'https://pod.provider.test' } });
      await page.waitForChanges();

      // then the button is enabled
      const button: HTMLButtonElement = screen.getByRole('button');
      expect(button.disabled).toBe(false);
    });
  });

  it('submitting the form emits pod-os:idp-url-selected event', async () => {
    // given
    const page = await newSpecPage({
      components: [PosLoginForm],
      html: `<pos-login-form></pos-login-form>`,
      supportsShadowDom: false,
    });

    // and the page listens for pod-os:idp-url-selected events
    const eventListener = jest.fn();
    page.root.addEventListener('pod-os:idp-url-selected', eventListener);

    // and the user entered a URL
    const urlInput = page.root.querySelector('input');
    fireEvent.input(urlInput, { target: { value: 'https://pod.provider.test' } });
    await page.waitForChanges();

    // when the form is submitted
    const form: HTMLFormElement = page.root.querySelector('form');
    fireEvent.submit(form);
    await page.waitForChanges();

    // then the event is submitted with the entered provider URL
    expect(eventListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: 'https://pod.provider.test',
      }),
    );
  });
});
