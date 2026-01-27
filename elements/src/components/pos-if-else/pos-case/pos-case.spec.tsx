import { newSpecPage } from '@stencil/core/testing';
import { PosCase } from './pos-case';

describe('pos-case', () => {
  it('contains only templates initially', async () => {
    const page = await newSpecPage({
      components: [PosCase],
      html: `
      <pos-case if-typeof="http://schema.org/Recipe">
        <template><div>Test</div></template>
      </pos-case>`,
    });
    expect(page.root).toEqualHtml(`
      <pos-case if-typeof="http://schema.org/Recipe">
        <template><div>Test</div></template>
      </pos-case>
        `);
  });

  it('renders empty by default', async () => {
    const page = await newSpecPage({
      components: [PosCase],
      html: `
      <pos-case if-typeof="http://schema.org/Recipe">
        <template><div>Test</div></template>
      </pos-case>`,
    });
    await page.rootInstance.receiveResource({});
    await page.waitForChanges();

    const el: HTMLElement = page.root as unknown as HTMLElement;
    expect(el.textContent).toEqualHtml('');
  });

  it('loads template', async () => {
    const page = await newSpecPage({
      components: [PosCase],
      html: `
      <pos-case if-typeof="http://schema.org/Recipe">
        <template><div>Recipe</div></template>
      </pos-case>`,
    });
    await page.rootInstance.receiveResource({ types: () => [] });
    await page.waitForChanges();
    expect(page.rootInstance.templateString).toEqual('<div>Recipe</div>');
  });

  it('displays error on missing template', async () => {
    const page = await newSpecPage({
      components: [PosCase],
      html: `<pos-case></pos-case>`,
    });
    await page.rootInstance.receiveResource({});
    await page.waitForChanges();

    const el: HTMLElement = page.root as unknown as HTMLElement;

    expect(el.textContent).toEqual('No template element found');
  });

  it('test() returns result of evaluating condition', async () => {
    const page = await newSpecPage({
      components: [PosCase],
      html: `
      <pos-case if-typeof="http://schema.org/Recipe">
        <template><div>Test</div></template>
      </pos-case>`,
    });
    await page.rootInstance.receiveResource({
      types: () => [
        {
          label: 'Recipe',
          uri: 'http://schema.org/Recipe',
        },
      ],
    });
    await page.waitForChanges();
    expect(page.rootInstance.test()).toBe(true);
    await page.rootInstance.receiveResource({
      types: () => [
        {
          label: 'Video',
          uri: 'http://schema.org/Video',
        },
      ],
    });
    await page.waitForChanges();
    expect(page.rootInstance.test()).toBe(false);
  });

  it('test() returns null if no condition is present', async () => {
    const page = await newSpecPage({
      components: [PosCase],
      html: `
      <pos-case>
        <template><div>Test</div></template>
      </pos-case>`,
    });
    await page.rootInstance.receiveResource({});
    await page.waitForChanges();
    expect(page.rootInstance.test()).toBe(null);
  });

  it('respects negation', async () => {
    const page = await newSpecPage({
      components: [PosCase],
      html: `
      <pos-case not if-typeof="http://schema.org/Video">
        <template><div>Not a Video</div></template>
      </pos-case>`,
    });
    await page.rootInstance.receiveResource({
      types: () => [
        {
          label: 'Recipe',
          uri: 'http://schema.org/Recipe',
        },
      ],
    });
    await page.waitForChanges();
    expect(page.rootInstance.test()).toBe(true);
  });

  it('else property is false if missing', async () => {
    const page = await newSpecPage({
      components: [PosCase],
      html: `
      <pos-case if-typeof="http://schema.org/Recipe">
        <template><div>Test</div></template>
      </pos-case>`,
    });
    await page.rootInstance.receiveResource({});
    await page.waitForChanges();
    expect(page.rootInstance.else).toBe(false);
  });

  it('else property is true if present', async () => {
    const page = await newSpecPage({
      components: [PosCase],
      html: `
      <pos-case else if-typeof="http://schema.org/Recipe">
        <template><div>Test</div></template>
      </pos-case>`,
    });
    await page.rootInstance.receiveResource({});
    await page.waitForChanges();
    expect(page.rootInstance.else).toBe(true);
  });

  it('renders template if attribute active is set', async () => {
    const page = await newSpecPage({
      components: [PosCase],
      html: `
        <pos-case if-typeof="http://schema.org/Recipe" active>
          <template><div>This is a recipe</div></template>
        </pos-case>`,
    });
    await page.rootInstance.receiveResource({
      types: () => [
        {
          label: 'Recipe',
          uri: 'http://schema.org/Recipe',
        },
      ],
    });
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml(`
          <div>This is a recipe</div>
          `);
  });
});
