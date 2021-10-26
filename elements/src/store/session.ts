import { createStore } from '@stencil/store';
import { getIdpUrl } from './getIdpUrl';

import { PodOS } from '../window';

const { state } = createStore({
  login: idp => PodOS.login(idp),
  logout: () => PodOS.logout(),
  getIdpUrl,
  isLoggedIn: false,
  webId: '',
  track: () => {
    PodOS.handleIncomingRedirect();
    PodOS.trackSession(sessionInfo => {
      state.isLoggedIn = sessionInfo.isLoggedIn;
      state.webId = sessionInfo.webId;
    });
  },
});

export default state;
