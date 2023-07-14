import { WebIdProfile } from '@pod-os/core';
import { createStore } from '@stencil/store';

const store = createStore({
  isLoggedIn: false,
  webId: '',
  profile: null as WebIdProfile
});

export default store;
