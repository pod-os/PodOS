import { newSpecPage } from '@stencil/core/testing';
import { PosSwitch } from './pos-switch';
import { Literal, RdfType, Relation, Thing } from '@pod-os/core';
import { Subject } from 'rxjs';

describe('pos-switch', () => {
  describe('evaluation of caseElement conditions with test method ', () => {
    /*
     Dimensions:
       - Predicate tested: if-typeof | if-property | if-rev
       - Condition: present, (some|every)-(eq|lt|lte|gt|gte)
         - Modifier: negation
       - Values: relation (URI), string literal, numeric literal
       - Data state: single value present, no value present, multiple values present
       - Evaluation state: matched, not matched
    */
    describe('if-typeof', () => {
      /*
       12 theoretical combinations:

       - Condition: present, not present
       - Data state: single value present, no value present, multiple values present
       - Evaluation state: matched, not matched

       10 possible after removing:
       - Present - no value - matched
       - Not present - no value - not matched
       */
      const RecipeType = {
        label: 'Recipe',
        uri: 'http://schema.org/Recipe',
      };
      const VideoType = {
        label: 'Video',
        uri: 'http://schema.org/Video',
      };
      const EventType = {
        label: 'Event',
        uri: 'http://schema.org/Event',
      };
      it.each([
        // Present
        // Single value
        {
          conditions: 'if-typeof="http://schema.org/Recipe"',
          observedTypes: [RecipeType],
          expectedResult: 'matched',
        },
        {
          conditions: 'if-typeof="http://schema.org/Recipe"',
          observedTypes: [VideoType],
          expectedResult: 'not matched',
        },
        // No value
        // Matched case does not exist
        {
          conditions: 'if-typeof="http://schema.org/Recipe"',
          observedTypes: [],
          expectedResult: 'not matched',
        },
        // Multiple values
        {
          conditions: 'if-typeof="http://schema.org/Recipe"',
          observedTypes: [RecipeType, VideoType],
          expectedResult: 'matched',
        },
        {
          conditions: 'if-typeof="http://schema.org/Recipe"',
          observedTypes: [VideoType, EventType],
          expectedResult: 'not matched',
        },
        // Not present
        // Single value
        {
          conditions: 'not if-typeof="http://schema.org/Recipe"',
          observedTypes: [VideoType],
          expectedResult: 'matched',
        },
        {
          conditions: 'not if-typeof="http://schema.org/Recipe"',
          observedTypes: [RecipeType],
          expectedResult: 'not matched',
        },
        // No value
        // Not matched case does not exist
        {
          conditions: 'not if-typeof="http://schema.org/Recipe"',
          observedTypes: [],
          expectedResult: 'matched',
        },
        // Multiple values
        {
          conditions: 'not if-typeof="http://schema.org/Recipe"',
          observedTypes: [VideoType, EventType],
          expectedResult: 'matched',
        },
        {
          conditions: 'not if-typeof="http://schema.org/Recipe"',
          observedTypes: [RecipeType, VideoType],
          expectedResult: 'not matched',
        },
      ])(
        `renders templates if condition is met: $conditions `,
        async ({ conditions, observedTypes, expectedResult }) => {
          const page = await newSpecPage({
            components: [PosSwitch],
            html: `
      <pos-switch>
        <pos-case ${conditions}>
          <template>
            <div>Condition is matched</div>
          </template>
        </pos-case>
        <pos-case else>
          <template>
            <div>Condition is not matched</div>
          </template>
        </pos-case>
      </pos-switch>`,
          });
          const observedTypes$ = new Subject<RdfType[]>();
          const thing = {
            uri: 'https://pod.example/resource',
            observeTypes: () => observedTypes$,
          };
          page.rootInstance.receiveResource(thing);
          observedTypes$.next(observedTypes);
          await page.waitForChanges();
          expect(page.root?.innerHTML).toEqualHtml(`
        <div>Condition is ${expectedResult}</div>
        `);
        },
      );
    });

    describe('if-property presence/absence', () => {
      /*
      24 theoretical combinations:

      - Condition: present, not present
      - Data state: single value present, no value present, multiple values present
      - Values: relation, literal
      - Evaluation state: matched, not matched

      20 possible after removing:

      - present - no value - relation - matched
      - present - no value - literal - matched
      - not present - no value - relation - not matched
      - not present - no value - literal - not matched
    */
      const LinkedVideo = {
        predicate: 'https://schema.org/video',
        label: 'video',
        uris: ['https://video.test/video-1'],
      };
      const LinkedRecipe = {
        predicate: 'https://schema.org/recipe',
        label: 'recipe',
        uris: ['https://recipe.test/recipe-1'],
      };
      const LinkedEvent = {
        predicate: 'https://schema.org/event',
        label: 'event',
        uris: ['https://event.test/event-1'],
      };
      const VideoName = { predicate: 'https://schema.org/name', label: 'name', values: ['the-name'] };
      const VideoAlternateName = {
        predicate: 'https://schema.org/alternateName',
        label: 'alternate name',
        values: ['alt-name'],
      };
      const VideoDescription = {
        predicate: 'https://schema.org/description',
        label: 'description',
        values: ['the-description'],
      };
      it.each([
        // Present
        // Single value
        // Relation
        {
          conditions: 'if-property="https://schema.org/video"',
          observedLiterals: [],
          observedRelations: [LinkedVideo],
          expectedResult: 'matched',
        },
        {
          conditions: 'if-property="https://schema.org/video"',
          observedLiterals: [],
          observedRelations: [LinkedRecipe],
          expectedResult: 'not matched',
        },
        // Literal
        {
          conditions: 'if-property="https://schema.org/name"',
          observedLiterals: [VideoName],
          observedRelations: [],
          expectedResult: 'matched',
        },
        {
          conditions: 'if-property="https://schema.org/name"',
          observedLiterals: [VideoDescription],
          observedRelations: [],
          expectedResult: 'not matched',
        },
        // No value
        // Relation
        // Matched not possible
        {
          conditions: 'if-property="https://schema.org/video"',
          observedLiterals: [],
          observedRelations: [],
          expectedResult: 'not matched',
        },
        // Literal
        // Matched not possible
        {
          conditions: 'if-property="https://schema.org/name"',
          observedLiterals: [],
          observedRelations: [],
          expectedResult: 'not matched',
        },
        // Multiple values
        // Relation
        {
          conditions: 'if-property="https://schema.org/video"',
          observedLiterals: [],
          observedRelations: [LinkedVideo, LinkedRecipe],
          expectedResult: 'matched',
        },
        {
          conditions: 'if-property="https://schema.org/video"',
          observedLiterals: [],
          observedRelations: [LinkedRecipe, LinkedEvent],
          expectedResult: 'not matched',
        },
        // Literal
        {
          conditions: 'if-property="https://schema.org/name"',
          observedLiterals: [VideoName, VideoDescription],
          observedRelations: [],
          expectedResult: 'matched',
        },
        {
          conditions: 'if-property="https://schema.org/name"',
          observedLiterals: [VideoDescription, VideoAlternateName],
          observedRelations: [],
          expectedResult: 'not matched',
        },
        // Not present
        // Single value
        // Relation
        {
          conditions: 'not if-property="https://schema.org/video"',
          observedLiterals: [],
          observedRelations: [LinkedRecipe],
          expectedResult: 'matched',
        },
        {
          conditions: 'not if-property="https://schema.org/video"',
          observedLiterals: [],
          observedRelations: [LinkedVideo],
          expectedResult: 'not matched',
        },
        // Literal
        {
          conditions: 'not if-property="https://schema.org/name"',
          observedLiterals: [VideoDescription],
          observedRelations: [],
          expectedResult: 'matched',
        },
        {
          conditions: 'not if-property="https://schema.org/name"',
          observedLiterals: [VideoName],
          observedRelations: [],
          expectedResult: 'not matched',
        },
        // No value
        // Relation
        // Not matched not possible
        {
          conditions: 'not if-property="https://schema.org/video"',
          observedLiterals: [],
          observedRelations: [],
          expectedResult: 'matched',
        },
        // Literal
        // Not matched not possible
        {
          conditions: 'not if-property="https://schema.org/name"',
          observedLiterals: [],
          observedRelations: [],
          expectedResult: 'matched',
        },
        // Multiple values
        // Relation
        {
          conditions: 'not if-property="https://schema.org/video"',
          observedLiterals: [],
          observedRelations: [LinkedRecipe, LinkedEvent],
          expectedResult: 'matched',
        },
        {
          conditions: 'not if-property="https://schema.org/video"',
          observedLiterals: [],
          observedRelations: [LinkedVideo, LinkedEvent],
          expectedResult: 'not matched',
        },
        // Literal
        {
          conditions: 'not if-property="https://schema.org/name"',
          observedLiterals: [VideoDescription, VideoAlternateName],
          observedRelations: [],
          expectedResult: 'matched',
        },
        {
          conditions: 'not if-property="https://schema.org/name"',
          observedLiterals: [VideoName, VideoDescription],
          observedRelations: [],
          expectedResult: 'not matched',
        },
      ])(
        `renders templates if condition is met: $conditions `,
        async ({ conditions, observedLiterals, observedRelations, expectedResult }) => {
          const page = await newSpecPage({
            components: [PosSwitch],
            html: `
      <pos-switch>
        <pos-case ${conditions}>
          <template>
            <div>Condition is matched</div>
          </template>
        </pos-case>
        <pos-case else>
          <template>
            <div>Condition is not matched</div>
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
          observedLiterals$.next(observedLiterals);
          observedRelations$.next(observedRelations);
          await page.waitForChanges();
          expect(page.root?.innerHTML).toEqualHtml(`
        <div>Condition is ${expectedResult}</div>
        `);
        },
      );
    });

    describe('if-rev presence/absence', () => {
      /*
      12 theoretical combinations:

      - Condition: present, not present
      - Data state: single value present, no value present, multiple values present
      - Evaluation state: matched, not matched

      10 possible after removing:

      - Present - no value - matched
      - Not present - no value - not matched
      */
      const VideoLink = {
        predicate: 'https://schema.org/video',
        label: 'video',
        uris: ['https://video.test/resource'],
      };
      const RecipeLink = {
        predicate: 'https://schema.org/recipe',
        label: 'recipe',
        uris: ['https://recipe.test/resource'],
      };
      const EventLink = {
        predicate: 'https://schema.org/event',
        label: 'event',
        uris: ['https://recipe.test/resource'],
      };
      it.each([
        // Present
        // Single value
        {
          conditions: 'if-rev="https://schema.org/video"',
          observedReverseRelations: [VideoLink],
          expectedResult: 'matched',
        },
        {
          conditions: 'if-rev="https://schema.org/video"',
          observedReverseRelations: [RecipeLink],
          expectedResult: 'not matched',
        },
        // No value
        // Matched not possible
        {
          conditions: 'if-rev="https://schema.org/video"',
          observedReverseRelations: [],
          expectedResult: 'not matched',
        },
        // Multiple values
        {
          conditions: 'if-rev="https://schema.org/video"',
          observedReverseRelations: [VideoLink, RecipeLink],
          expectedResult: 'matched',
        },
        {
          conditions: 'if-rev="https://schema.org/video"',
          observedReverseRelations: [RecipeLink, EventLink],
          expectedResult: 'not matched',
        },
        // Not present
        // Single value
        {
          conditions: 'not if-rev="https://schema.org/video"',
          observedReverseRelations: [RecipeLink],
          expectedResult: 'matched',
        },
        {
          conditions: 'not if-rev="https://schema.org/video"',
          observedReverseRelations: [VideoLink],
          expectedResult: 'not matched',
        },
        // No value
        // Not matched not possible
        {
          conditions: 'not if-rev="https://schema.org/video"',
          observedReverseRelations: [],
          expectedResult: 'matched',
        },
        // Multiple values
        {
          conditions: 'not if-rev="https://schema.org/video"',
          observedReverseRelations: [EventLink, RecipeLink],
          expectedResult: 'matched',
        },
        {
          conditions: 'not if-rev="https://schema.org/video"',
          observedReverseRelations: [VideoLink, EventLink],
          expectedResult: 'not matched',
        },
      ])(
        `renders templates if condition is met: $conditions `,
        async ({ conditions, observedReverseRelations, expectedResult }) => {
          const page = await newSpecPage({
            components: [PosSwitch],
            html: `
      <pos-switch>
        <pos-case ${conditions}>
          <template>
            <div>Condition is matched</div>
          </template>
        </pos-case>
        <pos-case else>
          <template>
            <div>Condition is not matched</div>
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
          observedReverseRelations$.next(observedReverseRelations);
          await page.waitForChanges();
          expect(page.root?.innerHTML).toEqualHtml(`
        <div>Condition is ${expectedResult}</div>
        `);
        },
      );
    });

    describe('evaluating values of property and rev (single relations)', () => {
      /*
        80 possible combinations:
        
        - Predicates: if-property, if-rev
        - Condition: (some|every)-(eq|lt|lte|gt|gte)
        - Modifier: negation
        - Evaluation state: matched, not matched

        We test three resource values (120 combinations) matching eq, lt, or gt
        There is no difference between some and every with a single relation.
        */
      let testCases = [];
      for (let direction of ['if-property', 'if-rev']) {
        for (let semantics of ['some', 'every']) {
          for (let operator of ['eq', 'gt', 'gte', 'lt', 'lte']) {
            for (let negation of [true, false]) {
              for (let resource of [
                'https://resource.test/resource-1',
                'https://resource.test/resource-2',
                'https://resource.test/resource-3',
              ]) {
                const cmp = resource.localeCompare('https://resource.test/resource-2');
                let matches;
                switch (operator) {
                  case 'eq':
                    matches = cmp === 0;
                    break;
                  case 'gt':
                    matches = cmp > 0;
                    break;
                  case 'gte':
                    matches = cmp >= 0;
                    break;
                  case 'lt':
                    matches = cmp < 0;
                    break;
                  case 'lte':
                    matches = cmp <= 0;
                    break;
                }
                matches = negation ? !matches : matches;
                const result = matches ? 'matched' : 'not matched';
                const not = negation ? 'not' : '';
                testCases.push({
                  direction: direction,
                  conditions: `${direction}="https://schema.org/video" ${not} ${semantics}-value-${operator}="https://resource.test/resource-2"`,
                  resource: resource,
                  expectedResult: result,
                });
              }
            }
          }
        }
      }
      expect(testCases.filter(testCase => testCase.expectedResult == 'matched').length).toEqual(60);
      expect(testCases.filter(testCase => testCase.expectedResult == 'not matched').length).toEqual(60);

      it.each(testCases)(
        `renders templates if condition is met: $conditions for $resource `,
        async ({ direction, conditions, resource, expectedResult }) => {
          const page = await newSpecPage({
            components: [PosSwitch],
            html: `
      <pos-switch>
        <pos-case ${conditions}>
          <template>
            <div>Condition is matched</div>
          </template>
        </pos-case>
        <pos-case else>
          <template>
            <div>Condition is not matched</div>
          </template>
        </pos-case>
      </pos-switch>`,
          });
          const observedRelations$ = new Subject<Relation[]>();
          const observedLiterals$ = new Subject<Literal[]>();
          const observedReverseRelations$ = new Subject<Relation[]>();
          const thing = {
            uri: 'https://pod.example/resource',
            observeRelations: () => observedRelations$,
            observeLiterals: () => observedLiterals$,
            observeReverseRelations: () => observedReverseRelations$,
          };
          const relations = [
            {
              predicate: 'https://schema.org/video',
              label: 'video',
              uris: [resource],
            },
          ];
          page.rootInstance.receiveResource(thing);
          observedLiterals$.next([]);
          if (direction == 'if-property') {
            observedRelations$.next(relations);
            observedReverseRelations$.next([]);
          } else {
            observedRelations$.next([]);
            observedReverseRelations$.next(relations);
          }
          await page.waitForChanges();
          expect(page.root?.innerHTML).toEqualHtml(`
        <div>Condition is ${expectedResult}</div>
        `);
        },
      );
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

    it.each([
      // literal + some-value-eq
      {
        conditions: 'if-property="https://schema.org/name" some-value-eq="the-name"',
        observedLiterals: [
          { predicate: 'https://schema.org/name', label: 'video', values: ['the-name', 'another-name'] },
        ],
        observedRelations: [],
        expectedResult: 'matched',
      },
      {
        conditions: 'if-property="https://schema.org/name" some-value-eq="the-name"',
        observedLiterals: [{ predicate: 'https://schema.org/name', label: 'video', values: ['the-name'] }],
        observedRelations: [],
        expectedResult: 'matched',
      },
      {
        conditions: 'not if-property="https://schema.org/name" some-value-eq="the-name"',
        observedLiterals: [
          { predicate: 'https://schema.org/name', label: 'video', values: ['the-name', 'another-name'] },
        ],
        observedRelations: [],
        expectedResult: 'not matched',
      },
      {
        conditions: 'not if-property="https://schema.org/name" some-value-eq="different-name"',
        observedLiterals: [
          { predicate: 'https://schema.org/name', label: 'video', values: ['the-name', 'another-name'] },
        ],
        observedRelations: [],
        expectedResult: 'matched',
      },
      // literal + every-value-eq
      {
        conditions: 'if-property="https://schema.org/name" every-value-eq="the-name"',
        observedLiterals: [
          { predicate: 'https://schema.org/name', label: 'video', values: ['the-name', 'another-name'] },
        ],
        observedRelations: [],
        expectedResult: 'not matched',
      },
      {
        conditions: 'if-property="https://schema.org/name" every-value-eq="the-name"',
        observedLiterals: [{ predicate: 'https://schema.org/name', label: 'video', values: ['the-name'] }],
        observedRelations: [],
        expectedResult: 'matched',
      },
      {
        conditions: 'not if-property="https://schema.org/name" every-value-eq="the-name"',
        observedLiterals: [
          { predicate: 'https://schema.org/name', label: 'video', values: ['the-name', 'another-name'] },
        ],
        observedRelations: [],
        expectedResult: 'matched',
      },
      // relation + some-value-eq
      {
        conditions: 'if-property="https://schema.org/video" some-value-eq="https://video.test/video-1"',
        observedLiterals: [],
        observedRelations: [
          {
            predicate: 'https://schema.org/video',
            label: 'video',
            uris: ['https://video.test/video-1', 'https://video.test/video-2'],
          },
        ],
        expectedResult: 'matched',
      },
      {
        conditions: 'not if-property="https://schema.org/video" some-value-eq="https://video.test/video-1"',
        observedLiterals: [],
        observedRelations: [
          {
            predicate: 'https://schema.org/video',
            label: 'video',
            uris: ['https://video.test/video-1', 'https://video.test/video-2'],
          },
        ],
        expectedResult: 'not matched',
      },
    ])(
      `renders templates if condition is met: $conditions `,
      async ({ conditions, observedLiterals, observedRelations, expectedResult }) => {
        const page = await newSpecPage({
          components: [PosSwitch],
          html: `
      <pos-switch>
        <pos-case ${conditions}>
          <template>
            <div>Condition is matched</div>
          </template>
        </pos-case>
        <pos-case else>
          <template>
            <div>Condition is not matched</div>
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
        observedLiterals$.next(observedLiterals);
        observedRelations$.next(observedRelations);
        await page.waitForChanges();
        expect(page.root?.innerHTML).toEqualHtml(`
        <div>Condition is ${expectedResult}</div>
        `);
      },
    );
  });
});
