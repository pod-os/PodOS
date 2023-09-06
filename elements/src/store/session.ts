import { WebIdProfile } from '@pod-os/core';
import { createStore } from '@stencil/store';
import { getIdpUrl } from './getIdpUrl';

const store = createStore({
  getIdpUrl,
  isLoggedIn: false,
  webId: '',
  profile: null as WebIdProfile
});

export default store;
