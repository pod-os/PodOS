jest.mock('../store/session');

import session from '../store/session';

export function mockSessionStore() {
  const mock = {
    sessionChanged: undefined as (e?: any) => void,
  };
  // @ts-ignore
  session.onChange = (prop, callback) => {
    if (prop === 'isLoggedIn') {
      mock.sessionChanged = callback;
    }
  };
  return mock;
}
