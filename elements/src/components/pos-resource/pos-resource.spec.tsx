jest.mock('../../store/session');

import { newSpecPage } from '@stencil/core/testing';
import { mockPodOS } from '../../test/mockPodOS';
import { PosResource } from './pos-resource';
import { when } from 'jest-when';

import session from '../../store/session';

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
    await page.rootInstance.setOs(os);
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
    when(os.fetch).calledWith('https://resource.test/').mockResolvedValue();
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-resource uri="https://resource.test/">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pos-resource>
  `);
  });

  it('renders error when fetch failed', async () => {
    const page = await newSpecPage({
      components: [PosResource],
      html: `<pos-resource uri="https://resource.test/" />`,
    });
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test/').mockRejectedValue(new Error('not found'));
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-resource uri="https://resource.test/">
        <mock:shadow-root>
          <div>not found</div>
        </mock:shadow-root>
      </pos-resource>
  `);
  });

  it('updates and loads resource when uri changes', async () => {
    const page = await newSpecPage({
      components: [PosResource],
      html: `<pos-resource uri="https://resource.test/" />`,
    });
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test/').mockResolvedValue();
    when(os.fetch)
      .calledWith('https://other-resource.test')
      .mockReturnValue(new Promise(() => null));
    await page.rootInstance.setOs(os);
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
    let sessionChanged;
    // @ts-ignore
    session.onChange = (prop, callback) => {
      if (prop === 'isLoggedIn') {
        sessionChanged = callback;
      }
    };
    const page = await newSpecPage({
      components: [PosResource],
      html: `<pos-resource uri="https://resource.test/" />`,
    });
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test/').mockResolvedValueOnce();
    when(os.fetch)
      .calledWith('https://resource.test/')
      .mockReturnValueOnce(new Promise(() => null));
    await page.rootInstance.setOs(os);
    expect(sessionChanged).toBeDefined();
    sessionChanged();
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-resource uri="https://resource.test/">
        <mock:shadow-root>
          <ion-progress-bar type="indeterminate"></ion-progress-bar>
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
      await page.rootInstance.setOs(os);
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
        await page.rootInstance.setOs(os);
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
        when(os.fetch).calledWith('https://resource.test/').mockResolvedValue();
        await page.rootInstance.setOs(os);
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
        await page.rootInstance.setOs(os);
        page.root.fetch();
        await page.waitForChanges();
        expect(page.root).toEqualHtml(`
      <pos-resource lazy uri="https://resource.test/">
        <mock:shadow-root>
          <div>not found</div>
        </mock:shadow-root>
      </pos-resource>
  `);
      });
    });
  });
});
