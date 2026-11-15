import { describe, expect, h, it, render } from '@stencil/vitest';
import { SaveStatusIndicator as SaveStatus } from './SaveStatus';

describe('SaveStatus', () => {
  it('shows that all changes have been saved', async () => {
    const page = await renderComponent('idle');

    expect(page.root).toEqualHtml(`
      <span class="status success" role="status" aria-live="polite" aria-labelledby="status-message">
        <sl-icon name="check2-circle" aria-hidden="true"></sl-icon>
        <span id="status-message">
          all saved
        </span>
      </span>
    `);
  });

  it('shows that saving the changes failed', async () => {
    const page = await renderComponent('failed');

    expect(page.root).toEqualHtml(`
      <span class="status error" role="status" aria-live="polite" aria-labelledby="status-message">
        <sl-icon name="x-octagon" aria-hidden="true"></sl-icon>
        <span id="status-message">
          saving failed
        </span>
      </span>
    `);
  });

  it('shows that a save is in progress', async () => {
    const page = await renderComponent('saving');

    expect(page.root).toEqualHtml(`
      <span class="status saving" role="status" aria-live="polite" aria-labelledby="status-message">
        <sl-icon name="cloud-upload" aria-hidden="true"></sl-icon>
        <span id="status-message">
          saving changes
        </span>
      </span>
    `);
  });

  it('shows pending changes', async () => {
    const page = await renderComponent('pending');

    expect(page.root).toEqualHtml(`
      <span class="status pending" role="status" aria-live="polite" aria-labelledby="status-message">
        <sl-icon name="clock-history" aria-hidden="true"></sl-icon>
        <span id="status-message">
          pending changes
        </span>
      </span>
    `);
  });
});

async function renderComponent(saveStatus: 'idle' | 'pending' | 'saving' | 'failed') {
  return await render(<SaveStatus saveStatus={saveStatus} />, {
    waitForReady: false, // do not wait for hydration, because sl-icon will never hydrate
  });
}
