import { describe, expect, h, it, render } from '@stencil/vitest';
import './pos-description';
import { BehaviorSubject, of } from 'rxjs';
import { mockResource, mockResources } from '../../test/mockResource';
import { Thing } from '@pod-os/core';

describe('pos-description', () => {
  it('is empty initially', async () => {
    const page = await render(<pos-description></pos-description>);
    expect(page.root).toBeEmptyDOMElement();
  });

  it('renders description from resource', async () => {
    const resource = {
      observeDescription: () => of('Test Resource'),
    };
    mockResource(resource);
    const page = await render(<pos-description></pos-description>);
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml('Test Resource');
  });

  it('updates description when changes', async () => {
    const observedDescription$ = new BehaviorSubject('First value');
    const resource = {
      observeDescription: () => observedDescription$,
    };
    mockResource(resource);

    const page = await render(<pos-description></pos-description>);
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml(`First value`);

    observedDescription$.next('Second value');
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml(`Second value`);
  });

  it('unsubscribes from previous resource when receiving a new one', async () => {
    // Given a resource A
    const descriptionA$ = new BehaviorSubject('Description A');
    const resourceA: Partial<Thing> = {
      observeDescription: () => descriptionA$,
    };

    // And a second resource B
    const descriptionB$ = new BehaviorSubject('Description B');
    const resourceB: Partial<Thing> = {
      observeDescription: () => descriptionB$,
    };

    const resources = mockResources();

    // And a pos-description component
    const page = await render(<pos-description></pos-description>);

    // And the resource A and it's description are received
    resources.next(resourceA);
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml('Description A');

    // But the component changes to the resource B after that
    resources.next(resourceB);
    await page.waitForChanges();
    expect(page.root.shadowRoot).toEqualHtml('Description B');

    // When the first resource now gets an update description
    descriptionA$.next('Description A Updated');
    await page.waitForChanges();

    // Then the component should not be affected, because it is bound to resource B
    expect(page.root.shadowRoot).toEqualHtml('Description B');
  });
});
