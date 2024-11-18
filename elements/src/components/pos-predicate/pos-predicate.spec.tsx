import { newSpecPage } from '@stencil/core/testing';
import { PosPredicate } from './pos-predicate';

describe('pos-predicate', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PosPredicate],
      html: `<pos-predicate uri="https://predicate.test" label="test-label" />`,
    });

    expect(page.root).toEqualHtml(`
     <pos-predicate label="test-label" uri="https://predicate.test">
      <ion-label title="https://predicate.test">
        test-label
      </ion-label>
    </pos-predicate>
    `);
  });
});
