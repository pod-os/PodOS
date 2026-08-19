import { vi } from 'vitest';
import { beforeEach, describe, expect, h, it, render, RenderResult } from '@stencil/vitest';

import { SlAlert } from '@shoelace-style/shoelace';

import { Problem } from '@pod-os/core';

import '../pos-error-toast';

vi.mock('../shoelace', () => ({}));

describe('pos-error-toast', () => {
  it('renders its children', async () => {
    const page = await render(<pos-error-toast>Slot value</pos-error-toast>);
    expect(page.root).toMatchInlineSnapshot(`
      <pos-error-toast class="hydrated">
        <mock:shadow-root>
          <sl-alert variant="danger" duration="10000" closable>
            <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
            <strong></strong>
            <br>
          </sl-alert>
          <slot></slot>
        </mock:shadow-root>
        Slot value
      </pos-error-toast>
    `);
  });

  describe('showing toasts', () => {
    let alertElement: SlAlert;
    let page: RenderResult;
    beforeEach(async () => {
      // Given a page with the error toast component
      page = await render(<pos-error-toast></pos-error-toast>);

      // and the sl-alert has a toast function
      alertElement = page.root.shadowRoot!.querySelector('sl-alert')!;
      alertElement.toast = vi.fn();
    });

    it('shows toast if a plain typescript error is emitted', async () => {
      // when pod-os:error is emitted with a typescript error
      const error = new Error('Test error message');
      const event = new CustomEvent('pod-os:error', {
        detail: error,
        bubbles: true,
      });
      page.root.dispatchEvent(event);
      await page.waitForChanges();

      // then the alert toast is shown
      expect(alertElement.toast).toHaveBeenCalled();
      expect(page.root).toMatchInlineSnapshot(`
        <pos-error-toast class="hydrated">
          <mock:shadow-root>
            <sl-alert variant="danger" duration="10000" closable>
              <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
              <strong>
                Error
              </strong>
              <br>
              Test error message
            </sl-alert>
            <slot></slot>
          </mock:shadow-root>
        </pos-error-toast>
      `);
    });

    it('shows toast if a problem result is emitted', async () => {
      // when pod-os:error is emitted with a problem result
      const problem: Problem = {
        type: 'some-problem',
        title: 'Some Problem',
        detail: 'Problem details',
      };
      const event = new CustomEvent('pod-os:error', {
        detail: problem,
        bubbles: true,
      });
      page.root.dispatchEvent(event);
      await page.waitForChanges();

      // then the alert toast is shown
      expect(alertElement.toast).toHaveBeenCalled();
      expect(page.root).toMatchInlineSnapshot(`
        <pos-error-toast class="hydrated">
          <mock:shadow-root>
            <sl-alert variant="danger" duration="10000" closable>
              <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
              <strong>
                Some Problem
              </strong>
              <br>
              Problem details
            </sl-alert>
            <slot></slot>
          </mock:shadow-root>
        </pos-error-toast>
      `);
    });
  });
});
