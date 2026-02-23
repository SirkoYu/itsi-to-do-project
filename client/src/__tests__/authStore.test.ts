import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../stores/authStore';
import * as authApi from '../api/auth';

vi.mock('../api/auth');
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('is not authenticated by default', () => {
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);
  });

  it('sets token and user after login', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      token: 'test-token',
      user: { id: 1, email: 'user@example.com' },
    });

    const store = useAuthStore();
    await store.login('user@example.com', 'password');

    expect(store.isAuthenticated).toBe(true);
    expect(store.user?.email).toBe('user@example.com');
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  it('clears state on logout', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      token: 'test-token',
      user: { id: 1, email: 'user@example.com' },
    });

    const store = useAuthStore();
    await store.login('user@example.com', 'password');
    store.logout();

    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });
});
