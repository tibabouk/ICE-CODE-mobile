import { http } from './http';
import { setToken as saveToken, clearToken } from './storage';

export async function sendMagicLink(email: string): Promise<{ ok: boolean }> {
  return http('/api/v1/auth/magic-link', {
    method: 'POST',
    noAuth: true,
    body: { email },
  });
}

export async function exchangeCode(code: string): Promise<{ token: string }> {
  const res = await http<{ token: string }>('/api/v1/auth/exchange', {
    method: 'POST',
    noAuth: true,
    body: { code },
  });
  return res;
}

export async function setAuthToken(token: string): Promise<void> {
  await saveToken(token);
}

export async function logout(): Promise<void> {
  await clearToken();
}