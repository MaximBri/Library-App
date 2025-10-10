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
import { useQueryClient } from '@tanstack/react-query';
import { useGetMyLibrary } from '../api/hooks/libraries/useGetMyLibrary';
import type { LibraryModel } from './types';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [myLibrary, setMyLibrary] = useState<LibraryModel | null>(null);

  const {
    data: user,
    refetch,
    isLoading,
    isError,
  } = useGetUserData(isAuthorized === null);

  const { data: myLibraryData } = useGetMyLibrary(myLibrary === null);

  useEffect(() => {
    const isFirstLoad = user === undefined && isAuthorized === null;
    setIsAuthorized(isFirstLoad ? null : Boolean(user));
  }, [user, isAuthorized]);

  useEffect(() => {
    if (isAuthorized && myLibrary === null && myLibraryData) {
      setMyLibrary(myLibraryData);
    }
  }, [myLibraryData, myLibrary, isAuthorized]);

  useEffect(() => {
    console.log('Состояние авторизованности: ', isAuthorized);
  }, [isAuthorized]);

  useEffect(() => {
    if (isError) {
      setIsAuthorized(false);
      queryClient.clear();
    }
  }, [isError, queryClient]);

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
    await api.post('/api/auth/logout', {}, { withCredentials: true });
    queryClient.clear();
    setIsAuthorized(false)
    setMyLibrary(null)
  }, [queryClient]);

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
    myLibrary
  };

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};
