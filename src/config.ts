// Sidecar API config
const g: any = (typeof globalThis !== 'undefined' ? globalThis : {}) as any;
export const API_BASE_URL =
  // Optionnel: override via global (ex: injecté dans App avant build si besoin)
  g.__ICE_SIDE_CAR_BASE_URL__ ??
  'http://localhost:3001';

export const TOKEN_STORAGE_KEY = 'auth/token';