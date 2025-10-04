import {
  useCallback,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from 'react';
import api from '../api/axios';
import { AuthContext, type AuthContextValue } from '../hooks/useAuth';
import { useGetUserData } from '../api/hooks/user/useGetUserData';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: user, refetch, isLoading } = useGetUserData();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAuthorized(Boolean(user));
  }, [user]);

  useEffect(() => {
    console.log('Состояние авторизованности: ', isAuthorized);
  }, [isAuthorized]);

  const login = async (email: string, password: string) => {
    await api.post(
      '/api/auth/login',
      { email, password },
      { withCredentials: true }
    );
    refetch();
  };

  const register = useCallback(
    async (email: string, password: string) => {
      await api.post('/api/auth/register', { email, password });
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      // await api.post('/api/auth/logout', {}, { withCredentials: true });
    } finally {
      // setUser(null);
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
    loading: isLoading,
    login,
    register,
    logout,
    refresh,
    isAuthorized,
  };

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};
