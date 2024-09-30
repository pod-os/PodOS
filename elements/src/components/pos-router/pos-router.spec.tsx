const push = jest.fn();
jest.mock('stencil-router-v2', () => ({
  createRouter: () => ({
    onChange: jest.fn(),
    push,
  }),
  match: jest.fn(),
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

  it('navigates to a pod-os:link url', async () => {
    const page = await newSpecPage({
      components: [PosRouter],
      html: `<pos-router><div>Content</div></pos-router>`,
    });
    fireEvent(page.root, new CustomEvent('pod-os:link', { detail: 'https://new-link.test' }));
    expect(push).toHaveBeenCalledWith('?uri=https%3A%2F%2Fnew-link.test');
  });
});
