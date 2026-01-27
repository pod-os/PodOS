import { newSpecPage } from '@stencil/core/testing';
import { PosSwitch } from './pos-switch';

describe('pos-switch', () => {
  it('contains only templates initially', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-typeof="http://schema.org/Recipe">
          <template><div>Test</div></template>
        </pos-case>
      </pos-switch>`,
    });
    expect(page.root).toEqualHtml(`
      <pos-switch>
        <pos-case if-typeof="http://schema.org/Recipe">
          <template><div>Test</div></template>
        </pos-case>
      </pos-switch>
        `);
  });

  it('loads condition templates', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-typeof="http://schema.org/Recipe">
          <template><div>Recipe</div></template>
        </pos-case>
        <pos-case if-typeof="http://schema.org/Video">
          <template><div>Video</div></template>
        </pos-case>
      </pos-switch>`,
    });
    await page.rootInstance.receiveResource({ types: () => [] });
    await page.waitForChanges();
    expect(page.rootInstance.caseElements.length).toEqual(2);
    expect(page.rootInstance.caseElements[0].getAttribute('if-typeof')).toEqual('http://schema.org/Recipe');
    expect(page.rootInstance.caseElements[1].getAttribute('if-typeof')).toEqual('http://schema.org/Video');
  });

  it('does not load nested templates', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-typeof="http://schema.org/Recipe">
          <template>
            <pos-case></pos-case>
          </template>
        </pos-case>
      </pos-switch>`,
    });
    await page.rootInstance.receiveResource({ types: () => [] });
    await page.waitForChanges();
    expect(page.rootInstance.caseElements.length).toEqual(1);
    expect(page.rootInstance.caseElements[0].getAttribute('if-typeof')).toEqual('http://schema.org/Recipe');
  });

  it('displays error on missing template', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `<pos-switch></pos-switch>`,
    });
    await page.rootInstance.receiveResource({});
    await page.waitForChanges();

    const el: HTMLElement = page.root as unknown as HTMLElement;

    expect(el.textContent).toEqual('No pos-case elements found');
  });

  it('renders matching condition templates', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-typeof="http://schema.org/Recipe">
          <template>
            <div>Recipe 1</div>
          </template>
        <pos-case if-typeof="http://schema.org/Recipe">
          <template>
            <div>Recipe 2</div>
          </template>
        <pos-case if-typeof="http://schema.org/Video">
          <template>
            <div>Video 1</div>
          </template>
      </pos-switch>`,
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
        <div>Recipe 1</div>
        <div>Recipe 2</div>
        `);
  });

  it('renders matching condition templates with if-else logic', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-typeof="http://schema.org/Video"><template><div>Video 1</div></template></pos-case></pos-case>
        <pos-case else if-typeof="http://schema.org/Recipe"><template><div>Recipe 1</div></template></pos-case>
        <pos-case else if-typeof="http://schema.org/Recipe"><template><div>Recipe 2</div></template></pos-case>
        <pos-case else><template><div>No matches</div></template></pos-case>
      </pos-switch>`,
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
        <div>Recipe 1</div>
        `);
  });

  it('renders final else condition if no other templates match', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-typeof="http://schema.org/Video"><template><div>Video 1</div></template></pos-case>
        <pos-case else><template><div>No matches</div></template></pos-case>
      </pos-switch>`,
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
        <div>No matches</div>
        `);
  });

  it('renders matching condition with negation', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case not if-typeof="http://schema.org/Video"><template><div>Not a Video</div></template></pos-case>
      </pos-switch>`,
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
        <div>Not a Video</div>
        `);
  });
});
