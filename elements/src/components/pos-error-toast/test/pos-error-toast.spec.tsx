import { SlAlert } from '@shoelace-style/shoelace';

jest.mock('../shoelace', () => {});

import { newSpecPage } from '@stencil/core/testing';

import { PosErrorToast } from '../pos-error-toast';
import { Problem } from '@pod-os/core';

describe('pos-error-toast', () => {
  it('renders its children', async () => {
    const page = await newSpecPage({
      components: [PosErrorToast],
      supportsShadowDom: false,
      html: `<pos-error-toast>Slot value</pos-error-toast>`,
    });
    expect(page.root).toEqualHtml(`
      <pos-error-toast>
        <sl-alert closable="" duration="10000" variant="danger">
          <sl-icon name="exclamation-octagon" slot="icon"></sl-icon>
          <strong></strong>
          <br>
        </sl-alert>
        Slot value
      </pos-error-toast>
    `);
  });

  describe('showing toasts', () => {
    let alertElement: SlAlert;
    let page;
    beforeEach(async () => {
      // Given a page with the error toast component
      page = await newSpecPage({
        components: [PosErrorToast],
        supportsShadowDom: false,
        html: `<pos-error-toast></pos-error-toast>`,
      });

      // and the sl-alert has a toast function
      alertElement = page.root.querySelector('sl-alert');
      alertElement.toast = jest.fn();
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
      expect(page.root).toEqualHtml(`
      <pos-error-toast>
        <sl-alert closable="" duration="10000" variant="danger">
          <sl-icon name="exclamation-octagon" slot="icon"></sl-icon>
          <strong>
            Error
          </strong>
          <br>
          Test error message
        </sl-alert>
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
      expect(page.root).toEqualHtml(`
      <pos-error-toast>
        <sl-alert closable="" duration="10000" variant="danger">
          <sl-icon name="exclamation-octagon" slot="icon"></sl-icon>
          <strong>
            Some Problem
          </strong>
          <br>
          Problem details
        </sl-alert>
      </pos-error-toast>
    `);
    });
  });
});
