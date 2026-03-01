import { newSpecPage } from '@stencil/core/testing';
import { PosLabel } from './pos-label';
import { Subject } from 'rxjs';

describe('pos-label', () => {
  it('is empty initially', async () => {
    const page = await newSpecPage({
      components: [PosLabel],
      html: `<pos-label />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-label>
        <mock:shadow-root></mock:shadow-root>
      </pos-label>
  `);
  });

  it('renders label from resource', async () => {
    const page = await newSpecPage({
      components: [PosLabel],
      html: `<pos-label />`,
    });
    const observedLabel$ = new Subject<string>();
    const resource = {
      observeLabel: () => observedLabel$,
    };
    await page.rootInstance.receiveResource(resource);
    observedLabel$.next('Test Resource');
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-label>
        <mock:shadow-root>Test Resource</mock:shadow-root>
      </pos-label>
  `);
  });
});
