import { describe, expect, h, it, render } from '@stencil/vitest';
import './pos-internal-router';

describe('pos-internal-router', () => {
  it('renders the dashboard by default', async () => {
    const page = await render(<pos-internal-router />);

    expect(page.root.innerHTML).toEqualHtml('<pos-app-dashboard></pos-app-dashboard>');
  });

  it('renders local settings', async () => {
    const page = await render(<pos-internal-router uri="pod-os:settings" />);

    expect(page.root.innerHTML).toEqualHtml(`
         <pos-app-settings></pos-app-settings>
    `);
  });
});
