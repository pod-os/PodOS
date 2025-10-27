/**
 * @jest-environment @happy-dom/jest-environment
 */

import { newSpecPage } from '@stencil/core/testing';
import { PosCreateNewContainerItem } from './pos-create-new-container-item';
import { screen } from '@testing-library/dom';

describe('pos-create-new-container-item (happy-dom)', () => {
  // focus only updates activeElement in happy-dom, not in the stencil mock implementation
  it('focuses the input initially', async () => {
    await newSpecPage({
      components: [PosCreateNewContainerItem],
      html: `<pos-create-new-container-item type="file"/>`,
      supportsShadowDom: false,
    });
    const input = screen.getByRole('textbox', { hidden: true });
    expect(document.activeElement).toEqual(input);
  });
});
