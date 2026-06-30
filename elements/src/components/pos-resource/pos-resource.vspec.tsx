import { vi } from 'vitest';
import { afterEach, beforeEach, describe, expect, h, it, render, RenderResult } from '@stencil/vitest';
import { when } from 'vitest-when';
import { mockPodOS } from '../../test/mockPodOS.vitest';

import session from '../../store/session';

import './pos-resource';

describe('pos-resource', () => {
  afterEach(() => {
    session.dispose();
  });

  it('renders loading indicator initially', async () => {
    const page = await render(<pos-resource uri="https://resource.test/"></pos-resource>);
    expect(page.root.shadowRoot).toEqualHtml(`
      <sl-progress-bar indeterminate></sl-progress-bar>
  `);
  });

  it('renders loading indicator while fetching', async () => {
    const page = await render(<pos-resource uri="https://resource.test/"></pos-resource>);
    const os = mockPodOS();
    when(os.fetch)
      .calledWith('https://resource.test/')
      .thenReturn(new Promise(() => null));
    await page.instance.receivePodOs(os);
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml(`
      <sl-progress-bar indeterminate></sl-progress-bar>
  `);
  });

  it('renders slot after loading', async () => {
    const page = await render(<pos-resource uri="https://resource.test/"></pos-resource>);
    const os = mockPodOS();
    when(os.fetch)
      .calledWith('https://resource.test/')
      .thenResolve({} as Response);
    await page.instance.receivePodOs(os);
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml(`
        <slot></slot>
  `);
  });

  it('emits event after loading resource', async () => {
    const onResourceLoaded = vi.fn();
    const page = await render(<pos-resource uri="https://resource.test/"></pos-resource>);
    page.root.addEventListener('pod-os:resource-loaded', onResourceLoaded);
    const os = mockPodOS();
    when(os.fetch)
      .calledWith('https://resource.test/')
      .thenResolve({} as Response);
    await page.instance.receivePodOs(os);
    await page.waitForChanges();
    expect(onResourceLoaded).toHaveBeenCalled();
    expect(onResourceLoaded.mock.calls[0][0].detail).toEqual('https://resource.test/');
  });

  it('renders error when fetch failed', async () => {
    const page = await render(<pos-resource uri="https://resource.test/"></pos-resource>);
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test/').thenReject(new Error('not found'));
    await page.instance.receivePodOs(os);
    await page.waitForChanges();
    const errorDetails = page.root.shadowRoot!.querySelector('details')!;
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
    const page = await render(<pos-resource uri="https://resource.test/"></pos-resource>);
    const os = mockPodOS();
    when(os.fetch)
      .calledWith('https://resource.test/')
      .thenResolve({} as Response);
    when(os.fetch)
      .calledWith('https://other-resource.test')
      .thenReturn(new Promise(() => null));
    await page.instance.receivePodOs(os);
    page.root.setAttribute('uri', 'https://other-resource.test');
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml(`
      <sl-progress-bar indeterminate></sl-progress-bar>
  `);
  });

  it('re-fetches resource when session state changes', async () => {
    const page = await render(<pos-resource uri="https://resource.test/"></pos-resource>);
    const os = mockPodOS();
    when(os.fetch, { times: 1 })
      .calledWith('https://resource.test/')
      .thenResolve({} as Response);
    await page.instance.receivePodOs(os);
    when(os.fetch, { times: 1 })
      .calledWith('https://resource.test/')
      .thenReturn(new Promise(() => null));
    session.state.isLoggedIn = true;
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml(`
        <sl-progress-bar indeterminate></sl-progress-bar>
  `);
  });

  it('removes error message after successful loading', async () => {
    const page = await render(<pos-resource uri="https://resource.test/"></pos-resource>);
    const os = mockPodOS();
    when(os.fetch, { times: 1 }).calledWith('https://resource.test/').thenReject(new Error('unauthorized'));
    await page.instance.receivePodOs(os);
    when(os.fetch, { times: 1 })
      .calledWith('https://resource.test/')
      .thenResolve({} as Response);
    session.state.isLoggedIn = true;
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml(`
          <slot></slot>
  `);
  });

  describe('when lazy', () => {
    let page: RenderResult<HTMLPosResourceElement>;
    beforeEach(async () => {
      page = await render(<pos-resource lazy uri="https://resource.test/"></pos-resource>);
    });

    it('renders loading indicator before PodOS is ready', async () => {
      expect(page.root.shadowRoot).toEqualHtml(`
          <sl-progress-bar indeterminate></sl-progress-bar>
      `);
    });

    it('renders slot without fetching first', async () => {
      const os = mockPodOS();
      await page.instance.receivePodOs(os);
      await page.waitForChanges();
      expect(page.root.shadowRoot).toEqualHtml(`
        <slot></slot>
      `);
      expect(os.fetch).not.toHaveBeenCalled();
    });

    describe('after fetch is explicitly requested', function () {
      it('renders loading indicator while fetching', async () => {
        const os = mockPodOS();
        when(os.fetch)
          .calledWith('https://resource.test/')
          .thenReturn(new Promise(() => null));
        await page.instance.receivePodOs(os);
        page.root.fetch();
        await page.waitForChanges();
        expect(page.root.shadowRoot).toEqualHtml(`
          <sl-progress-bar indeterminate></sl-progress-bar>
        `);
      });

      it('renders slot after loading', async () => {
        const os = mockPodOS();
        when(os.fetch)
          .calledWith('https://resource.test/')
          .thenResolve({} as Response);
        await page.instance.receivePodOs(os);
        await page.root.fetch();
        await page.waitForChanges();
        expect(page.root.shadowRoot).toEqualHtml(`
          <slot></slot>
        `);
      });

      it('renders error when fetch failed', async () => {
        const os = mockPodOS();
        when(os.fetch).calledWith('https://resource.test/').thenReject(new Error('not found'));
        await page.instance.receivePodOs(os);
        page.root.fetch();
        await page.waitForChanges();
        const errorDetails = page.root.shadowRoot!.querySelector('details')!;
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
