const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('stencil-router-v2', () => ({
  createRouter: () => ({
    onChange: vi.fn(),
    push,
  }),
}));
import { vi } from 'vitest';
import { beforeEach, describe, expect, it, render, h } from '@stencil/vitest';
import { fireEvent } from '@testing-library/dom';

import './pos-router';

describe('pos-router', () => {
  beforeEach(() => {
    push.mockReset();
  });

  it('renders the child content', async () => {
    const page = await render(
      <pos-router>
        <div>Content</div>
      </pos-router>,
    );
    expect(page.root).toEqualHtml(`
      <pos-router class="hydrated">
        <div>
          Content
        </div>
      </pos-router>
    `);
  });

  it('changes route to current URI in pod mode, if no explicit URI is given', async () => {
    const onRouteChange = vi.fn();
    const page = await render(<pos-router mode="pod"></pos-router>);

    page.root.addEventListener('pod-os:route-changed', onRouteChange);
    page.instance.updateUri();

    expect(onRouteChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: window.location.href,
      }),
    );
  });

  it('changes route to pod-os:dashboard in standalone mode, if no explicit URI is given', async () => {
    const onRouteChange = vi.fn();
    const page = await render(<pos-router mode="standalone"></pos-router>);

    page.root.addEventListener('pod-os:route-changed', onRouteChange);
    page.instance.updateUri();

    expect(onRouteChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: 'pod-os:dashboard',
      }),
    );
  });

  it('navigates to a pod-os:link url', async () => {
    const page = await render(
      <pos-router>
        <div>Content</div>
      </pos-router>,
    );
    fireEvent(page.root, new CustomEvent('pod-os:link', { detail: 'https://new-link.test' }));
    expect(push).toHaveBeenCalledWith('?uri=https%3A%2F%2Fnew-link.test');
  });

  it('restores URL from session restore', async () => {
    await render(
      <pos-router>
        <div>Content</div>
      </pos-router>,
    );
    fireEvent(
      window,
      new CustomEvent('pod-os:session-restored', { detail: { url: 'https://app.test?uri=https%3A%2F%2Flink.test' } }),
    );
    expect(push).toHaveBeenCalledWith('https://app.test?uri=https%3A%2F%2Flink.test');
  });
});
