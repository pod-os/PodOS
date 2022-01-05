import { createStore } from '@stencil/store';
import { getIdpUrl } from './getIdpUrl';

const store = createStore({
  getIdpUrl,
  isLoggedIn: false,
  webId: '',
});

export default store;
