import { newSpecPage } from '@stencil/core/testing';
import { PosSwitch } from './pos-switch';
import { Literal, RdfType, Relation, Thing } from '@pod-os/core';
import { Subject } from 'rxjs';

describe('pos-switch', () => {
  describe('template loading', () => {
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
      expect(page.rootInstance.caseElements.length).toEqual(1);
      expect(page.rootInstance.caseElements[0].getAttribute('if-typeof')).toEqual('http://schema.org/Recipe');
    });

    it('displays error on missing template', async () => {
      const page = await newSpecPage({
        components: [PosSwitch],
        html: `<pos-switch></pos-switch>`,
      });
      const el: HTMLElement = page.root as unknown as HTMLElement;
      expect(el.textContent).toEqual('No pos-case elements found');
    });
  });

  it('renders matching condition templates, reactively', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-typeof="http://schema.org/Recipe">
          <template>
            <div>Recipe 1</div>
          </template>
        </pos-case>
        <pos-case if-typeof="http://schema.org/Recipe">
          <template>
            <div>Recipe 2</div>
          </template>
        </pos-case>
        <pos-case if-typeof="http://schema.org/Video">
          <template>
            <div>Video 1</div>
          </template>
        </pos-case>
      </pos-switch>`,
    });
    const observedTypes$ = new Subject<RdfType[]>();
    const thing = {
      observeTypes: () => observedTypes$,
    } as unknown as Thing;
    page.rootInstance.receiveResource(thing);
    observedTypes$.next([
      {
        label: 'Recipe',
        uri: 'http://schema.org/Recipe',
      },
    ]);
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml(`
        <div>Recipe 1</div>
        <div>Recipe 2</div>
        `);
  });

  describe('if-else logic', () => {
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
      const observedTypes$ = new Subject<RdfType[]>();
      const thing = {
        observeTypes: () => observedTypes$,
      } as unknown as Thing;
      page.rootInstance.receiveResource(thing);
      observedTypes$.next([
        {
          label: 'Recipe',
          uri: 'http://schema.org/Recipe',
        },
      ]);
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
      const observedTypes$ = new Subject<RdfType[]>();
      const thing = {
        observeTypes: () => observedTypes$,
      } as unknown as Thing;
      page.rootInstance.receiveResource(thing);
      observedTypes$.next([
        {
          label: 'Recipe',
          uri: 'http://schema.org/Recipe',
        },
      ]);
      await page.waitForChanges();
      expect(page.root?.innerHTML).toEqualHtml(`
        <div>No matches</div>
        `);
    });
  });

  it('supports mixed test conditions', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-typeof="http://schema.org/Recipe">
          <template>
            <div>Recipe.</div>
          </template>
        </pos-case>
        <pos-case if-property="http://schema.org/image">
          <template>
            <div>Image.</div>
          </template>
        </pos-case>
        <pos-case if-rev="http://schema.org/itemListElement">
          <template>
            <div>Recipe list.</div>
          </template>
        </pos-case>
      </pos-switch>`,
    });
    const observedTypes$ = new Subject<RdfType[]>();
    const observedRelations$ = new Subject<Relation[]>();
    const observedReverseRelations$ = new Subject<Relation[]>();
    const observedLiterals$ = new Subject<Literal[]>();
    const thing = {
      uri: 'https://pod.example/recipe1',
      observeLiterals: () => observedLiterals$,
      observeTypes: () => observedTypes$,
      observeRelations: () => observedRelations$,
      observeReverseRelations: () => observedReverseRelations$,
    };
    page.rootInstance.receiveResource(thing);
    observedLiterals$.next([]);
    observedTypes$.next([
      {
        label: 'Recipe',
        uri: 'http://schema.org/Recipe',
      },
    ]);
    observedRelations$.next([
      { predicate: 'http://schema.org/image', label: 'image', uris: ['https://resource.test/recipe-photo.jpg'] },
    ]);
    observedReverseRelations$.next([
      {
        predicate: 'http://schema.org/itemListElement',
        label: 'itemListElement',
        uris: ['https://pod.example/recipe-list'],
      },
    ]);
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml(`
        <div>Recipe.</div>
        <div>Image.</div>
        <div>Recipe list.</div>
        `);
  });

  it('resets and updates when resource is changed', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-typeof="http://schema.org/Recipe">
          <template>Recipe.</template>
        </pos-case>
        <pos-case if-typeof="http://schema.org/Video">
          <template>Video.</template>
        </pos-case>
      </pos-switch>`,
    });
    const observedTypes$ = new Subject<RdfType[]>();
    const thing = {
      uri: 'https://pod.example/recipe1',
      observeTypes: () => observedTypes$,
    };
    page.rootInstance.receiveResource(thing);
    observedTypes$.next([
      {
        label: 'Recipe',
        uri: 'http://schema.org/Recipe',
      },
    ]);
    await page.waitForChanges();
    expect(page.root?.innerText).toEqualText('Recipe.');
    // new thing
    const observedTypes2$ = new Subject<RdfType[]>();
    const thing2 = {
      uri: 'https://pod.example/video1',
      observeTypes: () => observedTypes2$,
    };
    page.rootInstance.receiveResource(thing2);
    await page.waitForChanges();
    expect(page.root?.innerText).toEqualText('');
    observedTypes2$.next([
      {
        label: 'Video',
        uri: 'http://schema.org/Video',
      },
    ]);
    await page.waitForChanges();
    expect(page.root?.innerText).toEqualText('Video.');
  });
});
