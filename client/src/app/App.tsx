import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../shared/providers/AuthProvider';
import { ProtectedRoute } from '../shared/utils/ProtectedRoute';
import { HomePage } from '../pages/home/HomePage';
import { APP_ROUTES } from '@/shared/routes';
import { LoginPage } from '@/pages/login/LoginPage';
import { RegisterPage } from '@/pages/register/RegisterPage';
import { AppLayout } from './AppLayout';
import { LK } from '@/pages/lk/LK';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />

          <Route path={APP_ROUTES.HOME} element={<AppLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path={APP_ROUTES.LK}
              element={
                <ProtectedRoute>
                  <LK />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
