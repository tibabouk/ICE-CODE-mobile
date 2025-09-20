import { API_BASE_URL } from '../config';
import { getToken, clearToken } from './storage';

export type HttpOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  noAuth?: boolean;
  signal?: AbortSignal;
};

export class HttpUnauthorizedError extends Error {
  constructor(msg = 'Unauthorized') {
    super(msg);
    this.name = 'HttpUnauthorizedError';
  }
}

export async function http<T = any>(path: string, options: HttpOptions = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers ?? {}),
  };

  if (!options.noAuth) {
    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const resp = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  const isJson = resp.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await resp.json().catch(() => ({})) : ({} as any);

  if (resp.status === 401) {
    // Propage une erreur spécifique, le consumer déclenchera logout
    await clearToken().catch(() => {});
    throw new HttpUnauthorizedError();
  }

  if (!resp.ok) {
    const message = data?.error || data?.message || `HTTP ${resp.status}`;
    const error: any = new Error(message);
    error.status = resp.status;
    error.data = data;
    throw error;
  }

  return data as T;
}