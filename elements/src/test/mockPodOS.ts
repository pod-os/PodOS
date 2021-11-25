jest.mock('../pod-os');

import { createPodOS } from '../pod-os';

export function mockPodOS() {
  const os = {
    fetch: jest.fn(),
    store: {
      get: jest.fn(),
    },
    trackSession: jest.fn(),
    handleIncomingRedirect: jest.fn(),
  };
  (createPodOS as jest.Mock).mockReturnValue(os);
  return os;
}
