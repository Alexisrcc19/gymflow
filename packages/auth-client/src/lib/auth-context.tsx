'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { AuthApi, AuthApiError } from './auth-api';
import type { AuthStatus, AuthUser, UserRole } from './auth-types';

export interface AuthContextValue {
  authenticatedFetch: (path: string, init?: RequestInit) => Promise<Response>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  status: AuthStatus;
  user: AuthUser | null;
}

export interface AuthProviderProps {
  allowedRoles: readonly UserRole[];
  apiUrl: string;
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  allowedRoles,
  apiUrl,
  children,
}: AuthProviderProps) {
  const api = useMemo(() => new AuthApi(apiUrl), [apiUrl]);
  const allowedRolesKey = allowedRoles.join('|');
  const accessToken = useRef<string | null>(null);
  const refreshInFlight = useRef<Promise<string | null> | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  const clearSession = useCallback(() => {
    accessToken.current = null;
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const acceptSession = useCallback(
    (session: { accessToken: string; user: AuthUser }) => {
      const roleAllowed = allowedRolesKey
        .split('|')
        .includes(session.user.role);
      if (!roleAllowed) {
        clearSession();
        throw new AuthApiError(
          'Esta cuenta no tiene acceso a este portal',
          403,
        );
      }

      accessToken.current = session.accessToken;
      setUser(session.user);
      setStatus('authenticated');
      return session.accessToken;
    },
    [allowedRolesKey, clearSession],
  );

  const refresh = useCallback((): Promise<string | null> => {
    if (refreshInFlight.current) return refreshInFlight.current;

    refreshInFlight.current = api
      .refresh()
      .then(acceptSession)
      .catch(() => {
        clearSession();
        return null;
      })
      .finally(() => {
        refreshInFlight.current = null;
      });

    return refreshInFlight.current;
  }, [acceptSession, api, clearSession]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        await acceptSession(await api.login(email, password));
      } catch (error) {
        clearSession();
        throw error;
      }
    },
    [acceptSession, api, clearSession],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await api.logout();
    } finally {
      clearSession();
    }
  }, [api, clearSession]);

  const authenticatedFetch = useCallback(
    async (path: string, init?: RequestInit): Promise<Response> => {
      let token = accessToken.current ?? (await refresh());
      if (!token) throw new AuthApiError('Debes iniciar sesión', 401);

      let response = await api.fetch(path, token, init);
      if (response.status !== 401) return response;

      accessToken.current = null;
      token = await refresh();
      if (!token) return response;
      response = await api.fetch(path, token, init);
      return response;
    },
    [api, refresh],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ authenticatedFetch, login, logout, status, user }),
    [authenticatedFetch, login, logout, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
