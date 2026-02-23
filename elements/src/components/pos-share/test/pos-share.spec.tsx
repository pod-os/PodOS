import { parseTemplate } from 'url-template';

jest.mock('../openNewTab');

import { mockPodOS } from '../../../test/mockPodOS';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { PosShare } from '../pos-share';

import { when } from 'jest-when';
import { OpenWithApp, Thing } from '@pod-os/core';

import { openNewTab } from '../openNewTab';
import { fireEvent } from '@testing-library/dom';

describe('pos-share', () => {
  let os;
  let thing;
  beforeEach(() => {
    jest.resetAllMocks();
    os = mockPodOS();
    global.open = jest.fn();
    const thing = { fake: 'Thing' } as unknown as Thing;
    when(os.store.get).calledWith('https://resource.example#it').mockReturnValue(thing);
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

  describe('proposed apps', () => {
    it('renders a proposed app', async () => {
      const os = mockPodOS();
      when(os.proposeAppsFor)
        .calledWith(thing)
        .mockReturnValue([
          {
            name: 'SolidOS Data Browser',
            urlTemplate: parseTemplate('https://solidos.github.io/mashlib/dist/browse.html?{uri}'),
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
            urlTemplate: parseTemplate('https://irrelevant.example'),
          },
          {
            name: 'Penny',
            urlTemplate: parseTemplate('https://irrelevant-for.test'),
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

    it('updates the proposed apps when uri changes', async () => {
      const os = mockPodOS();

      const newThing = { new: 'Thing' } as unknown as Thing;
      when(os.store.get).calledWith('https://new.example').mockReturnValue(newThing);

      when(os.proposeAppsFor)
        .calledWith(newThing)
        .mockReturnValue([
          {
            name: 'New app',
            urlTemplate: parseTemplate('https://irrelevant.example'),
          },
        ]);

      const page = await newSpecPage({
        components: [PosShare],
        html: `<pos-share uri="https://resource.example#it"/>`,
        supportsShadowDom: false,
      });

      page.rootInstance.uri = 'https://new.example';
      await page.waitForChanges();

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
            New app
          </sl-menu-item>
        </sl-menu>
    `);
    });

    it('updates the proposed apps after resources has been loaded', async () => {
      const os = mockPodOS();

      // given a thing
      const something = { new: 'Thing' } as unknown as Thing;
      when(os.store.get).calledWith('https://resource.example#it').mockReturnValue(something);

      // and when first asked for apps to propose there are none
      when(os.proposeAppsFor)
        .calledWith(something)
        .mockReturnValueOnce([])
        // but when called again later there is one
        .mockReturnValueOnce([
          {
            name: 'Some app',
            urlTemplate: parseTemplate('https://irrelevant.example'),
          },
        ]);

      // and a page with a pos-share for the resource
      const page = await newSpecPage({
        components: [PosShare],
        html: `<pos-share uri="https://resource.example#it"/>`,
        supportsShadowDom: false,
      });

      // and at first no apps are show, because non have been proposed yet
      expect(page.root.querySelector('sl-menu')).toEqualHtml(`
        <sl-menu>
          <sl-menu-item value="copy-uri">
            <sl-icon name="copy" slot="prefix"></sl-icon>
            Copy URI
          </sl-menu-item>
        </sl-menu>
    `);

      // when the resource-loaded event occurs on the page for the resource in question
      fireEvent(page.doc, new CustomEvent('pod-os:resource-loaded', { detail: 'https://resource.example#it' }));
      await page.waitForChanges();

      // then the newly proposed apps are available
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
            Some app
          </sl-menu-item>
        </sl-menu>
    `);
    });

    it('does not update the proposed apps after irrelevant resource has been loaded', async () => {
      const os = mockPodOS();

      // given a thing
      const something = { new: 'Thing' } as unknown as Thing;
      when(os.store.get).calledWith('https://resource.example#it').mockReturnValue(something);

      // and when first asked for apps to propose there are none
      when(os.proposeAppsFor)
        .calledWith(something)
        .mockReturnValueOnce([])
        // but when called again later there is one
        .mockReturnValueOnce([
          {
            name: 'Some app',
            urlTemplate: parseTemplate('https://irrelevant.example'),
          },
        ]);

      // and a page with a pos-share for the resource
      const page = await newSpecPage({
        components: [PosShare],
        html: `<pos-share uri="https://resource.example#it"/>`,
        supportsShadowDom: false,
      });

      // and at first no apps are show, because non have been proposed yet
      expect(page.root.querySelector('sl-menu')).toEqualHtml(`
        <sl-menu>
          <sl-menu-item value="copy-uri">
            <sl-icon name="copy" slot="prefix"></sl-icon>
            Copy URI
          </sl-menu-item>
        </sl-menu>
    `);

      // when the resource-loaded event occurs on the page for a different resource
      fireEvent(
        page.doc,
        new CustomEvent('pod-os:resource-loaded', { detail: 'https://different-resource.example#it' }),
      );
      await page.waitForChanges();

      // then nothing is updated
      expect(page.root.querySelector('sl-menu')).toEqualHtml(`
        <sl-menu>
          <sl-menu-item value="copy-uri">
            <sl-icon name="copy" slot="prefix"></sl-icon>
            Copy URI
          </sl-menu-item>
        </sl-menu>
    `);
    });
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
        urlTemplate: parseTemplate('https://app.example/{?uri}'),
      };
      select(page, selectedApp);
      expect(openNewTab).toHaveBeenCalledWith('https://app.example/?uri=https%3A%2F%2Fresource.example%23it');
    });
  });

  function select(page: SpecPage, value: 'copy-uri' | OpenWithApp): void {
    page.root.dispatchEvent(new CustomEvent('sl-select', { detail: { item: { value } } }));
  }
});
