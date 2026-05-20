import { newSpecPage } from '@stencil/core/testing';
import { PosSwitch } from './pos-switch';
import { Literal, RdfType, Relation, Thing } from '@pod-os/core';
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

  it('renders templates if a forward link is present (relation)', async () => {
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
    const observedLiterals$ = new Subject<Literal[]>();

    const thing = {
      uri: 'https://pod.example/resource',
      observeRelations: () => observedRelations$,
      observeLiterals: () => observedLiterals$,
    };
    page.rootInstance.receiveResource(thing);
    observedLiterals$.next([]);
    observedRelations$.next([
      { predicate: 'https://schema.org/video', label: 'video', uris: ['https://video.test/video-1'] },
    ]);
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml(`
        <div>Resource has video</div>
        `);
  });

  it('renders templates if a forward link is present (literal)', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-property="https://schema.org/name">
          <template>
            <div>Resource has a name</div>
          </template>
        </pos-case>
      </pos-switch>`,
    });
    const observedRelations$ = new Subject<Relation[]>();
    const observedLiterals$ = new Subject<Literal[]>();
    const thing = {
      uri: 'https://pod.example/resource',
      observeRelations: () => observedRelations$,
      observeLiterals: () => observedLiterals$,
    };
    page.rootInstance.receiveResource(thing);
    observedRelations$.next([]);
    observedLiterals$.next([{ predicate: 'https://schema.org/name', label: 'name', values: ['name'] }]);
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml(`
        <div>Resource has a name</div>
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

  it('renders templates if forward link value condition is met (relation)', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-property="https://schema.org/video" some-value-eq="https://video.test/video-1">
          <template>
            <div>Resource has video</div>
          </template>
        </pos-case>
        <pos-case if-property="https://schema.org/video" some-value-eq="https://video.test/video-missing">
          <template>
            <div>Should not render as value condition is not met</div>
          </template>
        </pos-case>
      </pos-switch>`,
    });
    const observedRelations$ = new Subject<Relation[]>();
    const observedLiterals$ = new Subject<Literal[]>();
    const thing = {
      uri: 'https://pod.example/resource',
      observeRelations: () => observedRelations$,
      observeLiterals: () => observedLiterals$,
    };
    page.rootInstance.receiveResource(thing);
    observedLiterals$.next([]);
    observedRelations$.next([
      { predicate: 'https://schema.org/video', label: 'video', uris: ['https://video.test/video-1'] },
    ]);
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml(`
        <div>Resource has video</div>
        `);
  });

  it('renders templates if forward link value condition is met (literal)', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-property="https://schema.org/name" some-value-eq="Video 1">
          <template>
            <div>Resource has name</div>
          </template>
        </pos-case>
      </pos-switch>`,
    });
    const observedRelations$ = new Subject<Relation[]>();
    const observedLiterals$ = new Subject<Literal[]>();
    const thing = {
      uri: 'https://pod.example/resource',
      observeRelations: () => observedRelations$,
      observeLiterals: () => observedLiterals$,
    };
    page.rootInstance.receiveResource(thing);
    observedRelations$.next([
      { predicate: 'https://schema.org/video', label: 'video', uris: ['https://video.test/video-1'] },
    ]);
    observedLiterals$.next([{ predicate: 'https://schema.org/name', label: 'name', values: ['Video 1'] }]);
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml(`
        <div>Resource has name</div>
        `);
  });

  it('renders templates if backward link value condition is met', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-rev="https://schema.org/video" some-value-eq="https://video.test/video-1">
          <template>
            <div>Resource is video</div>
          </template>
        </pos-case>
        <pos-case if-rev="https://schema.org/video" some-value-eq="https://video.test/video-missing">
          <template>
            <div>Should not render as condition is not met</div>
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

  it('does not render templates when compareValue indicates that (some|every)-value-eq is not met', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-property="https://schema.org/video" some-value-eq="https://video.test/video-missing">
          <template>
            <div>some-value-eq not https://video.test/video-missing</div>
          </template>
        </pos-case>
        <pos-case if-property="https://schema.org/video" every-value-eq="https://video.test/video-1">
          <template>
            <div>every-value-eq not https://video.test/video-1</div>
          </template>
        </pos-case>
        <pos-case else>
          <template>
            <div>No conditions match</div>
          </template>
        </pos-case>
      </pos-switch>`,
    });
    const observedRelations$ = new Subject<Relation[]>();
    const observedLiterals$ = new Subject<Literal[]>();
    const thing = {
      uri: 'https://pod.example/resource',
      observeLiterals: () => observedLiterals$,
      observeRelations: () => observedRelations$,
    };
    page.rootInstance.receiveResource(thing);
    observedLiterals$.next([]);
    observedRelations$.next([
      {
        predicate: 'https://schema.org/video',
        label: 'video',
        uris: ['https://video.test/video-1', 'https://video.test/video-2'],
      },
    ]);
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml(`
        <div>No conditions match</div>
        `);
  });

  it('does not render templates when compareValue indicates that some-value-(lt|lte|gt|gte) is not met (string)', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-property="https://schema.org/name" some-value-lt="bravo">
          <template>
            <div>Not shown: ! bravo < bravo </div>
          </template>
        </pos-case>
        <pos-case if-property="https://schema.org/name" some-value-lte="alpha">
          <template>
            <div>Not shown: ! bravo <= alpha</div>
          </template>
        </pos-case>
        <pos-case if-property="https://schema.org/name" some-value-gte="charlie">
          <template>
            <div>Not shown: ! bravo >= charlie</div>
          </template>
        </pos-case>
        <pos-case if-property="https://schema.org/name" some-value-gt="bravo">
          <template>
            <div>Not shown: ! bravo > bravo</div>
          </template>
        </pos-case>
        <pos-case else>
          <template>
            <div>No conditions match</div>
          </template>
        </pos-case>
      </pos-switch>`,
    });
    const observedRelations$ = new Subject<Relation[]>();
    const observedLiterals$ = new Subject<Literal[]>();
    const thing = {
      uri: 'https://pod.example/resource',
      observeLiterals: () => observedLiterals$,
      observeRelations: () => observedRelations$,
    };
    page.rootInstance.receiveResource(thing);
    observedLiterals$.next([{ predicate: 'https://schema.org/name', label: 'name', values: ['bravo'] }]);
    observedRelations$.next([]);
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml(`
        <div>No conditions match</div>
        `);
  });

  it('does not render templates when compareValue indicates that every-value-(lt|lte|gt|gte) is not met (string)', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-property="https://schema.org/name" every-value-lt="bravo">
          <template>
            <div>Not shown: ! bravo and charlie < bravo </div>
          </template>
        </pos-case>
        <pos-case if-property="https://schema.org/name" every-value-lte="bravo">
          <template>
            <div>Not shown: ! bravo and charlie <= bravo</div>
          </template>
        </pos-case>
        <pos-case if-property="https://schema.org/name" every-value-gte="charlie">
          <template>
            <div>Not shown: ! bravo and charlie >=  charlie</div>
          </template>
        </pos-case>
        <pos-case if-property="https://schema.org/name" every-value-gt="charlie">
          <template>
            <div>Not shown: ! bravo and charlie > charlie</div>
          </template>
        </pos-case>
        <pos-case else>
          <template>
            <div>No conditions match</div>
          </template>
        </pos-case>
      </pos-switch>`,
    });
    const observedRelations$ = new Subject<Relation[]>();
    const observedLiterals$ = new Subject<Literal[]>();
    const thing = {
      uri: 'https://pod.example/resource',
      observeLiterals: () => observedLiterals$,
      observeRelations: () => observedRelations$,
    };
    page.rootInstance.receiveResource(thing);
    observedLiterals$.next([{ predicate: 'https://schema.org/name', label: 'name', values: ['bravo', 'charlie'] }]);
    observedRelations$.next([]);
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml(`
        <div>No conditions match</div>
        `);
  });

  it('does not render templates when compareValue indicates that some-value-(lt|lte|gt|gte) is not met (numeric)', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-property="https://schema.org/name" some-value-lt="3">
          <template>
            <div>Not shown: ! 20 < 3</div>
          </template>
        </pos-case>
        <pos-case if-property="https://schema.org/name" some-value-lte="3">
          <template>
            <div>Not shown: ! 20 <= 3</div>
          </template>
        </pos-case>
        <pos-case if-property="https://schema.org/name" some-value-gte="100">
          <template>
            <div>Not shown: ! 20 >= 100</div>
          </template>
        </pos-case>
        <pos-case if-property="https://schema.org/name" some-value-gt="100">
          <template>
            <div>Not shown: ! 20 > 100</div>
          </template>
        </pos-case>
        <pos-case else>
          <template>
            <div>No conditions match</div>
          </template>
        </pos-case>
      </pos-switch>`,
    });
    const observedRelations$ = new Subject<Relation[]>();
    const observedLiterals$ = new Subject<Literal[]>();
    const thing = {
      uri: 'https://pod.example/resource',
      observeLiterals: () => observedLiterals$,
      observeRelations: () => observedRelations$,
    };
    page.rootInstance.receiveResource(thing);
    observedLiterals$.next([{ predicate: 'https://schema.org/name', label: 'name', values: ['20'] }]);
    observedRelations$.next([]);
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml(`
        <div>No conditions match</div>
        `);
  });

  it('does not render templates when compareValue indicates that every-value-(lt|lte|gt|gte) is not met (numeric)', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case if-property="https://schema.org/name" every-value-lt="4">
          <template>
            <div>Not shown: ! 20 and 30 < 4</div>
          </template>
        </pos-case>
        <pos-case if-property="https://schema.org/name" every-value-lte="4">
          <template>
            <div>Not shown: ! 20 and 30 <= 4</div>
          </template>
        </pos-case>
        <pos-case if-property="https://schema.org/name" every-value-gte="100">
          <template>
            <div>Not shown: ! 20 and 30 >= 100</div>
          </template>
        </pos-case>
        <pos-case if-property="https://schema.org/name" every-value-gt="100">
          <template>
            <div>Not shown: ! 20 and 30 > 100</div>
          </template>
        </pos-case>
        <pos-case else>
          <template>
            <div>No conditions match</div>
          </template>
        </pos-case>
      </pos-switch>`,
    });
    const observedRelations$ = new Subject<Relation[]>();
    const observedLiterals$ = new Subject<Literal[]>();
    const thing = {
      uri: 'https://pod.example/resource',
      observeLiterals: () => observedLiterals$,
      observeRelations: () => observedRelations$,
    };
    page.rootInstance.receiveResource(thing);
    observedLiterals$.next([{ predicate: 'https://schema.org/name', label: 'name', values: ['20', '30'] }]);
    observedRelations$.next([]);
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml(`
        <div>No conditions match</div>
        `);
  });

  it('renders templates when property is absent (not if-property)', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case not if-property="https://schema.org/description">
          <template>
            <div>Resource has no description</div>
          </template>
        </pos-case>
        <pos-case if-property="https://schema.org/description">
          <template>
            <div>Should not render as description is not present</div>
          </template>
        </pos-case>
      </pos-switch>`,
    });
    const observedRelations$ = new Subject<Relation[]>();
    const observedLiterals$ = new Subject<Literal[]>();
    const thing = {
      uri: 'https://pod.example/resource',
      observeRelations: () => observedRelations$,
      observeLiterals: () => observedLiterals$,
    };
    page.rootInstance.receiveResource(thing);
    observedLiterals$.next([]);
    observedRelations$.next([]);
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml(`
        <div>Resource has no description</div>
        `);
  });

  it('renders templates when backward link is absent (not if-rev)', async () => {
    const page = await newSpecPage({
      components: [PosSwitch],
      html: `
      <pos-switch>
        <pos-case not if-rev="https://schema.org/video">
          <template>
            <div>Resource is not a video object</div>
          </template>
        </pos-case>
        <pos-case if-rev="https://schema.org/video">
          <template>
            <div>Should not render as video reverse relation is not present</div>
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
    observedReverseRelations$.next([]);
    await page.waitForChanges();
    expect(page.root?.innerHTML).toEqualHtml(`
        <div>Resource is not a video object</div>
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
