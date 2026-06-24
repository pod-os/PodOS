import { vi } from 'vitest';
import { describe, expect, h, it, render, beforeEach, afterEach } from '@stencil/vitest';
import { ReplaySubject, Subject } from 'rxjs';
import { PodOS, Thing } from '@pod-os/core';
import { mockPodOS } from '../../test/mockPodOS.vitest';
import { when } from 'vitest-when';

describe('pos-list (with mocked PodOS instance)', () => {
  let listener: (event: any) => void;
  let os: PodOS;
  beforeEach(() => {
    // we mock PodOS in the test to be able to simulate changes
    // in the observed members over time
    os = mockPodOS();
    listener = (event: any) => {
      event.detail(os);
    };
    document.addEventListener('pod-os:init', listener);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.removeEventListener('pod-os:init', listener);
  });

  it('children render label for all things of the given type, reactively', async () => {
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
  });
});
