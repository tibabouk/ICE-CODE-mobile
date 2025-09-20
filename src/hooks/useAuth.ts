import { useCallback, useEffect, useState } from 'react';
import { getToken as readToken, setToken as writeToken, clearToken } from '../services/storage';
import { exchangeCode, sendMagicLink } from '../services/auth';

type State = {
  token: string | null;
  loading: boolean;
  error: string | null;
};

export function useAuth() {
  const [state, setState] = useState<State>({ token: null, loading: true, error: null });
  const [phase, setPhase] = useState<'login' | 'verify' | 'ready'>('login');

  useEffect(() => {
    (async () => {
      try {
        const t = await readToken();
        setState(s => ({ ...s, token: t, loading: false }));
        setPhase(t ? 'ready' : 'login');
      } catch (e: any) {
        setState({ token: null, loading: false, error: e?.message || 'Auth init error' });
        setPhase('login');
      }
    })();
  }, []);

  const requestMagicLink = useCallback(async (email: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      await sendMagicLink(email);
      setState(s => ({ ...s, loading: false }));
      setPhase('verify');
      return { ok: true };
    } catch (e: any) {
      setState(s => ({ ...s, loading: false, error: e?.message || 'Failed to send magic link' }));
      return { ok: false, error: e?.message };
    }
  }, []);

  const verifyCode = useCallback(async (code: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const { token } = await exchangeCode(code);
      await writeToken(token);
      setState({ token, loading: false, error: null });
      setPhase('ready');
      return { ok: true };
    } catch (e: any) {
      setState(s => ({ ...s, loading: false, error: e?.message || 'Invalid code' }));
      return { ok: false, error: e?.message };
    }
  }, []);

  const logout = useCallback(async () => {
    await clearToken();
    setState({ token: null, loading: false, error: null });
    setPhase('login');
  }, []);

  return {
    token: state.token,
    loading: state.loading,
    error: state.error,
    phase,
    requestMagicLink,
    verifyCode,
    logout,
  };
}