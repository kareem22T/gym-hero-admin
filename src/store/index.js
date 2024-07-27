// store/index.js
import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const authModule = {
  namespaced: true,
  state: {
    access_token: '',
    isAuthentication: false,
  },
  mutations: {
    setCredentials(state, credentials) {
      state.access_token = credentials.access_token;
      state.isAuthentication = true;
    },
    clearCredentials(state) {
      state.access_token = '';
      state.isAuthentication = false;
    },
  },
};

const store = createStore({
  modules: {
    auth: authModule,
  },
  plugins: [createPersistedState({
    paths: ['auth'] // Specify which parts of the state you want to persist
  })],
});

export default store;
