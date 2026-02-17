jest.mock('../openNewTab');

import { mockPodOS } from '../../../test/mockPodOS';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { PosShare } from '../pos-share';

import { when } from 'jest-when';
import { OpenWithApp, Thing } from '@pod-os/core';

import { openNewTab } from '../openNewTab';

describe('pos-share', () => {
  let os;
  let thing;
  beforeEach(() => {
    jest.resetAllMocks();
    os = mockPodOS();
    global.open = jest.fn();
    const thing = { fake: 'Thing' } as unknown as Thing;
    when(os.store.get).calledWith(thing).mockReturnValue(thing);
    when(os.proposeAppsFor).mockReturnValue([]);
  });

  it('renders share button with menu to copy uri', async () => {
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
      .calledWith(thing)
      .mockReturnValue([
        {
          name: 'SolidOS Data Browser',
          appUrl: 'https://solidos.github.io/mashlib/dist/browse.html',
          uriParam: 'uri',
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
          <sl-menu-item>
            SolidOS Data Browser
          </sl-menu-item>
        </sl-menu>
    `);
  });

  it('renders multiple proposed apps', async () => {
    const os = mockPodOS();
    when(os.proposeAppsFor)
      .calledWith(thing)
      .mockReturnValue([
        {
          name: 'SolidOS Data Browser',
          appUrl: 'https://solidos.github.io/mashlib/dist/browse.html',
          uriParam: 'uri',
        },
        {
          name: 'Penny',
          appUrl: 'https://penny.vincenttunru.com/explore/',
          uriParam: 'url',
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
          <sl-menu-item>
            SolidOS Data Browser
          </sl-menu-item>
          <sl-menu-item>
            Penny
          </sl-menu-item>
        </sl-menu>
    `);
  });

  it('copies URI to clipboard when copy entry is clicked', async () => {
    (navigator as any).clipboard = {
      writeText: jest.fn(),
    } as unknown as Clipboard;
    const page = await newSpecPage({
      components: [PosShare],
      html: `<pos-share uri="https://resource.example#it"/>`,
      supportsShadowDom: false,
    });
    const link = jest.fn();
    page.root.addEventListener('pod-os:link', link);
    select(page, 'copy-uri');
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://resource.example#it');
  });

  describe('open with app', () => {
    it('opens the resource in the selected app', async () => {
      const page = await newSpecPage({
        components: [PosShare],
        html: `<pos-share uri="https://resource.example#it"/>`,
        supportsShadowDom: false,
      });
      const selectedApp: OpenWithApp = {
        name: 'Some app',
        appUrl: 'https://app.example/',
        uriParam: 'uri',
      };
      select(page, selectedApp);
      expect(openNewTab).toHaveBeenCalledWith('https://app.example/?uri=https%3A%2F%2Fresource.example%23it');
    });
  });

  function select(page: SpecPage, value: 'copy-uri' | OpenWithApp): void {
    page.root.dispatchEvent(new CustomEvent('sl-select', { detail: { item: { value } } }));
  }
});
