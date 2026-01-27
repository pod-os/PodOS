import { newSpecPage } from '@stencil/core/testing';
import { mockPodOS } from '../../test/mockPodOS';
import { PosApp } from '../pos-app/pos-app';
import { PosCase } from './pos-case/pos-case';
import { PosLabel } from '../pos-label/pos-label';
import { PosSwitch } from './pos-switch';
import { PosResource } from '../pos-resource/pos-resource';
import { when } from 'jest-when';
import { Thing } from '@pod-os/core';

describe('pos-switch', () => {
  it('renders template based on properties of resource', async () => {
    const os = mockPodOS();
    when(os.store.get)
      .calledWith('https://resource.test')
      .mockReturnValue({
        uri: 'https://resource.test',
        label: () => 'Recipe 1',
        types: () => [
          {
            label: 'Recipe',
            uri: 'http://schema.org/Recipe',
          },
        ],
      } as unknown as Thing);
    const page = await newSpecPage({
      components: [PosApp, PosCase, PosLabel, PosSwitch, PosResource],
      supportsShadowDom: false,
      html: `
      <pos-app>
        <pos-resource uri="https://resource.test" lazy="">
          <pos-switch>
            <pos-case if-typeof="http://schema.org/Video">
              <template>Will not render as resource is a recipe</template>
            </pos-case>
            <pos-case if-typeof="http://schema.org/Recipe">
              <template><pos-label /></template>
            </pos-case>
            <pos-case else if-typeof="http://schema.org/Recipe">
              <template>Will not render as else is specified</template>
            </pos-case>
            <pos-case else if-typeof="http://schema.org/Recipe">
              <template>Will not render as previous conditions are satisfied</template>
            </pos-case>
          </pos-switch>
        </pos-resource>
      </pos-app>`,
    });
    expect((os.fetch as jest.Mock).mock.calls).toHaveLength(0);
    expect(page.root?.innerText).toEqualText('Recipe 1');
  });
});
