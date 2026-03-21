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

  it('updates when resource changes', async () => {
    const page = await newSpecPage({
      components: [PosValue],
      html: `<pos-value predicate="https://vocab.example/#term" />`,
    });
    const observedValue1$ = new ReplaySubject<string>();
    observedValue1$.next(`value for first resource`);
    await page.rootInstance.receiveResource({
      observeAnyValue: (uri: string) => (uri === 'https://vocab.example/#term' ? observedValue1$ : undefined),
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-value predicate="https://vocab.example/#term" />
        <mock:shadow-root>value for first resource</mock:shadow-root>
      </>
  `);
    const observedValue2$ = new ReplaySubject<string>();
    observedValue2$.next(`value for second resource`);
    await page.rootInstance.receiveResource({
      observeAnyValue: (uri: string) => (uri === 'https://vocab.example/#term' ? observedValue2$ : undefined),
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-value predicate="https://vocab.example/#term" />
        <mock:shadow-root>value for second resource</mock:shadow-root>
      </>
  `);
  });

  it('updates when predicate changes', async () => {
    const page = await newSpecPage({
      components: [PosValue],
      html: `<pos-value predicate="https://vocab.example/#term" />`,
    });
    const observedValues: { [key: string]: ReplaySubject<string> } = {
      'https://vocab.example/#term': new ReplaySubject<string>(),
      'https://vocab.example/#term2': new ReplaySubject<string>(),
    };
    observedValues['https://vocab.example/#term'].next(`value of https://vocab.example/#term`);
    observedValues['https://vocab.example/#term2'].next(`value of https://vocab.example/#term2`);
    await page.rootInstance.receiveResource({
      observeAnyValue: (uri: string) => observedValues[uri],
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-value predicate="https://vocab.example/#term" />
        <mock:shadow-root>value of https://vocab.example/#term</mock:shadow-root>
      </>
  `);
    page.rootInstance.predicate = 'https://vocab.example/#term2';
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-value predicate="https://vocab.example/#term2" />
        <mock:shadow-root>value of https://vocab.example/#term2</mock:shadow-root>
      </>
  `);
  });
});
