import { type FC, type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute: FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthorized } = useAuth();
  // добавить спиннер
  if (isAuthorized === null) return <div>Загрузка...</div>;
  if (!isAuthorized) return <Navigate to="/login" replace />;
  return children;
};
