import { newSpecPage } from '@stencil/core/testing';
import { PosPredicate } from './pos-predicate';
import { getByRole } from '@testing-library/dom';

describe('pos-predicate', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PosPredicate],
      supportsShadowDom: false,
      html: `<pos-predicate uri="https://predicate.test" label="test-label" />`,
    });

    expect(page.root).toEqualHtml(`
     <pos-predicate label="test-label" uri="https://predicate.test">
      <button title="https://predicate.test">
        test-label
      </button>
    </pos-predicate>
    `);
  });

  it('expands to full URI when clicked', async () => {
    const page = await newSpecPage({
      components: [PosPredicate],
      html: `<pos-predicate uri="https://predicate.test" label="test-label" />`,
      supportsShadowDom: false,
    });
    const button = getByRole(page.root, 'button');
    button.click();
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
     <pos-predicate label="test-label" uri="https://predicate.test">
      <div>
        <a href="https://predicate.test">
          https://predicate.test
        </a>
        <button>
          <ion-icon name="chevron-back-circle-outline"></ion-icon>
        </button>
      </div>
    </pos-predicate>
    `);
  });

  it('collapses to short label if collapse button clicked', async () => {
    const page = await newSpecPage({
      components: [PosPredicate],
      supportsShadowDom: false,
      html: `<pos-predicate uri="https://predicate.test" label="test-label" />`,
    });
    page.rootInstance.expanded = true;
    await page.waitForChanges();
    const button = getByRole(page.root, 'button');
    button.click();
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
     <pos-predicate label="test-label" uri="https://predicate.test">
      <button title="https://predicate.test">
        test-label
      </button>
    </pos-predicate>
    `);
  });
});
