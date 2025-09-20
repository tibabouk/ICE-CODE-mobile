/* Minimal storage with AsyncStorage fallback for RN.
 * In PROD, prefer @react-native-async-storage/async-storage or secure storage.
 */
import { TOKEN_STORAGE_KEY } from '../config';

type Adapter = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

let adapter: Adapter | null = null;
try {
  // Will throw if package not installed; that's fine for DEV fallback
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AS = require('@react-native-async-storage/async-storage').default;
  if (AS && typeof AS.getItem === 'function') {
    adapter = AS;
  }
} catch (_e) {
  adapter = null;
}

let inMemory: Record<string, string> = {};

const memAdapter: Adapter = {
  async getItem(key) {
    return key in inMemory ? inMemory[key] : null;
  },
  async setItem(key, value) {
    inMemory[key] = value;
  },
  async removeItem(key) {
    delete inMemory[key];
  },
};

const useAdapter: Adapter = adapter ?? memAdapter;

export async function getToken(): Promise<string | null> {
  return useAdapter.getItem(TOKEN_STORAGE_KEY);
}

export async function setToken(token: string): Promise<void> {
  await useAdapter.setItem(TOKEN_STORAGE_KEY, token);
}

export async function clearToken(): Promise<void> {
  await useAdapter.removeItem(TOKEN_STORAGE_KEY);
}