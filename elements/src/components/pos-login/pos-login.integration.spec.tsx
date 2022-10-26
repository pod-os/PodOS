import { mockPodOS } from '../../test/mockPodOS';
import { newSpecPage } from '@stencil/core/testing';
import { PosApp } from '../pos-app/pos-app';
import { PosLabel } from '../pos-label/pos-label';
import { PosPicture } from '../pos-picture/pos-picture';
import { PosResource } from '../pos-resource/pos-resource';
import { PosLogin } from './pos-login';

describe('pos-login', () => {
  it('allows Alice to log in', async () => {
    mockPodOS();
    // given a page with login and session tracking
    const page = await newSpecPage({
      supportsShadowDom: false,
      components: [PosApp, PosLogin, PosLabel, PosResource, PosPicture],
      html: `<pos-app><pos-login></pos-login></pos-app>`,
    });

    // when alice logs in
    const login = page.root.querySelector('pos-login');
    const button = login.querySelector('ion-button');
    expect(button.innerText).toEqual('Login');
    await button.click();
    await page.waitForChanges();

    // then her WebID shows up
    const label = login.querySelector('pos-resource pos-label');
    expect(label).toEqualText('Alice');

    // then her picture shows up
    const image = login.querySelector('pos-resource pos-image');
    expect(image).toEqualHtml(`
          <pos-image src="https://pod.example/alice/me.jpg"></pos-image>
    `);

    // the button becomes a logout button
    expect(button.innerText).toEqual('Logout');
  });
});
