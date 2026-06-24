import { vi } from 'vitest';
import { describe, expect, h, it, render } from '@stencil/vitest';
import { ReplaySubject, Subject } from 'rxjs';
import { Thing } from '@pod-os/core';
import { server, turtleFile } from '../../test/msw';
import { mockPodOS } from '../../test/mockPodOS.vitest';
import { when } from 'vitest-when';

describe('pos-list', () => {
  it('children render label for loaded resources (without fetching)', async () => {
    // given a resource with a video relation pointing to two video resources
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
    );

    // when a page lists all video relations of that resource, rendering a pos-label for each
    const page = await render(
      <pos-app>
        <pos-resource uri="https://resource.test">
          <pos-list rel="http://schema.org/video">
            <template>
              <pos-label />
            </template>
          </pos-list>
        </pos-resource>
      </pos-app>,
    );
    await page.waitForChanges();

    // then the fallback labels of both videos show up
    const video1 = page.root.querySelector('pos-resource[about="https://video.test/video-1"]');
    const video2 = page.root.querySelector('pos-resource[about="https://video.test/video-2"]');
    expect(video1).toHaveTextContent('video-1');
    expect(video2).toHaveTextContent('video-2');
    expect(globalThis.fetch).toHaveBeenCalledOnce();
  });

  it('children render label for all things of the given type, reactively', async () => {
    // we mock PodOS in the test to be able to simulate changes in the observed members over time
    const os = mockPodOS();
    const listener = (event: any) => {
      event.detail(os);
    };
    document.addEventListener('pod-os:init', listener);
    const observedMembers$ = new Subject<string[]>();
    when(os.store.observeFindMembers).calledWith('http://schema.org/Video').thenReturn(observedMembers$);
    const observedLabel1$ = new ReplaySubject<string>();
    observedLabel1$.next('Video 1');
    when(os.store.get)
      .calledWith('https://video.test/video-1')
      .thenReturn({ uri: 'https://video.test/video-1', observeLabel: () => observedLabel1$ } as unknown as Thing);
    const observedLabel2$ = new ReplaySubject<string>();
    observedLabel2$.next('Video 2');
    when(os.store.get)
      .calledWith('https://video.test/video-2')
      .thenReturn({ uri: 'https://video.test/video-2', observeLabel: () => observedLabel2$ } as unknown as Thing);

    const page = await render(
      <pos-list if-typeof="http://schema.org/Video">
        <template>
          <pos-label />
        </template>
      </pos-list>,
    );

    let resources = page.root ? page.root.querySelectorAll('pos-list pos-resource') : [];
    expect(resources).toHaveLength(0);

    observedMembers$.next(['https://video.test/video-1']);
    await page.waitForChanges();
    resources = page.root ? page.root.querySelectorAll('pos-list pos-resource') : [];
    expect(resources).toHaveLength(1);
    expect(resources[0]).toEqualAttribute('about', 'https://video.test/video-1');
    expect(resources[0]).toHaveTextContent('Video 1');

    observedMembers$.next(['https://video.test/video-1', 'https://video.test/video-2']);
    await page.waitForChanges();
    resources = page.root ? page.root.querySelectorAll('pos-list pos-resource') : [];
    expect(resources).toHaveLength(2);
    expect(resources[0]).toEqualAttribute('about', 'https://video.test/video-1');
    expect(resources[0]).toHaveTextContent('Video 1');
    expect(resources[1]).toEqualAttribute('about', 'https://video.test/video-2');
    expect(resources[1]).toHaveTextContent('Video 2');

    observedMembers$.next(['https://video.test/video-2']);
    await page.waitForChanges();
    resources = page.root ? page.root.querySelectorAll('pos-list pos-resource') : [];
    expect(resources).toHaveLength(1);
    expect(resources[0]).toEqualAttribute('about', 'https://video.test/video-2');
    expect(resources[0]).toHaveTextContent('Video 2');
    document.removeEventListener('pod-os:init', listener);
  });
});
