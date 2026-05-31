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
       - Data state: single value present, no value present, other value present, multiple values present
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

    it.each([
      // literal + some-value-eq
      {
        conditions: 'if-property="https://schema.org/name" some-value-eq="the-name"',
        observedLiterals: [
          { predicate: 'https://schema.org/name', label: 'video', values: ['the-name', 'another-name'] },
        ],
        observedRelations: [],
        observedReverseRelations: [],
        expectedResult: 'matched',
      },
      {
        conditions: 'if-property="https://schema.org/name" some-value-eq="the-name"',
        observedLiterals: [{ predicate: 'https://schema.org/name', label: 'video', values: ['the-name'] }],
        observedRelations: [],
        observedReverseRelations: [],
        expectedResult: 'matched',
      },
      {
        conditions: 'not if-property="https://schema.org/name" some-value-eq="the-name"',
        observedLiterals: [
          { predicate: 'https://schema.org/name', label: 'video', values: ['the-name', 'another-name'] },
        ],
        observedRelations: [],
        observedReverseRelations: [],
        expectedResult: 'not matched',
      },
      {
        conditions: 'not if-property="https://schema.org/name" some-value-eq="different-name"',
        observedLiterals: [
          { predicate: 'https://schema.org/name', label: 'video', values: ['the-name', 'another-name'] },
        ],
        observedRelations: [],
        observedReverseRelations: [],
        expectedResult: 'matched',
      },
      // literal + every-value-eq
      {
        conditions: 'if-property="https://schema.org/name" every-value-eq="the-name"',
        observedLiterals: [
          { predicate: 'https://schema.org/name', label: 'video', values: ['the-name', 'another-name'] },
        ],
        observedRelations: [],
        observedReverseRelations: [],
        expectedResult: 'not matched',
      },
      {
        conditions: 'if-property="https://schema.org/name" every-value-eq="the-name"',
        observedLiterals: [{ predicate: 'https://schema.org/name', label: 'video', values: ['the-name'] }],
        observedRelations: [],
        observedReverseRelations: [],
        expectedResult: 'matched',
      },
      {
        conditions: 'not if-property="https://schema.org/name" every-value-eq="the-name"',
        observedLiterals: [
          { predicate: 'https://schema.org/name', label: 'video', values: ['the-name', 'another-name'] },
        ],
        observedRelations: [],
        observedReverseRelations: [],
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
        observedReverseRelations: [],
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
        observedReverseRelations: [],
        expectedResult: 'not matched',
      },
    ])(
      `renders templates if condition is met: $conditions `,
      async ({ conditions, observedLiterals, observedRelations, observedReverseRelations, expectedResult }) => {
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
          observedReverseRelations: () => observedLiterals$,
        };
        page.rootInstance.receiveResource(thing);
        observedLiterals$.next(observedLiterals);
        observedRelations$.next(observedRelations);
        observedReverseRelations$.next(observedReverseRelations);
        await page.waitForChanges();
        expect(page.root?.innerHTML).toEqualHtml(`
        <div>Condition is ${expectedResult}</div>
        `);
      },
    );
  });
});
