import { newSpecPage } from '@stencil/core/testing';
import { mockPodOS } from '../../test/mockPodOS';
import { PosApp } from '../pos-app/pos-app';
import { PosLabel } from '../pos-label/pos-label';
import { PosList } from './pos-list';
import { PosResource } from '../pos-resource/pos-resource';
import { when } from 'jest-when';

describe('pos-list', () => {
  it('children render label for loaded resources', async () => {
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
    when(os.store.get)
      .calledWith('https://video.test/video-1')
      .mockReturnValue({ uri: 'https://video.test/video-1', label: () => 'Video 1' });
    when(os.store.get)
      .calledWith('https://video.test/video-2')
      .mockReturnValue({ uri: 'https://video.test/video-2', label: () => 'Video 2' });
    const page = await newSpecPage({
      components: [PosApp, PosLabel, PosList, PosResource],
      supportsShadowDom: false,
      html: `
      <pos-app>
        <pos-resource uri="https://resource.test">
          <pos-list rel="http://schema.org/video">
            <template>
              <pos-label />
            </template>
          </pos-list>
        </pos-resource>
      </pos-app>`,
    });
    expect(page.root?.querySelectorAll('pos-label')).toHaveLength(2);
    const label1 = page.root?.querySelectorAll('pos-label')[0];
    expect(label1).toEqualHtml(`
      <pos-label about="https://video.test/video-1">
        Video 1
      </pos-label>
`);
    const label2 = page.root?.querySelectorAll('pos-label')[1];
    expect(label2).toEqualHtml(`
    <pos-label about="https://video.test/video-2">
      Video 2
    </pos-label>
`);
  });
});
