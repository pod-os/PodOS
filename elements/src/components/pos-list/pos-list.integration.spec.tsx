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
    expect(page.root?.querySelectorAll('pos-list pos-resource')).toHaveLength(2);
    const label1 = page.root?.querySelectorAll('pos-list pos-resource')[0] as unknown as PosResource;
    expect(label1).toEqualHtml(`
      <pos-resource about="https://video.test/video-1">
        <pos-label>
          Video 1
        </pos-label>
      </pos-resource>
`);
    //Tested separately because pos-resource does not reflect the uri property as an attribute
    expect(label1?.uri).toEqual('https://video.test/video-1');

    const label2 = page.root?.querySelectorAll('pos-list pos-resource')[1] as unknown as PosResource;
    expect(label2).toEqualHtml(`
      <pos-resource about="https://video.test/video-2">
        <pos-label>
          Video 2
        </pos-label>
      </pos-resource>
`);
    expect(label2?.uri).toEqual('https://video.test/video-2');
  });

  it('does not fetch resources by default (if fetch attribute is not present)', async () => {
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
      .mockReturnValue({ uri: 'https://video.test/video-1', label: () => 'video-1' });
    when(os.store.get)
      .calledWith('https://video.test/video-2')
      .mockReturnValue({ uri: 'https://video.test/video-2', label: () => 'video-2' });
    const page = await newSpecPage({
      components: [PosApp, PosLabel, PosList, PosResource],
      supportsShadowDom: false,
      html: `
      <pos-app>
        <pos-resource uri="https://resource.test" lazy="">
          <pos-list rel="http://schema.org/video">
            <template>
              <pos-label />
            </template>
          </pos-list>
        </pos-resource>
      </pos-app>`,
    });

    expect(os.fetch.mock.calls).toHaveLength(0);
  });

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
