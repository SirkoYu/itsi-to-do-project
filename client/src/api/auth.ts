import { api } from './index';
import type { AuthResponse } from '../types';

export async function register(email: string, password: string): Promise<AuthResponse['data']> {
  const { data } = await api.post<AuthResponse>('/auth/register', { email, password });
  return data.data;
}

export async function login(email: string, password: string): Promise<AuthResponse['data']> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data.data;
}
