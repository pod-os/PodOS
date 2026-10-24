import { newSpecPage } from '@stencil/core/testing';
import { mockPodOS } from '../../test/mockPodOS';
import { PosHtmlTool } from './pos-html-tool';
import { PosApp } from '../pos-app/pos-app';
import { PosLabel } from '../pos-label/pos-label';
import { PosResource } from '../pos-resource/pos-resource';
import { Thing } from '@pod-os/core';
import { when } from 'jest-when';

describe('pos-html-tool', () => {
  it('respects the resource event and renders inserted pos-label', async () => {
    const os = mockPodOS();
    when(os.store.get)
      .calledWith('https://resource.test')
      .mockReturnValue({
        label: () => 'Test Resource',
      } as unknown as Thing);
    const page = await newSpecPage({
      components: [PosApp, PosResource, PosLabel, PosHtmlTool],
      html: `<pos-app>
            <pos-resource uri="https://resource.test" lazy="true">
              <pos-html-tool/>
            </pos-resource>
        </pos-app>`,
    });
    const el = page.root?.querySelector('pos-html-tool') as unknown as PosHtmlTool;
    el.fragment = '<pos-label></pos-label>';
    await page.waitForChanges();
    const label = page.root?.querySelector('pos-label');
    expect(label).toEqualHtml(`
      <pos-label>
        <mock:shadow-root>
          Test Resource
        </mock:shadow-root>
      </pos-label>
  `);
  });
});
