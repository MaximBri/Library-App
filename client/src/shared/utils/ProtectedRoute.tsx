import { type FC, type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { APP_ROUTES } from '../routes';
import { Loader } from '../components/loader/Loader';

export const ProtectedRoute: FC<{
  children: JSX.Element;
  allowedRole?: string;
}> = ({ children, allowedRole }) => {
  const { isAuthorized, user } = useAuth();
  if (isAuthorized === null) return <Loader />;
  if (!isAuthorized) return <Navigate to={APP_ROUTES.LOGIN} replace />;
  if (allowedRole && user?.role === allowedRole) {
    return children;
  }
  if (!allowedRole) {
    return children;
  }
  return <Navigate to={APP_ROUTES.HOME} replace />;
};
