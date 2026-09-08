import { describe, expect, h, it, render } from '@stencil/vitest';
import { StatusIcon } from './StatusIcon';

describe('StatusIcon', () => {
  it('renders touched state with icon', async () => {
    const page = await render(
      <StatusIcon
        state={{ fieldId: '1', status: 'touched', message: 'Touched' }}
        field={{ fieldId: '1', value: 'irrelevant' }}
      />,
      { waitForReady: false },
    );
    expect(page.root).toMatchInlineSnapshot(`
      <sl-tooltip content="Touched">
        <span id="1-status" role="status" aria-live="polite" class="field-status touched">
          <span class="visually-hidden">
            Touched
          </span>
          <sl-icon name="pencil" aria-hidden="true"></sl-icon>
        </span>
      </sl-tooltip>
    `);
  });

  it('renders pending state with icon', async () => {
    const page = await render(
      <StatusIcon
        state={{ fieldId: '1', status: 'pending', message: 'Pending' }}
        field={{ fieldId: '1', value: 'irrelevant' }}
      />,
      { waitForReady: false },
    );
    expect(page.root).toMatchInlineSnapshot(`
      <sl-tooltip content="Pending">
        <span id="1-status" role="status" aria-live="polite" class="field-status pending">
          <span class="visually-hidden">
            Pending
          </span>
          <sl-icon name="hourglass-split" aria-hidden="true"></sl-icon>
        </span>
      </sl-tooltip>
    `);
  });

  it('renders error state with icon', async () => {
    const page = await render(
      <StatusIcon
        state={{ fieldId: '1', status: 'error', message: 'Error' }}
        field={{ fieldId: '1', value: 'irrelevant' }}
      />,
      { waitForReady: false },
    );
    expect(page.root).toMatchInlineSnapshot(`
      <sl-tooltip content="Error">
        <span id="1-status" role="status" aria-live="polite" class="field-status error">
          <span class="visually-hidden">
            Error
          </span>
          <sl-icon name="exclamation-triangle" aria-hidden="true"></sl-icon>
        </span>
      </sl-tooltip>
    `);
  });

  it('renders success state with icon', async () => {
    const page = await render(
      <StatusIcon
        state={{ fieldId: '1', status: 'success', message: 'Success' }}
        field={{ fieldId: '1', value: 'irrelevant' }}
      />,
      { waitForReady: false },
    );
    expect(page.root).toMatchInlineSnapshot(`
      <sl-tooltip content="Success">
        <span id="1-status" role="status" aria-live="polite" class="field-status success">
          <span class="visually-hidden">
            Success
          </span>
          <sl-icon name="check2-circle" aria-hidden="true"></sl-icon>
        </span>
      </sl-tooltip>
    `);
  });
});
