jest.mock('../../store/session');

import { newSpecPage } from '@stencil/core/testing';
import { Blob } from 'buffer';
import { mockPodOS } from '../../test/mockPodOS';
import { PosImage } from './pos-image';
import { when } from 'jest-when';

import session from '../../store/session';

describe('pos-image', () => {
  beforeEach(() => {
    jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake-png-data');
  });

  it('renders loading indicator initially', async () => {
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" />`,
    });
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/image.png">
        <mock:shadow-root>
          <ion-skeleton-text animated=""></ion-skeleton-text>
        </mock:shadow-root>
      </pos-image>
  `);
  });

  it('renders loading indicator while fetching', async () => {
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" />`,
    });
    const os = mockPodOS();
    when(os.fetchBlob)
      .calledWith('https://pod.test/image.png')
      .mockReturnValue(new Promise(() => null));
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/image.png">
        <mock:shadow-root>
          <ion-skeleton-text animated=""></ion-skeleton-text>
        </mock:shadow-root>
      </pos-image>
  `);
  });

  it('renders img after loading', async () => {
    const pngBlob = new Blob(['1'], {
      type: 'image/png',
    });
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" />`,
    });
    const os = mockPodOS();
    when(os.fetchBlob).calledWith('https://pod.test/image.png').mockResolvedValue(pngBlob);
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(URL.createObjectURL).toHaveBeenCalledWith(pngBlob);
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/image.png">
        <mock:shadow-root>
          <img src="blob:fake-png-data">
        </mock:shadow-root>
      </pos-image>
  `);
  });

  it('renders error when fetch failed', async () => {
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" />`,
    });
    const os = mockPodOS();
    when(os.fetchBlob).calledWith('https://pod.test/image.png').mockRejectedValue(new Error('network error'));
    await page.rootInstance.setOs(os);
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/image.png">
        <mock:shadow-root>
          <div class="error">
            network error
          </div>
        </mock:shadow-root>
      </pos-image>
  `);
  });

  it('updates and loads resource when src changes', async () => {
    const pngBlob = new Blob(['1'], {
      type: 'image/png',
    });
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" />`,
    });
    const os = mockPodOS();
    when(os.fetchBlob).calledWith('https://pod.test/image.png').mockResolvedValue(pngBlob);
    when(os.fetchBlob)
      .calledWith('https://pod.test/other.png')
      .mockReturnValue(new Promise(() => null));
    await page.rootInstance.setOs(os);
    page.root.setAttribute('src', 'https://pod.test/other.png');
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/other.png">
        <mock:shadow-root>
          <ion-skeleton-text animated=""></ion-skeleton-text>
        </mock:shadow-root>
      </pos-image>
  `);
  });

  it('re-fetches resource when session state changes', async () => {
    const pngBlob = new Blob(['1'], {
      type: 'image/png',
    });
    let sessionChanged;
    // @ts-ignore
    session.onChange = (prop, callback) => {
      if (prop === 'isLoggedIn') {
        sessionChanged = callback;
      }
    };
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" />`,
    });
    const os = mockPodOS();
    when(os.fetchBlob).calledWith('https://pod.test/image.png').mockResolvedValueOnce(pngBlob);
    when(os.fetchBlob)
      .calledWith('https://pod.test/image.png')
      .mockReturnValueOnce(new Promise(() => null));
    await page.rootInstance.setOs(os);
    expect(sessionChanged).toBeDefined();
    sessionChanged();
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/image.png">
        <mock:shadow-root>
          <ion-skeleton-text animated=""></ion-skeleton-text>
        </mock:shadow-root>
      </pos-image>
  `);
  });

  it('removes error message after successful loading', async () => {
    const pngBlob = new Blob(['1'], {
      type: 'image/png',
    });
    let sessionChanged;
    // @ts-ignore
    session.onChange = (prop, callback) => {
      if (prop === 'isLoggedIn') {
        sessionChanged = callback;
      }
    };
    const page = await newSpecPage({
      components: [PosImage],
      html: `<pos-image src="https://pod.test/image.png" />`,
    });
    const os = mockPodOS();
    when(os.fetchBlob).calledWith('https://pod.test/image.png').mockRejectedValueOnce(new Error('unauthorized'));
    when(os.fetchBlob).calledWith('https://pod.test/image.png').mockResolvedValueOnce(pngBlob);
    await page.rootInstance.setOs(os);
    expect(sessionChanged).toBeDefined();
    sessionChanged();
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pos-image src="https://pod.test/image.png">
        <mock:shadow-root>
          <img src="blob:fake-png-data">
        </mock:shadow-root>
      </pos-image>
  `);
  });
});
