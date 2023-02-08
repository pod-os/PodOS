import { newSpecPage } from '@stencil/core/testing';
import { PosValue } from './pos-value';

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
    await page.rootInstance.receiveResource({
      anyValue: uri => `value of ${uri}`,
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-value predicate="https://vocab.example/#term" />
        <mock:shadow-root>value of https://vocab.example/#term</mock:shadow-root>
      </>
  `);
  });
});
