import { describe, expect, h, it, render } from '@stencil/vitest';

import './pos-switch';
import './pos-case/pos-case';
import { Subject } from 'rxjs';
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
      expect(page.root).toMatchInlineSnapshot(`<pos-switch innerhtml class="hydrated"></pos-switch>`);
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
        expect(page.root.innerHTML).toEqualHtml(`
        <div>Recipe 1</div>
        <div>Recipe 2</div>`);
      });

      it('resets and updates when resource is changed', async () => {
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
        const observedTypes$ = new Subject<RdfType[]>();
        const thing = {
          uri: 'https://pod.example/recipe1',
          observeTypes: () => observedTypes$,
        };
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
        const observedTypes2$ = new Subject<RdfType[]>();
        const thing2 = {
          uri: 'https://pod.example/video1',
          observeTypes: () => observedTypes2$,
        };
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
      expect(page.root?.innerHTML).toEqualHtml(`
        <div>Recipe.</div>
        <div>Image.</div>
        <div>Recipe list.</div>
        `);
    });
  });
});
