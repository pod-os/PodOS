import { newSpecPage } from '@stencil/core/testing';
import { fireEvent } from '@testing-library/dom';
import { mockPodOS } from '../../test/mockPodOS';
import { PosApp } from '../pos-app/pos-app';
import { PosLabel } from '../pos-label/pos-label';
import { PosLoginForm } from '../pos-login-form/pos-login-form';
import { PosPicture } from '../pos-picture/pos-picture';
import { PosResource } from '../pos-resource/pos-resource';
import { PosLogin } from './pos-login';

describe('pos-login', () => {
  it('allows Alice to log in', async () => {
    const os = mockPodOS();
    // given a page with login and session tracking
    const page = await newSpecPage({
      supportsShadowDom: false,
      components: [PosApp, PosLogin, PosLabel, PosResource, PosPicture, PosLoginForm],
      html: `<pos-app><pos-login></pos-login></pos-app>`,
    });

    // and a dialog that can be opened
    const dialog: any = page.root.querySelector('pos-dialog');
    dialog.showModal = jest.fn();

    // when alice clicks the log in button
    const login = page.root.querySelector('pos-login');
    const button: HTMLButtonElement = login.querySelector('button');
    expect(button.innerText).toEqual('Login');
    button.click();

    // then the dialog shows up
    expect(dialog.showModal).toHaveBeenCalled();

    // when alice selects her Identiy Provider URL
    const loginForm = page.root.querySelector('pos-login-form');
    fireEvent(loginForm, new CustomEvent('pod-os:idp-url-selected', { detail: 'https://idp.test' }));

    await page.waitForChanges();

    // then she is logged in using this idp
    expect(os.login).toHaveBeenCalledWith('https://idp.test');

    // and her WebID shows up
    const label = login.querySelector('pos-resource pos-label');
    expect(label).toEqualText('Alice');

    // and her picture shows up
    const image = login.querySelector('pos-resource pos-image');
    expect(image).toEqualHtml(`
          <pos-image alt="Alice" src="https://pod.example/alice/me.jpg"></pos-image>
    `);

    // and the button becomes a logout button
    const updatedButton: HTMLButtonElement = login.querySelector('button');
    expect(updatedButton.innerText).toEqual('Logout');
  });
});
