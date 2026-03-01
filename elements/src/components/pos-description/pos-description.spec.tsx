import { newSpecPage } from '@stencil/core/testing';
import { PosDescription } from './pos-description';
import { Subject } from 'rxjs';

describe('pos-description', () => {
  it('is empty initially', async () => {
    const page = await newSpecPage({
      components: [PosDescription],
      html: `<pos-description />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-description>
        <mock:shadow-root></mock:shadow-root>
      </pos-description>
  `);
  });

  it('renders description from resource', async () => {
    const page = await newSpecPage({
      components: [PosDescription],
      html: `<pos-description />`,
    });
    const observedDescription$ = new Subject<string>();
    const resource = {
      observeDescription: () => observedDescription$,
    };
    await page.rootInstance.receiveResource(resource);
    observedDescription$.next('Test Resource');
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-description>
        <mock:shadow-root>Test Resource</mock:shadow-root>
      </pos-description>
  `);
  });

  it('updates description when changes', async () => {
    const page = await newSpecPage({
      components: [PosDescription],
      html: `<pos-description />`,
    });
    const observedDescription$ = new Subject<string>();
    const resource = {
      observeDescription: () => observedDescription$,
    };
    await page.rootInstance.receiveResource(resource);

    observedDescription$.next('Test Resource');
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-description>
        <mock:shadow-root>Test Resource</mock:shadow-root>
      </pos-description>
  `);

    observedDescription$.next('Test Resource 2');
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-description>
        <mock:shadow-root>Test Resource 2</mock:shadow-root>
      </pos-description>
  `);
  });
});
