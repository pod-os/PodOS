import { mockPodOS } from '../../../test/mockPodOS';
import { newSpecPage } from '@stencil/core/testing';
import { PosShare } from '../pos-share';
import { when } from 'jest-when';

import session from '../../../store/session';

describe('pos-share', () => {
  beforeEach(() => {
    session.state.webId = 'https://pod.example/alice#me';
  });

  it('renders share button with menu to copy uri', async () => {
    const os = mockPodOS();
    when(os.proposeAppsFor)
      .calledWith('https://resource.example#it', 'https://pod.example/alice#me')
      .mockReturnValue([]);

    const page = await newSpecPage({
      components: [PosShare],
      html: `<pos-share uri="https://resource.example#it"/>`,
      supportsShadowDom: false,
    });

    expect(page.root).toEqualHtml(`
      <pos-share uri="https://resource.example#it">
        <sl-dropdown>
          <button aria-label="Share" part="button" slot="trigger">
            <sl-icon name="share"></sl-icon>
          </button>
          <sl-menu>
            <sl-menu-item value="copy-uri">
              <sl-icon name="copy" slot="prefix"></sl-icon>
              Copy URI
            </sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </pos-share>
    `);
  });

  it('renders a proposed app', async () => {
    const os = mockPodOS();
    when(os.proposeAppsFor)
      .calledWith('https://resource.example#it', 'https://pod.example/alice#me')
      .mockReturnValue([
        {
          name: 'SolidOS Data Browser',
        },
      ]);

    const page = await newSpecPage({
      components: [PosShare],
      html: `<pos-share uri="https://resource.example#it"/>`,
      supportsShadowDom: false,
    });

    expect(page.root.querySelector('sl-menu')).toEqualHtml(`
        <sl-menu>
          <sl-menu-item value="copy-uri">
            <sl-icon name="copy" slot="prefix"></sl-icon>
            Copy URI
          </sl-menu-item>
          <sl-divider></sl-divider>
          <sl-menu-item disabled="">
            Open with...
          </sl-menu-item>
          <sl-menu-item value="SolidOS Data Browser">
            SolidOS Data Browser
          </sl-menu-item>
        </sl-menu>
    `);
  });

  it('renders multiple proposed apps', async () => {
    const os = mockPodOS();
    when(os.proposeAppsFor)
      .calledWith('https://resource.example#it', 'https://pod.example/alice#me')
      .mockReturnValue([
        {
          name: 'SolidOS Data Browser',
        },
        {
          name: 'Umai',
        },
      ]);

    const page = await newSpecPage({
      components: [PosShare],
      html: `<pos-share uri="https://resource.example#it"/>`,
      supportsShadowDom: false,
    });

    expect(page.root.querySelector('sl-menu')).toEqualHtml(`
        <sl-menu>
          <sl-menu-item value="copy-uri">
            <sl-icon name="copy" slot="prefix"></sl-icon>
            Copy URI
          </sl-menu-item>
          <sl-divider></sl-divider>
          <sl-menu-item disabled="">
            Open with...
          </sl-menu-item>
          <sl-menu-item value="SolidOS Data Browser">
            SolidOS Data Browser
          </sl-menu-item>
          <sl-menu-item value="Umai">
            Umai
          </sl-menu-item>
        </sl-menu>
    `);
  });
});
