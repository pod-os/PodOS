import { newSpecPage } from '@stencil/core/testing';
import { fireEvent, screen } from '@testing-library/dom';
import { PosLoginForm } from '../pos-login-form';
import { localSettings } from '../../../store/settings';

describe('pos-login-form', () => {
  beforeEach(() => {
    localSettings.state.rememberedIdp = null;
  });

  it('renders an input for the idpUrl and a login button', async () => {
    const page = await newSpecPage({
      components: [PosLoginForm],
      html: `<pos-login-form></pos-login-form>`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-login-form>
  <form method="dialog">
    <label for="idpUrl">
      Please enter your Identity Provider
    </label>
    <input id="idpUrl" list="suggestedIssuers" placeholder="Type to search..." type="url" required value="">
    <datalist id="suggestedIssuers">
      <option value="https://solidcommunity.net/">
        solidcommunity.net
      </option>
      <option value="https://solidweb.me/">
        solidweb.me
      </option>
      <option value="https://login.inrupt.com">
        Inrupt PodSpaces
      </option>
      <option value="https://trinpod.us">
        trinpod.us
      </option>
      <option value="https://trinpod.eu">
        trinpod.eu
      </option>
      <option value="https://solid.redpencil.io/">
        redpencil.io
      </option>
      <option value="https://teamid.live/">
        teamid.live
      </option>
    </datalist>
    <label class="remember-me">
      <input id="rememberMe" type="checkbox">
      Remember me
    </label>
    <input disabled="" id="login" type="submit" value="Login">
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

  it('pre-fills IdP URL and checks the box when a value is in settings', async () => {
    // given a remembered IdP URL
    localSettings.state.rememberedIdp = 'https://remembered.idp.test';

    // when the component mounts
    const page = await newSpecPage({
      components: [PosLoginForm],
      html: `<pos-login-form></pos-login-form>`,
      supportsShadowDom: false,
    });

    // then the URL input is pre-filled
    const idpInput: HTMLInputElement = screen.getByLabelText('Please enter your Identity Provider');
    expect(idpInput.value).toBe('https://remembered.idp.test');

    // and the checkbox is pre-checked
    const checkbox: HTMLInputElement = screen.getByLabelText('Remember me');
    expect(checkbox.checked).toBe(true);

    // and the submit button is already enabled
    const button: HTMLInputElement = screen.getByRole('button');
    expect(button.disabled).toBe(false);
  });

  it('renders "Remember me" checkbox unchecked by default', async () => {
    await newSpecPage({
      components: [PosLoginForm],
      html: `<pos-login-form></pos-login-form>`,
      supportsShadowDom: false,
    });

    const checkbox: HTMLInputElement = screen.getByLabelText('Remember me');
    expect(checkbox).not.toBeNull();
    expect(checkbox.type).toBe('checkbox');
    expect(checkbox.checked).toBe(false);
  });

  it('saves IdP URL to settings on submit when "Remember me" is checked', async () => {
    // given
    const page = await newSpecPage({
      components: [PosLoginForm],
      html: `<pos-login-form></pos-login-form>`,
      supportsShadowDom: false,
    });

    // and the user entered a URL
    const urlInput = page.root.querySelector('#idpUrl');
    fireEvent.input(urlInput, { target: { value: 'https://pod.provider.test' } });
    await page.waitForChanges();

    // and the user checks the "Remember me" checkbox
    const checkbox: HTMLInputElement = screen.getByLabelText('Remember me');
    fireEvent.change(checkbox, { target: { checked: true } });
    await page.waitForChanges();

    // when the form is submitted
    const form: HTMLFormElement = page.root.querySelector('form');
    fireEvent.submit(form);
    await page.waitForChanges();

    // then the IdP URL is saved to settings
    expect(localSettings.state.rememberedIdp).toBe('https://pod.provider.test');
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
