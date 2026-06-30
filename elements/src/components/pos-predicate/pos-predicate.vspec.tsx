import { describe, expect, h, it, render } from '@stencil/vitest';
import './pos-predicate';
import { withinShadow } from '../../test/withinShadow';
import { userEvent } from '@testing-library/user-event';

describe('pos-predicate', () => {
  it('renders', async () => {
    const page = await render(<pos-predicate uri="https://predicate.test" label="test-label" />);

    expect(page.root).toMatchInlineSnapshot(`
  <pos-predicate class="hydrated">
    <mock:shadow-root>
      <sl-tooltip content="https://predicate.test">
        <button>
          test-label
        </button>
      </sl-tooltip>
    </mock:shadow-root>
  </pos-predicate>
`);
  });

  it('expands to full URI when clicked', async () => {
    const page = await render(<pos-predicate uri="https://predicate.test" label="test-label" />);
    const button = withinShadow(page).getByRole('button');
    await userEvent.click(button);
    expect(page.root).toMatchInlineSnapshot(`
      <pos-predicate class="hydrated">
        <mock:shadow-root>
          <div class="container">
            <a href="https://predicate.test">
              https://predicate.test
            </a>
            <sl-tooltip content="Collapse URI">
              <button aria-label="collapse URI to test-label">
                <sl-icon name="arrow-left-circle"></sl-icon>
              </button>
            </sl-tooltip>
          </div>
        </mock:shadow-root>
      </pos-predicate>
    `);
  });

  it('collapses to short label if collapse button clicked', async () => {
    const page = await render(<pos-predicate uri="https://predicate.test" label="test-label" />);
    page.instance.expanded = true;
    await page.waitForChanges();
    const button = withinShadow(page).getByRole('button');
    await userEvent.click(button);
    expect(page.root).toMatchInlineSnapshot(`
      <pos-predicate class="hydrated">
        <mock:shadow-root>
          <sl-tooltip content="https://predicate.test">
            <button>
              test-label
            </button>
          </sl-tooltip>
        </mock:shadow-root>
      </pos-predicate>
    `);
  });
});
