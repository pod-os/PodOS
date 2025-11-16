import { PodOS } from '@pod-os/core';

jest.mock('../pod-os', () => ({
  createPodOS: jest.fn(),
}));

jest.mock('../authentication', () => ({
  BrowserSession: jest.fn().mockReturnValue({
    onSessionRestore: () => {},
    handleIncomingRedirect: jest.fn(),
  }),
}));

import { when } from 'jest-when';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { createPodOS } from '../pod-os';

const alice = {
  webId: 'https://pod.example/alice#me',
  name: 'Alice',
  picture: 'https://pod.example/alice/me.jpg',
};

export function mockPodOS(): PodOS {
  const sessionInfo$ = new BehaviorSubject({ isLoggedIn: false, webId: '' });
  const fileFetcher = {
    fetchFile: jest.fn(),
    putFile: jest.fn(),
    createNewFile: jest.fn().mockResolvedValue(void null),
    createNewFolder: jest.fn().mockResolvedValue(void null),
  };
  const os = {
    fetch: jest.fn(),
    files: () => fileFetcher,
    store: {
      get: jest.fn(),
      observeFindMembers: jest.fn(),
    },
    observeSession: () => sessionInfo$,
    login: jest.fn().mockImplementation(() => {
      sessionInfo$.next({ isLoggedIn: true, webId: alice.webId });
    }),
    proposeUriForNewThing: jest.fn(),
    addNewThing: jest.fn().mockResolvedValue(void null),
    fetchProfile: jest.fn(),
    buildSearchIndex: jest.fn(),
  };
  when(os.store.get)
    .calledWith(alice.webId)
    .mockReturnValue({
      label: () => alice.name,
      picture: () => ({
        url: alice.picture,
      }),
    });
  (createPodOS as jest.Mock).mockReturnValue(os);
  return os as unknown as PodOS;
}
