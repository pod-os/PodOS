import { newSpecPage } from '@stencil/core/testing';
import { mockPodOS } from '../../test/mockPodOS';
import { PosApp } from '../pos-app/pos-app';
import { PosCase } from './pos-case/pos-case';
import { PosLabel } from '../pos-label/pos-label';
import { PosPicture } from '../pos-picture/pos-picture';
import { PosSwitch } from './pos-switch';
import { PosResource } from '../pos-resource/pos-resource';
import { when } from 'jest-when';
import { RdfType, Relation, Thing } from '@pod-os/core';
import { Subject } from 'rxjs';

describe('pos-switch', () => {
  it('renders template based on properties of resource, reactively', async () => {
    const os = mockPodOS();
    const observedTypes$ = new Subject<RdfType[]>();
    const observedRelations$ = new Subject<Relation[]>();
    const observedReverseRelations$ = new Subject<Relation[]>();
    when(os.store.get)
      .calledWith('https://resource.test')
      .mockReturnValue({
        uri: 'https://resource.test',
        label: () => 'Recipe 1',
        observeTypes: () => observedTypes$,
        observeRelations: () => observedRelations$,
        observeReverseRelations: () => observedReverseRelations$,
        picture: () => ({
          url: 'https://resource.test/recipe-photo.jpg',
        }),
      } as unknown as Thing);
    const page = await newSpecPage({
      components: [PosApp, PosCase, PosLabel, PosPicture, PosSwitch, PosResource],
      supportsShadowDom: false,
      html: `
      <pos-app>
        <pos-resource uri="https://resource.test" lazy="">
          <pos-switch>
           <pos-case if-typeof="http://schema.org/Video">
              <template>Will not render as resource is a recipe</template>
            </pos-case>
            <pos-case if-rev="http://schema.org/itemListElement">
              <template>
                <div>Part of list</div>
              </template>
            </pos-case>
            <pos-case if-typeof="http://schema.org/Recipe">
              <template><pos-label /></template>
            </pos-case>
            <pos-case else if-typeof="http://schema.org/Recipe">
              <template>Will not render as else is specified</template>
            <pos-case if-property="http://schema.org/image">
              <template><pos-picture /></template>
            </pos-case>
            <pos-case if-typeof="http://schema.org/Thing">
              <template><div>Also a Thing</div></template>
            </pos-case>
            <pos-case else>
              <template>Will not render as previous conditions are satisfied</template>
            </pos-case>
          </pos-switch>
        </pos-resource>
      </pos-app>`,
    });
    expect((os.fetch as jest.Mock).mock.calls).toHaveLength(0);
    expect(page.root?.innerText).toEqualText('');
    observedTypes$.next([
      {
        label: 'Recipe',
        uri: 'http://schema.org/Recipe',
      },
    ]);
    observedRelations$.next([
      {
        predicate: 'http://schema.org/image',
        label: 'image',
        uris: ['https://resource.test/recipe-photo.jpg'],
      },
    ]);
    observedReverseRelations$.next([]);
    await page.waitForChanges();
    const switchElement = page.root?.querySelector('pos-switch');
    expect(switchElement?.innerHTML).toEqualHtml(`
      <pos-label>
        <!---->
        Recipe 1
      </pos-label>
      <pos-picture>
        <!---->
        <pos-image src="https://resource.test/recipe-photo.jpg" alt="Recipe 1"></pos-image>
      </pos-picture>
      `);
    observedTypes$.next([
      {
        label: 'Recipe',
        uri: 'http://schema.org/Recipe',
      },
      {
        label: 'Thing',
        uri: 'http://schema.org/Thing',
      },
    ]);
    observedReverseRelations$.next([
      {
        predicate: 'http://schema.org/itemListElement',
        label: 'itemListElement',
        uris: ['https://pod.example/recipe-list'],
      },
    ]);
    await page.waitForChanges();
    expect(switchElement?.innerHTML).toEqualHtml(`
      <div>Part of list</div>
      <pos-label>
        <!---->
        Recipe 1
      </pos-label>
      <pos-picture>
        <!---->
        <pos-image src="https://resource.test/recipe-photo.jpg" alt="Recipe 1"></pos-image>
      </pos-picture>
      <div>Also a Thing</div>
      `);
  });
});
