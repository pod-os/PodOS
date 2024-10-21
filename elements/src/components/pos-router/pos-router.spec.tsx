const push = jest.fn();
jest.mock('stencil-router-v2', () => ({
  createRouter: () => ({
    onChange: jest.fn(),
    push,
  }),
}));
import { fireEvent } from '@testing-library/dom';

import { newSpecPage } from '@stencil/core/testing';

import { PosRouter } from './pos-router';

describe('pos-router', () => {
  beforeEach(() => {
    push.mockReset();
  });

  it('renders the child content', async () => {
    const page = await newSpecPage({
      components: [PosRouter],
      html: `<pos-router><div>Content</div></pos-router>`,
    });
    expect(page.root).toEqualHtml(`
      <pos-router>
        <div>
          Content
        </div>
      </pos-router>
  `);
  });

  it('changes route to current URI in pod mode, if no explicit URI is given', async () => {
    const onRouteChange = jest.fn();
    const page = await newSpecPage({
      components: [PosRouter],
      html: `<pos-router mode="pod"></pos-router>`,
    });

    page.root.addEventListener('pod-os:route-changed', onRouteChange);
    page.rootInstance.updateUri();

    expect(onRouteChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: 'http://testing.stenciljs.com/',
      }),
    );
  });

  it('changes route to pod-os:dashboard in standalone mode, if no explicit URI is given', async () => {
    const onRouteChange = jest.fn();
    const page = await newSpecPage({
      components: [PosRouter],
      html: `<pos-router mode="standalone"></pos-router>`,
    });

    page.root.addEventListener('pod-os:route-changed', onRouteChange);
    page.rootInstance.updateUri();

    expect(onRouteChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: 'pod-os:dashboard',
      }),
    );
  });

  it('navigates to a pod-os:link url', async () => {
    const page = await newSpecPage({
      components: [PosRouter],
      html: `<pos-router><div>Content</div></pos-router>`,
    });
    fireEvent(page.root, new CustomEvent('pod-os:link', { detail: 'https://new-link.test' }));
    expect(push).toHaveBeenCalledWith('?uri=https%3A%2F%2Fnew-link.test');
  });

  it('restores URL from session restore', async () => {
    await newSpecPage({
      components: [PosRouter],
      html: `<pos-router><div>Content</div></pos-router>`,
    });
    fireEvent(
      window,
      new CustomEvent('pod-os:session-restored', { detail: { url: 'https://app.test?uri=https%3A%2F%2Flink.test' } }),
    );
    expect(push).toHaveBeenCalledWith('https://app.test?uri=https%3A%2F%2Flink.test');
  });
});
