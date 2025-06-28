import { newSpecPage } from '@stencil/core/testing';
import { mockPodOS } from '../../test/mockPodOS';
import { PosApp } from '../pos-app/pos-app';
import { PosLabel } from '../pos-label/pos-label';
import { PosList } from './pos-list';
import { PosResource } from '../pos-resource/pos-resource';
import { when } from 'jest-when';

describe('pos-list', () => {
  it('fetches resources if fetch attribute is present', async () => {
    const os = mockPodOS();
    when(os.store.get)
      .calledWith('https://resource.test')
      .mockReturnValue({
        relations: () => [
          {
            predicate: 'http://schema.org/video',
            uris: ['https://video.test/video-1', 'https://video.test/video-2'],
          },
        ],
      });
    await newSpecPage({
      components: [PosApp, PosLabel, PosList, PosResource],
      supportsShadowDom: false,
      html: `
      <pos-app>
        <pos-resource uri="https://resource.test" lazy="">
          <pos-list rel="http://schema.org/video" fetch>
            <template>
              <pos-label />
            </template>
          </pos-list>
        </pos-resource>
      </pos-app>`,
    });

    expect(os.fetch.mock.calls).toHaveLength(2);
    expect(os.fetch.mock.calls).toEqual([['https://video.test/video-1'], ['https://video.test/video-2']]);
  });
});
