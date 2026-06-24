import { describe, expect, h, it, render } from '@stencil/vitest';
import { server, turtleFile } from '../../test/msw';
import { vi } from 'vitest';

describe('pos-list', () => {
  // given a resource with a video relation pointing to two video resources
  it('fetches resources if fetch attribute is present', async () => {
    vi.spyOn(globalThis, 'fetch');
    server.use(
      turtleFile(
        'https://resource.test',
        `
          <> <http://schema.org/video>
              <https://video.test/video-1>,
              <https://video.test/video-2> .
        `,
      ),
      turtleFile('https://video.test/video-1', `<> <http://schema.org/name> "Video 1" .`),
      turtleFile('https://video.test/video-2', `<> <http://schema.org/name> "Video 2" .`),
    );

    // when a page lists all video relations of that resource, rendering a pos-label for each
    // and the list has set the fetch attribute
    const page = await render(
      <pos-app>
        <pos-resource uri="https://resource.test">
          <pos-list rel="http://schema.org/video" fetch>
            <template>
              <pos-label />
            </template>
          </pos-list>
        </pos-resource>
      </pos-app>,
    );
    await page.waitForChanges();

    // then the labels of both videos show up
    const video1 = page.root.querySelector('pos-resource[about="https://video.test/video-1"]');
    const video2 = page.root.querySelector('pos-resource[about="https://video.test/video-2"]');
    expect(video1).toHaveTextContent('Video 1');
    expect(video2).toHaveTextContent('Video 2');
    expect(globalThis.fetch).toHaveBeenCalledTimes(3);
  });
});
