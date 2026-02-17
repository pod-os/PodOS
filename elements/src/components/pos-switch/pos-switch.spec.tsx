import { newSpecPage } from '@stencil/core/testing';
import { PosSwitch } from './pos-switch';
import { when } from 'jest-when';
import { RdfType, Relation, Thing } from '@pod-os/core';
import { Subject } from 'rxjs';

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

  it('renders matching condition with negation', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case not if-typeof="http://schema.org/Video"><template><div>Not a Video</div></template></pos-case>
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
        <div>Not a Video</div>
        `);
  });

  it('renders templates if a forward link is present', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-property="https://schema.org/video">
          <template>
            <div>Resource has video</div>
          </template>
        </pos-case>
        <pos-case if-property="https://schema.org/description">
          <template>
            <div>Should not render as schema:description is not present</div>
          </template>
        </pos-case>
      </pos-switch>`,
    });
    const observedRelations$ = new Subject<Relation[]>();
    const thing = {
      uri: 'https://pod.example/resource',
      observeRelations: () => observedRelations$,
    };
    page.rootInstance.receiveResource(thing);
    observedRelations$.next([
      { predicate: 'https://schema.org/video', label: 'video', uris: ['https://video.test/video-1'] },
    ]);
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml(`
        <div>Resource has video</div>
        `);
  });

  it('renders templates if a backward link is present', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-rev="https://schema.org/video">
          <template>
            <div>Resource is video</div>
          </template>
        </pos-case>
        <pos-case if-rev="https://schema.org/subjectOf">
          <template>
            <div>Should not render as resource is not object of schema:subjectOf</div>
          </template>
        </pos-case>
      </pos-switch>`,
    });
    const observedReverseRelations$ = new Subject<Relation[]>();
    const thing = {
      uri: 'https://pod.example/resource',
      observeReverseRelations: () => observedReverseRelations$,
    };
    page.rootInstance.receiveResource(thing);
    observedReverseRelations$.next([
      { predicate: 'https://schema.org/video', label: 'video', uris: ['https://video.test/video-1'] },
    ]);
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml(`
        <div>Resource is video</div>
        `);
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
    const thing = {
      uri: 'https://pod.example/recipe1',
      observeTypes: () => observedTypes$,
      observeRelations: () => observedRelations$,
      observeReverseRelations: () => observedReverseRelations$,
    };
    page.rootInstance.receiveResource(thing);
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
    console.log(page.root?.innerHTML);
    expect(page.root?.innerHTML).toEqualHtml(`
        <div>Recipe.</div>
        <div>Image.</div>
        <div>Recipe list.</div>
        `);
  });
});
