import { Mock, vi } from 'vitest';
import { beforeEach, describe, expect, h, it, render, RenderResult } from '@stencil/vitest';
import { parseTemplate } from 'url-template';
import { mockPodOS } from '../../../test/mockPodOS.vitest';
import '../pos-share';

import { when } from 'vitest-when';
import { OpenWithApp, Thing } from '@pod-os/core';

import { openNewTab } from '../openNewTab';
import { fireEvent } from '@testing-library/dom';

vi.mock('../openNewTab');

describe('pos-share', () => {
  let os;
  let thing!: Thing;
  beforeEach(() => {
    vi.resetAllMocks();
    os = mockPodOS();
    const thing = { fake: 'Thing' } as unknown as Thing;
    when(os.store.get).calledWith('https://resource.example#it').thenReturn(thing);
    (os.proposeAppsFor as Mock).mockReturnValue([]);
  });

  it('renders share button with menu to copy uri', async () => {
    const page = await render(<pos-share uri="https://resource.example#it" />);

    expect(page.root.shadowRoot).toEqualHtml(`
      <sl-dropdown>
        <button slot="trigger" aria-label="Share" part="button">
          <sl-icon name="share"></sl-icon>
        </button>
        <sl-menu>
          <sl-menu-item value="copy-uri">
            <sl-icon slot="prefix" name="copy"></sl-icon>
            Copy URI
          </sl-menu-item>
        </sl-menu>
      </sl-dropdown>
    `);
  });

  describe('proposed apps', () => {
    it('renders a proposed app', async () => {
      const os = mockPodOS();
      when(os.proposeAppsFor)
        .calledWith(thing)
        .thenReturn([
          {
            name: 'SolidOS Data Browser',
            urlTemplate: parseTemplate('https://solidos.github.io/mashlib/dist/browse.html?{uri}'),
          },
        ]);

      const page = await render(<pos-share uri="https://resource.example#it" />);

      expect(page.root.shadowRoot!.querySelector('sl-menu')).toEqualHtml(`
        <sl-menu>
          <sl-menu-item value="copy-uri">
            <sl-icon slot="prefix" name="copy"></sl-icon>
            Copy URI
          </sl-menu-item>
          <sl-divider></sl-divider>
          <sl-menu-item disabled>
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
        .thenReturn([
          {
            name: 'SolidOS Data Browser',
            urlTemplate: parseTemplate('https://irrelevant.example'),
          },
          {
            name: 'Penny',
            urlTemplate: parseTemplate('https://irrelevant-for.test'),
          },
        ]);

      const page = await render(<pos-share uri="https://resource.example#it" />);

      expect(page.root.shadowRoot!.querySelector('sl-menu')).toEqualHtml(`
        <sl-menu>
          <sl-menu-item value="copy-uri">
            <sl-icon slot="prefix" name="copy"></sl-icon>
            Copy URI
          </sl-menu-item>
          <sl-divider></sl-divider>
          <sl-menu-item disabled>
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
      when(os.store.get).calledWith('https://new.example').thenReturn(newThing);

      when(os.proposeAppsFor)
        .calledWith(newThing)
        .thenReturn([
          {
            name: 'New app',
            urlTemplate: parseTemplate('https://irrelevant.example'),
          },
        ]);

      const page = await render(<pos-share uri="https://resource.example#it" />);

      page.instance.uri = 'https://new.example';
      await page.waitForChanges();

      expect(page.root.shadowRoot!.querySelector('sl-menu')).toEqualHtml(`
        <sl-menu>
          <sl-menu-item value="copy-uri">
            <sl-icon slot="prefix" name="copy"></sl-icon>
            Copy URI
          </sl-menu-item>
          <sl-divider></sl-divider>
          <sl-menu-item disabled>
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
      when(os.store.get).calledWith('https://resource.example#it').thenReturn(something);

      // and when first asked for apps to propose there are none
      when(os.proposeAppsFor, { times: 1 }).calledWith(something).thenReturn([]);

      // and a page with a pos-share for the resource
      const page = await render(<pos-share uri="https://resource.example#it" />);

      // and at first no apps are show, because non have been proposed yet
      expect(page.root.shadowRoot!.querySelector('sl-menu')).toEqualHtml(`
        <sl-menu>
          <sl-menu-item value="copy-uri">
            <sl-icon slot="prefix" name="copy"></sl-icon>
            Copy URI
          </sl-menu-item>
        </sl-menu>
    `);

      // and when again asked to propose apps, there is one app
      when(os.proposeAppsFor, { times: 1 })
        .calledWith(something)
        .thenReturn([
          {
            name: 'Some app',
            urlTemplate: parseTemplate('https://irrelevant.example'),
          },
        ]);

      // when the resource-loaded event occurs on the page for the resource in question
      fireEvent(document, new CustomEvent('pod-os:resource-loaded', { detail: 'https://resource.example#it' }));
      await page.waitForChanges();

      // then the newly proposed apps are available
      expect(page.root.shadowRoot!.querySelector('sl-menu')).toEqualHtml(`
        <sl-menu>
          <sl-menu-item value="copy-uri">
            <sl-icon slot="prefix" name="copy"></sl-icon>
            Copy URI
          </sl-menu-item>
          <sl-divider></sl-divider>
          <sl-menu-item disabled>
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
      when(os.store.get).calledWith('https://resource.example#it').thenReturn(something);

      // and when first asked for apps to propose there are none
      when(os.proposeAppsFor, { times: 1 }).calledWith(something).thenReturn([]);

      // and a page with a pos-share for the resource
      const page = await render(<pos-share uri="https://resource.example#it" />);

      // and at first no apps are show, because non have been proposed yet
      expect(page.root.shadowRoot!.querySelector('sl-menu')).toEqualHtml(`
        <sl-menu>
          <sl-menu-item value="copy-uri">
            <sl-icon slot="prefix" name="copy"></sl-icon>
            Copy URI
          </sl-menu-item>
        </sl-menu>
    `);

      // and when again asked to propose apps, there is one app
      when(os.proposeAppsFor, { times: 1 })
        .calledWith(something)
        .thenReturn([
          {
            name: 'Some app',
            urlTemplate: parseTemplate('https://irrelevant.example'),
          },
        ]);

      // when the resource-loaded event occurs on the page for a different resource
      fireEvent(
        document,
        new CustomEvent('pod-os:resource-loaded', { detail: 'https://different-resource.example#it' }),
      );
      await page.waitForChanges();

      // then nothing is updated
      expect(page.root.shadowRoot!.querySelector('sl-menu')).toEqualHtml(`
        <sl-menu>
          <sl-menu-item value="copy-uri">
            <sl-icon slot="prefix" name="copy"></sl-icon>
            Copy URI
          </sl-menu-item>
        </sl-menu>
    `);
    });
  });

  it('copies URI to clipboard when copy entry is clicked', async () => {
    vi.spyOn(navigator.clipboard, 'writeText');
    const page = await render(<pos-share uri="https://resource.example#it" />);
    const link = vi.fn();
    page.root.addEventListener('pod-os:link', link);
    select(page, 'copy-uri');
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://resource.example#it');
  });

  describe('open with app', () => {
    it('opens the resource in the selected app', async () => {
      const page = await render(<pos-share uri="https://resource.example#it" />);
      const selectedApp: OpenWithApp = {
        name: 'Some app',
        urlTemplate: parseTemplate('https://app.example/{?uri}'),
      };
      select(page, selectedApp);
      expect(openNewTab).toHaveBeenCalledWith('https://app.example/?uri=https%3A%2F%2Fresource.example%23it');
    });
  });

  function select(page: RenderResult, value: 'copy-uri' | OpenWithApp): void {
    page.root.dispatchEvent(new CustomEvent('sl-select', { detail: { item: { value } } }));
  }
});
