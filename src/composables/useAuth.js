// composables/useAuth.js
import { computed } from 'vue';
import { useStore } from 'vuex';

export default function useAuth() {
  const store = useStore();
  const access_token = computed(() => store.state.auth.access_token);
  const isAuthentication = computed(() => store.state.auth.isAuthentication);

  const login = (credentials) => {
    store.commit('auth/setCredentials', credentials);
  };

  const logout = () => {
    store.commit('auth/clearCredentials');
  };

  return {
    access_token,
    isAuthentication,
    login,
    logout,
  };
}
