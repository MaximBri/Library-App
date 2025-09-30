import {
  useCallback,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from 'react';
import api from '../api/axios';
import {
  AuthContext,
  type AuthContextValue,
  type User,
} from '../hooks/useAuth';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data ?? null);
      setIsAuthorized(true);
    } catch (err) {
      console.error(err);
      setIsAuthorized(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchMe();
    })();
  }, []);

  useEffect(() => {
    console.log('Состояние авторизованности: ', isAuthorized);
  }, [isAuthorized]);

  const login = useCallback(
    async (email: string, password: string) => {
      await api.post(
        '/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      await fetchMe();
    },
    [fetchMe]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      await api.post('/api/auth/register', { email, password });
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout', {}, { withCredentials: true });
    } finally {
      setUser(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    await api.post('/api/auth/refresh', {}, { withCredentials: true });
  }, []);

  useEffect(() => {
    console.log('Данные пользователя: ', user);
  }, [user]);

  const ctx: AuthContextValue = {
    user,
    loading,
    login,
    register,
    logout,
    refresh,
    isAuthorized,
  };

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};
