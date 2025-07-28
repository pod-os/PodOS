import { newSpecPage } from '@stencil/core/testing';
import { mockPodOS } from '../../test/mockPodOS';
import { PosApp } from '../pos-app/pos-app';
import { PosDescription } from '../pos-description/pos-description';
import { PosLabel } from '../pos-label/pos-label';
import { PosResource } from '../pos-resource/pos-resource';
import { PosRichLink } from './pos-rich-link';
import { when } from 'jest-when';

describe('pos-rich-link', () => {
  let os;
  beforeEach(async () => {
    os = mockPodOS();
    when(os.store.get)
      .calledWith('https://resource.test')
      .mockReturnValue({
        uri: 'https://resource.test',
        label: () => 'Test label',
        description: () => 'Test description',
        relations: () => [{ predicate: 'https://schema.org/video', uris: ['https://video.test/video-1'] }],
      });
    when(os.store.get)
      .calledWith('https://video.test/video-1')
      .mockReturnValue({
        uri: 'https://video.test/video-1',
        label: () => 'Video 1',
        description: () => 'Description of Video 1',
        reverseRelations: () => [{ predicate: 'https://schema.org/video', uris: ['https://resource.test'] }],
      });
  });

  it('can be used outside resource', async () => {
    const page = await newSpecPage({
      components: [PosApp, PosDescription, PosLabel, PosResource, PosRichLink],
      supportsShadowDom: false,
      html: `
      <pos-app>
          <pos-rich-link uri="https://resource.test" />
      </pos-app>`,
    });

    const link = page.root?.querySelector('pos-rich-link');
    expect(link).toEqualHtml(`
      <pos-rich-link uri="https://resource.test">
          <pos-resource>
              <p class="content">
                <a href="https://resource.test">
                  <pos-label>
                    Test label
                  </pos-label>
                </a>
                <span class="url">resource.test</span>
                <pos-description>
                  Test description
                </pos-description>
              </p>
          </pos-resource>
      </pos-rich-link>
  `);
  });

  it('receives and renders resource', async () => {
    const page = await newSpecPage({
      components: [PosApp, PosDescription, PosLabel, PosResource, PosRichLink],
      supportsShadowDom: false,
      html: `
      <pos-app>
        <pos-resource uri="https://resource.test" lazy="">
          <pos-rich-link/>
        </pos-resource>
      </pos-app>`,
    });

    expect(os.store.get.mock.calls).toHaveLength(1);

    const link = page.root?.querySelector('pos-rich-link');
    expect(link).toEqualHtml(`
      <pos-rich-link>
          <p class="content">
            <a href="https://resource.test">
              <pos-label>
                Test label
              </pos-label>
            </a>
            <span class="url">resource.test</span>
            <pos-description>
              Test description
            </pos-description>
          </p>
      </pos-rich-link>
  `);
  });

  it('uses label and description of the matching rel', async () => {
    const page = await newSpecPage({
      components: [PosApp, PosDescription, PosLabel, PosResource, PosRichLink],
      supportsShadowDom: false,
      html: `
      <pos-app>
        <pos-resource uri="https://resource.test" lazy="">
          <pos-rich-link rel='https://schema.org/video' />
        </pos-resource>
      </pos-app>`,
    });

    const link = page.root?.querySelector('pos-rich-link');
    expect(link).toEqualHtml(`
      <pos-rich-link rel='https://schema.org/video'>
        <pos-resource>
          <p class="content">
            <a href="https://video.test/video-1">
              <pos-label>
                Video 1
              </pos-label>
            </a>
            <span class="url">video.test</span>
            <pos-description>
              Description of Video 1
            </pos-description>
          </p>
        </pos-resource>
      </pos-rich-link>
  `);
  });

  it('uses label and description of the matching rev', async () => {
    const page = await newSpecPage({
      components: [PosApp, PosDescription, PosLabel, PosResource, PosRichLink],
      supportsShadowDom: false,
      html: `
      <pos-app>
        <pos-resource uri="https://video.test/video-1" lazy="">
          <pos-rich-link rev='https://schema.org/video' />
        </pos-resource>
      </pos-app>`,
    });

    const link = page.root?.querySelector('pos-rich-link');
    expect(link).toEqualHtml(`
      <pos-rich-link rev='https://schema.org/video'>
        <pos-resource>
          <p class="content">
            <a href="https://resource.test">
              <pos-label>
                Test label
              </pos-label>
            </a>
            <span class="url">resource.test</span>
            <pos-description>
              Test description
            </pos-description>
          </p>
        </pos-resource>
      </pos-rich-link>
  `);
  });
});
