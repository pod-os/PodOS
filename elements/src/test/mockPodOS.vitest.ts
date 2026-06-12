import { Mock, vi } from 'vitest';
import { PodOS } from '@pod-os/core';
import { when } from 'vitest-when';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { createPodOS } from '../pod-os';
import { usePodOS } from '../components/events/usePodOS';

vi.mock('../pod-os', () => ({
  createPodOS: vi.fn(),
}));

vi.mock('../authentication', () => ({
  BrowserSession: vi.fn().mockReturnValue({
    onSessionRestore: () => {},
    handleIncomingRedirect: vi.fn(),
  }),
}));

vi.mock('../components/events/usePodOS');

const alice = {
  webId: 'https://pod.example/alice#me',
  name: 'Alice',
  picture: 'https://pod.example/alice/me.jpg',
};

export function mockPodOS(): PodOS {
  const sessionInfo$ = new BehaviorSubject({ isLoggedIn: false, webId: '' });
  const fileFetcher = {
    fetchFile: vi.fn(),
    putFile: vi.fn(),
    createNewFile: vi.fn().mockResolvedValue(undefined),
    createNewFolder: vi.fn().mockResolvedValue(undefined),
  };
  const os = {
    fetch: vi.fn(),
    files: () => fileFetcher,
    store: {
      get: vi.fn(),
      observeFindMembers: vi.fn(),
    },
    observeSession: () => sessionInfo$,
    login: vi.fn().mockImplementation(() => {
      sessionInfo$.next({ isLoggedIn: true, webId: alice.webId });
    }),
    proposeUriForNewThing: vi.fn(),
    addNewThing: vi.fn().mockResolvedValue(undefined),
    fetchProfile: vi.fn(),
    buildSearchIndex: vi.fn(),
    proposeAppsFor: vi.fn().mockReturnValue([]),
    addRelation: vi.fn(),
  };
  const observedLabel$ = new ReplaySubject<string>();
  observedLabel$.next(alice.name);
  when(os.store.get)
    .calledWith(alice.webId)
    .thenReturn({
      label: () => alice.name,
      observeLabel: () => observedLabel$,
      picture: () => ({
        url: alice.picture,
      }),
    });
  (createPodOS as Mock).mockReturnValue(os);
  (usePodOS as Mock).mockResolvedValue(os);

  return os as unknown as PodOS;
}
