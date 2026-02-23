import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import * as authApi from '../api/auth';
import type { User } from '../types';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  function setToken(newToken: string | null) {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  }

  async function login(email: string, password: string) {
    const result = await authApi.login(email, password);
    setToken(result.token);
    user.value = result.user;
  }

  async function register(email: string, password: string) {
    const result = await authApi.register(email, password);
    setToken(result.token);
    user.value = result.user;
  }

  function logout() {
    setToken(null);
    user.value = null;
    const router = useRouter();
    router.push('/login');
  }

  return { token, user, isAuthenticated, login, register, logout };
});
