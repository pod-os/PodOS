import { newSpecPage } from '@stencil/core/testing';
import { PosValue } from './pos-value';
import { ReplaySubject, Subject } from 'rxjs';

describe('pos-value', () => {
  it('is empty initially', async () => {
    const page = await newSpecPage({
      components: [PosValue],
      html: `<pos-value predicate="https://vocab.example/#term" />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-value predicate="https://vocab.example/#term" />
        <mock:shadow-root></mock:shadow-root>
      </pos-value>
  `);
  });

  it('renders property value from resource', async () => {
    const page = await newSpecPage({
      components: [PosValue],
      html: `<pos-value predicate="https://vocab.example/#term" />`,
    });
    const observedValue$ = new ReplaySubject<string>();
    observedValue$.next(`value of https://vocab.example/#term`);
    await page.rootInstance.receiveResource({
      observeAnyValue: (uri: string) => (uri === 'https://vocab.example/#term' ? observedValue$ : undefined),
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-value predicate="https://vocab.example/#term" />
        <mock:shadow-root>value of https://vocab.example/#term</mock:shadow-root>
      </>
  `);
  });

  it('updates property value when changed', async () => {
    const page = await newSpecPage({
      components: [PosValue],
      html: `<pos-value predicate="https://vocab.example/#term" />`,
    });
    const observedValue$ = new Subject<string>();
    await page.rootInstance.receiveResource({
      observeAnyValue: (uri: string) => (uri === 'https://vocab.example/#term' ? observedValue$ : undefined),
    });
    observedValue$.next(`value of https://vocab.example/#term`);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-value predicate="https://vocab.example/#term" />
        <mock:shadow-root>value of https://vocab.example/#term</mock:shadow-root>
      </>
  `);
    observedValue$.next(`new value of https://vocab.example/#term`);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-value predicate="https://vocab.example/#term" />
        <mock:shadow-root>new value of https://vocab.example/#term</mock:shadow-root>
      </>
  `);
  });
});
