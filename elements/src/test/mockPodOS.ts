jest.mock('../pod-os', () => ({
  createPodOS: jest.fn(),
}));

import { when } from 'jest-when';
import { createPodOS } from '../pod-os';

const alice = {
  webId: 'https://pod.example/alice#me',
  name: 'Alice',
  picture: 'https://pod.example/alice/me.jpg',
};

export function mockPodOS() {
  let trackSessionCallback = (_: any) => null;
  const os = {
    fetch: jest.fn(),
    fetchFile: jest.fn(),
    store: {
      get: jest.fn(),
    },
    trackSession: jest.fn().mockImplementation(cb => (trackSessionCallback = cb)),
    handleIncomingRedirect: jest.fn(),
    login: jest.fn().mockImplementation(() => {
      trackSessionCallback({ isLoggedIn: true, webId: alice.webId });
    }),
    proposeUriForNewThing: jest.fn(),
    addNewThing: jest.fn().mockResolvedValue(void null),
    fetchProfile: jest.fn(),
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
  return os;
}
