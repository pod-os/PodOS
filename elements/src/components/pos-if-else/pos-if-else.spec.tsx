import { newSpecPage } from '@stencil/core/testing';
import { PosIfElse } from './pos-if-else';
import { when } from 'jest-when';
import { Subject } from 'rxjs';

describe('pos-if-else', () => {
  it('contains only templates initially', async () => {
    const page = await newSpecPage({
      components: [PosIfElse],
      html: `
      <pos-if-else>
        <template if-typeof="http://schema.org/Recipe"><div>Test</div></template>
      </pos-if-else>`,
    });
    expect(page.root).toEqualHtml(`
      <pos-if-else>
        <template if-typeof="http://schema.org/Recipe"><div>Test</div></template>
      </pos-if-else>
        `);
  });

  it('loads condition templates', async () => {
    const page = await newSpecPage({
      components: [PosIfElse],
      html: `
      <pos-if-else>
        <template if-typeof="http://schema.org/Recipe"><div>Recipe</div></template>
        <template if-typeof="http://schema.org/Video"><div>Video</div></template>
      </pos-if-else>`,
    });
    await page.rootInstance.receiveResource({ types: () => [] });
    await page.waitForChanges();
    expect(page.rootInstance.conditionElements.length).toEqual(2);
    expect(page.rootInstance.conditionElements[0].getAttribute('if-typeof')).toEqual('http://schema.org/Recipe');
    expect(page.rootInstance.conditionElements[1].getAttribute('if-typeof')).toEqual('http://schema.org/Video');
  });

  it('does not load nested templates', async () => {
    const page = await newSpecPage({
      components: [PosIfElse],
      html: `
      <pos-if-else>
        <template if-typeof="http://schema.org/Recipe">
          <template>
            <div>Test</div>
          </template>
        </template>
      </pos-if-else>`,
    });
    await page.rootInstance.receiveResource({ types: () => [] });
    await page.waitForChanges();
    expect(page.rootInstance.conditionElements.length).toEqual(1);
    expect(page.rootInstance.conditionElements[0].getAttribute('if-typeof')).toEqual('http://schema.org/Recipe');
  });

  it('displays error on missing template', async () => {
    const page = await newSpecPage({
      components: [PosIfElse],
      html: `<pos-if-else></pos-if-else>`,
    });
    await page.rootInstance.receiveResource({});
    await page.waitForChanges();

    const el: HTMLElement = page.root as unknown as HTMLElement;

    expect(el.textContent).toEqual('No template elements found');
  });

  it('renders matching condition templates', async () => {
    const page = await newSpecPage({
      components: [PosIfElse],
      html: `
      <pos-if-else>
        <template if-typeof="http://schema.org/Recipe"><div>Recipe 1</div></template>
        <template if-typeof="http://schema.org/Recipe"><div>Recipe 2</div></template>
        <template if-typeof="http://schema.org/Video"><div>Video 1</div></template>
      </pos-if-else>`,
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
      components: [PosIfElse],
      html: `
      <pos-if-else>
        <template if-typeof="http://schema.org/Video"><div>Video 1</div></template>
        <template else if-typeof="http://schema.org/Recipe"><div>Recipe 1</div></template>
        <template else if-typeof="http://schema.org/Recipe"><div>Recipe 2</div></template>
        <template else><div>No matches</div></template>
      </pos-if-else>`,
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
      components: [PosIfElse],
      html: `
      <pos-if-else>
        <template if-typeof="http://schema.org/Video"><div>Video 1</div></template>
        <template else><div>No matches</div></template>
      </pos-if-else>`,
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
});
