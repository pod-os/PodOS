jest.mock('../pod-os');

import { createPodOS } from '../pod-os';
import { when } from 'jest-when';

const alice = {
  webId: 'https://pod.example/alice#me',
  name: 'Alice',
};

export function mockPodOS() {
  let trackSessionCallback = (_: any) => null;
  const os = {
    fetch: jest.fn(),
    store: {
      get: jest.fn(),
    },
    trackSession: jest.fn().mockImplementation(cb => (trackSessionCallback = cb)),
    handleIncomingRedirect: jest.fn(),
    login: jest.fn().mockImplementation(() => {
      trackSessionCallback({ isLoggedIn: true, webId: alice.webId });
    }),
  };
  when(os.store.get)
    .calledWith(alice.webId)
    .mockReturnValue({
      label: () => alice.name,
    });
  (createPodOS as jest.Mock).mockReturnValue(os);
  return os;
}
