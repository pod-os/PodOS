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

  it('unsubscribes from previous resource when receiving a new one', async () => {
    // Given a pos-description component
    const page = await newSpecPage({
      components: [PosDescription],
      html: `<pos-description />`,
    });

    // And a resource A with observable
    const descriptionA$ = new Subject<string>();
    const resourceA = {
      observeDescription: () => descriptionA$,
    };

    // And a second resource B with observable
    const descriptionB$ = new Subject<string>();
    const resourceB = {
      observeDescription: () => descriptionB$,
    };

    // And the resource A and it's description are received
    await page.rootInstance.receiveResource(resourceA);
    descriptionA$.next('Description A');
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-description>
        <mock:shadow-root>Description A</mock:shadow-root>
      </pos-description>
  `);

    // But the component changes to the resource B after that
    await page.rootInstance.receiveResource(resourceB);
    descriptionB$.next('Description B');
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-description>
        <mock:shadow-root>Description B</mock:shadow-root>
      </pos-description>
  `);

    // When the first resource now gets an update description
    descriptionA$.next('Description A Updated');
    await page.waitForChanges();

    // Then the component should not be affected, because it is bound to resource B
    expect(page.root).toEqualHtml(`
      <pos-description>
        <mock:shadow-root>Description B</mock:shadow-root>
      </pos-description>
  `);
  });
});
