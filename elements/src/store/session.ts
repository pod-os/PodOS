import { createStore } from '@stencil/store';
import { getIdpUrl } from './getIdpUrl';

const { state } = createStore({
  getIdpUrl,
  isLoggedIn: false,
  webId: '',
});

export default state;
