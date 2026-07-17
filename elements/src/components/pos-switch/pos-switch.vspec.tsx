import { describe, expect, h, it, render } from '@stencil/vitest';

import './pos-switch';
import './pos-case/pos-case';
import { BehaviorSubject, Subject } from 'rxjs';
import { Literal, RdfType, Relation, Thing } from '@pod-os/core';

describe('pos-switch', () => {
  describe('template loading', () => {
    it('contains nothing initially', async () => {
      const page = await render(
        <pos-switch>
          <pos-case if-typeof="http://schema.org/Recipe">
            <template>
              <div>Test</div>
            </template>
          </pos-case>
        </pos-switch>,
      );
      expect(page.root).toMatchInlineSnapshot(`
        <pos-switch class="hydrated">
          <mock:shadow-root></mock:shadow-root>
          <pos-case if-typeof="http://schema.org/Recipe" innerhtml class="hydrated"></pos-case>
        </pos-switch>
      `);
    });
    it('load rules from cases', async () => {
      const page = await render(
        <pos-switch>
          <pos-case if-typeof="http://schema.org/Recipe">
            <template>
              <div>Recipe</div>
            </template>
          </pos-case>
          <pos-case if-typeof="http://schema.org/Video">
            <template>
              <div>Video</div>
            </template>
          </pos-case>
        </pos-switch>,
      );
      expect(page.instance.cases).toHaveLength(2);
      expect(page.instance.cases[0].rule).toEqual({
        type: 'if-typeof',
        value: 'http://schema.org/Recipe',
      });
      expect(page.instance.cases[1].rule).toEqual({
        type: 'if-typeof',
        value: 'http://schema.org/Video',
      });
    });
    it('does not load nested templates', async () => {
      const page = await render(
        <pos-switch>
          <pos-case if-typeof="http://schema.org/Recipe">
            <template>
              <pos-case></pos-case>
            </template>
          </pos-case>
        </pos-switch>,
      );
      expect(page.instance.cases).toHaveLength(1);
    });
    it('displays error on missing template', async () => {
      const page = await render(<pos-switch></pos-switch>);
      expect(page.root).toHaveTextContent('No pos-case elements found');
    });
    it('supports mixed test conditions', async () => {
      const page = await render(
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
        </pos-switch>,
      );
      const observedTypes$ = new BehaviorSubject<RdfType[]>([]);
      const observedRelations$ = new BehaviorSubject<Relation[]>([]);
      const observedReverseRelations$ = new BehaviorSubject<Relation[]>([]);
      const observedLiterals$ = new BehaviorSubject<Literal[]>([]);
      const thing = {
        uri: 'https://pod.example/recipe1',
        observeLiterals: () => observedLiterals$,
        observeTypes: () => observedTypes$,
        observeRelations: () => observedRelations$,
        observeReverseRelations: () => observedReverseRelations$,
      };
      page.instance.receiveResource(thing);
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
      expect(page.root).toEqualText('Recipe.Image.Recipe list.');
    });
  });
  describe('reactive rendering', () => {
    it('renders matching condition templates reactively', async () => {
      const page = await render(
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
        </pos-switch>,
      );
      const observedTypes$ = new BehaviorSubject<RdfType[]>([]);
      const thing = {
        observeTypes: () => observedTypes$,
      } as unknown as Thing;
      page.instance.receiveResource(thing);
      observedTypes$.next([
        {
          label: 'Recipe',
          uri: 'http://schema.org/Recipe',
        },
      ]);
      await page.waitForChanges();
      expect(page.root).toEqualText('Recipe 1Recipe 2');
    });

    it('resets and updates types when resource is changed', async () => {
      const page = await render(
        <pos-switch>
          <pos-case if-typeof="http://schema.org/Recipe">
            <template>Recipe.</template>
          </pos-case>
          <pos-case if-typeof="http://schema.org/Video">
            <template>Video.</template>
          </pos-case>
        </pos-switch>,
      );
      const { thing, observedTypes$ } = mockObservedResource('https://pod.example/recipe1');
      page.instance.receiveResource(thing);
      observedTypes$.next([
        {
          label: 'Recipe',
          uri: 'http://schema.org/Recipe',
        },
      ]);
      await page.waitForChanges();
      expect(page.root).toEqualText('Recipe.');
      // new thing
      const { thing: thing2, observedTypes$: observedTypes2$ } = mockObservedResource('https://pod.example/video1');
      page.instance.receiveResource(thing2);
      await page.waitForChanges();
      expect(page.root).toEqualText('');
      observedTypes2$.next([
        {
          label: 'Video',
          uri: 'http://schema.org/Video',
        },
      ]);
      await page.waitForChanges();
      expect(page.root).toEqualText('Video.');
    });

    it('resets and updates literals when resource is changed', async () => {
      const page = await render(
        <pos-switch>
          <pos-case if-property="http://schema.org/name">
            <template>Name</template>
          </pos-case>
          <pos-case if-property="http://schema.org/description">
            <template>Description</template>
          </pos-case>
        </pos-switch>,
      );
      const { thing, observedLiterals$ } = mockObservedResource('https://pod.example/recipe1');
      page.instance.receiveResource(thing);
      observedLiterals$.next([
        {
          label: 'name',
          predicate: 'http://schema.org/name',
          values: ['some name'],
        },
      ]);
      await page.waitForChanges();
      expect(page.root).toEqualText('Name');
      // new thing
      const { thing: thing2, observedLiterals$: observedLiterals2$ } =
        mockObservedResource('https://pod.example/video1');
      page.instance.receiveResource(thing2);
      await page.waitForChanges();
      expect(page.root).toEqualText('');
      observedLiterals2$.next([
        {
          label: 'description',
          predicate: 'http://schema.org/description',
          values: ['some description'],
        },
      ]);
      await page.waitForChanges();
      expect(page.root).toEqualText('Description');
    });

    it('resets and updates relations when resource is changed', async () => {
      const page = await render(
        <pos-switch>
          <pos-case if-property="http://schema.org/video">
            <template>Video</template>
          </pos-case>
          <pos-case if-property="http://schema.org/recipe">
            <template>Recipe</template>
          </pos-case>
        </pos-switch>,
      );
      const { thing, observedRelations$ } = mockObservedResource('https://pod.example/has-recipe');
      page.instance.receiveResource(thing);
      observedRelations$.next([
        {
          label: 'recipe',
          predicate: 'http://schema.org/recipe',
          uris: ['https://recipe.test/#it'],
        },
      ]);
      await page.waitForChanges();
      expect(page.root).toEqualText('Recipe');
      // new thing
      const { thing: thing2, observedRelations$: observedRelations2$ } = mockObservedResource(
        'https://pod.example/has-video',
      );
      page.instance.receiveResource(thing2);
      await page.waitForChanges();
      expect(page.root).toEqualText('');
      observedRelations2$.next([
        {
          label: 'video',
          predicate: 'http://schema.org/video',
          uris: ['https://video.test/#it'],
        },
      ]);
      await page.waitForChanges();
      expect(page.root).toEqualText('Video');
    });

    it('resets and updates reverse relations when resource is changed', async () => {
      const page = await render(
        <pos-switch>
          <pos-case if-rev="http://schema.org/video">
            <template>Video</template>
          </pos-case>
          <pos-case if-rev="http://schema.org/recipe">
            <template>Recipe</template>
          </pos-case>
        </pos-switch>,
      );
      const { thing, observedReverseRelations$ } = mockObservedResource('https://recipe.test/#it');
      page.instance.receiveResource(thing);
      observedReverseRelations$.next([
        {
          label: 'recipe',
          predicate: 'http://schema.org/recipe',
          uris: ['https://something.test/has-recipe'],
        },
      ]);
      await page.waitForChanges();
      expect(page.root).toEqualText('Recipe');
      // new thing
      const { thing: thing2, observedReverseRelations$: observedReverseRelations2$ } = mockObservedResource(
        'https://pod.example/has-video',
      );
      page.instance.receiveResource(thing2);
      await page.waitForChanges();
      expect(page.root).toEqualText('');
      observedReverseRelations2$.next([
        {
          label: 'video',
          predicate: 'http://schema.org/video',
          uris: ['https://something.test/has-video'],
        },
      ]);
      await page.waitForChanges();
      expect(page.root).toEqualText('Video');
    });

    function mockObservedResource(uri: string) {
      // use BehaviorSubject here, since it has a starting value, which matches the original behaviour
      // of the observe* functions of Thing which use startWith(currentValue) to have an initial value
      const observedTypes$ = new BehaviorSubject<RdfType[]>([]);
      const observedLiterals$ = new BehaviorSubject<Literal[]>([]);
      const observedRelations$ = new BehaviorSubject<Relation[]>([]);
      const observedReverseRelations$ = new BehaviorSubject<Relation[]>([]);
      return {
        thing: {
          uri,
          observeTypes: () => observedTypes$,
          observeLiterals: () => observedLiterals$,
          observeRelations: () => observedRelations$,
          observeReverseRelations: () => observedReverseRelations$,
        } as unknown as Thing,
        observedTypes$,
        observedLiterals$,
        observedRelations$,
        observedReverseRelations$,
      };
    }
  });

  describe('if-else logic', () => {
    it('renders matching condition templates with if-else logic', async () => {
      const page = await render(
        <pos-switch>
          <pos-case if-typeof="http://schema.org/Video">
            <template>
              <div>Video 1</div>
            </template>
          </pos-case>
          <pos-case else if-typeof="http://schema.org/Recipe">
            <template>
              <div>Recipe 1</div>
            </template>
          </pos-case>
          <pos-case else if-typeof="http://schema.org/Recipe">
            <template>
              <div>Recipe 2</div>
            </template>
          </pos-case>
          <pos-case else>
            <template>
              <div>No matches</div>
            </template>
          </pos-case>
        </pos-switch>,
      );
      const observedTypes$ = new Subject<RdfType[]>();
      const thing = {
        observeTypes: () => observedTypes$,
      } as unknown as Thing;
      page.instance.receiveResource(thing);
      observedTypes$.next([
        {
          label: 'Recipe',
          uri: 'http://schema.org/Recipe',
        },
      ]);
      await page.waitForChanges();
      expect(page.root).toEqualText('Recipe 1');
    });

    it('renders final else condition if no other templates match', async () => {
      const page = await render(
        <pos-switch>
          <pos-case if-typeof="http://schema.org/Video">
            <template>
              <div>Video 1</div>
            </template>
          </pos-case>
          <pos-case else>
            <template>
              <div>No matches</div>
            </template>
          </pos-case>
        </pos-switch>,
      );
      const observedTypes$ = new Subject<RdfType[]>();
      const thing = {
        observeTypes: () => observedTypes$,
      } as unknown as Thing;
      page.instance.receiveResource(thing);
      observedTypes$.next([
        {
          label: 'Recipe',
          uri: 'http://schema.org/Recipe',
        },
      ]);
      await page.waitForChanges();
      expect(page.root).toEqualText('No matches');
    });

    it('renders only the else case if it is the only case', async () => {
      const page = await render(
        <pos-switch>
          <pos-case else>
            <template>
              <div>fallback</div>
            </template>
          </pos-case>
        </pos-switch>,
      );
      const thing = { uri: 'https://pod.example/resource' } as unknown as Thing;
      page.instance.receiveResource(thing);
      await page.waitForChanges();
      expect(page.root).toEqualText('fallback');
    });
  });
});
