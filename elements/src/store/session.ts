import { createStore } from '@stencil/store';

const store = createStore({
  isLoggedIn: false,
  webId: '',
});

export default store;
