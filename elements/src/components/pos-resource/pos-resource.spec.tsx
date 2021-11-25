import { newSpecPage } from '@stencil/core/testing';
import { mockPodOS } from '../../test/mockPodOS';
import { PosResource } from './pos-resource';
import { when } from 'jest-when';

describe('pos-resource', () => {
  it('renders progress bar initially', async () => {
    const page = await newSpecPage({
      components: [PosResource],
      html: `<pos-resource uri="https://resource.test/" />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-resource uri="https://resource.test/">
        <mock:shadow-root>
          <ion-progress-bar type="indeterminate"></ion-progress-bar>
        </mock:shadow-root>
      </pos-resource>
  `);
  });

  it('renders progress bar while fetching', async () => {
    const page = await newSpecPage({
      components: [PosResource],
      html: `<pos-resource uri="https://resource.test/" />`,
    });
    const os = mockPodOS();
    when(os.fetch)
      .calledWith('https://resource.test/')
      .mockReturnValue(new Promise(() => null));
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-resource uri="https://resource.test/">
        <mock:shadow-root>
          <ion-progress-bar type="indeterminate"></ion-progress-bar>
        </mock:shadow-root>
      </pos-resource>
  `);
  });

  it('renders slot after loading', async () => {
    const page = await newSpecPage({
      components: [PosResource],
      html: `<pos-resource uri="https://resource.test/" />`,
    });
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test/').mockResolvedValue();
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-resource uri="https://resource.test/">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pos-resource>
  `);
  });

  it('renders error when fetch failed', async () => {
    const page = await newSpecPage({
      components: [PosResource],
      html: `<pos-resource uri="https://resource.test/" />`,
    });
    const os = mockPodOS();
    when(os.fetch).calledWith('https://resource.test/').mockRejectedValue(new Error('not found'));
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-resource uri="https://resource.test/">
        <mock:shadow-root>
          <div>not found</div>
        </mock:shadow-root>
      </pos-resource>
  `);
  });
});
