import { newSpecPage } from '@stencil/core/testing';
import { when } from 'jest-when';

import session from '../../store/session';
import { mockPodOS } from '../../test/mockPodOS';
import { mockSessionStore } from '../../test/mockSessionStore';
import { PosResource } from './pos-resource';

describe('pos-resource', () => {
  it('renders loading indicator initially', async () => {
    const page = await newSpecPage({
      components: [PosResource],
      html: `<pos-resource uri="https://resource.test/" />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-resource uri="https://resource.test/">
        <mock:shadow-root>
          <ion-progress-bar type="indeterminate"></ion-progress-bar>
        </mock:shadow-root>
      </pos-resource>
  `);
  });

  it('renders loading indicator while fetching', async () => {
    const page = await newSpecPage({
      components: [PosResource],
      html: `<pos-resource uri="https://resource.test/" />`,
    });
    const os = mockPodOS();
    when(os.fetch)
      .calledWith('https://resource.test/')
      .mockReturnValue(new Promise(() => null));
    await page.rootInstance.receivePodOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-resource uri="https://resource.test/">
        <mock:shadow-root>
          <ion-progress-bar type="indeterminate"></ion-progress-bar>
        </mock:shadow-root>
      </pos-resource>
  `);
  });

  it('renders slot after loading', async () => {
    const page = await newSpecPage({
      components: [PosResource],
      html: `<pos-resource uri="https://resource.test/" />`,
    });
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test/').mockResolvedValue(null);
    await page.rootInstance.receivePodOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-resource uri="https://resource.test/">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pos-resource>
  `);
  });

  it('emits event after loading resource', async () => {
    const onResourceLoaded = jest.fn();
    const page = await newSpecPage({
      components: [PosResource],
      html: `<pos-resource uri="https://resource.test/" />`,
    });
    page.root.addEventListener('pod-os:resource-loaded', onResourceLoaded);
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test/').mockResolvedValue(null);
    await page.rootInstance.receivePodOs(os);
    await page.waitForChanges();
    expect(onResourceLoaded).toHaveBeenCalled();
    expect(onResourceLoaded.mock.calls[0][0].detail).toEqual('https://resource.test/');
  });

  it('renders error when fetch failed', async () => {
    const page = await newSpecPage({
      components: [PosResource],
      html: `<pos-resource uri="https://resource.test/" />`,
    });
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test/').mockRejectedValue(new Error('not found'));
    await page.rootInstance.receivePodOs(os);
    await page.waitForChanges();
    const errorDetails = page.root.shadowRoot.querySelector('details');
    expect(errorDetails).toEqualHtml(`
    <details class="error">
        <summary title="Click to expand">
          ⚠ Sorry, something went wrong
        </summary>
        <p>
          Status:
        </p>
        <p>
          not found
        </p>
        <p>
          You can try to open the link outside PodOS:
          <a href="https://resource.test/">
            https://resource.test/
          </a>
        </p>
      </details>
    `);
  });

  it('updates and loads resource when uri changes', async () => {
    const page = await newSpecPage({
      components: [PosResource],
      html: `<pos-resource uri="https://resource.test/" />`,
    });
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test/').mockResolvedValue(null);
    when(os.fetch)
      .calledWith('https://other-resource.test')
      .mockReturnValue(new Promise(() => null));
    await page.rootInstance.receivePodOs(os);
    page.root.setAttribute('uri', 'https://other-resource.test');
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-resource uri="https://other-resource.test">
        <mock:shadow-root>
          <ion-progress-bar type="indeterminate"></ion-progress-bar>
        </mock:shadow-root>
      </pos-resource>
  `);
  });

  it('re-fetches resource when session state changes', async () => {
    const session = mockSessionStore();
    const page = await newSpecPage({
      components: [PosResource],
      html: `<pos-resource uri="https://resource.test/" />`,
    });
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test/').mockResolvedValueOnce(null);
    when(os.fetch)
      .calledWith('https://resource.test/')
      .mockReturnValueOnce(new Promise(() => null));
    await page.rootInstance.receivePodOs(os);
    expect(session.sessionChanged).toBeDefined();
    session.sessionChanged();
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-resource uri="https://resource.test/">
        <mock:shadow-root>
          <ion-progress-bar type="indeterminate"></ion-progress-bar>
        </mock:shadow-root>
      </pos-resource>
  `);
  });

  it('removes error message after successful loading', async () => {
    const session = mockSessionStore();
    const page = await newSpecPage({
      components: [PosResource],
      html: `<pos-resource uri="https://resource.test/" />`,
    });
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test/').mockRejectedValueOnce(new Error('unauthorized'));
    when(os.fetch).calledWith('https://resource.test/').mockResolvedValueOnce(null);
    await page.rootInstance.receivePodOs(os);
    expect(session.sessionChanged).toBeDefined();
    session.sessionChanged();
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-resource uri="https://resource.test/">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pos-resource>
  `);
  });

  describe('when lazy', () => {
    let page;
    beforeEach(async () => {
      page = await newSpecPage({
        components: [PosResource],
        html: `<pos-resource lazy uri="https://resource.test/" />`,
      });
    });

    it('renders loading indicator before PodOS is ready', async () => {
      expect(page.root).toEqualHtml(`
      <pos-resource lazy uri="https://resource.test/">
        <mock:shadow-root>
          <ion-progress-bar type="indeterminate"></ion-progress-bar>
        </mock:shadow-root>
      </pos-resource>
  `);
    });
    it('renders slot without fetching first', async () => {
      const os = mockPodOS();
      os.fetch.mockRejectedValue(new Error('should not fetch'));
      await page.rootInstance.receivePodOs(os);
      await page.waitForChanges();
      expect(page.root).toEqualHtml(`
      <pos-resource lazy uri="https://resource.test/">
        <mock:shadow-root>
          <slot />
        </mock:shadow-root>
      </pos-resource>
  `);
    });

    describe('after fetch is explicitly requested', function () {
      it('renders loading indicator while fetching', async () => {
        const os = mockPodOS();
        when(os.fetch)
          .calledWith('https://resource.test/')
          .mockReturnValue(new Promise(() => null));
        await page.rootInstance.receivePodOs(os);
        page.root.fetch();
        await page.waitForChanges();
        expect(page.root).toEqualHtml(`
      <pos-resource lazy uri="https://resource.test/">
        <mock:shadow-root>
          <ion-progress-bar type="indeterminate"></ion-progress-bar>
        </mock:shadow-root>
      </pos-resource>
  `);
      });

      it('renders slot after loading', async () => {
        const os = mockPodOS();
        when(os.fetch).calledWith('https://resource.test/').mockResolvedValue(null);
        await page.rootInstance.receivePodOs(os);
        await page.root.fetch();
        await page.waitForChanges();
        expect(page.root).toEqualHtml(`
      <pos-resource lazy uri="https://resource.test/">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pos-resource>
  `);
      });

      it('renders error when fetch failed', async () => {
        const os = mockPodOS();
        when(os.fetch).calledWith('https://resource.test/').mockRejectedValue(new Error('not found'));
        await page.rootInstance.receivePodOs(os);
        page.root.fetch();
        await page.waitForChanges();
        const errorDetails = page.root.shadowRoot.querySelector('details');
        expect(errorDetails).toEqualHtml(`
        <details class="error">
          <summary title="Click to expand">
            ⚠ Sorry, something went wrong
          </summary>
          <p>
            Status:
          </p>
          <p>
            not found
          </p>
          <p>
            You can try to open the link outside PodOS:
            <a href="https://resource.test/">
              https://resource.test/
            </a>
          </p>
        </details>
`);
      });
    });
  });
});
